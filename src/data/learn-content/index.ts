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
  ko: () => import("./ko").then((m) => m.KO_WORDS),
  es: () => import("./es").then((m) => m.ES_WORDS),
  fr: () => import("./fr").then((m) => m.FR_WORDS),
  de: () => import("./de").then((m) => m.DE_WORDS),
  it: () => import("./it").then((m) => m.IT_WORDS),
  th: () => import("./th").then((m) => m.TH_WORDS),
  yue: () => import("./yue").then((m) => m.YUE_WORDS),
  ms: () => import("./ms").then((m) => m.MS_WORDS),
  id: () => import("./id").then((m) => m.ID_WORDS),
  vi: () => import("./vi").then((m) => m.VI_WORDS),
} as const;

export type LearnLangSlug = keyof typeof LEARN_CONTENT_LOADERS;

/**
 * UI labels for the 10 supported target languages. Two groups:
 *   - Word-level data (en, ja, zh) — from dictionary corpora
 *   - Sentence-pair data (ko, es, fr, de) — from Tatoeba, no word
 *     dictionary available. The "word" field for these is a short
 *     tgt sentence; UI must adapt.
 */
export const LEARN_LANG_META: Record<
  LearnLangSlug,
  {
    nativeName: string;
    englishName: string;
    flag: string;
    /** "word" if data is per-word, "sentence" if per-sentence-pair. */
    dataShape: "word" | "sentence";
  }
> = {
  en: { nativeName: "English", englishName: "English", flag: "🇬🇧", dataShape: "word" },
  ja: { nativeName: "日本語", englishName: "Japanese", flag: "🇯🇵", dataShape: "word" },
  zh: { nativeName: "中文", englishName: "Chinese", flag: "🇨🇳", dataShape: "word" },
  ko: { nativeName: "한국어", englishName: "Korean", flag: "🇰🇷", dataShape: "sentence" },
  es: { nativeName: "Español", englishName: "Spanish", flag: "🇪🇸", dataShape: "sentence" },
  fr: { nativeName: "Français", englishName: "French", flag: "🇫🇷", dataShape: "sentence" },
  de: { nativeName: "Deutsch", englishName: "German", flag: "🇩🇪", dataShape: "sentence" },
  it: { nativeName: "Italiano", englishName: "Italian", flag: "🇮🇹", dataShape: "sentence" },
  th: { nativeName: "ภาษาไทย", englishName: "Thai", flag: "🇹🇭", dataShape: "sentence" },
  yue: { nativeName: "粵語", englishName: "Cantonese", flag: "🇭🇰", dataShape: "sentence" },
  ms: { nativeName: "Bahasa Melayu", englishName: "Malay", flag: "🇲🇾", dataShape: "sentence" },
  id: { nativeName: "Bahasa Indonesia", englishName: "Indonesian", flag: "🇮🇩", dataShape: "sentence" },
  vi: { nativeName: "Tiếng Việt", englishName: "Vietnamese", flag: "🇻🇳", dataShape: "sentence" },
};

/**
 * URL slug → data key. URL slugs are human-friendly
 * ("english", "japanese", "chinese", "korean", "spanish", "french",
 * "german"); data keys are short codes used in chunk filenames and
 * JSON-LD language tags.
 */
import { LANG_SLUG_TO_CODE } from "../language-registry";

export const URL_SLUG_TO_DATA: Record<string, LearnLangSlug> =
  LANG_SLUG_TO_CODE as Record<string, LearnLangSlug>;

export const ALL_LEARN_LANG_SLUGS = Object.keys(
  LEARN_CONTENT_LOADERS
) as LearnLangSlug[];
