import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Radio, Users, Eye, AlertTriangle, TrendingUp } from "lucide-react";
import { adminAPI } from "../../services/api";

interface LiveClass {
  id: string;
  name: string;
  teacher: string;
  subject: string;
  students: number;
  engagement: number;
  status: "Excellent" | "Good" | "Needs Attention";
  activeNow: number;
  startTime: Date;
}

export function LiveMonitoring() {
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<LiveClass | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch live sessions every 3 seconds
  useEffect(() => {
    const fetchLiveSessions = async () => {
      try {
        const response = await adminAPI.getLiveSessions();
        if (response.data.success) {
          setLiveClasses(response.data.data.sessions);
        }
      } catch (error) {
        console.error("Failed to fetch live sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveSessions();
    const interval = setInterval(fetchLiveSessions, 3000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937]">Live Monitoring</h1>
          <p className="text-[#6B7280] mt-1">
            Real-time classroom engagement tracking
          </p>
        </div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl"
        >
          <Radio className="w-5 h-5" />
          <span className="font-medium">LIVE</span>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 shadow-md"
        >
          <p className="text-sm text-[#6B7280]">Live Classes</p>
          <p className="text-2xl font-bold text-[#3B82F6] mt-1">
            {liveClasses.length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-md"
        >
          <p className="text-sm text-[#6B7280]">Active Students</p>
          <p className="text-2xl font-bold text-[#10B981] mt-1">
            {liveClasses.reduce((sum, cls) => sum + cls.activeNow, 0)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-md"
        >
          <p className="text-sm text-[#6B7280]">Avg Engagement</p>
          <p className="text-2xl font-bold text-[#14B8A6] mt-1">
            {liveClasses.length > 0 
              ? Math.round(
                  liveClasses.reduce((sum, cls) => sum + cls.engagement, 0) /
                    liveClasses.length
                )
              : 0}
            %
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 shadow-md"
        >
          <p className="text-sm text-[#6B7280]">Needs Attention</p>
          <p className="text-2xl font-bold text-[#EF4444] mt-1">
            {
              liveClasses.filter((cls) => cls.status === "Needs Attention")
                .length
            }
          </p>
        </motion.div>
      </div>

      {/* No Live Classes Message */}
      {liveClasses.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-12 text-center shadow-md"
        >
          <Radio className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#1F2937] mb-2">
            No Live Classes
          </h3>
          <p className="text-[#6B7280]">
            There are currently no active classroom sessions
          </p>
        </motion.div>
      )}

      {/* Live Classes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {liveClasses.map((classItem, index) => (
          <motion.div
            key={classItem.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            onClick={() => setSelectedClass(classItem)}
            className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0px_12px_32px_rgba(0,0,0,0.12)] cursor-pointer transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-[#1F2937] text-lg">
                  {classItem.name}
                </h3>
                <p className="text-sm text-[#6B7280] mt-1">
                  {classItem.teacher}
                </p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-3 h-3 bg-red-500 rounded-full"
              />
            </div>

            {/* Engagement Meter */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6B7280]">
                  Engagement Level
                </span>
                <span className="text-lg font-bold text-[#1F2937]">
                  {Math.round(classItem.engagement)}%
                </span>
              </div>
              <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className={`absolute inset-y-0 left-0 rounded-full ${
                    classItem.engagement >= 80
                      ? "bg-gradient-to-r from-[#10B981] to-[#14B8A6]"
                      : classItem.engagement >= 60
                      ? "bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]"
                      : "bg-gradient-to-r from-[#EF4444] to-[#F87171]"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${classItem.engagement}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <Users className="w-5 h-5 text-[#6B7280] mx-auto mb-1" />
                <p className="text-xs text-[#6B7280]">Total</p>
                <p className="text-lg font-bold text-[#1F2937]">
                  {classItem.students}
                </p>
              </div>
              <div className="text-center">
                <Eye className="w-5 h-5 text-[#10B981] mx-auto mb-1" />
                <p className="text-xs text-[#6B7280]">Active</p>
                <p className="text-lg font-bold text-[#10B981]">
                  {classItem.activeNow}
                </p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-5 h-5 text-[#3B82F6] mx-auto mb-1" />
                <p className="text-xs text-[#6B7280]">Status</p>
                <p
                  className={`text-xs font-medium mt-1 ${
                    classItem.status === "Excellent"
                      ? "text-[#10B981]"
                      : classItem.status === "Good"
                      ? "text-[#F59E0B]"
                      : "text-[#EF4444]"
                  }`}
                >
                  {classItem.status}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                classItem.status === "Excellent"
                  ? "bg-emerald-50 text-emerald-700"
                  : classItem.status === "Good"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {classItem.status === "Needs Attention" && (
                <AlertTriangle className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {classItem.status === "Excellent"
                  ? "Class performing excellently"
                  : classItem.status === "Good"
                  ? "Class performing well"
                  : "Immediate attention required"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Class Detail Modal */}
      {selectedClass && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedClass(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
              {selectedClass.name}
            </h2>
            <p className="text-[#6B7280] mb-6">
              Detailed analytics for this live session
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-[#6B7280]">Teacher</p>
                  <p className="text-lg font-bold text-[#1F2937] mt-1">
                    {selectedClass.teacher}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-[#6B7280]">Engagement</p>
                  <p className="text-lg font-bold text-[#3B82F6] mt-1">
                    {Math.round(selectedClass.engagement)}%
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-[#1F2937] font-medium mb-2">
                  Real-time Metrics
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#6B7280]">Active Students</p>
                    <p className="text-xl font-bold text-[#3B82F6]">
                      {selectedClass.activeNow} / {selectedClass.students}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">Participation Rate</p>
                    <p className="text-xl font-bold text-[#10B981]">
                      {Math.round(
                        (selectedClass.activeNow / selectedClass.students) * 100
                      )}
                      %
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedClass(null)}
              className="w-full mt-6 px-4 py-3 bg-[#3B82F6] text-white rounded-xl hover:bg-[#2563EB] transition-all"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
