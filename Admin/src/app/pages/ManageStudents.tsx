import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Eye,
  Edit,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router";
import { adminAPI } from "../../services/api";

interface Student {
  _id: string;
  name: string;
  email: string;
  rollNumber?: string;
  classroomId?: {
    _id: string;
    name: string;
    section?: string;
    subject?: string;
  };
  avgEngagement: number;
  attendanceRate: number;
  isActive: boolean;
}

export function ManageStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState<"all" | "Low" | "Medium" | "High">("all");
  const [filterClass, setFilterClass] = useState("all");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await adminAPI.getStudents();
      if (response.data.success) {
        setStudents(response.data.data.students);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (engagement: number): "Low" | "Medium" | "High" => {
    if (engagement >= 70) return "Low";
    if (engagement >= 50) return "Medium";
    return "High";
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const risk = getRiskLevel(student.avgEngagement);
    const matchesRisk = filterRisk === "all" || risk === filterRisk;
    const className = student.classroomId ? `${student.classroomId.name} ${student.classroomId.section || ""}`.trim() : "No Class";
    const matchesClass = filterClass === "all" || className === filterClass;
    return matchesSearch && matchesRisk && matchesClass;
  });

  const avgEngagement = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + s.avgEngagement, 0) / students.length)
    : 0;

  const avgAttendance = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length)
    : 0;

  const atRiskCount = students.filter((s) => getRiskLevel(s.avgEngagement) === "High").length;

  const uniqueClasses = [...new Set(students.map((s) => 
    s.classroomId ? `${s.classroomId.name} ${s.classroomId.section || ""}`.trim() : "No Class"
  ))];

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
      <div>
        <h1 className="text-3xl font-bold text-[#1F2937]">Manage Students</h1>
        <p className="text-[#6B7280] mt-1">
          Monitor student performance and engagement
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Total Students</p>
              <p className="text-2xl font-bold text-[#1F2937] mt-1">{students.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#3B82F6]" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Avg Engagement</p>
              <p className="text-2xl font-bold text-[#10B981] mt-1">
                {avgEngagement}%
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#10B981]" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">At Risk</p>
              <p className="text-2xl font-bold text-[#EF4444] mt-1">
                {atRiskCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-[#EF4444]" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Avg Attendance</p>
              <p className="text-2xl font-bold text-[#14B8A6] mt-1">{avgAttendance}%</p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#14B8A6]" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>

          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            <option value="all">All Classes</option>
            {uniqueClasses.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>

          <select
            value={filterRisk}
            onChange={(e) =>
              setFilterRisk(e.target.value as "all" | "Low" | "Medium" | "High")
            }
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            <option value="all">All Risk Levels</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-[#10B981] text-white rounded-xl hover:bg-[#059669] transition-all"
          >
            <Download className="w-4 h-4" />
            Export Data
          </motion.button>
        </div>
      </div>

      {/* Students Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-[0px_8px_24px_rgba(0,0,0,0.08)] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#6B7280]">
                  Student Name
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#6B7280]">
                  Class
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#6B7280]">
                  Engagement Score
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#6B7280]">
                  Attendance Rate
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#6B7280]">
                  Risk Indicator
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#6B7280]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => {
                const risk = getRiskLevel(student.avgEngagement);
                const className = student.classroomId 
                  ? `${student.classroomId.name} ${student.classroomId.section || ""}`.trim() 
                  : "No Class";
                
                return (
                  <motion.tr
                    key={student._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    onClick={() => alert(`View details for ${student.name}`)}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#14B8A6] rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="font-medium text-[#1F2937]">
                            {student.name}
                          </div>
                          <div className="text-xs text-[#6B7280]">
                            {student.rollNumber || student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                        {className}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              student.avgEngagement >= 80
                                ? "bg-gradient-to-r from-[#10B981] to-[#14B8A6]"
                                : student.avgEngagement >= 60
                                ? "bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]"
                                : "bg-gradient-to-r from-[#EF4444] to-[#F87171]"
                            }`}
                            style={{ width: `${student.avgEngagement}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-[#1F2937] w-12">
                          {student.avgEngagement}%
                        </span>
                        {student.avgEngagement >= 80 ? (
                          <TrendingUp className="w-4 h-4 text-[#10B981]" />
                        ) : student.avgEngagement < 60 ? (
                          <TrendingDown className="w-4 h-4 text-[#EF4444]" />
                        ) : null}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-[#1F2937]">
                        {student.attendanceRate}%
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          risk === "Low"
                            ? "bg-emerald-100 text-emerald-700"
                            : risk === "Medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {risk === "High" && (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        {risk}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`View ${student.name}'s profile`);
                          }}
                          className="p-2 text-[#3B82F6] hover:bg-blue-50 rounded-lg transition-all"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Edit ${student.name}'s details`);
                          }}
                          className="p-2 text-[#14B8A6] hover:bg-teal-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-[#6B7280]">
            Showing {filteredStudents.length} of {students.length} students
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm">
              Previous
            </button>
            <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-all text-sm">
              Next
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
