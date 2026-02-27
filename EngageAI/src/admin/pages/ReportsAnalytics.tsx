import { useState } from "react";
import { motion } from "motion/react";
import {
  Download,
  FileText,
  TrendingUp,
  Calendar,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useFetch } from "../../hooks/useFetch";

interface AdminDash {
  totalStudents: number;
  totalTeachers: number;
  activeSessions: number;
  overallEngagement: number;
  weeklyTrend: { date: string; engagement: number }[];
  classrooms: { _id: string; name: string; avgEngagement?: number; studentCount?: number; sessionCount?: number }[];
}

export function ReportsAnalytics() {
  const [dateRange, setDateRange] = useState("last-30-days");
  const { data } = useFetch<AdminDash>("/api/analytics/dashboard/admin");

  const classrooms = data?.classrooms ?? [];
  const weeklyTrend = data?.weeklyTrend ?? [];

  const engagementByClass = classrooms.map(c => ({
    name: c.name,
    engagement: Math.round(c.avgEngagement ?? 0),
  }));

  const weeklyTrendData = weeklyTrend.map((p, i) => ({
    week: `Day ${i + 1}`,
    engagement: Math.round(p.engagement),
  }));

  const overall = data?.overallEngagement ?? 0;
  const engagementDistribution = [
    { name: "High (80-100%)", value: classrooms.filter(c => (c.avgEngagement ?? 0) >= 80).length, color: "#10B981" },
    { name: "Medium (60-79%)", value: classrooms.filter(c => (c.avgEngagement ?? 0) >= 60 && (c.avgEngagement ?? 0) < 80).length, color: "#F59E0B" },
    { name: "Low (0-59%)", value: classrooms.filter(c => (c.avgEngagement ?? 0) > 0 && (c.avgEngagement ?? 0) < 60).length, color: "#EF4444" },
  ].filter(d => d.value > 0);

  const handleDownloadPDF = () => {
    alert("PDF export is not yet available. Use CSV export instead.");
  };

  const handleExportCSV = () => {
    if (!data) return;
    const rows = [
      ["Classroom", "Avg Engagement"],
      ...engagementByClass.map(c => [c.name, `${c.engagement}%`]),
      [],
      ["Week", "Avg Engagement"],
      ...weeklyTrendData.map(w => [w.week, `${w.engagement}%`]),
      [],
      ["Total Students", String(data.totalStudents)],
      ["Total Teachers", String(data.totalTeachers)],
      ["Overall Engagement", `${data.overallEngagement}%`],
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "engagement-report.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937]">
            Reports & Analytics
          </h1>
          <p className="text-[#6B7280] mt-1">
            Comprehensive engagement insights and trends
          </p>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-[#EF4444] text-white rounded-xl hover:bg-[#DC2626] transition-all"
          >
            <FileText className="w-4 h-4" />
            Download PDF
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-[#10B981] text-white rounded-xl hover:bg-[#059669] transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </motion.button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-2xl p-4 shadow-md">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-[#6B7280]" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            <option value="last-7-days">Last 7 Days</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="last-90-days">Last 90 Days</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl p-6 text-white shadow-lg"
        >
          <TrendingUp className="w-8 h-8 mb-3" />
          <p className="text-sm opacity-90">Overall Engagement</p>
          <p className="text-3xl font-bold mt-2">{data?.overallEngagement ?? 0}%</p>
          <p className="text-xs mt-2 opacity-80">Today's platform average</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-6 text-white shadow-lg"
        >
          <BarChart3 className="w-8 h-8 mb-3" />
          <p className="text-sm opacity-90">Total Sessions</p>
          <p className="text-3xl font-bold mt-2">{data?.activeSessions ?? 0}</p>
          <p className="text-xs mt-2 opacity-80">Live right now</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl p-6 text-white shadow-lg"
        >
          <Calendar className="w-8 h-8 mb-3" />
          <p className="text-sm opacity-90">Total Students</p>
          <p className="text-3xl font-bold mt-2">{data?.totalStudents ?? 0}</p>
          <p className="text-xs mt-2 opacity-80">Registered on platform</p>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Engagement by Class - Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)]"
        >
          <h2 className="text-xl font-bold text-[#1F2937] mb-4">
            Engagement by Class
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementByClass}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                stroke="#6B7280"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="engagement" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Engagement Distribution - Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)]"
        >
          <h2 className="text-xl font-bold text-[#1F2937] mb-4">
            Engagement Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={engagementDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {engagementDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {engagementDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-[#6B7280]">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Weekly Trend Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)]"
      >
        <h2 className="text-xl font-bold text-[#1F2937] mb-4">
          Weekly Performance Trend
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="week" stroke="#6B7280" style={{ fontSize: "12px" }} />
            <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
              }}
            />
            <Legend />
            <Bar
              dataKey="engagement"
              fill="#3B82F6"
              radius={[8, 8, 0, 0]}
              name="Engagement %"
            />

          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Detailed Reports Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)]"
      >
        <h2 className="text-xl font-bold text-[#1F2937] mb-4">
          Detailed Class Reports
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">
                  Class
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">
                  Avg Engagement
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">
                  Sessions
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">
                  Trend
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {engagementByClass.map((cls, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 font-medium text-[#1F2937]">
                    {cls.name}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-medium ${
                        cls.engagement >= 80
                          ? "text-[#10B981]"
                          : cls.engagement >= 60
                          ? "text-[#F59E0B]"
                          : "text-[#EF4444]"
                      }`}
                    >
                      {cls.engagement}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#6B7280]">
                    {classrooms.find(c => c.name === cls.name)?.sessionCount ?? "—"}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`flex items-center gap-1 ${
                      cls.engagement >= 75 ? "text-[#10B981]" : cls.engagement >= 50 ? "text-[#F59E0B]" : "text-[#EF4444]"
                    }`}>
                      <TrendingUp className="w-4 h-4" />
                      {cls.engagement >= 75 ? "High" : cls.engagement >= 50 ? "Medium" : "Low"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-[#3B82F6] hover:underline text-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
