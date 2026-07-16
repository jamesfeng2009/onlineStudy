import type { Badge } from "../types";

export const BADGES: Badge[] = [
  // ===== Streak =====
  {
    id: "streak-3",
    title: "3-Day Streak",
    description: "Study 3 days in a row to build a small habit",
    icon: "Flame",
    color: "from-orange-400 to-rose-500",
    requirement: { type: "streak", value: 3 },
  },
  {
    id: "streak-7",
    title: "Week Star",
    description: "Study 7 days in a row",
    icon: "Zap",
    color: "from-amber-300 to-orange-500",
    requirement: { type: "streak", value: 7 },
  },
  {
    id: "streak-30",
    title: "Monthly Champion",
    description: "Study 30 days in a row",
    icon: "Trophy",
    color: "from-yellow-300 to-amber-500",
    requirement: { type: "streak", value: 30 },
  },
  {
    id: "streak-100",
    title: "100-Day Foundation",
    description: "Study 100 days in a row — discipline is now part of you.",
    icon: "Flame",
    color: "from-rose-500 to-red-700",
    requirement: { type: "streak", value: 100 },
  },
  {
    id: "streak-365",
    title: "One-Year Promise",
    description: "Study for a full year — time is the highest reward.",
    icon: "Trophy",
    color: "from-amber-300 via-rose-400 to-fuchsia-500",
    requirement: { type: "streak", value: 365 },
  },

  // ===== Words =====
  {
    id: "words-20",
    title: "Vocabulary Rising Star",
    description: "Master 20 new words",
    icon: "BookOpen",
    color: "from-sky-400 to-blue-600",
    requirement: { type: "words", value: 20 },
  },
  {
    id: "words-100",
    title: "Vocabulary Master",
    description: "Master 100 new words",
    icon: "BookMarked",
    color: "from-cyan-400 to-teal-600",
    requirement: { type: "words", value: 100 },
  },
  {
    id: "words-500",
    title: "Vocabulary Builder",
    description: "Master 500 new words — enough to talk about most everyday topics.",
    icon: "BookMarked",
    color: "from-emerald-400 to-cyan-600",
    requirement: { type: "words", value: 500 },
  },
  {
    id: "words-1000",
    title: "Vocabulary Giant",
    description: "Master 1000 new words — your vocabulary is entering the fluent range.",
    icon: "BookOpen",
    color: "from-violet-400 to-fuchsia-600",
    requirement: { type: "words", value: 1000 },
  },

  // ===== Grammar / Quizzes =====
  {
    id: "quizzes-10",
    title: "Grammar Trainee",
    description: "Complete 10 grammar questions",
    icon: "Pencil",
    color: "from-emerald-400 to-green-600",
    requirement: { type: "quizzes", value: 10 },
  },
  {
    id: "quizzes-50",
    title: "Grammar Master",
    description: "Complete 50 grammar questions",
    icon: "GraduationCap",
    color: "from-lime-400 to-emerald-600",
    requirement: { type: "quizzes", value: 50 },
  },
  {
    id: "quizzes-200",
    title: "Grammar Grandmaster",
    description: "Complete 200 grammar questions — you have mastered systematic grammar.",
    icon: "GraduationCap",
    color: "from-fuchsia-400 to-purple-700",
    requirement: { type: "quizzes", value: 200 },
  },

  // ===== Speaking / Listening =====
  {
    id: "speaking-10",
    title: "Speaker",
    description: "Repeat aloud for 10 minutes total",
    icon: "Mic",
    color: "from-rose-400 to-pink-600",
    requirement: { type: "speaking", value: 10 },
  },
  {
    id: "speaking-60",
    title: "Fluent Speaker",
    description: "Repeat aloud for 60 minutes total — dare to speak and you will speak.",
    icon: "Mic",
    color: "from-rose-500 to-red-700",
    requirement: { type: "speaking", value: 60 },
  },
  {
    id: "listening-10",
    title: "Listener",
    description: "Listen for 10 minutes total",
    icon: "Headphones",
    color: "from-violet-400 to-purple-600",
    requirement: { type: "listening", value: 10 },
  },
  {
    id: "listening-60",
    title: "Attentive Listener",
    description: "Listen for 60 minutes total — your ears are getting used to this language.",
    icon: "Headphones",
    color: "from-violet-500 to-indigo-700",
    requirement: { type: "listening", value: 60 },
  },

  // ===== Level =====
  {
    id: "level-5",
    title: "Step by Step",
    description: "Reach level 5",
    icon: "Sparkles",
    color: "from-fuchsia-400 to-rose-600",
    requirement: { type: "level", value: 5 },
  },
  {
    id: "level-10",
    title: "Advanced",
    description: "Reach level 10",
    icon: "Crown",
    color: "from-amber-300 to-yellow-500",
    requirement: { type: "level", value: 10 },
  },
  {
    id: "level-25",
    title: "Explorer",
    description: "Reach level 25 — you are a seasoned explorer.",
    icon: "Crown",
    color: "from-sky-400 via-cyan-400 to-emerald-500",
    requirement: { type: "level", value: 25 },
  },
  {
    id: "level-50",
    title: "Linguist",
    description: "Reach level 50 — you can use this language independently.",
    icon: "Crown",
    color: "from-amber-300 via-fuchsia-400 to-violet-600",
    requirement: { type: "level", value: 50 },
  },
];

export const checkBadge = (badge: Badge, stats: {
  streak: number;
  wordsLearned: number;
  quizzesDone: number;
  speakingMinutes: number;
  listeningMinutes: number;
  level: number;
}) => {
  const { type, value } = badge.requirement;
  switch (type) {
    case "streak": return stats.streak >= value;
    case "words": return stats.wordsLearned >= value;
    case "quizzes": return stats.quizzesDone >= value;
    case "speaking": return stats.speakingMinutes >= value;
    case "listening": return stats.listeningMinutes >= value;
    case "level": return stats.level >= value;
  }
};
