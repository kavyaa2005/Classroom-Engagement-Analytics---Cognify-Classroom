import { Link, useLocation, useNavigate } from "react-router";
import { motion } from "motion/react";
import { useState } from "react";
import {
  LayoutDashboard,
  Activity,
  BarChart3,
  Users,
  Sparkles,
  History,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

const menuItems = [
  { path: "/teacher", label: "Dashboard", icon: LayoutDashboard },
  { path: "/teacher/live-monitoring", label: "Live Class Monitoring", icon: Activity },
  { path: "/teacher/reports", label: "Engagement Reports", icon: BarChart3 },
  { path: "/teacher/students", label: "Student Insights", icon: Users },
  { path: "/teacher/ai-suggestions", label: "AI Suggestions", icon: Sparkles },
  { path: "/teacher/past-classes", label: "Past Classes", icon: History },
  { path: "/teacher/settings", label: "Settings", icon: Settings },
  { path: "/teacher/help", label: "Help & Support", icon: HelpCircle },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/teacher") return location.pathname === "/teacher";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-white rounded-[12px] flex items-center justify-center shadow-lg"
      >
        <Menu className="w-6 h-6 text-[#1E293B]" />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: isMobileMenuOpen ? -280 : 0 }}
        animate={{ x: 0 }}
        className={`w-64 h-screen bg-white border-r border-[rgba(0,0,0,0.08)] flex flex-col sticky top-0 z-50 ${isMobileMenuOpen ? "fixed" : "hidden lg:flex"
          }`}
      >
        {/* Close Button (Mobile) */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden absolute top-6 right-4 w-8 h-8 flex items-center justify-center text-[#64748B]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo Section */}
        <div className="p-8 border-b border-[rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#2563EB] to-[#0D9488] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[18px] font-semibold text-[#1E293B]">EngageAI</h1>
              <p className="text-[11px] text-[#64748B]">Smart Classroom Companion</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-6 px-4 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <motion.div
                    className={`flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all duration-300 ${active
                        ? "bg-[#EFF6FF] text-[#2563EB]"
                        : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]"
                      }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {active && (
                      <motion.div
                        className="absolute left-0 w-1 h-8 bg-[#2563EB] rounded-r-full"
                        layoutId="activeIndicator"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-[14px] font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-[rgba(0,0,0,0.08)]">
          <button
            className="flex items-center gap-3 px-4 py-3 w-full rounded-[12px] text-[#64748B] hover:bg-[#FEF2F2] hover:text-[#F87171] transition-all duration-300"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[14px] font-medium">Logout</span>
          </button>
        </div>
      </motion.div>
    </>
  );
}