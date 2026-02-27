import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Radio,
  BarChart3,
  Brain,
  Bell,
  Settings,
  Shield,
  LogOut,
  Search,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const menuItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/teachers", label: "Manage Teachers", icon: Users },
  { path: "/students", label: "Manage Students", icon: GraduationCap },
  { path: "/live-monitoring", label: "Live Monitoring", icon: Radio },
  { path: "/reports", label: "Reports & Analytics", icon: BarChart3 },
  { path: "/ai-model", label: "AI Model Status", icon: Brain },
  { path: "/notifications", label: "Notifications", icon: Bell },
  { path: "/settings", label: "Settings", icon: Settings },
  { path: "/privacy", label: "Privacy & Compliance", icon: Shield },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("engageai_admin_token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 bg-white border-r border-gray-200 shadow-sm">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#14B8A6] rounded-xl flex items-center justify-center shadow-md">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#111827]">EngageAI Admin</h1>
              <p className="text-xs text-[#6B7280] leading-tight">Classroom Analytics</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-[#3B82F6] shadow-sm"
                      : "text-[#6B7280] hover:bg-gray-50 hover:text-[#111827]"
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? '' : 'group-hover:scale-110'
                  }`} />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 w-1 h-8 bg-[#3B82F6] rounded-r-full"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="px-3 py-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="group flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-[#6B7280] hover:bg-red-50 hover:text-[#DC2626] transition-all duration-200"
            >
              <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#3B82F6] to-[#14B8A6] rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-[#1F2937]">EngageAI</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 pt-16"
          >
            <nav className="flex-1 px-3 py-4 space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-blue-50 text-[#3B82F6] border-l-4 border-[#3B82F6]"
                        : "text-[#6B7280] hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-[#6B7280] hover:bg-red-50 hover:text-[#EF4444] transition-all duration-300 mt-4"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="Search teachers, classes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-xl hover:bg-gray-100 transition-all"
                >
                  <Bell className="w-6 h-6 text-[#6B7280]" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
                </button>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="font-semibold text-[#1F2937]">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                        >
                          <p className="text-sm text-[#1F2937]">
                            Class 8B engagement dropped below 50%
                          </p>
                          <p className="text-xs text-[#6B7280] mt-1">
                            2 minutes ago
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 transition-all"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-[#3B82F6] to-[#14B8A6] rounded-full flex items-center justify-center text-white font-medium">
                    A
                  </div>
                </button>
                {showProfileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-100">
                      <p className="font-semibold text-[#1F2937]">
                        Admin User
                      </p>
                      <p className="text-sm text-[#6B7280]">
                        admin@school.edu
                      </p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => navigate("/settings")}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-[#6B7280]"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => navigate("/settings")}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-[#6B7280]"
                      >
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-sm text-[#EF4444]"
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8 mt-16 lg:mt-0">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-6 px-8 text-center">
          <p className="text-sm text-[#6B7280]">
            © 2026 EngageAI | Built for Smart Classrooms
          </p>
        </footer>
      </div>
    </div>
  );
}