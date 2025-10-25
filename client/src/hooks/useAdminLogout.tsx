import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";

export const useAdminLogout = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  return useMutation({
    mutationFn: async () => {
      return await authService.logout();
    },
    onSuccess: async () => {
      await checkAuth();

      navigate("/admin/login", { replace: true });
    },
    onError: (error) => {
      console.error("Admin logout failed:", error);
    },
  });
};
