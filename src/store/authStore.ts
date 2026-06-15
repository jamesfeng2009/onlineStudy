import { create } from "zustand";
import type { UserResp } from "../lib/api";
import { api } from "../lib/api";

type AuthStatus = "idle" | "loading" | "logged";

interface AuthState {
  token: string | null;
  user: UserResp | null;
  status: AuthStatus;
  register: (input: { email: string; password: string; username: string; language: string; uiLanguage?: string; nativeLanguage?: string }) => Promise<{ ok: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  refreshMe: () => Promise<{ ok: boolean; error?: string }>;
  updateLanguage: (lang: string) => Promise<{ ok: boolean; error?: string }>;
  updateGoal: (goal: number) => Promise<{ ok: boolean; error?: string }>;
  updateProfile: (patch: { username?: string; avatar?: string; uiLanguage?: string; nativeLanguage?: string; targetLanguage?: string; goalMinutesPerDay?: number }) => Promise<{ ok: boolean; error?: string }>;
  bootstrap: () => Promise<void>;
}

function readToken(): string | null {
  try {
    return localStorage.getItem("lv_token");
  } catch {
    return null;
  }
}

function writeToken(token: string | null) {
  try {
    if (token) localStorage.setItem("lv_token", token);
    else localStorage.removeItem("lv_token");
  } catch {
    /* ignore */
  }
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  token: readToken(),
  user: null,
  status: "idle",

  async bootstrap() {
    const existing = readToken();
    if (!existing) return;
    try {
      set({ status: "loading" });
      const res = await api.me();
      set({ user: res.user, status: "logged" });
    } catch {
      writeToken(null);
      set({ token: null, user: null, status: "idle" });
    }
  },

  async register({ email, password, username, language, uiLanguage, nativeLanguage }) {
    try {
      set({ status: "loading" });
      const res = await api.register({ email, password, username, language, uiLanguage, nativeLanguage });
      writeToken(res.token);
      set({ token: res.token, user: res.user, status: "logged" });
      return { ok: true };
    } catch (err: unknown) {
      const s = get().status;
      if (s === "logged") set({ status: "idle" });
      return { ok: false, error: (err as Error).message };
    }
  },

  async login(email, password) {
    try {
      set({ status: "loading" });
      const res = await api.login({ email, password });
      writeToken(res.token);
      set({ token: res.token, user: res.user, status: "logged" });
      return { ok: true };
    } catch (err: unknown) {
      const s = get().status;
      if (s === "logged") set({ status: "idle" });
      return { ok: false, error: (err as Error).message };
    }
  },

  logout() {
    writeToken(null);
    set({ token: null, user: null, status: "idle" });
  },

  async refreshMe() {
    if (!readToken()) return { ok: false, error: "未登录" };
    try {
      set({ status: "loading" });
      const res = await api.me();
      set({ user: res.user, status: "logged" });
      return { ok: true };
    } catch (err: unknown) {
      set({ status: "idle" });
      return { ok: false, error: (err as Error).message };
    }
  },

  async updateLanguage(lang) {
    if (!readToken()) return { ok: false, error: "未登录" };
    try {
      const res = await api.updateMe({ targetLanguage: lang });
      set({ user: res.user });
      return { ok: true };
    } catch (err: unknown) {
      return { ok: false, error: (err as Error).message };
    }
  },

  async updateGoal(goal) {
    if (!readToken()) return { ok: false, error: "未登录" };
    try {
      const res = await api.updateMe({ goalMinutesPerDay: Number(goal) });
      set({ user: res.user });
      return { ok: true };
    } catch (err: unknown) {
      return { ok: false, error: (err as Error).message };
    }
  },

  async updateProfile(patch) {
    if (!readToken()) return { ok: false, error: "未登录" };
    try {
      const res = await api.updateMe(patch);
      set({ user: res.user });
      return { ok: true };
    } catch (err: unknown) {
      return { ok: false, error: (err as Error).message };
    }
  },
}));
