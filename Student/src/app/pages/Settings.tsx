import { motion } from "motion/react";
import { useState } from "react";
import { Shield, Bell, Eye, Moon, User, Mail } from "lucide-react";

export default function Settings() {
  const [showEngagement, setShowEngagement] = useState(true);
  const [realtimeUpdates, setRealtimeUpdates] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-primary" : "bg-muted"
      }`}
      onClick={onChange}
    >
      <motion.span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm`}
        animate={{ x: enabled ? 24 : 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-success/5 border-b border-border">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-20 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-semibold text-foreground mb-2">
              Settings
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your preferences and privacy
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-20 py-8 space-y-6">
        {/* Profile Section */}
        <motion.div
          className="bg-card rounded-2xl p-8 shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Profile</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Full Name
              </label>
              <input
                type="text"
                defaultValue="Kavya"
                className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                defaultValue="kavya@student.edu"
                className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Class
              </label>
              <input
                type="text"
                defaultValue="10A"
                disabled
                className="w-full px-4 py-3 bg-muted rounded-xl border border-border opacity-60"
              />
            </div>
          </div>
        </motion.div>

        {/* Privacy Settings */}
        <motion.div
          className="bg-card rounded-2xl p-8 shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Privacy</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-medium text-foreground">Show My Engagement to Class</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Allow your engagement data to be included in class averages and comparisons
                </p>
              </div>
              <ToggleSwitch
                enabled={showEngagement}
                onChange={() => setShowEngagement(!showEngagement)}
              />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-medium text-foreground">Enable Real-Time Updates</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Receive live notifications during class sessions
                </p>
              </div>
              <ToggleSwitch
                enabled={realtimeUpdates}
                onChange={() => setRealtimeUpdates(!realtimeUpdates)}
              />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-medium text-foreground">Email Notifications</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Receive weekly performance summaries via email
                </p>
              </div>
              <ToggleSwitch
                enabled={emailNotifications}
                onChange={() => setEmailNotifications(!emailNotifications)}
              />
            </div>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div
          className="bg-card rounded-2xl p-8 shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Moon className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Appearance</h2>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-medium text-foreground mb-1">Dark Mode</h3>
              <p className="text-sm text-muted-foreground">
                Switch to dark theme for reduced eye strain
              </p>
            </div>
            <ToggleSwitch
              enabled={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          </div>
        </motion.div>

        {/* Privacy Statement */}
        <motion.div
          className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 border border-primary/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Privacy & Data Usage</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Your engagement data is used to support your learning and provide personalized insights. 
                We take your privacy seriously and never share your individual data with third parties.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Data is encrypted and stored securely</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Only aggregated, anonymous data is shared with teachers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>You can request data deletion at any time</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
            Save Changes
          </button>
          <button className="flex-1 px-6 py-3 border-2 border-border rounded-xl font-medium hover:bg-accent transition-colors">
            Cancel
          </button>
        </motion.div>
      </div>
    </div>
  );
}