const User = require("../models/User");
const Classroom = require("../models/Classroom");
const { sendSuccess, sendError } = require("../utils/responseHelper");
const { generateToken } = require("../utils/jwtHelper");

// ─── GET /api/users/students ──────────────────────────────────────────────────
const listStudents = async (req, res, next) => {
  try {
    const Session = require("../models/Session");
    const EngagementRecord = require("../models/EngagementRecord");

    const students = await User.find({ role: "student" })
      .populate("classroomId", "name section subject")
      .lean();

    // Calculate engagement and attendance for each student
    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        // Average engagement score from all their engagement records
        const engagementRecords = await EngagementRecord.find({ studentId: student._id }).select("engagementScore").lean();
        const avgEngagement = engagementRecords.length > 0
          ? Math.round((engagementRecords.reduce((sum, r) => sum + r.engagementScore, 0) / engagementRecords.length) * 100)
          : 0;

        // Attendance rate: sessions they joined / total sessions for their classroom
        const classroomId = student.classroomId?._id || student.classroomId;
        const [totalSessions, joinedSessions] = await Promise.all([
          Session.countDocuments({ classroomId, status: "ended" }),
          Session.countDocuments({ classroomId, status: "ended", "students.studentId": student._id }),
        ]);
        const attendanceRate = totalSessions > 0 ? Math.round((joinedSessions / totalSessions) * 100) : 0;

        return {
          ...student,
          avgEngagement,
          attendanceRate,
        };
      })
    );

    return sendSuccess(res, 200, "Students fetched.", { students: studentsWithStats });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/users/teachers ──────────────────────────────────────────────────
const listTeachers = async (req, res, next) => {
  try {
    const teachers = await User.find({ role: "teacher" }).lean();

    // Attach classrooms each teacher owns
    const classrooms = await Classroom.find().select("name section subject teacherId").lean();
    const teachersWithClasses = teachers.map((t) => ({
      ...t,
      classes: classrooms.filter((c) => c.teacherId.toString() === t._id.toString()),
    }));

    return sendSuccess(res, 200, "Teachers fetched.", { teachers: teachersWithClasses });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/users/teacher ──────────────────────────────────────────────────
const createTeacher = async (req, res, next) => {
  try {
    const { name, email, password, subject } = req.body;
    if (!name || !email || !password) {
      return sendError(res, 400, "Name, email and password are required.");
    }
    const existing = await User.findOne({ email });
    if (existing) return sendError(res, 409, "Email already in use.");

    const teacher = await User.create({ name, email, password: password || "teacher123", role: "teacher", subject: subject || "" });
    return sendSuccess(res, 201, "Teacher created.", { teacher: teacher.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/users/:id/toggle ─────────────────────────────────────────────
const toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, "User not found.");
    if (user.role === "admin") return sendError(res, 403, "Cannot deactivate admin.");
    user.isActive = !user.isActive;
    await user.save();
    return sendSuccess(res, 200, `User ${user.isActive ? "activated" : "deactivated"}.`, {
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/users/:id ────────────────────────────────────────────────────
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, "User not found.");
    if (user.role === "admin") return sendError(res, 403, "Cannot delete admin.");
    await user.deleteOne();
    // Remove from classrooms
    await Classroom.updateMany(
      { students: user._id },
      { $pull: { students: user._id } }
    );
    return sendSuccess(res, 200, "User deleted.");
  } catch (error) {
    next(error);
  }
};

module.exports = { listStudents, listTeachers, createTeacher, toggleUserActive, deleteUser };
