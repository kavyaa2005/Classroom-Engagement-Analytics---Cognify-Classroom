import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain,
  Activity,
  Zap,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Server,
  TrendingUp,
} from "lucide-react";

export function AIModelStatus() {
  const [isMonitoringActive, setIsMonitoringActive] = useState(true);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);

  const handleToggleMonitoring = () => {
    setIsMonitoringActive(!isMonitoringActive);
  };

  const handleRestartModel = () => {
    setShowRestartConfirm(false);
    alert("AI Model is restarting... This may take a few minutes.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937]">AI Model Status</h1>
          <p className="text-[#6B7280] mt-1">
            Monitor and manage AI engagement detection system
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowRestartConfirm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] text-white rounded-xl hover:bg-[#D97706] transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Restart Model
        </motion.button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl p-6 text-white shadow-lg"
        >
          <Brain className="w-10 h-10 mb-3" />
          <p className="text-sm opacity-90">Model Version</p>
          <p className="text-2xl font-bold mt-2">v3.2.1</p>
          <p className="text-xs mt-2 opacity-80">Latest stable release</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-6 text-white shadow-lg"
        >
          <Activity className="w-10 h-10 mb-3" />
          <p className="text-sm opacity-90">Accuracy Score</p>
          <p className="text-2xl font-bold mt-2">94.8%</p>
          <p className="text-xs mt-2 opacity-80">↑ 2.3% this month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#14B8A6] to-[#0D9488] rounded-xl p-6 text-white shadow-lg"
        >
          <Zap className="w-10 h-10 mb-3" />
          <p className="text-sm opacity-90">Response Time</p>
          <p className="text-2xl font-bold mt-2">120ms</p>
          <p className="text-xs mt-2 opacity-80">Average latency</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-xl p-6 text-white shadow-lg ${
            isMonitoringActive
              ? "bg-gradient-to-br from-[#10B981] to-[#059669]"
              : "bg-gradient-to-br from-[#EF4444] to-[#DC2626]"
          }`}
        >
          {isMonitoringActive ? (
            <CheckCircle2 className="w-10 h-10 mb-3" />
          ) : (
            <AlertCircle className="w-10 h-10 mb-3" />
          )}
          <p className="text-sm opacity-90">Status</p>
          <p className="text-2xl font-bold mt-2">
            {isMonitoringActive ? "Running" : "Stopped"}
          </p>
          <p className="text-xs mt-2 opacity-80">
            {isMonitoringActive ? "All systems operational" : "Model inactive"}
          </p>
        </motion.div>
      </div>

      {/* AI Monitoring Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)]"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[#1F2937] flex items-center gap-2">
              <Brain className="w-6 h-6 text-[#3B82F6]" />
              AI Monitoring Control
            </h2>
            <p className="text-sm text-[#6B7280] mt-2">
              Enable or disable real-time engagement detection across all
              classrooms
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span
              className={`text-sm font-medium ${
                isMonitoringActive ? "text-[#10B981]" : "text-[#EF4444]"
              }`}
            >
              {isMonitoringActive ? "ON" : "OFF"}
            </span>
            <button
              onClick={handleToggleMonitoring}
              className={`relative w-16 h-8 rounded-full transition-all ${
                isMonitoringActive ? "bg-[#10B981]" : "bg-gray-300"
              }`}
            >
              <motion.div
                layout
                className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
                animate={{ x: isMonitoringActive ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Model Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)]"
        >
          <h2 className="text-xl font-bold text-[#1F2937] mb-4">
            Performance Metrics
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6B7280]">
                  Detection Accuracy
                </span>
                <span className="text-sm font-bold text-[#1F2937]">94.8%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#10B981] to-[#14B8A6]"
                  initial={{ width: 0 }}
                  animate={{ width: "94.8%" }}
                  transition={{ duration: 1, delay: 0.6 }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6B7280]">Model Confidence</span>
                <span className="text-sm font-bold text-[#1F2937]">91.2%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB]"
                  initial={{ width: 0 }}
                  animate={{ width: "91.2%" }}
                  transition={{ duration: 1, delay: 0.7 }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6B7280]">Processing Speed</span>
                <span className="text-sm font-bold text-[#1F2937]">
                  120ms avg
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#14B8A6] to-[#0D9488]"
                  initial={{ width: 0 }}
                  animate={{ width: "88%" }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6B7280]">Uptime</span>
                <span className="text-sm font-bold text-[#1F2937]">99.7%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#F59E0B] to-[#D97706]"
                  initial={{ width: 0 }}
                  animate={{ width: "99.7%" }}
                  transition={{ duration: 1, delay: 0.9 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* System Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)]"
        >
          <h2 className="text-xl font-bold text-[#1F2937] mb-4">
            System Information
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Server className="w-5 h-5 text-[#3B82F6]" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1F2937]">
                  Model Architecture
                </p>
                <p className="text-xs text-[#6B7280]">
                  CNN + Transformer Hybrid
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Activity className="w-5 h-5 text-[#10B981]" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1F2937]">
                  Last Updated
                </p>
                <p className="text-xs text-[#6B7280]">
                  February 15, 2026 - 14:32 UTC
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <TrendingUp className="w-5 h-5 text-[#14B8A6]" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1F2937]">
                  Training Dataset
                </p>
                <p className="text-xs text-[#6B7280]">
                  2.4M labeled images, 15K hours
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Zap className="w-5 h-5 text-[#F59E0B]" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1F2937]">
                  Compute Resources
                </p>
                <p className="text-xs text-[#6B7280]">4x NVIDIA A100 GPUs</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Log */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)]"
      >
        <h2 className="text-xl font-bold text-[#1F2937] mb-4">
          Recent Activity Log
        </h2>

        <div className="space-y-3">
          {[
            {
              time: "10:45 AM",
              event: "Model accuracy improved to 94.8%",
              type: "success",
            },
            {
              time: "09:30 AM",
              event: "Processed 1,250 student frames",
              type: "info",
            },
            {
              time: "08:15 AM",
              event: "System health check completed",
              type: "success",
            },
            {
              time: "07:00 AM",
              event: "Routine model optimization started",
              type: "warning",
            },
          ].map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="flex items-center gap-3 p-3 border-l-4 border-gray-200 hover:border-[#3B82F6] hover:bg-gray-50 transition-all rounded-r-xl"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  log.type === "success"
                    ? "bg-[#10B981]"
                    : log.type === "warning"
                    ? "bg-[#F59E0B]"
                    : "bg-[#3B82F6]"
                }`}
              />
              <div className="flex-1">
                <p className="text-sm text-[#1F2937]">{log.event}</p>
                <p className="text-xs text-[#6B7280]">{log.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Restart Confirmation Modal */}
      <AnimatePresence>
        {showRestartConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowRestartConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-full max-w-md p-6"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="w-8 h-8 text-[#F59E0B]" />
                </div>
                <h2 className="text-2xl font-bold text-[#1F2937]">
                  Restart AI Model?
                </h2>
                <p className="text-sm text-[#6B7280] mt-2">
                  This will temporarily stop engagement detection. The process
                  may take 2-3 minutes.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRestartConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRestartModel}
                  className="flex-1 px-4 py-2 bg-[#F59E0B] text-white rounded-xl hover:bg-[#D97706] transition-all"
                >
                  Restart Now
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
