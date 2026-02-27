require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const { initSocket } = require("./sockets/socketHandler");
const errorMiddleware = require("./middleware/errorMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const engagementRoutes = require("./routes/engagementRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const classroomRoutes = require("./routes/classroomRoutes");
const userRoutes = require("./routes/userRoutes");

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// ─── Middleware ────────────────────────────────────────────────────────────────

// CORS — allow the Vite frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// JSON body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Sanitize mongo queries
app.use(mongoSanitize());

// HTTP request logger (dev only)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Global rate limiter — 300 requests per 10 minutes per IP
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 300,
  message: { success: false, message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// ─── Routes ────────────────────────────────────────────────────────────────────

app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/engagement", engagementRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/classroom", classroomRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ success: true, message: "EngageAI backend is running." });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// Global error handler
app.use(errorMiddleware);

// ─── Start Server ───────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 EngageAI Backend running on port ${PORT}`);
  console.log(`🌐 Frontend allowed: ${process.env.FRONTEND_URL}`);
  console.log(`🤖 AI Service: ${process.env.AI_SERVICE_URL}\n`);
});
