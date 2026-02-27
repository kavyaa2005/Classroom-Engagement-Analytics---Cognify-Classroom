const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // never return password in queries by default
    },
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      required: [true, "Role is required"],
    },
    // Shared optional profile fields
    avatar: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    // Teacher-specific
    subject: { type: String, default: null },
    // Student-specific
    classroomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      default: null,
    },
    rollNumber: { type: String, default: null },
    lastSeen: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// email is already indexed via `unique: true` on the field (auto-creates index)
userSchema.index({ role: 1 });
userSchema.index({ classroomId: 1 });

// ─── Hash password before saving ─────────────────────────────────────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance method: compare password ───────────────────────────────────────
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// ─── Return safe user object (no password) ───────────────────────────────────
userSchema.methods.toSafeObject = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    avatar: this.avatar,
    isActive: this.isActive,
    subject: this.subject,
    classroomId: this.classroomId,
    rollNumber: this.rollNumber,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
