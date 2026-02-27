import { useState } from "react";
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

interface Student {
  id: number;
  name: string;
  class: string;
  engagement: number;
  attendance: number;
  risk: "Low" | "Medium" | "High";
}

const studentsData: Student[] = [
  {
    id: 1,
    name: "Emma Wilson",
    class: "Class 8A",
    engagement: 92,
    attendance: 98,
    risk: "Low",
  },
  {
    id: 2,
    name: "James Brown",
    class: "Class 8B",
    engagement: 45,
    attendance: 72,
    risk: "High",
  },
  {
    id: 3,
    name: "Sophia Martinez",
    class: "Class 9A",
    engagement: 88,
    attendance: 95,
    risk: "Low",
  },
  {
    id: 4,
    name: "Oliver Davis",
    class: "Class 9B",
    engagement: 65,
    attendance: 85,
    risk: "Medium",
  },
  {
    id: 5,
    name: "Ava Garcia",
    class: "Class 10A",
    engagement: 78,
    attendance: 90,
    risk: "Low",
  },
  {
    id: 6,
    name: "Liam Johnson",
    class: "Class 8A",
    engagement: 55,
    attendance: 68,
    risk: "High",
  },
  {
    id: 7,
    name: "Isabella Lee",
    class: "Class 9B",
    engagement: 82,
    attendance: 92,
    risk: "Low",
  },
  {
    id: 8,
    name: "Noah Anderson",
    class: "Class 10B",
    engagement: 70,
    attendance: 88,
    risk: "Medium",
  },
];

export function ManageStudents() {
  const navigate = useNavigate();
  const [students] = useState<Student[]>(studentsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState<"all" | "Low" | "Medium" | "High">(
    "all"
  );
  const [filterClass, setFilterClass] = useState("all");

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === "all" || student.risk === filterRisk;
    const matchesClass =
      filterClass === "all" || student.class === filterClass;
    return matchesSearch && matchesRisk && matchesClass;
  });

  const avgEngagement = Math.round(
    students.reduce((sum, s) => sum + s.engagement, 0) / students.length
  );

  const atRiskCount = students.filter((s) => s.risk === "High").length;

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
              <p className="text-2xl font-bold text-[#1F2937] mt-1">1,250</p>
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
              <p className="text-2xl font-bold text-[#14B8A6] mt-1">87%</p>
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
            <option value="Class 8A">Class 8A</option>
            <option value="Class 8B">Class 8B</option>
            <option value="Class 9A">Class 9A</option>
            <option value="Class 9B">Class 9B</option>
            <option value="Class 10A">Class 10A</option>
            <option value="Class 10B">Class 10B</option>
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
