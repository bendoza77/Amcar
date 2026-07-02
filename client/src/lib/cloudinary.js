/**
 * cloudinary.js — image hosting for mechanic photos.
 *
 * Why: the website and the mobile app are separate backends that share one
 * database, so images must live in ONE place both can read. Cloudinary hosts
 * the files and returns a full public HTTPS URL; we store that URL in the DB,
 * so whoever uploaded it, both apps can display it.
 *
 * Upload strategy (security): SIGNED uploads are preferred — the admin panel
 * asks our server for a short-lived signature (admin-JWT-gated), so only
 * logged-in admins can upload and no upload credential ships in this bundle.
 * If the server doesn't have Cloudinary API keys configured yet, we fall back
 * to the legacy *unsigned* preset from client/.env:
 *   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
 *   VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
 * Once CLOUDINARY_API_KEY/SECRET are set server-side, the unsigned preset can
 * be deleted from the Cloudinary console entirely.
 */
import { adminApi } from "./api";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

// Remembered per session so we don't re-ask a server that said "not
// configured" before every single photo.
let signedUnavailable = false;

async function postUpload(cloudName, fd) {
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: fd,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.secure_url) {
    throw new Error(json?.error?.message || "UPLOAD_FAILED");
  }
  return json.secure_url;
}

/** Signed path: signature comes from our server, gated by the admin JWT. */
async function uploadSigned(file) {
  const sig = await adminApi.cloudinarySignature();
  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", sig.apiKey);
  fd.append("timestamp", String(sig.timestamp));
  fd.append("folder", sig.folder);
  fd.append("signature", sig.signature);
  return postUpload(sig.cloudName, fd);
}

/** Legacy path: unsigned preset from the client env. */
async function uploadUnsigned(file) {
  if (!cloudinaryConfigured) throw new Error("CLOUDINARY_NOT_CONFIGURED");
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);
  fd.append("folder", "mechanics");
  return postUpload(CLOUD_NAME, fd);
}

/**
 * uploadMechanicImage — uploads one image file to Cloudinary and returns its
 * public secure URL (https://res.cloudinary.com/…). Throws on failure.
 */
export async function uploadMechanicImage(file) {
  if (!signedUnavailable) {
    try {
      return await uploadSigned(file);
    } catch (e) {
      // 501 = server has no Cloudinary keys yet → use the unsigned preset and
      // stop asking. Any other failure (bad signature, network, Cloudinary
      // error) is real and surfaces to the form.
      if (e?.status === 501 || e?.message === "CLOUDINARY_NOT_CONFIGURED") {
        signedUnavailable = true;
      } else {
        throw e;
      }
    }
  }
  return uploadUnsigned(file);
}
