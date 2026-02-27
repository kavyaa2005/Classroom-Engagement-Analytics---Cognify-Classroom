import { motion } from "motion/react";
import { Flame, BookOpen, Target, Star } from "lucide-react";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

interface Badge {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  isNew?: boolean;
}

const badges: Badge[] = [
  {
    id: "1",
    icon: <Flame className="w-8 h-8" />,
    title: "Focus Streak",
    description: "5 Days of consistent engagement",
    color: "#FB7185",
    isNew: true,
  },
  {
    id: "2",
    icon: <BookOpen className="w-8 h-8" />,
    title: "Quiz Master",
    description: "Answered 10 quiz questions correctly",
    color: "#3B82F6",
  },
  {
    id: "3",
    icon: <Target className="w-8 h-8" />,
    title: "High Attention Class",
    description: "Maintained 90%+ focus for a full session",
    color: "#8B5CF6",
  },
  {
    id: "4",
    icon: <Star className="w-8 h-8" />,
    title: "90% Engagement Champion",
    description: "Weekly average above 90%",
    color: "#22C55E",
    isNew: true,
  },
];

export default function AchievementBadges() {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  return (
    <div className="bg-white rounded-[20px] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">🏆 Achievement Badges</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {badges.map((badge, index) => (
          <motion.button
            key={badge.id}
            className="relative p-3 sm:p-4 rounded-2xl border-2 border-gray-100 hover:border-gray-200 transition-all cursor-pointer"
            style={{ backgroundColor: `${badge.color}10` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: `0 10px 30px ${badge.color}40`,
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedBadge(badge)}
          >
            {badge.isNew && (
              <motion.div
                className="absolute -top-2 -right-2 bg-[#FB7185] text-white text-xs px-2 py-1 rounded-full"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                NEW!
              </motion.div>
            )}
            
            <motion.div
              className="flex flex-col items-center gap-2"
              animate={badge.isNew ? { y: [0, -5, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div style={{ color: badge.color }}>
                {badge.icon}
              </div>
              <p className="text-xs font-semibold text-gray-700 text-center">
                {badge.title}
              </p>
            </motion.div>
          </motion.button>
        ))}
      </div>

      <Dialog.Root open={!!selectedBadge} onOpenChange={() => setSelectedBadge(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[20px] p-8 shadow-xl z-50 max-w-md w-full">
            {selectedBadge && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <motion.div
                  className="inline-flex p-6 rounded-full mb-4"
                  style={{ backgroundColor: `${selectedBadge.color}20` }}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <div style={{ color: selectedBadge.color }}>
                    {selectedBadge.icon}
                  </div>
                </motion.div>
                
                <Dialog.Title className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedBadge.title}
                </Dialog.Title>
                
                <Dialog.Description className="text-gray-600 mb-6">
                  {selectedBadge.description}
                </Dialog.Description>

                <Dialog.Close asChild>
                  <button className="px-6 py-2 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white rounded-full hover:shadow-lg transition-shadow">
                    Awesome!
                  </button>
                </Dialog.Close>
              </motion.div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}