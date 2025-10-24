// src/lib/axios.ts
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, 
});

// Interceptors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 globally
    if (error.response?.status === 401) {
      // optional: redirect to login or clear state
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);
