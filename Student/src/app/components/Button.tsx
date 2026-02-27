import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  onClick,
  disabled = false,
  className = "",
  fullWidth = false,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 ease-in-out";

  const variantStyles = {
    primary:
      "bg-primary text-white shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.3)] hover:bg-primary/90 active:scale-[0.98]",
    secondary:
      "bg-secondary text-white shadow-[0_4px_12px_rgba(13,148,136,0.15)] hover:shadow-[0_6px_16px_rgba(13,148,136,0.25)] hover:bg-secondary/90 active:scale-[0.98]",
    outline:
      "border-2 border-border bg-transparent text-foreground hover:bg-accent hover:border-border active:scale-[0.98]",
    ghost:
      "bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground active:scale-[0.98]",
    danger:
      "bg-attention text-white shadow-[0_4px_12px_rgba(248,113,113,0.2)] hover:shadow-[0_6px_16px_rgba(248,113,113,0.3)] hover:bg-attention/90 active:scale-[0.98]",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const disabledStyles = "opacity-50 cursor-not-allowed pointer-events-none";

  return (
    <motion.button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        disabled ? disabledStyles : ""
      } ${fullWidth ? "w-full" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      {Icon && iconPosition === "left" && <Icon className="w-5 h-5" />}
      {children}
      {Icon && iconPosition === "right" && <Icon className="w-5 h-5" />}
    </motion.button>
  );
}
