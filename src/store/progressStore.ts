import { create } from "zustand";
import type { ProgressResp, PostResp } from "../lib/api";
import { api } from "../lib/api";

const emptyProgress: ProgressResp = {
  wordsLearned: 0,
  wordCorrect: 0,
  wordTotal: 0,
  quizzesDone: 0,
  quizCorrect: 0,
  quizTotal: 0,
  speakingMinutes: 0,
  listeningMinutes: 0,
  perDay: {},
  moduleScores: {},
  streak: 0,
  level: 1,
  exp: 0,
  goalMinutesPerDay: 30,
};

interface ProgressState {
  progress: ProgressResp | null;
  progressLoading: boolean;
  progressError: string | null;
  posts: PostResp[];
  postsLoading: boolean;
  postsError: string | null;
  refresh: () => Promise<{ ok: boolean; error?: string }>;
  refreshPosts: (topic?: string) => Promise<{ ok: boolean; error?: string }>;
  recordWord: (correct: boolean, language: string) => Promise<{ ok: boolean; error?: string }>;
  recordQuiz: (correct: boolean, language: string) => Promise<{ ok: boolean; error?: string }>;
  recordSpeaking: (minutes: number, language: string) => Promise<{ ok: boolean; error?: string }>;
  recordListening: (minutes: number, language: string) => Promise<{ ok: boolean; error?: string }>;
  createPost: (topic: string, content: string) => Promise<{ ok: boolean; error?: string }>;
  toggleLike: (postId: string) => Promise<{ ok: boolean; error?: string }>;
  addComment: (postId: string, content: string) => Promise<{ ok: boolean; error?: string }>;
  getForCurrent: () => ProgressResp;
}

export const useProgressStore = create<ProgressState>()((set, get) => ({
  progress: null,
  progressLoading: false,
  progressError: null,
  posts: [],
  postsLoading: false,
  postsError: null,

  getForCurrent: () => get().progress ?? emptyProgress,

  async refresh() {
    try {
      set({ progressLoading: true, progressError: null });
      const data = await api.progressMe();
      set({ progress: data, progressLoading: false });
      return { ok: true };
    } catch (err: unknown) {
      set({ progressLoading: false, progressError: (err as Error).message });
      return { ok: false, error: (err as Error).message };
    }
  },

  async refreshPosts(topic) {
    try {
      set({ postsLoading: true, postsError: null });
      const data = await api.posts(topic);
      set({ posts: data, postsLoading: false });
      return { ok: true };
    } catch (err: unknown) {
      set({ postsLoading: false, postsError: (err as Error).message });
      return { ok: false, error: (err as Error).message };
    }
  },

  async recordWord(correct, language) {
    try {
      const data = await api.recordWord(correct, language);
      set({ progress: data });
      return { ok: true };
    } catch (err: unknown) {
      return { ok: false, error: (err as Error).message };
    }
  },

  async recordQuiz(correct, language) {
    try {
      const data = await api.recordQuiz(correct, language);
      set({ progress: data });
      return { ok: true };
    } catch (err: unknown) {
      return { ok: false, error: (err as Error).message };
    }
  },

  async recordSpeaking(minutes, language) {
    try {
      const data = await api.recordSpeaking(minutes, language);
      set({ progress: data });
      return { ok: true };
    } catch (err: unknown) {
      return { ok: false, error: (err as Error).message };
    }
  },

  async recordListening(minutes, language) {
    try {
      const data = await api.recordListening(minutes, language);
      set({ progress: data });
      return { ok: true };
    } catch (err: unknown) {
      return { ok: false, error: (err as Error).message };
    }
  },

  async createPost(topic, content) {
    try {
      const data = await api.createPost(topic, content);
      set({ posts: [data, ...get().posts] });
      return { ok: true };
    } catch (err: unknown) {
      return { ok: false, error: (err as Error).message };
    }
  },

  async toggleLike(postId) {
    try {
      const result = await api.toggleLike(postId);
      const next = get().posts.map((p) => {
        if (p.id !== postId) return p;
        return { ...p, likedByMe: result.likedByMe, likeCount: result.likeCount };
      });
      set({ posts: next });
      return { ok: true };
    } catch (err: unknown) {
      return { ok: false, error: (err as Error).message };
    }
  },

  async addComment(postId, content) {
    try {
      const comment = await api.addComment(postId, content);
      const next = get().posts.map((p) => {
        if (p.id !== postId) return p;
        return { ...p, comments: [...p.comments, comment] };
      });
      set({ posts: next });
      return { ok: true };
    } catch (err: unknown) {
      return { ok: false, error: (err as Error).message };
    }
  },
}));
