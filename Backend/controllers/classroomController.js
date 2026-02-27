const Classroom = require("../models/Classroom");
const { sendSuccess, sendError } = require("../utils/responseHelper");

// ─── GET /api/classroom/my ─────────────────────────────────────────────────────
/**
 * Returns all classrooms that belong to the authenticated teacher.
 * Auth: teacher
 * Response: { success, data: { classrooms: [ { _id, name, section, subject, students } ] } }
 */
const getMyClassrooms = async (req, res, next) => {
  try {
    const classrooms = await Classroom.find({ teacherId: req.user._id, isActive: true })
      .populate("students", "name email")
      .lean();

    return sendSuccess(res, 200, "Classrooms fetched.", { classrooms });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/classroom/:id/students ───────────────────────────────────────────
/**
 * Returns students for a specific classroom.
 * Auth: teacher (must own classroom)
 */
const getClassroomStudents = async (req, res, next) => {
  try {
    const classroom = await Classroom.findOne({
      _id: req.params.id,
      teacherId: req.user._id,
    }).populate("students", "name email isActive");

    if (!classroom) {
      return sendError(res, 404, "Classroom not found or access denied.");
    }

    return sendSuccess(res, 200, "Students fetched.", {
      students: classroom.students,
      classroomName: `${classroom.name} ${classroom.section}`.trim(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyClassrooms, getClassroomStudents };
