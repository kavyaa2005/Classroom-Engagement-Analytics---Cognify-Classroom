import { motion } from "motion/react";
import { ReactNode } from "react";

type BadgeVariant = "primary" | "secondary" | "success" | "warning" | "danger" | "neutral";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  animated?: boolean;
}

export default function Badge({
  children,
  variant = "primary",
  size = "md",
  className = "",
  animated = false,
}: BadgeProps) {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-full";

  const variantStyles = {
    primary: "bg-primary/10 text-primary border border-primary/20",
    secondary: "bg-secondary/10 text-secondary border border-secondary/20",
    success: "bg-success/10 text-success border border-success/20",
    warning: "bg-warning/10 text-warning border border-warning/20",
    danger: "bg-attention/10 text-attention border border-attention/20",
    neutral: "bg-muted text-muted-foreground border border-border",
  };

  const sizeStyles = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  if (animated) {
    return (
      <motion.div
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </div>
  );
}
