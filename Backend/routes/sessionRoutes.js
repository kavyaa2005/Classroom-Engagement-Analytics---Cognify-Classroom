const express = require("express");
const router = express.Router();
const {
  startSession,
  endSession,
  getSession,
  joinSession,
  joinByCode,
  getActiveSession,
  getLiveSessionsAdmin,
  startSessionValidation,
} = require("../controllers/sessionController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const { body } = require("express-validator");

// POST /api/session/start — teacher only
router.post(
  "/start",
  protect,
  authorize("teacher"),
  startSessionValidation,
  validateRequest,
  startSession
);

// POST /api/session/end — teacher only
router.post(
  "/end",
  protect,
  authorize("teacher"),
  [body("sessionId").notEmpty().isMongoId().withMessage("Valid sessionId is required.")],
  validateRequest,
  endSession
);

// GET /api/session/active — student only (finds active session for their classroom)
router.get("/active", protect, authorize("student"), getActiveSession);

// GET /api/session/live — admin only (all active sessions)
router.get("/live", protect, authorize("admin"), getLiveSessionsAdmin);

// POST /api/session/join — student only (join by sessionId)
router.post(
  "/join",
  protect,
  authorize("student"),
  [body("sessionId").notEmpty().isMongoId().withMessage("Valid sessionId is required.")],
  validateRequest,
  joinSession
);

// POST /api/session/join-by-code — student only (join by 6-char code)
router.post(
  "/join-by-code",
  protect,
  authorize("student"),
  [body("code").trim().notEmpty().withMessage("Join code is required.")],
  validateRequest,
  joinByCode
);

// GET /api/session/:id — teacher | admin | student
router.get("/:id", protect, authorize("teacher", "admin", "student"), getSession);

module.exports = router;
