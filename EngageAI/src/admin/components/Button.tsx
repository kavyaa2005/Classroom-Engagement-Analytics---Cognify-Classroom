import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  fullWidth = false,
  disabled = false,
  type = "button",
  className = "",
}: ButtonProps) {
  const variants = {
    primary:
      "bg-[#3B82F6] text-white hover:bg-[#2563EB] active:bg-[#1D4ED8] shadow-sm hover:shadow-md",
    secondary:
      "bg-gray-100 text-[#374151] hover:bg-gray-200 active:bg-gray-300",
    success:
      "bg-[#10B981] text-white hover:bg-[#059669] active:bg-[#047857] shadow-sm hover:shadow-md",
    danger:
      "bg-[#DC2626] text-white hover:bg-[#B91C1C] active:bg-[#991B1B] shadow-sm hover:shadow-md",
    outline:
      "bg-white border-2 border-gray-300 text-[#374151] hover:border-[#3B82F6] hover:text-[#3B82F6] active:border-[#2563EB]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      className={`
        inline-flex items-center justify-center gap-2 
        font-medium rounded-xl 
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {Icon && iconPosition === "left" && (
        <Icon className={`${size === "sm" ? "w-4 h-4" : "w-5 h-5"}`} />
      )}
      {children}
      {Icon && iconPosition === "right" && (
        <Icon
          className={`${size === "sm" ? "w-4 h-4" : "w-5 h-5"} transition-transform duration-200 group-hover:translate-x-1`}
        />
      )}
    </motion.button>
  );
}
