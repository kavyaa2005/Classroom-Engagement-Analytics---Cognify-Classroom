const mongoose = require("mongoose");

const engagementRecordSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      index: true,
    },
    studentId: {
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
    // AI result fields  — matches AI microservice response exactly
    engagementScore: {
      type: Number,
      required: true,
      min: 0,
      max: 1, // stored as 0–1, converted to % for display
    },
    state: {
      type: String,
      enum: ["Attentive", "Engaged", "Neutral", "Distracted", "Inactive", "Unknown"],
      default: "Unknown",
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    // Anti-spoof metadata from this specific frame
    frameFlags: {
      noFace: { type: Boolean, default: false },
      multipleFaces: { type: Boolean, default: false },
      lowConfidence: { type: Boolean, default: false },
    },
  },
  {
    // Do not use timestamps — we control timestamp manually for precision
    timestamps: false,
  }
);

// ─── Compound indexes for analytics aggregations ───────────────────────────────
engagementRecordSchema.index({ sessionId: 1, timestamp: 1 });
engagementRecordSchema.index({ studentId: 1, timestamp: -1 });
engagementRecordSchema.index({ sessionId: 1, studentId: 1, timestamp: 1 });
engagementRecordSchema.index({ classroomId: 1, timestamp: -1 });

module.exports = mongoose.model("EngagementRecord", engagementRecordSchema);
