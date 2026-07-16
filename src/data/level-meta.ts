import type { LevelMeta } from "../types";
import type { CefrLevel } from "../lib/level-utils";

type LevelMetaMap = Record<string, LevelMeta>;

const nameKey = (lang: string, level: string) => "levelMeta.content." + lang + "." + level + ".name";
const goalKey = (lang: string, level: string, i: number) => "levelMeta.content." + lang + "." + level + ".goals." + i;
const grammarKey = (lang: string, level: string, i: number) => "levelMeta.content." + lang + "." + level + ".grammar." + i;

const CEFR_SPEC: Record<CefrLevel, { cefrAlignment: CefrLevel; vocabTarget: number; guidedHours: number; goalCount: number; grammarCount: number }> = {
  A1: { cefrAlignment: "A1", vocabTarget: 700, guidedHours: 100, goalCount: 4, grammarCount: 5 },
  A2: { cefrAlignment: "A2", vocabTarget: 1500, guidedHours: 200, goalCount: 4, grammarCount: 5 },
  B1: { cefrAlignment: "B1", vocabTarget: 3000, guidedHours: 400, goalCount: 4, grammarCount: 5 },
  B2: { cefrAlignment: "B2", vocabTarget: 5000, guidedHours: 600, goalCount: 4, grammarCount: 4 },
  C1: { cefrAlignment: "C1", vocabTarget: 8000, guidedHours: 800, goalCount: 4, grammarCount: 4 },
  C2: { cefrAlignment: "C2", vocabTarget: 16000, guidedHours: 1200, goalCount: 4, grammarCount: 3 },
};

function makeCefrLevelMeta(language: string, levels: string[]): Record<string, LevelMeta> {
  const result: Record<string, LevelMeta> = {};
  for (const code of levels) {
    const cefr = code as CefrLevel;
    const spec = CEFR_SPEC[cefr];
    if (!spec) continue;
    result[code] = {
      code,
      cefrAlignment: spec.cefrAlignment,
      name: nameKey(language, code),
      learningGoals: Array.from({ length: spec.goalCount }, (_, i) => goalKey(language, code, i)),
      vocabTarget: spec.vocabTarget,
      guidedHours: spec.guidedHours,
      grammarPoints: Array.from({ length: spec.grammarCount }, (_, i) => grammarKey(language, code, i)),
      frameworkAlignment: { framework: "CEFR", level: code },
    };
  }
  return result;
}

const YUE_GOAL_COUNTS: Partial<Record<CefrLevel, number>> = {
  A1: 4,
  A2: 3,
  B1: 3,
  B2: 3,
};

function makeYueLevelMeta(levels: string[]): Record<string, LevelMeta> {
  const result: Record<string, LevelMeta> = {};
  for (const code of levels) {
    const cefr = code as CefrLevel;
    const spec = CEFR_SPEC[cefr];
    if (!spec) continue;
    result[code] = {
      code,
      cefrAlignment: spec.cefrAlignment,
      name: nameKey("yue", code),
      learningGoals: Array.from({ length: YUE_GOAL_COUNTS[cefr] ?? spec.goalCount }, (_, i) => goalKey("yue", code, i)),
      vocabTarget: spec.vocabTarget,
      guidedHours: spec.guidedHours,
      grammarPoints: Array.from({ length: spec.grammarCount }, (_, i) => grammarKey("yue", code, i)),
      frameworkAlignment: { framework: "CEFR", level: code },
    };
  }
  return result;
}

function buildLevelMeta(
  language: string,
  code: string,
  cefrAlignment: CefrLevel,
  vocabTarget: number,
  guidedHours: number,
  goalCount: number,
  grammarCount: number,
  framework: "CEFR" | "JLPT" | "HSK" | "TOPIK" | "ACTFL"
): LevelMeta {
  return {
    code,
    cefrAlignment,
    name: nameKey(language, code),
    learningGoals: Array.from({ length: goalCount }, (_, i) => goalKey(language, code, i)),
    vocabTarget,
    guidedHours,
    grammarPoints: Array.from({ length: grammarCount }, (_, i) => grammarKey(language, code, i)),
    frameworkAlignment: { framework, level: code },
  };
}

