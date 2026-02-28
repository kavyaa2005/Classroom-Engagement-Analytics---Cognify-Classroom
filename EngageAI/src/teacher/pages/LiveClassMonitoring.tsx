import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Square,
  Users,
  Clock,
  Smile,
  Meh,
  Frown,
  Lightbulb,
  X,
  Activity,
  Copy,
  Check,
  BookOpen,
} from "lucide-react";
import api from "../../services/api";
import { connectSocket, disconnectSocket } from "../../services/socket";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TimelinePoint {
  time: string;
  engagement: number;
  emotion: string;
}

interface EmotionBar {
  icon: typeof Smile;
  label: string;
  value: number;
  color: string;
}

// ─── Static Suggestions ───────────────────────────────────────────────────────
const suggestions = [
  {
    text: "Engagement dropped in last 5 minutes. Try asking a question.",
    actions: ["Start Quick Poll", "Show Quiz"],
  },
  {
    text: "Students are highly focused! This is a great time for complex topics.",
    actions: ["Continue", "Acknowledge"],
  },
  {
    text: "Consider a 2-minute break to refresh attention.",
    actions: ["Start Break Timer", "Ignore"],
  },
];

export function LiveClassMonitoring() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentEngagement, setCurrentEngagement] = useState(78);
  const [showSuggestion, setShowSuggestion] = useState(true);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);

  // ─── Start modal state ─────────────────────────────────────────────────────
  const [showStartModal, setShowStartModal] = useState(false);
  const [modalClassName, setModalClassName] = useState("");
  const [modalSubject, setModalSubject] = useState("");
  const [modalError, setModalError] = useState("");
  const [joinCode, setJoinCode] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // ─── Dynamic state ─────────────────────────────────────────────────────────
  const [classroomLabel, setClassroomLabel] = useState("Loading classroom...");
  const [sessionTime, setSessionTime] = useState("-- : --");
  const [connectedStudents, setConnectedStudents] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [classroom, setClassroom] = useState<{
    _id: string;
    name: string;
    section: string;
    subject: string;
    students: { _id: string; name: string; email: string }[];
  } | null>(null);
  const [timelineData, setTimelineData] = useState<TimelinePoint[]>([]);
  const [liveStudentMap, setLiveStudentMap] = useState<Record<string, { score: number; state: string }>>({});  // Tracks every student who joined live (name keyed by studentId) — persists even if not pre-assigned
  const [liveRoster, setLiveRoster] = useState<Record<string, { name: string; online: boolean }>>({});   const [emotions, setEmotions] = useState<EmotionBar[]>([
    { icon: Smile, label: "Engaged", value: 65, color: "#10B981" },
    { icon: Meh,   label: "Neutral", value: 25, color: "#F59E0B" },
    { icon: Frown, label: "Confused", value: 10, color: "#F87171" },
  ]);

  // Per-student tracking refs (not state — avoids stale closure in socket listener)
  const studentEngagements = useRef<Record<string, number>>({});
  const studentStates = useRef<Record<string, string>>({});
  const lastTimelineAt = useRef<number>(0);

  // ─── Fetch classroom on mount ───────────────────────────────────────────────
  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const { data } = await api.get("/api/classroom/my");
        const classrooms = data.data.classrooms as {
          _id: string; name: string; section: string; subject: string; students: unknown[];
        }[];
        if (classrooms && classrooms.length > 0) {
          const cls = classrooms[0] as { _id: string; name: string; section: string; subject: string; students: { _id: string; name: string; email: string }[] };
          setClassroom(cls);
          const label = [cls.name, cls.section].filter(Boolean).join(" ") +
            (cls.subject ? " - " + cls.subject : "");
          setClassroomLabel(label);
          // Pre-fill modal inputs
          setModalClassName([cls.name, cls.section].filter(Boolean).join(" "));
          setModalSubject(cls.subject || "");
        } else {
          setClassroomLabel("No classroom assigned");
        }
      } catch {
        setClassroomLabel("Class (offline)");
      }
    };
    fetchClassroom();
  }, []);

  // ─── Recompute emotion bars from latest student states ─────────────────────
  const recomputeEmotions = useCallback(() => {
    const states = Object.values(studentStates.current);
    const total = states.length || 1;
    const engaged = states.filter((s) => s === "Attentive").length;
    const neutral  = states.filter((s) => s === "Neutral").length;
    const confused = states.filter((s) => s === "Distracted" || s === "Inactive").length;
    setEmotions([
      { icon: Smile, label: "Engaged",  value: Math.round((engaged / total) * 100), color: "#10B981" },
      { icon: Meh,   label: "Neutral",  value: Math.round((neutral  / total) * 100), color: "#F59E0B" },
      { icon: Frown, label: "Confused", value: Math.round((confused / total) * 100), color: "#F87171" },
    ]);
  }, []);

  // ─── Start monitoring ───────────────────────────────────────────────────────
  const handleStartMonitoring = useCallback(async () => {
    if (!modalClassName.trim() || !modalSubject.trim()) {
      setModalError("Please enter both class name and subject.");
      return;
    }
    setModalError("");
    try {
      const { data } = await api.post("/api/session/start", {
        classroomId: classroom?._id,
        subject: modalSubject.trim(),
        className: modalClassName.trim(),
        title: `${modalClassName.trim()} — ${new Date().toLocaleDateString()}`,
      });
      const newSessionId: string = data.data.session._id;
      const code: string = data.data.session.joinCode;
      setSessionId(newSessionId);
      setJoinCode(code);
      setConnectedStudents(0);
      studentEngagements.current = {};
      studentStates.current = {};
      setTimelineData([]);
      setLiveStudentMap({});
      setLiveRoster({});
      lastTimelineAt.current = 0;
      setShowStartModal(false);

      // Update top bar label
      const label = `${modalClassName.trim()} — ${modalSubject.trim()}`;
      setClassroomLabel(label);

      // Set session time display
      const fmt = (d: Date) =>
        d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
      setSessionTime(`${fmt(new Date())} - Ongoing`);

      // Connect socket and join the session room
      const sock = connectSocket();
      sock.emit("teacher:join_session", { sessionId: newSessionId });

      // Listen for per-student engagement updates
      sock.on("engagement:update", (payload: {
        studentId: string;
        name?: string;
        engagementPercent: number;
        state: string;
      }) => {
        // Seed live roster with name in case student:connected was missed
        if (payload.name) {
          setLiveRoster(prev => ({
            ...prev,
            [payload.studentId]: { name: payload.name!, online: true },
          }));
        }
        studentEngagements.current[payload.studentId] = payload.engagementPercent;
        studentStates.current[payload.studentId]      = payload.state;

        // Class average engagement
        const scores = Object.values(studentEngagements.current);
        const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        setCurrentEngagement(avg);

        // Live per-student map for the student grid
        setLiveStudentMap(prev => ({
          ...prev,
          [payload.studentId]: { score: payload.engagementPercent, state: payload.state },
        }));

        // Append to timeline at most once every 10 seconds
        const now = Date.now();
        if (now - lastTimelineAt.current > 10_000) {
          lastTimelineAt.current = now;
          const label = new Date().toLocaleTimeString("en-US", {
            hour: "2-digit", minute: "2-digit", hour12: false,
          });
          setTimelineData((prev) => [
            ...prev.slice(-11),
            { time: label, engagement: avg, emotion: payload.state.toLowerCase() },
          ]);
        }

        recomputeEmotions();
      });

      // Student join / leave
      sock.on("student:connected", (p: { studentId: string; name: string }) => {
        setConnectedStudents((n) => n + 1);
        setLiveRoster(prev => ({
          ...prev,
          [p.studentId]: { name: p.name, online: true },
        }));
      });
      sock.on("student:disconnected", (p: { studentId: string; name?: string }) => {
        setConnectedStudents((n) => Math.max(0, n - 1));
        delete studentEngagements.current[p.studentId];
        delete studentStates.current[p.studentId];
        setLiveRoster(prev => prev[p.studentId]
          ? { ...prev, [p.studentId]: { ...prev[p.studentId], online: false } }
          : prev
        );
      });

      setIsMonitoring(true);
    } catch (err) {
      console.error("[LiveMonitoring] Failed to start session:", err);
      setModalError("Failed to start session. Please try again.");
    }
  }, [classroom, modalClassName, modalSubject, recomputeEmotions]);

  // ─── End monitoring ─────────────────────────────────────────────────────────
  const handleEndMonitoring = useCallback(async () => {
    if (sessionId) {
      try {
        await api.post("/api/session/end", { sessionId });
      } catch (err) {
        console.error("[LiveMonitoring] Failed to end session:", err);
      }
    }
    disconnectSocket();
    setSessionId(null);
    setJoinCode(null);
    setIsMonitoring(false);
    setConnectedStudents(0);
    studentEngagements.current = {};
    studentStates.current = {};
    setLiveStudentMap({});
    setLiveRoster({});
  }, [sessionId]);

  const getStateColor = (state: string) => {
    if (state === "Attentive") return "#10B981";
    if (state === "Neutral") return "#F59E0B";
    if (state === "Distracted") return "#F97316";
    if (state === "Inactive") return "#F87171";
    return "#CBD5E1";
  };

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 75) return "#10B981";
    if (engagement >= 50) return "#F59E0B";
    return "#F87171";
  };

  const getEngagementMessage = (engagement: number) => {
    if (engagement >= 75) return "Students are highly focused!";
    if (engagement >= 50) return "Attention is stable.";
    return "Consider interactive activity.";
  };

  const currentSuggestion = suggestions[currentSuggestionIndex];

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto pt-16 lg:pt-8">

      {/* ── Start Session Modal ── */}
      <AnimatePresence>
        {showStartModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[18px] p-8 w-full max-w-md mx-4 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-[18px] font-semibold text-[#1E293B]">Start a Session</h2>
                  <p className="text-[13px] text-[#64748B]">Students will use the generated code to join</p>
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-[13px] font-medium text-[#64748B] mb-1.5 block">
                    <BookOpen className="w-4 h-4 inline mr-1" />Class Name
                  </label>
                  <input
                    type="text"
                    value={modalClassName}
                    onChange={(e) => setModalClassName(e.target.value)}
                    placeholder="e.g. Grade 10 A"
                    className="w-full px-4 py-3 bg-[#F8FAFC] rounded-[12px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#10B981] text-[14px]"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-medium text-[#64748B] mb-1.5 block">
                    <Activity className="w-4 h-4 inline mr-1" />Subject
                  </label>
                  <input
                    type="text"
                    value={modalSubject}
                    onChange={(e) => setModalSubject(e.target.value)}
                    placeholder="e.g. Mathematics"
                    className="w-full px-4 py-3 bg-[#F8FAFC] rounded-[12px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#10B981] text-[14px]"
                  />
                </div>
                {modalError && (
                  <p className="text-[13px] text-red-500 bg-red-50 rounded-[8px] px-3 py-2">{modalError}</p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowStartModal(false); setModalError(""); }}
                  className="flex-1 px-4 py-3 bg-[#F8FAFC] text-[#64748B] rounded-[12px] font-medium hover:bg-[#F1F5F9] transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartMonitoring}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-[12px] font-medium"
                >
                  Start Session
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[18px] p-6 mb-8"
        style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-semibold text-[#1E293B] mb-1">
              {classroomLabel}
            </h1>
            <div className="flex items-center gap-4 text-[14px] text-[#64748B]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{sessionTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{connectedStudents} Students</span>
              </div>
            </div>
          </div>
          {/* Join code badge (visible when session is active) */}
          <div className="flex items-center gap-4">
            {isMonitoring && joinCode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 bg-[#EFF6FF] border border-[#BFDBFE] rounded-[12px] px-4 py-2"
              >
                <div className="text-right">
                  <p className="text-[11px] text-[#64748B] font-medium">JOIN CODE</p>
                  <p className="text-[20px] font-bold text-[#2563EB] tracking-widest">{joinCode}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    navigator.clipboard.writeText(joinCode);
                    setCodeCopied(true);
                    setTimeout(() => setCodeCopied(false), 2000);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-[8px] bg-[#2563EB] text-white"
                  title="Copy code"
                >
                  {codeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </motion.button>
              </motion.div>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isMonitoring ? handleEndMonitoring : () => setShowStartModal(true)}
              className={`px-8 py-4 rounded-[12px] font-semibold text-white transition-all duration-500 ${
                isMonitoring
                  ? "bg-gradient-to-r from-[#F87171] to-[#EF4444]"
                  : "bg-gradient-to-r from-[#10B981] to-[#059669]"
              }`}
            >
              {isMonitoring ? (
                <span className="flex items-center gap-2">
                  <Square className="w-5 h-5" />
                  End Monitoring
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Start Monitoring
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Video & Engagement Meter */}
        <div className="lg:col-span-2 space-y-8">
          {/* Student Engagement Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[18px] p-6"
            style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <h2 className="text-[18px] font-semibold text-[#1E293B]">Class Roster</h2>
                <span className="text-[12px] text-[#64748B] bg-[#F1F5F9] rounded-full px-2.5 py-0.5">
                  {(classroom?.students?.length ?? 0) + Object.keys(liveRoster).filter(id => !(classroom?.students ?? []).find(s => s._id === id)).length} students
                </span>
              </div>
              {isMonitoring && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#ECFDF5] rounded-full"
                >
                  <motion.div
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 bg-[#10B981] rounded-full"
                  />
                  <span className="text-[12px] font-medium text-[#059669]">AI Monitoring Active</span>
                </motion.div>
              )}
            </div>

            {/* Roster grid */}
            {(() => {
              // Merge pre-assigned students with live-joined students (joined via code)
              const preAssigned = classroom?.students ?? [];
              const preAssignedIds = new Set(preAssigned.map((s) => s._id));
              const liveOnly = Object.entries(liveRoster)
                .filter(([id]) => !preAssignedIds.has(id))
                .map(([id, info]) => ({ _id: id, name: info.name, email: "" }));
              const allStudents = [...preAssigned, ...liveOnly];
              return allStudents.length > 0 || isMonitoring ? (allStudents.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                {allStudents.map((student, idx) => {
                  const live = liveStudentMap[student._id];
                  const rosterEntry = liveRoster[student._id];
                  const isOffline = rosterEntry ? !rosterEntry.online : false;
                  const initials = student.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  const color = isOffline ? "#CBD5E1" : live ? getStateColor(live.state) : isMonitoring ? "#CBD5E1" : "#E2E8F0";
                  const stateLabel = isOffline ? "Offline" : live ? live.state : isMonitoring ? "Connecting…" : "Ready";
                  const score = live ? live.score : null;
                  return (
                    <motion.div
                      key={student._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.04 }}
                      className="relative flex flex-col items-center gap-2 rounded-[14px] p-3 border-2 transition-all duration-500"
                      style={{
                        borderColor: color,
                        background: live ? `${color}10` : "#F8FAFC",
                      }}
                    >
                      {/* Avatar */}
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-[15px] flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
                      >
                        {initials}
                      </div>

                      {/* Name */}
                      <p className="text-[12px] font-semibold text-[#1E293B] text-center leading-tight w-full truncate">
                        {student.name.split(" ")[0]}
                      </p>

                      {/* Score */}
                      {score !== null ? (
                        <motion.span
                          key={score}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="text-[16px] font-bold"
                          style={{ color }}
                        >
                          {score}%
                        </motion.span>
                      ) : (
                        <span className="text-[13px] text-[#94A3B8]">—</span>
                      )}

                      {/* State badge */}
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: `${color}20`, color }}
                      >
                        {stateLabel}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              // Monitoring active but no students have joined yet
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="w-12 h-12 text-[#CBD5E1] mb-3" />
                <p className="text-[15px] font-medium text-[#64748B]">Waiting for students…</p>
                <p className="text-[13px] text-[#94A3B8] mt-1">Students will appear here as they join the session</p>
              </div>
            )) : (
              // Not monitoring and no students at all
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="w-12 h-12 text-[#CBD5E1] mb-3" />
                <p className="text-[15px] font-medium text-[#64748B]">No students yet</p>
                <p className="text-[13px] text-[#94A3B8] mt-1">Start monitoring and share the join code with your class</p>
              </div>
            );
            })()}

            {/* Attention Waveform during monitoring */}
            {isMonitoring && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-5 pt-4 border-t border-[#F1F5F9]"
              >
                <p className="text-[11px] text-[#94A3B8] mb-2 font-medium uppercase tracking-wide">Live Signal</p>
                <div className="flex items-center gap-[3px] h-10">
                  {[...Array(36)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-full"
                      style={{ backgroundColor: getEngagementColor(currentEngagement) }}
                      animate={{
                        height: [
                          `${Math.random() * 50 + 20}%`,
                          `${Math.random() * 50 + 20}%`,
                        ],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.04,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Engagement Meter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[18px] p-8"
            style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
          >
            <h2 className="text-[18px] font-semibold text-[#1E293B] mb-6 text-center">
              Class Engagement
            </h2>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="#F8FAFC"
                    strokeWidth="12"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke={getEngagementColor(currentEngagement)}
                    strokeWidth="12"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 502" }}
                    animate={{
                      strokeDasharray: `${
                        (currentEngagement / 100) * 502
                      } 502`,
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <motion.span
                    key={currentEngagement}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-[40px] font-bold"
                    style={{ color: getEngagementColor(currentEngagement) }}
                  >
                    {currentEngagement}%
                  </motion.span>
                  <span className="text-[14px] text-[#64748B]">Engagement</span>
                </div>
              </div>
            </div>
            <p
              className="text-center text-[16px] font-medium"
              style={{ color: getEngagementColor(currentEngagement) }}
            >
              {getEngagementMessage(currentEngagement)}
            </p>
          </motion.div>

          {/* Engagement Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-[18px] p-6"
            style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
          >
            <h2 className="text-[18px] font-semibold text-[#1E293B] mb-4">
              Engagement Timeline
            </h2>
            <div className="flex gap-2">
              {timelineData.map((item, index) => (
                <div key={index} className="flex-1">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="h-24 rounded-t-lg relative group cursor-pointer origin-bottom"
                    style={{
                      backgroundColor: getEngagementColor(item.engagement),
                      height: `${item.engagement}%`,
                      minHeight: "40px",
                    }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1E293B] text-white px-3 py-2 rounded-lg text-[12px] whitespace-nowrap z-10">
                      <div className="font-semibold">{item.time}</div>
                      <div>{item.engagement}% Engaged</div>
                      <div className="capitalize">{item.emotion}</div>
                    </div>
                  </motion.div>
                  <div className="text-[10px] text-[#64748B] text-center mt-2">
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - AI Assistant */}
        <div className="lg:col-span-1">
          <AnimatePresence>
            {showSuggestion && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-[18px] p-6 sticky top-8"
                style={{
                  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[18px] font-semibold text-[#1E293B] flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-[#F59E0B]" />
                    AI Teaching Assistant
                  </h2>
                  <button
                    onClick={() => setShowSuggestion(false)}
                    className="text-[#64748B] hover:text-[#1E293B] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* AI Avatar */}
                <div className="flex justify-center mb-6">
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative"
                  >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2563EB] to-[#0D9488] flex items-center justify-center">
                      <Lightbulb className="w-12 h-12 text-white" />
                    </div>
                    {/* Blinking effect */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className="absolute inset-0 rounded-full bg-[#2563EB] opacity-20"
                    />
                  </motion.div>
                </div>

                {/* Speech Bubble */}
                <motion.div
                  key={currentSuggestionIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#EFF6FF] rounded-[12px] p-4 mb-6 relative"
                >
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
                    <div
                      className="w-0 h-0"
                      style={{
                        borderLeft: "8px solid transparent",
                        borderRight: "8px solid transparent",
                        borderBottom: "8px solid #EFF6FF",
                      }}
                    />
                  </div>
                  <p className="text-[14px] text-[#1E293B]">
                    {currentSuggestion.text}
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {currentSuggestion.actions.map((action, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        console.log(`Action: ${action}`);
                        setCurrentSuggestionIndex(
                          (currentSuggestionIndex + 1) % suggestions.length
                        );
                      }}
                      className={`w-full px-4 py-3 rounded-[12px] font-medium transition-all duration-300 ${
                        index === 0
                          ? "bg-gradient-to-r from-[#2563EB] to-[#0D9488] text-white hover:shadow-lg"
                          : "bg-[#F8FAFC] text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                      }`}
                    >
                      {action}
                    </motion.button>
                  ))}
                </div>

                {/* Emotion Distribution */}
                <div className="mt-8 pt-6 border-t border-[#F8FAFC]">
                  <h3 className="text-[14px] font-semibold text-[#1E293B] mb-4">
                    Current Emotions
                  </h3>
                  <div className="space-y-3">
                    {emotions.map((emotion, index) => {
                      const Icon = emotion.icon;
                      return (
                        <div key={index} className="flex items-center gap-3">
                          <Icon
                            className="w-5 h-5 flex-shrink-0"
                            style={{ color: emotion.color }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[12px] text-[#64748B]">
                                {emotion.label}
                              </span>
                              <span className="text-[12px] font-semibold text-[#1E293B]">
                                {emotion.value}%
                              </span>
                            </div>
                            <div className="h-2 bg-[#F8FAFC] rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${emotion.value}%` }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: emotion.color }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}