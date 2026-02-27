import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const BASE_URL = "http://localhost:5000";
const TOKEN_KEY = "engageai_admin_token";

// ─── Storage helpers ───────────────────────────────────────────────────────────

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = (): void => localStorage.removeItem(TOKEN_KEY);

// ─── Axios instance ───────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT on every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear token and redirect to login
api.interceptors.response.use(
  (response: any) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ─── API Functions ────────────────────────────────────────────────────────────

export const adminAPI = {
  // Dashboard
  getDashboard: () => api.get("/api/analytics/dashboard/admin"),

  // Users
  getStudents: () => api.get("/api/users/students"),
  getTeachers: () => api.get("/api/users/teachers"),
  createTeacher: (data: { name: string; email: string; password: string; subject?: string }) =>
    api.post("/api/users/teacher", data),
  toggleUser: (userId: string) => api.patch(`/api/users/${userId}/toggle`),
  deleteUser: (userId: string) => api.delete(`/api/users/${userId}`),

  // Sessions
  getLiveSessions: () => api.get("/api/session/live"),

  // Analytics
  getClassAnalytics: (classroomId: string) => api.get(`/api/analytics/class/${classroomId}`),
  getSessionAnalytics: (sessionId: string) => api.get(`/api/analytics/session/${sessionId}`),
  getStudentAnalytics: (studentId: string) => api.get(`/api/analytics/student/${studentId}`),

  // AI Model status
  getAIStatus: () => api.get("/api/analytics/ai-status"),
};

export default api;
