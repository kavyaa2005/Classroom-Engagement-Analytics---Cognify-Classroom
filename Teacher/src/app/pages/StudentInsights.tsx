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
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const studentsData = [
  {
    id: 1,
    name: "Aarav Sharma",
    engagement: 85,
    trend: "up",
    risk: "low",
    emotionData: [
      { date: "Mon", value: 80 },
      { date: "Tue", value: 82 },
      { date: "Wed", value: 85 },
      { date: "Thu", value: 83 },
      { date: "Fri", value: 85 },
    ],
    emotions: { engaged: 70, neutral: 20, confused: 10 },
  },
  {
    id: 2,
    name: "Diya Patel",
    engagement: 92,
    trend: "up",
    risk: "low",
    emotionData: [
      { date: "Mon", value: 88 },
      { date: "Tue", value: 90 },
      { date: "Wed", value: 91 },
      { date: "Thu", value: 92 },
      { date: "Fri", value: 92 },
    ],
    emotions: { engaged: 85, neutral: 10, confused: 5 },
  },
  {
    id: 3,
    name: "Arjun Reddy",
    engagement: 58,
    trend: "down",
    risk: "high",
    emotionData: [
      { date: "Mon", value: 75 },
      { date: "Tue", value: 68 },
      { date: "Wed", value: 62 },
      { date: "Thu", value: 60 },
      { date: "Fri", value: 58 },
    ],
    emotions: { engaged: 40, neutral: 35, confused: 25 },
  },
  {
    id: 4,
    name: "Ananya Singh",
    engagement: 78,
    trend: "stable",
    risk: "low",
    emotionData: [
      { date: "Mon", value: 77 },
      { date: "Tue", value: 78 },
      { date: "Wed", value: 78 },
      { date: "Thu", value: 79 },
      { date: "Fri", value: 78 },
    ],
    emotions: { engaged: 60, neutral: 30, confused: 10 },
  },
  {
    id: 5,
    name: "Rohan Verma",
    engagement: 65,
    trend: "down",
    risk: "medium",
    emotionData: [
      { date: "Mon", value: 72 },
      { date: "Tue", value: 70 },
      { date: "Wed", value: 68 },
      { date: "Thu", value: 66 },
      { date: "Fri", value: 65 },
    ],
    emotions: { engaged: 50, neutral: 35, confused: 15 },
  },
  {
    id: 6,
    name: "Ishita Kumar",
    engagement: 88,
    trend: "up",
    risk: "low",
    emotionData: [
      { date: "Mon", value: 82 },
      { date: "Tue", value: 84 },
      { date: "Wed", value: 86 },
      { date: "Thu", value: 87 },
      { date: "Fri", value: 88 },
    ],
    emotions: { engaged: 75, neutral: 18, confused: 7 },
  },
];

