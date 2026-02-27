const express = require("express");
const router = express.Router();
const { updateEngagement, uploadFrame } = require("../controllers/engagementController");
const { protect, authorize } = require("../middleware/authMiddleware");

// POST /api/engagement/update
// Body: multipart/form-data  →  file (image frame) + sessionId
router.post(
  "/update",
  protect,
  authorize("student"),
  uploadFrame,
  updateEngagement
);

module.exports = router;
