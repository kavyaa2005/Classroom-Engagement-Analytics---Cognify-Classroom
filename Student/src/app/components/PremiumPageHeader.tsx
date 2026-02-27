import { motion } from "motion/react";
import { ReactNode } from "react";

interface PremiumPageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children?: ReactNode;
}

export default function PremiumPageHeader({
  title,
  subtitle,
  badge,
  children,
}: PremiumPageHeaderProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Animated Gradient Mesh Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-60"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(37, 99, 235, 0.12) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(13, 148, 136, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 60% 20%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)
            `,
          }}
          animate={{
            backgroundPosition: [
              "20% 50%, 80% 80%, 60% 20%",
              "25% 45%, 75% 85%, 65% 25%",
              "20% 50%, 80% 80%, 60% 20%",
            ],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Blurred Abstract Shapes */}
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/8 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-72 h-72 bg-purple-400/6 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1920px] mx-auto px-8 lg:px-20 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Title */}
          <h1 className="text-[36px] font-bold text-[#1E293B] leading-tight tracking-tight mb-3">
            {title}
          </h1>

          {/* Subtitle and Badge */}
          <div className="flex flex-wrap items-center gap-3">
            {subtitle && (
              <p className="text-[16px] text-[#64748B] font-medium">
                {subtitle}
              </p>
            )}
            
            {badge && (
              <motion.div
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <span className="text-sm font-semibold text-primary">
                  {badge}
                </span>
              </motion.div>
            )}
          </div>

          {/* Additional Content */}
          {children && (
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {children}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
