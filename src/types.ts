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

export type Language = "en" | "ja" | "ko" | "zh" | "es" | "fr" | "de";

export interface LanguageMeta {
  id: Language;
  name: string;
  native: string;
  flag: string;
  tagline: string;
  levels: string[];
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
}

export interface QuizItem {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explain: string;
  language: Language;
}

export interface ListeningItem {
  id: string;
  title: string;
  script: string;
  blanks: { index: number; answer: string }[];
  language: Language;
}

export interface SpeakingPhrase {
  id: string;
  phrase: string;
  translation: string;
  phonetic?: string;
  language: Language;
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
