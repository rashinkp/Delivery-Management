import type { AuthState } from "@/types/auth";
import { create } from "zustand";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isLoading: false,
      isAuthenticated: !!user,
    }),
  setLoading: (isLoading) => set({ isLoading }),
  clearUser: () =>
    set({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    }),
}));
