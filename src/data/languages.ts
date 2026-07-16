import type { LanguageMeta } from "../types";
import { LEVEL_META } from "./level-meta";

/**
 * 支持的语言列表。
 *
 * P0-2: ko 等级从 ["初级","中级","高级","심화"] 迁移到 ["TOPIK1"..."TOPIK6"]
 * 对齐 TOPIK 官方分级 + CEFR。
 * th / yue 也对齐 CEFR A1-C1。
 */
export const LANGUAGES: LanguageMeta[] = [
  {
    id: "en",
    name: "英语",
    native: "English",
    flag: "🇬🇧",
    tagline: "Global lingua franca",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    levelMeta: LEVEL_META.en,
  },
  {
    id: "ja",
    name: "日语",
    native: "日本語",
    flag: "🇯🇵",
    tagline: "含蓄优雅的东方韵律",
    levels: ["N5", "N4", "N3", "N2", "N1"],
    levelMeta: LEVEL_META.ja,
  },
  {
    id: "ko",
    name: "韩语",
    native: "한국어",
    flag: "🇰🇷",
    tagline: "鲜活流行的韩流文化",
    levels: ["TOPIK1", "TOPIK2", "TOPIK3", "TOPIK4", "TOPIK5", "TOPIK6"],
    levelMeta: LEVEL_META.ko,
  },
  {
    id: "zh",
    name: "汉语",
    native: "中文",
    flag: "🇨🇳",
    tagline: "古老而充满生命力的表意文字",
    levels: ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6", "HSK7", "HSK8", "HSK9"],
    levelMeta: LEVEL_META.zh,
  },
  {
    id: "es",
    name: "西班牙语",
    native: "Español",
    flag: "🇪🇸",
    tagline: "热情如火的拉丁之声",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    levelMeta: LEVEL_META.es,
  },
  {
    id: "fr",
    name: "法语",
    native: "Français",
    flag: "🇫🇷",
    tagline: "浪漫优雅的语言艺术",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    levelMeta: LEVEL_META.fr,
  },
  {
    id: "de",
    name: "德语",
    native: "Deutsch",
    flag: "🇩🇪",
    tagline: "严谨精准的哲学与工程之语",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    levelMeta: LEVEL_META.de,
  },
  {
    id: "it",
    name: "意大利语",
    native: "Italiano",
    flag: "🇮🇹",
    tagline: "热情浪漫的地中海之声",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    levelMeta: LEVEL_META.it,
  },
  {
    id: "th",
    name: "泰语",
    native: "ภาษาไทย",
    flag: "🇹🇭",
    tagline: "五个声调的微笑之语",
    levels: ["A1", "A2", "B1", "B2", "C1"],
    levelMeta: LEVEL_META.th,
  },
  {
    id: "yue",
    name: "粤语",
    native: "粵語",
    flag: "🇭🇰",
    tagline: "九声六调的岭南文化载体",
    levels: ["A1", "A2", "B1", "B2"],
    levelMeta: LEVEL_META.yue,
  },
];

export const getLanguage = (id: string) =>
  LANGUAGES.find((l) => l.id === id) ?? LANGUAGES[0];
