import { useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Eye,
  Download,
  UserX,
  UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useFetch } from "../../hooks/useFetch";
import api from "../../services/api";

interface StudentAPI {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  classroomId?: { _id: string; name: string };
  avgEngagement?: number;
  attendanceRate?: number;
}
interface StudentsData {
  students: StudentAPI[];
}

function deriveRisk(s: StudentAPI): "Low" | "Medium" | "High" {
  const engagement = s.avgEngagement ?? 0;
  const attendance = s.attendanceRate ?? 0;
  
  // High risk: low engagement (<50%) OR low attendance (<60%)
  if (engagement < 50 || attendance < 60) return "High";
  // Medium risk: moderate engagement (50-70%) OR moderate attendance (60-80%)
  if (engagement < 70 || attendance < 80) return "Medium";
  // Low risk: good performance
  return "Low";
}

export function ManageStudents() {
  const navigate = useNavigate();
  const { data, loading, refetch } = useFetch<StudentsData>("/api/users/students");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState<"all" | "Low" | "Medium" | "High">("all");
  const [filterClass, setFilterClass] = useState("all");

  const rawStudents = data?.students ?? [];

  const students = rawStudents.map(s => ({
    id: s._id,
    name: s.name,
    email: s.email,
    isActive: s.isActive,
    class: s.classroomId?.name ?? "Unassigned",
    engagement: s.avgEngagement ?? 0,
    attendance: s.attendanceRate ??  0,
    risk: deriveRisk(s),
  }));

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === "all" || student.risk === filterRisk;
    const matchesClass = filterClass === "all" || student.class === filterClass;
    return matchesSearch && matchesRisk && matchesClass;
  });

  const atRiskCount = students.filter((s) => s.risk === "High").length;
  const allClasses = Array.from(new Set(students.map(s => s.class)));

  const handleToggle = async (id: string, name: string) => {
    try {
      await api.patch(`/api/users/${id}/toggle`);
      refetch();
    } catch (e) {
      console.error("Toggle failed", e);
      alert(`Failed to toggle ${name}`);
    }
  };

  const handleExport = () => {
    const rows = [
      ["Name", "Email", "Class", "Risk", "Active"],
      ...students.map(s => [s.name, s.email, s.class, s.risk, s.isActive ? "Yes" : "No"]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "students.csv";
    a.click();
  };

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
              <p className="text-2xl font-bold text-[#1F2937] mt-1">{loading ? "…" : students.length}</p>
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
              <p className="text-sm text-[#6B7280]">Active Students</p>
              <p className="text-2xl font-bold text-[#10B981] mt-1">
                {students.filter(s => s.isActive).length} Active
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
              <p className="text-sm text-[#6B7280]">Inactive Students</p>
              <p className="text-2xl font-bold text-[#14B8A6] mt-1">{students.filter(s => !s.isActive).length} Inactive</p>
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
            {allClasses.map(c => <option key={c} value={c}>{c}</option>)}
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
            onClick={handleExport}
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
              {filteredStudents.map((student, index) => (
                <motion.tr
                  key={student.id}
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
                      <span className="font-medium text-[#1F2937]">
                        {student.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                      {student.class}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            student.engagement >= 80
                              ? "bg-gradient-to-r from-[#10B981] to-[#14B8A6]"
                              : student.engagement >= 60
                              ? "bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]"
                              : "bg-gradient-to-r from-[#EF4444] to-[#F87171]"
                          }`}
                          style={{ width: `${student.engagement}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-[#1F2937] w-12">
                        {student.engagement}%
                      </span>
                      {student.engagement >= 80 ? (
                        <TrendingUp className="w-4 h-4 text-[#10B981]" />
                      ) : student.engagement < 60 ? (
                        <TrendingDown className="w-4 h-4 text-[#EF4444]" />
                      ) : null}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-medium text-[#1F2937]">
                      {student.attendance}%
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        student.risk === "Low"
                          ? "bg-emerald-100 text-emerald-700"
                          : student.risk === "Medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {student.risk === "High" && (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                      {student.risk}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`${student.name}\n${student.email}\nClass: ${student.class}`);
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
                          handleToggle(student.id, student.name);
                        }}
                        className={`p-2 rounded-lg transition-all ${student.isActive ? "text-[#EF4444] hover:bg-red-50" : "text-[#10B981] hover:bg-green-50"}`}
                        title={student.isActive ? "Deactivate" : "Activate"}
                      >
                        {student.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
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
