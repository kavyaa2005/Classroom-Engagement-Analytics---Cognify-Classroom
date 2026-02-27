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

// Mock data
const weeklyComparison = [
  { week: "Week 1", you: 78, class: 72 },
  { week: "Week 2", you: 82, class: 74 },
  { week: "Week 3", you: 85, class: 76 },
  { week: "Week 4", you: 88, class: 78 },
];

const performanceData = [
  { subject: "Math", score: 85 },
  { subject: "Science", score: 92 },
  { subject: "English", score: 78 },
  { subject: "History", score: 88 },
];

export default function ClassPerformance() {
  const [comparisonMode, setComparisonMode] = useState<"week" | "month">("week");

  return (
    <div className="min-h-screen">
      {/* Premium Page Header */}
      <PremiumPageHeader
        title="My Class Performance"
        subtitle="Compare your engagement with class averages"
        badge="Class 10A"
      />

      {/* Main Content */}
      <SectionContainer className="space-y-12 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Users, label: "Class Rank", value: "#8", sublabel: "out of 32", color: "#2563EB" },
            { icon: TrendingUp, label: "Percentile", value: "75th", sublabel: "Top 25%", color: "#10B981" },
            { icon: Award, label: "Improvement", value: "+12%", sublabel: "vs last month", color: "#0D9488" },
            { icon: Target, label: "Consistency", value: "92%", sublabel: "attendance", color: "#F59E0B" },
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
                  <strong className="font-semibold">Focus Duration:</strong> Above class average by 9%
                </p>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                <p className="text-base text-foreground leading-relaxed">
                  <strong className="font-semibold">Consistency:</strong> Regular attendance and engagement
                </p>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                <p className="text-base text-foreground leading-relaxed">
                  <strong className="font-semibold">Peak Performance:</strong> Friday afternoon sessions
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
                  <strong className="font-semibold">Early Participation:</strong> Respond earlier in discussions
                </p>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p className="text-base text-foreground leading-relaxed">
                  <strong className="font-semibold">Monday Sessions:</strong> Focus improvement needed
                </p>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p className="text-base text-foreground leading-relaxed">
                  <strong className="font-semibold">Question Asking:</strong> Increase active participation
                </p>
              </li>
            </ul>
          </PremiumCard>
        </div>
      </SectionContainer>
    </div>
  );
}