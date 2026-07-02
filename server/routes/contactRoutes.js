const express = require("express");
const router = express.Router();
const { sendContact } = require("../controllers/contactController");
const { contactLimiter } = require("../middleware/security");

// Rate-limited (5/hour/IP) so the form can't be used to spam our email quota.
router.post("/", contactLimiter, sendContact);

module.exports = router;
