import { createBrowserRouter } from "react-router";
import Dashboard from "./pages/Dashboard";
import ClassPerformance from "./pages/ClassPerformance";
import EngagementHistory from "./pages/EngagementHistory";
import TeacherFeedback from "./pages/TeacherFeedback";
import ClassInsights from "./pages/ClassInsights";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "class-performance", Component: ClassPerformance },
      { path: "engagement-history", Component: EngagementHistory },
      { path: "teacher-feedback", Component: TeacherFeedback },
      { path: "class-insights", Component: ClassInsights },
      { path: "settings", Component: Settings },
    ],
  },
]);