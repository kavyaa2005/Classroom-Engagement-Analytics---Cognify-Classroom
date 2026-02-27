import { Outlet } from "react-router";
import { motion } from "motion/react";
import TopNavbar from "./TopNavbar";
import Breadcrumb from "./Breadcrumb";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background font-['Inter','Poppins',sans-serif]">
      {/* Top Navigation Bar */}
      <TopNavbar />
      
      {/* Breadcrumb Navigation */}
      <div className="pt-[80px]">
        <Breadcrumb />
      </div>
      
      {/* Main Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-screen"
      >
        <Outlet />
      </motion.div>
      
      {/* Footer */}
      <footer className="py-8 px-8 lg:px-20 text-center border-t border-border bg-card">
        <p className="text-sm text-[#64748B] mb-1">
          Your engagement data is used to support your learning.
        </p>
        <p className="text-sm font-semibold text-primary">
          Improving Learning Through Insights
        </p>
      </footer>
    </div>
  );
}