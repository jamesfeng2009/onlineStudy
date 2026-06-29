/**
 * SEO/GEO 中央配置模块
 *
 * 所有 SEO 相关的常量和工具函数集中在这里，
 * 内容变更（新增题目/单词）不需要修改此模块。
 * 只在以下情况需要改：
 * - 新增语言
 * - 域名变更
 * - 新增静态页面路由
 */

export const SITE_URL = "https://lang-oria.com";
export const SITE_NAME = "LangOria";
export const SITE_DESCRIPTION =
  "Immersive language learning — vocabulary, grammar, speaking and listening exercises for English, Japanese, Chinese, Korean, Spanish, French and German.";

/** 所有支持的 locale（用于 hreflang + sitemap） */
export const LOCALES = ["en", "zh", "ja", "ko", "es", "fr", "de"] as const;
export type Locale = (typeof LOCALES)[number];

/** 默认语言（无 URL 前缀） */
export const DEFAULT_LOCALE: Locale = "en";

/** og:locale 映射 */
export const OG_LOCALES: Record<Locale, string> = {
  en: "en_US",
  zh: "zh_CN",
  ja: "ja_JP",
  ko: "ko_KR",
  es: "es_ES",
  fr: "fr_FR",
  de: "de_DE",
};

/** 语言 slug → URL slug 映射（/languages/:langSlug） */
export const LANG_SLUGS: Record<Locale, string> = {
  en: "english",
  zh: "chinese",
  ja: "japanese",
  ko: "korean",
  es: "spanish",
  fr: "french",
  de: "german",
};

/** 生成带 locale 前缀的完整 URL */
export function localeUrl(locale: Locale, path: string): string {
  const cleanPath = path.split("?")[0].split("#")[0];
  if (locale === DEFAULT_LOCALE) {
    return `${SITE_URL}${cleanPath === "/" ? "/" : cleanPath}`;
  }
  if (cleanPath === "/" || cleanPath === "") return `${SITE_URL}/${locale}`;
  return `${SITE_URL}/${locale}${cleanPath}`;
}

/** 静态 SEO 页面列表（不含博客文章和动态内容） */
export interface SitemapEntry {
  path: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
  /** 是否对所有语言生成 hreflang（默认 true） */
  hreflang?: boolean;
}

export const STATIC_PAGES: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: 1.0 },
  { path: "/courses", changefreq: "weekly", priority: 0.9 },
  { path: "/blog", changefreq: "daily", priority: 0.9 },
  { path: "/faq", changefreq: "monthly", priority: 0.7 },
  { path: "/languages", changefreq: "monthly", priority: 0.8 },
  // 语言主页
  ...LOCALES.map((l) => ({
    path: `/languages/${LANG_SLUGS[l]}`,
    changefreq: "monthly" as const,
    priority: 0.8,
  })),
  // 词汇总览页
  ...LOCALES.map((l) => ({
    path: `/languages/${LANG_SLUGS[l]}/vocabulary`,
    changefreq: "weekly" as const,
    priority: 0.7,
  })),
  // 场景页
  ...LOCALES.flatMap((l) =>
    ["travel", "business", "food", "small-talk"].map((s) => ({
      path: `/languages/${LANG_SLUGS[l]}/scenarios/${s}`,
      changefreq: "weekly" as const,
      priority: 0.7,
    }))
  ),
];
