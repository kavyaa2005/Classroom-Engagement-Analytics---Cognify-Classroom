import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { motion } from "motion/react";
import { Brain } from "lucide-react";
import { useAuth, UserRole } from "../auth/AuthContext";

export function AutoLoginPage() {
    const { login } = useAuth();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");
        const role = searchParams.get("role") as UserRole | null;
        const name = searchParams.get("name");
        const email = searchParams.get("email");
        const id = searchParams.get("id");

        if (token && role && (role === "teacher" || role === "student") && name && email) {
            // login() writes to localStorage synchronously
            // Hard redirect so ProtectedRoute reads fresh localStorage — zero race condition
            login(role, name, email, token, id ?? undefined);
            window.location.replace(`/${role}`);
        } else {
            window.location.replace("/login");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
            >
                <div className="w-16 h-16 bg-gradient-to-br from-[#3B82F6] to-[#0D9488] rounded-2xl flex items-center justify-center shadow-lg">
                    <Brain className="w-9 h-9 text-white" />
                </div>
                <motion.div
                    className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
                <p className="text-white/50 text-sm">Signing you in…</p>
            </motion.div>
        </div>
    );
}