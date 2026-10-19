
import axios from "axios";

const api = axios.create({
  baseURL: (
    import.meta.env.VITE_API_URL ||
    "https://task-flow-vxwq-tawny.vercel.app"
  ).trim().replace(/\/+$/, ""),

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("taskflow-token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
