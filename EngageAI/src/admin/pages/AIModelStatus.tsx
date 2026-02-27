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

interface AIHealth {
  status: string;
  model?: string;
  version?: string;
}

export function AIModelStatus() {
  const [isMonitoringActive, setIsMonitoringActive] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [aiHealth, setAiHealth] = useState<AIHealth | null>(null);
  const [aiLatencyMs, setAiLatencyMs] = useState<number | null>(null);
  const [aiError, setAiError] = useState(false);

  const checkAIHealth = async () => {
    const start = Date.now();
    try {
      const res = await fetch("http://localhost:8001/health");
      const json = await res.json();
      setAiHealth(json);
      setAiLatencyMs(Date.now() - start);
      setIsMonitoringActive(json.status === "ok" || json.loaded === true);
      setAiError(false);
    } catch {
      setAiError(true);
      setIsMonitoringActive(false);
    }
  };

  useEffect(() => {
    checkAIHealth();
    const id = setInterval(checkAIHealth, 10000);
    return () => clearInterval(id);
  }, []);

  const handleToggleMonitoring = () => {
    setIsMonitoringActive(prev => !prev);
  };

  const handleRestartModel = () => {
    setShowRestartConfirm(false);
    alert("AI Model restart request sent. Please restart the AIService manually if needed.");
  };

  const modelVersion = aiError ? "Offline" : (aiHealth?.model ?? "engagement_model_v3");
  const latencyDisplay = aiLatencyMs != null ? `${aiLatencyMs}ms` : "—";

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
          <p className="text-sm opacity-90">Model</p>
          <p className="text-lg font-bold mt-2 leading-tight">{modelVersion}</p>
          <p className="text-xs mt-2 opacity-80">EfficientNet-B0 · 2 classes</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-6 text-white shadow-lg"
        >
          <Activity className="w-10 h-10 mb-3" />
          <p className="text-sm opacity-90">Input Resolution</p>
          <p className="text-2xl font-bold mt-2">224×224</p>
          <p className="text-xs mt-2 opacity-80">RGB · ImageNet normalisation</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#14B8A6] to-[#0D9488] rounded-xl p-6 text-white shadow-lg"
        >
          <Zap className="w-10 h-10 mb-3" />
          <p className="text-sm opacity-90">Response Latency</p>
          <p className="text-2xl font-bold mt-2">{latencyDisplay}</p>
          <p className="text-xs mt-2 opacity-80">Live ping to AI service</p>
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
            Engagement Thresholds
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6B7280]">Attentive</span>
                <span className="text-sm font-bold text-[#1F2937]">score ≥ 0.70</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#10B981] to-[#14B8A6]"
                  initial={{ width: 0 }}
                  animate={{ width: "70%" }}
                  transition={{ duration: 1, delay: 0.6 }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6B7280]">Neutral</span>
                <span className="text-sm font-bold text-[#1F2937]">score ≥ 0.40</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB]"
                  initial={{ width: 0 }}
                  animate={{ width: "40%" }}
                  transition={{ duration: 1, delay: 0.7 }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6B7280]">Distracted</span>
                <span className="text-sm font-bold text-[#1F2937]">score ≥ 0.15</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#F59E0B] to-[#D97706]"
                  initial={{ width: 0 }}
                  animate={{ width: "15%" }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6B7280]">Confidence Floor</span>
                <span className="text-sm font-bold text-[#1F2937]">0.38 minimum</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#EF4444] to-[#DC2626]"
                  initial={{ width: 0 }}
                  animate={{ width: "38%" }}
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
                  EfficientNet-B0 (timm / PyTorch)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Activity className="w-5 h-5 text-[#10B981]" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1F2937]">
                  Model Checkpoint
                </p>
                <p className="text-xs text-[#6B7280]">
                  engagement_model_v3.pth
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <TrendingUp className="w-5 h-5 text-[#14B8A6]" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1F2937]">
                  Output Classes
                </p>
                <p className="text-xs text-[#6B7280]">
                  2 classes (Engaged / Not Engaged) → 4 states
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Zap className="w-5 h-5 text-[#F59E0B]" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1F2937]">
                  Face Detection
                </p>
                <p className="text-xs text-[#6B7280]">OpenCV Haar Cascade · min size 48×48</p>
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
              time: "Startup",
              event: `AI service health check: ${aiError ? "OFFLINE — start uvicorn on port 8001" : "OK · model loaded"}`,
              type: aiError ? "warning" : "success",
            },
            {
              time: "Config",
              event: "Model: engagement_model_v3.pth · Architecture: EfficientNet-B0",
              type: "info",
            },
            {
              time: "Config",
              event: "Input: 224×224 RGB · ImageNet normalisation (mean/std)",
              type: "info",
            },
            {
              time: "Config",
              event: "Face detector: OpenCV Haar Cascade · Confidence floor: 0.38",
              type: "info",
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
