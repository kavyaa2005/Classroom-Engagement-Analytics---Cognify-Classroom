const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    classroomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      required: false,
      default: null,
      index: true,
    },
    // Human-readable class name (override or fallback when no classroomId)
    className: {
      type: String,
      trim: true,
      default: "",
    },
    // 6-char alphanumeric code students use to join
    joinCode: {
      type: String,
      uppercase: true,
      trim: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
      index: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
      index: true,
    },
    endTime: {
      type: Date,
      default: null,
    },
    // Students who joined this session
    students: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        joinedAt: { type: Date, default: Date.now },
        leftAt: { type: Date, default: null },
        isActive: { type: Boolean, default: true },
      },
    ],
    // Summary stats (populated when session ends)
    summary: {
      totalStudents: { type: Number, default: 0 },
      averageEngagement: { type: Number, default: 0 },
      peakEngagement: { type: Number, default: 0 },
      lowEngagementAlerts: { type: Number, default: 0 },
      durationMinutes: { type: Number, default: 0 },
    },
    // Anti-spoof flags
    flags: [
      {
        type: {
          type: String,
          enum: ["no_face", "multiple_faces", "camera_blackout", "long_inactivity"],
        },
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        timestamp: { type: Date, default: Date.now },
        details: { type: String, default: "" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ─── Compound indexes ──────────────────────────────────────────────────────────
// teacherId, classroomId, status, startTime have inline index:true
// Only add COMPOUND indexes here — Mongoose merges single-field automatically
sessionSchema.index({ teacherId: 1, status: 1 });
sessionSchema.index({ classroomId: 1, startTime: -1 });
sessionSchema.index({ joinCode: 1 }, { sparse: true });

module.exports = mongoose.model("Session", sessionSchema);