export const LEVEL_META: Record<string, LevelMetaMap> = {
  en: makeCefrLevelMeta("en", ["A1", "A2", "B1", "B2", "C1", "C2"]),
  es: makeCefrLevelMeta("es", ["A1", "A2", "B1", "B2", "C1", "C2"]),
  fr: makeCefrLevelMeta("fr", ["A1", "A2", "B1", "B2", "C1", "C2"]),
  de: makeCefrLevelMeta("de", ["A1", "A2", "B1", "B2", "C1", "C2"]),
  it: makeCefrLevelMeta("it", ["A1", "A2", "B1", "B2", "C1", "C2"]),
  ms: makeCefrLevelMeta("ms", ["A1", "A2", "B1", "B2", "C1", "C2"]),
  id: makeCefrLevelMeta("id", ["A1", "A2", "B1", "B2", "C1", "C2"]),
  vi: makeCefrLevelMeta("vi", ["A1", "A2", "B1", "B2", "C1", "C2"]),
  th: makeCefrLevelMeta("th", ["A1", "A2", "B1", "B2", "C1"]),
  yue: makeYueLevelMeta(["A1", "A2", "B1", "B2"]),
  ja: {
    N5: buildLevelMeta("ja", "N5", "A1", 800, 200, 4, 5, "JLPT"),
    N4: buildLevelMeta("ja", "N4", "A2", 1500, 400, 3, 5, "JLPT"),
    N3: buildLevelMeta("ja", "N3", "B1", 4000, 700, 3, 5, "JLPT"),
    N2: buildLevelMeta("ja", "N2", "B2", 6000, 1000, 3, 5, "JLPT"),
    N1: buildLevelMeta("ja", "N1", "C1", 12000, 1500, 3, 4, "JLPT"),
  },
  ko: {
    TOPIK1: buildLevelMeta("ko", "TOPIK1", "A1", 800, 100, 4, 5, "TOPIK"),
    TOPIK2: buildLevelMeta("ko", "TOPIK2", "A2", 2000, 200, 3, 5, "TOPIK"),
    TOPIK3: buildLevelMeta("ko", "TOPIK3", "B1", 4000, 400, 3, 5, "TOPIK"),
    TOPIK4: buildLevelMeta("ko", "TOPIK4", "B2", 6000, 600, 3, 5, "TOPIK"),
    TOPIK5: buildLevelMeta("ko", "TOPIK5", "C1", 8000, 900, 3, 5, "TOPIK"),
    TOPIK6: buildLevelMeta("ko", "TOPIK6", "C2", 10000, 1200, 3, 3, "TOPIK"),
  },
  zh: {
    HSK1: buildLevelMeta("zh", "HSK1", "A1", 500, 80, 3, 5, "HSK"),
    HSK2: buildLevelMeta("zh", "HSK2", "A2", 1200, 200, 3, 5, "HSK"),
    HSK3: buildLevelMeta("zh", "HSK3", "B1", 2200, 400, 3, 5, "HSK"),
    HSK4: buildLevelMeta("zh", "HSK4", "B2", 3245, 600, 3, 5, "HSK"),
    HSK5: buildLevelMeta("zh", "HSK5", "C1", 4316, 900, 3, 5, "HSK"),
    HSK6: buildLevelMeta("zh", "HSK6", "C1", 5456, 1200, 3, 4, "HSK"),
    HSK7: buildLevelMeta("zh", "HSK7", "C2", 6488, 1500, 4, 5, "HSK"),
    HSK8: buildLevelMeta("zh", "HSK8", "C2", 8226, 1800, 4, 5, "HSK"),
    HSK9: buildLevelMeta("zh", "HSK9", "C2", 11092, 2200, 4, 5, "HSK"),
  },
};

export function getLevelMeta(language: string, level: string): LevelMeta | undefined {
  return LEVEL_META[language]?.[level];
}

export function listLevelMeta(language: string): LevelMeta[] {
  const map = LEVEL_META[language];
  if (!map) return [];
  return Object.values(map);
}
