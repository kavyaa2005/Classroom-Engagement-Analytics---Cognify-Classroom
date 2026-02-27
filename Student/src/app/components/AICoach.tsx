import { motion, AnimatePresence } from "motion/react";
import { Bot, X, Lightbulb } from "lucide-react";
import { useState } from "react";

const tips = [
  {
    title: "Study Tip",
    content: "Try the Pomodoro Technique: 25 minutes of focused work followed by a 5-minute break!",
  },
  {
    title: "Break Suggestion",
    content: "You've been focused for a while! Take a 5-minute walk to refresh your mind.",
  },
  {
    title: "Focus Technique",
    content: "Minimize distractions by closing unnecessary tabs and putting your phone on silent.",
  },
];

export default function AICoach() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTips, setShowTips] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-full shadow-lg flex items-center justify-center z-40"
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0 }}
            animate={{ scale: 1, y: [0, -10, 0] }}
            exit={{ scale: 0 }}
            transition={{
              y: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bot className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 max-w-[calc(100vw-3rem)] sm:max-w-none"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            <div className="bg-white rounded-[20px] shadow-[0_15px_40px_rgba(0,0,0,0.15)] overflow-hidden w-[320px] sm:w-80">
              {/* AI Character */}
              <div className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] p-6 relative">
                <button
                  className="absolute top-4 right-4 text-white/80 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4">
                  <motion.div
                    className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center"
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Bot className="w-8 h-8 text-white" />
                    <motion.div
                      className="absolute top-4 right-3 w-2 h-2 bg-white rounded-full"
                      animate={{
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  </motion.div>

                  <div>
                    <h4 className="text-white font-semibold text-lg">Focus Buddy</h4>
                    <p className="text-white/80 text-sm">Your AI Coach</p>
                  </div>
                </div>
              </div>

              {/* Message */}
              {!showTips ? (
                <div className="p-6">
                  <div className="bg-gray-50 rounded-2xl p-4 mb-4 relative">
                    <div className="absolute -top-2 left-6 w-4 h-4 bg-gray-50 transform rotate-45" />
                    <p className="text-gray-700">
                      You're doing great today! Keep up the amazing focus! 🌟
                    </p>
                  </div>

                  <button
                    className="w-full px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white rounded-full hover:shadow-lg transition-shadow"
                    onClick={() => setShowTips(true)}
                  >
                    <Lightbulb className="w-4 h-4 inline mr-2" />
                    View Tips
                  </button>
                </div>
              ) : (
                <div className="p-6">
                  <button
                    className="text-sm text-gray-600 hover:text-gray-800 mb-4"
                    onClick={() => setShowTips(false)}
                  >
                    ← Back
                  </button>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {tips.map((tip, index) => (
                      <motion.div
                        key={index}
                        className="bg-gradient-to-r from-[#EFF6FF] to-[#F5F3FF] rounded-xl p-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <h5 className="font-semibold text-gray-800 mb-1">{tip.title}</h5>
                        <p className="text-sm text-gray-600">{tip.content}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}