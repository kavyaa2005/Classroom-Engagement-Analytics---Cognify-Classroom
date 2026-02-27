import { motion } from "motion/react";
import { Bell, CheckCircle2, AlertTriangle, Info, Trash2 } from "lucide-react";
import { useState } from "react";

interface Notification {
  id: number;
  type: "success" | "warning" | "info";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const notificationsData: Notification[] = [
  {
    id: 1,
    type: "warning",
    title: "Low Engagement Alert",
    message: "Class 8B engagement dropped below 50% during Math session",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "warning",
    title: "Teacher Assistance Required",
    message: "Teacher John needs attention in Class 9B - Multiple disengaged students",
    time: "15 minutes ago",
    read: false,
  },
  {
    id: 3,
    type: "success",
    title: "Outstanding Performance",
    message: "Class 8A achieved 90% engagement in Science session",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 4,
    type: "info",
    title: "System Update",
    message: "AI Model updated to version 3.2.1 with improved accuracy",
    time: "2 hours ago",
    read: true,
  },
  {
    id: 5,
    type: "success",
    title: "Weekly Report Ready",
    message: "Your weekly engagement analytics report is now available",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 6,
    type: "info",
    title: "New Teacher Added",
    message: "Lisa Anderson has been successfully added to the system",
    time: "1 day ago",
    read: true,
  },
];

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(
    notificationsData
  );
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const handleMarkAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-[#10B981]" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />;
      default:
        return <Info className="w-5 h-5 text-[#3B82F6]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937]">Notifications</h1>
          <p className="text-[#6B7280] mt-1">
            Stay updated with all system alerts and updates
          </p>
        </div>

        {unreadCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 bg-[#3B82F6] text-white rounded-xl hover:bg-[#2563EB] transition-all"
          >
            Mark All as Read
          </motion.button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-[#3B82F6]" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Total Notifications</p>
              <p className="text-2xl font-bold text-[#1F2937]">
                {notifications.length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Unread</p>
              <p className="text-2xl font-bold text-[#F59E0B]">{unreadCount}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Read</p>
              <p className="text-2xl font-bold text-[#10B981]">
                {notifications.length - unreadCount}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl transition-all ${
            filter === "all"
              ? "bg-[#3B82F6] text-white"
              : "bg-white text-[#6B7280] hover:bg-gray-50"
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-xl transition-all ${
            filter === "unread"
              ? "bg-[#3B82F6] text-white"
              : "bg-white text-[#6B7280] hover:bg-gray-50"
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            className={`bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all ${
              !notification.read ? "border-l-4 border-[#3B82F6]" : ""
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl ${
                  notification.type === "success"
                    ? "bg-emerald-100"
                    : notification.type === "warning"
                    ? "bg-amber-100"
                    : "bg-blue-100"
                }`}
              >
                {getIcon(notification.type)}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-[#1F2937]">
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <span className="w-2 h-2 bg-[#3B82F6] rounded-full" />
                  )}
                </div>
                <p className="text-sm text-[#6B7280] mb-2">
                  {notification.message}
                </p>
                <p className="text-xs text-[#6B7280]">{notification.time}</p>
              </div>

              <div className="flex gap-2">
                {!notification.read && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="p-2 text-[#3B82F6] hover:bg-blue-50 rounded-lg transition-all"
                    title="Mark as Read"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(notification.id)}
                  className="p-2 text-[#EF4444] hover:bg-red-50 rounded-lg transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Bell className="w-16 h-16 text-[#6B7280] mx-auto mb-4 opacity-50" />
          <p className="text-lg text-[#6B7280]">No notifications to display</p>
        </motion.div>
      )}
    </div>
  );
}
