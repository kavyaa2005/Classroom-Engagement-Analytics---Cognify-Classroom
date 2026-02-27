const express = require("express");
const router = express.Router();
const {
  getSessionAnalytics,
  getStudentAnalytics,
  getClassAnalytics,
  getTeacherDashboard,
  getStudentDashboard,
  getAdminDashboard,
  getSessionHistory,
  getStudentClassInsights,
  getAIStatus,
} = require("../controllers/analyticsController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Dashboard endpoints
router.get("/dashboard/teacher", protect, authorize("teacher"), getTeacherDashboard);
router.get("/dashboard/student", protect, authorize("student"), getStudentDashboard);
router.get("/dashboard/admin", protect, authorize("admin"), getAdminDashboard);
router.get("/dashboard/student/class-insights", protect, authorize("student"), getStudentClassInsights);

// Session history (teacher or student)
router.get("/history", protect, authorize("teacher", "student"), getSessionHistory);

// AI model status (admin)
router.get("/ai-status", protect, authorize("admin"), getAIStatus);

// Detailed analytics
router.get("/session/:id", protect, authorize("teacher", "admin"), getSessionAnalytics);
router.get("/student/:id", protect, authorize("teacher", "admin", "student"), getStudentAnalytics);
router.get("/class/:classroomId", protect, authorize("teacher", "admin"), getClassAnalytics);

module.exports = router;
