import { getToken } from "./auth";

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

function buildUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = API_BASE.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export interface ApiResponse<T = unknown> {
  code: string;
  message: string;
  data: T;
}

async function request<T = unknown>(
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
  let body: ApiResponse<T> | null = null;
  try {
    body = (await res.json()) as ApiResponse<T>;
  } catch {
    /* ignore */
  }

  if (!res.ok || body?.code !== "OK") {
    let msg = body?.message ?? null;
    if (!msg) {
      if (res.status === 404) msg = "接口不存在（服务未部署）";
      else if (res.status === 500) msg = "服务器内部错误";
      else if (res.status === 401) msg = "未登录或登录已过期";
      else if (res.status === 403) msg = "没有权限执行该操作";
      else if (res.status === 409) msg = "资源冲突";
      else if (res.status === 400) msg = "参数有误";
      else msg = `请求失败 (${res.status})`;
    }
    throw new Error(msg);
  }

  if (body === null) {
    throw new Error("服务器返回空数据");
  }
  return body.data as T;
}

// ====== Auth ======
export async function register(data: {
  email: string;
  password: string;
  username: string;
  language: string;
  uiLanguage?: string;
  nativeLanguage?: string;
}): Promise<{ token: string; user: Record<string, unknown> }> {
  return request("/auth/register", { method: "POST", body: JSON.stringify(data) });
}

export async function login(data: { email: string; password: string }): Promise<{
  token: string;
  user: Record<string, unknown>;
}> {
  return request("/auth/login", { method: "POST", body: JSON.stringify(data) });
}

export async function logout(): Promise<{ ok: boolean }> {
  return request("/auth/logout", { method: "POST" });
}

export async function getMe(): Promise<{ user: Record<string, unknown> }> {
  return request("/auth/me", {}, true);
}

export async function updateMe(data: {
  username?: string;
  avatar?: string;
  uiLanguage?: string;
  nativeLanguage?: string;
  targetLanguage?: string;
  goalMinutesPerDay?: number;
}): Promise<{ user: Record<string, unknown> }> {
  return request("/auth/me", { method: "PATCH", body: JSON.stringify(data) }, true);
}

// ====== Courses ======
export async function getCourses(params?: { language?: string; levelGroup?: string; vipOnly?: boolean }): Promise<Record<string, unknown>[]> {
  const qs = new URLSearchParams();
  if (params?.language) qs.set("language", params.language);
  if (params?.levelGroup) qs.set("levelGroup", params.levelGroup);
  if (params?.vipOnly !== undefined) qs.set("vipOnly", String(params.vipOnly));
  const query = qs.toString();
  return request(`/courses${query ? `?${query}` : ""}`);
}

export async function getCourse(id: string): Promise<Record<string, unknown>> {
  return request(`/courses/${id}`);
}

// ====== Words ======
export async function getWords(params?: { language?: string; level?: string; nativeLanguage?: string }): Promise<Record<string, unknown>[]> {
  const qs = new URLSearchParams();
  if (params?.language) qs.set("language", params.language);
  if (params?.level) qs.set("level", params.level);
  if (params?.nativeLanguage) qs.set("nativeLanguage", params.nativeLanguage);
  const query = qs.toString();
  return request(`/words${query ? `?${query}` : ""}`);
}

// ====== Public content: quizzes / listening / speaking ======
export async function getQuizzes(params?: { language?: string; level?: string; nativeLanguage?: string }): Promise<Record<string, unknown>[]> {
  const qs = new URLSearchParams();
  if (params?.language) qs.set("language", params.language);
  if (params?.level) qs.set("level", params.level);
  if (params?.nativeLanguage) qs.set("nativeLanguage", params.nativeLanguage);
  const query = qs.toString();
  return request(`/quizzes${query ? `?${query}` : ""}`);
}

export async function getListening(params?: { language?: string; level?: string }): Promise<Record<string, unknown>[]> {
  const qs = new URLSearchParams();
  if (params?.language) qs.set("language", params.language);
  if (params?.level) qs.set("level", params.level);
  const query = qs.toString();
  return request(`/listening${query ? `?${query}` : ""}`);
}

export async function getSpeaking(params?: { language?: string; level?: string }): Promise<Record<string, unknown>[]> {
  const qs = new URLSearchParams();
  if (params?.language) qs.set("language", params.language);
  if (params?.level) qs.set("level", params.level);
  const query = qs.toString();
  return request(`/speaking${query ? `?${query}` : ""}`);
}

// ====== User SRS review queues (auth) ======
export async function getWordReviews(params?: { language?: string; due?: boolean }): Promise<Record<string, unknown>[]> {
  const qs = new URLSearchParams();
  if (params?.language) qs.set("language", params.language);
  if (params?.due !== undefined) qs.set("due", String(params.due));
  const query = qs.toString();
  return request(`/user/word-reviews${query ? `?${query}` : ""}`, {}, true);
}

