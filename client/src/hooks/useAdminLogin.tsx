// src/hooks/useAdminLogin.ts
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAdminLogin = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await axiosInstance.post("/admin/login", credentials);
      return res.data;
    },
    onSuccess: async () => {
      // Check auth status after successful login
      await checkAuth();
      navigate("/admin/dashboard", { replace: true });
    },
    onError: (error: any) => {
      console.error("Admin login failed:", error);
    },
  });
};
