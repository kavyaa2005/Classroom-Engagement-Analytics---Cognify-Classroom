import { motion } from "motion/react";
import { Calendar, Clock, Users, TrendingUp } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";

interface Session {
  _id: string;
  classroomId: { name: string; subject: string } | null;
  subject: string;
  startTime: string;
  endTime?: string;
  summary: { totalStudents: number; averageEngagement: number };
}
interface HistoryData {
  sessions: Session[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit",
  });
}
function durationMin(start: string, end?: string) {
  if (!end) return "—";
  const diff = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
  return `${diff} min`;
}

export function PastClasses() {
  const { data, loading } = useFetch<HistoryData>("/api/analytics/history?limit=20");
  const sessions = data?.sessions ?? [];

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 80) return "#10B981";
    if (engagement >= 60) return "#F59E0B";
    return "#F87171";
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-[28px] font-semibold text-[#1E293B] mb-2">
          Past Classes
        </h1>
        <p className="text-[16px] text-[#64748B]">
          Review previous class sessions and their engagement metrics.
        </p>
      </motion.div>

      {/* Classes List */}
      <div className="space-y-4">
        {loading && (
          <p className="text-center text-[#64748B] py-10">Loading past classes…</p>
        )}
        {!loading && sessions.length === 0 && (
          <p className="text-center text-[#64748B] py-10">No past sessions yet. Start a class to see records here.</p>
        )}
        {sessions.map((s, index) => {
          const eng = Math.round(s.summary?.averageEngagement ?? 0);
          const classItem = {
            id: s._id,
            name: s.classroomId
              ? `${s.classroomId.name} - ${s.classroomId.subject}`
              : s.subject,
            date: formatDate(s.startTime),
            time: `${formatTime(s.startTime)}${s.endTime ? " - " + formatTime(s.endTime) : ""}`,
            students: s.summary?.totalStudents ?? 0,
            engagement: eng,
            duration: durationMin(s.startTime, s.endTime),
          };
          return (
          <motion.div
            key={classItem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
            className="bg-white rounded-[18px] p-6 cursor-pointer transition-all duration-300"
            style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-[18px] font-semibold text-[#1E293B] mb-2">
                  {classItem.name}
                </h3>
                <div className="flex items-center gap-6 text-[14px] text-[#64748B]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{classItem.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{classItem.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{classItem.students} students</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-[12px] text-[#64748B] mb-1">Engagement</p>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[24px] font-semibold"
                      style={{ color: getEngagementColor(classItem.engagement) }}
                    >
                      {classItem.engagement}%
                    </span>
                    <TrendingUp
                      className="w-5 h-5"
                      style={{ color: getEngagementColor(classItem.engagement) }}
                    />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-[#EFF6FF] text-[#2563EB] rounded-[12px] font-medium hover:bg-[#2563EB] hover:text-white transition-all duration-300"
                >
                  View Report
                </motion.button>
              </div>
            </div>
          </motion.div>
          );
        })}
      </div>
    </div>
  );
}
