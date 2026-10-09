import { create } from "zustand";
import api from "../lib/api";

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  async me() {
    try {
      const { data } = await api.get("/auth/me");
      set({ user: data.user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
  async login(payload) {
    const { data } = await api.post("/auth/login", payload);
    set({ user: data.user });
    return data;
  },
  async register(payload) {
    const { data } = await api.post("/auth/register", payload);
    set({ user: data.user });
    return data;
  },
  async logout() {
    await api.post("/auth/logout");
    set({ user: null });
  },
}));
