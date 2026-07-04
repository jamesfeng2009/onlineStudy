/**
 * CEFR-equivalent level mapping.
 *
 * Different languages use different level naming conventions:
 *   - en/es/fr/de/it/th:  CEFR (A1, A2, B1, B2, C1, C2)
 *   - ja:                  JLPT (N5, N4, N3, N2, N1)
 *   - zh:                  HSK (HSK1-HSK6)
 *   - ko:                  중급/초급/고급/심화
 *   - yue:                 初级/中级/高级
 *
 * For the SRS / dependency-graph / cross-language ranking subsystems to
 * work, we need a single comparable scale. CEFR is the most widely
 * understood, so everything maps to it.
 *
 * Usage:
 *   import { cefrEquivalent, cefrRank } from "@/lib/level-utils";
 *   cefrEquivalent("yue", "中级");      // "B1"
 *   cefrEquivalent("ja", "N3");        // "B1"
 *   cefrRank("yue", "中级");           // 3 (1=A1, 6=C2)
 */

export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

const CEFR_RANK: Record<CefrLevel, number> = {
  A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6,
};

/** Map from a (language, raw level) tuple to a CEFR-equivalent string. */
const LEVEL_MAP: Record<string, CefrLevel> = {
  // en/es/fr/de/it/th already use CEFR — identity mapping.
  "en-A1": "A1", "en-A2": "A2", "en-B1": "B1", "en-B2": "B2", "en-C1": "C1", "en-C2": "C2",
  "es-A1": "A1", "es-A2": "A2", "es-B1": "B1", "es-B2": "B2", "es-C1": "C1", "es-C2": "C2",
  "fr-A1": "A1", "fr-A2": "A2", "fr-B1": "B1", "fr-B2": "B2", "fr-C1": "C1", "fr-C2": "C2",
  "de-A1": "A1", "de-A2": "A2", "de-B1": "B1", "de-B2": "B2", "de-C1": "C1", "de-C2": "C2",
  "it-A1": "A1", "it-A2": "A2", "it-B1": "B1", "it-B2": "B2", "it-C1": "C1", "it-C2": "C2",
  "th-A1": "A1", "th-A2": "A2", "th-B1": "B1", "th-B2": "B2", "th-C1": "C1", "th-C2": "C2",

  // Japanese JLPT (N5=easiest → N1=hardest)
  "ja-N5": "A1",
  "ja-N4": "A2",
  "ja-N3": "B1",
  "ja-N2": "B2",
  "ja-N1": "C1",

  // Chinese HSK (new 6-level scale; HSK1=easiest)
  "zh-HSK1": "A1",
  "zh-HSK2": "A2",
  "zh-HSK3": "B1",
  "zh-HSK4": "B2",
  "zh-HSK5": "C1",
  "zh-HSK6": "C2",

  // Korean
  "ko-초급": "A1",
  "ko-중급": "A2",
  "ko-고급": "B1",
  "ko-심화": "B2",

  // Cantonese (yue)
  "yue-初级": "A1",
  "yue-中级": "B1",
  "yue-高级": "B2",
};

/**
 * Return the CEFR-equivalent for a (language, raw level) tuple.
 * Falls back to the raw level itself if it's already a valid CEFR
 * code (so callers can pass any language's level without checking).
 * Returns undefined if no mapping is known.
 */
export function cefrEquivalent(language: string, level: string | undefined): CefrLevel | undefined {
  if (!level) return undefined;
  const key = `${language}-${level}`;
  const direct = LEVEL_MAP[key];
  if (direct) return direct;
  // If the level is already a CEFR code, return it as-is.
  if (level in CEFR_RANK) return level as CefrLevel;
  return undefined;
}

/**
 * Return a 1-6 rank (1=A1, 6=C2) for cross-language comparison.
 * Returns 0 if unknown.
 */
export function cefrRank(language: string, level: string | undefined): number {
  const eq = cefrEquivalent(language, level);
  return eq ? CEFR_RANK[eq] : 0;
}
