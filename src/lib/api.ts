import { getToken } from "./auth";
import i18n from "./i18n";

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
      if (res.status === 404) msg = i18n.t("api.errors.notFound");
      else if (res.status === 500) msg = i18n.t("api.errors.serverError");
      else if (res.status === 401) msg = i18n.t("api.errors.unauthorized");
      else if (res.status === 403) msg = i18n.t("api.errors.forbidden");
      else if (res.status === 409) msg = i18n.t("api.errors.conflict");
      else if (res.status === 400) msg = i18n.t("api.errors.badRequest");
      else msg = i18n.t("api.errors.requestFailed", { status: res.status });
    }
    throw new Error(msg);
  }

  if (body === null) {
    throw new Error(i18n.t("api.errors.emptyResponse"));
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

// ====== P1 反爬：真实对话语料 + 分支对话场景 ======
// 数据已迁入 DB，匿名仅返回样例（preview=true），登录返回全量。
// 响应 items 的元素结构与 src/types.ts 的 RealConversation / DialogueScene 一致。

export interface RealConversationListResp {
  items: import("../types").RealConversation[];
  total: number;
  preview: boolean;
}

export async function getRealConversations(params: {
  language: string;
  domain?: string;
}): Promise<RealConversationListResp> {
  const qs = new URLSearchParams({ language: params.language });
  if (params.domain) qs.set("domain", params.domain);
  return request(`/real-conversations?${qs.toString()}`, {}, true);
}

export interface DialogueSceneListResp {
  items: import("../types").DialogueScene[];
  total: number;
  preview: boolean;
}

export async function getDialogueSceneList(params: {
  language: string;
}): Promise<DialogueSceneListResp> {
  const qs = new URLSearchParams({ language: params.language });
  return request(`/dialogue-scenes?${qs.toString()}`, {}, true);
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

// ====== P1-3: SRS for listening / speaking ======

export async function getListeningReviews(params?: {
  language?: string;
  due?: boolean;
}): Promise<Record<string, unknown>[]> {
  const qs = new URLSearchParams();
  if (params?.language) qs.set("language", params.language);
  if (params?.due !== undefined) qs.set("due", String(params.due));
  const query = qs.toString();
  return request(`/user/listening-reviews${query ? `?${query}` : ""}`, {}, true);
}

export async function getSpeakingReviews(params?: {
  language?: string;
  due?: boolean;
}): Promise<Record<string, unknown>[]> {
  const qs = new URLSearchParams();
  if (params?.language) qs.set("language", params.language);
  if (params?.due !== undefined) qs.set("due", String(params.due));
  const query = qs.toString();
  return request(`/user/speaking-reviews${query ? `?${query}` : ""}`, {}, true);
}

/** Submit a listening item review (SM-2 write-through). */
export async function reviewListening(
  listeningId: string,
  body: { quality: string; srsState: SrsStatePayload; accuracy?: number },
): Promise<Record<string, unknown>> {
  return request(
    `/user/listening-reviews/${encodeURIComponent(listeningId)}/review`,
    { method: "POST", body: JSON.stringify(body) },
    true,
  );
}

/** Submit a speaking item review (SM-2 write-through). */
export async function reviewSpeaking(
  speakingId: string,
  body: { quality: string; srsState: SrsStatePayload; score?: number },
): Promise<Record<string, unknown>> {
  return request(
    `/user/speaking-reviews/${encodeURIComponent(speakingId)}/review`,
    { method: "POST", body: JSON.stringify(body) },
    true,
  );
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

// ====== P0-1: Lesson hierarchy (units + lessons + player) ======

export type LessonStatus = "locked" | "unlocked" | "in_progress" | "completed";

export interface LessonSummary {
  id: string;
  title: string;
  lessonOrder: number;
  skillType: string;
  durationMin: number;
  isCheckpoint: boolean;
  requiresLessonId: string | null;
  status: LessonStatus;
  bestScore: number | null;
  attemptCount: number;
}

export interface UnitSummary {
  id: string;
  title: string;
  description: string | null;
  unitOrder: number;
  skillFocus: string | null;
  lessons: LessonSummary[];
}

export interface CourseUnitsResp {
  course: {
    id: string;
    title: string;
    language: string;
    level: string;
    totalLessons: number;
  };
  units: UnitSummary[];
}

/** Fetch the unit/lesson tree for a course. Includes derived status
 *  for each lesson (auth-aware: logged-in users see their real
 *  progress; logged-out users see the prerequisite-derived status). */
export async function getCourseUnits(courseId: string): Promise<CourseUnitsResp> {
  return request(`/courses/${encodeURIComponent(courseId)}/units`);
}

export interface LessonExerciseWord {
  id: string;
  language: string;
  level: string;
  word: string;
  phonetic: string | null;
  translation: string;
  exampleTranslation: string | null;
  exampleSentence: string;
}

export interface LessonExerciseQuiz {
  id: string;
  language: string;
  level: string;
  question: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface LessonExerciseListening {
  id: string;
  language: string;
  level: string;
  title: string;
  script: string;
  blanks: unknown;
}

export interface LessonExerciseSpeaking {
  id: string;
  language: string;
  level: string;
  phrase: string;
  translation: string;
  phonetic: string | null;
}

export interface LessonDetailResp {
  id: string;
  title: string;
  skillType: string;
  durationMin: number;
  isCheckpoint: boolean;
  requiresLessonId: string | null;
  unit: { courseId: string; unitOrder: number; title: string };
  course: { language: string; level: string } | null;
  status: LessonStatus;
  bestScore: number | null;
  attemptCount: number;
  exerciseIds: string[];
  exercises: {
    words: LessonExerciseWord[];
    quizzes: LessonExerciseQuiz[];
    listenings: LessonExerciseListening[];
    speakings: LessonExerciseSpeaking[];
  };
}

/** Fetch a single lesson with resolved exercises (words/quizzes/
 *  listenings/speakings + translations). */
export async function getLesson(lessonId: string): Promise<LessonDetailResp> {
  return request(`/lessons/${encodeURIComponent(lessonId)}`);
}

/** Mark a lesson as in_progress. Validates the prerequisite is
 *  completed. Increments attemptCount. Returns the new status. */
export async function startLesson(lessonId: string): Promise<{
  lessonId: string;
  status: LessonStatus;
  attemptCount: number;
  startedAt: string | null;
}> {
  return request(`/lessons/${encodeURIComponent(lessonId)}/start`, {
    method: "POST",
  }, true);
}

/** Mark a lesson completed. Auto-unlocks the next lesson in the
 *  chain. Optional `score` (for checkpoint lessons) is merged into
 *  bestScore as max(prev, score). */
export async function completeLesson(
  lessonId: string,
  body?: { score?: number },
): Promise<{
  lessonId: string;
  status: LessonStatus;
  bestScore: number | null;
  attemptCount: number;
  completedAt: string | null;
  unlockedLessonId: string | null;
}> {
  return request(`/lessons/${encodeURIComponent(lessonId)}/complete`, {
    method: "POST",
    body: JSON.stringify(body ?? {}),
  }, true);
}

// ====== P1-4: Crown progress (course-level) ======

export interface CrownCheckpoint {
  lessonId: string;
  title: string;
  unitTitle: string;
  bestScore: number | null;
  passed: boolean;
  completedAt: string | null;
}

export interface CourseCrownsResp {
  crowns: number;
  totalCheckpoints: number;
  passThreshold: number;
  passedCheckpoints: CrownCheckpoint[];
}

export async function getCourseCrowns(courseId: string): Promise<CourseCrownsResp> {
  return request(`/courses/${encodeURIComponent(courseId)}/crowns`, {}, true);
}

// ====== P0-3: Placement test (分级测试) ======

export interface PlacementQuestion {
  level: string;
  id: string;
  question: string;
  options: string[];
  answer: number;
}

export interface PlacementQuestionsResp {
  language: string;
  levels: string[];
  questions: PlacementQuestion[];
  totalQuestions: number;
}

/** Fetch placement-test question set for a language (no auth needed).
 *  Returns ~countPerLevel questions per level; the frontend walks
 *  through them adaptively (binary search on the level ladder). */
export async function getPlacementQuestions(
  language: string,
  params?: { countPerLevel?: number; nativeLanguage?: string },
): Promise<PlacementQuestionsResp> {
  const qs = new URLSearchParams();
  if (params?.countPerLevel) qs.set("countPerLevel", String(params.countPerLevel));
  if (params?.nativeLanguage) qs.set("nativeLanguage", params.nativeLanguage);
  const query = qs.toString();
  return request(`/placement/questions/${encodeURIComponent(language)}${query ? `?${query}` : ""}`);
}

export interface PlacementAnswerPayload {
  level: string;
  itemId: string;
  selectedOption: number;
  correct: boolean;
}

export interface PlacementResultPayload {
  language: string;
  recommendedLevel: string;
  recommendedCourseId?: string | null;
  totalQuestions: number;
  correctCount: number;
  finalCefrRank: number;
  answers?: PlacementAnswerPayload[];
}

export interface PlacementResultResp {
  id: string;
  userId: string;
  language: string;
  recommendedLevel: string;
  recommendedCourseId: string | null;
  totalQuestions: number;
  correctCount: number;
  finalCefrRank: number;
  answers: unknown;
  takenAt: string;
}

/** Save (upsert) the placement result for the current user.
 *  Each (userId, language) keeps only the latest result. */
export async function savePlacementResult(
  body: PlacementResultPayload,
): Promise<PlacementResultResp> {
  return request("/placement/result", {
    method: "POST",
    body: JSON.stringify(body),
  }, true);
}

/** Get the latest placement result for a language (auth). Returns null
 *  if the user has never taken the test for that language. */
export async function getPlacementResult(
  language: string,
): Promise<PlacementResultResp | null> {
  return request(`/placement/result/${encodeURIComponent(language)}`, {}, true);
}

// ====== P1-2: Reading module ======

export interface ReadingGlossaryEntry {
  term: string;
  reading?: string;
  definition: string;
  translation?: string;
}

export interface ReadingQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explain?: string;
  translations?: Record<string, string>;
}

export interface ReadingPassageSummary {
  id: string;
  language: string;
  level: string;
  title: string;
  summary: string;
  wordCount: number;
  estMinutes: number;
  source: string | null;
}

export interface ReadingPassageDetail extends ReadingPassageSummary {
  body: string;
  glossary: ReadingGlossaryEntry[];
  questions: ReadingQuestion[];
  nativeLanguage: string;
}

export interface ReadingProgressEntry {
  readingId: string;
  status: "not_started" | "in_progress" | "completed";
  correctCount: number;
  totalQuestions: number;
  bestAccuracy: number;
  attemptCount: number;
  completedAt: string | null;
  lastPracticedAt: string | null;
}

export async function getReadingPassages(params?: {
  language?: string;
  level?: string;
  nativeLanguage?: string;
}): Promise<ReadingPassageSummary[]> {
  const qs = new URLSearchParams();
  if (params?.language) qs.set("language", params.language);
  if (params?.level) qs.set("level", params.level);
  if (params?.nativeLanguage) qs.set("nativeLanguage", params.nativeLanguage);
  const query = qs.toString();
  return request(`/reading${query ? `?${query}` : ""}`);
}

export async function getReadingPassage(
  id: string,
  nativeLanguage?: string,
): Promise<ReadingPassageDetail> {
  const qs = new URLSearchParams();
  if (nativeLanguage) qs.set("nativeLanguage", nativeLanguage);
  const query = qs.toString();
  return request(`/reading/${encodeURIComponent(id)}${query ? `?${query}` : ""}`);
}

export async function getReadingProgress(
  language?: string,
): Promise<ReadingProgressEntry[]> {
  const qs = new URLSearchParams();
  if (language) qs.set("language", language);
  const query = qs.toString();
  return request(`/reading/progress${query ? `?${query}` : ""}`, {}, true);
}

export async function submitReadingProgress(
  readingId: string,
  body: {
    results: { questionId: string; selectedIndex: number; correct: boolean }[];
    totalQuestions: number;
    correctCount: number;
  },
): Promise<ReadingProgressEntry> {
  return request(
    `/reading/${encodeURIComponent(readingId)}/progress`,
    { method: "POST", body: JSON.stringify(body) },
    true,
  );
}

// ====== League (P2-1) ======
export type LeagueDivision =
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond"
  | "master";

export interface LeagueDivisionMeta {
  key: LeagueDivision;
  label: string;
  icon: string;
  minExp: number;
}

export interface LeagueCurrentSeasonResp {
  seasonKey: string;
  startsAt: string;
  endsAt: string;
  totalPlayers: number;
  divisions: LeagueDivisionMeta[];
}

export interface LeagueStandingEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string | null;
  level: number;
  division: LeagueDivision;
  weekExp: number;
  currentExp: number;
  startingExp: number;
  bestDivision: LeagueDivision | null;
}

export interface LeagueStandingsResp {
  seasonKey: string;
  division: string;
  entries: LeagueStandingEntry[];
}

export interface LeagueMyStanding {
  id: string;
  division: LeagueDivision;
  divisionLabel: string;
  startingExp: number;
  currentExp: number;
  weekExp: number;
  bestDivision: LeagueDivision | null;
  rankInDivision: number;
  divisionSize: number;
  isPromotionZone: boolean;
  isDemotionZone: boolean;
  promotedAt: string | null;
  demotedAt: string | null;
}

export interface LeagueMeResp {
  seasonKey: string;
  startsAt: string;
  endsAt: string;
  standing: LeagueMyStanding;
  user: {
    id: string;
    username: string;
    avatar: string | null;
    level: number;
    exp: number;
  };
}

export async function getLeagueCurrentSeason(): Promise<LeagueCurrentSeasonResp> {
  return request("/league/current-season");
}

export async function getLeagueStandings(params?: {
  division?: LeagueDivision;
  limit?: number;
}): Promise<LeagueStandingsResp> {
  const qs = new URLSearchParams();
  if (params?.division) qs.set("division", params.division);
  if (typeof params?.limit === "number") qs.set("limit", String(params.limit));
  const query = qs.toString();
  return request(`/league/standings${query ? `?${query}` : ""}`);
}

export async function getLeagueMe(): Promise<LeagueMeResp> {
  return request("/league/me", {}, true);
}

export async function syncLeagueMe(): Promise<{
  id: string;
  division: LeagueDivision;
  startingExp: number;
  currentExp: number;
  weekExp: number;
  bestDivision: LeagueDivision | null;
}> {
  return request("/league/me/sync", { method: "POST" }, true);
}

// ====== CEFR 自评 (P2-2) ======
export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type CefrSkill = "listening" | "reading" | "speaking" | "writing";

export interface CefrCanDoStatement {
  key: string;
  skill: CefrSkill;
  text: string;
}

export interface CefrLevelMeta {
  level: CefrLevel;
  rank: number;
  label: string;
  description: string;
  statements: CefrCanDoStatement[];
}

export interface CefrCanDoResp {
  levels: CefrLevelMeta[];
}

export interface CefrSelfAssessmentEntry {
  id: string;
  language: string;
  cefrLevel: CefrLevel;
  cefrRank: number;
  canDoKeys: string[];
  note: string | null;
  assessedAt: string;
  updatedAt: string;
}

export async function getCefrCanDoStatements(): Promise<CefrCanDoResp> {
  return request("/cefr-can-do-statements");
}

export async function getCefrSelfAssessment(language?: string): Promise<CefrSelfAssessmentEntry[]> {
  const qs = new URLSearchParams();
  if (language) qs.set("language", language);
  const query = qs.toString();
  return request(`/user/cefr-self-assessment${query ? `?${query}` : ""}`, {}, true);
}

export async function saveCefrSelfAssessment(body: {
  language: string;
  cefrLevel: CefrLevel;
  canDoKeys?: string[];
  note?: string;
}): Promise<CefrSelfAssessmentEntry> {
  return request("/user/cefr-self-assessment", {
    method: "PUT",
    body: JSON.stringify(body),
  }, true);
}

// ====== 写作模块 (P2-3) ======
export type WritingType = "essay" | "email" | "summary" | "story" | "dialogue";

export interface WritingPromptSummary {
  id: string;
  language: string;
  level: string;
  type: WritingType;
  title: string;
  prompt: string;
  tips: string[];
  minWords: number;
  maxWords: number;
  estMinutes: number;
}

export interface WritingPromptDetail extends WritingPromptSummary {
  sampleAnswer: string | null;
  keywords: string[];
  nativeLanguage: string;
}

export interface WritingSubmissionFeedback {
  lengthHint: string;
  varietyHint: string;
  keywordHint: string;
  matchedKeywords: string[];
  missedKeywords: string[];
  suggestions: string[];
  [k: string]: unknown;
}

export interface WritingSubmissionEntry {
  id: string;
  writingId: string;
  content: string;
  wordCount: number;
  score: number;
  lengthScore: number;
  varietyScore: number;
  keywordScore: number;
  feedback: WritingSubmissionFeedback;
  status: string;
  submittedAt: string;
  reviewedAt: string | null;
  prompt?: {
    id: string;
    title: string;
    level: string;
    type: WritingType;
    languageCode: string;
  };
}

export async function getWritingPrompts(params?: {
  language?: string;
  level?: string;
  type?: WritingType;
  nativeLanguage?: string;
}): Promise<WritingPromptSummary[]> {
  const qs = new URLSearchParams();
  if (params?.language) qs.set("language", params.language);
  if (params?.level) qs.set("level", params.level);
  if (params?.type) qs.set("type", params.type);
  if (params?.nativeLanguage) qs.set("nativeLanguage", params.nativeLanguage);
  const query = qs.toString();
  return request(`/writing${query ? `?${query}` : ""}`);
}

export async function getWritingPrompt(
  id: string,
  nativeLanguage?: string,
): Promise<WritingPromptDetail> {
  const qs = new URLSearchParams();
  if (nativeLanguage) qs.set("nativeLanguage", nativeLanguage);
  const query = qs.toString();
  return request(`/writing/${encodeURIComponent(id)}${query ? `?${query}` : ""}`);
}

export async function getWritingSubmissions(language?: string): Promise<WritingSubmissionEntry[]> {
  const qs = new URLSearchParams();
  if (language) qs.set("language", language);
  const query = qs.toString();
  return request(`/writing/progress${query ? `?${query}` : ""}`, {}, true);
}

export async function submitWriting(
  writingId: string,
  content: string,
): Promise<WritingSubmissionEntry> {
  return request(
    `/writing/${encodeURIComponent(writingId)}/submit`,
    { method: "POST", body: JSON.stringify({ content }) },
    true,
  );
}

// ====== AI Explain (P3-1) ======

export interface AiExplainResp {
  explanation: string;
  cached: boolean;
  remainingToday: number;
}

export interface AiUsageResp {
  used: number;
  limit: number;
  remaining: number;
}

export async function explainReadingSentence(
  passageId: string,
  sentence: string,
): Promise<AiExplainResp> {
  return request(
    `/ai-explain/reading/${encodeURIComponent(passageId)}`,
    { method: "POST", body: JSON.stringify({ sentence }) },
    true,
  );
}

export async function explainWritingSubmission(
  submissionId: string,
): Promise<AiExplainResp> {
  return request(
    `/ai-explain/writing/${encodeURIComponent(submissionId)}`,
    { method: "POST" },
    true,
  );
}

export async function explainLessonExercise(
  exerciseId: string,
  payload: {
    question: string;
    options?: string[];
    correctAnswer?: string;
    userAnswer?: string;
  },
): Promise<AiExplainResp> {
  return request(
    `/ai-explain/lesson/${encodeURIComponent(exerciseId)}`,
    { method: "POST", body: JSON.stringify(payload) },
    true,
  );
}

export async function explainWord(
  wordId: string,
  payload?: {
    word?: string;
    translation?: string;
    exampleSentence?: string;
    languageCode?: string;
  },
): Promise<AiExplainResp> {
  return request(
    `/ai-explain/word/${encodeURIComponent(wordId)}`,
    { method: "POST", body: JSON.stringify(payload ?? {}) },
    true,
  );
}

export async function getAiUsage(): Promise<AiUsageResp> {
  return request("/ai-explain/usage", {}, true);
}

// ====== P4-2: AI Conversation (auth) ======

export interface AiConversationSummary {
  id: string;
  languageCode: string;
  level: string | null;
  title: string | null;
  scenarioType: string;
  status: string;
  turnCount: number;
  lastActiveAt: string;
  createdAt: string;
}

export interface AiConversationMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

export interface AiConversationDetail {
  conversation: Omit<AiConversationSummary, "id"> & { id: string };
  messages: AiConversationMessage[];
  remainingToday: number;
}

export interface AiConverseSendResp {
  userMessage: AiConversationMessage;
  assistantMessage: AiConversationMessage;
  remainingToday: number;
}

export async function startAiConversation(params: {
  languageCode: string;
  level?: string;
  scenarioType?: string;
  title?: string;
}): Promise<{ conversationId: string; status: string; languageCode: string; level: string | null; scenarioType: string; remainingToday: number }> {
  return request("/ai-converse/start", { method: "POST", body: JSON.stringify(params) }, true);
}

export async function sendAiMessage(
  conversationId: string,
  content: string,
  idempotencyKey?: string,
): Promise<AiConverseSendResp> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (idempotencyKey) {
    headers["Idempotency-Key"] = idempotencyKey;
  }
  return request(
    `/ai-converse/${encodeURIComponent(conversationId)}/send`,
    { method: "POST", headers, body: JSON.stringify({ content }) },
    true,
  );
}

export async function listAiConversations(limit = 20): Promise<{ conversations: AiConversationSummary[] }> {
  return request(`/ai-converse/list?limit=${limit}`, {}, true);
}

export async function getAiConversation(conversationId: string): Promise<AiConversationDetail> {
  return request(`/ai-converse/${encodeURIComponent(conversationId)}`, {}, true);
}

export async function endAiConversation(conversationId: string): Promise<{ conversationId: string; status: string }> {
  return request(
    `/ai-converse/${encodeURIComponent(conversationId)}/end`,
    { method: "POST" },
    true,
  );
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
  realConversations: getRealConversations,
  dialogueScenes: getDialogueSceneList,
  wordReviews: getWordReviews,
  quizReviews: getQuizReviews,
  listeningReviews: getListeningReviews,
  speakingReviews: getSpeakingReviews,
  reviewWord,
  reviewQuiz,
  reviewListening,
  reviewSpeaking,
  courseProgress: getCourseProgress,
  trackCourseProgress,
  courseUnits: getCourseUnits,
  lesson: getLesson,
  startLesson,
  completeLesson,
  courseCrowns: getCourseCrowns,
  placementQuestions: getPlacementQuestions,
  savePlacementResult,
  placementResult: getPlacementResult,
  readingPassages: getReadingPassages,
  readingPassage: getReadingPassage,
  readingProgress: getReadingProgress,
  submitReading: submitReadingProgress,
  leagueSeason: getLeagueCurrentSeason,
  leagueStandings: getLeagueStandings,
  leagueMe: getLeagueMe,
  leagueMeSync: syncLeagueMe,
  cefrCanDo: getCefrCanDoStatements,
  cefrSelfAssessment: getCefrSelfAssessment,
  saveCefrSelfAssessment,
  writingPrompts: getWritingPrompts,
  writingPrompt: getWritingPrompt,
  writingSubmissions: getWritingSubmissions,
  submitWriting,
  aiExplainReading: explainReadingSentence,
  aiExplainWriting: explainWritingSubmission,
  aiExplainLesson: explainLessonExercise,
  aiExplainWord: explainWord,
  aiUsage: getAiUsage,
  aiConverseStart: startAiConversation,
  aiConverseSend: sendAiMessage,
  aiConverseList: listAiConversations,
  aiConverseGet: getAiConversation,
  aiConverseEnd: endAiConversation,
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
