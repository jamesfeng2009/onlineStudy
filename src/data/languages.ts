import type { Language, LanguageMeta } from "../types";

export const LANGUAGES: LanguageMeta[] = [
  {
    id: "en",
    name: "英语",
    native: "English",
    flag: "🇬🇧",
    tagline: "全球通用语言",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
  },
  {
    id: "ja",
    name: "日语",
    native: "日本語",
    flag: "🇯🇵",
    tagline: "含蓄优雅的东方韵律",
    levels: ["N5", "N4", "N3", "N2", "N1"],
  },
  {
    id: "ko",
    name: "韩语",
    native: "한국어",
    flag: "🇰🇷",
    tagline: "鲜活流行的韩流文化",
    levels: ["初级", "中级", "高级"],
  },
];

export const getLanguage = (id: Language) =>
  LANGUAGES.find((l) => l.id === id) ?? LANGUAGES[0];
