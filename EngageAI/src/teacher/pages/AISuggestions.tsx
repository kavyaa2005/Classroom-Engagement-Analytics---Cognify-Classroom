import { motion } from "motion/react";
import { Lightbulb, BookOpen, Users, MessageCircle, CheckCircle } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";

interface TeacherDash {
  studentsAtRisk: number;
  liveEngagement: number;
  weeklyTrend: { date: string; value: number }[];
}

function buildSuggestions(data: TeacherDash | null) {
  const risk = data?.studentsAtRisk ?? 0;
  const live = data?.liveEngagement ?? 0;
  const trend = data?.weeklyTrend ?? [];
  const lastAvg = trend.length ? trend[trend.length - 1].value : 0;
  const prevAvg = trend.length > 1 ? trend[trend.length - 2].value : lastAvg;
  const declining = lastAvg < prevAvg - 5;

  const teaching: string[] = [];
  const engagement: string[] = [];
  const communication: string[] = [];

  if (live < 60) {
    teaching.push("Switch to an interactive activity — engagement is currently low.");
    teaching.push("Break the lesson into shorter 10-minute segments with quick recaps.");
  } else if (live < 80) {
    teaching.push("Use visual aids or a live demo to maintain current momentum.");
    teaching.push("Incorporate a short quiz at the halfway mark.");
  } else {
    teaching.push("Excellent live engagement! Introduce a slightly challenging extension task.");
    teaching.push("Record today's session — this is a great example for future reference.");
  }
  teaching.push("Incorporate real-world examples relevant to the topic at hand.");

  if (risk > 3) {
    engagement.push(`${risk} students are at risk — consider targeted small-group work.`);
    engagement.push("Assign peer mentors to help struggling students.");
  } else if (risk > 0) {
    engagement.push(`${risk} student${risk > 1 ? "s" : ""} need extra support today.`);
    engagement.push("Use think-pair-share activities to encourage participation.");
  } else {
    engagement.push("All students are engaged — great time for a collaborative project.");
    engagement.push("Introduce optional challenge problems for advanced learners.");
  }
  engagement.push("Use a 1-minute exit ticket to check comprehension before ending class.");

  if (declining) {
    communication.push("Engagement dropped this week — consider a brief class survey.");
    communication.push("Reach out proactively to parents of students showing a downward trend.");
  } else {
    communication.push("Share last week's positive engagement stats in your next parent update.");
    communication.push("Celebrate class milestones to keep motivation high.");
  }
  communication.push("Post a summary of today's key points in the class forum after the session.");

  return [
    { category: "Teaching Strategies", icon: BookOpen, color: "#2563EB", items: teaching },
    { category: "Student Engagement", icon: Users, color: "#10B981", items: engagement },
    { category: "Communication", icon: MessageCircle, color: "#F59E0B", items: communication },
  ];
}

export function AISuggestions() {
  const { data } = useFetch<TeacherDash>("/api/analytics/dashboard/teacher");
  const suggestions = buildSuggestions(data);

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-[28px] font-semibold text-[#1E293B] mb-2 flex items-center gap-3">
          <Lightbulb className="w-8 h-8 text-[#F59E0B]" />
          AI Suggestions
        </h1>
        <p className="text-[16px] text-[#64748B]">
          Personalized recommendations to improve your teaching effectiveness.
        </p>
      </motion.div>

      {/* Suggestions */}
      <div className="space-y-6">
        {suggestions.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[18px] p-6"
              style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-[12px] flex items-center justify-center"
                  style={{ backgroundColor: `${section.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: section.color }} />
                </div>
                <h2 className="text-[20px] font-semibold text-[#1E293B]">
                  {section.category}
                </h2>
              </div>
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + i * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#F8FAFC] transition-colors"
                  >
                    <CheckCircle
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      style={{ color: section.color }}
                    />
                    <span className="text-[14px] text-[#1E293B]">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
