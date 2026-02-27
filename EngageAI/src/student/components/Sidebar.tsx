import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  Activity,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Video,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";

// Navigation sections with grouping
const navigationSections = [
  {
    label: "MAIN",
    items: [
      { path: "/student", icon: LayoutDashboard, label: "Dashboard" },
      { path: "/student/class-performance", icon: Users, label: "My Class Performance" },
    ],
  },
  {
    label: "ANALYTICS",
    items: [
      { path: "/student/engagement-history", icon: Activity, label: "Engagement History" },
      { path: "/student/class-insights", icon: BarChart3, label: "Class Insights" },
    ],
  },
  {
    label: "LIVE CLASS",
    items: [
      { path: "/student/join", icon: Video, label: "Join Session" },
    ],
  },
  {
    label: "COMMUNICATION",
    items: [
      { path: "/student/teacher-feedback", icon: MessageSquare, label: "Teacher Feedback" },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { path: "/student/settings", icon: Settings, label: "Settings" },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/student") return location.pathname === "/student";
    return location.pathname.startsWith(path);
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -left-20 w-64 h-64 bg-primary/8 rounded-full blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 -right-20 w-56 h-56 bg-secondary/10 rounded-full blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, 20, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-48 h-48 bg-purple-400/8 rounded-full blur-3xl"
          animate={{ x: [0, 15, 0], y: [0, -25, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Logo Section */}
      <div className="relative z-10 p-6 pb-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h2 className={`font-semibold text-foreground leading-tight transition-all duration-300 ${isCollapsed && !isMobile ? "text-base" : "text-[22px]"}`}>
            {isCollapsed && !isMobile ? "EA" : "EngageAI Student"}
          </h2>
          {(!isCollapsed || isMobile) && (
            <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed">Learning Performance Dashboard</p>
          )}
        </motion.div>

        {/* Collapse Toggle - Desktop Only */}
        {!isMobile && (
          <motion.button
            className="absolute -right-3 top-8 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
            onClick={() => setIsCollapsed(!isCollapsed)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </motion.button>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="relative z-10 flex-1 px-3 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {navigationSections.map((section, sectionIndex) => (
          <motion.div
            key={section.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: sectionIndex * 0.1, duration: 0.4 }}
          >
            {(!isCollapsed || isMobile) && (
              <div className="px-3 mb-2">
                <span className="text-[11px] font-semibold text-muted-foreground/70 tracking-wider uppercase">{section.label}</span>
              </div>
            )}

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link key={item.path} to={item.path} onClick={() => setIsMobileOpen(false)} className="block">
                    <motion.div
                      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                        }`}
                      whileHover={{ x: active ? 0 : 2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <AnimatePresence>
                        {active && (
                          <motion.div
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
                            layoutId="activeIndicator"
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -4 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                      </AnimatePresence>

                      <motion.div className="flex-shrink-0" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                        <Icon className={`w-5 h-5 transition-colors ${active ? "text-primary" : "text-current"}`} />
                      </motion.div>

                      {(!isCollapsed || isMobile) && (
                        <span className={`font-medium text-[15px] leading-relaxed transition-all ${active ? "font-semibold" : ""}`}>
                          {item.label}
                        </span>
                      )}

                      {isCollapsed && !isMobile && (
                        <div className="absolute left-full ml-4 px-3 py-2 bg-foreground text-background text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                          {item.label}
                          <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-foreground rotate-45" />
                        </div>
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="relative z-10 p-4 border-t border-border/50">
        <motion.button
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground transition-all duration-300 group ${isCollapsed && !isMobile ? "justify-center" : ""}`}
          onClick={handleLogout}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <LogOut className="w-5 h-5" />
          </motion.div>
          {(!isCollapsed || isMobile) && <span className="font-medium text-[15px]">Logout</span>}
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-card rounded-xl shadow-lg border border-border"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isMobileOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-6 h-6 text-foreground" />
            </motion.div>
          ) : (
            <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Menu className="w-6 h-6 text-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden lg:block fixed left-0 top-0 h-screen bg-gradient-to-b from-[#F8FAFC] to-[#EEF2FF] border-r border-border/50 shadow-[4px_0_20px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 ease-in-out"
        style={{ width: isCollapsed ? "80px" : "280px" }}
        initial={false}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              className="lg:hidden fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-[#F8FAFC] to-[#EEF2FF] border-r border-border/50 shadow-[4px_0_20px_rgba(0,0,0,0.05)] z-50 backdrop-blur-sm"
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}