import { useState } from "react";
import { motion } from "motion/react";
import { Bell, Moon, Sun, Globe, Volume2 } from "lucide-react";

export function Settings() {
  const [settings, setSettings] = useState({
    liveAlerts: true,
    aiSuggestions: true,
    darkMode: false,
    soundAlerts: true,
    emailNotifications: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const settingsItems = [
    {
      key: "liveAlerts" as const,
      label: "Enable Live Alerts",
      description: "Get real-time notifications during class monitoring",
      icon: Bell,
      color: "#2563EB",
    },
    {
      key: "aiSuggestions" as const,
      label: "Enable AI Suggestions",
      description: "Receive AI-powered teaching recommendations",
      icon: Globe,
      color: "#10B981",
    },
    {
      key: "darkMode" as const,
      label: "Dark Mode",
      description: "Switch to a darker color scheme",
      icon: Moon,
      color: "#64748B",
    },
    {
      key: "soundAlerts" as const,
      label: "Sound Alerts",
      description: "Play sound for important notifications",
      icon: Volume2,
      color: "#F59E0B",
    },
    {
      key: "emailNotifications" as const,
      label: "Email Notifications",
      description: "Receive daily summary via email",
      icon: Bell,
      color: "#0D9488",
    },
  ];

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-[28px] font-semibold text-[#1E293B] mb-2">Settings</h1>
        <p className="text-[16px] text-[#64748B]">
          Customize your EngageAI experience.
        </p>
      </motion.div>

      {/* Settings List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[18px] overflow-hidden"
        style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
      >
        {settingsItems.map((item, index) => {
          const Icon = item.icon;
          const isEnabled = settings[item.key];

          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 border-b border-[#F8FAFC] last:border-b-0 hover:bg-[#F8FAFC] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className="w-12 h-12 rounded-[12px] flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#1E293B] mb-1">
                      {item.label}
                    </h3>
                    <p className="text-[14px] text-[#64748B]">{item.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting(item.key)}
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                    isEnabled ? "bg-[#2563EB]" : "bg-[#CBD5E1]"
                  }`}
                >
                  <motion.div
                    animate={{
                      x: isEnabled ? 28 : 2,
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-5 h-5 bg-white rounded-full"
                  />
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 bg-white rounded-[18px] p-6"
        style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
      >
        <h2 className="text-[18px] font-semibold text-[#1E293B] mb-4">
          Profile Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-[14px] text-[#64748B] mb-2 block">Name</label>
            <input
              type="text"
              defaultValue="Ms. Kavya"
              className="w-full px-4 py-3 bg-[#F8FAFC] rounded-[12px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>
          <div>
            <label className="text-[14px] text-[#64748B] mb-2 block">Email</label>
            <input
              type="email"
              defaultValue="kavya@school.edu"
              className="w-full px-4 py-3 bg-[#F8FAFC] rounded-[12px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-[#2563EB] to-[#0D9488] text-white rounded-[12px] font-medium"
          >
            Save Changes
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
