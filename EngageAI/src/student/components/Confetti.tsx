import { motion } from "motion/react";

interface ConfettiProps {
  count?: number;
}

export default function Confetti({ count = 50 }: ConfettiProps) {
  const colors = ['#3B82F6', '#8B5CF6', '#22C55E', '#FBBF24', '#FB7185'];

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10%',
            width: Math.random() * 10 + 5,
            height: Math.random() * 10 + 5,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight + 100,
            x: (Math.random() - 0.5) * 200,
            opacity: [1, 1, 0],
            rotate: Math.random() * 720,
          }}
          transition={{
            duration: Math.random() * 2 + 2,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}
