
import { axiosInstance } from "@/lib/axios";

export const adminService = {
  login: async (data: { email: string; password: string }) => {
    const res = await axiosInstance.post("/admin/login", data);
    return res.data;
  },

  logout: async () => {
    await axiosInstance.post("/admin/logout");
  },
};
