import { motion } from "motion/react";
import { useState } from "react";
import { MessageSquare, ThumbsUp, Lightbulb, TrendingUp, Calendar, Filter } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import PremiumCard from "../components/PremiumCard";
import PremiumPageHeader from "../components/PremiumPageHeader";
import SectionContainer from "../components/SectionContainer";
import Badge from "../components/Badge";
import Button from "../components/Button";

interface Feedback {
  id: number;
  type: "positive" | "suggestion" | "insight";
  title: string;
  message: string;
  date: string;
  subject: string;
  teacher: string;
  engagement: number[];
}

const feedbackData: Feedback[] = [
  {
    id: 1,
    type: "positive",
    title: "Excellent Participation",
    message: "Your engagement during the Mathematics session on Thursday was outstanding. Keep up the great work!",
    date: "2 days ago",
    subject: "Mathematics",
    teacher: "Dr. Smith",
    engagement: [75, 82, 88, 92, 95],
  },
  {
    id: 2,
    type: "suggestion",
    title: "Early Response Opportunity",
    message: "Try to raise your hand or respond within the first 5 minutes of class discussion. This will help build confidence and show active engagement.",
    date: "3 days ago",
    subject: "Science",
    teacher: "Ms. Johnson",
    engagement: [70, 72, 75, 78, 82],
  },
  {
    id: 3,
    type: "insight",
    title: "Focus Pattern Identified",
    message: "AI analysis shows you perform best during afternoon sessions. Consider reviewing morning session materials in the afternoon for better retention.",
    date: "5 days ago",
    subject: "General",
    teacher: "AI Coach",
    engagement: [65, 70, 80, 88, 90],
  },
  {
    id: 4,
    type: "positive",
    title: "Consistent Improvement",
    message: "Your engagement has improved by 12% over the past month. This upward trend is excellent!",
    date: "1 week ago",
    subject: "English",
    teacher: "Mr. Williams",
    engagement: [72, 75, 78, 82, 85],
  },
];

export default function TeacherFeedback() {
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case "positive":
        return ThumbsUp;
      case "suggestion":
        return Lightbulb;
      case "insight":
        return TrendingUp;
      default:
        return MessageSquare;
    }
  };

  const getFeedbackColor = (type: string) => {
    switch (type) {
      case "positive":
        return "#10B981";
      case "suggestion":
        return "#2563EB";
      case "insight":
        return "#0D9488";
      default:
        return "#64748B";
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <PremiumPageHeader
        title="Teacher Feedback"
        subtitle="Personalized insights from your teachers and AI coach"
        badge="Class 10A"
      />

      {/* Main Content */}
      <SectionContainer className="space-y-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feedback List */}
          <div className="lg:col-span-2 space-y-6">
            {feedbackData.map((feedback, index) => {
              const Icon = getFeedbackIcon(feedback.type);
              const color = getFeedbackColor(feedback.type);

              return (
                <motion.div
                  key={feedback.id}
                  className={`bg-white rounded-[16px] p-8 shadow-[0_8px_24px_rgba(0,0,0,0.06)] cursor-pointer transition-all duration-300 ease-in-out ${
                    selectedFeedback?.id === feedback.id
                      ? "ring-2 ring-primary shadow-[0_12px_32px_rgba(0,0,0,0.1)]"
                      : "hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] hover:-translate-y-1"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  onClick={() => setSelectedFeedback(feedback)}
                >
                  <div className="flex items-start gap-5">
                    <div
                      className="w-14 h-14 rounded-[12px] flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <Icon className="w-7 h-7" style={{ color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="text-[20px] font-bold text-foreground leading-tight">
                          {feedback.title}
                        </h3>
                        <Badge variant="neutral" size="sm">
                          {feedback.date}
                        </Badge>
                      </div>

                      <p className="text-base text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                        {feedback.message}
                      </p>

                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant="primary" size="md">
                          {feedback.subject}
                        </Badge>
                        <span className="text-sm text-muted-foreground font-medium">
                          {feedback.teacher}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Feedback Detail Panel */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white rounded-[16px] p-8 shadow-[0_8px_24px_rgba(0,0,0,0.06)] sticky top-24"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              {selectedFeedback ? (
                <>
                  <h3 className="text-[24px] font-bold text-foreground mb-8 tracking-tight">
                    Feedback Details
                  </h3>

                  <div className="space-y-6 mb-8">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                        Subject
                      </p>
                      <p className="text-base text-foreground font-medium">
                        {selectedFeedback.subject}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                        From
                      </p>
                      <p className="text-base text-foreground font-medium">
                        {selectedFeedback.teacher}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                        Date
                      </p>
                      <p className="text-base text-foreground font-medium">
                        {selectedFeedback.date}
                      </p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <p className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                      Engagement Trend
                    </p>
                    <ResponsiveContainer width="100%" height={100}>
                      <LineChart
                        data={selectedFeedback.engagement.map((value, index) => ({
                          index,
                          value,
                        }))}
                      >
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={getFeedbackColor(selectedFeedback.type)}
                          strokeWidth={3}
                          dot={{ fill: getFeedbackColor(selectedFeedback.type), r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-muted rounded-xl p-6 mb-6">
                    <p className="text-base text-foreground leading-relaxed">
                      {selectedFeedback.message}
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => setSelectedFeedback(null)}
                  >
                    Mark as Read
                  </Button>
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-base text-muted-foreground font-medium">
                    Select a feedback item to view details
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: ThumbsUp,
              label: "Positive Feedback",
              count: feedbackData.filter((f) => f.type === "positive").length,
              color: "success",
            },
            {
              icon: Lightbulb,
              label: "Suggestions",
              count: feedbackData.filter((f) => f.type === "suggestion").length,
              color: "primary",
            },
            {
              icon: TrendingUp,
              label: "AI Insights",
              count: feedbackData.filter((f) => f.type === "insight").length,
              color: "secondary",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            const gradient = {
              success: "from-success/5 to-success/10 border-success/20",
              primary: "from-primary/5 to-primary/10 border-primary/20",
              secondary: "from-secondary/5 to-secondary/10 border-secondary/20",
            }[stat.color];

            return (
              <PremiumCard
                key={index}
                variant="bordered"
                padding="lg"
                delay={0.5 + index * 0.1}
                className={`bg-gradient-to-br ${gradient}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-${stat.color}/15 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-[40px] font-bold text-foreground leading-none tracking-tight">
                      {stat.count}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">
                  {stat.label}
                </p>
              </PremiumCard>
            );
          })}
        </div>
      </SectionContainer>
    </div>
  );
}