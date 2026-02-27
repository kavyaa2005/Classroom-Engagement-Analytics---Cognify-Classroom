import { useNavigate } from "react-router";
import { StatCard } from "../components/StatCard";
import {
  Users,
  GraduationCap,
  Radio,
  TrendingUp,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";

interface ClassData {
  _id: string;
  name: string;
  section?: string;
  subject?: string;
  teacherName: string;
  teacherEmail: string;
  studentCount: number;
  avgEngagement: number;
  sessionCount: number;
}

interface DashboardData {
  totalStudents: number;
  totalTeachers: number;
  activeSessions: number;
  overallEngagement: number;
  weeklyTrend: Array<{ date: string; engagement: number }>;
  classrooms: ClassData[];
}

export function Dashboard() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await adminAPI.getDashboard();
        if (response.data.success) {
          setDashboardData(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const classData = dashboardData?.classrooms.map((c) => ({
    id: c._id,
    name: `${c.name} ${c.section || ""}`.trim(),
    teacher: c.teacherName,
    students: c.studentCount,
    engagement: c.avgEngagement,
    status: c.avgEngagement >= 80 ? "High" : c.avgEngagement >= 60 ? "Medium" : "Low",
  })) || [];

  const alerts = classData
    .filter((c) => c.engagement < 60)
    .slice(0, 3)
    .map((c, i) => ({
      id: i + 1,
      message: `${c.name} engagement at ${c.engagement}% - needs attention`,
      time: "Recently",
      urgent: c.engagement < 50,
    }));

  const filteredClasses =
    filterStatus === "all"
      ? classData
      : classData.filter(
          (c) => c.status.toLowerCase() === filterStatus.toLowerCase()
        );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-[30px] font-bold text-[#111827] tracking-tight leading-tight">Dashboard Overview</h1>
        <p className="text-base text-[#6B7280] leading-relaxed">
          Real-time classroom engagement insights
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Teachers"
          value={dashboardData?.totalTeachers || 0}
          icon={Users}
          color="blue"
          onClick={() => navigate("/teachers")}
          delay={0}
        />
        <StatCard
          title="Total Students"
          value={dashboardData?.totalStudents || 0}
          icon={GraduationCap}
          color="teal"
          onClick={() => navigate("/students")}
          delay={0.1}
        />
        <StatCard
          title="Active Classes"
          value={`${dashboardData?.activeSessions || 0} Live`}
          icon={Radio}
          color="emerald"
          onClick={() => navigate("/live-monitoring")}
          delay={0.2}
        />
        <StatCard
          title="Average Engagement"
          value={dashboardData?.overallEngagement || 0}
          icon={TrendingUp}
          color="amber"
          onClick={() => navigate("/reports")}
          delay={0.3}
          showProgress={true}
          progressValue={dashboardData?.overallEngagement || 0}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Engagement Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, ease: "easeOut" }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="xl:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 cursor-pointer transition-all duration-200"
          style={{ boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.08)" }}
          onClick={() => navigate("/reports")}
        >
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-[#111827] tracking-tight">
                Weekly Engagement Trend
              </h2>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Tracking classroom participation over time
              </p>
            </div>
            <div className="flex gap-2">
              {(["daily", "weekly", "monthly"] as const).map((range) => (
                <button
                  key={range}
                  onClick={(e) => {
                    e.stopPropagation();
                    setTimeRange(range);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    timeRange === range
                      ? "bg-[#3B82F6] text-white shadow-sm"
                      : "bg-gray-50 text-[#6B7280] hover:bg-gray-100"
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dashboardData?.weeklyTrend || []}>
              <defs>
                <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                stroke="#6B7280"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  padding: "12px",
                  boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.08)",
                }}
              />
              <Area
                type="monotone"
                dataKey="engagement"
                stroke="#3B82F6"
                strokeWidth={3}
                fill="url(#colorEngagement)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Live Alerts Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, ease: "easeOut" }}
          className="bg-white rounded-2xl p-6 border border-gray-100"
          style={{ boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-[#3B82F6]" />
            <h2 className="text-xl font-semibold text-[#111827] tracking-tight">
              Real-Time Alerts
            </h2>
          </div>

          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1, ease: "easeOut" }}
                whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
                onClick={() => navigate("/live-monitoring")}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  alert.urgent
                    ? "bg-red-50 border-red-200 hover:shadow-md"
                    : "bg-gray-50 border-gray-200 hover:shadow-md"
                }`}
              >
                <p className="text-sm text-[#111827] font-medium leading-relaxed">
                  {alert.message}
                </p>
                <p className="text-xs text-[#6B7280] mt-2">{alert.time}</p>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/notifications")}
            className="w-full mt-4 px-4 py-2.5 bg-[#3B82F6] text-white rounded-xl hover:bg-[#2563EB] transition-all duration-200 flex items-center justify-center gap-2 group font-medium shadow-sm"
          >
            View All Alerts
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </motion.button>
        </motion.div>
      </div>

      {/* Class Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, ease: "easeOut" }}
        className="bg-white rounded-2xl p-6 border border-gray-100"
        style={{ boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.08)" }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-[#111827] tracking-tight">
              Class Comparison
            </h2>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Monitor performance across all classes
            </p>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search classes..."
              className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent text-sm transition-all duration-200"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent text-sm transition-all duration-200"
            >
              <option value="all">All Levels</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#374151]">
                  Class Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#374151]">
                  Teacher
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#374151]">
                  Students
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#374151]">
                  Avg Engagement
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#374151]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map((classItem, index) => (
                <motion.tr
                  key={classItem.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.05, ease: "easeOut" }}
                  whileHover={{ backgroundColor: "#F9FAFB", transition: { duration: 0.15 } }}
                  onClick={() => navigate("/live-monitoring")}
                  className="border-b border-gray-100 cursor-pointer transition-colors duration-200"
                >
                  <td className="py-4 px-4">
                    <span className="font-medium text-[#111827]">
                      {classItem.name}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[#6B7280] text-sm">
                    {classItem.teacher}
                  </td>
                  <td className="py-4 px-4 text-[#6B7280] text-sm">
                    {classItem.students}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div
                          className="bg-gradient-to-r from-[#3B82F6] to-[#14B8A6] h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${classItem.engagement}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-[#111827] w-12">
                        {classItem.engagement}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        classItem.status === "High"
                          ? "bg-emerald-100 text-emerald-700"
                          : classItem.status === "Medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {classItem.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}