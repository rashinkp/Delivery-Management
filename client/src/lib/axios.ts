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
    // Handle 401 Unauthorized (authentication errors)
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isAuthMeCall = error.config?.url?.includes('/auth/me');
      
      if (!currentPath.includes('/login') && !isAuthMeCall) {
        localStorage.removeItem('auth');
        sessionStorage.clear();
        localStorage.removeItem('auth-blocked-message');
        
        // Use window.location for 401 redirects to ensure clean state
        const isAdminRoute = currentPath.startsWith('/admin');
        const loginPath = isAdminRoute ? '/admin/login' : '/driver/login';
        
        // Only redirect if not already on the correct login page
        if (currentPath !== loginPath) {
          window.location.href = loginPath;
        }
      }
    }
    
    // Handle 403 Forbidden (blocked driver)
    if (error.response?.status === 403) {
      const responseData = error.response?.data;
      const errorMessageRaw =
        responseData?.message ||
        responseData?.error ||
        (Array.isArray(responseData?.message)
          ? responseData?.message[0]
          : undefined);
      const errorMessage =
        typeof errorMessageRaw === 'string'
          ? errorMessageRaw
          : '';
      if (
        errorMessage &&
        (
          errorMessage.toLowerCase().includes('blocked') ||
          errorMessage.toLowerCase().includes('contact the administrator') ||
          errorMessage.toLowerCase().includes('no longer active') ||
          errorMessage.toLowerCase().includes('removed')
        )
      ) {
        // Persist message so login page can display it
        localStorage.setItem('auth-blocked-message', errorMessage);
        localStorage.removeItem('auth');
        sessionStorage.clear();

        try {
          await axiosInstance.post('/auth/logout');
        } catch {
          // Ignore logout errors
        }

        const loginPath = '/driver/login';
        if (window.location.pathname !== loginPath) {
          window.location.href = `${loginPath}?blocked=1`;
        }
        return Promise.reject(error);
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);
