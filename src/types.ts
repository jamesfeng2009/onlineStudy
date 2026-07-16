export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // stored locally (demo only)
  avatar?: string;
  level: number;
  exp: number;
  streak: number;
  lastActive: string; // YYYY-MM-DD
  targetLanguage: Language;
  createdAt: string;
  goalMinutesPerDay: number;
}

export type Language = "en" | "ja" | "ko" | "zh" | "es" | "fr" | "de" | "it" | "th" | "yue" | "ms" | "id" | "vi";

export interface LanguageMeta {
  id: Language;
  name: string;
  native: string;
  flag: string;
  tagline: string;
  /** 等级列表（字符串形式，向后兼容）。如 ["A1","A2","B1","B2","C1","C2"] */
  levels: string[];
  /** 等级元数据（P0-2 新增，可选，向后兼容）。key = level code */
  levelMeta?: Record<string, LevelMeta>;
}

/** 单个等级的元数据。对齐 CEFR/JLPT/HSK/TOPIK 等国际通用语言能力标准。
 *  learningGoals 为本项目原创描述，不抄 CEFR Can-Do 原文（版权风险）。 */
export interface LevelMeta {
  /** 等级代码，如 "A1" / "N5" / "HSK1" / "TOPIK1" */
  code: string;
  /** 对齐的 CEFR 等级，用于跨语言比较。如 "A1" / "B2" */
  cefrAlignment: import("./lib/level-utils").CefrLevel;
  /** 人类可读名称，如 "Beginner" / "入门" */
  name: string;
  /** 本等级学完后能做的事（项目原创，非 CEFR 原文） */
  learningGoals: string[];
  /** 目标词汇量 */
  vocabTarget: number;
  /** 建议引导学习小时数 */
  guidedHours: number;
  /** 本等级应掌握的语法点清单 */
  grammarPoints: string[];
  /** 对齐的国际能力框架 */
  frameworkAlignment?: {
    framework: "CEFR" | "JLPT" | "HSK" | "TOPIK" | "ACTFL";
    level: string;
  };
}

export interface Course {
  id: string;
  title: string;
  language: Language;
  level: string; // A1, B2, N5...
  levelGroup: "beginner" | "intermediate" | "advanced";
  description: string;
  lessons: number;
  minutes: number;
  cover: string;
  tags: string[];
  progress?: number; // 0-100 runtime
}

export interface WordItem {
  id: string;
  word: string;
  translation: string;
  phonetic?: string;
  example: string;
  language: Language;
  level?: string;

  // ── Vocabulary layer (Phase 2) ──
  /** Frequency rank 1-10000 (1 = most common). Used for ordering
   *  and "high-priority word" badges in the UI. */
  frequency?: number;
  /** CEFR-equivalent level derived from `level` via level-utils.
   *  Computed at runtime; never stored in source data. */
  cefrEquivalent?: import("./lib/level-utils").CefrLevel;
  /** Part of speech: noun/verb/adj/adv/prep/conj/art/det/pron/num. */
  pos?: string;
  /** Latin/Greek root for English (e.g. "port" for "portable").
   *  CJK words typically leave this undefined. */
  root?: string;
  /** Human-readable meaning of the root, e.g. "to carry". */
  rootMeaning?: string;
  /** Id of the WordFamily this word belongs to (see WORD_FAMILIES).
   *  Lets the UI show "related words: worker, working, workshop". */
  familyId?: string;
  /** Common collocations, e.g. ["heavy rain", "make a decision"]. */
  collocations?: string[];
  /** Wrong-vs-right pairs to flag common learner mistakes,
   *  e.g. [{ wrong: "strong rain", right: "heavy rain" }]. */
  collocationPitfalls?: { wrong: string; right: string }[];
}

/** A word family groups words sharing a root (e.g. work/worker/working).
 *  Used by the UI to show "related words" on a flashcard. */
