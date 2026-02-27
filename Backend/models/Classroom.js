const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Classroom name is required"],
      trim: true,
    },
    section: {
      type: String,
      trim: true,
      default: "",
    },
    subject: {
      type: String,
      trim: true,
      default: "",
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    // Aggregated stats — updated when sessions end
    stats: {
      totalSessions: { type: Number, default: 0 },
      averageEngagement: { type: Number, default: 0 },
      totalStudents: { type: Number, default: 0 },
      lastSessionDate: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// teacherId has inline index:true — only define extra indexes here
classroomSchema.index({ students: 1 });

module.exports = mongoose.model("Classroom", classroomSchema);
