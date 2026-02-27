import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface EngagementScoreProps {
  score: number;
}

export default function EngagementScore({ score }: EngagementScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayScore(score);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const getMessage = () => {
    if (score >= 85) return "Excellent Focus! Keep it up! 🌟";
    if (score >= 60) return "Good Job! You're improving! 👍";
    return "Let's try a little more focus next time! 💪";
  };

  const getColor = () => {
    if (score >= 85) return "#22C55E";
    if (score >= 60) return "#3B82F6";
    return "#FB7185";
  };

  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="bg-white rounded-[20px] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Your Focus Score Today
      </h3>

      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48">
          <svg className="transform -rotate-90 w-48 h-48">
            {/* Background circle */}
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="none"
            />
            
            {/* Progress circle */}
            <motion.circle
              cx="96"
              cy="96"
              r="70"
              stroke={getColor()}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{
                strokeDasharray: circumference,
                filter: `drop-shadow(0 0 8px ${getColor()}40)`,
              }}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <div className="text-5xl font-bold" style={{ color: getColor() }}>
                {Math.round(displayScore)}%
              </div>
            </motion.div>
          </div>
        </div>

        <motion.p
          className="mt-6 text-center font-semibold text-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          style={{ color: getColor() }}
        >
          {getMessage()}
        </motion.p>
      </div>
    </div>
  );
}
