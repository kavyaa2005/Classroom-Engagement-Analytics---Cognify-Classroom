import { RouterProvider } from 'react-router';
import { router } from './routes';

/**
 * 📊 EngageAI Student Dashboard
 * 
 * A professional, modern, interactive Student Dashboard UI for an 
 * AI-powered Classroom Engagement Analytics System.
 * 
 * Features:
 * - 📈 Personal Performance Analytics
 * - 👥 Class Performance Comparison
 * - 📊 Engagement History & Trends
 * - 💬 Teacher Feedback & AI Insights
 * - 🎯 Class-wide Insights & Analytics
 * - 🔒 Privacy-Focused Settings
 * - 📱 Fully Responsive Design
 * - 🎨 Professional SaaS-Level Animations
 * 
 * Design Philosophy:
 * - Professional and clean
 * - Motivational and supportive
 * - Data-driven and transparent
 * - Trustworthy and ethical
 * 
 * Color System:
 * - Primary: #2563EB (Deep Blue)
 * - Secondary: #0D9488 (Teal)
 * - Success: #10B981 (Emerald)
 * - Warning: #F59E0B (Amber)
 * - Attention: #F87171 (Soft Coral)
 * 
 * Aligned with Admin & Teacher Dashboards
 */
function App() {
  return <RouterProvider router={router} />;
}

export default App;