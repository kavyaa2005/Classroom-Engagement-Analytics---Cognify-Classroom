import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
  delay?: number;
  showProgress?: boolean;
  progressValue?: number;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  color,
  onClick,
  delay = 0,
  showProgress = false,
  progressValue = 0,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  useEffect(() => {
    if (typeof numericValue === "number" && !isNaN(numericValue)) {
      const duration = 1500;
      const steps = 60;
      const stepValue = numericValue / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += stepValue;
        if (current >= numericValue) {
          setDisplayValue(numericValue);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [numericValue]);

  const colorStyles = {
    blue: "from-blue-500 to-blue-600",
    teal: "from-teal-500 to-teal-600",
    emerald: "from-emerald-500 to-emerald-600",
    amber: "from-amber-500 to-amber-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`bg-white rounded-2xl p-6 ${
        onClick ? "cursor-pointer" : ""
      } border border-gray-100 transition-all duration-200 hover:border-gray-200`}
      style={{
        boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.08)",
      }}
      onHoverStart={() => {
        if (onClick) {
          const element = document.activeElement as HTMLElement;
          element?.blur();
        }
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-[#6B7280] mb-3">{title}</p>
          <div className="flex items-baseline gap-2">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.2 }}
              className="text-3xl font-bold text-[#111827] tracking-tight"
            >
              {typeof value === "string" && value.includes("%")
                ? `${displayValue}%`
                : displayValue.toLocaleString()}
            </motion.h3>
            {!showProgress && (
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delay + 0.5 }}
                className="text-sm text-[#10B981] font-semibold flex items-center gap-0.5"
              >
                ↑ 12%
              </motion.span>
            )}
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
            colorStyles[color as keyof typeof colorStyles]
          } flex items-center justify-center shadow-md`}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
      </div>

      {showProgress && (
        <div className="mt-6">
          <div className="relative w-24 h-24 mx-auto">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#E5E7EB"
                strokeWidth="6"
                fill="none"
              />
              <motion.circle
                cx="48"
                cy="48"
                r="40"
                stroke="#3B82F6"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={251.2}
                initial={{ strokeDashoffset: 251.2 }}
                animate={{
                  strokeDashoffset: 251.2 - (251.2 * progressValue) / 100,
                }}
                transition={{ delay: delay + 0.3, duration: 1.5, ease: "easeInOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-[#111827]">
                {displayValue}%
              </span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}