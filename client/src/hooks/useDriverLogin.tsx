// src/hooks/useDriverLogin.ts
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";

interface LoginCredentials {
  mobile: string;
  password: string;
}

export const useDriverLogin = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await axiosInstance.post("/truck-drivers/login", credentials);
      return res.data;
    },
    onSuccess: async () => {
      // Check auth status after successful login
      await checkAuth();
      navigate("/driver/dashboard", { replace: true });
    },
    onError: (error: any) => {
      console.error("Driver login failed:", error);
      // The error will be available in the mutation's error state
      // We'll handle it in the component
    },
  });
};