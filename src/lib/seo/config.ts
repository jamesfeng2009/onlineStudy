/**
 * SEO/GEO 中央配置模块
 *
 * 所有 SEO 相关的常量和工具函数集中在这里，
 * 内容变更（新增题目/单词）不需要修改此模块。
 * 只在以下情况需要改：
 * - 新增语言 → 改 src/data/language-registry.ts
 * - 域名变更
 * - 新增静态页面路由
 *
 * 本文件不再硬编码 LOCALES / LANG_SLUGS / OG_LOCALES，
 * 全部从 src/lib/i18n/registry.ts 派生（单一事实源）。
 */

import {
  UI_LANGUAGES,
  LEARN_LANGUAGES,
  LANG_CODE_TO_SLUG,
  OG_LOCALE_MAP,
  type LanguageCode,
} from "../i18n/registry";

export const SITE_URL = "https://lang-oria.com";
export const SITE_NAME = "LangOria";
export const SITE_DESCRIPTION =
  "Immersive language learning — vocabulary, grammar, speaking and listening exercises for English, Japanese, Chinese, Korean, Spanish, French and German.";

/** 所有支持的 locale（用于 hreflang + sitemap），从 registry 派生 */
export const LOCALES = UI_LANGUAGES as readonly LanguageCode[];
export type Locale = LanguageCode;

/** 默认语言（无 URL 前缀） */
export const DEFAULT_LOCALE: Locale = "en";

/** og:locale 映射，从 registry 派生 */
export const OG_LOCALES = OG_LOCALE_MAP;

/** 语言 slug → URL slug 映射（/languages/:langSlug），从 registry 派生 */
export const LANG_SLUGS = LANG_CODE_TO_SLUG;

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
  // 语言主页 — 只包含有 UI 翻译的语言（hreflang 需要对应 locale 变体）
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
