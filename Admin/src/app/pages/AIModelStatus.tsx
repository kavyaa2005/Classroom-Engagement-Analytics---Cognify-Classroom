import { useState, useEffect } from "react";
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
import { adminAPI } from "../../services/api";

interface AIStatusData {
  aiService: {
    status: "online" | "offline";
    loaded: boolean;
    model: string;
    timestamp: number | null;
  };
  stats: {
    totalPredictions: number;
    todayPredictions: number;
    activeSessions: number;
  };
}

export function AIModelStatus() {
  const [isMonitoringActive, setIsMonitoringActive] = useState(true);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [statusData, setStatusData] = useState<AIStatusData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const res = await adminAPI.getAIStatus();
        setStatusData(res.data.data);
        // Keep toggle in sync with real service status
        setIsMonitoringActive(res.data.data.aiService.status === "online");
      } catch (err) {
        console.error("Failed to fetch AI status", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const handleToggleMonitoring = () => {
    setIsMonitoringActive(!isMonitoringActive);
  };

  const handleRestartModel = () => {
    setShowRestartConfirm(false);
    alert("AI Model is restarting... This may take a few minutes.");
  };

  const serviceOnline = statusData?.aiService.status === "online";
  const modelName = statusData?.aiService.model ?? "engagement_model_v3";
  const totalPredictions = statusData?.stats.totalPredictions ?? 0;
  const todayPredictions = statusData?.stats.todayPredictions ?? 0;
  const activeSessions = statusData?.stats.activeSessions ?? 0;
  const lastPing = statusData?.aiService.timestamp
    ? new Date(statusData.aiService.timestamp * 1000).toLocaleTimeString()
    : "â€”";

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
          <p className="text-sm opacity-90">Model Name</p>
          <p className="text-lg font-bold mt-2 truncate">{loading ? "â€¦" : modelName}</p>
          <p className="text-xs mt-2 opacity-80">EfficientNet-B0</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-6 text-white shadow-lg"
        >
          <Activity className="w-10 h-10 mb-3" />
          <p className="text-sm opacity-90">Total Predictions</p>
          <p className="text-2xl font-bold mt-2">{loading ? "â€¦" : totalPredictions.toLocaleString()}</p>
          <p className="text-xs mt-2 opacity-80">Today: {loading ? "â€¦" : todayPredictions}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#14B8A6] to-[#0D9488] rounded-xl p-6 text-white shadow-lg"
        >
          <Zap className="w-10 h-10 mb-3" />
          <p className="text-sm opacity-90">Active Sessions</p>
          <p className="text-2xl font-bold mt-2">{loading ? "â€¦" : activeSessions}</p>
          <p className="text-xs mt-2 opacity-80">Last ping: {loading ? "â€¦" : lastPing}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-xl p-6 text-white shadow-lg ${
            serviceOnline
              ? "bg-gradient-to-br from-[#10B981] to-[#059669]"
              : "bg-gradient-to-br from-[#EF4444] to-[#DC2626]"
          }`}
        >
          {serviceOnline ? (
            <CheckCircle2 className="w-10 h-10 mb-3" />
          ) : (
            <AlertCircle className="w-10 h-10 mb-3" />
          )}
          <p className="text-sm opacity-90">AI Service</p>
          <p className="text-2xl font-bold mt-2">
            {loading ? "â€¦" : serviceOnline ? "Online" : "Offline"}
          </p>
          <p className="text-xs mt-2 opacity-80">
            {loading ? "Checkingâ€¦" : serviceOnline ? "All systems operational" : "Service unreachable"}
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
        {/* DB Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)]"
        >
          <h2 className="text-xl font-bold text-[#1F2937] mb-4">
            Prediction Stats
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6B7280]">
                  Total Records in DB
                </span>
                <span className="text-sm font-bold text-[#1F2937]">
                  {loading ? "â€¦" : totalPredictions.toLocaleString()}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#10B981] to-[#14B8A6]"
                  initial={{ width: 0 }}
                  animate={{ width: totalPredictions > 0 ? "100%" : "0%" }}
                  transition={{ duration: 1, delay: 0.6 }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6B7280]">Today's Predictions</span>
                <span className="text-sm font-bold text-[#1F2937]">
                  {loading ? "â€¦" : todayPredictions.toLocaleString()}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB]"
                  initial={{ width: 0 }}
                  animate={{ width: totalPredictions > 0 ? `${Math.min(100, (todayPredictions / Math.max(totalPredictions, 1)) * 100)}%` : "0%" }}
                  transition={{ duration: 1, delay: 0.7 }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6B7280]">Active Sessions</span>
                <span className="text-sm font-bold text-[#1F2937]">
                  {loading ? "â€¦" : activeSessions}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#14B8A6] to-[#0D9488]"
                  initial={{ width: 0 }}
                  animate={{ width: activeSessions > 0 ? "100%" : "5%" }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6B7280]">Service Uptime</span>
                <span className="text-sm font-bold text-[#1F2937]">
                  {loading ? "â€¦" : serviceOnline ? "Online" : "Offline"}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${serviceOnline ? "from-[#F59E0B] to-[#D97706]" : "from-[#EF4444] to-[#DC2626]"}`}
                  initial={{ width: 0 }}
                  animate={{ width: serviceOnline ? "99%" : "0%" }}
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
                  EfficientNet-B0 (timm / ImageNet pretrained)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Activity className="w-5 h-5 text-[#10B981]" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1F2937]">
                  AI Service URL
                </p>
                <p className="text-xs text-[#6B7280]">
                  http://localhost:8001 â€” /predict (POST), /health (GET)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <TrendingUp className="w-5 h-5 text-[#14B8A6]" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1F2937]">
                  Engagement Classes
                </p>
                <p className="text-xs text-[#6B7280]">
                  Attentive Â· Neutral Â· Distracted Â· Inactive
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Zap className="w-5 h-5 text-[#F59E0B]" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1F2937]">
                  Input Specs
                </p>
                <p className="text-xs text-[#6B7280]">
                  224Ã—224 RGB Â· ImageNet normalisation Â· JPEG/PNG frames
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Live Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className={`rounded-2xl p-4 flex items-center gap-3 ${
          serviceOnline ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
        }`}
      >
        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${serviceOnline ? "bg-green-500 animate-pulse" : "bg-red-400"}`} />
        <p className={`text-sm font-medium ${serviceOnline ? "text-green-700" : "text-red-600"}`}>
          {loading
            ? "Checking AI serviceâ€¦"
            : serviceOnline
            ? `AI service is online and responding Â· auto-refreshes every 15s Â· last ping ${lastPing}`
            : "AI service is offline â€” start AIService/main.py with uvicorn to enable engagement detection"}
        </p>
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
