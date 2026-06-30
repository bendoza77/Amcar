const jwt = require("jsonwebtoken");

/**
 * adminAuth — verifies a Firebase ID token sent as `Authorization: Bearer <token>`.
 *
 * Verification is done without the Firebase Admin SDK / service account: we
 * validate the token's RS256 signature against Google's public x509 certs and
 * check the audience/issuer match this Firebase project. The signed-in user's
 * email must also be in ADMIN_EMAILS (comma-separated) to count as an admin.
 *
 * Required env: FIREBASE_PROJECT_ID. Recommended: ADMIN_EMAILS.
 */
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

const CERT_URL =
  "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

// Google rotates these certs; cache them until the Cache-Control max-age lapses.
let certCache = { certs: null, expiresAt: 0 };

async function getCerts() {
  if (certCache.certs && Date.now() < certCache.expiresAt) return certCache.certs;

  const res = await fetch(CERT_URL);
  if (!res.ok) throw new Error(`cert fetch failed (${res.status})`);
  const certs = await res.json();

  const cacheControl = res.headers.get("cache-control") || "";
  const maxAge = /max-age=(\d+)/.exec(cacheControl);
  const ttl = maxAge ? parseInt(maxAge[1], 10) * 1000 : 60 * 60 * 1000;
  certCache = { certs, expiresAt: Date.now() + ttl };
  return certs;
}

module.exports = async function adminAuth(req, res, next) {
  if (!PROJECT_ID) {
    return res.status(500).json({ ok: false, error: "FIREBASE_NOT_CONFIGURED" });
  }

  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ ok: false, error: "UNAUTHORIZED" });

  try {
    // Find the signing key id from the token header.
    const decoded = jwt.decode(token, { complete: true });
    const kid = decoded?.header?.kid;
    if (!kid) return res.status(401).json({ ok: false, error: "INVALID_TOKEN" });

    const certs = await getCerts();
    const cert = certs[kid];
    if (!cert) return res.status(401).json({ ok: false, error: "INVALID_TOKEN" });

    const payload = jwt.verify(token, cert, {
      algorithms: ["RS256"],
      audience: PROJECT_ID,
      issuer: `https://securetoken.google.com/${PROJECT_ID}`,
    });

    const email = (payload.email || "").toLowerCase();

    if (ADMIN_EMAILS.length === 0) {
      // No allowlist configured — any authenticated Firebase user passes.
      // Set ADMIN_EMAILS in the environment to restrict to specific admins.
      console.warn("ADMIN_EMAILS is empty — every authenticated user is treated as admin.");
    } else if (!ADMIN_EMAILS.includes(email)) {
      return res.status(403).json({ ok: false, error: "NOT_ADMIN" });
    }

    req.admin = { uid: payload.user_id || payload.sub, email };
    next();
  } catch (err) {
    console.error("adminAuth verify error:", err.message);
    return res.status(401).json({ ok: false, error: "INVALID_TOKEN" });
  }
};
