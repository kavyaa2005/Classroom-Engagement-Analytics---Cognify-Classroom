const express = require("express");
const router = express.Router();
const { listStudents, listTeachers, createTeacher, toggleUserActive, deleteUser } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/students", protect, authorize("admin"), listStudents);
router.get("/teachers", protect, authorize("admin"), listTeachers);
router.post("/teacher", protect, authorize("admin"), createTeacher);
router.patch("/:id/toggle", protect, authorize("admin"), toggleUserActive);
router.delete("/:id", protect, authorize("admin"), deleteUser);

module.exports = router;
