import { motion } from "motion/react";

type StatusType = "success" | "warning" | "danger" | "info" | "live";
type StatusSize = "sm" | "md" | "lg";

interface StatusIndicatorProps {
  status?: StatusType;
  label?: string;
  size?: StatusSize;
  showPulse?: boolean;
  className?: string;
}

export default function StatusIndicator({
  status = "success",
  label,
  size = "md",
  showPulse = true,
  className = "",
}: StatusIndicatorProps) {
  const statusColors = {
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#F87171",
    info: "#2563EB",
    live: "#F87171",
  };

  const statusLabels = {
    success: "Active",
    warning: "Warning",
    danger: "Inactive",
    info: "Info",
    live: "Live",
  };

  const sizeMap = {
    sm: { dot: 6, text: "text-xs" },
    md: { dot: 8, text: "text-sm" },
    lg: { dot: 10, text: "text-base" },
  };

  const dotSize = sizeMap[size].dot;
  const textClass = sizeMap[size].text;
  const color = statusColors[status];
  const displayLabel = label || statusLabels[status];

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Pulse Animation */}
        {showPulse && (
          <motion.div
            className="absolute rounded-full"
            style={{
              width: dotSize * 2,
              height: dotSize * 2,
              backgroundColor: color,
              opacity: 0.3,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
        
        {/* Dot */}
        <div
          className="rounded-full relative z-10"
          style={{
            width: dotSize,
            height: dotSize,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}40`,
          }}
        />
      </div>

      {/* Label */}
      {displayLabel && (
        <span className={`font-semibold ${textClass}`} style={{ color }}>
          {displayLabel}
        </span>
      )}
    </div>
  );
}
