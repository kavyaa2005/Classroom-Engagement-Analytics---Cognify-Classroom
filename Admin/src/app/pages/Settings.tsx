import { useState } from "react";
import { motion } from "motion/react";
import {
  User,
  Mail,
  Lock,
  Bell,
  Globe,
  Moon,
  Sun,
  Save,
  Camera,
} from "lucide-react";

export function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);

  const handleSaveSettings = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1F2937]">Settings</h1>
        <p className="text-[#6B7280] mt-1">
          Manage your account and application preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)]"
        >
          <h2 className="text-xl font-bold text-[#1F2937] mb-6">
            Profile Information
          </h2>

          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-[#3B82F6] to-[#14B8A6] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                A
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#3B82F6] rounded-full flex items-center justify-center text-white hover:bg-[#2563EB] transition-all">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1F2937]">Admin User</h3>
              <p className="text-sm text-[#6B7280]">System Administrator</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="text"
                  defaultValue="Admin User"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="email"
                  defaultValue="admin@engageai.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">
                Role
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]">
                <option>System Administrator</option>
                <option>School Admin</option>
                <option>Teacher</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)]"
        >
          <h2 className="text-xl font-bold text-[#1F2937] mb-6">
            Quick Actions
          </h2>

          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-left">
              <Lock className="w-5 h-5 text-[#3B82F6]" />
              <span className="text-sm font-medium text-[#1F2937]">
                Change Password
              </span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-left">
              <Globe className="w-5 h-5 text-[#14B8A6]" />
              <span className="text-sm font-medium text-[#1F2937]">
                Language Settings
              </span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-left">
              <User className="w-5 h-5 text-[#F59E0B]" />
              <span className="text-sm font-medium text-[#1F2937]">
                Account Security
              </span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)]"
      >
        <h2 className="text-xl font-bold text-[#1F2937] mb-6">
          Notification Preferences
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#3B82F6]" />
              <div>
                <p className="font-medium text-[#1F2937]">Email Notifications</p>
                <p className="text-sm text-[#6B7280]">
                  Receive alerts via email
                </p>
              </div>
            </div>
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative w-12 h-6 rounded-full transition-all ${
                emailNotifications ? "bg-[#10B981]" : "bg-gray-300"
              }`}
            >
              <motion.div
                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
                animate={{ x: emailNotifications ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#14B8A6]" />
              <div>
                <p className="font-medium text-[#1F2937]">Push Notifications</p>
                <p className="text-sm text-[#6B7280]">
                  Real-time alerts in dashboard
                </p>
              </div>
            </div>
            <button
              onClick={() => setPushNotifications(!pushNotifications)}
              className={`relative w-12 h-6 rounded-full transition-all ${
                pushNotifications ? "bg-[#10B981]" : "bg-gray-300"
              }`}
            >
              <motion.div
                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
                animate={{ x: pushNotifications ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#F59E0B]" />
              <div>
                <p className="font-medium text-[#1F2937]">Weekly Reports</p>
                <p className="text-sm text-[#6B7280]">
                  Summary emails every Monday
                </p>
              </div>
            </div>
            <button
              onClick={() => setWeeklyReports(!weeklyReports)}
              className={`relative w-12 h-6 rounded-full transition-all ${
                weeklyReports ? "bg-[#10B981]" : "bg-gray-300"
              }`}
            >
              <motion.div
                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
                animate={{ x: weeklyReports ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Appearance Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)]"
      >
        <h2 className="text-xl font-bold text-[#1F2937] mb-6">Appearance</h2>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            {darkMode ? (
              <Moon className="w-5 h-5 text-[#3B82F6]" />
            ) : (
              <Sun className="w-5 h-5 text-[#F59E0B]" />
            )}
            <div>
              <p className="font-medium text-[#1F2937]">Dark Mode</p>
              <p className="text-sm text-[#6B7280]">
                Toggle dark theme (Coming soon)
              </p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-12 h-6 rounded-full transition-all ${
              darkMode ? "bg-[#3B82F6]" : "bg-gray-300"
            }`}
          >
            <motion.div
              className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
              animate={{ x: darkMode ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSaveSettings}
          className="flex items-center gap-2 px-8 py-3 bg-[#3B82F6] text-white rounded-xl hover:bg-[#2563EB] transition-all shadow-lg"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </motion.button>
      </motion.div>
    </div>
  );
}
