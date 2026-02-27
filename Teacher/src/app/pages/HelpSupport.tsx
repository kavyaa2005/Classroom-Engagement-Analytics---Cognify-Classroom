import { motion } from "motion/react";
import { HelpCircle, Book, MessageCircle, Mail, Video, FileText } from "lucide-react";

const helpResources = [
  {
    icon: Book,
    title: "Getting Started Guide",
    description: "Learn the basics of EngageAI and start monitoring your classes",
    color: "#2563EB",
    action: "Read Guide",
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Watch step-by-step tutorials on all features",
    color: "#10B981",
    action: "Watch Videos",
  },
  {
    icon: FileText,
    title: "Documentation",
    description: "Comprehensive documentation for all features",
    color: "#F59E0B",
    action: "View Docs",
  },
  {
    icon: MessageCircle,
    title: "Live Chat Support",
    description: "Chat with our support team for instant help",
    color: "#0D9488",
    action: "Start Chat",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us your questions and we'll respond within 24 hours",
    color: "#F87171",
    action: "Send Email",
  },
];

const faqs = [
  {
    question: "How does AI engagement tracking work?",
    answer:
      "EngageAI uses computer vision and machine learning to analyze student facial expressions, body language, and attention patterns in real-time to provide engagement scores.",
  },
  {
    question: "Is student data kept private and secure?",
    answer:
      "Yes, all student data is encrypted and stored securely. We comply with all education privacy regulations and never share data with third parties.",
  },
  {
    question: "Can I export my reports?",
    answer:
      "Absolutely! You can export detailed reports in PDF format from the Engagement Reports page. You can also share reports with administrators.",
  },
  {
    question: "How accurate is the engagement detection?",
    answer:
      "Our AI model has been trained on thousands of classroom sessions and achieves 92% accuracy in engagement detection.",
  },
];

export function HelpSupport() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-[28px] font-semibold text-[#1E293B] mb-2 flex items-center gap-3">
          <HelpCircle className="w-8 h-8 text-[#2563EB]" />
          Help & Support
        </h1>
        <p className="text-[16px] text-[#64748B]">
          Find answers, resources, and get help when you need it.
        </p>
      </motion.div>

      {/* Help Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {helpResources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
              className="bg-white rounded-[18px] p-6 cursor-pointer transition-all duration-300"
              style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
            >
              <div
                className="w-14 h-14 rounded-[12px] flex items-center justify-center mb-4"
                style={{ backgroundColor: `${resource.color}15` }}
              >
                <Icon className="w-7 h-7" style={{ color: resource.color }} />
              </div>
              <h3 className="text-[16px] font-semibold text-[#1E293B] mb-2">
                {resource.title}
              </h3>
              <p className="text-[14px] text-[#64748B] mb-4">{resource.description}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-[14px] font-medium"
                style={{ color: resource.color }}
              >
                {resource.action} →
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* FAQs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-[18px] p-8"
        style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
      >
        <h2 className="text-[20px] font-semibold text-[#1E293B] mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="border-b border-[#F8FAFC] last:border-b-0 pb-6 last:pb-0"
            >
              <h3 className="text-[16px] font-semibold text-[#1E293B] mb-2 flex items-start gap-2">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-[12px] font-bold"
                >
                  Q
                </span>
                {faq.question}
              </h3>
              <p className="text-[14px] text-[#64748B] pl-8">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Contact Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-gradient-to-br from-[#2563EB] to-[#0D9488] rounded-[18px] p-8 text-white text-center"
      >
        <h2 className="text-[22px] font-semibold mb-3">Still need help?</h2>
        <p className="text-[16px] opacity-90 mb-6">
          Our support team is here to assist you 24/7
        </p>
        <div className="flex gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white text-[#2563EB] rounded-[12px] font-medium"
          >
            Contact Support
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-[12px] font-medium border border-white/30"
          >
            Schedule a Demo
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
