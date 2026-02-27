const express = require("express");
const router = express.Router();
const { getMyClassrooms, getClassroomStudents } = require("../controllers/classroomController");
const { protect, authorize } = require("../middleware/authMiddleware");

// GET /api/classroom/my — teacher gets their own classrooms
router.get("/my", protect, authorize("teacher"), getMyClassrooms);

// GET /api/classroom/:id/students — teacher gets students of one classroom
router.get("/:id/students", protect, authorize("teacher"), getClassroomStudents);

module.exports = router;
