/**
 * Auto-generated vocabulary for the three target languages we currently
 * have data for (English, Japanese, Chinese). Each word carries a
 * stable slug used in /languages/:langSlug/word/:wordSlug URLs.
 *
 * Loaded via dynamic import from LearnLangPage and LearnWordPage so
 * the first-paint bundle of the homepage stays small (the raw JSON
 * for all 2700+ entries is split into 3 chunks by Vite).
 */
import type { LearnWord } from "./en";

export type { LearnWord };

/**
 * Map of supported learn-content languages to a lazy loader. The keys
 * match the langSlug used in /languages/:langSlug/word/:wordSlug.
 */
export const LEARN_CONTENT_LOADERS = {
  en: () => import("./en").then((m) => m.EN_WORDS),
  ja: () => import("./ja").then((m) => m.JA_WORDS),
  zh: () => import("./zh").then((m) => m.ZH_WORDS),
} as const;

export type LearnLangSlug = keyof typeof LEARN_CONTENT_LOADERS;

/**
 * UI-language labels for the slugs above. Kept here so that any
 * component listing these pages can render a localised name without
 * needing to import the full language data.
 */
export const LEARN_LANG_META: Record<
  LearnLangSlug,
  { nativeName: string; englishName: string; flag: string }
> = {
  en: { nativeName: "English", englishName: "English", flag: "🇬🇧" },
  ja: { nativeName: "日本語", englishName: "Japanese", flag: "🇯🇵" },
  zh: { nativeName: "中文", englishName: "Chinese", flag: "🇨🇳" },
};

export const ALL_LEARN_LANG_SLUGS = Object.keys(
  LEARN_CONTENT_LOADERS
) as LearnLangSlug[];
