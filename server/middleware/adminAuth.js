const jwt = require("jsonwebtoken");

/**
 * adminAuth — verifies the admin session token sent as
 * `Authorization: Bearer <token>`.
 *
 * The token is issued by POST /api/admin/login (see adminRoutes) after an
 * email/password check. It is a plain HS256 JWT; we verify the signature and
 * that the email is still on the ADMIN_EMAILS allowlist. No Firebase / external
 * calls involved.
 *
 * The token is signed with ADMIN_JWT_SECRET if set, otherwise with
 * ADMIN_PASSWORD itself — so only ADMIN_EMAILS + ADMIN_PASSWORD are required,
 * and changing the password invalidates every existing session.
 *
 * Required env: ADMIN_PASSWORD. Recommended: ADMIN_EMAILS, ADMIN_JWT_SECRET.
 */
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || process.env.ADMIN_PASSWORD;

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

/**
 * Emergency kill-switch: set ADMIN_SESSIONS_REVOKED_BEFORE to an ISO date
 * (e.g. "2026-07-02T15:00:00Z") and restart — every token issued before that
 * moment is rejected, without rotating the JWT secret or touching passwords.
 * Use it if a token is ever stolen. Unset/invalid → no revocation.
 */
const REVOKED_BEFORE_MS = Date.parse(process.env.ADMIN_SESSIONS_REVOKED_BEFORE || "") || 0;

/** Shared with adminRoutes so the login handler can reuse the same allowlist. */
adminAuth.ADMIN_EMAILS = ADMIN_EMAILS;

function adminAuth(req, res, next) {
  if (!JWT_SECRET) {
    return res.status(500).json({ ok: false, error: "ADMIN_NOT_CONFIGURED" });
  }

  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ ok: false, error: "UNAUTHORIZED" });

  try {
    const payload = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });

    // Reject tokens issued before the revocation cutoff (see REVOKED_BEFORE_MS).
    if (REVOKED_BEFORE_MS && (payload.iat || 0) * 1000 < REVOKED_BEFORE_MS) {
      return res.status(401).json({ ok: false, error: "SESSION_REVOKED" });
    }

    const email = (payload.email || "").toLowerCase();

    // Re-check the allowlist on every request so removing an email from
    // ADMIN_EMAILS revokes access even for already-issued tokens.
    if (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(email)) {
      return res.status(403).json({ ok: false, error: "NOT_ADMIN" });
    }

    req.admin = { email };
    next();
  } catch (err) {
    console.error("adminAuth verify error:", err.message);
    return res.status(401).json({ ok: false, error: "INVALID_TOKEN" });
  }
}

module.exports = adminAuth;
