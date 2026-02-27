import { motion } from "motion/react";
import { CheckCircle2, Circle } from "lucide-react";
import { useState, useEffect } from "react";

interface Mission {
  id: string;
  text: string;
  completed: boolean;
  progress: number;
  target: number;
}

export default function DailyMissions() {
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: "1",
      text: "Stay above 70% engagement",
      completed: true,
      progress: 82,
      target: 70,
    },
    {
      id: "2",
      text: "Participate in 1 quiz",
      completed: true,
      progress: 1,
      target: 1,
    },
    {
      id: "3",
      text: "Maintain 20-minute focus streak",
      completed: false,
      progress: 15,
      target: 20,
    },
  ]);

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Simulate mission completion
    const timer = setTimeout(() => {
      const newMissions = [...missions];
      if (!newMissions[2].completed) {
        newMissions[2].progress = 20;
        newMissions[2].completed = true;
        setMissions(newMissions);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white rounded-[20px] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.08)] relative overflow-hidden">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">🎮 Today's Focus Missions</h3>

      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: '50%',
                backgroundColor: ['#3B82F6', '#8B5CF6', '#22C55E', '#FBBF24'][Math.floor(Math.random() * 4)],
              }}
              initial={{ y: 0, opacity: 1 }}
              animate={{
                y: [0, -100, -200],
                x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200],
                opacity: [1, 1, 0],
                rotate: Math.random() * 360,
              }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
          ))}
        </div>
      )}

      <div className="space-y-4">
        {missions.map((mission, index) => (
          <motion.div
            key={mission.id}
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={mission.completed ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {mission.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300" />
                )}
              </motion.div>
              
              <span
                className={`flex-1 ${
                  mission.completed ? "line-through text-gray-400" : "text-gray-700"
                }`}
              >
                {mission.text}
              </span>

              <span className="text-sm text-gray-500">
                {mission.progress}/{mission.target}
              </span>
            </div>

            <div className="ml-9 h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]"
                initial={{ width: 0 }}
                animate={{ width: `${(mission.progress / mission.target) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Overall Progress</span>
          <span className="text-sm font-semibold text-[#3B82F6]">
            {missions.filter((m) => m.completed).length}/{missions.length} Completed
          </span>
        </div>
      </div>
    </div>
  );
}
