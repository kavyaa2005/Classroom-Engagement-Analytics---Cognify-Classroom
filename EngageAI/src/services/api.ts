import axios from "axios";

const BASE_URL = "http://localhost:5000";
const TOKEN_KEY = "engageai_token";

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
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401 (expired/invalid token), clear storage and redirect to login.
// Skip auth endpoints — a failed login also returns 401 but should show
// the error message in the form, not redirect.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? "";
    const isAuthEndpoint = url.includes("/api/auth/");
    if (error.response?.status === 401 && !isAuthEndpoint) {
      removeToken();
      localStorage.removeItem("engageai_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
