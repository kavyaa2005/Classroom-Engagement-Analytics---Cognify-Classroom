import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain,
  ShieldCheck,
  GraduationCap,
  Users,
  Eye,
  EyeOff,
  UserPlus,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import axios from "axios";
import { setToken } from "../../services/api";

type UserRole = "admin" | "teacher" | "student";

const roles: {
  id: UserRole;
  label: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  badge: string;
}[] = [
  {
    id: "admin",
    label: "Admin",
    description: "Full system access — manage teachers, students & analytics",
    icon: ShieldCheck,
    gradient: "from-[#3B82F6] to-[#1D4ED8]",
    badge: "This Portal",
  },
  {
    id: "teacher",
    label: "Teacher",
    description: "Monitor live classes & track student engagement insights",
    icon: Users,
    gradient: "from-[#0D9488] to-[#0F766E]",
    badge: "EngageAI Portal",
  },
  {
    id: "student",
    label: "Student",
    description: "Track personal performance & join live classroom sessions",
    icon: GraduationCap,
    gradient: "from-[#8B5CF6] to-[#7C3AED]",
    badge: "EngageAI Portal",
  },
];

export function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redirecting, setRedirecting] = useState<{ name: string; role: UserRole } | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) { setError("Please select a role first."); return; }
    if (!name.trim()) { setError("Full name is required."); return; }
    if (!email.trim()) { setError("Email is required."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setError("");
    setIsLoading(true);
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
        role: selectedRole,
      });

      const { token, user } = data.data;

      if (selectedRole === "admin") {
        // Set token in localStorage then hard-navigate so ProtectedRoute always sees it
        setToken(token);
        window.location.replace("/");
      } else {
        // Teacher / Student — pass credentials as query params to EngageAI auto-login
        const params = new URLSearchParams();
        params.set("token", token);
        params.set("role", user.role);
        params.set("name", user.name);
        params.set("email", user.email);
        params.set("id", user._id);
        const redirectUrl = `http://localhost:5173/auto-login?${params.toString()}`;
        setRedirecting({ name: user.name, role: user.role });
        // Brief pause so user sees success feedback, then redirect
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1200);
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Redirecting screen for teacher / student ───────────────────────────────
  if (redirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/[0.07] backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.4)] p-10 w-full max-w-md text-center"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
          <p className="text-white/60 text-sm mb-1">
            Welcome, <span className="text-white font-semibold">{redirecting.name}</span>
          </p>
          <p className="text-white/40 text-sm mb-8">
            Logging you in as a{" "}
            <span className="capitalize text-white/70 font-medium">{redirecting.role}</span>
            {" "}on the EngageAI Portal…
          </p>
          <div className="flex items-center justify-center gap-3 text-white/40 text-sm">
            <motion.div
              className="w-5 h-5 border-2 border-white/20 border-t-white/70 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
            <ExternalLink className="w-4 h-4" />
            Redirecting to EngageAI Portal…
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Registration form ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated blobs */}
      <motion.div
        className="absolute top-[-120px] right-[-80px] w-[450px] h-[450px] bg-[#8B5CF6]/20 rounded-full blur-[100px]"
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-80px] left-[-80px] w-[400px] h-[400px] bg-[#3B82F6]/20 rounded-full blur-[100px]"
        animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="bg-white/[0.07] backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.4)] overflow-hidden">
          {/* Header */}
          <div className="p-8 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6] to-[#0D9488] rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">EngageAI</h1>
                <p className="text-sm text-white/50">Classroom Analytics Platform</p>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-white">Create Account</h2>
            <p className="text-sm text-white/50 mt-1">
              Register with your role to get started
            </p>
          </div>

          <div className="p-8 space-y-6">
            {/* Role table */}
            <div>
              <p className="text-xs font-semibold text-white/40 tracking-widest uppercase mb-3">
                Select Your Role
              </p>
              <div className="rounded-2xl border border-white/10 overflow-hidden">
                {roles.map((role, idx) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <motion.button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.07)" }}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-all duration-200 ${
                        idx < roles.length - 1 ? "border-b border-white/10" : ""
                      } ${
                        isSelected
                          ? "bg-white/10"
                          : "bg-white/[0.03] hover:bg-white/[0.07]"
                      }`}
                    >
                      {/* Radio indicator */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isSelected ? "border-white bg-white" : "border-white/30"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#1E293B]" />
                        )}
                      </div>

                      {/* Icon */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${role.gradient} shadow-md flex-shrink-0`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>

                      {/* Labels */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">
                            {role.label}
                          </span>
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                              role.id === "admin"
                                ? "border-blue-500/40 text-blue-400 bg-blue-500/10"
                                : "border-white/15 text-white/40 bg-white/5"
                            }`}
                          >
                            {role.badge}
                          </span>
                        </div>
                        <p className="text-xs text-white/40 mt-0.5 truncate">
                          {role.description}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all duration-200 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@school.edu"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all duration-200 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all duration-200 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#0D9488] text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Create Account
                  </>
                )}
              </motion.button>
            </form>

            <p className="text-center text-sm text-white/40">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#60A5FA] hover:text-[#93C5FD] font-medium transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
