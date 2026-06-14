const API_BASE = (import.meta as any).env?.VITE_API_URL?.replace(/\/$/, "") ?? "";

function buildUrl(path: string): string {
  return API_BASE ? `${API_BASE}${path}` : path;
}

function getToken(): string | null {
  try {
    return localStorage.getItem("lv_token");
  } catch {
    return null;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  needAuth = false
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (needAuth) {
    const t = getToken();
    if (t) headers["Authorization"] = `Bearer ${t}`;
  }
  const res = await fetch(buildUrl(path), { ...options, headers });
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    /* ignore */
  }
  if (!res.ok) {
    const msg = data?.error ?? data?.message ?? `请求失败 (${res.status})`;
    throw new Error(msg);
  }
  if (data === null || data === undefined) {
    throw new Error("服务器返回空数据");
  }
  return data as T;
}

// ====== Shared Types ======
export interface UserResp {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  level: number;
  exp: number;
  streak: number;
  lastActive: string;
  targetLanguage: string;
  createdAt: string;
  role: string;
  goalMinutesPerDay: number;
}

export interface ProgressResp {
  wordsLearned: number;
  wordCorrect: number;
  wordTotal: number;
  quizzesDone: number;
  quizCorrect: number;
  quizTotal: number;
  speakingMinutes: number;
  listeningMinutes: number;
  perDay: Record<string, number> | null;
  moduleScores: Record<string, number> | null;
  streak: number;
  level: number;
  exp: number;
  goalMinutesPerDay: number;
}

export interface CourseResp {
  id: string;
  title: string;
  language: string;
  level: string;
  levelGroup: "beginner" | "intermediate" | "advanced";
  description: string;
  lessons: number;
  minutes: number;
  cover: string;
  tags: string[];
  vipOnly: boolean;
}

export interface WordResp {
  id: string;
  word: string;
  translation: string;
  phonetic?: string;
  exampleSentence: string;
  language: string;
  level: string;
}

export interface CommentResp {
  id: string;
  authorId: string;
  authorName: string;
  avatar?: string;
  content: string;
  createdAt: string;
}

export interface PostResp {
  id: string;
  authorId: string;
  authorName: string;
  avatar?: string;
  topic: string;
  content: string;
  createdAt: string;
  likeCount: number;
  likedByMe: boolean;
  comments: CommentResp[];
}

// ====== API Methods ======
export const api = {
  // --- Auth ---
  register(data: { email: string; password: string; username: string; language: string }) {
    return request<{ token: string; user: UserResp }>(
      "/api/auth/register",
      { method: "POST", body: JSON.stringify(data) },
      false
    );
  },

  login(data: { email: string; password: string }) {
    return request<{ token: string; user: UserResp }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify(data) },
      false
    );
  },

  me() {
    return request<{ user: UserResp }>("/api/auth/me", { method: "GET" }, true);
  },

  updateMe(patch: {
    username?: string;
    avatar?: string;
    targetLanguage?: string;
    goalMinutesPerDay?: number;
  }) {
    return request<{ user: UserResp }>(
      "/api/auth/me",
      { method: "PATCH", body: JSON.stringify(patch) },
      true
    );
  },

  // --- Courses / Words ---
  courses(params?: { language?: string; levelGroup?: string; vipOnly?: boolean }) {
    const q = new URLSearchParams();
    if (params?.language) q.set("language", params.language);
    if (params?.levelGroup) q.set("levelGroup", params.levelGroup);
    if (params?.vipOnly !== undefined) q.set("vipOnly", String(params.vipOnly));
    const qs = q.toString();
    return request<CourseResp[]>(`/api/courses${qs ? "?" + qs : ""}`, { method: "GET" }, false);
  },

  words(params?: { language?: string; level?: string }) {
    const q = new URLSearchParams();
    if (params?.language) q.set("language", params.language);
    if (params?.level) q.set("level", params.level);
    const qs = q.toString();
    return request<WordResp[]>(`/api/words${qs ? "?" + qs : ""}`, { method: "GET" }, false);
  },

  // --- Progress ---
  progressMe() {
    return request<ProgressResp>("/api/progress/me", { method: "GET" }, true);
  },

  recordWord(correct: boolean, language: string) {
    return request<ProgressResp>(
      "/api/progress/record-word",
      { method: "POST", body: JSON.stringify({ correct, language }) },
      true
    );
  },

  recordQuiz(correct: boolean, language: string) {
    return request<ProgressResp>(
      "/api/progress/record-quiz",
      { method: "POST", body: JSON.stringify({ correct, language }) },
      true
    );
  },

  recordSpeaking(minutes: number, language: string) {
    return request<ProgressResp>(
      "/api/progress/record-speaking",
      { method: "POST", body: JSON.stringify({ minutes, language }) },
      true
    );
  },

  recordListening(minutes: number, language: string) {
    return request<ProgressResp>(
      "/api/progress/record-listening",
      { method: "POST", body: JSON.stringify({ minutes, language }) },
      true
    );
  },

  updateProgress(patch: { goalMinutesPerDay?: number; targetLanguage?: string }) {
    return request<ProgressResp>(
      "/api/progress/me",
      { method: "PATCH", body: JSON.stringify(patch) },
      true
    );
  },

  // --- Community ---
  posts(topic?: string) {
    const qs = topic ? `?topic=${encodeURIComponent(topic)}` : "";
    return request<PostResp[]>(`/api/posts${qs}`, { method: "GET" }, true);
  },

  createPost(topic: string, content: string) {
    return request<PostResp>(
      "/api/posts",
      { method: "POST", body: JSON.stringify({ topic, content }) },
      true
    );
  },

  toggleLike(postId: string) {
    return request<{ id: string; likes: number; liked: boolean }>(
      `/api/posts/${postId}/like`,
      { method: "POST" },
      true
    );
  },

  addComment(postId: string, content: string) {
    return request<CommentResp>(
      `/api/posts/${postId}/comment`,
      { method: "POST", body: JSON.stringify({ content }) },
      true
    );
  },

  // --- Stripe ---
  checkoutSession(tier: "basic" | "vip") {
    return request<{ sessionId: string; url: string }>(
      "/api/stripe/checkout-session",
      { method: "POST", body: JSON.stringify({ tier }) },
      true
    );
  },

  currentPlan() {
    return request<{
      role: string;
      tier: string;
      status: string;
      stripeSubscriptionId?: string;
      currentPeriodStart?: string;
      currentPeriodEnd?: string;
      cancelAtPeriodEnd: boolean;
      publishableKey: string;
    }>("/api/stripe/current-plan", { method: "GET" }, true);
  },
};
