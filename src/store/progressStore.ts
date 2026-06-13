import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProgress, Post, Comment } from "../types";
import { today, uuid, clamp, expToNextLevel } from "../utils/utils";
import { useAuthStore } from "./authStore";

interface ProgressState {
  progressMap: Record<string, UserProgress>;
  posts: Post[];
  _addMinutes: (minutes: number) => void;
  recordWord: (correct: boolean) => void;
  recordQuiz: (correct: boolean) => void;
  recordSpeaking: (minutes: number) => void;
  recordListening: (minutes: number) => void;
  getForCurrent: () => UserProgress;
  addExp: (amount: number) => void;
  // community
  createPost: (topic: string, content: string) => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
}

const emptyProgress = (): UserProgress => ({
  wordsLearned: 0,
  wordCorrect: 0,
  wordTotal: 0,
  quizzesDone: 0,
  quizCorrect: 0,
  quizTotal: 0,
  speakingMinutes: 0,
  listeningMinutes: 0,
  perDay: {},
  moduleScores: { words: 0, grammar: 0, listening: 0, speaking: 0 },
});

const seedPosts: Post[] = [
  {
    id: "seed-1",
    authorId: "system",
    authorName: "LinguaVerse 官方",
    topic: "每日一句",
    content:
      "「The best time to plant a tree was 20 years ago. The second best time is now.」 —— 学语言也一样，从今天开始吧！",
    createdAt: Date.now() - 86_400_000,
    likes: [],
    comments: [],
  },
  {
    id: "seed-2",
    authorId: "system",
    authorName: "学习搭子 Aki",
    topic: "日语学习心得",
    content:
      "每天看一集不带字幕的动漫，坚持两个月，听力明显提升了。分享给同样在学日语的同学们～",
    createdAt: Date.now() - 86_400_000 * 2,
    likes: [],
    comments: [],
  },
];

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progressMap: {},
      posts: seedPosts,

      getForCurrent: () => {
        const id = useAuthStore.getState().currentUserId;
        if (!id) return emptyProgress();
        return get().progressMap[id] ?? emptyProgress();
      },

      _addMinutes: (minutes: number) => {
        const id = useAuthStore.getState().currentUserId;
        if (!id) return;
        const key = today();
        const base = get().progressMap[id] ?? emptyProgress();
        const next: UserProgress = {
          ...base,
          perDay: { ...base.perDay, [key]: (base.perDay[key] ?? 0) + minutes },
        };
        set({ progressMap: { ...get().progressMap, [id]: next } });
        const user = useAuthStore.getState().currentUser();
        if (user && user.lastActive !== key) {
          const y = new Date();
          y.setDate(y.getDate() - 1);
          const yk = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, "0")}-${String(y.getDate()).padStart(2, "0")}`;
          useAuthStore
            .getState()
            .updateUser({ lastActive: key, streak: user.lastActive === yk ? user.streak + 1 : 1 });
        }
      },

      recordWord: (correct) => {
        const id = useAuthStore.getState().currentUserId;
        if (!id) return;
        const base = get().progressMap[id] ?? emptyProgress();
        const newCorrect = base.wordCorrect + (correct ? 1 : 0);
        const newTotal = base.wordTotal + 1;
        const next: UserProgress = {
          ...base,
          wordsLearned: base.wordsLearned + (correct ? 1 : 0),
          wordCorrect: newCorrect,
          wordTotal: newTotal,
          moduleScores: {
            ...base.moduleScores,
            words: clamp(Math.round((newCorrect / newTotal) * 100)),
          },
        };
        set({ progressMap: { ...get().progressMap, [id]: next } });
        get()._addMinutes(1);
        if (correct) get().addExp(5);
      },

      recordQuiz: (correct) => {
        const id = useAuthStore.getState().currentUserId;
        if (!id) return;
        const base = get().progressMap[id] ?? emptyProgress();
        const newCorrect = base.quizCorrect + (correct ? 1 : 0);
        const newTotal = base.quizTotal + 1;
        const next: UserProgress = {
          ...base,
          quizzesDone: base.quizzesDone + 1,
          quizCorrect: newCorrect,
          quizTotal: newTotal,
          moduleScores: {
            ...base.moduleScores,
            grammar: clamp(Math.round((newCorrect / newTotal) * 100)),
          },
        };
        set({ progressMap: { ...get().progressMap, [id]: next } });
        get()._addMinutes(2);
        if (correct) get().addExp(8);
      },

      recordSpeaking: (minutes) => {
        const id = useAuthStore.getState().currentUserId;
        if (!id) return;
        const base = get().progressMap[id] ?? emptyProgress();
        const total = base.speakingMinutes + minutes;
        const next: UserProgress = {
          ...base,
          speakingMinutes: total,
          moduleScores: {
            ...base.moduleScores,
            speaking: clamp(Math.round(base.moduleScores.speaking * 0.85 + minutes * 5)),
          },
        };
        set({ progressMap: { ...get().progressMap, [id]: next } });
        get()._addMinutes(minutes);
        get().addExp(minutes * 3);
      },

      recordListening: (minutes) => {
        const id = useAuthStore.getState().currentUserId;
        if (!id) return;
        const base = get().progressMap[id] ?? emptyProgress();
        const total = base.listeningMinutes + minutes;
        const next: UserProgress = {
          ...base,
          listeningMinutes: total,
          moduleScores: {
            ...base.moduleScores,
            listening: clamp(Math.round(base.moduleScores.listening * 0.85 + minutes * 5)),
          },
        };
        set({ progressMap: { ...get().progressMap, [id]: next } });
        get()._addMinutes(minutes);
        get().addExp(minutes * 3);
      },

      addExp: (amount) => {
        const user = useAuthStore.getState().currentUser();
        if (!user) return;
        let exp = user.exp + amount;
        let level = user.level;
        while (exp >= expToNextLevel(level)) {
          exp -= expToNextLevel(level);
          level += 1;
        }
        useAuthStore.getState().updateUser({ exp, level });
      },

      createPost: (topic, content) => {
        const user = useAuthStore.getState().currentUser();
        if (!user) return;
        const post: Post = {
          id: uuid(),
          authorId: user.id,
          authorName: user.username,
          avatar: user.avatar,
          topic,
          content,
          createdAt: Date.now(),
          likes: [],
          comments: [],
        };
        set({ posts: [post, ...get().posts] });
      },

      toggleLike: (postId) => {
        const user = useAuthStore.getState().currentUser();
        if (!user) return;
        set({
          posts: get().posts.map((p) => {
            if (p.id !== postId) return p;
            const has = p.likes.includes(user.id);
            return {
              ...p,
              likes: has ? p.likes.filter((i) => i !== user.id) : [...p.likes, user.id],
            };
          }),
        });
      },

      addComment: (postId, content) => {
        const user = useAuthStore.getState().currentUser();
        if (!user) return;
        const c: Comment = {
          id: uuid(),
          authorId: user.id,
          authorName: user.username,
          content,
          createdAt: Date.now(),
        };
        set({
          posts: get().posts.map((p) =>
            p.id === postId ? { ...p, comments: [...p.comments, c] } : p
          ),
        });
      },
    }),
    { name: "lv_progress" }
  )
);
