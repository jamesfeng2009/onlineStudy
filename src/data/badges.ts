import type { Badge } from "../types";

export const BADGES: Badge[] = [
  // ===== 连续学习 =====
  {
    id: "streak-3",
    title: "三日坚持",
    description: "连续学习 3 天，习惯养成中！",
    icon: "Flame",
    color: "from-orange-400 to-rose-500",
    requirement: { type: "streak", value: 3 },
  },
  {
    id: "streak-7",
    title: "一周之星",
    description: "连续学习 7 天，已形成稳定习惯。",
    icon: "Zap",
    color: "from-amber-300 to-orange-500",
    requirement: { type: "streak", value: 7 },
  },
  {
    id: "streak-30",
    title: "月度冠军",
    description: "连续学习 30 天，你是真正的学习者！",
    icon: "Trophy",
    color: "from-yellow-300 to-amber-500",
    requirement: { type: "streak", value: 30 },
  },
  // P2-2: 新增长程连续学习勋章
  {
    id: "streak-100",
    title: "百日筑基",
    description: "连续学习 100 天，自律已成为你的底色。",
    icon: "Flame",
    color: "from-rose-500 to-red-700",
    requirement: { type: "streak", value: 100 },
  },
  {
    id: "streak-365",
    title: "一年之约",
    description: "连续学习满一年，时间是最高的奖赏。",
    icon: "Trophy",
    color: "from-amber-300 via-rose-400 to-fuchsia-500",
    requirement: { type: "streak", value: 365 },
  },

  // ===== 词汇 =====
  {
    id: "words-20",
    title: "词汇新星",
    description: "掌握 20 个新单词。",
    icon: "BookOpen",
    color: "from-sky-400 to-blue-600",
    requirement: { type: "words", value: 20 },
  },
  {
    id: "words-100",
    title: "词汇达人",
    description: "掌握 100 个新单词。",
    icon: "BookMarked",
    color: "from-cyan-400 to-teal-600",
    requirement: { type: "words", value: 100 },
  },
  // P2-2: 新增高阶词汇勋章
  {
    id: "words-500",
    title: "词典编纂者",
    description: "掌握 500 个新单词，已能聊大部分日常话题。",
    icon: "BookMarked",
    color: "from-emerald-400 to-cyan-600",
    requirement: { type: "words", value: 500 },
  },
  {
    id: "words-1000",
    title: "词汇巨匠",
    description: "掌握 1000 个新单词，词汇量迈入流利区间。",
    icon: "BookOpen",
    color: "from-violet-400 to-fuchsia-600",
    requirement: { type: "words", value: 1000 },
  },

  // ===== 语法 / 测验 =====
  {
    id: "quizzes-10",
    title: "语法练习生",
    description: "完成 10 道语法练习题。",
    icon: "Pencil",
    color: "from-emerald-400 to-green-600",
    requirement: { type: "quizzes", value: 10 },
  },
  {
    id: "quizzes-50",
    title: "语法大师",
    description: "完成 50 道语法练习题。",
    icon: "GraduationCap",
    color: "from-lime-400 to-emerald-600",
    requirement: { type: "quizzes", value: 50 },
  },
  // P2-2: 新增高阶语法勋章
  {
    id: "quizzes-200",
    title: "语法宗师",
    description: "完成 200 道语法练习题，已掌握体系化语法。",
    icon: "GraduationCap",
    color: "from-fuchsia-400 to-purple-700",
    requirement: { type: "quizzes", value: 200 },
  },

  // ===== 口语 / 听力 =====
  {
    id: "speaking-10",
    title: "开口勇者",
    description: "口语跟读累计 10 分钟。",
    icon: "Mic",
    color: "from-rose-400 to-pink-600",
    requirement: { type: "speaking", value: 10 },
  },
  // P2-2: 新增口语时长勋章
  {
    id: "speaking-60",
    title: "舌灿莲花",
    description: "口语跟读累计 60 分钟，敢说才会说。",
    icon: "Mic",
    color: "from-rose-500 to-red-700",
    requirement: { type: "speaking", value: 60 },
  },
  {
    id: "listening-10",
    title: "聆听者",
    description: "听力训练累计 10 分钟。",
    icon: "Headphones",
    color: "from-violet-400 to-purple-600",
    requirement: { type: "listening", value: 10 },
  },
  // P2-2: 新增听力时长勋章
  {
    id: "listening-60",
    title: "耳濡目染",
    description: "听力训练累计 60 分钟，耳朵已经习惯这门语言。",
    icon: "Headphones",
    color: "from-violet-500 to-indigo-700",
    requirement: { type: "listening", value: 60 },
  },

  // ===== 等级 =====
  {
    id: "level-5",
    title: "步步进阶",
    description: "达到等级 5。",
    icon: "Sparkles",
    color: "from-fuchsia-400 to-rose-600",
    requirement: { type: "level", value: 5 },
  },
  {
    id: "level-10",
    title: "登堂入室",
    description: "达到等级 10。",
    icon: "Crown",
    color: "from-amber-300 to-yellow-500",
    requirement: { type: "level", value: 10 },
  },
  // P2-2: 新增高等级勋章
  {
    id: "level-25",
    title: "探索者",
    description: "达到等级 25，已是一名成熟的探险家。",
    icon: "Crown",
    color: "from-sky-400 via-cyan-400 to-emerald-500",
    requirement: { type: "level", value: 25 },
  },
  {
    id: "level-50",
    title: "语言学者",
    description: "达到等级 50，已可独当一面地使用这门语言。",
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
