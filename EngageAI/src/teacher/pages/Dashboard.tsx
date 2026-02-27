import { motion } from "motion/react";
import { Link } from "react-router";
import {
  Calendar,
  TrendingUp,
  AlertCircle,
  Activity,
  ArrowRight,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useFetch } from "../../hooks/useFetch";
import { useAuth } from "../../auth/AuthContext";

interface TeacherDashboardData {
  todaySessionCount: number;
  liveEngagement: number;
  studentsAtRisk: number;
  weeklyTrend: { date: string; value: number }[];
  recentSessions: { _id: string; subject: string; title: string; startTime: string }[];
}

export function Dashboard() {
  const { user } = useAuth();
  const { data } = useFetch<TeacherDashboardData>("/api/analytics/dashboard/teacher");

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";

  const weeklyData = data?.weeklyTrend?.length
    ? data.weeklyTrend.map((d) => ({ value: d.value }))
    : [];

  const liveEng = data?.liveEngagement ?? 0;

  const summaryCards = [
    {
      title: "Today's Classes",
      value: data ? `${data.todaySessionCount} Sessions` : "Loading…",
      icon: Calendar,
      color: "#2563EB",
      link: "/past-classes",
      type: "static",
    },
    {
      title: "Live Engagement",
      value: liveEng,
      icon: Activity,
      color: "#10B981",
      link: "/live-monitoring",
      type: "progress",
    },
    {
      title: "Students At Risk",
      value: data ? String(data.studentsAtRisk) : "–",
      icon: AlertCircle,
      color: "#F59E0B",
      link: "/students",
      type: "alert",
    },
    {
      title: "Weekly Performance",
      value: liveEng >= 75 ? "Trending Up" : liveEng >= 50 ? "Stable" : "Needs Attention",
      icon: TrendingUp,
      color: "#0D9488",
      link: "/reports",
      type: "chart",
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
      {/* Greeting Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 md:mb-12 pt-16 lg:pt-0"
      >
        <h1 className="text-[24px] md:text-[32px] font-semibold text-[#1E293B] mb-2">
          {greeting}, {user?.name ?? "Teacher"} <span className="inline-block animate-wave">👋</span>
        </h1>
        <p className="text-[14px] md:text-[16px] text-[#64748B]">
          Your students are ready to learn today.
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link key={index} to={card.link}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
                className="bg-white rounded-[18px] p-6 cursor-pointer transition-all duration-300"
                style={{
                  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-[12px] flex items-center justify-center"
                    style={{ backgroundColor: `${card.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: card.color }} />
                  </div>
                  <ArrowRight
                    className="w-5 h-5 text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: card.color }}
                  />
                </div>

                <h3 className="text-[14px] text-[#64748B] mb-2">{card.title}</h3>

                {card.type === "progress" && (
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="text-[28px] font-semibold"
                        style={{ color: card.color }}
                      >
                        {card.value}%
                      </span>
                    </div>
                    <div className="relative w-full h-2 bg-[#F8FAFC] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${card.value}%` }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                        className="absolute top-0 left-0 h-full rounded-full"
                        style={{ backgroundColor: card.color }}
                      />
                    </div>
                  </div>
                )}

                {card.type === "static" && (
                  <p
                    className="text-[24px] font-semibold"
                    style={{ color: card.color }}
                  >
                    {card.value}
                  </p>
                )}

                {card.type === "alert" && (
                  <p
                    className="text-[24px] font-semibold"
                    style={{ color: card.color }}
                  >
                    {card.value}
                  </p>
                )}

                {card.type === "chart" && (
                  <div>
                    <p className="text-[18px] font-semibold text-[#1E293B] mb-2">
                      {card.value}
                    </p>
                    <ResponsiveContainer width="100%" height={40}>
                      <LineChart data={weeklyData}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={card.color}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-[18px] p-8"
        style={{
          boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h2 className="text-[20px] font-semibold text-[#1E293B] mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/live-monitoring">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-4 bg-gradient-to-r from-[#2563EB] to-[#0D9488] text-white rounded-[12px] font-medium transition-all duration-300 hover:shadow-lg"
            >
              Start Live Monitoring
            </motion.button>
          </Link>
          <Link to="/reports">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-4 bg-[#EFF6FF] text-[#2563EB] rounded-[12px] font-medium transition-all duration-300 hover:bg-[#DBEAFE]"
            >
              View Reports
            </motion.button>
          </Link>
          <Link to="/students">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-4 bg-[#FEF9F3] text-[#F59E0B] rounded-[12px] font-medium transition-all duration-300 hover:bg-[#FEF3E2]"
            >
              Check Student Insights
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-[14px] text-[#64748B] italic">
          Empowering Teachers with Intelligent Insights.
        </p>
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-20deg); }
        }
        .animate-wave {
          animation: wave 2s ease-in-out infinite;
          display: inline-block;
          transform-origin: 70% 70%;
        }
      `}</style>
    </div>
  );
}