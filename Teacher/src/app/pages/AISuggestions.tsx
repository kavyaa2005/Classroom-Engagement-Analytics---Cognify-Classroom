import { motion } from "motion/react";
import { Lightbulb, BookOpen, Users, MessageCircle, CheckCircle } from "lucide-react";

const suggestions = [
  {
    category: "Teaching Strategies",
    icon: BookOpen,
    color: "#2563EB",
    items: [
      "Use visual aids to explain complex concepts",
      "Break lessons into 15-minute segments",
      "Incorporate real-world examples in mathematics",
    ],
  },
  {
    category: "Student Engagement",
    icon: Users,
    color: "#10B981",
    items: [
      "Start with a quick poll to gauge understanding",
      "Use gamification elements in quizzes",
      "Pair struggling students with peer mentors",
    ],
  },
  {
    category: "Communication",
    icon: MessageCircle,
    color: "#F59E0B",
    items: [
      "Send personalized feedback to students at risk",
      "Schedule parent-teacher meetings for low performers",
      "Create a class discussion forum",
    ],
  },
];

export function AISuggestions() {
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
