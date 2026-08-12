import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials is NOT set — we use JWT in Authorization header, not cookies.
  // Setting it to true requires a specific CORS origin (not *) and causes preflight failures.
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthPage = ["/login", "/register"].includes(window.location.pathname);
      if (!isAuthPage) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
