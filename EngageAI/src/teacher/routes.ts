import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./components/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import { LiveClassMonitoring } from "./pages/LiveClassMonitoring";
import { EngagementReports } from "./pages/EngagementReports";
import { StudentInsights } from "./pages/StudentInsights";
import { AISuggestions } from "./pages/AISuggestions";
import { PastClasses } from "./pages/PastClasses";
import { Settings } from "./pages/Settings";
import { HelpSupport } from "./pages/HelpSupport";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "live-monitoring", Component: LiveClassMonitoring },
      { path: "reports", Component: EngagementReports },
      { path: "students", Component: StudentInsights },
      { path: "ai-suggestions", Component: AISuggestions },
      { path: "past-classes", Component: PastClasses },
      { path: "settings", Component: Settings },
      { path: "help", Component: HelpSupport },
    ],
  },
]);
