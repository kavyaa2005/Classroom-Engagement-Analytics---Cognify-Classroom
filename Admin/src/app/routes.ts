import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { ManageTeachers } from "./pages/ManageTeachers";
import { ManageStudents } from "./pages/ManageStudents";
import { LiveMonitoring } from "./pages/LiveMonitoring";
import { ReportsAnalytics } from "./pages/ReportsAnalytics";
import { AIModelStatus } from "./pages/AIModelStatus";
import { Notifications } from "./pages/Notifications";
import { Settings } from "./pages/Settings";
import { PrivacyCompliance } from "./pages/PrivacyCompliance";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "teachers", Component: ManageTeachers },
      { path: "students", Component: ManageStudents },
      { path: "live-monitoring", Component: LiveMonitoring },
      { path: "reports", Component: ReportsAnalytics },
      { path: "ai-model", Component: AIModelStatus },
      { path: "notifications", Component: Notifications },
      { path: "settings", Component: Settings },
      { path: "privacy", Component: PrivacyCompliance },
    ],
  },
]);
