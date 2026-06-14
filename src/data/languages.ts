import type { Language, LanguageMeta } from "../types";

export const LANGUAGES: LanguageMeta[] = [
  {
    id: "en",
    name: "英语",
    native: "English",
    flag: "🇬🇧",
    tagline: "Global lingua franca",
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
  {
    id: "zh",
    name: "汉语",
    native: "中文",
    flag: "🇨🇳",
    tagline: "古老而充满生命力的表意文字",
    levels: ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6"],
  },
  {
    id: "es",
    name: "西班牙语",
    native: "Español",
    flag: "🇪🇸",
    tagline: "热情如火的拉丁之声",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
  },
  {
    id: "fr",
    name: "法语",
    native: "Français",
    flag: "🇫🇷",
    tagline: "浪漫优雅的语言艺术",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
  },
  {
    id: "de",
    name: "德语",
    native: "Deutsch",
    flag: "🇩🇪",
    tagline: "严谨精准的哲学与工程之语",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
  },
];

export const getLanguage = (id: string) =>
  LANGUAGES.find((l) => l.id === id) ?? LANGUAGES[0];
