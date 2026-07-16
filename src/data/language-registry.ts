/**
 * 语言注册表 — 全站语言配置的单一数据源。
 *
 * 所有语言相关配置（UI 语言、学习语言、等级体系、URL slug、OG locale、
 * TTS 标签等）都从这里派生。新增语言只需在此添加一条配置 + 加翻译文件。
 *
 * 区分两个概念：
 *   - isUiLanguage：有界面翻译（locales/xx/translation.json）→ 进 i18n、hreflang
 *   - isLearnLanguage：有 language hub + 词汇数据 → 进 sitemap 学习页、词汇页
 *
 * Phase 1：it/th/yue 标记为 isUiLanguage=true, isLearnLanguage=false（与现状一致）
 * Phase 2：补全词汇数据后改为 isLearnLanguage=true
 */
import type { Language } from "../types";

export type LevelSystem = "CEFR" | "JLPT" | "HSK" | "TOPIK";

export interface LanguageRegistryEntry {
  /** ISO 639-1 语言代码，全站唯一 key */
  code: Language;
  /** URL slug（language hub 页用，如 /languages/japanese） */
  slug: string;

  /** 是否为 UI 语言（有界面翻译） */
  isUiLanguage: boolean;
  /** 是否为学习语言（有 language hub + 词汇数据） */
  isLearnLanguage: boolean;

  /** 中文展示名（用于中文 UI fallback） */
  name: string;
  /** 英文名 */
  englishName: string;
  /** 原文名（母语写法） */
  nativeName: string;
  /** 旗帜 emoji */
  flag: string;
  /** 一句话标语 */
  tagline: string;

  /** Open Graph locale（如 ja_JP） */
  ogLocale: string;
  /** Web Speech API / TTS 语言标签（如 ja-JP） */
  ttsTag: string;

  /** 等级体系 */
  levelSystem: LevelSystem;
  /** 等级列表（从低到高） */
  levels: string[];
}

