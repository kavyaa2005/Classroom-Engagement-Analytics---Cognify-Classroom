import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { motion } from "motion/react";

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div
            className="absolute top-20 -right-20 w-96 h-96 bg-gradient-to-br from-[#2563EB]/10 to-[#0D9488]/10 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-[#10B981]/10 to-[#0D9488]/10 rounded-full blur-3xl"
            animate={{
              x: [0, -30, 0],
              y: [0, 50, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
