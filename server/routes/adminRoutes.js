const crypto = require("crypto");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const { loginLimiter } = require("../middleware/security");

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
// Sign with a dedicated secret if provided, else fall back to the password.
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || ADMIN_PASSWORD;
const ADMIN_EMAILS = adminAuth.ADMIN_EMAILS;

// Sessions last a day — short enough that a stolen token has a small window,
// cheap enough that admins just log in each morning.
const TOKEN_TTL = "24h";

/** Constant-time string comparison — hashes both sides to equal-length buffers
 *  first so timingSafeEqual works on inputs of any length. */
function safeEqual(a, b) {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

/**
 * POST /api/admin/login — body { email, password }. If the email is on the
 * ADMIN_EMAILS allowlist and the password matches ADMIN_PASSWORD, returns a
 * signed session token the client stores and sends as `Authorization: Bearer`.
 *
 * Security: rate-limited (10 failed attempts / 15 min / IP); the password check
 * is constant-time; a wrong email and a wrong password return the *same* error
 * so the response never reveals which addresses are admin accounts.
 */
router.post("/login", loginLimiter, (req, res) => {
  if (!JWT_SECRET || !ADMIN_PASSWORD) {
    return res.status(500).json({ ok: false, error: "ADMIN_NOT_CONFIGURED" });
  }

  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");

  const emailOk = ADMIN_EMAILS.includes(email);
  const passwordOk = safeEqual(password, ADMIN_PASSWORD);
  // Evaluate both checks before responding — identical error + comparable
  // timing whether the email or the password was wrong.
  if (!emailOk || !passwordOk) {
    return res.status(401).json({ ok: false, error: "INVALID_CREDENTIALS" });
  }

  const token = jwt.sign({ email }, JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: TOKEN_TTL,
  });
  res.json({ ok: true, token, email });
});

// Lets the admin panel confirm the stored token is still a valid admin session.
router.get("/verify", adminAuth, (req, res) => res.json({ ok: true, email: req.admin?.email }));

/**
 * POST /api/admin/cloudinary-signature — admin only. Returns a short-lived
 * signature for a direct-to-Cloudinary SIGNED upload, so the browser can
 * upload without an unsigned preset existing at all. Requires
 * CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET in the
 * server env; while they're unset the client falls back to the unsigned
 * preset (see client/src/lib/cloudinary.js).
 *
 * Cloudinary's scheme: sha1 over the alphabetically-sorted upload params
 * ("folder=…&timestamp=…") with the API secret appended. Signatures embed the
 * timestamp and Cloudinary rejects them after ~1 hour.
 */
router.post("/cloudinary-signature", adminAuth, (req, res) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(501).json({ ok: false, error: "CLOUDINARY_NOT_CONFIGURED" });
  }

  const folder = "mechanics";
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = crypto
    .createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  res.json({ ok: true, cloudName, apiKey, timestamp, folder, signature });
});

module.exports = router;