export const LANGUAGE_REGISTRY: LanguageRegistryEntry[] = [
  // ── 7 个完整学习语言 ──
  {
    code: "en",
    slug: "english",
    isUiLanguage: true,
    isLearnLanguage: true,
    name: "英语",
    englishName: "English",
    nativeName: "English",
    flag: "🇬🇧",
    tagline: "Global lingua franca",
    ogLocale: "en_US",
    ttsTag: "en-US",
    levelSystem: "CEFR",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
  },
  {
    code: "zh",
    slug: "chinese",
    isUiLanguage: true,
    isLearnLanguage: true,
    name: "汉语",
    englishName: "Chinese",
    nativeName: "中文",
    flag: "🇨🇳",
    tagline: "古老而充满生命力的表意文字",
    ogLocale: "zh_CN",
    ttsTag: "zh-CN",
    levelSystem: "HSK",
    levels: ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6", "HSK7", "HSK8", "HSK9"],
  },
  {
    code: "ja",
    slug: "japanese",
    isUiLanguage: true,
    isLearnLanguage: true,
    name: "日语",
    englishName: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
    tagline: "含蓄优雅的东方韵律",
    ogLocale: "ja_JP",
    ttsTag: "ja-JP",
    levelSystem: "JLPT",
    levels: ["N5", "N4", "N3", "N2", "N1"],
  },
  {
    code: "ko",
    slug: "korean",
    isUiLanguage: true,
    isLearnLanguage: true,
    name: "韩语",
    englishName: "Korean",
    nativeName: "한국어",
    flag: "🇰🇷",
    tagline: "鲜活流行的韩流文化",
    ogLocale: "ko_KR",
    ttsTag: "ko-KR",
    levelSystem: "TOPIK",
    levels: ["TOPIK1", "TOPIK2", "TOPIK3", "TOPIK4", "TOPIK5", "TOPIK6"],
  },
  {
    code: "es",
    slug: "spanish",
    isUiLanguage: true,
    isLearnLanguage: true,
    name: "西班牙语",
    englishName: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    tagline: "热情如火的拉丁之声",
    ogLocale: "es_ES",
    ttsTag: "es-ES",
    levelSystem: "CEFR",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
  },
  {
    code: "fr",
    slug: "french",
    isUiLanguage: true,
    isLearnLanguage: true,
    name: "法语",
    englishName: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    tagline: "浪漫优雅的语言艺术",
    ogLocale: "fr_FR",
    ttsTag: "fr-FR",
    levelSystem: "CEFR",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
  },
  {
    code: "de",
    slug: "german",
    isUiLanguage: true,
    isLearnLanguage: true,
    name: "德语",
    englishName: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    tagline: "严谨精准的哲学与工程之语",
    ogLocale: "de_DE",
    ttsTag: "de-DE",
    levelSystem: "CEFR",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
  },
  // ── 以下语言 Phase 2 起补全词汇+场景数据，已升级为 isLearnLanguage=true ──
  {
    code: "it",
    slug: "italian",
    isUiLanguage: true,
    isLearnLanguage: true,
    name: "意大利语",
    englishName: "Italian",
    nativeName: "Italiano",
    flag: "🇮🇹",
    tagline: "热情浪漫的地中海之声",
    ogLocale: "it_IT",
    ttsTag: "it-IT",
    levelSystem: "CEFR",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
  },
  {
    code: "th",
    slug: "thai",
    isUiLanguage: true,
    isLearnLanguage: true,
    name: "泰语",
    englishName: "Thai",
    nativeName: "ภาษาไทย",
    flag: "🇹🇭",
    tagline: "五个声调的微笑之语",
    ogLocale: "th_TH",
    ttsTag: "th-TH",
    levelSystem: "CEFR",
    levels: ["A1", "A2", "B1", "B2", "C1"],
  },
  {
    code: "yue",
    slug: "cantonese",
    isUiLanguage: true,
    isLearnLanguage: true,
    name: "粤语",
    englishName: "Cantonese",
    nativeName: "粵語",
    flag: "🇭🇰",
    tagline: "九声六调的岭南文化载体",
    ogLocale: "zh_HK",
    ttsTag: "yue-CN",
    levelSystem: "CEFR",
    levels: ["A1", "A2", "B1", "B2"],
  },
];

// ============================================================
// 派生常量 — 各模块从这里消费，不再各自硬编码
// ============================================================

/** UI 语言代码列表（有界面翻译的语言），用于 i18n / hreflang */
export const UI_LANGUAGES: Language[] = LANGUAGE_REGISTRY.filter(
  (e) => e.isUiLanguage
).map((e) => e.code);

/** 学习语言条目列表（有 language hub + 词汇数据的语言） */
export const LEARN_LANGUAGES = LANGUAGE_REGISTRY.filter((e) => e.isLearnLanguage);

/** 学习语言代码列表，用于 sitemap locale 循环 */
export const LEARN_LANG_CODES: Language[] = LEARN_LANGUAGES.map((e) => e.code);

/** 代码 → slug 映射（如 ja → japanese） */
export const LANG_CODE_TO_SLUG: Record<string, string> = Object.fromEntries(
  LEARN_LANGUAGES.map((e) => [e.code, e.slug])
);

/** slug → 代码 映射（如 japanese → ja） */
export const LANG_SLUG_TO_CODE: Record<string, string> = Object.fromEntries(
  LEARN_LANGUAGES.map((e) => [e.slug, e.code])
);

/** 学习语言的 URL slug 列表（如 ["english","japanese",...]） */
export const LEARN_LANG_SLUGS: string[] = LEARN_LANGUAGES.map((e) => e.slug);

/** 按代码查找 registry 条目 */
export function getRegistryEntry(code: string): LanguageRegistryEntry | undefined {
  return LANGUAGE_REGISTRY.find((e) => e.code === code);
}
