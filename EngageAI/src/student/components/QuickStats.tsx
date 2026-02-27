import { motion } from "motion/react";
import { Zap, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";

interface StudentDash {
  todayEngagement: number;
  weeklyAverage: number;
  weeklyData: { day: string; value: number }[];
  streak: number;
}

export default function QuickStats() {
  const { data } = useFetch<StudentDash>("/api/analytics/dashboard/student");

  const streak = data?.streak ?? 0;
  const weeklyAvg = data?.weeklyAverage ?? 0;
  const rawWeekly = data?.weeklyData ?? [];
  const trend = rawWeekly.length >= 2
    ? rawWeekly[rawWeekly.length - 1].value - rawWeekly[0].value
    : 0;
  const totalHrs = Math.round((rawWeekly.length * 0.75) * 10) / 10;

  const stats = [
    { icon: Zap, label: "Focus Streak", value: streak ? `${streak} Days` : "—", color: "#FB7185" },
    { icon: Clock, label: "Time Focused", value: totalHrs ? `${totalHrs} hrs` : "—", color: "#3B82F6" },
    { icon: CheckCircle2, label: "Avg Engagement", value: weeklyAvg ? `${weeklyAvg}%` : "—", color: "#22C55E" },
    { icon: TrendingUp, label: "This Week", value: rawWeekly.length >= 2 ? (trend >= 0 ? `+${trend}%` : `${trend}%`) : "—", color: "#8B5CF6" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={index}
            className="bg-white rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-2"
              style={{ backgroundColor: `${stat.color}15` }}
            >
              <Icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
            <p className="text-xl font-bold text-gray-800">{stat.value}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
