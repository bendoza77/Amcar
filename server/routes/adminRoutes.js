const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
// Sign with a dedicated secret if provided, else fall back to the password.
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || ADMIN_PASSWORD;
const ADMIN_EMAILS = adminAuth.ADMIN_EMAILS;

// Sessions last a week; the admin just logs in again after that.
const TOKEN_TTL = "7d";

/**
 * POST /api/admin/login — body { email, password }. If the email is on the
 * ADMIN_EMAILS allowlist and the password matches ADMIN_PASSWORD, returns a
 * signed session token the client stores and sends as `Authorization: Bearer`.
 */
router.post("/login", (req, res) => {
  if (!JWT_SECRET || !ADMIN_PASSWORD) {
    return res.status(500).json({ ok: false, error: "ADMIN_NOT_CONFIGURED" });
  }

  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");

  if (!ADMIN_EMAILS.includes(email)) {
    return res.status(403).json({ ok: false, error: "NOT_ADMIN" });
  }
  if (password !== ADMIN_PASSWORD) {
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

module.exports = router;
