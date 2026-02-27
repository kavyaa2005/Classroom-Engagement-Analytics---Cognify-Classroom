import { motion } from "motion/react";
import { useState } from "react";
import { Calendar, TrendingUp, Clock, Target } from "lucide-react";
import PremiumCard from "../components/PremiumCard";
import PremiumPageHeader from "../components/PremiumPageHeader";
import SectionContainer from "../components/SectionContainer";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const dailyData = [
  { day: "Mon", engagement: 75, participation: 70, focus: 80 },
  { day: "Tue", engagement: 82, participation: 78, focus: 85 },
  { day: "Wed", engagement: 78, participation: 75, focus: 82 },
  { day: "Thu", engagement: 88, participation: 85, focus: 90 },
  { day: "Fri", engagement: 92, participation: 88, focus: 95 },
  { day: "Sat", engagement: 85, participation: 82, focus: 88 },
  { day: "Sun", engagement: 80, participation: 76, focus: 84 },
];

const weeklyData = [
  { week: "Week 1", engagement: 72, participation: 68 },
  { week: "Week 2", engagement: 78, participation: 75 },
  { week: "Week 3", engagement: 85, participation: 82 },
  { week: "Week 4", engagement: 88, participation: 86 },
];

const monthlyData = [
  { month: "Jan", engagement: 70 },
  { month: "Feb", engagement: 75 },
  { month: "Mar", engagement: 82 },
  { month: "Apr", engagement: 85 },
  { month: "May", engagement: 88 },
  { month: "Jun", engagement: 86 },
];

const heatmapData = [
  { day: "Mon", "9-10": 75, "10-11": 82, "11-12": 78, "1-2": 88, "2-3": 85 },
  { day: "Tue", "9-10": 80, "10-11": 85, "11-12": 82, "1-2": 90, "2-3": 88 },
  { day: "Wed", "9-10": 72, "10-11": 78, "11-12": 75, "1-2": 85, "2-3": 82 },
  { day: "Thu", "9-10": 85, "10-11": 90, "11-12": 88, "1-2": 92, "2-3": 90 },
  { day: "Fri", "9-10": 88, "10-11": 92, "11-12": 90, "1-2": 95, "2-3": 92 },
];

type TimeRange = "daily" | "weekly" | "monthly";

