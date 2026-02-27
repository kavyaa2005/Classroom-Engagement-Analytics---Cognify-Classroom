import { Link, useLocation } from "react-router";
import { motion } from "motion/react";
import { LayoutDashboard, TrendingUp, Settings } from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/performance", label: "Performance", icon: TrendingUp },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-xl flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-white text-xl font-bold">F</span>
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">
              FocusGame
            </span>
          </div>

          <div className="flex gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    className={`relative px-4 py-2 rounded-full flex items-center gap-2 transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-full"
                        layoutId="activeNav"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10 hidden sm:inline">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}