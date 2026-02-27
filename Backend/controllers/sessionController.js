const { body, param } = require("express-validator");
const Session = require("../models/Session");
const Classroom = require("../models/Classroom");
const EngagementRecord = require("../models/EngagementRecord");
const { sendSuccess, sendError } = require("../utils/responseHelper");
const { getIO } = require("../sockets/socketHandler");

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Generate a random 6-char alphanumeric join code */
function generateJoinCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// ─── Validation ───────────────────────────────────────────────────────────────

const startSessionValidation = [
  body("subject").trim().notEmpty().withMessage("Subject is required."),
  body("className").trim().notEmpty().withMessage("Class name is required."),
  body("classroomId").optional().isMongoId(),
  body("title").optional().trim(),
];

// ─── Start Session ────────────────────────────────────────────────────────────

/**
 * POST /api/session/start
 * Auth: teacher
 * Body: { classroomId, subject, title? }
 */
const startSession = async (req, res, next) => {
  try {
    const { classroomId, subject, className, title } = req.body;
    const teacherId = req.user._id;

    // If classroomId provided, verify it belongs to this teacher
    if (classroomId) {
      const classroom = await Classroom.findOne({ _id: classroomId, teacherId });
      if (!classroom) {
        return sendError(res, 404, "Classroom not found or access denied.");
      }
    }

    // End any existing active session for this teacher first
    if (classroomId) {
      await Session.updateMany(
        { classroomId, status: "active" },
        { status: "ended", endTime: new Date() }
      );
    }

    // Generate unique join code
    let joinCode;
    let attempts = 0;
    do {
      joinCode = generateJoinCode();
      attempts++;
    } while (attempts < 10 && await Session.exists({ joinCode, status: "active" }));

    const resolvedClassName = className || (classroomId ? "Class" : "Session");

    const session = await Session.create({
      teacherId,
      classroomId: classroomId || null,
      className: resolvedClassName,
      subject,
      joinCode,
      title: title || `${resolvedClassName} — ${new Date().toLocaleDateString()}`,
      status: "active",
      startTime: new Date(),
    });

    // Notify teacher via socket that session started
    const io = getIO();
    io.to(`teacher_${teacherId}`).emit("session:started", {
      sessionId: session._id,
      subject: session.subject,
      className: session.className,
      joinCode: session.joinCode,
      title: session.title,
      startTime: session.startTime,
    });

    return sendSuccess(res, 201, "Session started.", { session });
  } catch (error) {
    next(error);
  }
};

// ─── Student Join by Code ─────────────────────────────────────────────────────

/**
 * POST /api/session/join-by-code
 * Auth: student
 * Body: { code }
 */
const joinByCode = async (req, res, next) => {
  try {
    const { code } = req.body;
    const studentId = req.user._id;

    const session = await Session.findOne({
      joinCode: code.toUpperCase().trim(),
      status: "active",
    });
    if (!session) {
      return sendError(res, 404, "No active session found with that code. Check the code and try again.");
    }

    // Upsert student in session.students list
    const alreadyJoined = session.students.some(
      (s) => s.studentId.toString() === studentId.toString()
    );
    if (!alreadyJoined) {
      session.students.push({ studentId, joinedAt: new Date(), isActive: true });
      await session.save();
    } else {
      await Session.updateOne(
        { _id: session._id, "students.studentId": studentId },
        { $set: { "students.$.isActive": true, "students.$.leftAt": null } }
      );
    }

    // Notify teacher socket room
    const io = getIO();
    io.to(`teacher_${session.teacherId}`).emit("student:joined", {
      sessionId: session._id,
      studentId,
      name: req.user.name,
    });

    return sendSuccess(res, 200, "Joined session.", {
      sessionId: session._id,
      subject: session.subject,
      className: session.className,
      teacherId: session.teacherId,
      joinCode: session.joinCode,
    });
  } catch (error) {
    next(error);
  }
};

// ─── End Session ──────────────────────────────────────────────────────────────

/**
 * POST /api/session/end
 * Auth: teacher
 * Body: { sessionId }
 */
const endSession = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const teacherId = req.user._id;

    const session = await Session.findOne({ _id: sessionId, teacherId, status: "active" });
    if (!session) {
      return sendError(res, 404, "Active session not found.");
    }

    // Calculate summary from engagement records
    const records = await EngagementRecord.find({ sessionId });
    const totalStudents = session.students.length;
    const avgEngagement =
      records.length > 0
        ? records.reduce((sum, r) => sum + r.engagementScore, 0) / records.length
        : 0;
    const peakEngagement =
      records.length > 0 ? Math.max(...records.map((r) => r.engagementScore)) : 0;
    const lowAlerts = records.filter((r) => r.engagementScore < 0.4).length;
    const durationMs = Date.now() - session.startTime.getTime();

    session.status = "ended";
    session.endTime = new Date();
    session.summary = {
      totalStudents,
      averageEngagement: parseFloat((avgEngagement * 100).toFixed(1)),
      peakEngagement: parseFloat((peakEngagement * 100).toFixed(1)),
      lowEngagementAlerts: lowAlerts,
      durationMinutes: Math.round(durationMs / 60000),
    };
    await session.save();

    // Update classroom stats
    await Classroom.findByIdAndUpdate(session.classroomId, {
      $inc: { "stats.totalSessions": 1 },
      $set: { "stats.lastSessionDate": session.endTime },
    });

    // Notify all room members
    const io = getIO();
    io.to(`session_${sessionId}`).emit("session:ended", {
      sessionId,
      summary: session.summary,
    });

    return sendSuccess(res, 200, "Session ended.", { session });
  } catch (error) {
    next(error);
  }
};

