const rateLimit = require("express-rate-limit");

/**
 * security.js — rate limiters + input sanitization shared across routes.
 *
 * Limits are per-IP. `standardHeaders` sends RateLimit-* response headers so
 * clients can back off; `legacyHeaders` (X-RateLimit-*) are disabled.
 */

const json429 = { ok: false, error: "TOO_MANY_REQUESTS" };

/** Broad safety net for the whole API — generous enough for normal browsing. */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: true,
  legacyHeaders: false,
  message: json429,
});

/** Brute-force shield for /api/admin/login: 10 attempts / 15 min / IP. */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: json429,
  skipSuccessfulRequests: true, // only failed attempts count against the limit
});

/** Contact form: prevents using our Resend account as an email cannon. */
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: json429,
});

/** Review spam: 10 comments / hour / IP is plenty for a human. */
const commentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: json429,
});

/**
 * sanitizeBody — strips MongoDB operator injection from JSON bodies by
 * removing any key that starts with "$" or contains a ".". Defence-in-depth on
 * top of the controllers' explicit casting (String()/Number()) — a crafted
 * payload like {"email": {"$gt": ""}} can never reach a query. Only req.body
 * is rewritten (req.query is a read-only getter in Express 5).
 */
function stripUnsafeKeys(value) {
  if (Array.isArray(value)) return value.map(stripUnsafeKeys);
  if (value && typeof value === "object") {
    const clean = {};
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith("$") || k.includes(".")) continue;
      clean[k] = stripUnsafeKeys(v);
    }
    return clean;
  }
  return value;
}

function sanitizeBody(req, _res, next) {
  if (req.body && typeof req.body === "object") {
    req.body = stripUnsafeKeys(req.body);
  }
  next();
}

module.exports = { apiLimiter, loginLimiter, contactLimiter, commentLimiter, sanitizeBody };
