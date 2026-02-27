import { motion } from "motion/react";
import { Quote } from "lucide-react";
import { useState, useEffect } from "react";

const quotes = [
  {
    text: "Focus is the art of knowing what to ignore.",
    author: "Unknown",
  },
  {
    text: "The secret of change is to focus all of your energy not on fighting the old, but on building the new.",
    author: "Socrates",
  },
  {
    text: "Concentration is the secret of strength.",
    author: "Ralph Waldo Emerson",
  },
  {
    text: "Where focus goes, energy flows.",
    author: "Tony Robbins",
  },
  {
    text: "The successful warrior is the average person, with laser-like focus.",
    author: "Bruce Lee",
  },
];

export default function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);
  }, []);

  return (
    <motion.div
      className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-[20px] p-6 shadow-[0_15px_40px_rgba(59,130,246,0.3)] text-white relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative elements */}
      <motion.div
        className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -left-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full"
        animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10">
        <Quote className="w-8 h-8 mb-4 opacity-50" />
        
        <motion.blockquote
          className="text-lg font-medium mb-3 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          "{currentQuote.text}"
        </motion.blockquote>
        
        <motion.p
          className="text-sm opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.4 }}
        >
          — {currentQuote.author}
        </motion.p>
      </div>
    </motion.div>
  );
}
