import { motion } from "motion/react";
import { Users, Brain, Clock, Award } from "lucide-react";
import {
  BarChart,
  Bar,
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

const subjectEngagement = [
  { subject: "Math", engagement: 85 },
  { subject: "Science", engagement: 78 },
  { subject: "English", engagement: 88 },
  { subject: "History", engagement: 72 },
  { subject: "Physics", engagement: 82 },
];

const classTimeDistribution = [
  { name: "Highly Focused", value: 45, color: "#10B981" },
  { name: "Moderately Focused", value: 35, color: "#2563EB" },
  { name: "Distracted", value: 15, color: "#F59E0B" },
  { name: "Offline", value: 5, color: "#F87171" },
];

const weeklyClassTrend = [
  { day: "Mon", classAvg: 72, yourScore: 75 },
  { day: "Tue", classAvg: 76, yourScore: 82 },
  { day: "Wed", classAvg: 74, yourScore: 78 },
  { day: "Thu", classAvg: 78, yourScore: 88 },
  { day: "Fri", classAvg: 80, yourScore: 92 },
];

export default function ClassInsights() {
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
              AI-powered analytics for Class 10A
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-20 py-8 space-y-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: Users, label: "Class Size", value: "32", sublabel: "students", color: "#2563EB" },
            { icon: Brain, label: "Avg Engagement", value: "76%", sublabel: "this week", color: "#0D9488" },
            { icon: Clock, label: "Class Duration", value: "45min", sublabel: "average", color: "#F59E0B" },
            { icon: Award, label: "Top Performers", value: "8", sublabel: "above 85%", color: "#10B981" },
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

        {/* Subject Engagement */}
        <motion.div
          className="bg-card rounded-2xl p-8 shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-1">
              Engagement by Subject
            </h2>
            <p className="text-sm text-muted-foreground">
              Class 10A performance across different subjects
            </p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectEngagement}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="subject" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Bar dataKey="engagement" fill="#2563EB" radius={[8, 8, 0, 0]}>
                {subjectEngagement.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.engagement >= 85
                        ? "#10B981"
                        : entry.engagement >= 75
                        ? "#2563EB"
                        : "#F59E0B"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Class Time Distribution */}
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

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={classTimeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {classTimeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
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
                <YAxis stroke="#64748B" />
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
                  stroke="#2563EB"
                  strokeWidth={3}
                  dot={{ fill: "#2563EB", r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="classAvg"
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
                <strong>Peak Performance:</strong> Class engagement is highest on Fridays (80% avg).
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
              <p className="text-foreground">
                <strong>Best Subject:</strong> English leads with 88% average engagement.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2" />
              <p className="text-foreground">
                <strong>Improvement Area:</strong> History needs more interactive elements.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-warning rounded-full mt-2" />
              <p className="text-foreground">
                <strong>Your Position:</strong> You're performing 6% above class average.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}