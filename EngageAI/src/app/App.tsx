import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { AuthProvider } from "../auth/AuthContext";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";

// Admin
import { Layout as AdminLayout } from "../admin/components/Layout";
import { Dashboard as AdminDashboard } from "../admin/pages/Dashboard";
import { ManageTeachers } from "../admin/pages/ManageTeachers";
import { ManageStudents } from "../admin/pages/ManageStudents";
import { LiveMonitoring } from "../admin/pages/LiveMonitoring";
import { ReportsAnalytics } from "../admin/pages/ReportsAnalytics";
import { AIModelStatus } from "../admin/pages/AIModelStatus";
import { Notifications } from "../admin/pages/Notifications";
import { Settings as AdminSettings } from "../admin/pages/Settings";
import { PrivacyCompliance } from "../admin/pages/PrivacyCompliance";

// Teacher
import { DashboardLayout as TeacherLayout } from "../teacher/components/DashboardLayout";
import { Dashboard as TeacherDashboard } from "../teacher/pages/Dashboard";
import { LiveClassMonitoring } from "../teacher/pages/LiveClassMonitoring";
import { EngagementReports } from "../teacher/pages/EngagementReports";
import { StudentInsights } from "../teacher/pages/StudentInsights";
import { AISuggestions } from "../teacher/pages/AISuggestions";
import { PastClasses } from "../teacher/pages/PastClasses";
import { Settings as TeacherSettings } from "../teacher/pages/Settings";
import { HelpSupport } from "../teacher/pages/HelpSupport";

// Student
import StudentLayout from "../student/components/Layout";
import StudentDashboard from "../student/pages/Dashboard";
import ClassPerformance from "../student/pages/ClassPerformance";
import EngagementHistory from "../student/pages/EngagementHistory";
import TeacherFeedback from "../student/pages/TeacherFeedback";
import ClassInsights from "../student/pages/ClassInsights";
import StudentSettings from "../student/pages/Settings";
import JoinSession from "../student/pages/JoinSession";
import LiveSession from "../student/pages/LiveSession";

const router = createBrowserRouter([
    { path: "/", element: <Navigate to="/login" replace /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },

    /* ── Admin ── */
    {
        path: "/admin",
        element: (
            <ProtectedRoute role="admin">
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <AdminDashboard /> },
            { path: "teachers", element: <ManageTeachers /> },
            { path: "students", element: <ManageStudents /> },
            { path: "live-monitoring", element: <LiveMonitoring /> },
            { path: "reports", element: <ReportsAnalytics /> },
            { path: "ai-model", element: <AIModelStatus /> },
            { path: "notifications", element: <Notifications /> },
            { path: "settings", element: <AdminSettings /> },
            { path: "privacy", element: <PrivacyCompliance /> },
        ],
    },

    /* ── Teacher ── */
    {
        path: "/teacher",
        element: (
            <ProtectedRoute role="teacher">
                <TeacherLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <TeacherDashboard /> },
            { path: "live-monitoring", element: <LiveClassMonitoring /> },
            { path: "reports", element: <EngagementReports /> },
            { path: "students", element: <StudentInsights /> },
            { path: "ai-suggestions", element: <AISuggestions /> },
            { path: "past-classes", element: <PastClasses /> },
            { path: "settings", element: <TeacherSettings /> },
            { path: "help", element: <HelpSupport /> },
        ],
    },

    /* ── Student ── */
    {
        path: "/student",
        element: (
            <ProtectedRoute role="student">
                <StudentLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <StudentDashboard /> },
            { path: "class-performance", element: <ClassPerformance /> },
            { path: "engagement-history", element: <EngagementHistory /> },
            { path: "teacher-feedback", element: <TeacherFeedback /> },
            { path: "class-insights", element: <ClassInsights /> },
            { path: "settings", element: <StudentSettings /> },
        ],
    },
    /* Student pages without layout (full-screen) */
    {
        path: "/student/join",
        element: (
            <ProtectedRoute role="student">
                <JoinSession />
            </ProtectedRoute>
        ),
    },
    {
        path: "/student/live-session/:sessionId",
        element: (
            <ProtectedRoute role="student">
                <LiveSession />
            </ProtectedRoute>
        ),
    },
]);

export default function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}
