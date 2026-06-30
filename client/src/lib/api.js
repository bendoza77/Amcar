/**
 * api.js — thin fetch wrapper for the Amcar backend. Base URL comes from
 * VITE_API_URL (e.g. https://api.amcar.ge); empty in dev so Vite's proxy / a
 * same-origin server is used.
 */
const BASE = import.meta.env.VITE_API_URL || "";

/**
 * resolveImage — mechanic images are stored either as full URLs (https://…) or
 * as server-relative upload paths (/uploads/mechanics/…). Relative paths are
 * resolved against the API host so they load from wherever the backend serves
 * uploads. Returns "" for empty values so callers can fall back to a placeholder.
 */
export function resolveImage(src) {
  if (!src) return "";
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  if (src.startsWith("/")) return `${BASE}${src}`;
  return src;
}

import { auth } from "./firebase";

/** Builds the Firebase Bearer auth header from the signed-in admin's ID token. */
async function authHeader() {
  const user = auth.currentUser;
  if (!user) {
    const err = new Error("NOT_AUTHENTICATED");
    err.status = 401;
    throw err;
  }
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

async function request(path, { method = "GET", body, admin = false } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (admin) Object.assign(headers, await authHeader());

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let json = null;
  try {
    json = await res.json();
  } catch {
    /* non-JSON response */
  }

  if (!res.ok || (json && json.ok === false)) {
    const err = new Error((json && json.error) || `Request failed (${res.status})`);
    err.status = res.status;
    err.detail = json && json.detail;
    throw err;
  }
  return json;
}

/* ----------------------------- Mechanics ----------------------------- */

export const mechanicsApi = {
  list: () => request("/api/mechanics").then((r) => r.data),
  nearby: (lat, lng, radius) =>
    request(`/api/mechanics?lat=${lat}&lng=${lng}&radius=${radius || 50000}`).then((r) => r.data),
  get: (id) => request(`/api/mechanics/${id}`).then((r) => r.data),
  create: (payload) => request("/api/mechanics", { method: "POST", body: payload, admin: true }).then((r) => r.data),
  update: (id, payload) =>
    request(`/api/mechanics/${id}`, { method: "PUT", body: payload, admin: true }).then((r) => r.data),
  remove: (id) => request(`/api/mechanics/${id}`, { method: "DELETE", admin: true }),
  addComment: (id, comment) =>
    request(`/api/mechanics/${id}/comments`, { method: "POST", body: comment }).then((r) => r.data),
};

/* ------------------------------- Admin ------------------------------- */

export const adminApi = {
  verify: () => request("/api/admin/verify", { admin: true }),
};
