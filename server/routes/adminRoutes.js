const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

// Lets the admin panel confirm the signed-in user is an authorized admin.
router.get("/verify", adminAuth, (req, res) => res.json({ ok: true, email: req.admin?.email }));

module.exports = router;
