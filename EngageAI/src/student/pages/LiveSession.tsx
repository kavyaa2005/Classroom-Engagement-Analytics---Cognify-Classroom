import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera,
  CameraOff,
  LogOut,
  Eye,
  AlertTriangle,
  Wifi,
  WifiOff,
  Users,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { connectSocket, disconnectSocket } from "../../services/socket";
import api from "../../services/api";

const AI_URL = "http://localhost:8001";
const CAPTURE_INTERVAL_MS = 3000;

interface AIResult {
  engagement_score: number;
  state: string;
  confidence: number;
  face_count: number;
  flags: { no_face: boolean; multiple_faces: boolean };
}

interface SessionInfo {
  subject: string;
  className: string;
}

const STATE_COLORS: Record<string, string> = {
  Attentive: "#10B981",
  Engaged:   "#10B981",
  Neutral:   "#F59E0B",
  Distracted:"#F87171",
  Inactive:  "#F87171",
  Unknown:   "#94A3B8",
};

export default function LiveSession() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [engagementScore, setEngagementScore] = useState<number | null>(null);
  const [engagementState, setEngagementState] = useState<string>("—");
  const [history, setHistory] = useState<{ time: string; score: number; state: string }[]>([]);
  const [alert, setAlert] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);

  // ─── Fetch session info ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!sessionId) return;
    api.get(`/api/session/${sessionId}`)
      .then(({ data }) => {
        const s = data.data.session;
        setSessionInfo({ subject: s.subject || "—", className: s.className || s.classroomId?.name || "—" });
      })
      .catch(() => setSessionInfo({ subject: "Live Session", className: "Class" }));
  }, [sessionId]);

  // ─── Socket setup ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!sessionId) return;
    const sock = connectSocket();

    sock.on("connect", () => {
      setSocketConnected(true);
      sock.emit("session:join_room", { sessionId });
    });
    sock.on("disconnect", () => setSocketConnected(false));

    // Teacher ended the session
    sock.on("session:ended", () => {
      setSessionEnded(true);
      stopCamera();
    });

    return () => {
      sock.off("connect");
      sock.off("disconnect");
      sock.off("session:ended");
    };
  }, [sessionId]);

  // ─── Camera ─────────────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOn(true); // triggers re-render → useEffect below wires stream to video
    } catch (err: unknown) {
      const msg = (err as Error).name === "NotAllowedError"
        ? "Camera permission denied. Please allow camera access."
        : "Could not access camera. Check your device settings.";
      setCameraError(msg);
    }
  }, []);

  // Wire stream to <video> element once cameraOn becomes true
  useEffect(() => {
    if (cameraOn && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraOn]);

  const stopCamera = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  }, []);

  // ─── AI capture loop ────────────────────────────────────────────────────────
  const captureAndAnalyze = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !sessionId) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState < 2) return; // not ready yet

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      setAnalyzing(true);
      try {
        const form = new FormData();
        form.append("file", blob, "frame.jpg");
        const res = await fetch(`${AI_URL}/predict`, { method: "POST", body: form });
        const result: AIResult = await res.json();

        const pct = Math.round(result.engagement_score * 100);
        setEngagementScore(pct);
        setEngagementState(result.state);

        // History
        const timeLabel = new Date().toLocaleTimeString("en-US", {
          hour: "2-digit", minute: "2-digit", hour12: false,
        });
        setHistory((prev) => [...prev.slice(-19), { time: timeLabel, score: pct, state: result.state }]);

        // Alerts
        if (result.flags.no_face) {
          setAlert("⚠️ No face detected — make sure your face is visible.");
        } else if (result.flags.multiple_faces) {
          setAlert("⚠️ Multiple faces detected — only you should be in frame.");
        } else {
          setAlert(null);
        }

        // Emit to backend via socket
        const sock = connectSocket();
        sock.emit("engagement:submit", {
          sessionId,
          engagementScore: result.engagement_score,
          state: result.state,
          confidence: result.confidence,
          flags: result.flags,
        });
      } catch {
        // AI service offline — skip silently
      } finally {
        setAnalyzing(false);
      }
    }, "image/jpeg", 0.8);
  }, [sessionId]);

  useEffect(() => {
    if (cameraOn) {
      intervalRef.current = setInterval(captureAndAnalyze, CAPTURE_INTERVAL_MS);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [cameraOn, captureAndAnalyze]);

  // ─── Leave session ──────────────────────────────────────────────────────────
  const handleLeave = () => {
    stopCamera();
    disconnectSocket();
    navigate("/student");
  };

  const engagementColor = engagementScore !== null
    ? engagementScore >= 75 ? "#10B981" : engagementScore >= 45 ? "#F59E0B" : "#F87171"
    : "#94A3B8";

  if (sessionEnded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F0FDF4] to-[#F8FAFC] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[24px] p-10 max-w-sm w-full text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
        >
          <CheckCircle2 className="w-16 h-16 text-[#10B981] mx-auto mb-4" />
          <h2 className="text-[22px] font-bold text-[#1E293B] mb-2">Session Ended</h2>
          <p className="text-[#64748B] mb-6">Your teacher has ended this session. Great work today!</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/student")}
            className="w-full py-3 rounded-[12px] bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-semibold"
          >
            Back to Dashboard
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pt-safe">
      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Bar */}
      <div className="bg-[#1E293B] border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-[8px] bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[15px] font-semibold">{sessionInfo?.subject || "Live Session"}</p>
            <p className="text-[12px] text-[#94A3B8]">{sessionInfo?.className}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-1.5 text-[12px] ${socketConnected ? "text-[#10B981]" : "text-[#F87171]"}`}>
            {socketConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span>{socketConnected ? "Connected" : "Disconnected"}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLeave}
            className="flex items-center gap-2 px-4 py-2 bg-[#F87171]/20 text-[#F87171] rounded-[10px] text-[13px] font-medium"
          >
            <LogOut className="w-4 h-4" />
            Leave
          </motion.button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Camera feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative bg-[#1E293B] rounded-[18px] overflow-hidden aspect-video">
            {/* Video is ALWAYS rendered so videoRef is always available */}
            <video
              ref={videoRef}
              className={`w-full h-full object-cover ${cameraOn ? "" : "hidden"}`}
              autoPlay
              playsInline
              muted
            />

            {/* Placeholder when camera is off */}
            {!cameraOn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <CameraOff className="w-16 h-16 text-[#475569] mb-3" />
                <p className="text-[#64748B] text-[14px]">Camera is off</p>
                {cameraError && (
                  <p className="text-[#F87171] text-[13px] mt-2 max-w-xs text-center px-4">{cameraError}</p>
                )}
              </div>
            )}

            {/* Live indicator */}
            {cameraOn && (
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-[#F87171] px-3 py-1.5 rounded-full">
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 bg-white rounded-full"
                />
                <span className="text-white text-[11px] font-bold tracking-wide">LIVE</span>
              </div>
            )}

            {/* Analyzing pulse */}
            {analyzing && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#8B5CF6]/80 px-3 py-1.5 rounded-full">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="w-2 h-2 bg-white rounded-full"
                />
                <span className="text-white text-[11px] font-medium">Analyzing</span>
              </div>
            )}

            {/* Engagement overlay on video */}
            {cameraOn && engagementScore !== null && (
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-[8px]">
                <p className="text-[11px] text-white/70">Engagement</p>
                <p className="text-[20px] font-bold" style={{ color: engagementColor }}>{engagementScore}%</p>
              </div>
            )}
          </div>

          {/* Alert */}
          <AnimatePresence>
            {alert && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 bg-[#FEF3C7] text-[#92400E] rounded-[12px] px-4 py-3 text-[13px]"
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-[#F59E0B]" />
                {alert}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Camera control */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={cameraOn ? stopCamera : startCamera}
            className={`w-full py-3.5 rounded-[14px] font-semibold flex items-center justify-center gap-2 text-[15px] ${
              cameraOn
                ? "bg-[#F87171]/20 text-[#F87171] border border-[#F87171]/30"
                : "bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white"
            }`}
          >
            {cameraOn ? (
              <><CameraOff className="w-5 h-5" /> Turn Off Camera</>
            ) : (
              <><Camera className="w-5 h-5" /> Enable Camera & Start Engagement Tracking</>
            )}
          </motion.button>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Engagement gauge */}
          <motion.div
            className="bg-[#1E293B] rounded-[18px] p-6 text-center"
          >
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-4 h-4 text-[#94A3B8]" />
              <span className="text-[13px] text-[#94A3B8] font-medium">Your Engagement</span>
            </div>

            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#334155" strokeWidth="10" />
                <motion.circle
                  cx="60" cy="60" r="50"
                  fill="none"
                  stroke={engagementColor}
                  strokeWidth="10"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 314" }}
                  animate={{ strokeDasharray: `${((engagementScore ?? 0) / 100) * 314} 314` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[28px] font-bold" style={{ color: engagementColor }}>
                  {engagementScore !== null ? `${engagementScore}%` : "—"}
                </span>
              </div>
            </div>

            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold"
              style={{
                backgroundColor: `${STATE_COLORS[engagementState] || "#94A3B8"}22`,
                color: STATE_COLORS[engagementState] || "#94A3B8",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATE_COLORS[engagementState] || "#94A3B8" }} />
              {engagementState}
            </div>
          </motion.div>

          {/* Live history bars */}
          <div className="bg-[#1E293B] rounded-[18px] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-[#94A3B8]" />
              <span className="text-[13px] text-[#94A3B8] font-medium">Engagement Timeline</span>
            </div>
            {history.length === 0 ? (
              <p className="text-[#475569] text-[12px] text-center py-4">
                Enable camera to begin tracking
              </p>
            ) : (
              <div className="flex items-end gap-1 h-20">
                {history.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    className="flex-1 rounded-t-sm origin-bottom"
                    style={{
                      height: `${Math.max(h.score, 8)}%`,
                      backgroundColor: h.score >= 75 ? "#10B981" : h.score >= 45 ? "#F59E0B" : "#F87171",
                      opacity: i === history.length - 1 ? 1 : 0.5 + (i / history.length) * 0.5,
                    }}
                    title={`${h.time}: ${h.score}%`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Session info card */}
          <div className="bg-[#1E293B] rounded-[18px] p-5">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-[#94A3B8]" />
              <span className="text-[13px] text-[#94A3B8] font-medium">Session Info</span>
            </div>
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Class</span>
                <span className="text-white font-medium">{sessionInfo?.className || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Subject</span>
                <span className="text-white font-medium">{sessionInfo?.subject || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Readings taken</span>
                <span className="text-white font-medium">{history.length}</span>
              </div>
              {history.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Session avg</span>
                  <span className="font-semibold" style={{ color: engagementColor }}>
                    {Math.round(history.reduce((s, h) => s + h.score, 0) / history.length)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
