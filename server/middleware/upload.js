const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Where mechanic photos are written. Served statically at /uploads/mechanics/…
// (see app.js). Created on boot so the first upload doesn't fail.
const UPLOAD_DIR = path.join(__dirname, "..", "uploads", "mechanics");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Images only, matching the admin panel's rule: JPEG / PNG / WebP.
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `mechanic-${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file (matches the panel)
  fileFilter: (_req, file, cb) => {
    if (ALLOWED.has(file.mimetype)) return cb(null, true);
    cb(new Error("UNSUPPORTED_FILE_TYPE"));
  },
});

module.exports = upload;
