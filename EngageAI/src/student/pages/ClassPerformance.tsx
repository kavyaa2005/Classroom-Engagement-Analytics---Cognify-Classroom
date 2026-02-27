import { motion } from "motion/react";
import { useState } from "react";
import { Users, TrendingUp, Award, Target } from "lucide-react";
import PremiumCard from "../components/PremiumCard";
import PremiumPageHeader from "../components/PremiumPageHeader";
import SectionContainer from "../components/SectionContainer";
import Badge from "../components/Badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { useFetch } from "../../hooks/useFetch";

interface StudentDash {
  todayEngagement: number;
  weeklyAverage: number;
  weeklyData: { day: string; value: number }[];
  streak: number;
  classAverage?: number;
}
interface ClassInsightsData {
  classroomName: string;
  classSize: number;
  avgEngagement: number;
  weeklyClassTrend: { day: string; classAvg: number; yourScore: number }[];
  studentScore: number;
  classAverage: number;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ClassPerformance() {
  const [comparisonMode, setComparisonMode] = useState<"week" | "month">("week");
  const { data: dashData } = useFetch<StudentDash>("/api/analytics/dashboard/student");
  const { data: insightsData } = useFetch<ClassInsightsData>("/api/analytics/dashboard/student/class-insights");

  const classroomName = insightsData?.classroomName ?? "Class";
  const studentScore = insightsData?.studentScore ?? dashData?.weeklyAverage ?? 0;
  const classAverage = insightsData?.classAverage ?? 0;
  const classSize = insightsData?.classSize ?? 0;
  const aboveAvg = studentScore - classAverage;

  // Weekly comparison: student vs class
  const weeklyComparison = (insightsData?.weeklyClassTrend ?? []).map((d, i) => ({
    week: DAYS[i % 7],
    you: d.yourScore,
    class: d.classAvg,
  }));

  // Performance data from weekly engagement
  const rawWeekly = dashData?.weeklyData ?? [];
  const performanceData = rawWeekly.map((d, i) => ({
    subject: DAYS[i % 7],
    score: d.value,
  }));

  // Percentile approx: if above avg, estimate rank
  const percentile = classAverage > 0
    ? Math.min(99, Math.round((studentScore / classAverage) * 75))
    : 75;
  const improvement = rawWeekly.length >= 2
    ? rawWeekly[rawWeekly.length - 1].value - rawWeekly[0].value
    : 0;

  return (
    <div className="min-h-screen">
      {/* Premium Page Header */}
      <PremiumPageHeader
        title="My Class Performance"
        subtitle="Compare your engagement with class averages"
        badge={classroomName}
      />

      {/* Main Content */}
      <SectionContainer className="space-y-12 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Users, label: "Class Size", value: classSize ? String(classSize) : "—", sublabel: "students", color: "#2563EB" },
            { icon: TrendingUp, label: "Percentile", value: `${percentile}th`, sublabel: "estimated", color: "#10B981" },
            { icon: Award, label: "Improvement", value: improvement >= 0 ? `+${improvement}%` : `${improvement}%`, sublabel: "vs first day", color: "#0D9488" },
            { icon: Target, label: "Your Score", value: studentScore ? `${studentScore}%` : "—", sublabel: `class avg ${classAverage}%`, color: "#F59E0B" },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <PremiumCard
                key={index}
                icon={Icon}
                iconColor={stat.color}
                delay={index * 0.1}
                variant="default"
              >
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="text-[40px] font-bold text-foreground leading-none tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">
                    {stat.sublabel}
                  </p>
                </div>
              </PremiumCard>
            );
          })}
        </div>

        {/* Class Comparison Chart */}
        <PremiumCard variant="elevated" padding="xl" delay={0.4} hoverable={false}>
          <div className="mb-10">
            <h2 className="text-[32px] font-bold text-foreground mb-2 tracking-tight leading-tight">
              Performance Comparison
            </h2>
            <p className="text-base text-muted-foreground font-medium">
              How you stack up against class benchmarks
            </p>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="subject" 
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
                labelStyle={{ fontWeight: 600, color: "#0F172A", marginBottom: "4px" }}
                itemStyle={{ fontSize: "13px", fontWeight: 500 }}
              />
              <Bar 
                dataKey="score" 
                fill="#2563EB" 
                radius={[8, 8, 0, 0]} 
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </PremiumCard>

        {/* Progress Over Time */}
        <PremiumCard variant="elevated" padding="xl" delay={0.5} hoverable={false}>
          <div className="mb-10">
            <h2 className="text-[32px] font-bold text-foreground mb-2 tracking-tight leading-tight">
              Weekly Progress Tracking
            </h2>
            <p className="text-base text-muted-foreground font-medium">
              Your performance vs class average over time
            </p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="week" 
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
                labelStyle={{ fontWeight: 600, color: "#0F172A", marginBottom: "4px" }}
                itemStyle={{ fontSize: "13px", fontWeight: 500 }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: "24px" }}
                iconType="circle"
              />
              <Line
                type="monotone"
                dataKey="you"
                stroke="#2563EB"
                strokeWidth={3}
                dot={{ fill: "#2563EB", r: 5 }}
                name="Your Score"
                animationDuration={1000}
              />
              <Line
                type="monotone"
                dataKey="class"
                stroke="#64748B"
                strokeWidth={2.5}
                strokeDasharray="5 5"
                dot={{ fill: "#64748B", r: 4 }}
                name="Class Average"
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </PremiumCard>

        {/* Strengths & Areas for Growth */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PremiumCard 
            variant="bordered" 
            padding="xl" 
            delay={0.6}
            className="bg-gradient-to-br from-success/5 to-success/10 border-success/20"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-success/15 flex items-center justify-center">
                <Award className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-[24px] font-bold text-foreground tracking-tight">
                Your Strengths
              </h3>
            </div>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                <p className="text-base text-foreground leading-relaxed">
                  <strong className="font-semibold">Focus Duration:</strong> {aboveAvg >= 0 ? `Above class average by ${aboveAvg}%` : "Working towards class average"}
                </p>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                <p className="text-base text-foreground leading-relaxed">
                  <strong className="font-semibold">Weekly Streak:</strong> {dashData?.streak ?? 0} consecutive active days
                </p>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                <p className="text-base text-foreground leading-relaxed">
                  <strong className="font-semibold">Improvement:</strong> {improvement >= 0 ? `+${improvement}% since first recorded session` : `${improvement}% change this week`}
                </p>
              </li>
            </ul>
          </PremiumCard>

          <PremiumCard 
            variant="bordered" 
            padding="xl" 
            delay={0.6}
            className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-[24px] font-bold text-foreground tracking-tight">
                Growth Opportunities
              </h3>
            </div>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p className="text-base text-foreground leading-relaxed">
                  <strong className="font-semibold">Increase Participation:</strong> Respond earlier in class discussions
                </p>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p className="text-base text-foreground leading-relaxed">
                  <strong className="font-semibold">Low Engagement Days:</strong> {rawWeekly.filter(d => d.value < 50).length > 0 ? `${rawWeekly.filter(d => d.value < 50).length} day(s) below 50% this week` : "No low days this week — great job!"}
                </p>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p className="text-base text-foreground leading-relaxed">
                  <strong className="font-semibold">Class Gap:</strong> {aboveAvg < 0 ? `${Math.abs(aboveAvg)}% below class average — keep pushing!` : "You are above the class average."}
                </p>
              </li>
            </ul>
          </PremiumCard>
        </div>
      </SectionContainer>
    </div>
  );
}