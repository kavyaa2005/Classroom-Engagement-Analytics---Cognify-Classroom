import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  UserPlus,
  UserX,
  UserCheck,
  Eye,
  Search,
  X,
  Mail,
  BookOpen,
  Lock,
} from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import api from "../../services/api";

interface TeacherAPI {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  subject?: string;
  classrooms: { _id: string; name: string }[];
}
interface TeachersData {
  teachers: TeacherAPI[];
}

export function ManageTeachers() {
  const { data, loading, refetch } = useFetch<TeachersData>("/api/users/teachers");
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "Active" | "Inactive">("all");
  const [newTeacher, setNewTeacher] = useState({ name: "", email: "", password: "", subject: "" });
  const [saving, setSaving] = useState(false);

  const rawTeachers = data?.teachers ?? [];
  const teachers = rawTeachers.map(t => ({
    id: t._id,
    name: t.name,
    email: t.email,
    isActive: t.isActive,
    subject: t.subject ?? "—",
    classes: t.classrooms?.map(c => c.name) ?? [],
    status: (t.isActive ? "Active" : "Inactive") as "Active" | "Inactive",
  }));

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || teacher.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAddTeacher = async () => {
    if (!newTeacher.name || !newTeacher.email || !newTeacher.password) return;
    setSaving(true);
    try {
      await api.post("/api/users/teacher", {
        name: newTeacher.name,
        email: newTeacher.email,
        password: newTeacher.password,
        subject: newTeacher.subject || "General",
      });
      refetch();
      setShowModal(false);
      setNewTeacher({ name: "", email: "", password: "", subject: "" });
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "Failed to create teacher");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string, name: string, currentlyActive: boolean) => {
    const action = currentlyActive ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} ${name}?`)) return;
    try {
      await api.patch(`/api/users/${id}/toggle`);
      refetch();
    } catch (e) {
      alert(`Failed to ${action} teacher`);
    }
  };

  return (
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
            {teachers.filter((t) => t.status === "Active").length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-md"
        >
          <p className="text-[#6B7280]">Active Teachers</p>
          <p className="text-2xl font-bold text-[#3B82F6] mt-1">
            {loading ? "…" : `${teachers.filter(t => t.isActive).length} / ${teachers.length}`}
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
              setFilterStatus(e.target.value as "all" | "Active" | "Inactive")
            }
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
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
                  Subject
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
                  key={teacher.id}
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
                      {teacher.classes.map((cls, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs"
                        >
                          {cls}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-[#6B7280]">{teacher.subject}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        teacher.status === "Active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {teacher.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-[#3B82F6] hover:bg-blue-50 rounded-lg transition-all"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleToggle(teacher.id, teacher.name, teacher.isActive)}
                        className={`p-2 rounded-lg transition-all ${teacher.isActive ? "text-[#EF4444] hover:bg-red-50" : "text-[#10B981] hover:bg-green-50"}`}
                        title={teacher.isActive ? "Deactivate" : "Activate"}
                      >
                        {teacher.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
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
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                    <input
                      type="password"
                      value={newTeacher.password}
                      onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                      placeholder="Set a password"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-2">
                    Subject
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                    <input
                      type="text"
                      value={newTeacher.subject}
                      onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                      placeholder="Mathematics, Science, etc."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTeacher}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-[#3B82F6] text-white rounded-xl hover:bg-[#2563EB] transition-all disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save Teacher"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
