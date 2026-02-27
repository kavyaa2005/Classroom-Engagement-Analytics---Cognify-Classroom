import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Square,
  Users,
  Clock,
  Smile,
  Meh,
  Frown,
  Lightbulb,
  X,
  Activity,
} from "lucide-react";

const timelineData = [
  { time: "9:00", engagement: 85, emotion: "focused" },
  { time: "9:10", engagement: 82, emotion: "focused" },
  { time: "9:20", engagement: 75, emotion: "neutral" },
  { time: "9:30", engagement: 68, emotion: "distracted" },
  { time: "9:40", engagement: 78, emotion: "neutral" },
  { time: "9:50", engagement: 88, emotion: "focused" },
];

const suggestions = [
  {
    text: "Engagement dropped in last 5 minutes. Try asking a question.",
    actions: ["Start Quick Poll", "Show Quiz"],
  },
  {
    text: "Students are highly focused! This is a great time for complex topics.",
    actions: ["Continue", "Acknowledge"],
  },
  {
    text: "Consider a 2-minute break to refresh attention.",
    actions: ["Start Break Timer", "Ignore"],
  },
];

export function LiveClassMonitoring() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentEngagement, setCurrentEngagement] = useState(78);
  const [showSuggestion, setShowSuggestion] = useState(true);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 75) return "#10B981";
    if (engagement >= 50) return "#F59E0B";
    return "#F87171";
  };

  const getEngagementMessage = (engagement: number) => {
    if (engagement >= 75) return "Students are highly focused!";
    if (engagement >= 50) return "Attention is stable.";
    return "Consider interactive activity.";
  };

  const currentSuggestion = suggestions[currentSuggestionIndex];

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto pt-16 lg:pt-8">
      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[18px] p-6 mb-8"
        style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-semibold text-[#1E293B] mb-1">
              Class 10A - Mathematics
            </h1>
            <div className="flex items-center gap-4 text-[14px] text-[#64748B]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>9:00 AM - 10:00 AM</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>32 Students</span>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`px-8 py-4 rounded-[12px] font-semibold text-white transition-all duration-500 ${
              isMonitoring
                ? "bg-gradient-to-r from-[#F87171] to-[#EF4444]"
                : "bg-gradient-to-r from-[#10B981] to-[#059669]"
            }`}
          >
            {isMonitoring ? (
              <span className="flex items-center gap-2">
                <Square className="w-5 h-5" />
                End Monitoring
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Start Monitoring
              </span>
            )}
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Video & Engagement Meter */}
        <div className="lg:col-span-2 space-y-8">
          {/* Video Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[18px] p-6"
            style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
          >
            <div className="relative aspect-video bg-gradient-to-br from-[#1E293B] to-[#334155] rounded-[12px] overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-[14px] opacity-70">Camera Feed Preview</p>
                </div>
              </div>
              {isMonitoring && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-4 left-4 px-4 py-2 bg-[#10B981] text-white rounded-full flex items-center gap-2"
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                  <span className="text-[12px] font-medium">AI Monitoring Active</span>
                </motion.div>
              )}
            </div>

            {/* Attention Waveform */}
            {isMonitoring && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4"
              >
                <div className="flex items-center gap-2 h-12">
                  {[...Array(40)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-[#2563EB] rounded-full"
                      animate={{
                        height: [
                          `${Math.random() * 40 + 20}%`,
                          `${Math.random() * 40 + 20}%`,
                        ],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.05,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Engagement Meter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[18px] p-8"
            style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
          >
            <h2 className="text-[18px] font-semibold text-[#1E293B] mb-6 text-center">
              Class Engagement
            </h2>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="#F8FAFC"
                    strokeWidth="12"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke={getEngagementColor(currentEngagement)}
                    strokeWidth="12"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 502" }}
                    animate={{
                      strokeDasharray: `${
                        (currentEngagement / 100) * 502
                      } 502`,
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <motion.span
                    key={currentEngagement}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-[40px] font-bold"
                    style={{ color: getEngagementColor(currentEngagement) }}
                  >
                    {currentEngagement}%
                  </motion.span>
                  <span className="text-[14px] text-[#64748B]">Engagement</span>
                </div>
              </div>
            </div>
            <p
              className="text-center text-[16px] font-medium"
              style={{ color: getEngagementColor(currentEngagement) }}
            >
              {getEngagementMessage(currentEngagement)}
            </p>
          </motion.div>

          {/* Engagement Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-[18px] p-6"
            style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
          >
            <h2 className="text-[18px] font-semibold text-[#1E293B] mb-4">
              Engagement Timeline
            </h2>
            <div className="flex gap-2">
              {timelineData.map((item, index) => (
                <div key={index} className="flex-1">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="h-24 rounded-t-lg relative group cursor-pointer origin-bottom"
                    style={{
                      backgroundColor: getEngagementColor(item.engagement),
                      height: `${item.engagement}%`,
                      minHeight: "40px",
                    }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1E293B] text-white px-3 py-2 rounded-lg text-[12px] whitespace-nowrap z-10">
                      <div className="font-semibold">{item.time}</div>
                      <div>{item.engagement}% Engaged</div>
                      <div className="capitalize">{item.emotion}</div>
                    </div>
                  </motion.div>
                  <div className="text-[10px] text-[#64748B] text-center mt-2">
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - AI Assistant */}
        <div className="lg:col-span-1">
          <AnimatePresence>
            {showSuggestion && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-[18px] p-6 sticky top-8"
                style={{
                  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[18px] font-semibold text-[#1E293B] flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-[#F59E0B]" />
                    AI Teaching Assistant
                  </h2>
                  <button
                    onClick={() => setShowSuggestion(false)}
                    className="text-[#64748B] hover:text-[#1E293B] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* AI Avatar */}
                <div className="flex justify-center mb-6">
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative"
                  >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2563EB] to-[#0D9488] flex items-center justify-center">
                      <Lightbulb className="w-12 h-12 text-white" />
                    </div>
                    {/* Blinking effect */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className="absolute inset-0 rounded-full bg-[#2563EB] opacity-20"
                    />
                  </motion.div>
                </div>

                {/* Speech Bubble */}
                <motion.div
                  key={currentSuggestionIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#EFF6FF] rounded-[12px] p-4 mb-6 relative"
                >
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
                    <div
                      className="w-0 h-0"
                      style={{
                        borderLeft: "8px solid transparent",
                        borderRight: "8px solid transparent",
                        borderBottom: "8px solid #EFF6FF",
                      }}
                    />
                  </div>
                  <p className="text-[14px] text-[#1E293B]">
                    {currentSuggestion.text}
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {currentSuggestion.actions.map((action, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        console.log(`Action: ${action}`);
                        setCurrentSuggestionIndex(
                          (currentSuggestionIndex + 1) % suggestions.length
                        );
                      }}
                      className={`w-full px-4 py-3 rounded-[12px] font-medium transition-all duration-300 ${
                        index === 0
                          ? "bg-gradient-to-r from-[#2563EB] to-[#0D9488] text-white hover:shadow-lg"
                          : "bg-[#F8FAFC] text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                      }`}
                    >
                      {action}
                    </motion.button>
                  ))}
                </div>

                {/* Emotion Distribution */}
                <div className="mt-8 pt-6 border-t border-[#F8FAFC]">
                  <h3 className="text-[14px] font-semibold text-[#1E293B] mb-4">
                    Current Emotions
                  </h3>
                  <div className="space-y-3">
                    {[
                      { icon: Smile, label: "Engaged", value: 65, color: "#10B981" },
                      { icon: Meh, label: "Neutral", value: 25, color: "#F59E0B" },
                      { icon: Frown, label: "Confused", value: 10, color: "#F87171" },
                    ].map((emotion, index) => {
                      const Icon = emotion.icon;
                      return (
                        <div key={index} className="flex items-center gap-3">
                          <Icon
                            className="w-5 h-5 flex-shrink-0"
                            style={{ color: emotion.color }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[12px] text-[#64748B]">
                                {emotion.label}
                              </span>
                              <span className="text-[12px] font-semibold text-[#1E293B]">
                                {emotion.value}%
                              </span>
                            </div>
                            <div className="h-2 bg-[#F8FAFC] rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${emotion.value}%` }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: emotion.color }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}