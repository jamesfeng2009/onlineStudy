import { useEffect } from "react";
import { SUPPORTED_LANGUAGES, buildLocalePath, DEFAULT_UI_LANGUAGE, type SupportedLanguage } from "../lib/i18n";

// 生产域名（Vercel 上确认过是 lang-oria.com）
const SITE_URL = "https://lang-oria.com";

// 站点支持的所有 locale，对应 og:locale 与 hreflang
export const SITE_LOCALES = [
  { code: "en", og: "en_US" },
  { code: "zh", og: "zh_CN" },
  { code: "ja", og: "ja_JP" },
  { code: "ko", og: "ko_KR" },
  { code: "es", og: "es_ES" },
  { code: "fr", og: "fr_FR" },
  { code: "de", og: "de_DE" },
] as const;

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
}

/**
 * 构造 hreflang 列表。每个语言一条 <link rel="alternate" hreflang="...">，
 * 另加一条 x-default 指向默认语言（en）。
 *
 * 注意：D 阶段（URL 子目录 locale）上线后，这里需要拼 `/<locale>/...`。
 * 现阶段所有 locale 共享同一 pathname，hreflang 的 href 全部相同。
 */
function buildAlternates(
  pathname: string,
  localizedPaths?: { lang: string; path: string }[]
) {
  const pathByLang = new Map<string, string>(
    (localizedPaths ?? []).map((p) => [p.lang, p.path])
  );
  return SUPPORTED_LANGUAGES.map((code) => {
    const target = pathByLang.get(code) ?? pathname;
    return {
      lang: code,
      url: `${SITE_URL}${buildLocalePath(code as SupportedLanguage, target)}`,
    };
  });
}

function resolveCanonical(
  lang: string,
  pathname: string,
  canonical?: string
) {
  if (canonical) return canonical;
  return `${SITE_URL}${buildLocalePath((lang || DEFAULT_UI_LANGUAGE) as SupportedLanguage, pathname)}`;
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
}: SeoProps) {
  useEffect(() => {
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
    if (image) setMeta("og:image", image, "property");
    setMeta("twitter:card", "summary_large_image", "name");
    if (description) setMeta("twitter:description", description, "name");
    setMeta("twitter:title", title, "name");
    if (image) setMeta("twitter:image", image, "name");

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
  }, [title, description, image, type, lang, pathname, localizedPaths, canonical]);
  return null;
}
