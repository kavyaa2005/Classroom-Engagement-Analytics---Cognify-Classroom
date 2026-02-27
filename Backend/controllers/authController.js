const { body } = require("express-validator");
const User = require("../models/User");
const { generateToken } = require("../utils/jwtHelper");
const { sendSuccess, sendError } = require("../utils/responseHelper");

// ─── Validation Rules ─────────────────────────────────────────────────────────

const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required.").isLength({ max: 100 }),
  body("email").trim().notEmpty().isEmail().withMessage("Valid email is required.").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
  body("role").isIn(["admin", "teacher", "student"]).withMessage("Role must be admin, teacher, or student."),
];

const loginValidation = [
  body("email").trim().notEmpty().isEmail().withMessage("Valid email is required.").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required."),
  body("role").isIn(["admin", "teacher", "student"]).withMessage("Role must be admin, teacher, or student."),
];

// ─── Controller: Register ─────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Body: { name, email, password, role }
 * Response: { success, message, data: { token, user } }
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 409, "An account with this email already exists.");
    }

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user._id);

    return sendSuccess(res, 201, "Account created successfully.", {
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

// ─── Controller: Login ────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 * Body: { email, password, role }
 * Response: { success, message, data: { token, user } }
 *
 * NOTE: The frontend AuthContext expects { name, email, role }.
 *       We return exactly that inside user.
 */
const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    // Find user and force-include password for comparison
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return sendError(res, 401, "Invalid email or password.");
    }

    // Check role matches
    if (user.role !== role) {
      return sendError(res, 401, `This account is not registered as a ${role}.`);
    }

    // Check account active
    if (!user.isActive) {
      return sendError(res, 403, "Your account has been deactivated. Contact admin.");
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendError(res, 401, "Invalid email or password.");
    }

    const token = generateToken(user._id);

    return sendSuccess(res, 200, "Login successful.", {
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

// ─── Controller: Get Me ───────────────────────────────────────────────────────

/**
 * GET /api/auth/me
 * Header: Authorization: Bearer <token>
 * Response: { success, message, data: { user } }
 */
const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, 200, "User fetched.", { user: req.user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, registerValidation, loginValidation };
