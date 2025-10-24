// src/hooks/useAdminLogin.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { adminService } from "@/services/admin.service";
import { useAuthStore } from "@/store/useAuthStore";

export const useAdminLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: adminService.login,
    onSuccess: (data) => {
      console.log(data);
      setUser(data.user || { role: "admin" });
      queryClient.invalidateQueries({ queryKey: ["admin-profile"] });
      navigate("/admin/dashboard");
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};
