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

const weeklyEngagementData = [
  { day: "Mon", engagement: 78, attendance: 95 },
  { day: "Tue", engagement: 82, attendance: 92 },
  { day: "Wed", engagement: 75, attendance: 90 },
  { day: "Thu", engagement: 88, attendance: 94 },
  { day: "Fri", engagement: 90, attendance: 96 },
];

const emotionData = [
  { name: "Engaged", value: 65, color: "#10B981" },
  { name: "Neutral", value: 25, color: "#F59E0B" },
  { name: "Confused", value: 10, color: "#F87171" },
];

const heatmapData = [
  { time: "9:00", Mon: 85, Tue: 80, Wed: 75, Thu: 88, Fri: 90 },
  { time: "9:30", Mon: 82, Tue: 78, Wed: 72, Thu: 85, Fri: 88 },
  { time: "10:00", Mon: 78, Tue: 75, Wed: 70, Thu: 82, Fri: 85 },
  { time: "10:30", Mon: 75, Tue: 72, Wed: 68, Thu: 80, Fri: 82 },
];

const averageEngagement = 82.6;

export function EngagementReports() {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleDownloadReport = () => {
    console.log("Downloading report...");
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
            Emotion Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={emotionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {emotionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Engagement Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-[18px] p-6 mb-8"
        style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
      >
        <h2 className="text-[18px] font-semibold text-[#1E293B] mb-6">
          Engagement Heatmap (Time vs Day)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-[12px] font-semibold text-[#64748B]">
                  Time
                </th>
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                  <th
                    key={day}
                    className="px-4 py-3 text-center text-[12px] font-semibold text-[#64748B]"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((row, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 text-[14px] font-medium text-[#1E293B]">
                    {row.time}
                  </td>
                  {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => {
                    const value = row[day as keyof typeof row] as number;
                    const color =
                      value >= 80
                        ? "#10B981"
                        : value >= 70
                        ? "#F59E0B"
                        : "#F87171";
                    const bgColor =
                      value >= 80
                        ? "#F0FDF4"
                        : value >= 70
                        ? "#FEF9F3"
                        : "#FEF2F2";
                    return (
                      <td key={day} className="px-4 py-3">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="w-full h-12 rounded-lg flex items-center justify-center font-semibold text-[14px]"
                          style={{
                            backgroundColor: bgColor,
                            color: color,
                          }}
                        >
                          {value}%
                        </motion.div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[12px] font-semibold flex-shrink-0 mt-0.5">
              1
            </div>
            <p className="text-[14px] text-[#1E293B]">
              Your engagement peaks on Fridays. Consider scheduling important topics
              then.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[12px] font-semibold flex-shrink-0 mt-0.5">
              2
            </div>
            <p className="text-[14px] text-[#1E293B]">
              Engagement drops around 10:30. Try incorporating interactive activities
              during this time.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[12px] font-semibold flex-shrink-0 mt-0.5">
              3
            </div>
            <p className="text-[14px] text-[#1E293B]">
              Overall performance is excellent! Keep up the great work.
            </p>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