export function StudentInsights() {
  const [selectedStudent, setSelectedStudent] = useState<typeof studentsData[0] | null>(null);

  const getRiskColor = (risk: string) => {
    if (risk === "high") return "#F87171";
    if (risk === "medium") return "#F59E0B";
    return "#10B981";
  };

  const getRiskBgColor = (risk: string) => {
    if (risk === "high") return "#FEF2F2";
    if (risk === "medium") return "#FEF9F3";
    return "#F0FDF4";
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="w-5 h-5 text-[#10B981]" />;
    if (trend === "down") return <TrendingDown className="w-5 h-5 text-[#F87171]" />;
    return <Minus className="w-5 h-5 text-[#64748B]" />;
  };

  const getRecommendation = (student: typeof studentsData[0]) => {
    if (student.risk === "high") {
      return "Schedule a one-on-one session. Consider peer support.";
    }
    if (student.risk === "medium") {
      return "Monitor closely. Provide additional practice materials.";
    }
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
          {
            label: "High Risk",
            value: studentsData.filter((s) => s.risk === "high").length,
            icon: AlertCircle,
            color: "#F87171",
            bg: "#FEF2F2",
          },
          {
            label: "Medium Risk",
            value: studentsData.filter((s) => s.risk === "medium").length,
            icon: AlertCircle,
            color: "#F59E0B",
            bg: "#FEF9F3",
          },
          {
            label: "On Track",
            value: studentsData.filter((s) => s.risk === "low").length,
            icon: CheckCircle,
            color: "#10B981",
            bg: "#F0FDF4",
          },
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
        <div className="p-6 border-b border-[#F8FAFC]">
          <h2 className="text-[18px] font-semibold text-[#1E293B]">All Students</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC]">
              <tr>
                <th className="px-6 py-4 text-left text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-4 text-left text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
                  Engagement Score
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
              {studentsData.map((student, index) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  onClick={() => setSelectedStudent(student)}
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
                        {student.engagement}%
                      </span>
                      <div className="w-20 h-2 bg-[#F8FAFC] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${student.engagement}%`,
                            backgroundColor:
                              student.engagement >= 75
                                ? "#10B981"
                                : student.engagement >= 50
                                ? "#F59E0B"
                                : "#F87171",
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getTrendIcon(student.trend)}</td>
                  <td className="px-6 py-4">
                    <span
                      className="px-3 py-1 rounded-full text-[12px] font-medium capitalize"
                      style={{
                        color: getRiskColor(student.risk),
                        backgroundColor: getRiskBgColor(student.risk),
                      }}
                    >
                      {student.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStudent(student);
                      }}
                      className="text-[14px] font-medium text-[#2563EB] hover:text-[#0D9488] transition-colors"
                    >
                      View Details
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Student Detail Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedStudent(null)}
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
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-[22px] font-semibold text-[#1E293B]">
                      {selectedStudent.name}
                    </h2>
                    <p className="text-[14px] text-[#64748B]">Student Profile</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-[#64748B] hover:text-[#1E293B] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Engagement Score */}
                <div>
                  <h3 className="text-[16px] font-semibold text-[#1E293B] mb-3">
                    Current Engagement
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[14px] text-[#64748B]">Score</span>
                        <span className="text-[20px] font-semibold text-[#1E293B]">
                          {selectedStudent.engagement}%
                        </span>
                      </div>
                      <div className="h-3 bg-[#F8FAFC] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedStudent.engagement}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full rounded-full"
                          style={{
                            backgroundColor:
                              selectedStudent.engagement >= 75
                                ? "#10B981"
                                : selectedStudent.engagement >= 50
                                ? "#F59E0B"
                                : "#F87171",
                          }}
                        />
                      </div>
                    </div>
                    {getTrendIcon(selectedStudent.trend)}
                  </div>
                </div>

                {/* Engagement Graph */}
                <div>
                  <h3 className="text-[16px] font-semibold text-[#1E293B] mb-3">
                    Weekly Trend
                  </h3>
                  <div className="h-48 bg-[#F8FAFC] rounded-[12px] p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedStudent.emotionData}>
                        <XAxis dataKey="date" stroke="#64748B" />
                        <YAxis stroke="#64748B" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1E293B",
                            border: "none",
                            borderRadius: "8px",
                            color: "#FFFFFF",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#2563EB"
                          strokeWidth={3}
                          dot={{ fill: "#2563EB", r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Emotion Breakdown */}
                <div>
                  <h3 className="text-[16px] font-semibold text-[#1E293B] mb-3">
                    Emotion Distribution
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        icon: Smile,
                        label: "Engaged",
                        value: selectedStudent.emotions.engaged,
                        color: "#10B981",
                      },
                      {
                        icon: Meh,
                        label: "Neutral",
                        value: selectedStudent.emotions.neutral,
                        color: "#F59E0B",
                      },
                      {
                        icon: Frown,
                        label: "Confused",
                        value: selectedStudent.emotions.confused,
                        color: "#F87171",
                      },
                    ].map((emotion, index) => {
                      const Icon = emotion.icon;
                      return (
                        <div key={index} className="flex items-center gap-3">
                          <Icon
                            className="w-6 h-6 flex-shrink-0"
                            style={{ color: emotion.color }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[14px] text-[#64748B]">
                                {emotion.label}
                              </span>
                              <span className="text-[14px] font-semibold text-[#1E293B]">
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

                {/* AI Recommendation */}
                <div className="bg-[#EFF6FF] rounded-[12px] p-4">
                  <h3 className="text-[14px] font-semibold text-[#2563EB] mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    AI Recommendation
                  </h3>
                  <p className="text-[14px] text-[#1E293B]">
                    {getRecommendation(selectedStudent)}
                  </p>
                </div>
              </div>

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
                  onClick={() => setSelectedStudent(null)}
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
