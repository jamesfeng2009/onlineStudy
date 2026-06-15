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

// ====== Progress ======
export async function getProgress(): Promise<Record<string, unknown>> {
  return request("/progress/me", {}, true);
}

export async function recordWord(correct: boolean, _language?: string): Promise<Record<string, unknown>> {
  return request("/progress/record-word", { method: "POST", body: JSON.stringify({ correct }) }, true);
}

export async function recordQuiz(correct: boolean, _language?: string): Promise<Record<string, unknown>> {
  return request("/progress/record-quiz", { method: "POST", body: JSON.stringify({ correct }) }, true);
}

export async function recordSpeaking(minutes: number, _language?: string): Promise<Record<string, unknown>> {
  return request("/progress/record-speaking", { method: "POST", body: JSON.stringify({ minutes }) }, true);
}

export async function recordListening(minutes: number, _language?: string): Promise<Record<string, unknown>> {
  return request("/progress/record-listening", { method: "POST", body: JSON.stringify({ minutes }) }, true);
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