export async function getQuizReviews(params?: { language?: string; due?: boolean }): Promise<Record<string, unknown>[]> {
  const qs = new URLSearchParams();
  if (params?.language) qs.set("language", params.language);
  if (params?.due !== undefined) qs.set("due", String(params.due));
  const query = qs.toString();
  return request(`/user/quiz-reviews${query ? `?${query}` : ""}`, {}, true);
}

/** Submit a single word review (SM-2 write-through). */
export async function reviewWord(
  wordBankId: string,
  body: { quality: string; srsState: SrsStatePayload },
): Promise<Record<string, unknown>> {
  return request(`/user/word-reviews/${encodeURIComponent(wordBankId)}/review`, {
    method: "POST",
    body: JSON.stringify(body),
  }, true);
}

/** Submit a single quiz review (SM-2 write-through). */
export async function reviewQuiz(
  quizId: string,
  body: { quality: string; srsState: SrsStatePayload; correct?: boolean },
): Promise<Record<string, unknown>> {
  return request(`/user/quiz-reviews/${encodeURIComponent(quizId)}/review`, {
    method: "POST",
    body: JSON.stringify(body),
  }, true);
}

// ====== User course progress (auth) ======
export async function getCourseProgress(): Promise<Record<string, unknown>[]> {
  return request("/user/course-progress", {}, true);
}

export async function trackCourseProgress(
  courseId: string,
  body: { currentLesson?: number; completedLesson?: number },
): Promise<Record<string, unknown>> {
  return request(`/user/course-progress/${encodeURIComponent(courseId)}/track`, {
    method: "POST",
    body: JSON.stringify(body),
  }, true);
}

// ====== User achievements (auth) ======
export async function getAchievements(): Promise<Record<string, unknown>[]> {
  return request("/user/achievements", {}, true);
}

export async function unlockAchievement(badgeKey: string): Promise<Record<string, unknown>> {
  return request(`/user/achievements/${encodeURIComponent(badgeKey)}/unlock`, {
    method: "POST",
  }, true);
}

export async function markAchievementsRead(): Promise<Record<string, unknown>> {
  return request("/user/achievements/mark-read", { method: "POST" }, true);
}

// ====== Progress ======
export async function getProgress(): Promise<Record<string, unknown>> {
  return request("/progress/me", {}, true);
}

/**
 * SM-2 SRS state snapshot forwarded to the backend so it can keep its
 * own copy in sync (write-through). All fields are required when present.
 */
export interface SrsStatePayload {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewAt: string;
}

/**
 * Optional details attached to a recordWord call. Used by the SRS / mistake
 * log subsystem (Phase 3 review layer). Older backends will silently ignore
 * these fields, so passing them is always safe.
 */
export interface RecordWordDetails {
  /** Stable id of the word card the user just answered (e.g. "w-en-1"). */
  itemId?: string;
  /** Target language code, e.g. "en", "zh", "yue". */
  language?: string;
  /** CEFR-equivalent level, e.g. "A1", "HSK1", "N5", "初级". */
  level?: string;
  /** Latin/Greek root if known, e.g. "port" for "portable". Enables root-based review. */
  root?: string;
  /** Self-rating ("again"/"hard"/"good"/"easy") the user just gave in the SRS UI. */
  quality?: string;
  /** Computed SM-2 state after this review (write-through to backend). */
  srsState?: SrsStatePayload;
}
export interface RecordQuizDetails {
  /** Stable id of the quiz the user just answered. */
  itemId?: string;
  /** Target language code. */
  language?: string;
  /** CEFR-equivalent level. */
  level?: string;
  /** Index of the option the user picked (0-3). */
  selectedOption?: number;
  /** Index of the correct option (=== q.answer). Sent for redundancy. */
  correctOption?: number;
  /** Grammar point id this quiz exercises, e.g. "present_simple_3rd_person". */
  grammarPointId?: string;
  /** Self-rating ("again"/"hard"/"good"/"easy") the user just gave in the SRS UI. */
  quality?: string;
  /** Computed SM-2 state after this review (write-through to backend). */
  srsState?: SrsStatePayload;
}

/** Optional extra fields for recordSpeaking. Back-compat: callers that
 *  pass only (minutes, language) keep working. */
export interface RecordSpeakingDetails {
  /** Target language code (kept for back-compat with callers that pass it positionally). */
  language?: string;
  /** Stable id of the speaking phrase the user practiced. */
  itemId?: string;
  /** Pronunciation score (0-100) from PronunciationScore. */
  score?: number;
}

