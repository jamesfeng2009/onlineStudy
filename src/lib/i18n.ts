import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "../locales/en/translation.json";
import zh from "../locales/zh/translation.json";
import ja from "../locales/ja/translation.json";
import ko from "../locales/ko/translation.json";
import es from "../locales/es/translation.json";
import fr from "../locales/fr/translation.json";
import de from "../locales/de/translation.json";
import it from "../locales/it/translation.json";
import th from "../locales/th/translation.json";
import yue from "../locales/yue/translation.json";

export const resources = {
  en: { translation: en },
  zh: { translation: zh },
  ja: { translation: ja },
  ko: { translation: ko },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  it: { translation: it },
  th: { translation: th },
  yue: { translation: yue },
};

export const SUPPORTED_LANGUAGES = ["en", "zh", "ja", "ko", "es", "fr", "de", "it", "th", "yue"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_UI_LANGUAGE: SupportedLanguage = "en";

/**
 * Locales that get a URL prefix (en is the default and stays prefix-free).
 *
 *   /              → en
 *   /ja/blog/...   → ja
 *   /zh/courses    → zh
 *   ...
 */
const PREFIXED_LOCALES = SUPPORTED_LANGUAGES.filter(
  (l) => l !== DEFAULT_UI_LANGUAGE
) as readonly Exclude<SupportedLanguage, "en">[];

/**
 * Parse a URL pathname into a locale + the locale-stripped path.
 *
 *   "/"             → { locale: "en", strippedPath: "/" }
 *   "/ja"           → { locale: "ja", strippedPath: "/" }
 *   "/ja/blog"      → { locale: "ja", strippedPath: "/blog" }
 *   "/fr/faq"       → { locale: "fr", strippedPath: "/faq" }
 *   "/zh/blog/abc"  → { locale: "zh", strippedPath: "/blog/abc" }
 */
export function extractLocaleFromPath(pathname: string): {
  locale: SupportedLanguage;
  strippedPath: string;
} {
  const segs = (pathname || "/").split("/").filter(Boolean);
  if (segs.length > 0 && (PREFIXED_LOCALES as readonly string[]).includes(segs[0])) {
    return {
      locale: segs[0] as SupportedLanguage,
      strippedPath: "/" + segs.slice(1).join("/"),
    };
  }
  return { locale: DEFAULT_UI_LANGUAGE, strippedPath: pathname || "/" };
}

/**
 * Build a locale-aware URL for a given language.
 *
 *   buildLocalePath("en", "/blog")     → "/blog"
 *   buildLocalePath("ja", "/blog")     → "/ja/blog"
 *   buildLocalePath("fr", "/")         → "/fr"
 *   buildLocalePath("fr", "/blog/abc") → "/fr/blog/abc"
 */
export function buildLocalePath(locale: SupportedLanguage, pathname: string): string {
  const { strippedPath } = extractLocaleFromPath(pathname);
  if (locale === DEFAULT_UI_LANGUAGE) {
    return strippedPath === "" ? "/" : strippedPath;
  }
  if (strippedPath === "/" || strippedPath === "") return `/${locale}`;
  return `/${locale}${strippedPath}`;
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_UI_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  });

// ----------------------------------------------------------------------------
// URL ↔ i18n sync
// URL locale takes priority over the cached value in localStorage.
// ----------------------------------------------------------------------------

function applyLocaleFromUrl() {
  if (typeof window === "undefined") return;
  const { locale } = extractLocaleFromPath(window.location.pathname);
  if (i18n.language !== locale) {
    void i18n.changeLanguage(locale);
  }
  if (document.documentElement.lang !== locale) {
    document.documentElement.lang = locale;
  }
}

// Apply on first paint (overrides whatever localStorage / navigator said).
applyLocaleFromUrl();

// Re-apply on history navigation.
window.addEventListener("popstate", applyLocaleFromUrl);

// Monkey-patch pushState / replaceState so SPA route changes also sync.
// (These do not fire popstate; we wrap them to call our sync after the
// real call completes.)
type HistoryMethod = typeof history.pushState;
const originalPush: HistoryMethod = history.pushState.bind(history);
const originalReplace: HistoryMethod = history.replaceState.bind(history);
history.pushState = function (...args: Parameters<HistoryMethod>) {
  const r = originalPush(...args);
  // Run after React Router's internal handler so its pathname is up to date.
  setTimeout(applyLocaleFromUrl, 0);
  return r;
} as HistoryMethod;
history.replaceState = function (...args: Parameters<HistoryMethod>) {
  const r = originalReplace(...args);
  setTimeout(applyLocaleFromUrl, 0);
  return r;
} as HistoryMethod;

export default i18n;