export default function EngagementHistory() {
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");

  const getChartData = () => {
    switch (timeRange) {
      case "daily":
        return dailyData;
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      default:
        return dailyData;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Premium Page Header */}
      <PremiumPageHeader
        title="Engagement History"
        subtitle="Track your learning performance over time"
        badge="Class 10A"
      />

      {/* Main Content */}
      <SectionContainer className="space-y-12 py-12">
        {/* Stats Overview - 8pt grid spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: TrendingUp, label: "Average Engagement", value: "84%", color: "#2563EB" },
            { icon: Target, label: "Best Performance", value: "92%", color: "#10B981" },
            { icon: Clock, label: "Total Study Time", value: "28h", color: "#0D9488" },
            { icon: Calendar, label: "Active Days", value: "24", color: "#F59E0B" },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <PremiumCard
                key={index}
                title={stat.label}
                value={stat.value}
                icon={Icon}
                iconColor={stat.color}
                delay={index * 0.1}
                variant="default"
              />
            );
          })}
        </div>

        {/* Engagement Chart */}
        <PremiumCard variant="elevated" padding="xl" delay={0.4} hoverable={false}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
            <div>
              <h2 className="text-[32px] font-bold text-foreground mb-2 tracking-tight leading-tight">
                Engagement Trends
              </h2>
              <p className="text-base text-muted-foreground font-medium">
                Your performance over time
              </p>
            </div>

            {/* Time Range Toggle */}
            <div className="flex gap-2 bg-muted p-1.5 rounded-xl">
              {(["daily", "weekly", "monthly"] as TimeRange[]).map((range) => (
                <motion.button
                  key={range}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ease-in-out ${
                    timeRange === range
                      ? "bg-primary text-white shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-white"
                  }`}
                  onClick={() => setTimeRange(range)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                  {range}
                </motion.button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={getChartData()}>
              <defs>
                <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                {timeRange === "daily" && (
                  <>
                    <linearGradient id="colorParticipation" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </>
                )}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                dataKey={timeRange === "monthly" ? "month" : timeRange === "weekly" ? "week" : "day"}
                stroke="#64748B"
                style={{ fontSize: "13px", fontWeight: 500 }}
              />
              <YAxis stroke="#64748B" style={{ fontSize: "13px", fontWeight: 500 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  padding: "12px 16px",
                }}
                labelStyle={{ fontWeight: 600, color: "#1E293B", marginBottom: "4px" }}
                itemStyle={{ fontSize: "13px", fontWeight: 500 }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: "24px" }}
                iconType="circle"
              />
              <Area
                type="monotone"
                dataKey="engagement"
                stroke="#2563EB"
                strokeWidth={3}
                fill="url(#colorEngagement)"
                animationDuration={1000}
              />
              {timeRange === "daily" && (
                <>
                  <Area
                    type="monotone"
                    dataKey="participation"
                    stroke="#0D9488"
                    strokeWidth={2.5}
                    fill="url(#colorParticipation)"
                    animationDuration={1000}
                  />
                  <Area
                    type="monotone"
                    dataKey="focus"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fill="url(#colorFocus)"
                    animationDuration={1000}
                  />
                </>
              )}
              {timeRange === "weekly" && (
                <Area
                  type="monotone"
                  dataKey="participation"
                  stroke="#0D9488"
                  strokeWidth={2.5}
                  fill="url(#colorParticipation)"
                  animationDuration={1000}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </PremiumCard>

        {/* Engagement Heatmap */}
        <PremiumCard variant="elevated" padding="xl" delay={0.5} hoverable={false}>
          <div className="mb-10">
            <h2 className="text-[32px] font-bold text-foreground mb-2 tracking-tight leading-tight">
              Weekly Engagement Heatmap
            </h2>
            <p className="text-base text-muted-foreground font-medium">
              Your peak performance times throughout the week
            </p>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={heatmapData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="day" 
                stroke="#64748B" 
                style={{ fontSize: "13px", fontWeight: 500 }} 
              />
              <YAxis 
                stroke="#64748B" 
                style={{ fontSize: "13px", fontWeight: 500 }} 
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  padding: "12px 16px",
                }}
                labelStyle={{ fontWeight: 600, color: "#1E293B", marginBottom: "4px" }}
                itemStyle={{ fontSize: "13px", fontWeight: 500 }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: "24px" }}
                iconType="circle"
              />
              <Bar dataKey="9-10" stackId="a" fill="#2563EB" radius={[0, 0, 0, 0]} />
              <Bar dataKey="10-11" stackId="a" fill="#0D9488" radius={[0, 0, 0, 0]} />
              <Bar dataKey="11-12" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="1-2" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} />
              <Bar dataKey="2-3" stackId="a" fill="#F87171" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </PremiumCard>

        {/* Insights */}
        <PremiumCard variant="bordered" padding="xl" delay={0.6} hoverable={false}>
          <h3 className="text-[24px] font-bold text-foreground mb-8 tracking-tight">
            📊 Key Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { 
                color: "#2563EB", 
                text: "Your engagement has improved by ",
                highlight: "12%",
                suffix: " over the past month."
              },
              { 
                color: "#0D9488", 
                text: "Peak performance hours: ",
                highlight: "1-2 PM",
                suffix: " across all days."
              },
              { 
                color: "#10B981", 
                text: "Best day: ",
                highlight: "Friday",
                suffix: " with 92% average engagement."
              },
              { 
                color: "#F59E0B", 
                text: "Consistency: ",
                highlight: "24 active days",
                suffix: " this month."
              },
            ].map((insight, index) => (
              <div key={index} className="flex items-start gap-3">
                <div 
                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: insight.color }}
                />
                <p className="text-base text-foreground leading-relaxed">
                  {insight.text}
                  <strong className="font-bold">{insight.highlight}</strong>
                  {insight.suffix}
                </p>
              </div>
            ))}
          </div>
        </PremiumCard>
      </SectionContainer>
    </div>
  );
}