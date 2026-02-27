import { useState } from "react";
import { motion } from "motion/react";
import {
  Shield,
  Lock,
  Eye,
  Download,
  Database,
  FileText,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export function PrivacyCompliance() {
  const [faceDataStorage, setFaceDataStorage] = useState(false);
  const [dataRetention, setDataRetention] = useState(30);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);

  const handleDownloadPolicy = () => {
    alert("Downloading Privacy Policy PDF...");
  };

  const handleExportData = () => {
    alert("Exporting user data... This may take a few minutes.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937]">
            Privacy & Compliance
          </h1>
          <p className="text-[#6B7280] mt-1">
            Data protection, privacy policies, and compliance settings
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownloadPolicy}
          className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] text-white rounded-xl hover:bg-[#2563EB] transition-all"
        >
          <Download className="w-4 h-4" />
          Download Policy
        </motion.button>
      </div>

      {/* Compliance Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-6 text-white shadow-lg"
        >
          <CheckCircle2 className="w-10 h-10 mb-3" />
          <p className="text-sm opacity-90">GDPR Compliant</p>
          <p className="text-2xl font-bold mt-2">Active</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl p-6 text-white shadow-lg"
        >
          <Shield className="w-10 h-10 mb-3" />
          <p className="text-sm opacity-90">Data Encryption</p>
          <p className="text-2xl font-bold mt-2">AES-256</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#14B8A6] to-[#0D9488] rounded-xl p-6 text-white shadow-lg"
        >
          <Lock className="w-10 h-10 mb-3" />
          <p className="text-sm opacity-90">Security Audits</p>
          <p className="text-2xl font-bold mt-2">Monthly</p>
        </motion.div>
      </div>

      {/* Data Policy Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-[#3B82F6]" />
          <h2 className="text-xl font-bold text-[#1F2937]">Data Policy</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border-l-4 border-[#3B82F6] rounded-r-xl">
            <h3 className="font-semibold text-[#1F2937] mb-2">
              What Data We Collect
            </h3>
            <ul className="text-sm text-[#6B7280] space-y-1">
              <li>• Classroom engagement metrics (facial expressions, attention)</li>
              <li>• Student attendance records</li>
              <li>• Teacher performance analytics</li>
              <li>• Session timestamps and duration</li>
            </ul>
          </div>

          <div className="p-4 bg-teal-50 border-l-4 border-[#14B8A6] rounded-r-xl">
            <h3 className="font-semibold text-[#1F2937] mb-2">
              How We Use Your Data
            </h3>
            <ul className="text-sm text-[#6B7280] space-y-1">
              <li>• Generate engagement analytics and insights</li>
              <li>• Improve AI model accuracy</li>
              <li>• Provide personalized recommendations</li>
              <li>• Create performance reports</li>
            </ul>
          </div>

          <div className="p-4 bg-emerald-50 border-l-4 border-[#10B981] rounded-r-xl">
            <h3 className="font-semibold text-[#1F2937] mb-2">
              Data Protection
            </h3>
            <ul className="text-sm text-[#6B7280] space-y-1">
              <li>• End-to-end encryption (AES-256)</li>
              <li>• Secure cloud storage with backup redundancy</li>
              <li>• Regular security audits and penetration testing</li>
              <li>• Role-based access control (RBAC)</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Camera & Face Data Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <Eye className="w-6 h-6 text-[#3B82F6]" />
          <h2 className="text-xl font-bold text-[#1F2937]">
            Camera & Face Data Usage
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border-l-4 border-[#F59E0B] rounded-r-xl">
            <div className="flex items-start gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-[#F59E0B] mt-0.5" />
              <div>
                <h3 className="font-semibold text-[#1F2937]">Important Notice</h3>
                <p className="text-sm text-[#6B7280] mt-1">
                  Face data is processed in real-time for engagement detection.
                  By default, facial images are NOT stored permanently. Only
                  anonymized engagement scores are saved.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex-1">
              <p className="font-medium text-[#1F2937]">
                Enable Face Data Storage
              </p>
              <p className="text-sm text-[#6B7280] mt-1">
                Store facial recognition data for improved accuracy (requires
                explicit consent)
              </p>
            </div>
            <button
              onClick={() => setFaceDataStorage(!faceDataStorage)}
              className={`relative w-12 h-6 rounded-full transition-all ${
                faceDataStorage ? "bg-[#EF4444]" : "bg-gray-300"
              }`}
            >
              <motion.div
                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
                animate={{ x: faceDataStorage ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          {faceDataStorage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <p className="text-sm text-red-700">
                ⚠️ Face data storage is enabled. Please ensure you have obtained
                proper consent from all students and comply with local privacy
                regulations (GDPR, COPPA, etc.).
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Data Storage Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-6 h-6 text-[#3B82F6]" />
          <h2 className="text-xl font-bold text-[#1F2937]">
            Data Storage & Retention
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-2">
              Data Retention Period (days)
            </label>
            <select
              value={dataRetention}
              onChange={(e) => setDataRetention(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            >
              <option value={7}>7 Days</option>
              <option value={30}>30 Days</option>
              <option value={90}>90 Days</option>
              <option value={180}>180 Days</option>
              <option value={365}>1 Year</option>
            </select>
            <p className="text-xs text-[#6B7280] mt-2">
              Engagement data will be automatically deleted after {dataRetention}{" "}
              days
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex-1">
              <p className="font-medium text-[#1F2937]">
                Analytics & Performance Tracking
              </p>
              <p className="text-sm text-[#6B7280] mt-1">
                Allow anonymized data for system improvement
              </p>
            </div>
            <button
              onClick={() => setAnalyticsConsent(!analyticsConsent)}
              className={`relative w-12 h-6 rounded-full transition-all ${
                analyticsConsent ? "bg-[#10B981]" : "bg-gray-300"
              }`}
            >
              <motion.div
                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
                animate={{ x: analyticsConsent ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Consent Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-[#3B82F6]" />
          <h2 className="text-xl font-bold text-[#1F2937]">
            Consent Management
          </h2>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#1F2937]">
                  Student Consent Forms
                </p>
                <p className="text-sm text-[#6B7280]">1,180 / 1,250 collected</p>
              </div>
              <span className="text-lg font-bold text-[#10B981]">94%</span>
            </div>
            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#10B981] to-[#14B8A6]"
                initial={{ width: 0 }}
                animate={{ width: "94%" }}
                transition={{ duration: 1, delay: 0.7 }}
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#1F2937]">
                  Parent/Guardian Consent
                </p>
                <p className="text-sm text-[#6B7280]">1,150 / 1,250 collected</p>
              </div>
              <span className="text-lg font-bold text-[#F59E0B]">92%</span>
            </div>
            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]"
                initial={{ width: 0 }}
                animate={{ width: "92%" }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExportData}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#10B981] text-white rounded-xl hover:bg-[#059669] transition-all"
        >
          <Download className="w-5 h-5" />
          Export All Data
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownloadPolicy}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
        >
          <FileText className="w-5 h-5" />
          View Full Policy
        </motion.button>
      </motion.div>
    </div>
  );
}
