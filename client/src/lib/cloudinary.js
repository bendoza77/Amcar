/**
 * cloudinary.js — free image hosting for mechanic photos.
 *
 * Why: the website and the mobile app are separate backends that share one
 * database, so images must live in ONE place both can read. Cloudinary's free
 * tier (no credit card) hosts the files and returns a full public HTTPS URL; we
 * store that URL in the DB, so whoever uploaded it, both apps can display it.
 *
 * Uses an *unsigned* upload preset so the browser can upload directly — no
 * server and no secret key in the client. Configure in client/.env:
 *   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
 *   VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
 */
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

/**
 * uploadMechanicImage — uploads one image file to Cloudinary and returns its
 * public secure URL (https://res.cloudinary.com/…). Throws on failure.
 */
export async function uploadMechanicImage(file) {
  if (!cloudinaryConfigured) {
    throw new Error("CLOUDINARY_NOT_CONFIGURED");
  }
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);
  fd.append("folder", "mechanics");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: fd,
  });

  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.secure_url) {
    throw new Error(json?.error?.message || "UPLOAD_FAILED");
  }
  return json.secure_url;
}
