import { useState } from "react";
import { motion } from "motion/react";
import { Download, Share2, Calendar, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useFetch } from "../../hooks/useFetch";

interface HistoryData {
  sessions: {
    _id: string;
    subject: string;
    startTime: string;
    summary?: { averageEngagement: number; durationMinutes: number; totalStudents: number };
  }[];
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function EngagementReports() {
  const [showConfetti, setShowConfetti] = useState(false);
  const { data } = useFetch<HistoryData>("/api/analytics/history?limit=7");

  // Build weeklyEngagementData from last 7 sessions
  const sessions = data?.sessions ?? [];
  const weeklyEngagementData = sessions.slice(0, 7).reverse().map((s) => ({
    day: DAYS[new Date(s.startTime).getDay()],
    engagement: s.summary?.averageEngagement ?? 0,
    attendance: s.summary?.totalStudents ?? 0,
  }));

  const averageEngagement =
    sessions.length
      ? parseFloat(
          (sessions.reduce((s, r) => s + (r.summary?.averageEngagement ?? 0), 0) / sessions.length).toFixed(1)
        )
      : 0;

  // Engagement level distribution: derived from real sessions
  const emotionData = [
    { name: "High (≥80%)", value: sessions.filter(s => (s.summary?.averageEngagement ?? 0) >= 80).length, color: "#10B981" },
    { name: "Medium (60-79%)", value: sessions.filter(s => { const e = s.summary?.averageEngagement ?? 0; return e >= 60 && e < 80; }).length, color: "#F59E0B" },
    { name: "Low (<60%)", value: sessions.filter(s => (s.summary?.averageEngagement ?? 0) < 60 && (s.summary?.averageEngagement ?? 0) > 0).length, color: "#F87171" },
  ].filter(d => d.value > 0);

  // Dynamic AI recommendations
  const highestDay = weeklyEngagementData.length
    ? weeklyEngagementData.reduce((m, d) => d.engagement > m.engagement ? d : m, weeklyEngagementData[0])
    : null;
  const lowestDay = weeklyEngagementData.length
    ? weeklyEngagementData.reduce((m, d) => d.engagement < m.engagement ? d : m, weeklyEngagementData[0])
    : null;

  const aiRecommendations: string[] = [];
  if (highestDay && highestDay.engagement > 0)
    aiRecommendations.push(`Your engagement peaks on ${highestDay.day} (${highestDay.engagement}%). Consider scheduling important topics then.`);
  if (lowestDay && lowestDay.engagement > 0 && lowestDay.day !== highestDay?.day)
    aiRecommendations.push(`Engagement is lowest on ${lowestDay.day} (${lowestDay.engagement}%). Try incorporating interactive activities during this session.`);
  if (averageEngagement >= 75)
    aiRecommendations.push(`Overall average is ${averageEngagement}% — excellent work! Keep up the great consistency.`);
  else if (averageEngagement > 0)
    aiRecommendations.push(`Overall average is ${averageEngagement}%. Focus on sessions where engagement dips below 70%.`);
  if (aiRecommendations.length === 0)
    aiRecommendations.push("Complete more live sessions to unlock personalized AI recommendations.");

  const handleDownloadReport = () => {
    const rows = [
      ["Day", "Engagement %", "Students"],
      ...weeklyEngagementData.map((d) => [d.day, d.engagement, d.attendance]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "engagement-report.csv"; a.click();
    if (averageEngagement > 85) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto relative">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: -20,
                rotate: 0,
              }}
              animate={{
                y: window.innerHeight + 20,
                rotate: Math.random() * 720,
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                ease: "linear",
              }}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: ["#2563EB", "#10B981", "#F59E0B", "#F87171"][
                  Math.floor(Math.random() * 4)
                ],
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-[28px] font-semibold text-[#1E293B] mb-2">
              Engagement Reports
            </h1>
            <p className="text-[16px] text-[#64748B]">
              Comprehensive analytics and insights for your classes.
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadReport}
              className="px-6 py-3 bg-gradient-to-r from-[#2563EB] to-[#0D9488] text-white rounded-[12px] font-medium flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Report
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white text-[#2563EB] rounded-[12px] font-medium flex items-center gap-2 border border-[#2563EB]"
            >
              <Share2 className="w-5 h-5" />
              Share
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Average Engagement Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#2563EB] to-[#0D9488] rounded-[18px] p-8 mb-8 text-white"
        style={{ boxShadow: "0 12px 30px rgba(37, 99, 235, 0.3)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[16px] opacity-90 mb-2">Average Engagement Score</p>
            <div className="flex items-baseline gap-3">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.3 }}
                className="text-[56px] font-bold"
              >
                {averageEngagement}%
              </motion.span>
              {averageEngagement > 85 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-1 text-[18px]"
                >
                  <TrendingUp className="w-6 h-6" />
                  <span>Excellent!</span>
                </motion.div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-[14px]">
            <Calendar className="w-5 h-5" />
            <span>Last 5 Days</span>
          </div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Weekly Engagement Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[18px] p-6"
          style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
        >
          <h2 className="text-[18px] font-semibold text-[#1E293B] mb-6">
            Weekly Engagement Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyEngagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F8FAFC" />
              <XAxis dataKey="day" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E293B",
                  border: "none",
                  borderRadius: "8px",
                  color: "#FFFFFF",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="engagement"
                stroke="#2563EB"
                strokeWidth={3}
                dot={{ fill: "#2563EB", r: 5 }}
                name="Engagement %"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Emotion Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[18px] p-6"
          style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
        >
          <h2 className="text-[18px] font-semibold text-[#1E293B] mb-6">
            Session Engagement Distribution
          </h2>
          {emotionData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={emotionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {emotionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v} sessions`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-[#64748B] text-[14px]">
              No completed sessions yet.
            </div>
          )}
        </motion.div>
      </div>

      {/* Session Summary Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-[18px] p-6 mb-8"
        style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
      >
        <h2 className="text-[18px] font-semibold text-[#1E293B] mb-6">
          Recent Session Breakdown
        </h2>
        {sessions.length === 0 ? (
          <p className="text-[#64748B] text-center py-8">No past sessions yet. Start a live class to see data here.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#F8FAFC]">
                  <th className="text-left px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Subject</th>
                  <th className="text-left px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Students</th>
                  <th className="text-left px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Avg Engagement</th>
                  <th className="text-left px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Duration</th>
                </tr>
              </thead>
              <tbody>
                {sessions.slice(0, 7).map((s, i) => {
                  const eng = Math.round(s.summary?.averageEngagement ?? 0);
                  const dur = s.summary?.durationMinutes ? `${Math.round(s.summary.durationMinutes)}m` : "—";
                  const color = eng >= 80 ? "#10B981" : eng >= 60 ? "#F59E0B" : "#F87171";
                  return (
                    <tr key={s._id} className="border-b border-[#F8FAFC] hover:bg-[#F8FAFC]">
                      <td className="px-4 py-3 text-[14px] font-medium text-[#1E293B]">{s.subject || "—"}</td>
                      <td className="px-4 py-3 text-[14px] text-[#64748B]">{DAYS[new Date(s.startTime).getDay()]}, {new Date(s.startTime).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</td>
                      <td className="px-4 py-3 text-[14px] text-[#64748B]">{s.summary?.totalStudents ?? 0}</td>
                      <td className="px-4 py-3">
                        <span className="text-[14px] font-semibold" style={{ color }}>{eng}%</span>
                      </td>
                      <td className="px-4 py-3 text-[14px] text-[#64748B]">{dur}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] rounded-[18px] p-6"
      >
        <h2 className="text-[18px] font-semibold text-[#2563EB] mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          AI Recommendations
        </h2>
        <ul className="space-y-3">
          {aiRecommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[12px] font-semibold flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-[14px] text-[#1E293B]">{rec}</p>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
