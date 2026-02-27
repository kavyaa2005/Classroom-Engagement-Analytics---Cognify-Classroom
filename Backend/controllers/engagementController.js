const multer = require("multer");
const Session = require("../models/Session");
const EngagementRecord = require("../models/EngagementRecord");
const { predictEngagement } = require("../utils/aiService");
const { sendSuccess, sendError } = require("../utils/responseHelper");
const { getIO } = require("../sockets/socketHandler");

// ─── Multer — in-memory storage for frames ───────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max per frame
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."), false);
    }
  },
});

// ─── Anti-spoof helpers ───────────────────────────────────────────────────────

/**
 * Analyse AI result for spoof / attention flags.
 * Returns frameFlags object and optionally a session-level flag.
 */
const analyseFlags = (aiResult) => {
  const frameFlags = {
    noFace: aiResult.state === "Inactive" && aiResult.confidence < 0.3,
    multipleFaces: false, // AI microservice sets this when detecting multiple
    lowConfidence: aiResult.confidence < 0.4,
  };
  return frameFlags;
};

// ─── POST /api/engagement/update ─────────────────────────────────────────────

/**
 * Body (multipart/form-data):
 *   file   — image frame (JPEG/PNG)
 *   sessionId — active session id
 *
 * Auth: student
 *
 * Flow:
 *  1. Validate session is active and student is in it
 *  2. Forward frame to AI microservice
 *  3. Store EngagementRecord
 *  4. Emit live update via Socket.io to teacher room
 *  5. Return AI result to student client
 */
const updateEngagement = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const studentId = req.user._id;

    if (!sessionId) {
      return sendError(res, 400, "sessionId is required.");
    }

    if (!req.file) {
      return sendError(res, 400, "No frame image uploaded.");
    }

    // Validate session is still active
    const session = await Session.findOne({ _id: sessionId, status: "active" });
    if (!session) {
      return sendError(res, 404, "No active session with that ID.");
    }

    // Call AI microservice
    const aiResult = await predictEngagement(req.file.buffer, studentId.toString());

    // Analyse flags
    const frameFlags = analyseFlags(aiResult);

    // Persist the record
    const record = await EngagementRecord.create({
      sessionId,
      studentId,
      classroomId: session.classroomId,
      engagementScore: aiResult.engagement_score,
      state: aiResult.state,
      confidence: aiResult.confidence,
      timestamp: new Date(),
      frameFlags,
    });

    // ── Anti-spoof session flags ──
    if (frameFlags.noFace) {
      session.flags.push({
        type: "no_face",
        studentId,
        timestamp: new Date(),
        details: "No face detected in frame.",
      });
      await session.save();
    }

    // ── Emit live update to teacher ──
    const io = getIO();
    const livePayload = {
      studentId,
      studentName: req.user.name,
      sessionId,
      engagementScore: aiResult.engagement_score,
      engagementPercent: Math.round(aiResult.engagement_score * 100),
      state: aiResult.state,
      confidence: aiResult.confidence,
      // Color-coded status for teacher dashboard
      statusColor:
        aiResult.engagement_score >= 0.7
          ? "green"
          : aiResult.engagement_score >= 0.4
          ? "yellow"
          : "red",
      timestamp: record.timestamp,
      flags: frameFlags,
    };

    io.to(`session_${sessionId}`).emit("engagement:update", livePayload);

    return sendSuccess(res, 200, "Engagement recorded.", {
      engagementScore: aiResult.engagement_score,
      engagementPercent: Math.round(aiResult.engagement_score * 100),
      state: aiResult.state,
      confidence: aiResult.confidence,
      statusColor: livePayload.statusColor,
      flags: frameFlags,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Upload middleware export ─────────────────────────────────────────────────
const uploadFrame = upload.single("file");

module.exports = { updateEngagement, uploadFrame };