/** Optional extra fields for recordListening. */
export interface RecordListeningDetails {
  /** Target language code (kept for back-compat). */
  language?: string;
  /** Stable id of the listening item the user practiced. */
  itemId?: string;
  /** Per-blank correctness, e.g. [true, false, true]. */
  blankResults?: boolean[];
  /** Count of correctly filled blanks. */
  correctCount?: number;
  /** Total blanks in this listening exercise. */
  totalBlanks?: number;
}

export async function recordWord(
  correct: boolean,
  details?: RecordWordDetails | string,
): Promise<Record<string, unknown>> {
  // Keep `language` as a top-level field for back-compat with the old API
  // signature (recordWord(correct, language)) — old code passing a string
  // as the 2nd arg will be coerced into { language: <string> }.
  const lang = typeof details === "string" ? details : details?.language;
  const body: Record<string, unknown> = { correct, language: lang };
  if (details && typeof details === "object") {
    if (details.itemId) body.itemId = details.itemId;
    if (details.level) body.level = details.level;
    if (details.root) body.root = details.root;
    if (details.quality) body.quality = details.quality;
    if (details.srsState) body.srsState = details.srsState;
  }
  return request("/progress/record-word", { method: "POST", body: JSON.stringify(body) }, true);
}

export async function recordQuiz(
  correct: boolean,
  details?: RecordQuizDetails | string,
): Promise<Record<string, unknown>> {
  const lang = typeof details === "string" ? details : details?.language;
  const body: Record<string, unknown> = { correct, language: lang };
  if (details && typeof details === "object") {
    if (details.itemId) body.itemId = details.itemId;
    if (details.level) body.level = details.level;
    if (typeof details.selectedOption === "number") body.selectedOption = details.selectedOption;
    if (typeof details.correctOption === "number") body.correctOption = details.correctOption;
    if (details.grammarPointId) body.grammarPointId = details.grammarPointId;
    if (details.quality) body.quality = details.quality;
    if (details.srsState) body.srsState = details.srsState;
  }
  return request("/progress/record-quiz", { method: "POST", body: JSON.stringify(body) }, true);
}

export async function recordSpeaking(
  minutes: number,
  languageOrDetails?: string | RecordSpeakingDetails,
  details?: RecordSpeakingDetails,
): Promise<Record<string, unknown>> {
  // Back-compat: recordSpeaking(minutes, language) still works.
  const lang =
    typeof languageOrDetails === "string"
      ? languageOrDetails
      : languageOrDetails?.language ?? details?.language;
  const extra = typeof languageOrDetails === "object" ? languageOrDetails : details;
  const body: Record<string, unknown> = { minutes };
  if (lang) body.language = lang;
  if (extra?.itemId) body.itemId = extra.itemId;
  if (typeof extra?.score === "number") body.score = extra.score;
  return request("/progress/record-speaking", { method: "POST", body: JSON.stringify(body) }, true);
}

export async function recordListening(
  minutes: number,
  languageOrDetails?: string | RecordListeningDetails,
  details?: RecordListeningDetails,
): Promise<Record<string, unknown>> {
  // Back-compat: recordListening(minutes, language) still works.
  const lang =
    typeof languageOrDetails === "string"
      ? languageOrDetails
      : languageOrDetails?.language ?? details?.language;
  const extra = typeof languageOrDetails === "object" ? languageOrDetails : details;
  const body: Record<string, unknown> = { minutes };
  if (lang) body.language = lang;
  if (extra?.itemId) body.itemId = extra.itemId;
  if (Array.isArray(extra?.blankResults)) body.blankResults = extra.blankResults;
  if (typeof extra?.correctCount === "number") body.correctCount = extra.correctCount;
  if (typeof extra?.totalBlanks === "number") body.totalBlanks = extra.totalBlanks;
  return request("/progress/record-listening", { method: "POST", body: JSON.stringify(body) }, true);
}

export async function updateProgressSettings(data: {
  goalMinutesPerDay?: number;
  targetLanguage?: string;
}): Promise<Record<string, unknown>> {
  return request("/progress/me", { method: "PATCH", body: JSON.stringify(data) }, true);
}

// ====== Community ======
export async function getPosts(topic?: string): Promise<Record<string, unknown>[]> {
  const query = topic ? `?topic=${encodeURIComponent(topic)}` : "";
  return request(`/posts${query}`);
}

export async function createPost(topic: string, content: string): Promise<Record<string, unknown>> {
  return request("/posts", { method: "POST", body: JSON.stringify({ topic, content }) }, true);
}

export async function likePost(id: string): Promise<{ id: string; likeCount: number; likedByMe: boolean }> {
  return request(`/posts/${id}/like`, { method: "POST" }, true);
}

export async function commentPost(id: string, content: string): Promise<Record<string, unknown>> {
  return request(`/posts/${id}/comment`, { method: "POST", body: JSON.stringify({ content }) }, true);
}

