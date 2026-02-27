const mongoose = require("mongoose");
const Session = require("../models/Session");
const EngagementRecord = require("../models/EngagementRecord");
const User = require("../models/User");
const { sendSuccess, sendError } = require("../utils/responseHelper");

// ─── GET /api/analytics/session/:id ──────────────────────────────────────────

/**
 * Full analytics for one session.
 * Returns:
 *   - session summary
 *   - per-student average engagement
 *   - engagement timeline (10-minute buckets)
 *   - emotion distribution
 *   - top 5 students
 *   - low engagement alerts list
 *   - anti-spoof flags
 * Auth: teacher | admin
 */
const getSessionAnalytics = async (req, res, next) => {
  try {
    const sessionId = new mongoose.Types.ObjectId(req.params.id);

    const session = await Session.findById(sessionId)
      .populate("teacherId", "name email")
      .populate("classroomId", "name section");

    if (!session) return sendError(res, 404, "Session not found.");

    if (
      req.user.role === "teacher" &&
      session.teacherId._id.toString() !== req.user._id.toString()
    ) {
      return sendError(res, 403, "Access denied.");
    }

    // ── Per-student averages ──────────────────────────────────────────────────
    const studentAverages = await EngagementRecord.aggregate([
      { $match: { sessionId } },
      {
        $group: {
          _id: "$studentId",
          avgScore: { $avg: "$engagementScore" },
          count: { $sum: 1 },
          states: { $push: "$state" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: { path: "$student", preserveNullAndEmpty: true } },
      {
        $project: {
          studentId: "$_id",
          name: "$student.name",
          email: "$student.email",
          avgEngagement: { $multiply: [{ $round: ["$avgScore", 3] }, 100] },
          frameCount: "$count",
          dominantState: {
            $arrayElemAt: [
              "$states",
              {
                $indexOfArray: [
                  "$states",
                  {
                    $reduce: {
                      input: "$states",
                      initialValue: "",
                      in: { $cond: [{ $gte: [{ $size: { $filter: { input: "$states", cond: { $eq: ["$$this", "$$value"] } } } }, { $size: { $filter: { input: "$states", cond: { $eq: ["$$this", "$$this"] } } } }] }, "$$this", "$$value"] },
                    },
                  },
                ],
              },
            ],
          },
        },
      },
      { $sort: { avgEngagement: -1 } },
    ]);

    // ── Engagement timeline (bucket by 10 min) ────────────────────────────────
    const timeline = await EngagementRecord.aggregate([
      { $match: { sessionId } },
      {
        $group: {
          _id: {
            $subtract: [
              { $divide: ["$timestamp", 10 * 60 * 1000] },
              { $mod: [{ $divide: ["$timestamp", 10 * 60 * 1000] }, 1] },
            ],
          },
          avgScore: { $avg: "$engagementScore" },
          minTimestamp: { $min: "$timestamp" },
        },
      },
      { $sort: { "_id": 1 } },
      {
        $project: {
          time: "$minTimestamp",
          engagement: { $round: [{ $multiply: ["$avgScore", 100] }, 1] },
        },
      },
    ]);

    // ── Emotion distribution ──────────────────────────────────────────────────
    const emotionDist = await EngagementRecord.aggregate([
      { $match: { sessionId } },
      { $group: { _id: "$state", count: { $sum: 1 } } },
      { $project: { state: "$_id", count: 1, _id: 0 } },
    ]);

    // ── Top 5 by avg engagement ───────────────────────────────────────────────
    const top5 = studentAverages.slice(0, 5);

    // ── Low engagement alerts (< 40%) ────────────────────────────────────────
    const lowAlerts = studentAverages.filter((s) => s.avgEngagement < 40);

    // ── Class average ─────────────────────────────────────────────────────────
    const classAvg =
      studentAverages.length > 0
        ? parseFloat(
            (
              studentAverages.reduce((sum, s) => sum + s.avgEngagement, 0) /
              studentAverages.length
            ).toFixed(1)
          )
        : 0;

    return sendSuccess(res, 200, "Session analytics fetched.", {
      session: {
        _id: session._id,
        subject: session.subject,
        title: session.title,
        status: session.status,
        startTime: session.startTime,
        endTime: session.endTime,
        teacher: session.teacherId,
        classroom: session.classroomId,
        summary: session.summary,
        flags: session.flags,
      },
      classAverage: classAvg,
      students: studentAverages,
      timeline,
      emotionDistribution: emotionDist,
      top5Students: top5,
      lowEngagementStudents: lowAlerts,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/analytics/student/:id ──────────────────────────────────────────

/**
 * Historical analytics for one student across all sessions.
 * Auth: teacher | admin | the student themselves
 */
const getStudentAnalytics = async (req, res, next) => {
  try {
    const studentId = new mongoose.Types.ObjectId(req.params.id);

    // Students can only see their own data
    if (
      req.user.role === "student" &&
      req.user._id.toString() !== studentId.toString()
    ) {
      return sendError(res, 403, "Access denied.");
    }

    const student = await User.findById(studentId).select("name email rollNumber classroomId");
    if (!student) return sendError(res, 404, "Student not found.");

    // ── Per-session averages ──────────────────────────────────────────────────
    const sessionAverages = await EngagementRecord.aggregate([
      { $match: { studentId } },
      {
        $group: {
          _id: "$sessionId",
          avgScore: { $avg: "$engagementScore" },
          frameCount: { $sum: 1 },
          minTime: { $min: "$timestamp" },
          maxTime: { $max: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "sessions",
          localField: "_id",
          foreignField: "_id",
          as: "session",
        },
      },
      { $unwind: { path: "$session", preserveNullAndEmpty: true } },
      {
        $project: {
          sessionId: "$_id",
          subject: "$session.subject",
          title: "$session.title",
          date: "$minTime",
          avgEngagement: { $round: [{ $multiply: ["$avgScore", 100] }, 1] },
          frameCount: 1,
          durationMs: { $subtract: ["$maxTime", "$minTime"] },
        },
      },
      { $sort: { date: -1 } },
      { $limit: 30 }, // last 30 sessions
    ]);

    // ── Overall average ───────────────────────────────────────────────────────
    const overallAvg =
      sessionAverages.length > 0
        ? parseFloat(
            (
              sessionAverages.reduce((s, r) => s + r.avgEngagement, 0) /
              sessionAverages.length
            ).toFixed(1)
          )
        : 0;

    // ── Trend data (weekly aggregation) ──────────────────────────────────────
    const weeklyTrend = await EngagementRecord.aggregate([
      { $match: { studentId } },
      {
        $group: {
          _id: {
            year: { $isoWeekYear: "$timestamp" },
            week: { $isoWeek: "$timestamp" },
          },
          avgScore: { $avg: "$engagementScore" },
          firstDay: { $min: "$timestamp" },
        },
      },
      { $sort: { "_id.year": 1, "_id.week": 1 } },
      { $limit: 12 },
      {
        $project: {
          week: "$firstDay",
          engagement: { $round: [{ $multiply: ["$avgScore", 100] }, 1] },
        },
      },
    ]);

    // ── State distribution ────────────────────────────────────────────────────
    const stateDist = await EngagementRecord.aggregate([
      { $match: { studentId } },
      { $group: { _id: "$state", count: { $sum: 1 } } },
      { $project: { state: "$_id", count: 1, _id: 0 } },
    ]);

    return sendSuccess(res, 200, "Student analytics fetched.", {
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
      },
      overallAverage: overallAvg,
      sessionHistory: sessionAverages,
      weeklyTrend,
      stateDistribution: stateDist,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/analytics/class/:classroomId ────────────────────────────────────

/**
 * Class-level analytics — avg engagement, top students, attendance.
 * Auth: teacher | admin
 */
const getClassAnalytics = async (req, res, next) => {
  try {
    const classroomId = new mongoose.Types.ObjectId(req.params.classroomId);

    // Aggregate last 30 sessions
    const sessions = await Session.find({ classroomId, status: "ended" })
      .sort({ startTime: -1 })
      .limit(30)
      .select("_id subject startTime summary");

    const sessionIds = sessions.map((s) => s._id);

    // Per-student averages across all sessions in classroom
    const studentStats = await EngagementRecord.aggregate([
      { $match: { classroomId, sessionId: { $in: sessionIds } } },
      {
        $group: {
          _id: "$studentId",
          avgScore: { $avg: "$engagementScore" },
          sessionCount: { $addToSet: "$sessionId" },
          frameCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: { path: "$student", preserveNullAndEmpty: true } },
      {
        $project: {
          studentId: "$_id",
          name: "$student.name",
          rollNumber: "$student.rollNumber",
          avgEngagement: { $round: [{ $multiply: ["$avgScore", 100] }, 1] },
          sessionsAttended: { $size: "$sessionCount" },
          frameCount: 1,
        },
      },
      { $sort: { avgEngagement: -1 } },
    ]);

    const classAvg =
      studentStats.length > 0
        ? parseFloat(
            (
              studentStats.reduce((s, r) => s + r.avgEngagement, 0) /
              studentStats.length
            ).toFixed(1)
          )
        : 0;

    return sendSuccess(res, 200, "Class analytics fetched.", {
      classAverage: classAvg,
      recentSessions: sessions,
      students: studentStats,
      top5Students: studentStats.slice(0, 5),
      lowEngagementStudents: studentStats.filter((s) => s.avgEngagement < 40),
      totalSessions: sessions.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSessionAnalytics, getStudentAnalytics, getClassAnalytics };

// ─── GET /api/analytics/dashboard/teacher ─────────────────────────────────────
/**
 * Returns teacher's dashboard stats:
 * todaySessionCount, liveEngagement, studentsAtRisk, weeklyTrend, recentSessions
 */
const getTeacherDashboard = async (req, res, next) => {
  try {
    const teacherId = req.user._id;
    const now = new Date();
    const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Today's sessions
    const todayCount = await Session.countDocuments({
      teacherId,
      startTime: { $gte: todayStart },
    });

    // Live (active) session engagement
    const activeSession = await Session.findOne({ teacherId, status: "active" });
    let liveEngagement = 0;
    let activeSessionId = null;
    if (activeSession) {
      activeSessionId = activeSession._id;
      const recentRecords = await EngagementRecord.find({
        sessionId: activeSession._id,
        timestamp: { $gte: new Date(now.getTime() - 30000) },
      });
      if (recentRecords.length > 0) {
        liveEngagement = Math.round(
          (recentRecords.reduce((s, r) => s + r.engagementScore, 0) / recentRecords.length) * 100
        );
      }
    }

    // Students at risk: avg engagement < 50% in the last 7 days
    const Classroom = require("../models/Classroom");
    const classroom = await Classroom.findOne({ teacherId, isActive: true });
    let atRiskCount = 0;
    if (classroom) {
      const studentStats = await EngagementRecord.aggregate([
        {
          $match: {
            classroomId: classroom._id,
            timestamp: { $gte: sevenDaysAgo },
          },
        },
        { $group: { _id: "$studentId", avg: { $avg: "$engagementScore" } } },
        { $match: { avg: { $lt: 0.5 } } },
      ]);
      atRiskCount = studentStats.length;
    }

    // Weekly trend: last 7 days, average engagement per day via teacher's session IDs
    const teacherSessionIds = await Session.find({
      teacherId,
      startTime: { $gte: sevenDaysAgo },
    }).distinct("_id");

    const weeklyTrend = await EngagementRecord.aggregate([
      {
        $match: {
          sessionId: { $in: teacherSessionIds },
          timestamp: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          avg: { $avg: "$engagementScore" },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: "$_id", value: { $round: [{ $multiply: ["$avg", 100] }, 0] }, _id: 0 } },
    ]);

    // Recent 5 sessions
    const recentSessions = await Session.find({ teacherId })
      .sort({ startTime: -1 })
      .limit(5)
      .populate("classroomId", "name section")
      .lean();

    return sendSuccess(res, 200, "Teacher dashboard data.", {
      todaySessionCount: todayCount,
      liveEngagement,
      activeSessionId,
      studentsAtRisk: atRiskCount,
      weeklyTrend,
      recentSessions,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/analytics/dashboard/student ─────────────────────────────────────
/**
 * Returns student's dashboard stats:
 * todayEngagement, weeklyAverage, weeklyData, activeSession, streak
 */
const getStudentDashboard = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Today's engagement average
    const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
    const todayRecords = await EngagementRecord.find({
      studentId,
      timestamp: { $gte: todayStart },
    });
    const todayEngagement =
      todayRecords.length > 0
        ? Math.round((todayRecords.reduce((s, r) => s + r.engagementScore, 0) / todayRecords.length) * 100)
        : 0;

    // Weekly average
    const weekRecords = await EngagementRecord.find({
      studentId,
      timestamp: { $gte: sevenDaysAgo },
    });
    const weeklyAverage =
      weekRecords.length > 0
        ? Math.round((weekRecords.reduce((s, r) => s + r.engagementScore, 0) / weekRecords.length) * 100)
        : 0;

    // Daily trend last 7 days
    const weeklyData = await EngagementRecord.aggregate([
      { $match: { studentId: new mongoose.Types.ObjectId(studentId.toString()), timestamp: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          value: { $avg: "$engagementScore" },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { day: "$_id", value: { $round: [{ $multiply: ["$value", 100] }, 0] }, _id: 0 } },
    ]);

    // Active session for this student's classroom
    const activeSession = req.user.classroomId
      ? await Session.findOne({ classroomId: req.user.classroomId, status: "active" }).populate("teacherId", "name subject")
      : null;

    // State distribution this week
    const stateDistRaw = await EngagementRecord.aggregate([
      { $match: { studentId: new mongoose.Types.ObjectId(studentId.toString()), timestamp: { $gte: sevenDaysAgo } } },
      { $group: { _id: "$state", count: { $sum: 1 } } },
    ]);
    const total = stateDistRaw.reduce((s, r) => s + r.count, 0) || 1;
    const stateDist = stateDistRaw.map((r) => ({ state: r._id, percent: Math.round((r.count / total) * 100) }));

    // Streak: consecutive days with at least 1 record
    let streak = 0;
    for (let d = 0; d < 30; d++) {
      const dayStart = new Date(now); dayStart.setHours(0, 0, 0, 0); dayStart.setDate(dayStart.getDate() - d);
      const dayEnd = new Date(dayStart); dayEnd.setHours(23, 59, 59, 999);
      const count = await EngagementRecord.countDocuments({ studentId, timestamp: { $gte: dayStart, $lte: dayEnd } });
      if (count > 0) streak++;
      else if (d > 0) break;
    }

    return sendSuccess(res, 200, "Student dashboard data.", {
      todayEngagement,
      weeklyAverage,
      weeklyData,
      activeSession,
      stateDist,
      streak,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/analytics/dashboard/admin ──────────────────────────────────────
/**
 * Returns admin dashboard:
 * totalStudents, totalTeachers, activeSessions, overallEngagement, classrooms
 */
const getAdminDashboard = async (req, res, next) => {
  try {
    const Classroom = require("../models/Classroom");
    const now = new Date();
    const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);

    const [totalStudents, totalTeachers, activeSessions] = await Promise.all([
      User.countDocuments({ role: "student", isActive: true }),
      User.countDocuments({ role: "teacher", isActive: true }),
      Session.countDocuments({ status: "active" }),
    ]);

    // Overall engagement today
    const todayRecords = await EngagementRecord.find({ timestamp: { $gte: todayStart } });
    const overallEngagement =
      todayRecords.length > 0
        ? Math.round((todayRecords.reduce((s, r) => s + r.engagementScore, 0) / todayRecords.length) * 100)
        : 0;

    // Weekly platform trend
    const weeklyTrend = await EngagementRecord.aggregate([
      { $match: { timestamp: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, avg: { $avg: "$engagementScore" } } },
      { $sort: { _id: 1 } },
      { $project: { date: "$_id", engagement: { $round: [{ $multiply: ["$avg", 100] }, 0] }, _id: 0 } },
    ]);

    // Classrooms with stats (teacher name + student count + avg engagement last 7 days)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const classrooms = await Classroom.find({ isActive: true })
      .populate("teacherId", "name email")
      .lean();

    const classroomsWithStats = await Promise.all(
      classrooms.map(async (c) => {
        const [studentCount, engagementRecords] = await Promise.all([
          User.countDocuments({ role: "student", classroomId: c._id, isActive: true }),
          EngagementRecord.find({ classroomId: c._id, timestamp: { $gte: sevenDaysAgo } }).select("engagementScore"),
        ]);
        const avgEngagement =
          engagementRecords.length > 0
            ? Math.round((engagementRecords.reduce((s, r) => s + r.engagementScore, 0) / engagementRecords.length) * 100)
            : 0;
        const sessionCount = await Session.countDocuments({ classroomId: c._id, status: "ended" });
        return {
          _id: c._id,
          name: c.name,
          section: c.section,
          subject: c.subject,
          teacherName: c.teacherId?.name ?? "—",
          teacherEmail: c.teacherId?.email ?? "",
          studentCount,
          avgEngagement,
          sessionCount,
        };
      })
    );

    return sendSuccess(res, 200, "Admin dashboard data.", {
      totalStudents,
      totalTeachers,
      activeSessions,
      overallEngagement,
      weeklyTrend,
      classrooms: classroomsWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/analytics/history ──────────────────────────────────────────────
/**
 * Teacher: list of past ended sessions with summary
 * Student: list of sessions they participated in
 */
const getSessionHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let filter = { status: "ended" };
    if (req.user.role === "teacher") filter.teacherId = req.user._id;
    if (req.user.role === "student") {
      // Sessions where this student has engagement records
      const sessionIds = await EngagementRecord.distinct("sessionId", {
        studentId: req.user._id,
      });
      filter._id = { $in: sessionIds };
    }

    const [sessions, total] = await Promise.all([
      Session.find(filter)
        .sort({ startTime: -1 })
        .skip(skip)
        .limit(limit)
        .populate("classroomId", "name section subject")
        .populate("teacherId", "name")
        .lean(),
      Session.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, "Session history.", {
      sessions,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/analytics/dashboard/student/class-insights ─────────────────────
/**
 * Returns class-level insights for the student's classroom:
 * classroomName, classSize, avgEngagement, weeklyClassTrend, focusDist, studentScore
 */
const getStudentClassInsights = async (req, res, next) => {
  try {
    const student = await User.findById(req.user._id).lean();
    const classroomId = student?.classroomId;
    if (!classroomId) {
      return sendSuccess(res, 200, "No classroom assigned.", {
        classroomName: "—",
        classSize: 0,
        avgEngagement: 0,
        weeklyClassTrend: [],
        focusDist: [],
        studentScore: 0,
        classAverage: 0,
      });
    }

    const Classroom = require("../models/Classroom");
    const classroom = await Classroom.findById(classroomId).lean();
    const classSize = await User.countDocuments({ role: "student", classroomId, isActive: true });

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Class average engagement last 7 days
    const classRecords = await EngagementRecord.find({ classroomId, timestamp: { $gte: sevenDaysAgo } });
    const classAverage =
      classRecords.length > 0
        ? Math.round((classRecords.reduce((s, r) => s + r.engagementScore, 0) / classRecords.length) * 100)
        : 0;

    // Student's own score last 7 days
    const myRecords = classRecords.filter((r) => r.studentId.toString() === req.user._id.toString());
    const studentScore =
      myRecords.length > 0
        ? Math.round((myRecords.reduce((s, r) => s + r.engagementScore, 0) / myRecords.length) * 100)
        : 0;

    // Weekly class trend
    const weeklyClassTrend = await EngagementRecord.aggregate([
      { $match: { classroomId: new mongoose.Types.ObjectId(classroomId.toString()), timestamp: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, classAvg: { $avg: "$engagementScore" } } },
      { $sort: { _id: 1 } },
      { $project: { day: "$_id", classAvg: { $round: [{ $multiply: ["$classAvg", 100] }, 0] }, _id: 0 } },
    ]);

    // Student's daily scores alongside class
    const myDailyMap = {};
    await Promise.all(
      weeklyClassTrend.map(async (d) => {
        const dayStart = new Date(d.day);
        const dayEnd = new Date(dayStart); dayEnd.setHours(23, 59, 59, 999);
        const recs = await EngagementRecord.find({ studentId: req.user._id, timestamp: { $gte: dayStart, $lte: dayEnd } });
        myDailyMap[d.day] = recs.length > 0
          ? Math.round((recs.reduce((s, r) => s + r.engagementScore, 0) / recs.length) * 100)
          : null;
      })
    );

    const trendWithMine = weeklyClassTrend.map((d) => ({
      day: d.day,
      classAvg: d.classAvg,
      yourScore: myDailyMap[d.day] ?? 0,
    }));

    // Focus distribution
    const stateDistRaw = await EngagementRecord.aggregate([
      { $match: { classroomId: new mongoose.Types.ObjectId(classroomId.toString()), timestamp: { $gte: sevenDaysAgo } } },
      { $group: { _id: "$state", count: { $sum: 1 } } },
    ]);
    const total = stateDistRaw.reduce((s, r) => s + r.count, 0) || 1;
    const stateColors = { engaged: "#10B981", distracted: "#F59E0B", absent: "#F87171", neutral: "#2563EB" };
    const focusDist = stateDistRaw.map((r) => ({
      name: r._id ? r._id.charAt(0).toUpperCase() + r._id.slice(1) : "Unknown",
      value: Math.round((r.count / total) * 100),
      color: stateColors[r._id] || "#64748B",
    }));

    return sendSuccess(res, 200, "Student class insights.", {
      classroomName: classroom?.name ?? "Class",
      classSize,
      avgEngagement: classAverage,
      weeklyClassTrend: trendWithMine,
      focusDist,
      studentScore,
      classAverage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSessionAnalytics,
  getStudentAnalytics,
  getClassAnalytics,
  getTeacherDashboard,
  getStudentDashboard,
  getAdminDashboard,
  getSessionHistory,
  getStudentClassInsights,
};
