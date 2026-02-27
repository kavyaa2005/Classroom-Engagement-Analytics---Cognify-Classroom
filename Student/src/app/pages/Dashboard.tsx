import { motion } from "motion/react";
import { useState, useEffect } from "react";
import {
  Activity,
  TrendingUp,
  Target,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Lightbulb,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import PremiumCard from "../components/PremiumCard";
import PremiumPageHeader from "../components/PremiumPageHeader";
import Button from "../components/Button";
import Badge from "../components/Badge";
import StatusIndicator from "../components/StatusIndicator";
import SectionContainer from "../components/SectionContainer";
import CircularProgress from "../components/CircularProgress";
import { LineChart, Line, ResponsiveContainer } from "recharts";

// Mock data for mini charts
const weeklyData = [
  { value: 75 },
  { value: 78 },
  { value: 82 },
  { value: 79 },
  { value: 85 },
  { value: 88 },
  { value: 86 },
];

const focusTimelineData = [
  { time: "9:00", engagement: 75 },
  { time: "9:30", engagement: 82 },
  { time: "10:00", engagement: 78 },
  { time: "10:30", engagement: 88 },
  { time: "11:00", engagement: 85 },
];

export default function Dashboard() {
  const [greeting, setGreeting] = useState("Good Morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const studentScore = 82;
  const classAverage = 76;
  const focusTrend = 6.5; // percentage change

  return (
    <div className="min-h-screen">
      {/* Premium Page Header */}
      <PremiumPageHeader
        title={`${greeting}, Kavya`}
        subtitle="Here's how your class is performing today"
        badge="Class 10A"
      />

      {/* Main Content */}
      <SectionContainer className="space-y-12 py-12">
        {/* Performance Cards Grid - 8pt grid spacing (24px = 3*8) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Today's Engagement */}
          <PremiumCard
            title="Today's Engagement"
            icon={Activity}
            iconColor="#2563EB"
            delay={0}
            variant="default"
          >
            <div className="flex justify-center mt-2">
              <CircularProgress value={studentScore} />
            </div>
          </PremiumCard>

          {/* Weekly Average */}
          <PremiumCard
            title="Weekly Average"
            value="84%"
            icon={TrendingUp}
            iconColor="#0D9488"
            delay={0.1}
            variant="default"
          >
            <div className="mt-2">
              <ResponsiveContainer width="100%" height={60}>
                <LineChart data={weeklyData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0D9488"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </PremiumCard>

          {/* Focus Trend */}
          <PremiumCard
            title="Focus Trend"
            value={`${focusTrend > 0 ? "+" : ""}${focusTrend}%`}
            icon={Target}
            iconColor={focusTrend > 0 ? "#10B981" : "#F87171"}
            delay={0.2}
            variant="default"
          >
            <div className="flex items-center gap-2 mt-4">
              {focusTrend > 0 ? (
                <ArrowUpRight className="w-5 h-5 text-success" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-attention" />
              )}
              <span className="text-sm text-muted-foreground font-medium">
                vs last week
              </span>
            </div>
          </PremiumCard>

          {/* Participation Score */}
          <PremiumCard
            title="Participation Score"
            value={78}
            icon={Users}
            iconColor="#F59E0B"
            delay={0.3}
            countUp={true}
            variant="default"
          >
            <div className="w-full bg-muted rounded-full h-2.5 mt-4">
              <motion.div
                className="bg-warning h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "78%" }}
                transition={{ delay: 0.5, duration: 1, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
          </PremiumCard>
        </div>

        {/* Class Performance Overview */}
        <PremiumCard variant="elevated" padding="xl" delay={0.4} hoverable={false}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-[32px] font-bold text-foreground mb-2 tracking-tight leading-tight">
                Class 10A Engagement Status
              </h2>
              <p className="text-base text-muted-foreground font-medium">
                Real-time performance comparison
              </p>
            </div>
            <StatusIndicator status="live" size="lg" showPulse={true} />
          </div>

          {/* Class Average */}
          <div className="mb-10">
            <div className="flex items-baseline gap-4 mb-4">
              <motion.span
                className="text-[56px] font-bold text-foreground leading-none tracking-tight"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                {classAverage}%
              </motion.span>
              <span className="text-lg text-muted-foreground font-medium">
                Class Average Engagement
              </span>
            </div>
            
            {/* Status Badge */}
            <Badge
              variant={classAverage >= 80 ? "success" : classAverage >= 60 ? "primary" : "warning"}
              size="md"
              animated={true}
            >
              {classAverage >= 80 && "✓ Your class is highly focused today"}
              {classAverage >= 60 && classAverage < 80 && "→ Your class engagement is stable"}
              {classAverage < 60 && "⚠ Class engagement is dropping"}
            </Badge>
          </div>

          {/* Comparison Bars - Improved spacing (32px = 4*8) */}
          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-3">
                <span className="text-base font-semibold text-foreground">Your Score</span>
                <span className="text-base font-bold text-primary">{studentScore}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-4">
                <motion.div
                  className="bg-primary h-4 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${studentScore}%` }}
                  transition={{ delay: 0.9, duration: 1, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-3">
                <span className="text-base font-semibold text-foreground">Class Average</span>
                <span className="text-base font-bold text-secondary">{classAverage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-4">
                <motion.div
                  className="bg-secondary h-4 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${classAverage}%` }}
                  transition={{ delay: 1.1, duration: 1, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
            </div>
          </div>
        </PremiumCard>

        {/* Live Class Status & Timeline */}
        <PremiumCard variant="elevated" padding="xl" delay={0.5} hoverable={false}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-[12px] bg-primary/10 flex items-center justify-center">
              <Clock className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-[28px] font-bold text-foreground tracking-tight">
                Live Class Engagement
              </h2>
            </div>
            <StatusIndicator status="live" size="md" />
          </div>

          <div className="mb-8">
            <div className="flex items-baseline gap-4">
              <motion.span
                className="text-[48px] font-bold text-foreground tracking-tight"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                74%
              </motion.span>
              <span className="text-base text-muted-foreground font-medium">
                Current engagement level
              </span>
            </div>
          </div>

          {/* Mini Timeline */}
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={focusTimelineData}>
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#2563EB"
                  strokeWidth={3}
                  dot={{ fill: "#2563EB", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </PremiumCard>

        {/* Teacher Feedback & AI Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Teacher Feedback */}
          <PremiumCard variant="elevated" padding="xl" delay={0.6} hoverable={false}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-[12px] bg-success/10 flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-success" />
              </div>
              <h2 className="text-[28px] font-bold text-foreground tracking-tight">
                Teacher Insights
              </h2>
            </div>

            <div className="space-y-4 mb-8">
              <motion.div
                className="p-6 bg-success/5 border-l-4 border-success rounded-xl cursor-pointer hover:bg-success/10 transition-all duration-200"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <p className="text-base text-foreground font-semibold mb-2">
                  Great Progress!
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Participation improved in last session.
                </p>
              </motion.div>

              <motion.div
                className="p-6 bg-primary/5 border-l-4 border-primary rounded-xl cursor-pointer hover:bg-primary/10 transition-all duration-200"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <p className="text-base text-foreground font-semibold mb-2">
                  Engagement Tip
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Try responding earlier in class discussions.
                </p>
              </motion.div>
            </div>

            <Button variant="primary" size="lg" fullWidth icon={ArrowRight} iconPosition="right">
              View All Feedback
            </Button>
          </PremiumCard>

          {/* AI Personal Recommendations */}
          <PremiumCard variant="elevated" padding="xl" delay={0.6} hoverable={false}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-[12px] bg-warning/10 flex items-center justify-center">
                <Lightbulb className="w-7 h-7 text-warning" />
              </div>
              <h2 className="text-[28px] font-bold text-foreground tracking-tight">
                AI Learning Insights
              </h2>
            </div>

            <div className="space-y-4 mb-8">
              <motion.div
                className="p-6 bg-warning/5 rounded-xl border border-warning/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-base text-foreground font-semibold mb-2">
                  🎯 You focus better in first 30 minutes
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your engagement peaks early in class sessions.
                </p>
              </motion.div>

              <motion.div
                className="p-6 bg-secondary/5 rounded-xl border border-secondary/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <p className="text-base text-foreground font-semibold mb-2">
                  📚 Pre-class preparation helps
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Try reviewing notes before class for better engagement.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="secondary" size="lg">
                Detailed Report
              </Button>
              <Button variant="outline" size="lg">
                Set Goal
              </Button>
            </div>
          </PremiumCard>
        </div>
      </SectionContainer>
    </div>
  );
}