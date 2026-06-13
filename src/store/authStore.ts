import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Language } from "../types";
import { today, uuid } from "../utils/utils";

interface AuthState {
  users: User[];
  currentUserId: string | null;
  register: (input: { username: string; email: string; password: string; language: Language }) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  setLanguage: (lang: Language) => void;
  updateUser: (patch: Partial<User>) => void;
  currentUser: () => User | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUserId: null,

      register: ({ username, email, password, language }) => {
        const { users } = get();
        if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
          return { ok: false, error: "该邮箱已注册" };
        }
        const user: User = {
          id: uuid(),
          username,
          email,
          password,
          level: 1,
          exp: 0,
          streak: 0,
          lastActive: today(),
          targetLanguage: language,
          createdAt: today(),
          goalMinutesPerDay: 30,
        };
        set({ users: [...users, user], currentUserId: user.id });
        return { ok: true };
      },

      login: (email, password) => {
        const { users } = get();
        const user = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (!user) return { ok: false, error: "邮箱或密码不正确" };
        // 更新 lastActive / streak
        const td = today();
        let streak = user.streak;
        if (user.lastActive !== td) {
          const yesterday = new Date(Date.now() - 86_400_000);
          const y = yesterday.getFullYear();
          const m = String(yesterday.getMonth() + 1).padStart(2, "0");
          const d = String(yesterday.getDate()).padStart(2, "0");
          if (user.lastActive === `${y}-${m}-${d}`) streak += 1;
          else streak = 1;
        }
        const updated = { ...user, lastActive: td, streak };
        set({
          users: users.map((u) => (u.id === user.id ? updated : u)),
          currentUserId: user.id,
        });
        return { ok: true };
      },

      logout: () => set({ currentUserId: null }),

      setLanguage: (lang) => {
        const { currentUserId, users } = get();
        if (!currentUserId) return;
        set({
          users: users.map((u) =>
            u.id === currentUserId ? { ...u, targetLanguage: lang } : u
          ),
        });
      },

      updateUser: (patch) => {
        const { currentUserId, users } = get();
        if (!currentUserId) return;
        set({
          users: users.map((u) => (u.id === currentUserId ? { ...u, ...patch } : u)),
        });
      },

      currentUser: () => {
        const { users, currentUserId } = get();
        return users.find((u) => u.id === currentUserId) ?? null;
      },
    }),
    { name: "lv_auth" }
  )
);
