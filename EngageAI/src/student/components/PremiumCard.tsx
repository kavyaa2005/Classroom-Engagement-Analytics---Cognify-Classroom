import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

type CardVariant = "default" | "elevated" | "bordered" | "flat";
type CardPadding = "sm" | "md" | "lg" | "xl";

interface PremiumCardProps {
  title?: string;
  value?: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  delay?: number;
  children?: ReactNode;
  className?: string;
  countUp?: boolean;
  variant?: CardVariant;
  padding?: CardPadding;
  hoverable?: boolean;
}

// Count-up animation hook
function useCountUp(end: number, duration: number = 1000, delay: number = 0) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let startTime: number | null = null;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOutQuart * end));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timeout);
  }, [end, duration, delay]);

  return count;
}

export default function PremiumCard({
  title,
  value,
  icon: Icon,
  iconColor = "#2563EB",
  delay = 0,
  children,
  className = "",
  countUp = false,
  variant = "default",
  padding = "lg",
  hoverable = true,
}: PremiumCardProps) {
  const numericValue = typeof value === 'number' ? value : parseInt(value?.toString().replace(/\D/g, '') || '0');
  const animatedValue = useCountUp(numericValue, 1200, delay * 1000);
  
  // Extract unit/suffix from value (%, #, etc.)
  const suffix = typeof value === 'string' ? value.replace(/[\d,]/g, '') : '';
  const displayValue = countUp && typeof value === 'number' 
    ? animatedValue + suffix 
    : value;

  const variantStyles = {
    default: "bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)]",
    elevated: "bg-white shadow-[0_15px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]",
    bordered: "bg-white border-2 border-border hover:border-primary/30 shadow-sm",
    flat: "bg-card",
  };

  const paddingStyles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  return (
    <motion.div
      className={`rounded-[16px] transition-all duration-300 ease-in-out ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hoverable ? { y: -4 } : {}}
      transition={{ 
        delay,
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      {/* Header */}
      {(title || Icon) && (
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            {title && (
              <p className="text-sm font-semibold text-muted-foreground mb-3 tracking-wide uppercase">
                {title}
              </p>
            )}
            {value && (
              <motion.p
                className="text-[40px] font-bold text-foreground leading-none tracking-tight"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: delay + 0.2, duration: 0.4 }}
              >
                {displayValue}
              </motion.p>
            )}
          </div>
          
          {Icon && (
            <motion.div
              className="flex-shrink-0"
              animate={{
                y: [0, -4, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div 
                className="w-14 h-14 rounded-[12px] flex items-center justify-center"
                style={{ 
                  backgroundColor: `${iconColor}15`,
                }}
              >
                <Icon className="w-7 h-7" style={{ color: iconColor }} />
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Content */}
      {children && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.3, duration: 0.4 }}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}