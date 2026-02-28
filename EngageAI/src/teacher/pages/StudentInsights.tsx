import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  CheckCircle,
  X,
  Smile,
  Meh,
  Frown,
  BookOpen,
  BarChart2,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useFetch } from "../../hooks/useFetch";

// ── API types ──────────────────────────────────────────────────────────────────
interface ClassroomData {
  classrooms: { _id: string; name: string; section: string; subject: string }[];
}

interface ClassStudent {
  studentId: string;
  name: string;
  rollNumber: string;
  avgEngagement: number;
  sessionsAttended: number;
}

interface ClassAnalytics {
  classAverage: number;
  totalSessions: number;
  students: ClassStudent[];
}

interface StudentDetail {
  student: { _id: string; name: string; email: string; rollNumber: string };
  overallAverage: number;
  weeklyTrend: { week: number; engagement: number }[];
  stateDistribution: { state: string; count: number }[];
  sessionHistory: {
    sessionId: string;
    subject: string;
    title: string;
    date: number;
    avgEngagement: number;
    frameCount: number;
  }[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function getRiskLevel(eng: number): "high" | "medium" | "low" {
  return eng < 50 ? "high" : eng < 70 ? "medium" : "low";
}

function getTrend(eng: number, avg: number): "up" | "down" | "stable" {
  return eng > avg + 5 ? "up" : eng < avg - 5 ? "down" : "stable";
}

function getRiskColor(risk: string) {
  return risk === "high" ? "#F87171" : risk === "medium" ? "#F59E0B" : "#10B981";
}

function getRiskBgColor(risk: string) {
  return risk === "high" ? "#FEF2F2" : risk === "medium" ? "#FEF9F3" : "#F0FDF4";
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function StudentInsights() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedStudentName, setSelectedStudentName] = useState("");

  const { data: classroomData } = useFetch<ClassroomData>("/api/classroom/my");
  const classroomId = classroomData?.classrooms?.[0]?._id ?? null;
  const { data: classData, loading } = useFetch<ClassAnalytics>(
    classroomId ? `/api/analytics/class/${classroomId}` : null
  );

  // Fetch real per-student detail when modal opens
  const { data: studentDetail, loading: detailLoading } = useFetch<StudentDetail>(
    selectedStudentId ? `/api/analytics/student/${selectedStudentId}` : null
  );

  const classAvg = classData?.classAverage ?? 0;
  const students: ClassStudent[] = classData?.students ?? [];

  // Summary counts
  const highRisk = students.filter((s) => s.avgEngagement < 50).length;
  const mediumRisk = students.filter((s) => s.avgEngagement >= 50 && s.avgEngagement < 70).length;
  const onTrack = students.filter((s) => s.avgEngagement >= 70).length;

  // Modal computed values — use real API data
  const modalEngagement =
    studentDetail?.overallAverage ??
    students.find((s) => s.studentId === selectedStudentId)?.avgEngagement ??
    0;

  const trendChartData =
    studentDetail?.weeklyTrend
      ?.slice()
      .reverse()
      .slice(0, 8)
      .reverse()
      .map((w) => ({ date: formatDate(w.week), value: w.engagement })) ?? [];

  const totalStateCount =
    studentDetail?.stateDistribution?.reduce((s, d) => s + d.count, 0) ?? 1;

  const getStatePercent = (state: string) => {
    const found = studentDetail?.stateDistribution?.find(
      (d) => d.state.toLowerCase() === state
    );
    return found ? Math.round((found.count / totalStateCount) * 100) : 0;
  };

  const openModal = (s: ClassStudent) => {
    setSelectedStudentName(s.name);
    setSelectedStudentId(s.studentId);
  };

  const closeModal = () => {
    setSelectedStudentId(null);
    setSelectedStudentName("");
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="w-5 h-5 text-[#10B981]" />;
    if (trend === "down") return <TrendingDown className="w-5 h-5 text-[#F87171]" />;
    return <Minus className="w-5 h-5 text-[#64748B]" />;
  };

  const getRecommendation = (eng: number) => {
    if (eng < 50) return "Schedule a one-on-one session. Consider peer support.";
    if (eng < 70) return "Monitor closely. Provide additional practice materials.";
    return "Doing well! Continue current teaching approach.";
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-[28px] font-semibold text-[#1E293B] mb-2">
          Student Insights
        </h1>
        <p className="text-[16px] text-[#64748B]">
          Track individual student engagement and identify those who need support.
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "High Risk",    value: highRisk,    icon: AlertCircle, color: "#F87171", bg: "#FEF2F2" },
          { label: "Medium Risk",  value: mediumRisk,  icon: AlertCircle, color: "#F59E0B", bg: "#FEF9F3" },
          { label: "On Track",     value: onTrack,     icon: CheckCircle, color: "#10B981", bg: "#F0FDF4" },
        ].map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[18px] p-6"
              style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] text-[#64748B] mb-1">{card.label}</p>
                  <p className="text-[32px] font-semibold" style={{ color: card.color }}>
                    {card.value}
                  </p>
                </div>
                <div
                  className="w-14 h-14 rounded-[12px] flex items-center justify-center"
                  style={{ backgroundColor: card.bg }}
                >
                  <Icon className="w-7 h-7" style={{ color: card.color }} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Students Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-[18px] overflow-hidden"
        style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
      >
        <div className="p-6 border-b border-[#F8FAFC] flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-[#1E293B]">All Students</h2>
          {classData && (
            <span className="text-[13px] text-[#64748B] bg-[#F1F5F9] px-3 py-1 rounded-full">
              Class avg: <strong>{classAvg}%</strong> · {classData.totalSessions ?? 0} sessions
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC]">
              <tr>
                <th className="px-6 py-4 text-left text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-4 text-left text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                  Avg Engagement
                </th>
                <th className="px-6 py-4 text-left text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                  Sessions Attended
                </th>
                <th className="px-6 py-4 text-left text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                  Trend
                </th>
                <th className="px-6 py-4 text-left text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-4 text-left text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8FAFC]">
              {loading && (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-[#64748B]">Loading students…</td></tr>
              )}
              {!loading && students.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-[#64748B]">No student data yet. Start a session to see results.</td></tr>
              )}
              {students.map((student, index) => {
                const risk = getRiskLevel(student.avgEngagement);
                const trend = getTrend(student.avgEngagement, classAvg);
                return (
                <motion.tr
                  key={student.studentId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  onClick={() => openModal(student)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#0D9488] flex items-center justify-center text-white font-semibold text-[14px]">
                        {student.name.charAt(0)}
                      </div>
                      <span className="text-[14px] font-medium text-[#1E293B]">
                        {student.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[16px] font-semibold text-[#1E293B]">
                        {student.avgEngagement}%
                      </span>
                      <div className="w-20 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${student.avgEngagement}%`,
                            backgroundColor:
                              student.avgEngagement >= 70
                                ? "#10B981"
                                : student.avgEngagement >= 50
                                ? "#F59E0B"
                                : "#F87171",
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-[14px] font-medium text-[#1E293B]">
                      <BookOpen className="w-4 h-4 text-[#64748B]" />
                      {student.sessionsAttended}
                    </div>
                  </td>
                  <td className="px-6 py-4">{getTrendIcon(trend)}</td>
                  <td className="px-6 py-4">
                    <span
                      className="px-3 py-1 rounded-full text-[12px] font-medium capitalize"
                      style={{
                        color: getRiskColor(risk),
                        backgroundColor: getRiskBgColor(risk),
                      }}
                    >
                      {risk}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); openModal(student); }}
                      className="text-[14px] font-medium text-[#2563EB] hover:text-[#0D9488] transition-colors"
                    >
                      View Details
                    </motion.button>
                  </td>
                </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Student Detail Modal */}
      <AnimatePresence>
        {selectedStudentId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-[18px] max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-[#F8FAFC] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2563EB] to-[#0D9488] flex items-center justify-center text-white font-semibold text-[24px]">
                    {selectedStudentName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-[22px] font-semibold text-[#1E293B]">
                      {selectedStudentName}
                    </h2>
                    <p className="text-[14px] text-[#64748B]">
                      {detailLoading
                        ? "Loading engagement history…"
                        : `${studentDetail?.sessionHistory?.length ?? 0} sessions · Overall avg ${modalEngagement}%`}
                    </p>
                  </div>
                </div>
                <button onClick={closeModal} className="text-[#64748B] hover:text-[#1E293B] transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {detailLoading ? (
                <div className="p-12 text-center text-[#64748B]">Loading…</div>
              ) : (
                <div className="p-6 space-y-6">
                  {/* Overall Engagement */}
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#1E293B] mb-3">Overall Engagement</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[14px] text-[#64748B]">Average Score</span>
                          <span className="text-[20px] font-semibold text-[#1E293B]">{modalEngagement}%</span>
                        </div>
                        <div className="h-3 bg-[#F8FAFC] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${modalEngagement}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full rounded-full"
                            style={{
                              backgroundColor: modalEngagement >= 70 ? "#10B981" : modalEngagement >= 50 ? "#F59E0B" : "#F87171",
                            }}
                          />
                        </div>
                      </div>
                      {getTrendIcon(getTrend(modalEngagement, classAvg))}
                    </div>
                  </div>

                  {/* Engagement Trend — real weekly data */}
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#1E293B] mb-3">Engagement Trend</h3>
                    {trendChartData.length > 0 ? (
                      <div className="h-48 bg-[#F8FAFC] rounded-[12px] p-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={trendChartData}>
                            <XAxis dataKey="date" stroke="#64748B" tick={{ fontSize: 11 }} />
                            <YAxis stroke="#64748B" domain={[0, 100]} tick={{ fontSize: 11 }} />
                            <Tooltip
                              contentStyle={{ backgroundColor: "#1E293B", border: "none", borderRadius: "8px", color: "#FFFFFF" }}
                              formatter={(v: number) => [`${v}%`, "Engagement"]}
                            />
                            <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={3} dot={{ fill: "#2563EB", r: 4 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <p className="text-[14px] text-[#94A3B8] text-center py-6">Not enough session data yet.</p>
                    )}
                  </div>

                  {/* State Breakdown — real data */}
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#1E293B] mb-3">Engagement State Breakdown</h3>
                    <div className="space-y-3">
                      {[
                        { icon: Smile,  label: "Engaged",  state: "engaged",  color: "#10B981" },
                        { icon: Meh,    label: "Neutral",   state: "neutral",  color: "#F59E0B" },
                        { icon: Frown,  label: "Confused",  state: "confused", color: "#F87171" },
                      ].map((emotion, index) => {
                        const Icon = emotion.icon;
                        const pct = getStatePercent(emotion.state);
                        return (
                          <div key={index} className="flex items-center gap-3">
                            <Icon className="w-6 h-6 flex-shrink-0" style={{ color: emotion.color }} />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[14px] text-[#64748B]">{emotion.label}</span>
                                <span className="text-[14px] font-semibold text-[#1E293B]">{pct}%</span>
                              </div>
                              <div className="h-2 bg-[#F8FAFC] rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
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

                  {/* Session History — real data */}
                  {(studentDetail?.sessionHistory?.length ?? 0) > 0 && (
                    <div>
                      <h3 className="text-[16px] font-semibold text-[#1E293B] mb-3 flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-[#2563EB]" />
                        Session History
                      </h3>
                      <div className="rounded-[12px] overflow-hidden border border-[#F1F5F9]">
                        <table className="w-full">
                          <thead className="bg-[#F8FAFC]">
                            <tr>
                              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Date</th>
                              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Subject</th>
                              <th className="px-4 py-3 text-right text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Engagement</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#F8FAFC]">
                            {studentDetail!.sessionHistory.slice(0, 10).map((s, i) => (
                              <tr key={i} className="hover:bg-[#F8FAFC]">
                                <td className="px-4 py-3 text-[13px] text-[#64748B]">{formatDate(s.date)}</td>
                                <td className="px-4 py-3 text-[13px] text-[#1E293B] font-medium">{s.subject || s.title || "Session"}</td>
                                <td className="px-4 py-3 text-right">
                                  <span
                                    className="text-[13px] font-bold"
                                    style={{ color: s.avgEngagement >= 70 ? "#10B981" : s.avgEngagement >= 50 ? "#F59E0B" : "#F87171" }}
                                  >
                                    {s.avgEngagement}%
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* AI Recommendation */}
                  <div className="bg-[#EFF6FF] rounded-[12px] p-4">
                    <h3 className="text-[14px] font-semibold text-[#2563EB] mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      AI Recommendation
                    </h3>
                    <p className="text-[14px] text-[#1E293B]">{getRecommendation(modalEngagement)}</p>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="p-6 border-t border-[#F8FAFC] flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#2563EB] to-[#0D9488] text-white rounded-[12px] font-medium"
                  onClick={() => console.log("Schedule meeting")}
                >
                  Schedule Meeting
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-3 bg-[#F8FAFC] text-[#64748B] rounded-[12px] font-medium hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-colors"
                  onClick={closeModal}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
