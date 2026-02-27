import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Brain, ShieldCheck, GraduationCap, Users, Eye, EyeOff, UserPlus } from "lucide-react";
import { useAuth, UserRole } from "../auth/AuthContext";
import api from "../services/api";

const roles = [
    {
        id: "admin" as UserRole,
        label: "Admin",
        description: "Manage teachers, students & system-wide analytics",
        icon: ShieldCheck,
        gradient: "from-[#3B82F6] to-[#1D4ED8]",
    },
    {
        id: "teacher" as UserRole,
        label: "Teacher",
        description: "Monitor live classes & student engagement insights",
        icon: Users,
        gradient: "from-[#0D9488] to-[#0F766E]",
    },
    {
        id: "student" as UserRole,
        label: "Student",
        description: "Track your personal performance & class insights",
        icon: GraduationCap,
        gradient: "from-[#8B5CF6] to-[#7C3AED]",
    },
];

export function RegisterPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRole) { setError("Please select your role."); return; }
        if (!name.trim() || !email.trim() || !password.trim()) { setError("Please fill in all fields."); return; }
        if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
        setError("");
        setIsLoading(true);
        try {
            const { data } = await api.post("/api/auth/register", {
                name: name.trim(),
                email: email.trim(),
                password,
                role: selectedRole,
            });
            const { token, user } = data.data;
            login(user.role, user.name, user.email, token, user._id);
            navigate(`/${selectedRole}`);
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setError(msg || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated blobs */}
            <motion.div className="absolute top-[-120px] right-[-80px] w-[450px] h-[450px] bg-[#8B5CF6]/20 rounded-full blur-[100px]"
                animate={{ x: [0, -40, 0], y: [0, 30, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
            <motion.div className="absolute bottom-[-80px] left-[-80px] w-[400px] h-[400px] bg-[#3B82F6]/20 rounded-full blur-[100px]"
                animate={{ x: [0, 30, 0], y: [0, -30, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />

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
                        <p className="text-sm text-white/50 mt-1">Join your institution's analytics platform</p>
                    </div>

                    <div className="p-8 space-y-6">
                        {/* Role Selector */}
                        <div>
                            <p className="text-xs font-semibold text-white/40 tracking-widest uppercase mb-3">I am a...</p>
                            <div className="grid grid-cols-3 gap-3">
                                {roles.map((role) => {
                                    const Icon = role.icon;
                                    const isSelected = selectedRole === role.id;
                                    return (
                                        <motion.button
                                            key={role.id}
                                            type="button"
                                            onClick={() => setSelectedRole(role.id)}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${isSelected
                                                    ? "border-white/40 bg-white/15 shadow-lg"
                                                    : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                                                }`}
                                        >
                                            {isSelected && (
                                                <motion.div
                                                    layoutId="roleGlowReg"
                                                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${role.gradient} opacity-20`}
                                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                />
                                            )}
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${role.gradient} shadow-md`}>
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-sm font-semibold text-white">{role.label}</span>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="John Smith"
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all duration-200 text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="you@school.edu"
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all duration-200 text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Min. 6 characters"
                                        className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all duration-200 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/30 hover:text-white/60 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#0D9488] text-white font-semibold text-sm shadow-lg hover:shadow-[#8B5CF6]/30 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
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
                            <Link to="/login" className="text-[#60A5FA] hover:text-[#93C5FD] font-medium transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
