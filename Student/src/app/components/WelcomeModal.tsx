import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Sparkles, Trophy, Target, Zap, X } from "lucide-react";

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen welcome modal before
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-lg"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <div className="bg-white rounded-[24px] p-8 shadow-2xl relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#3B82F6]/10 to-[#8B5CF6]/10 rounded-full blur-3xl" />
              
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative z-10">
                <motion.div
                  className="w-20 h-20 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-2xl flex items-center justify-center mx-auto mb-6"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>

                <h2 className="text-3xl font-bold text-gray-800 text-center mb-3">
                  Welcome to FocusGame! 🎉
                </h2>
                
                <p className="text-gray-600 text-center mb-8">
                  Your personal focus improvement journey starts here. This is not a monitoring system—it's your game to win!
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#FBBF24]/10 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-[#FBBF24]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Earn XP</h3>
                      <p className="text-sm text-gray-600">Stay focused to level up and unlock rewards</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-5 h-5 text-[#8B5CF6]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Collect Badges</h3>
                      <p className="text-sm text-gray-600">Achieve milestones and show off your progress</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#22C55E]/10 flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-[#22C55E]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Complete Missions</h3>
                      <p className="text-sm text-gray-600">Daily challenges to keep you motivated</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white rounded-full font-semibold hover:shadow-lg transition-shadow"
                >
                  Let's Start! 🚀
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
