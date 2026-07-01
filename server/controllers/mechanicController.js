const mongoose = require("mongoose");
const Mechanic = require("../models/Mechanic");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Normalises the body sent by the admin panel into the shape the schema
 * expects. Strips empty strings/rows and clamps `images` to 4 photos.
 */
function buildMechanicPayload(body = {}) {
  const payload = {};

  if (body.name !== undefined) payload.name = body.name;
  if (body.address !== undefined) payload.address = body.address || null;
  if (body.phone !== undefined) payload.phone = body.phone || null;
  if (body.isOpen !== undefined) payload.isOpen = Boolean(body.isOpen);
  if (body.rating !== undefined) payload.rating = Number(body.rating) || 0;
  if (body.reviews !== undefined) payload.reviews = Number(body.reviews) || 0;

  if (Array.isArray(body.images)) {
    payload.images = body.images.map((s) => String(s).trim()).filter(Boolean).slice(0, 4);
  }

  if (Array.isArray(body.services)) {
    payload.services = body.services.map((s) => String(s).trim()).filter(Boolean);
  }

  if (Array.isArray(body.priceList)) {
    payload.priceList = body.priceList
      .filter((p) => p && (p.service || p.price))
      .map((p) => ({ service: String(p.service || "").trim(), price: String(p.price || "").trim() }));
  }

  if (Array.isArray(body.hours)) {
    payload.hours = body.hours
      .filter((h) => h && (h.day || h.time))
      .map((h) => ({ day: String(h.day || "").trim(), time: String(h.time || "").trim() }));
  }

  if (body.coordinate) {
    payload.coordinate = {
      latitude: Number(body.coordinate.latitude),
      longitude: Number(body.coordinate.longitude),
    };
  }

  return payload;
}

/**
 * GET /api/mechanics
 * List mechanics. Optional ?lat=&lng=&radius= (metres) returns only shops near
 * a point, sorted nearest-first, using the 2dsphere index.
 */
async function getMechanics(req, res) {
  try {
    const { lat, lng, radius } = req.query;

    if (lat !== undefined && lng !== undefined) {
      const latitude = Number(lat);
      const longitude = Number(lng);
      const maxDistance = Number(radius) || 50000; // default 50km

      if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        return res.status(400).json({ ok: false, error: "INVALID_COORDS" });
      }

      const mechanics = await Mechanic.find({
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [longitude, latitude] },
            $maxDistance: maxDistance,
          },
        },
      }).lean();

      return res.json({ ok: true, count: mechanics.length, data: mechanics });
    }

    const mechanics = await Mechanic.find().sort({ createdAt: -1 }).lean();
    return res.json({ ok: true, count: mechanics.length, data: mechanics });
  } catch (err) {
    console.error("getMechanics error:", err.message);
    return res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
}

/** GET /api/mechanics/:id — one mechanic with full detail. */
async function getMechanicById(req, res) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ ok: false, error: "INVALID_ID" });

    const mechanic = await Mechanic.findById(id).lean();
    if (!mechanic) return res.status(404).json({ ok: false, error: "NOT_FOUND" });

    return res.json({ ok: true, data: mechanic });
  } catch (err) {
    console.error("getMechanicById error:", err.message);
    return res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
}

/** POST /api/mechanics — admin only. Create a mechanic. */
async function createMechanic(req, res) {
  try {
    const payload = buildMechanicPayload(req.body);

    if (!payload.name) {
      return res.status(400).json({ ok: false, error: "NAME_REQUIRED" });
    }
    if (
      !payload.coordinate ||
      Number.isNaN(payload.coordinate.latitude) ||
      Number.isNaN(payload.coordinate.longitude)
    ) {
      return res.status(400).json({ ok: false, error: "COORDINATE_REQUIRED" });
    }

    const mechanic = await Mechanic.create(payload);
    return res.status(201).json({ ok: true, data: mechanic });
  } catch (err) {
    console.error("createMechanic error:", err.message);
    if (err.name === "ValidationError") {
      return res.status(400).json({ ok: false, error: "VALIDATION_ERROR", detail: err.message });
    }
    return res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
}

/** PUT /api/mechanics/:id — admin only. Update a mechanic. */
async function updateMechanic(req, res) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ ok: false, error: "INVALID_ID" });

    const payload = buildMechanicPayload(req.body);

    const mechanic = await Mechanic.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true, runValidators: true }
    );
    if (!mechanic) return res.status(404).json({ ok: false, error: "NOT_FOUND" });

    return res.json({ ok: true, data: mechanic });
  } catch (err) {
    console.error("updateMechanic error:", err.message);
    if (err.name === "ValidationError") {
      return res.status(400).json({ ok: false, error: "VALIDATION_ERROR", detail: err.message });
    }
    return res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
}

/** DELETE /api/mechanics/:id — admin only. */
async function deleteMechanic(req, res) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ ok: false, error: "INVALID_ID" });

    const mechanic = await Mechanic.findByIdAndDelete(id);
    if (!mechanic) return res.status(404).json({ ok: false, error: "NOT_FOUND" });

    return res.json({ ok: true });
  } catch (err) {
    console.error("deleteMechanic error:", err.message);
    return res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
}

/**
 * POST /api/mechanics/:id/comments — public. Add a review and recompute the
 * mechanic's average rating + review count.
 */
async function addComment(req, res) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ ok: false, error: "INVALID_ID" });

    const { author, rating, text } = req.body || {};
    const numericRating = Number(rating);
    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ ok: false, error: "INVALID_RATING" });
    }

    const mechanic = await Mechanic.findById(id);
    if (!mechanic) return res.status(404).json({ ok: false, error: "NOT_FOUND" });

    mechanic.comments.push({
      author: (author || "Anonymous").toString().trim().slice(0, 80),
      rating: numericRating,
      text: (text || "").toString().trim().slice(0, 1000),
    });

    // Recompute aggregate rating from all comments.
    const total = mechanic.comments.reduce((sum, c) => sum + c.rating, 0);
    mechanic.reviews = mechanic.comments.length;
    mechanic.rating = Math.round((total / mechanic.comments.length) * 10) / 10;

    await mechanic.save();
    return res.status(201).json({ ok: true, data: mechanic });
  } catch (err) {
    console.error("addComment error:", err.message);
    return res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
}

/**
 * POST /api/mechanics/upload — admin only. Accepts one or more image files
 * (field name "photos") and returns their server-relative /uploads paths. The
 * admin panel stores these paths in the mechanic's `images` array.
 */
async function uploadPhotos(req, res) {
  try {
    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({ ok: false, error: "NO_FILES" });
    }
    const paths = files.map((f) => `/uploads/mechanics/${f.filename}`);
    return res.status(201).json({ ok: true, paths });
  } catch (err) {
    console.error("uploadPhotos error:", err.message);
    return res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
}

module.exports = {
  getMechanics,
  getMechanicById,
  createMechanic,
  updateMechanic,
  deleteMechanic,
  addComment,
  uploadPhotos,
};
