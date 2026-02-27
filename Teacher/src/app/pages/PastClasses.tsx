import { motion } from "motion/react";
import { Calendar, Clock, Users, TrendingUp } from "lucide-react";

const pastClasses = [
  {
    id: 1,
    name: "Class 10A - Mathematics",
    date: "Feb 20, 2026",
    time: "9:00 AM - 10:00 AM",
    students: 32,
    engagement: 88,
    duration: "60 min",
  },
  {
    id: 2,
    name: "Class 10B - Mathematics",
    date: "Feb 20, 2026",
    time: "10:30 AM - 11:30 AM",
    students: 30,
    engagement: 82,
    duration: "60 min",
  },
  {
    id: 3,
    name: "Class 10A - Mathematics",
    date: "Feb 19, 2026",
    time: "9:00 AM - 10:00 AM",
    students: 32,
    engagement: 75,
    duration: "60 min",
  },
  {
    id: 4,
    name: "Class 10B - Mathematics",
    date: "Feb 19, 2026",
    time: "10:30 AM - 11:30 AM",
    students: 30,
    engagement: 90,
    duration: "60 min",
  },
  {
    id: 5,
    name: "Class 10A - Mathematics",
    date: "Feb 18, 2026",
    time: "9:00 AM - 10:00 AM",
    students: 32,
    engagement: 78,
    duration: "60 min",
  },
];

export function PastClasses() {
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
        {pastClasses.map((classItem, index) => (
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
        ))}
      </div>
    </div>
  );
}
