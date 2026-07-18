/**
 * Server-side i18n Registry — 从 language-registry.ts 派生的统一常量模块
 *
 * 所有语言相关的派生常量集中在这里，消除各模块的重复定义。
 * 修改语言配置时，只需改 src/data/language-registry.ts。
 *
 * 性能说明：所有常量都是 module-level 的纯计算，构建时内联，
 * 运行时零开销。Map/Record 查找均为 O(1)。
 *
 * 注意：此文件同时被前端 (src/lib/i18n/registry.ts) 和服务端
 * (server/routes/seo.ts) 使用。前端版本通过 Vite alias 解析，
 * 服务端版本直接从此文件导入（serverless 函数打包范围内）。
 */

export interface LanguageRegistryEntry {
  code: string;
  slug: string;
  isUiLanguage: boolean;
  isLearnLanguage: boolean;
  ogLocale: string;
}

/**
 * 语言注册表 — 与 src/data/language-registry.ts 保持同步
 *
 * 由于 Vercel serverless 函数打包时只包含 api/ 和 server/ 目录，
 * 无法直接 import src/data/language-registry.ts，因此在此处内联
 * 定义相同的数据。新增语言时，需要同时更新两个文件。
 */
export const LANGUAGE_REGISTRY: LanguageRegistryEntry[] = [
  {
    code: "en",
    slug: "english",
    isUiLanguage: true,
    isLearnLanguage: true,
    ogLocale: "en_US",
  },
  {
    code: "zh",
    slug: "chinese",
    isUiLanguage: true,
    isLearnLanguage: true,
    ogLocale: "zh_CN",
  },
  {
    code: "ja",
    slug: "japanese",
    isUiLanguage: true,
    isLearnLanguage: true,
    ogLocale: "ja_JP",
  },
  {
    code: "ko",
    slug: "korean",
    isUiLanguage: true,
    isLearnLanguage: true,
    ogLocale: "ko_KR",
  },
  {
    code: "es",
    slug: "spanish",
    isUiLanguage: true,
    isLearnLanguage: true,
    ogLocale: "es_ES",
  },
  {
    code: "fr",
    slug: "french",
    isUiLanguage: true,
    isLearnLanguage: true,
    ogLocale: "fr_FR",
  },
  {
    code: "de",
    slug: "german",
    isUiLanguage: true,
    isLearnLanguage: true,
    ogLocale: "de_DE",
  },
  {
    code: "it",
    slug: "italian",
    isUiLanguage: true,
    isLearnLanguage: true,
    ogLocale: "it_IT",
  },
  {
    code: "th",
    slug: "thai",
    isUiLanguage: true,
    isLearnLanguage: true,
    ogLocale: "th_TH",
  },
  {
    code: "yue",
    slug: "cantonese",
    isUiLanguage: true,
    isLearnLanguage: true,
    ogLocale: "zh_HK",
  },
  {
    code: "ms",
    slug: "malay",
    isUiLanguage: false,
    isLearnLanguage: true,
    ogLocale: "ms_MY",
  },
  {
    code: "id",
    slug: "indonesian",
    isUiLanguage: false,
    isLearnLanguage: true,
    ogLocale: "id_ID",
  },
  {
    code: "vi",
    slug: "vietnamese",
    isUiLanguage: false,
    isLearnLanguage: true,
    ogLocale: "vi_VN",
  },
];

// ============================================================
// 基础类型
// ============================================================

export type LanguageCode = string;

// ============================================================
// UI 语言（有界面翻译，进 i18n / hreflang / URL 前缀）
// ============================================================

/** UI 语言代码列表（有 translation.json 的语言） */
export const UI_LANGUAGES: LanguageCode[] = LANGUAGE_REGISTRY.filter(
  (e) => e.isUiLanguage
).map((e) => e.code);

/** 带 URL 前缀的 UI 语言（en 为默认，无前缀） */
export const PREFIXED_UI_LANGUAGES = UI_LANGUAGES.filter(
  (l) => l !== "en"
) as readonly string[];

// ============================================================
// 学习语言（有 language hub + 词汇数据，进 sitemap）
// ============================================================

/** 学习语言条目列表 */
export const LEARN_LANGUAGES: LanguageRegistryEntry[] =
  LANGUAGE_REGISTRY.filter((e) => e.isLearnLanguage);

/** 学习语言代码列表 */
export const LEARN_LANG_CODES: LanguageCode[] = LEARN_LANGUAGES.map(
  (e) => e.code
);

/** 学习语言 URL slug 列表（如 ["english", "japanese", ...]） */
export const LEARN_LANG_SLUGS: string[] = LEARN_LANGUAGES.map((e) => e.slug);

/** learn-only 语言 slug（无 UI 翻译，有学习内容） */
export const LEARN_ONLY_SLUGS: string[] = LEARN_LANGUAGES.filter(
  (e) => !e.isUiLanguage
).map((e) => e.slug);

// ============================================================
// 映射表（O(1) 查找，构建时内联）
// ============================================================

/** 语言代码 → URL slug（如 ja → japanese） */
export const LANG_CODE_TO_SLUG: Record<string, string> = Object.fromEntries(
  LEARN_LANGUAGES.map((e) => [e.code, e.slug])
);

/** URL slug → 语言代码（如 japanese → ja） */
export const LANG_SLUG_TO_CODE: Record<string, string> = Object.fromEntries(
  LEARN_LANGUAGES.map((e) => [e.slug, e.code])
);

/** 语言代码 → og:locale（如 ja → ja_JP） */
export const OG_LOCALE_MAP: Record<string, string> = Object.fromEntries(
  LANGUAGE_REGISTRY.map((e) => [e.code, e.ogLocale])
);

/** 语言代码 → 条目（快速查找） */
export const LANG_ENTRY_MAP: Record<string, LanguageRegistryEntry> =
  Object.fromEntries(LANGUAGE_REGISTRY.map((e) => [e.code, e]));

// ============================================================
// 工具函数（纯函数，无副作用，幂等）
// ============================================================

/** 判断是否为有效的 UI 语言代码 */
export function isUiLanguage(code: string): boolean {
  return UI_LANGUAGES.includes(code);
}

/** 判断是否为有效的学习语言 slug */
export function isLearnLangSlug(slug: string): boolean {
  return slug in LANG_SLUG_TO_CODE;
}

/** 从 slug 获取语言代码，未找到返回 undefined */
export function langCodeFromSlug(slug: string): string | undefined {
  return LANG_SLUG_TO_CODE[slug];
}

/** 从代码获取 slug，未找到返回 undefined */
export function langSlugFromCode(code: string): string | undefined {
  return LANG_CODE_TO_SLUG[code];
}

/** 获取 og:locale，未找到返回 "en_US" */
export function ogLocaleFor(code: string): string {
  return OG_LOCALE_MAP[code] ?? "en_US";
}
