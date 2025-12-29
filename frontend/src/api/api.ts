import axios, { type InternalAxiosRequestConfig } from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Rate limits
const MIN_DELAY = 500; // 500ms delay = Max 2 requests per second
let lastRequestTime = 0;

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const now = Date.now();
    const waitTime = Math.max(0, lastRequestTime + MIN_DELAY - now);

    lastRequestTime = now + waitTime;

    // Pause if needed
    if (waitTime > 0) {
      await sleep(waitTime);
    }
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (token && token != undefined) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response, // If no error just return
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.debug("Trying to get new access token");
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        if (!refreshToken) {
          throw new Error("No refresh token, logout");
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/user/token/refresh/`,
          { refresh: refreshToken }
        );

        // Save the new access token
        const newAccessToken = response.data.access;
        localStorage.setItem(ACCESS_TOKEN, newAccessToken);

        // Update the original request with the new token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, force logout
        console.error("Token refresh failed:", refreshError);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
