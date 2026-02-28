/**
 * Comprehensive Seed — populates MongoDB with realistic session + engagement data.
 * Run: node utils/seed.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const User = require("../models/User");
const Classroom = require("../models/Classroom");
const Session = require("../models/Session");
const EngagementRecord = require("../models/EngagementRecord");

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/Cognify-Classroom";

// ── helpers ───────────────────────────────────────────────────────────────────
const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function scoreToState(score) {
  if (score >= 0.70) return "Attentive";
  if (score >= 0.40) return "Neutral";
  if (score >= 0.15) return "Distracted";
  return "Inactive";
}

function generateJoinCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 6 }, () => pick(chars.split(""))).join("");
}

function generateEngagementRecords(sessionId, classroomId, studentId, sessionStart, durationMin, baseTendency) {
  const records = [];
  const intervalSec = 15;
  const totalFrames = Math.floor((durationMin * 60) / intervalSec);
  let score = Math.min(0.95, Math.max(0.10, baseTendency + rand(-0.1, 0.1)));

  for (let i = 0; i < totalFrames; i++) {
    const drift = (baseTendency - score) * 0.05;
    score = Math.min(0.98, Math.max(0.05, score + drift + rand(-0.08, 0.08)));
    const progress = i / totalFrames;
    if (progress > 0.4 && progress < 0.6 && Math.random() < 0.3) {
      score = Math.max(0.05, score - rand(0.05, 0.20));
    }
    const confidence = rand(0.55, 0.99);
    const timestamp = new Date(sessionStart.getTime() + i * intervalSec * 1000);
    records.push({
      sessionId, classroomId, studentId,
      engagementScore: parseFloat(score.toFixed(4)),
      state: scoreToState(score),
      confidence: parseFloat(confidence.toFixed(4)),
      timestamp,
      frameFlags: { noFace: false, multipleFaces: false, lowConfidence: confidence < 0.38 },
    });
  }
  return records;
}

// Create multiple users using User.create (triggers pre-save bcrypt hook)
async function createUsers(userDefs) {
  const results = [];
  for (const def of userDefs) {
    const user = await User.create(def);
    results.push(user);
  }
  return results;
}

const run = async () => {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB:", MONGO_URI);

  await Promise.all([
    User.deleteMany({}),
    Classroom.deleteMany({}),
    Session.deleteMany({}),
    EngagementRecord.deleteMany({}),
  ]);
  console.log("Cleared all collections");

  // ── Admin ─────────────────────────────────────────────────────────────────
  const admin = await User.create({ name: "Admin User", email: "admin@school.edu", password: "admin123", role: "admin", isActive: true });
  console.log("Admin:", admin.email);

  // ── Teachers ──────────────────────────────────────────────────────────────
  const [teacher1, teacher2] = await createUsers([
    { name: "Ms. Kavya Sharma", email: "kavya@school.edu", password: "teacher123", role: "teacher", subject: "Mathematics", isActive: true },
    { name: "Mr. Arjun Mehta",  email: "arjun@school.edu", password: "teacher123", role: "teacher", subject: "Physics",     isActive: true },
  ]);
  console.log("Teachers:", teacher1.email, teacher2.email);

  // ── Students Class 10A ────────────────────────────────────────────────────
  const studentsA = await createUsers([
    { name: "Aarav Patel",    email: "aarav@school.edu",   password: "student123", role: "student", rollNumber: "10A01", isActive: true },
    { name: "Ananya Singh",   email: "ananya@school.edu",  password: "student123", role: "student", rollNumber: "10A02", isActive: true },
    { name: "Rohan Verma",    email: "rohan@school.edu",   password: "student123", role: "student", rollNumber: "10A03", isActive: true },
    { name: "Priya Nair",     email: "priya@school.edu",   password: "student123", role: "student", rollNumber: "10A04", isActive: true },
    { name: "Karan Malhotra", email: "karan@school.edu",   password: "student123", role: "student", rollNumber: "10A05", isActive: true },
    { name: "Sneha Reddy",    email: "sneha@school.edu",   password: "student123", role: "student", rollNumber: "10A06", isActive: true },
    { name: "Rahul Gupta",    email: "rahul@school.edu",   password: "student123", role: "student", rollNumber: "10A07", isActive: true },
    { name: "Divya Iyer",     email: "divya@school.edu",   password: "student123", role: "student", rollNumber: "10A08", isActive: true },
    { name: "Aryan Kumar",    email: "aryan@school.edu",   password: "student123", role: "student", rollNumber: "10A09", isActive: true },
    { name: "Meera Joshi",    email: "meera@school.edu",   password: "student123", role: "student", rollNumber: "10A10", isActive: true },
  ]);

  // ── Students Class 10B ────────────────────────────────────────────────────
  const studentsB = await createUsers([
    { name: "Aditya Shah",  email: "aditya@school.edu",  password: "student123", role: "student", rollNumber: "10B01", isActive: true },
    { name: "Ishaan Roy",   email: "ishaan@school.edu",  password: "student123", role: "student", rollNumber: "10B02", isActive: true },
    { name: "Kaveri Menon", email: "kaveri@school.edu",  password: "student123", role: "student", rollNumber: "10B03", isActive: true },
    { name: "Neel Saxena",  email: "neel@school.edu",    password: "student123", role: "student", rollNumber: "10B04", isActive: true },
    { name: "Riya Desai",   email: "riya@school.edu",    password: "student123", role: "student", rollNumber: "10B05", isActive: true },
    { name: "Vikram Bose",  email: "vikram@school.edu",  password: "student123", role: "student", rollNumber: "10B06", isActive: true },
    { name: "Pooja Pillai", email: "pooja@school.edu",   password: "student123", role: "student", rollNumber: "10B07", isActive: true },
    { name: "Sahil Kapoor", email: "sahil@school.edu",   password: "student123", role: "student", rollNumber: "10B08", isActive: true },
  ]);
  console.log(`Students: ${studentsA.length} in 10A, ${studentsB.length} in 10B`);

  // ── Classrooms ────────────────────────────────────────────────────────────
  const classroom1 = await Classroom.create({
    name: "Class 10A", section: "A", subject: "Mathematics",
    teacherId: teacher1._id, students: studentsA.map((s) => s._id), isActive: true,
  });
  const classroom2 = await Classroom.create({
    name: "Class 10B", section: "B", subject: "Physics",
    teacherId: teacher2._id, students: studentsB.map((s) => s._id), isActive: true,
  });
  console.log("Classrooms:", classroom1.name, classroom2.name);

  // Assign classroomId to students
  await User.updateMany({ _id: { $in: studentsA.map((s) => s._id) } }, { classroomId: classroom1._id });
  await User.updateMany({ _id: { $in: studentsB.map((s) => s._id) } }, { classroomId: classroom2._id });

  // Per-student engagement tendencies
  const tendenciesA = [0.82, 0.75, 0.65, 0.78, 0.58, 0.71, 0.48, 0.80, 0.62, 0.73];
  const tendenciesB = [0.70, 0.55, 0.85, 0.60, 0.77, 0.45, 0.68, 0.74];

  const now = new Date();
  const daysAgo = (n, hour = 9, min = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() - n);
    d.setHours(hour, min, 0, 0);
    return d;
  };

  const sessionDefs = [
    {
      classroom: classroom1, teacher: teacher1,
      students: studentsA, tendencies: tendenciesA, subject: "Mathematics",
      sessions: [
        { daysBack: 13, hour: 9,  title: "Algebra Basics" },
        { daysBack: 12, hour: 10, title: "Quadratic Equations" },
        { daysBack: 11, hour: 9,  title: "Linear Equations" },
        { daysBack: 10, hour: 11, title: "Trigonometry Intro" },
        { daysBack: 9,  hour: 9,  title: "Geometry Theorems" },
        { daysBack: 8,  hour: 10, title: "Statistics" },
        { daysBack: 7,  hour: 9,  title: "Probability" },
        { daysBack: 6,  hour: 10, title: "Calculus Intro" },
        { daysBack: 5,  hour: 9,  title: "Matrices" },
        { daysBack: 4,  hour: 11, title: "Number Theory" },
        { daysBack: 3,  hour: 9,  title: "Polynomials" },
        { daysBack: 2,  hour: 10, title: "Coordinate Geometry" },
        { daysBack: 1,  hour: 9,  title: "Mensuration" },
        { daysBack: 0,  hour: 10, title: "Arithmetic Progressions" },
      ],
    },
    {
      classroom: classroom2, teacher: teacher2,
      students: studentsB, tendencies: tendenciesB, subject: "Physics",
      sessions: [
        { daysBack: 13, hour: 11, title: "Newton Laws" },
        { daysBack: 11, hour: 11, title: "Kinematics" },
        { daysBack: 10, hour: 10, title: "Thermodynamics" },
        { daysBack: 9,  hour: 11, title: "Optics Intro" },
        { daysBack: 8,  hour: 10, title: "Electrostatics" },
        { daysBack: 7,  hour: 11, title: "Current Electricity" },
        { daysBack: 6,  hour: 10, title: "Magnetism" },
        { daysBack: 5,  hour: 11, title: "Waves" },
        { daysBack: 4,  hour: 10, title: "Sound" },
        { daysBack: 3,  hour: 11, title: "Modern Physics" },
        { daysBack: 2,  hour: 10, title: "Gravitation" },
        { daysBack: 1,  hour: 11, title: "Work & Energy" },
      ],
    },
  ];

  let totalSessions = 0;
  let totalRecords = 0;

  for (const def of sessionDefs) {
    for (const s of def.sessions) {
      const durationMin = randInt(40, 55);
      const startTime = daysAgo(s.daysBack, s.hour, randInt(0, 10));
      const endTime = new Date(startTime.getTime() + durationMin * 60 * 1000);

      const sessionStudents = def.students.map((st) => ({
        studentId: st._id,
        joinedAt: new Date(startTime.getTime() + randInt(0, 120) * 1000),
        leftAt: new Date(endTime.getTime() - randInt(0, 60) * 1000),
        isActive: false,
      }));

      const session = await Session.create({
        teacherId: def.teacher._id,
        classroomId: def.classroom._id,
        className: def.classroom.name,
        joinCode: generateJoinCode(),
        subject: def.subject,
        title: s.title,
        status: "ended",
        startTime, endTime,
        students: sessionStudents,
        summary: { totalStudents: def.students.length, averageEngagement: 0, peakEngagement: 0, lowEngagementAlerts: 0, durationMinutes: durationMin },
      });

      let allRecords = [];
      let sessionTotalScore = 0;
      let sessionPeak = 0;
      let lowAlerts = 0;

      for (let si = 0; si < def.students.length; si++) {
        const records = generateEngagementRecords(
          session._id, def.classroom._id, def.students[si]._id,
          startTime, durationMin, def.tendencies[si]
        );
        allRecords = allRecords.concat(records);
        const avgScore = records.reduce((acc, r) => acc + r.engagementScore, 0) / records.length;
        const peakScore = Math.max(...records.map((r) => r.engagementScore));
        sessionTotalScore += avgScore;
        if (peakScore > sessionPeak) sessionPeak = peakScore;
        if (avgScore < 0.5) lowAlerts++;
      }

      // Insert in batches of 500
      for (let i = 0; i < allRecords.length; i += 500) {
        await EngagementRecord.insertMany(allRecords.slice(i, i + 500));
      }
      totalRecords += allRecords.length;

      await Session.findByIdAndUpdate(session._id, {
        "summary.averageEngagement": parseFloat(((sessionTotalScore / def.students.length) * 100).toFixed(1)),
        "summary.peakEngagement": parseFloat((sessionPeak * 100).toFixed(1)),
        "summary.lowEngagementAlerts": lowAlerts,
      });

      totalSessions++;
      process.stdout.write(`\r  Sessions created: ${totalSessions}, Records: ${totalRecords}`);
    }

    const recs = await EngagementRecord.find({ classroomId: def.classroom._id }).select("engagementScore");
    const avg = recs.length > 0 ? recs.reduce((s, r) => s + r.engagementScore, 0) / recs.length : 0;
    await Classroom.findByIdAndUpdate(def.classroom._id, {
      "stats.totalSessions": def.sessions.length,
      "stats.averageEngagement": parseFloat((avg * 100).toFixed(1)),
      "stats.totalStudents": def.students.length,
      "stats.lastSessionDate": new Date(),
    });
  }

  console.log("\n");
  console.log("==================================================");
  console.log("             SEED COMPLETE");
  console.log("==================================================");
  console.log(" Admin     : admin@school.edu     / admin123");
  console.log(" Teacher 1 : kavya@school.edu     / teacher123  (Math 10A)");
  console.log(" Teacher 2 : arjun@school.edu     / teacher123  (Physics 10B)");
  console.log(" Students  : aarav@school.edu    / student123  (+9 more 10A)");
  console.log("           : aditya@school.edu   / student123  (+7 more 10B)");
  console.log(` Sessions  : ${totalSessions}`);
  console.log(` Records   : ${totalRecords}`);
  console.log("==================================================\n");

  await mongoose.disconnect();
};

run().catch((err) => { console.error("Seed failed:", err); process.exit(1); });
