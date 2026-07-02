const path = require("path");
// Load .env from this file's directory so the server works no matter which
// working directory it's launched from (e.g. `node server/app.js` from root).
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const connectDB = require("./config/db");
const contactRoutes = require("./routes/contactRoutes");
const mechanicRoutes = require("./routes/mechanicRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { apiLimiter, sanitizeBody } = require("./middleware/security");

const app = express();

// Connect to MongoDB before serving requests.
connectDB();

// Behind a reverse proxy / CDN (Render, Railway, nginx…) the client IP arrives
// in X-Forwarded-For; trusting the first hop makes rate limiting per-IP work.
app.set("trust proxy", 1);

// Security headers (also hides X-Powered-By). CSP/COEP are for HTML documents;
// this server only returns JSON + images, so they are disabled to avoid
// breaking cross-origin image embedding of /uploads.
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }, // photos load from the web client's origin
  })
);

// Gzip JSON responses — the mechanics list shrinks ~5-10x over the wire.
app.use(compression());

app.use(express.json({ limit: "100kb" }));
// Strip Mongo operator keys ($gt, dotted paths…) from every JSON body.
app.use(sanitizeBody);

// CORS — comma-separated allowlist, e.g. "https://www.amcar.ge,https://amcar.ge".
// Unset (or "*") allows any origin: fine while the API is public read-mostly;
// writes are protected by the admin JWT, not by CORS.
const corsOrigins = (process.env.CORS_ORIGIN || "*").split(",").map((o) => o.trim());
app.use(
  cors({
    origin: corsOrigins.includes("*") ? true : corsOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    maxAge: 86400, // cache preflights for a day
  })
);

// Serve uploaded mechanic photos referenced by relative /uploads/... paths.
// Photos are immutable (unique filenames), so long-lived caching is safe.
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    dotfiles: "deny",
    immutable: true,
    maxAge: "30d",
    index: false,
  })
);

/* ------------------------------------------------------------------ */
/* Routes                                                              */
/* ------------------------------------------------------------------ */
app.use("/api", apiLimiter);
app.use("/api/contact", contactRoutes);
app.use("/api/mechanics", mechanicRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Fallback for unknown API routes.
app.use("/api", (_req, res) => res.status(404).json({ ok: false, error: "NOT_FOUND" }));

// JSON error handler — turns thrown errors (e.g. multer file-size / type
// rejections from the photo upload) into a consistent JSON response instead of
// Express's default HTML error page.
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const isTooLarge = err.code === "LIMIT_FILE_SIZE";
  const isBadType = err.message === "UNSUPPORTED_FILE_TYPE";
  // Malformed / oversized JSON from body-parser is a client error, not ours.
  const isBadBody = err.type === "entity.parse.failed" || err.type === "entity.too.large";
  const status = isTooLarge || isBadType || isBadBody ? 400 : 500;
  const error = isTooLarge
    ? "FILE_TOO_LARGE"
    : isBadType
    ? "UNSUPPORTED_FILE_TYPE"
    : isBadBody
    ? "INVALID_BODY"
    : "SERVER_ERROR";
  if (status === 500) console.error("Unhandled error:", err.message);
  res.status(status).json({ ok: false, error });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
