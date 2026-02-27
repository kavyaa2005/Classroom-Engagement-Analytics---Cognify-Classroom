import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  UserPlus,
  Edit,
  UserX,
  Eye,
  Search,
  Filter,
  X,
  Mail,
  BookOpen,
  Trash,
} from "lucide-react";
import { adminAPI } from "../../services/api";

interface Teacher {
  _id: string;
  name: string;
  email: string;
  classes: Array<{ _id: string; name: string; section?: string; subject?: string }>;
  subject?: string;
  isActive: boolean;
}

export function ManageTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [loading, setLoading] = useState(true);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    password: "",
    subject: "",
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await adminAPI.getTeachers();
      if (response.data.success) {
        setTeachers(response.data.data.teachers);
      }
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && teacher.isActive) ||
      (filterStatus === "inactive" && !teacher.isActive);
    return matchesSearch && matchesFilter;
  });

  const handleAddTeacher = async () => {
    if (newTeacher.name && newTeacher.email && newTeacher.password) {
      try {
        const response = await adminAPI.createTeacher(newTeacher);
        if (response.data.success) {
          await fetchTeachers();
          setShowModal(false);
          setNewTeacher({ name: "", email: "", password: "", subject: "" });
        }
      } catch (error: any) {
        alert(error.response?.data?.message || "Failed to create teacher");
      }
    } else {
      alert("Please fill in all required fields");
    }
  };

  const handleToggleActive = async (teacherId: string) => {
    const teacher = teachers.find((t) => t._id === teacherId);
    const action = teacher?.isActive ? "deactivate" : "activate";
    const confirmed = window.confirm(
      `Are you sure you want to ${action} this teacher?`
    );
    if (confirmed) {
      try {
        await adminAPI.toggleUser(teacherId);
        await fetchTeachers();
      } catch (error) {
        console.error("Failed to toggle teacher status:", error);
      }
    }
  };

  const handleDelete = async (teacherId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this teacher? This action cannot be undone."
    );
    if (confirmed) {
      try {
        await adminAPI.deleteUser(teacherId);
        await fetchTeachers();
      } catch (error) {
        console.error("Failed to delete teacher:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937]">Manage Teachers</h1>
          <p className="text-[#6B7280] mt-1">
            View and manage all teaching staff
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#3B82F6] text-white rounded-xl hover:bg-[#2563EB] transition-all shadow-lg"
        >
          <UserPlus className="w-5 h-5" />
          Add Teacher
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 shadow-md"
        >
          <p className="text-sm text-[#6B7280]">Total Teachers</p>
          <p className="text-2xl font-bold text-[#1F2937] mt-1">
            {teachers.length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-md"
        >
          <p className="text-sm text-[#6B7280]">Active</p>
          <p className="text-2xl font-bold text-[#10B981] mt-1">
            {teachers.filter((t) => t.isActive).length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-md"
        >
          <p className="text-sm text-[#6B7280]">Total Classes</p>
          <p className="text-2xl font-bold text-[#3B82F6] mt-1">
            {teachers.reduce((sum, t) => sum + t.classes.length, 0)}
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as "all" | "active" | "inactive")
            }
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Teachers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-[0px_8px_24px_rgba(0,0,0,0.08)] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#6B7280]">
                  Teacher Name
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#6B7280]">
                  Email
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#6B7280]">
                  Classes Assigned
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#6B7280]">
                  Performance
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#6B7280]">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#6B7280]">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#6B7280]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher, index) => (
                <motion.tr
                  key={teacher._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#14B8A6] rounded-full flex items-center justify-center text-white font-medium">
                        {teacher.name.charAt(0)}
                      </div>
                      <span className="font-medium text-[#1F2937]">
                        {teacher.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[#6B7280]">{teacher.email}</td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {teacher.classes.length > 0 ? (
                        teacher.classes.map((cls, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs"
                          >
                            {cls.name} {cls.section || ""}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">No classes</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[#6B7280]">{teacher.subject || "—"}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        teacher.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {teacher.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleToggleActive(teacher._id)}
                        className="p-2 text-[#14B8A6] hover:bg-teal-50 rounded-lg transition-all"
                        title={teacher.isActive ? "Deactivate" : "Activate"}
                      >
                        <UserX className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(teacher._id)}
                        className="p-2 text-[#EF4444] hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Teacher Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#1F2937]">
                  Add New Teacher
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newTeacher.name}
                    onChange={(e) =>
                      setNewTeacher({ ...newTeacher, name: e.target.value })
                    }
                    placeholder="Enter teacher name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                    <input
                      type="email"
                      value={newTeacher.email}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, email: e.target.value })
                      }
                      placeholder="teacher@school.edu"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-2">
                    Assign Classes (comma-separated)
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                    <input
                      type="text"
                      value={newTeacher.classes}
                      onChange={(e) =>
                        setNewTeacher({
                          ...newTeacher,
                          classes: e.target.value,
                        })
                      }
                      placeholder="Class 8A, Class 9B"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={newTeacher.password}
                    onChange={(e) =>
                      setNewTeacher({ ...newTeacher, password: e.target.value })
                    }
                    placeholder="Enter password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-2">
                    Subject (optional)
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                    <input
                      type="text"
                      value={newTeacher.subject}
                      onChange={(e) =>
                        setNewTeacher({
                          ...newTeacher,
                          subject: e.target.value,
                        })
                      }
                      placeholder="Mathematics, Science, etc."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddTeacher}
                  className="flex-1 px-4 py-2 bg-[#3B82F6] text-white rounded-xl hover:bg-[#2563EB] transition-all"
                >
                  Save Teacher
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </div>
    </>
  );
}
