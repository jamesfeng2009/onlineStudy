import type { Badge } from "../types";

export const BADGES: Badge[] = [
  {
    id: "b-streak-3",
    title: "三日坚持",
    description: "连续学习 3 天，习惯养成中！",
    icon: "Flame",
    color: "from-orange-400 to-rose-500",
    requirement: { type: "streak", value: 3 },
  },
  {
    id: "b-streak-7",
    title: "一周之星",
    description: "连续学习 7 天，已形成稳定习惯。",
    icon: "Zap",
    color: "from-amber-300 to-orange-500",
    requirement: { type: "streak", value: 7 },
  },
  {
    id: "b-streak-30",
    title: "月度冠军",
    description: "连续学习 30 天，你是真正的学习者！",
    icon: "Trophy",
    color: "from-yellow-300 to-amber-500",
    requirement: { type: "streak", value: 30 },
  },
  {
    id: "b-words-20",
    title: "词汇新星",
    description: "掌握 20 个新单词。",
    icon: "BookOpen",
    color: "from-sky-400 to-blue-600",
    requirement: { type: "words", value: 20 },
  },
  {
    id: "b-words-100",
    title: "词汇达人",
    description: "掌握 100 个新单词。",
    icon: "BookMarked",
    color: "from-cyan-400 to-teal-600",
    requirement: { type: "words", value: 100 },
  },
  {
    id: "b-quizzes-10",
    title: "语法练习生",
    description: "完成 10 道语法练习题。",
    icon: "Pencil",
    color: "from-emerald-400 to-green-600",
    requirement: { type: "quizzes", value: 10 },
  },
  {
    id: "b-quizzes-50",
    title: "语法大师",
    description: "完成 50 道语法练习题。",
    icon: "GraduationCap",
    color: "from-lime-400 to-emerald-600",
    requirement: { type: "quizzes", value: 50 },
  },
  {
    id: "b-speaking-10",
    title: "开口勇者",
    description: "口语跟读累计 10 分钟。",
    icon: "Mic",
    color: "from-rose-400 to-pink-600",
    requirement: { type: "speaking", value: 10 },
  },
  {
    id: "b-listening-10",
    title: "聆听者",
    description: "听力训练累计 10 分钟。",
    icon: "Headphones",
    color: "from-violet-400 to-purple-600",
    requirement: { type: "listening", value: 10 },
  },
  {
    id: "b-level-5",
    title: "步步进阶",
    description: "达到等级 5。",
    icon: "Sparkles",
    color: "from-fuchsia-400 to-rose-600",
    requirement: { type: "level", value: 5 },
  },
  {
    id: "b-level-10",
    title: "登堂入室",
    description: "达到等级 10。",
    icon: "Crown",
    color: "from-amber-300 to-yellow-500",
    requirement: { type: "level", value: 10 },
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
