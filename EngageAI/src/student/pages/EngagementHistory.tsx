import { motion } from "motion/react";
import { useState } from "react";
import { Calendar, TrendingUp, Clock, Target } from "lucide-react";
import PremiumCard from "../components/PremiumCard";
import PremiumPageHeader from "../components/PremiumPageHeader";
import SectionContainer from "../components/SectionContainer";
import {
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
import { useFetch } from "../../hooks/useFetch";

interface StudentDash {
  todayEngagement: number;
  weeklyAverage: number;
  weeklyData: { value: number }[];
  streak: number;
}

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

type TimeRange = "daily" | "weekly" | "monthly";

export default function EngagementHistory() {
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");
  const { data } = useFetch<StudentDash>("/api/analytics/dashboard/student");

  const rawWeekly = data?.weeklyData ?? [];
  const dailyData = rawWeekly.map((d, i) => ({
    day: DAYS[i] ?? `Day ${i + 1}`,
    engagement: Math.round(d.value),
    participation: Math.max(0, Math.round(d.value - 5)),
    focus: Math.min(100, Math.round(d.value + 5)),
  }));

  const weeklyData =
    rawWeekly.length >= 4
      ? [
          { week: "Week 1", engagement: Math.round(rawWeekly[0].value), participation: Math.round(rawWeekly[0].value - 5) },
          { week: "Week 2", engagement: Math.round(rawWeekly[2]?.value ?? rawWeekly[0].value), participation: Math.round((rawWeekly[2]?.value ?? rawWeekly[0].value) - 5) },
          { week: "Week 3", engagement: Math.round(rawWeekly[4]?.value ?? rawWeekly[0].value), participation: Math.round((rawWeekly[4]?.value ?? rawWeekly[0].value) - 5) },
          { week: "Week 4", engagement: Math.round(rawWeekly[6]?.value ?? rawWeekly[0].value), participation: Math.round((rawWeekly[6]?.value ?? rawWeekly[0].value) - 5) },
        ]
      : [{ week: "Week 1", engagement: data?.weeklyAverage ?? 0, participation: (data?.weeklyAverage ?? 0) - 5 }];

  const monthlyData = [
    { month: "This Week", engagement: data?.weeklyAverage ?? 0 },
  ];

  const best = dailyData.reduce((m, d) => Math.max(m, d.engagement), 0);
  const totalStudyH = Math.round((data?.streak ?? 0) * 1.5);
  const activeDays = rawWeekly.filter(d => d.value > 0).length;

  const getChartData = () => {
    if (timeRange === "weekly") return weeklyData;
    if (timeRange === "monthly") return monthlyData;
    return dailyData;
  };

  const xKey = timeRange === "weekly" ? "week" : timeRange === "monthly" ? "month" : "day";

  return (
    <div className="min-h-screen">
      {/* Premium Page Header */}
      <PremiumPageHeader
        title="Engagement History"
        subtitle="Track your learning performance over time"
        badge="My Class"
      />

      {/* Main Content */}
      <SectionContainer className="space-y-12 py-12">
        {/* Stats Overview - 8pt grid spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: TrendingUp, label: "Average Engagement", value: data?.weeklyAverage ? `${data.weeklyAverage}%` : "—", color: "#2563EB" },
            { icon: Target, label: "Best Performance", value: best ? `${best}%` : "—", color: "#10B981" },
            { icon: Clock, label: "Total Study Time", value: totalStudyH ? `${totalStudyH}h` : "—", color: "#0D9488" },
            { icon: Calendar, label: "Active Days", value: activeDays ? String(activeDays) : "—", color: "#F59E0B" },
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
                dataKey={xKey}
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
            <BarChart data={dailyData}>
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
              <Bar dataKey="engagement" stackId="a" fill="#2563EB" radius={[0, 0, 0, 0]} />
              <Bar dataKey="participation" stackId="a" fill="#0D9488" radius={[0, 0, 0, 0]} />
              <Bar dataKey="focus" stackId="a" fill="#10B981" radius={[8, 8, 0, 0]} />
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
              { color: "#2563EB", text: "Average engagement this week: ", highlight: data?.weeklyAverage ? `${data.weeklyAverage}%` : "—", suffix: " — keep it up!" },
              { color: "#0D9488", text: "Best single-day score: ", highlight: best ? `${best}%` : "—", suffix: "." },
              { color: "#10B981", text: "Current streak: ", highlight: `${data?.streak ?? 0} day${(data?.streak ?? 0) !== 1 ? "s" : ""}`, suffix: " of consistent attendance." },
              { color: "#F59E0B", text: "Active days tracked: ", highlight: `${activeDays}`, suffix: " this week." },
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