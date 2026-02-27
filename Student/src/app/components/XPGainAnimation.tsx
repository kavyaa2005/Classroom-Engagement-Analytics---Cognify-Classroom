import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";

interface XPGainAnimationProps {
  show: boolean;
  amount: number;
}

export default function XPGainAnimation({ show, amount }: XPGainAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
          initial={{ opacity: 0, scale: 0, y: 0 }}
          animate={{ opacity: 1, scale: 1.5, y: -50 }}
          exit={{ opacity: 0, scale: 2, y: -100 }}
          transition={{ duration: 1 }}
        >
          <div className="bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            <span className="text-2xl font-bold">+{amount} XP</span>
            <Sparkles className="w-6 h-6" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
