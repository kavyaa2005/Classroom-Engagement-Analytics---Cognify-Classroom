import { motion } from "motion/react";

interface LiveStatusIndicatorProps {
  isLive?: boolean;
  label?: string;
}

export default function LiveStatusIndicator({ 
  isLive = true,
  label = "Live" 
}: LiveStatusIndicatorProps) {
  if (!isLive) return null;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-attention/10 rounded-full">
      <div className="relative flex items-center justify-center">
        <motion.div
          className="w-2 h-2 bg-attention rounded-full"
          animate={{
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-2 h-2 bg-attention rounded-full"
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      <span className="text-sm font-medium text-attention">{label}</span>
    </div>
  );
}
