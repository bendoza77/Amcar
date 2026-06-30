const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const {
  getMechanics,
  getMechanicById,
  createMechanic,
  updateMechanic,
  deleteMechanic,
  addComment,
} = require("../controllers/mechanicController");

// Public reads
router.get("/", getMechanics);
router.get("/:id", getMechanicById);
router.post("/:id/comments", addComment);

// Admin writes (protected by x-admin-token)
router.post("/", adminAuth, createMechanic);
router.put("/:id", adminAuth, updateMechanic);
router.delete("/:id", adminAuth, deleteMechanic);

module.exports = router;