export async function deletePost(id: string): Promise<Record<string, unknown>> {
  return request(`/posts/${id}`, { method: "DELETE" }, true);
}

export async function deleteComment(postId: string, commentId: string): Promise<Record<string, unknown>> {
  return request(`/posts/${postId}/comments/${commentId}`, { method: "DELETE" }, true);
}

// ====== Stripe ======
export async function createCheckoutSession(tier: "basic" | "vip"): Promise<Record<string, unknown>> {
  return request("/stripe/checkout-session", { method: "POST", body: JSON.stringify({ tier }) }, true);
}

export async function getCurrentPlan(): Promise<Record<string, unknown>> {
  return request("/stripe/current-plan", {}, true);
}

// ====== Admin ======
export async function adminList(
  resource: string,
  params?: { language?: string; level?: string }
): Promise<Record<string, unknown>[]> {
  const qs = new URLSearchParams();
  if (params?.language) qs.set("language", params.language);
  if (params?.level) qs.set("level", params.level);
  const query = qs.toString();
  return request(`/admin/${resource}${query ? `?${query}` : ""}`, {}, true);
}

export async function adminGet(resource: string, id: string): Promise<Record<string, unknown>> {
  return request(`/admin/${resource}/${id}`, {}, true);
}

export async function adminCreate(
  resource: string,
  data: Record<string, unknown>
): Promise<Record<string, unknown>> {
  return request(`/admin/${resource}`, { method: "POST", body: JSON.stringify(data) }, true);
}

export async function adminUpdate(
  resource: string,
  id: string,
  data: Record<string, unknown>
): Promise<Record<string, unknown>> {
  return request(`/admin/${resource}/${id}`, { method: "PUT", body: JSON.stringify(data) }, true);
}

export async function adminDelete(resource: string, id: string): Promise<Record<string, unknown>> {
  return request(`/admin/${resource}/${id}`, { method: "DELETE" }, true);
}

// ====== Blog (public + admin) ======
export async function getBlogPosts(params?: { language?: string }): Promise<Record<string, unknown>[]> {
  const qs = new URLSearchParams();
  if (params?.language) qs.set("language", params.language);
  const query = qs.toString();
  return request(`/blog/posts${query ? `?${query}` : ""}`);
}

export async function getBlogPost(slug: string): Promise<Record<string, unknown>> {
  return request(`/blog/posts/${slug}`);
}

export async function adminListBlogPosts(params?: {
  language?: string;
  status?: string;
  q?: string;
}): Promise<Record<string, unknown>[]> {
  const qs = new URLSearchParams();
  if (params?.language) qs.set("language", params.language);
  if (params?.status) qs.set("status", params.status);
  if (params?.q) qs.set("q", params.q);
  const query = qs.toString();
  return request(`/admin/blog/posts${query ? `?${query}` : ""}`, {}, true);
}

export async function adminCreateBlogPost(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  return request(`/admin/blog/posts`, { method: "POST", body: JSON.stringify(data) }, true);
}

export async function adminUpdateBlogPost(id: string, data: Record<string, unknown>): Promise<Record<string, unknown>> {
  return request(`/admin/blog/posts/${id}`, { method: "PUT", body: JSON.stringify(data) }, true);
}

export async function adminDeleteBlogPost(id: string): Promise<Record<string, unknown>> {
  return request(`/admin/blog/posts/${id}`, { method: "DELETE" }, true);
}

// ====== 类型别名（向后兼容）======
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UserResp = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CourseResp = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WordResp = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ProgressResp = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PostResp = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CommentResp = any;

// ====== 聚合对象（向后兼容）======
export const api = {
  register,
  login,
  logout,
  me: getMe,
  updateMe,
  courses: getCourses,
  course: getCourse,
  words: getWords,
  quizzes: getQuizzes,
  listening: getListening,
  speaking: getSpeaking,
  wordReviews: getWordReviews,
  quizReviews: getQuizReviews,
  reviewWord,
  reviewQuiz,
  courseProgress: getCourseProgress,
  trackCourseProgress,
  achievements: getAchievements,
  unlockAchievement,
  markAchievementsRead,
  progressMe: getProgress,
  recordWord,
  recordQuiz,
  recordSpeaking,
  recordListening,
  updateProgress: updateProgressSettings,
  posts: getPosts,
  createPost,
  toggleLike: likePost,
  addComment: commentPost,
  deletePost,
  deleteComment,
  createCheckoutSession,
  currentPlan: getCurrentPlan,
  adminList,
  adminGet,
  adminCreate,
  adminUpdate,
  adminDelete,
  getBlogPosts,
  getBlogPost,
  adminListBlogPosts,
  adminCreateBlogPost,
  adminUpdateBlogPost,
  adminDeleteBlogPost,
};
