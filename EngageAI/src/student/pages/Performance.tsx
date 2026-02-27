import { motion } from "motion/react";
import { useState } from "react";
import Navigation from "../components/Navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Trophy, Award, Target, TrendingUp } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";

interface StudentDash {
  todayEngagement: number;
  weeklyAverage: number;
  weeklyData: { value: number }[];
  streak: number;
}

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
type TimeRange = "daily" | "weekly" | "monthly";

export default function Performance() {
  const [timeRange, setTimeRange] = useState<TimeRange>("weekly");
  const { data } = useFetch<StudentDash>("/api/analytics/dashboard/student");

  const rawWeekly = data?.weeklyData ?? [];
  const weeklyData = rawWeekly.map((d, i) => ({
    day: DAYS[i] ?? `Day ${i + 1}`,
    focus: Math.round(d.value),
    xp: Math.round(d.value * 2),
  }));

  const monthlyData =
    rawWeekly.length >= 4
      ? [
          { week: "Week 1", focus: Math.round(rawWeekly[0].value) },
          { week: "Week 2", focus: Math.round((rawWeekly[2]?.value ?? rawWeekly[0].value)) },
          { week: "Week 3", focus: Math.round((rawWeekly[4]?.value ?? rawWeekly[0].value)) },
          { week: "Week 4", focus: Math.round((rawWeekly[6]?.value ?? rawWeekly[0].value)) },
        ]
      : [{ week: "Week 1", focus: data?.weeklyAverage ?? 0 }];

  const totalXP = weeklyData.reduce((s, d) => s + d.xp, 0);
  const streak = data?.streak ?? 0;
  const avgFocus = data?.weeklyAverage ?? 0;

  const stats = [
    { icon: Trophy, label: "Total XP Earned", value: totalXP ? totalXP.toLocaleString() : "—", color: "#FBBF24" },
    { icon: Award, label: "Badges Collected", value: streak > 0 ? String(Math.floor(streak / 3) + 1) : "0", color: "#8B5CF6" },
    { icon: Target, label: "Current Streak", value: streak ? `${streak} Days` : "—", color: "#FB7185" },
    { icon: TrendingUp, label: "Avg. Focus Score", value: avgFocus ? `${avgFocus}%` : "—", color: "#22C55E" },
  ];

  return (
    <div>
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            📊 Your Performance
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-8">
            Track your progress and celebrate your achievements!
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                className="bg-white rounded-[20px] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.08)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Chart Section */}
        <motion.div
          className="bg-white rounded-[20px] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.08)] mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Focus Chart
            </h2>
            
            <div className="flex gap-2">
              {(["daily", "weekly", "monthly"] as TimeRange[]).map((range) => (
                <motion.button
                  key={range}
                  className={`px-4 py-2 rounded-full text-sm capitalize transition-colors ${
                    timeRange === range
                      ? "bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setTimeRange(range)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {range}
                </motion.button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeRange === "monthly" ? monthlyData : weeklyData}>
              <defs>
                <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey={timeRange === "monthly" ? "week" : "day"}
                stroke="#999"
              />
              <YAxis stroke="#999" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="focus"
                stroke="#3B82F6"
                strokeWidth={3}
                fill="url(#colorFocus)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* XP Chart */}
        <motion.div
          className="bg-white rounded-[20px] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.08)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            XP Earned This Week
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <defs>
                <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Bar
                dataKey="xp"
                fill="url(#xpGradient)"
                radius={[8, 8, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}