export interface WordFamily {
  id: string;
  head: string;          // the headword, e.g. "work"
  root?: string;         // shared root, e.g. "work"
  rootMeaning?: string;
  language: Language;
  members: {
    word: string;
    pos: string;          // noun / verb / adj / ...
    relation: "head" | "derivative" | "inflection" | "compound";
    meaning?: string;    // short gloss
  }[];
}

export interface QuizItem {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explain: string;
  language: Language;
  level?: string;
  /** Id of the GrammarPoint this quiz tests. Optional — not every
   *  quiz needs to map to a point, but tagged quizzes feed the
   *  dependency graph and mistake log. */
  grammarPointId?: string;
}

export interface ListeningItem {
  id: string;
  title: string;
  /** Original script as a single string. Kept for TTS playback (some
   *  TTS engines handle punctuation better when given natural text
   *  rather than space-separated tokens). */
  script: string;
  /** Pre-tokenized version of `script`. The frontend uses this for
   *  blank-fill exercises so CJK languages (zh/yue/ja) don't rely on
   *  the brittle `script.split(" ")` hack. Falls back to split(" ")
   *  if absent (legacy data). */
  tokens?: string[];
  blanks: { index: number; answer: string }[];
  language: Language;
  level?: string;
  // ── Listening grading (Phase 6 / L3) ──
  /** Playback speeds offered in the UI. Defaults to [0.8, 1.0] when
   *  absent. The slow speed helps beginners parse connected speech;
   *  the fast one trains real-world listening. */
  speeds?: number[];
  /** Real-world scenario tag, used by the scene filter. */
  scene?: ListeningScene;
  /** Optional accent hint shown in the UI (e.g. "US"/"GB" for en).
   *  Does NOT change TTS voice selection — that's driven by the
   *  BCP-47 lang tag in lib/tts.ts. */
  accent?: string;
}

export interface SpeakingPhrase {
  id: string;
  phrase: string;
  translation: string;
  phonetic?: string;
  language: Language;
  level?: string;
}

// ─────────────────────────────────────────────────────────────
//  Phase 5 (L2) — Grammar dependency graph
// ─────────────────────────────────────────────────────────────

/** A grammar point — the smallest teachable unit. Quizzes reference
 *  a grammar point via `QuizItem.grammarPointId`; the GrammarMap
 *  renders the dependency graph by walking `prerequisites`.
 *
 *  Example: "Present Simple (3rd person -s)" depends on
 *  "Subject Pronouns" and "Present Simple (base form)". */
export interface GrammarPoint {
  id: string;
  language: Language;
  level: string;
  /** Short title shown in the graph node, e.g. "Present Simple -s". */
  title: string;
  /** 1-2 sentence summary shown when the node is clicked. */
  summary: string;
  /** Ids of other GrammarPoints the learner should know first.
   *  The GrammarMap draws arrows from each prerequisite → this node. */
  prerequisites: string[];
  /** Wrong-vs-right pairs for common learner mistakes on this point.
   *  Surfaced as "易混点" in the GrammarModule side panel. */
  pitfalls: { wrong: string; right: string; note?: string }[];
}

/** Per-grammar-point mistake tally, persisted in localStorage by the
 *  GrammarModule. Used to mark nodes red in the GrammarMap. */
export interface MistakeLogEntry {
  grammarPointId: string;
  language: Language;
  /** Total times answered wrong on quizzes tagged with this point. */
  wrongCount: number;
  /** ISO timestamp of the most recent wrong answer. */
  lastWrongAt: string;
}

// ─────────────────────────────────────────────────────────────
//  Phase 6 (L3) — Listening grading
// ─────────────────────────────────────────────────────────────

/** Listening scenes tag the audio with a real-world context so the
 *  ListeningModule can group and recommend by scenario. */
export type ListeningScene =
  | "daily"
  | "airport"
  | "restaurant"
  | "shopping"
  | "phone-call"
  | "news"
  | "weather"
  | "directions";

