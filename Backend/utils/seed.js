/**
 * Seed script — populates the MongoDB database with initial data.
 * Run: node utils/seed.js
 *
 * Creates:
 *   - 1 Admin
 *   - 2 Teachers
 *   - 10 Students
 *   - 2 Classrooms
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const User = require("../models/User");
const Classroom = require("../models/Classroom");

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/engageai";

const run = async () => {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Clear existing data
  await User.deleteMany({});
  await Classroom.deleteMany({});
  console.log("🗑️  Cleared existing users and classrooms");

  // ── Admin ────────────────────────────────────────────────────────────────
  const admin = await User.create({
    name: "Admin User",
    email: "admin@school.edu",
    password: "admin123",
    role: "admin",
  });
  console.log("✅ Admin created:", admin.email);

  // ── Teachers ─────────────────────────────────────────────────────────────
  const teacher1 = await User.create({
    name: "Ms. Kavya Sharma",
    email: "kavya@school.edu",
    password: "teacher123",
    role: "teacher",
    subject: "Mathematics",
  });

  const teacher2 = await User.create({
    name: "Mr. Arjun Mehta",
    email: "arjun@school.edu",
    password: "teacher123",
    role: "teacher",
    subject: "Physics",
  });
  console.log("✅ Teachers created:", teacher1.email, teacher2.email);

  // ── Classrooms ────────────────────────────────────────────────────────────
  const classroom1 = await Classroom.create({
    name: "Class 10A",
    section: "A",
    subject: "Mathematics",
    teacherId: teacher1._id,
  });

  const classroom2 = await Classroom.create({
    name: "Class 10B",
    section: "B",
    subject: "Physics",
    teacherId: teacher2._id,
  });
  console.log("✅ Classrooms created:", classroom1.name, classroom2.name);

  // ── Students ──────────────────────────────────────────────────────────────
  const studentData = [
    { name: "Aarav Patel", email: "aarav@school.edu", roll: "10A-001" },
    { name: "Ananya Singh", email: "ananya@school.edu", roll: "10A-002" },
    { name: "Rohan Gupta", email: "rohan@school.edu", roll: "10A-003" },
    { name: "Priya Nair", email: "priya@school.edu", roll: "10A-004" },
    { name: "Karan Joshi", email: "karan@school.edu", roll: "10A-005" },
    { name: "Sneha Reddy", email: "sneha@school.edu", roll: "10A-006" },
    { name: "Rahul Verma", email: "rahul@school.edu", roll: "10A-007" },
    { name: "Divya Iyer", email: "divya@school.edu", roll: "10A-008" },
    { name: "Aryan Kapoor", email: "aryan@school.edu", roll: "10A-009" },
    { name: "Meera Pillai", email: "meera@school.edu", roll: "10A-010" },
  ];

  const students = [];
  for (const s of studentData) {
    const student = await User.create({
      name: s.name,
      email: s.email,
      password: "student123",
      role: "student",
      classroomId: classroom1._id,
      rollNumber: s.roll,
    });
    students.push(student);
  }

  // Attach students to classroom
  classroom1.students = students.map((s) => s._id);
  classroom1.stats.totalStudents = students.length;
  await classroom1.save();

  console.log(`✅ ${students.length} students created and assigned to ${classroom1.name}`);

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Seed complete! Login credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Admin    → admin@school.edu        / admin123
 Teacher1 → kavya@school.edu        / teacher123
 Teacher2 → arjun@school.edu        / teacher123
 Student  → aarav@school.edu        / student123
            (all students use)        student123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
