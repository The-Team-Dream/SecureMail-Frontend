import axios from "axios";
import Cookies from "js-cookie";
export const baseURL = "http://localhost:3000";
const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const isAuthRoute =
      (config.url?.includes("/api/auth/login") ?? false) ||
      (config.url?.includes("/api/auth/register") ?? false);

    if (!isAuthRoute) {
      const token = Cookies?.get("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: Error) => {
    return Promise.reject(new Error(error?.message));
  },
);

export default axiosInstance;
