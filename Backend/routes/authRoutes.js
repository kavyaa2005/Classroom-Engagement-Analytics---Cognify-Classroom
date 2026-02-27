const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  registerValidation,
  loginValidation,
} = require("../controllers/authController");
const validateRequest = require("../middleware/validateRequest");
const { protect } = require("../middleware/authMiddleware");

// POST /api/auth/register
router.post("/register", registerValidation, validateRequest, register);

// POST /api/auth/login
router.post("/login", loginValidation, validateRequest, login);

// GET /api/auth/me  (protected)
router.get("/me", protect, getMe);

module.exports = router;
