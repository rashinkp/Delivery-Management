// src/services/auth.service.ts
import { axiosInstance } from "@/lib/axios";


export const authService = {

  getMe: async () => {
    const res = await axiosInstance.get("/auth/me");
    return res.data.data;
  },

  logout: async () => {
    const res = await axiosInstance.post("/auth/logout");
    return res.data;
  },
};