// ─────────────────────────────────────────────────────────────
//  Phase 3 — Review layer (SRS / SM-2)
// ─────────────────────────────────────────────────────────────

/** A single SRS-tracked item. One per (userId, itemId) — but since
 *  the frontend store is per-browser, we key by `itemId` alone.
 *  `kind` lets the ReviewModule render the right card face
 *  (word card vs grammar quiz). */
export interface ReviewItem {
  /** Stable id of the underlying word/quiz/listening item. */
  itemId: string;
  /** Discriminator for the ReviewModule UI. */
  kind: "word" | "quiz" | "listening" | "speaking";
  /** Snapshot of the word/phrase for quick display without re-fetching
   *  content. Front/back text the user actually reviews. */
  front: string;
  back: string;
  /** Optional extra hint shown on the back (phonetic / explain). */
  hint?: string;
  language: Language;
  level?: string;
  /** SRS state — see src/lib/sm2.ts */
  srs: SrsState;
}

/** SM-2 scheduling state. Persisted in localStorage. */
export interface SrsState {
  /** Ease factor — multiplier for the next interval. Starts at 2.5. */
  easeFactor: number;
  /** Current interval in days. */
  interval: number;
  /** Number of consecutive correct reviews. */
  repetitions: number;
  /** ISO timestamp of when this item is next due. */
  nextReviewAt: string;
  /** ISO timestamp of the last review. */
  lastReviewedAt?: string;
}

/** User's self-rating of how well they recalled an item.
 *  Mapped to the SM-2 quality scale (0-5). */
export type ReviewQuality = "again" | "hard" | "good" | "easy";

// ─────────────────────────────────────────────────────────────
//  Phase 4 — Conversation layer (natural dialogue)
// ─────────────────────────────────────────────────────────────

/** A multi-turn dialogue scene. The ConversationEngine walks the
 *  `turns` graph based on the user's spoken/typed input. */
export interface DialogueScene {
  id: string;
  language: Language;
  level: string;
  /** Scenario id, e.g. "ordering-food", "asking-directions". */
  scenario: string;
  /** Short human-readable title, e.g. "点餐". */
  title: string;
  /** The opening NPC line (greeting). */
  opening: string;
  /** Graph of turns. Key = turn id; "start" is reserved for the entry. */
  turns: Record<string, DialogueTurn>;
  /** Id of the turn to enter after the opening line. */
  startTurnId: string;
}

/** One node in the dialogue graph. The NPC says `prompt`, then waits
 *  for the user. The user's reply is matched against `branches`; the
 *  first branch whose keywords match (or the fallback) decides the
 *  next turn. `isTerminal` ends the scene. */
export interface DialogueTurn {
  id: string;
  /** What the NPC says (TTS reads this). */
  prompt: string;
  /** Optional translation shown beneath the bubble. */
  promptTranslation?: string;
  branches: DialogueBranch[];
  /** Branch taken when no keyword matches. Usually loops back or
   *  asks the user to repeat. */
  fallbackBranchId: string;
  isTerminal?: boolean;
}

/** A conditional edge in the dialogue graph. */
export interface DialogueBranch {
  /** Keywords (lowercased). If any appear in the user's reply, this
   *  branch is selected. Empty array = always-match (use carefully). */
  keywords: string[];
  /** Id of the next turn. */
  nextTurnId: string;
}

export interface UserProgress {
  wordsLearned: number;
  wordCorrect: number;
  wordTotal: number;
  quizzesDone: number;
  quizCorrect: number;
  quizTotal: number;
  speakingMinutes: number;
  listeningMinutes: number;
  perDay: Record<string, number>;
  moduleScores: Record<string, number>; // words/grammar/listening/speaking -> 0-100
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  color: string; // tailwind color class
  requirement: { type: "streak" | "words" | "quizzes" | "speaking" | "listening" | "level"; value: number };
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  avatar?: string;
  topic: string;
  content: string;
  createdAt: number;
  likes: string[]; // userIds
  comments: Comment[];
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: number;
}
