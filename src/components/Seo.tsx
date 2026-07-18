import { useEffect } from "react";
import { buildLocalePath } from "../lib/i18n";
import { UI_LANGUAGES, OG_LOCALE_MAP } from "../lib/i18n/registry";

// 生产域名（Vercel 上确认过是 lang-oria.com）
const SITE_URL = "https://lang-oria.com";

/**
 * Default social-share image (1200×630, generated brand banner).
 * Pages can override via the `image` prop (e.g. blog post covers);
 * every other page falls back to this so og:image / twitter:image
 * are never empty.
 */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

// 站点支持的所有 locale，对应 og:locale 与 hreflang
// 从 registry 派生（单一事实源，与 i18n / sitemap 保持一致）
export const SITE_LOCALES: ReadonlyArray<{ code: string; og: string }> =
  UI_LANGUAGES.map((code) => ({ code, og: OG_LOCALE_MAP[code] ?? "en_US" }));

export type SiteLocaleCode = (typeof SITE_LOCALES)[number]["code"];

interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  type?: "website" | "article";
  /**
   * 当前 UI 语言（en / zh / ja / ...），用于 og:locale 与 canonical
   * 默认读 i18next 当前语言
   */
  lang?: string;
  /**
   * 当前页面的 pathname（如 "/blog"、"/blog/spaced-repetition-guide"）
   * 用于拼出每种 locale 下的 alternate URL
   * 默认读 window.location.pathname
   */
  pathname?: string;
  /**
   * 自定义多语言翻译 URL（按 baseLanguageCode 提供）
   * 如果不传则每个 locale 都指向同一个 pathname（够用 90% 场景）
   */
  localizedPaths?: { lang: string; path: string }[];
  /**
   * 当前页面的 canonical URL（不传则按 SITE_URL + pathname 生成）
   */
  canonical?: string;
  /**
   * Set true to emit <meta name="robots" content="noindex, nofollow">.
   * Use for pages we don't want crawled even if they slip past robots.txt
   * (learn player pages, internal dashboards, paginated listings, etc).
   */
  noindex?: boolean;
}

/**
 * 构造 hreflang 列表。每个语言一条 <link rel="alternate" hreflang="...">，
 * 另加一条 x-default 指向默认语言（en）。
 *
 * 每个 locale 的 URL 通过 buildLocalePath 加上对应前缀：
 *   en → 无前缀（/languages/english）
 *   zh → /zh/languages/english
 *   ja → /ja/languages/english
 *   ...
 *
 * 如果传入 localizedPaths（自定义每个语言的路径），则直接使用调用方
 * 提供的路径（调用方负责前缀），适用于博客翻译等场景。
 */
function buildAlternates(
  pathname: string,
  localizedPaths?: { lang: string; path: string }[]
) {
  const pathByLang = new Map<string, string>(
    (localizedPaths ?? []).map((p) => [p.lang, p.path])
  );
  return UI_LANGUAGES.map((code) => {
    const customPath = pathByLang.get(code);
    if (customPath) {
      return { lang: code, url: `${SITE_URL}${customPath}` };
    }
    const cleanTarget = (pathname ?? "/").split("?")[0].split("#")[0] || "/";
    const prefixed = buildLocalePath(code, cleanTarget);
    return {
      lang: code,
      url: `${SITE_URL}${prefixed}`,
    };
  });
}

/**
 * Build the canonical URL for the current page.
 *
 * IMPORTANT: the locale is derived from the **actual URL pathname**
 * (via `extractLocaleFromPath`), NOT from the user's current UI
 * language. Using the UI language caused Google to crawl phantom
 * URLs like `/de/languages/japanese/vocabulary/n1` (from a German
 * user visiting a Japanese page) that don't exist in the app.
 *
 *   "/languages/japanese/vocabulary/n1" → "/languages/japanese/vocabulary/n1"
 *   "/ja/blog/abc"                      → "/ja/blog/abc"
 *   "/de"                               → "/de"
 */
function resolveCanonical(
  _uiLang: string,
  pathname: string,
  canonical?: string
) {
  if (canonical) return canonical;
  const cleanPath = (pathname ?? "/").split("?")[0].split("#")[0];
  return `${SITE_URL}${cleanPath || "/"}`;
}

export function Seo({
  title,
  description,
  image,
  type = "website",
  lang,
  pathname,
  localizedPaths,
  canonical,
  noindex = false,
}: SeoProps) {
  const ogImage = image || DEFAULT_OG_IMAGE;
  const currentPath =
    pathname ?? (typeof window !== "undefined" ? window.location.pathname : "/");
  const currentLang =
    lang ??
    ((typeof window !== "undefined" ? document.documentElement.lang : "en") || "en");

  const alternates = buildAlternates(currentPath, localizedPaths);
  const xDefault = alternates.find((a) => a.lang === "en") ?? alternates[0];
  const canonicalUrl = resolveCanonical(currentLang, currentPath, canonical);
  const matchedOg = SITE_LOCALES.find((l) => l.code === currentLang);
  const ogLocale = matchedOg?.og ?? "en_US";

  // SSR: 将 SEO 数据写入全局对象，由 prerender 脚本注入 <head>
  if (typeof window === "undefined") {
    (globalThis as Record<string, unknown>).__SEO_DATA__ = {
      title,
      description,
      ogImage,
      canonicalUrl,
      ogLocale,
      alternates,
      xDefault,
      noindex,
      type,
    };
  }

  useEffect(() => {
    // ---------- 基础 meta ----------
    document.title = title;

    const setMeta = (key: string, content: string, attr: "name" | "property" = "name") => {
      if (!content) return;
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    if (description) setMeta("description", description);
    setMeta("og:title", title, "property");
    setMeta("og:type", type, "property");
    if (description) setMeta("og:description", description, "property");
    setMeta("og:url", canonicalUrl, "property");
    setMeta("og:site_name", "LangOria", "property");
    setMeta("og:locale", ogLocale, "property");
    setMeta("og:image", ogImage, "property");
    setMeta("twitter:card", "summary_large_image", "name");
    if (description) setMeta("twitter:description", description, "name");
    setMeta("twitter:title", title, "name");
    setMeta("twitter:image", ogImage, "name");

    // ---------- robots (noindex opt-in) ----------
    setMeta(
      "robots",
      noindex ? "noindex, nofollow, noarchive" : "index, follow, max-image-preview:large"
    );

    // 同步 <html lang>，对屏幕阅读器与浏览器 UI 提示很重要
    if (typeof document !== "undefined" && document.documentElement.lang !== currentLang) {
      document.documentElement.lang = currentLang;
    }

    // ---------- canonical ----------
    document.head.querySelectorAll('link[rel="canonical"][data-seo="1"]').forEach((el) => el.remove());
    const canonicalLink = document.createElement("link");
    canonicalLink.rel = "canonical";
    canonicalLink.href = canonicalUrl;
    canonicalLink.setAttribute("data-seo", "1");
    document.head.appendChild(canonicalLink);

    // ---------- hreflang ----------
    document.head.querySelectorAll('link[rel="alternate"][data-seo="1"]').forEach((el) => el.remove());
    alternates.forEach((a) => {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.setAttribute("hreflang", a.lang);
      link.href = a.url;
      link.setAttribute("data-seo", "1");
      document.head.appendChild(link);
    });
    if (xDefault) {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.setAttribute("hreflang", "x-default");
      link.href = xDefault.url;
      link.setAttribute("data-seo", "1");
      document.head.appendChild(link);
    }
  }, [title, description, ogImage, type, currentLang, canonicalUrl, ogLocale, alternates, xDefault, noindex]);
  return null;
}
