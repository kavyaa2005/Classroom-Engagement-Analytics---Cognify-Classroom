import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface PerformanceCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  children?: ReactNode;
  onClick?: () => void;
  delay?: number;
}

export default function PerformanceCard({
  title,
  value,
  icon: Icon,
  color,
  children,
  onClick,
  delay = 0,
}: PerformanceCardProps) {
  return (
    <motion.div
      className="bg-card rounded-2xl p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)] cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.12)" }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>

      <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      
      {typeof value === "string" || typeof value === "number" ? (
        <p className="text-3xl font-semibold text-foreground mb-4">{value}</p>
      ) : null}

      {children}
    </motion.div>
  );
}
