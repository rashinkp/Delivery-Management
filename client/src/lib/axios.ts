// src/lib/axios.ts
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isAuthMeCall = error.config?.url?.includes('/auth/me');
      
      if (!currentPath.includes('/login') && !isAuthMeCall) {
        localStorage.removeItem('auth');
        sessionStorage.clear();
        
        // Use window.location for 401 redirects to ensure clean state
        const isAdminRoute = currentPath.startsWith('/admin');
        const loginPath = isAdminRoute ? '/admin/login' : '/driver/login';
        
        // Only redirect if not already on the correct login page
        if (currentPath !== loginPath) {
          window.location.href = loginPath;
        }
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);
