import { motion } from "motion/react";
import { Users, Brain, Clock, Award } from "lucide-react";
import {
  LineChart,
  Line,
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

interface TrendPoint { day: string; classAvg: number; yourScore: number; }
interface FocusDist { name: string; value: number; color: string; }
interface ClassInsightsData {
  classroomName: string;
  classSize: number;
  avgEngagement: number;
  weeklyClassTrend: TrendPoint[];
  focusDist: FocusDist[];
  studentScore: number;
  classAverage: number;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ClassInsights() {
  const { data } = useFetch<ClassInsightsData>("/api/analytics/dashboard/student/class-insights");

  const classroomName = data?.classroomName ?? "Class";
  const classSize = data?.classSize ?? 0;
  const avgEngagement = data?.avgEngagement ?? 0;
  const studentScore = data?.studentScore ?? 0;
  const classAverage = data?.classAverage ?? 0;
  const aboveAvg = studentScore - classAverage;

  // Weekly trend with short day labels
  const weeklyClassTrend = (data?.weeklyClassTrend ?? []).map((d, i) => ({
    ...d,
    day: DAYS[i % 7],
  }));

  // Focus distribution pie data — only show real data
  const focusDist = (data?.focusDist ?? []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-success/5 border-b border-border">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-20 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-semibold text-foreground mb-2">
              Class Insights
            </h1>
            <p className="text-lg text-muted-foreground">
              AI-powered analytics for {classroomName}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-20 py-8 space-y-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: Users, label: "Class Size", value: classSize ? String(classSize) : "—", sublabel: "students", color: "#2563EB" },
            { icon: Brain, label: "Avg Engagement", value: avgEngagement ? `${avgEngagement}%` : "—", sublabel: "this week", color: "#0D9488" },
            { icon: Clock, label: "Your Score", value: studentScore ? `${studentScore}%` : "—", sublabel: "this week", color: "#F59E0B" },
            { icon: Award, label: "vs Class Avg", value: aboveAvg >= 0 ? `+${aboveAvg}%` : `${aboveAvg}%`, sublabel: aboveAvg >= 0 ? "above average" : "below average", color: aboveAvg >= 0 ? "#10B981" : "#F87171" },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                className="bg-card rounded-2xl p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-semibold text-foreground mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Focus Distribution + Weekly Trend */}
        <motion.div
          className="bg-card rounded-2xl p-8 shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-1">
              Engagement Overview
            </h2>
            <p className="text-sm text-muted-foreground">
              {classroomName} weekly engagement data
            </p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyClassTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="day" stroke="#64748B" />
              <YAxis stroke="#64748B" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="yourScore"
                name="Your Score"
                stroke="#2563EB"
                strokeWidth={3}
                dot={{ fill: "#2563EB", r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="classAvg"
                name="Class Average"
                stroke="#64748B"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "#64748B", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Focus Distribution */}
          <motion.div
            className="bg-card rounded-2xl p-8 shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-1">
                Focus Distribution
              </h2>
              <p className="text-sm text-muted-foreground">
                How the class spends their time
              </p>
            </div>

            {focusDist.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={focusDist}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {focusDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground gap-3">
                <Brain className="w-10 h-10 opacity-30" />
                <p className="text-sm font-medium">No session data yet — complete a live session to see focus distribution.</p>
              </div>
            )}
          </motion.div>

          {/* Weekly Class Trend */}
          <motion.div
            className="bg-card rounded-2xl p-8 shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-1">
                Weekly Class Trend
              </h2>
              <p className="text-sm text-muted-foreground">
                You vs class average
              </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyClassTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" stroke="#64748B" />
                <YAxis stroke="#64748B" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="yourScore"
                  name="Your Score"
                  stroke="#2563EB"
                  strokeWidth={3}
                  dot={{ fill: "#2563EB", r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="classAvg"
                  name="Class Average"
                  stroke="#64748B"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "#64748B", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* AI Insights */}
        <motion.div
          className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 border border-primary/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            AI-Powered Class Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-success rounded-full mt-2" />
              <p className="text-foreground">
                <strong>Class Average:</strong> {avgEngagement}% engagement this week.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
              <p className="text-foreground">
                <strong>Your Score:</strong> {studentScore}% — {aboveAvg >= 0 ? `${aboveAvg}% above` : `${Math.abs(aboveAvg)}% below`} class average.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2" />
              <p className="text-foreground">
                <strong>Focus State:</strong> {focusDist[0]?.name ?? "—"} is the most common state in your class.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-warning rounded-full mt-2" />
              <p className="text-foreground">
                <strong>Class Size:</strong> {classSize} active students enrolled.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}