import { motion } from "motion/react";
import { Link, useLocation } from "react-router";
import { ChevronRight, Home } from "lucide-react";

const routeNames: Record<string, string> = {
  "/": "Dashboard",
  "/class-performance": "My Class Performance",
  "/engagement-history": "Engagement History",
  "/teacher-feedback": "Teacher Feedback",
  "/class-insights": "Class Insights",
  "/settings": "Settings",
};

export default function Breadcrumb() {
  const location = useLocation();
  const currentRoute = routeNames[location.pathname] || "Dashboard";

  return (
    <motion.div
      className="flex items-center gap-2 px-6 lg:px-20 py-4 bg-background/50 border-b border-border/30"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      <Link to="/">
        <motion.div
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          whileHover={{ x: 2 }}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </motion.div>
      </Link>
      
      <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
      
      <span className="text-sm font-medium text-foreground">
        {currentRoute}
      </span>
    </motion.div>
  );
}
