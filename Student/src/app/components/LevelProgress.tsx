import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";

interface LevelProgressProps {
  currentXP: number;
  maxXP: number;
  level: number;
  levelTitle: string;
}

export default function LevelProgress({ currentXP, maxXP, level, levelTitle }: LevelProgressProps) {
  const progress = (currentXP / maxXP) * 100;

  return (
    <Tooltip.Provider>
      <div className="bg-white rounded-[20px] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Focus Level</h3>
            <p className="text-sm text-gray-600">
              Level {level} – {levelTitle}
            </p>
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-8 h-8 text-[#FBBF24]" />
          </motion.div>
        </div>

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className="relative">
              <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/30"
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      width: '50%',
                      filter: 'blur(8px)',
                    }}
                  />
                </motion.div>
              </div>
              <div className="mt-2 text-center">
                <span className="text-sm font-semibold text-gray-700">
                  {currentXP} / {maxXP} XP
                </span>
              </div>
            </div>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm"
              sideOffset={5}
            >
              Earn XP by staying focused during class
              <Tooltip.Arrow className="fill-gray-900" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </div>
    </Tooltip.Provider>
  );
}
