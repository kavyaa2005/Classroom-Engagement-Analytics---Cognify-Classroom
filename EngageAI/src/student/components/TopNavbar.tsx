import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Activity,
  MessageSquare,
  BarChart3,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Video,
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useFetch } from "../../hooks/useFetch";

interface StudentDash {
  todayEngagement: number;
  weeklyAverage: number;
  streak: number;
  activeSession?: { classroomId?: { name?: string } } | null;
  weeklyData: { day: string; value: number }[];
}

const navLinks = [
  { path: "/student", label: "Dashboard", icon: LayoutDashboard },
  { path: "/student/class-performance", label: "My Class Performance", icon: Users },
  { path: "/student/engagement-history", label: "Engagement History", icon: Activity },
  { path: "/student/teacher-feedback", label: "Teacher Feedback", icon: MessageSquare },
  { path: "/student/class-insights", label: "Class Insights", icon: BarChart3 },
  { path: "/student/join", label: "Join Session", icon: Video },
];

export default function TopNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { data: dashData } = useFetch<StudentDash>("/api/analytics/dashboard/student");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Build dynamic notifications from dashboard data
  const dynamicNotifications = (() => {
    const items: { title: string; message: string; time: string }[] = [];
    if (!dashData) return items;
    const avg = dashData.todayEngagement;
    const streak = dashData.streak;
    const className = dashData.activeSession?.classroomId?.name;
    if (avg >= 75) {
      items.push({ title: "Great Engagement!", message: `Your engagement today is ${avg}% — keep it up!`, time: "Today" });
    } else if (avg > 0) {
      items.push({ title: "Engagement Update", message: `Your engagement today is ${avg}%. Try to stay more focused.`, time: "Today" });
    }
    if (streak >= 3) {
      items.push({ title: `${streak}-Day Streak!`, message: `You've been active for ${streak} consecutive days. Amazing consistency!`, time: "Today" });
    }
    if (className) {
      items.push({ title: "Session Active", message: `${className} has a live session running. Join now!`, time: "Now" });
    }
    if (items.length === 0) {
      items.push({ title: "Welcome back!", message: "Join a live session to see your engagement data.", time: "Now" });
    }
    return items;
  })();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/student") return location.pathname === "/student";
    return location.pathname.startsWith(path);
  };
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) setIsUserMenuOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) setIsNotificationOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Navbar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#F8FAFC] to-[#EEF2FF] backdrop-blur-xl border-b border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.05)]"
        initial={{ height: 80 }}
        animate={{ height: isScrolled ? 70 : 80 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div className="absolute -top-10 left-1/4 w-64 h-64 bg-primary/8 rounded-full blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute -top-10 right-1/3 w-56 h-56 bg-secondary/10 rounded-full blur-3xl"
            animate={{ x: [0, -25, 0], y: [0, 15, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
        </div>

        {/* Navbar Content */}
        <div className="relative z-10 max-w-[1920px] mx-auto px-8 lg:px-20 h-full flex items-center justify-between">
          {/* LEFT SECTION - Logo */}
          <Link to="/student" className="flex flex-col">
            <motion.h1
              className="text-[22px] font-bold text-[#1E293B] leading-none tracking-tight"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              EngageAI
            </motion.h1>
            <span className="text-[13px] text-[#64748B] mt-1 tracking-[0.02em]">Learning Performance</span>
          </Link>

          {/* CENTER SECTION - Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link key={link.path} to={link.path}>
                  <motion.div
                    className={`relative px-5 py-2.5 rounded-xl transition-all duration-250 ${active
                        ? "bg-[#E0E7FF] text-primary font-semibold"
                        : "text-[#64748B] hover:text-[#475569] hover:bg-accent/40"
                      }`}
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <span className="text-[16px] font-medium">{link.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* RIGHT SECTION - Actions */}
          <div className="flex items-center gap-3">
            {/* Search Icon */}
            <motion.button
              className="hidden md:flex w-11 h-11 items-center justify-center rounded-xl hover:bg-accent/50 transition-all duration-200"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              <Search className="w-5 h-5 text-[#64748B]" />
            </motion.button>

            {/* Notification Bell */}
            <div className="relative hidden md:block" ref={notificationRef}>
              <motion.button
                className="relative w-11 h-11 flex items-center justify-center rounded-xl hover:bg-accent/50 transition-all duration-200"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5 text-[#64748B]" />
                {hasUnreadNotifications && (
                  <motion.div
                    className="absolute top-2 right-2 w-2 h-2 bg-attention rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </motion.button>

              <AnimatePresence>
                {isNotificationOpen && (
                  <motion.div
                    className="absolute right-0 top-full mt-3 w-80 bg-white rounded-[18px] shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-border overflow-hidden"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <div className="p-5 border-b border-border">
                      <h3 className="font-semibold text-[#1E293B]">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {dynamicNotifications.map((notification, index) => (
                        <motion.div key={index} className="p-4 hover:bg-accent/30 transition-colors cursor-pointer border-b border-border/50 last:border-0" whileHover={{ x: 4 }} onClick={() => setIsNotificationOpen(false)}>
                          <p className="text-sm font-semibold text-[#1E293B] mb-1">{notification.title}</p>
                          <p className="text-xs text-[#64748B] mb-1">{notification.message}</p>
                          <p className="text-xs text-primary font-medium">{notification.time}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Avatar & Menu */}
            <div className="relative" ref={userMenuRef}>
              <motion.button
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-accent/50 transition-all duration-200"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {user?.name?.[0]?.toUpperCase() ?? "S"}
                </div>
                <ChevronDown className={`hidden md:block w-4 h-4 text-[#64748B] transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`} />
              </motion.button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    className="absolute right-0 top-full mt-3 w-56 bg-white rounded-[18px] shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-border overflow-hidden"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <div className="p-5 border-b border-border">
                      <p className="font-semibold text-[#1E293B]">{user?.name ?? "Student"}</p>
                      <p className="text-sm text-[#64748B] mt-0.5">{user?.email ?? ""}</p>
                    </div>
                    <div className="p-2">
                      <Link to="/student/settings">
                        <motion.button
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-accent transition-colors text-left"
                          whileHover={{ x: 4 }}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4 text-[#64748B]" />
                          <span className="text-sm font-medium text-[#1E293B]">My Profile</span>
                        </motion.button>
                      </Link>
                      <Link to="/student/settings">
                        <motion.button
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-accent transition-colors text-left"
                          whileHover={{ x: 4 }}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4 text-[#64748B]" />
                          <span className="text-sm font-medium text-[#1E293B]">Settings</span>
                        </motion.button>
                      </Link>
                      <div className="my-2 border-t border-border" />
                      <motion.button
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-attention/10 transition-colors text-left"
                        whileHover={{ x: 4 }}
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 text-attention" />
                        <span className="text-sm font-medium text-attention">Logout</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl hover:bg-accent/50 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-[#1E293B]" /> : <Menu className="w-6 h-6 text-[#1E293B]" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed top-[80px] left-0 right-0 z-40 lg:hidden bg-white border-b border-border shadow-lg"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="p-4 space-y-2">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                const Icon = link.icon;
                return (
                  <Link key={link.path} to={link.path} onClick={() => setIsMobileMenuOpen(false)}>
                    <motion.div
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${active ? "bg-[#E0E7FF] text-primary" : "hover:bg-accent text-[#64748B]"
                        }`}
                      whileHover={{ x: 4 }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{link.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
              <motion.button
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-attention/10 text-attention transition-colors"
                whileHover={{ x: 4 }}
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}