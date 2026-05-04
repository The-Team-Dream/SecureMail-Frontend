import axios from "axios";
import Cookies from "js-cookie";
export const baseURL = "http://localhost:3000";
const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // If sending FormData, let the browser set Content-Type with the correct
    // multipart boundary. Deleting the header here overrides the global default.
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    const isAuthRoute =
      (config.url?.includes("/auth/login") ?? false) ||
      (config.url?.includes("/auth/register") ?? false);

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