// ─── Get Session ──────────────────────────────────────────────────────────────

/**
 * GET /api/session/:id
 * Auth: teacher | admin
 */
const getSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("teacherId", "name email")
      .populate("classroomId", "name section")
      .populate("students.studentId", "name email rollNumber");

    if (!session) {
      return sendError(res, 404, "Session not found.");
    }

    // Teachers can only see their own sessions
    if (
      req.user.role === "teacher" &&
      session.teacherId._id.toString() !== req.user._id.toString()
    ) {
      return sendError(res, 403, "Access denied.");
    }

    return sendSuccess(res, 200, "Session fetched.", { session });
  } catch (error) {
    next(error);
  }
};

// ─── Student Join Session ─────────────────────────────────────────────────────

/**
 * POST /api/session/join
 * Auth: student
 * Body: { sessionId }
 */
const joinSession = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const studentId = req.user._id;

    const session = await Session.findOne({ _id: sessionId, status: "active" });
    if (!session) {
      return sendError(res, 404, "No active session found with that ID.");
    }

    // Upsert student in session.students list
    const alreadyJoined = session.students.some(
      (s) => s.studentId.toString() === studentId.toString()
    );
    if (!alreadyJoined) {
      session.students.push({ studentId, joinedAt: new Date(), isActive: true });
      await session.save();
    } else {
      // Re-activate if they rejoined
      await Session.updateOne(
        { _id: sessionId, "students.studentId": studentId },
        { $set: { "students.$.isActive": true, "students.$.leftAt": null } }
      );
    }

    // Notify teacher
    const io = getIO();
    io.to(`teacher_${session.teacherId}`).emit("student:joined", {
      sessionId,
      studentId,
      name: req.user.name,
    });

    return sendSuccess(res, 200, "Joined session.", {
      sessionId: session._id,
      subject: session.subject,
    });
  } catch (error) {
    next(error);
  }
};

// ─── List Active Sessions for Student ────────────────────────────────────────

/**
 * GET /api/session/active
 * Auth: student
 * Returns active sessions whose classroom includes this student
 */
const getActiveSession = async (req, res, next) => {
  try {
    const session = await Session.findOne({
      status: "active",
      classroomId: req.user.classroomId,
    }).populate("teacherId", "name subject");

    if (!session) {
      return sendSuccess(res, 200, "No active session.", { session: null });
    }

    return sendSuccess(res, 200, "Active session fetched.", { session });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/sessions/live  (admin) ─────────────────────────────────────────
const User = require("../models/User");

const getLiveSessionsAdmin = async (req, res, next) => {
  try {
    const activeSessions = await Session.find({ status: "active" })
      .populate("classroomId", "name section subject")
      .populate("teacherId", "name subject")
      .lean();

    const since2min = new Date(Date.now() - 2 * 60 * 1000);

    const result = await Promise.all(
      activeSessions.map(async (s) => {
        const classroomId = s.classroomId?._id ?? s.classroomId;

        // Total students enrolled
        const enrolledCount = await User.countDocuments({ role: "student", classroomId, isActive: true });

        // Active students (sent engagement record in last 2 min)
        const activeStudents = await EngagementRecord.distinct("studentId", {
          sessionId: s._id,
          timestamp: { $gte: since2min },
        });

        // Average engagement for this session
        const engRecords = await EngagementRecord.find({ sessionId: s._id });
        const avgEngagement =
          engRecords.length > 0
            ? Math.round((engRecords.reduce((sum, r) => sum + r.engagementScore, 0) / engRecords.length) * 100)
            : 0;

        const status =
          avgEngagement >= 80 ? "Excellent" : avgEngagement >= 55 ? "Good" : "Needs Attention";

        return {
          id: s._id,
          name: `${s.classroomId?.name ?? "Class"} — ${s.subject ?? s.classroomId?.subject ?? ""}`,
          teacher: s.teacherId?.name ?? "—",
          subject: s.subject ?? s.classroomId?.subject ?? "—",
          students: enrolledCount,
          activeNow: activeStudents.length,
          engagement: avgEngagement,
          status,
          startTime: s.startTime,
        };
      })
    );

    return sendSuccess(res, 200, "Live sessions.", { sessions: result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startSession,
  endSession,
  getSession,
  joinSession,
  joinByCode,
  getActiveSession,
  getLiveSessionsAdmin,
  startSessionValidation,
};
