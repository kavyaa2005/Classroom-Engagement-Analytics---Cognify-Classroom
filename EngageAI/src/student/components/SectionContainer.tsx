import { motion } from "motion/react";
import { ReactNode } from "react";

interface SectionContainerProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  noPadding?: boolean;
}

export default function SectionContainer({
  children,
  delay = 0,
  className = "",
  noPadding = false,
}: SectionContainerProps) {
  return (
    <motion.section
      className={`max-w-[1920px] mx-auto ${noPadding ? "" : "px-8 lg:px-20"} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.section>
  );
}
