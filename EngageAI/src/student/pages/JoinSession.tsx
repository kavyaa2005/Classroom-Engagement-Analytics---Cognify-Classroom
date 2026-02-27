import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Hash, ArrowRight, Wifi, AlertCircle } from "lucide-react";
import api from "../../services/api";

export default function JoinSession() {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const fullCode = code.join("");

  const handleChange = (index: number, value: string) => {
    const char = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(-1);
    const next = [...code];
    next[index] = char;
    setCode(next);
    setError("");
    if (char && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    const next = [...code];
    for (let i = 0; i < 6; i++) next[i] = pasted[i] || "";
    setCode(next);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleJoin = async () => {
    if (fullCode.length < 6) {
      setError("Please enter the complete 6-character code.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/api/session/join-by-code", { code: fullCode });
      const { sessionId } = data.data;
      navigate(`/student/live-session/${sessionId}`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Invalid or expired code. Ask your teacher for the current code.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F9FF] via-[#F8FAFC] to-[#EEF2FF] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-20 h-20 rounded-[20px] bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <Wifi className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-[28px] font-bold text-[#1E293B] mb-2">Join a Live Session</h1>
          <p className="text-[#64748B] text-[15px]">
            Enter the 6-character code your teacher shared with you
          </p>
        </div>

        {/* Code input card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[24px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
        >
          <div className="flex items-center gap-2 mb-6">
            <Hash className="w-5 h-5 text-[#8B5CF6]" />
            <span className="text-[15px] font-semibold text-[#1E293B]">Session Code</span>
          </div>

          {/* 6-box code input */}
          <div className="flex gap-3 justify-center mb-6">
            {code.map((char, i) => (
              <input
                key={i}
                ref={(el) => { inputs.current[i] = el; }}
                type="text"
                inputMode="text"
                maxLength={1}
                value={char}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                className={`w-12 h-14 text-center text-[22px] font-bold rounded-[12px] border-2 outline-none transition-all duration-200
                  ${char
                    ? "border-[#8B5CF6] bg-[#F5F3FF] text-[#7C3AED]"
                    : "border-[#E2E8F0] bg-[#F8FAFC] text-[#1E293B]"
                  }
                  focus:border-[#8B5CF6] focus:bg-[#F5F3FF]`}
              />
            ))}
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 bg-red-50 text-red-600 text-[13px] rounded-[10px] px-3 py-2.5 mb-5"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Join button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleJoin}
            disabled={loading || fullCode.length < 6}
            className="w-full py-4 rounded-[14px] font-semibold text-white bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[15px]"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              <>
                Join Session
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Hint */}
        <p className="text-center text-[13px] text-[#94A3B8] mt-6">
          The code is displayed on your teacher's screen during a live class
        </p>
      </motion.div>
    </div>
  );
}
