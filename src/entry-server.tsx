import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import i18n from "./lib/i18n";
import { extractLocaleFromPath, type SupportedLanguage } from "./lib/i18n";
import { ensureLearnNamespace } from "./lib/learn-i18n";

/**
 * SSR entry — used by scripts/prerender.ts at build time.
 *
 * Renders the React tree for a given URL into a static HTML string.
 * The prerender script then:
 *   1. injects this into dist/<route>/index.html's <div id="root">
 *   2. strips the inline `seo-inline-prerender` script (already resolved
 *      by the React <Seo /> component during render)
 *
 * NOTE: useEffect / fetch / localStorage / speechSynthesis are NOT
 * executed during renderToString — components must guard browser-only
 * APIs behind useEffect or `typeof window !== "undefined"` checks
 * (they already do).
 */
export async function render(url: string): Promise<string> {
  // SSR 下 i18n 没有 LanguageDetector（见 i18n.ts 的 isBrowser 分支），
  // 这里根据 URL 前缀手动切语言，保证 <Seo> 输出的 hreflang/canonical
  // 与最终 HTML 的 lang 属性一致。
  const { locale, strippedPath } = extractLocaleFromPath(url);
  if (i18n.language !== locale) {
    await i18n.changeLanguage(locale as SupportedLanguage);
  }

  // Pre-load the "learn" namespace so /languages/* pages render with
  // correct editorial copy during SSR (no fallback flashes).
  if (strippedPath.startsWith("/languages")) {
    await ensureLearnNamespace(locale);
  }

  const app = (
    <React.StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </React.StrictMode>
  );

  return renderToString(app);
}
