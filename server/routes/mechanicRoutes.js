const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const upload = require("../middleware/upload");
const { commentLimiter } = require("../middleware/security");
const {
  getMechanics,
  getMechanicById,
  createMechanic,
  updateMechanic,
  deleteMechanic,
  addComment,
  uploadPhotos,
} = require("../controllers/mechanicController");

// Public reads
router.get("/", getMechanics);
router.get("/:id", getMechanicById);
// Rate-limited (10/hour/IP) to keep review spam out.
router.post("/:id/comments", commentLimiter, addComment);

// Admin writes (protected by Firebase admin auth)
router.post("/upload", adminAuth, upload.array("photos", 10), uploadPhotos);
router.post("/", adminAuth, createMechanic);
router.put("/:id", adminAuth, updateMechanic);
router.delete("/:id", adminAuth, deleteMechanic);

module.exports = router;
