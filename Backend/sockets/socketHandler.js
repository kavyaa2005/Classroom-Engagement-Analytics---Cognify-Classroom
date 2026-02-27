const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Session = require("../models/Session");
const EngagementRecord = require("../models/EngagementRecord");

let io = null;

/**
 * Initialise Socket.io on the HTTP server.
 * Call once from server.js.
 */
const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
    // Allow up to 100+ concurrent connections efficiently
    transports: ["websocket", "polling"],
  });

  // ── Auth middleware for every socket connection ──────────────────────────
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication required. No token."));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user || !user.isActive) {
        return next(new Error("User not found or deactivated."));
      }

      socket.user = user; // attach user to socket
      next();
    } catch (err) {
      next(new Error("Invalid or expired token."));
    }
  });

  // ── Connection handler ───────────────────────────────────────────────────
  io.on("connection", (socket) => {
    const user = socket.user;
    console.log(`🔌 Socket connected: ${user.name} (${user.role}) [${socket.id}]`);

    // ── Personal room (for targeted messages) ────────────────────────────
    socket.join(`user_${user._id}`);

    if (user.role === "teacher") {
      socket.join(`teacher_${user._id}`);
    }

    // ── Student joins a session room ──────────────────────────────────────
    socket.on("session:join_room", async ({ sessionId }) => {
      try {
        if (!sessionId) return;
        const session = await Session.findOne({ _id: sessionId, status: "active" });
        if (!session) {
          socket.emit("error", { message: "Session is not active." });
          return;
        }
        socket.join(`session_${sessionId}`);
        console.log(`   ↳ ${user.name} joined room session_${sessionId}`);

        // Notify teacher
        io.to(`teacher_${session.teacherId}`).emit("student:connected", {
          sessionId,
          studentId: user._id,
          name: user.name,
        });
      } catch (err) {
        console.error("socket session:join_room error:", err.message);
      }
    });

    // ── Teacher joins a session room to receive live updates ──────────────
    socket.on("teacher:join_session", async ({ sessionId }) => {
      try {
        if (!sessionId) return;
        if (user.role !== "teacher") {
          socket.emit("error", { message: "Only teachers can join teacher session room." });
          return;
        }
        const session = await Session.findOne({
          _id: sessionId,
          teacherId: user._id,
          status: "active",
        });
        if (!session) {
          socket.emit("error", { message: "Session not found." });
          return;
        }
        socket.join(`session_${sessionId}`);
        socket.emit("teacher:joined_session", { sessionId, message: "Joined session room." });
      } catch (err) {
        console.error("socket teacher:join_session error:", err.message);
      }
    });

    // ── Student leaves session room ───────────────────────────────────────
    socket.on("session:leave_room", async ({ sessionId }) => {
      try {
        socket.leave(`session_${sessionId}`);
        if (sessionId) {
          const session = await Session.findById(sessionId);
          if (session) {
            io.to(`teacher_${session.teacherId}`).emit("student:disconnected", {
              sessionId,
              studentId: user._id,
              name: user.name,
            });
          }
          // Mark student as inactive in session
          await Session.updateOne(
            { _id: sessionId, "students.studentId": user._id },
            {
              $set: {
                "students.$.isActive": false,
                "students.$.leftAt": new Date(),
              },
            }
          );
        }
      } catch (err) {
        console.error("socket session:leave_room error:", err.message);
      }
    });

    // ── Student submits engagement score (from AI analysis) ──────────────
    socket.on("engagement:submit", async ({ sessionId, engagementScore, state, confidence, flags: aiFlags }) => {
      try {
        if (!sessionId || engagementScore === undefined) return;

        // Resolve classroomId from session
        const sessionDoc = await Session.findById(sessionId).select("classroomId teacherId").lean();

        // Persist to DB
        await EngagementRecord.create({
          sessionId,
          studentId: user._id,
          classroomId: sessionDoc?.classroomId || null,
          engagementScore: parseFloat((engagementScore).toFixed(4)),
          state: state || "Unknown",
          confidence: confidence || 0,
          timestamp: new Date(),
        });

        // Forward to teacher's session room
        io.to(`session_${sessionId}`).emit("engagement:update", {
          studentId: user._id,
          name: user.name,
          engagementPercent: Math.round(engagementScore * 100),
          state: state || "Unknown",
          sessionId,
        });

        // Relay anti-spoof flags if any
        if (aiFlags?.no_face) {
          io.to(`session_${sessionId}`).emit("student:flagged", { studentId: user._id, name: user.name, flag: "no_face", sessionId });
        }
        if (aiFlags?.multiple_faces) {
          io.to(`session_${sessionId}`).emit("student:flagged", { studentId: user._id, name: user.name, flag: "multiple_faces", sessionId });
        }
      } catch (err) {
        console.error("socket engagement:submit error:", err.message);
      }
    });

    // ── Anti-spoof events from student client ─────────────────────────────
    socket.on("flag:no_face", async ({ sessionId }) => {
      await _addSessionFlag(sessionId, "no_face", user._id, "Client reported: no face detected.");
      io.to(`session_${sessionId}`).emit("student:flagged", {
        studentId: user._id,
        name: user.name,
        flag: "no_face",
        sessionId,
      });
    });

    socket.on("flag:multiple_faces", async ({ sessionId }) => {
      await _addSessionFlag(sessionId, "multiple_faces", user._id, "Client reported: multiple faces detected.");
      io.to(`session_${sessionId}`).emit("student:flagged", {
        studentId: user._id,
        name: user.name,
        flag: "multiple_faces",
        sessionId,
      });
    });

    socket.on("flag:camera_blackout", async ({ sessionId }) => {
      await _addSessionFlag(sessionId, "camera_blackout", user._id, "Camera feed lost.");
      io.to(`session_${sessionId}`).emit("student:flagged", {
        studentId: user._id,
        name: user.name,
        flag: "camera_blackout",
        sessionId,
      });
    });

    socket.on("flag:long_inactivity", async ({ sessionId }) => {
      await _addSessionFlag(sessionId, "long_inactivity", user._id, "Student inactive for extended period.");
      io.to(`session_${sessionId}`).emit("student:flagged", {
        studentId: user._id,
        name: user.name,
        flag: "long_inactivity",
        sessionId,
      });
    });

    // ── Disconnect ────────────────────────────────────────────────────────
    socket.on("disconnect", (reason) => {
      console.log(`🔌 Socket disconnected: ${user.name} (${reason})`);
    });
  });

  console.log("✅ Socket.io initialized.");
  return io;
};

/**
 * Helper: add a flag entry to a session document.
 */
const _addSessionFlag = async (sessionId, type, studentId, details) => {
  try {
    await Session.findByIdAndUpdate(sessionId, {
      $push: {
        flags: { type, studentId, timestamp: new Date(), details },
      },
    });
  } catch (err) {
    console.error(`Failed to add session flag (${type}):`, err.message);
  }
};

/**
 * Return the io instance — used in controllers to emit events.
 */
const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized. Call initSocket(server) first.");
  return io;
};

module.exports = { initSocket, getIO };
