/**
 * Extracts all English editorial copy from:
 *   - src/data/learn-copy.ts   (LearnLangPage / LearnVocabPage)
 *   - src/data/scenarios.ts    (LearnScenarioPage)
 *
 * and writes src/locales/en/learn.json — the "learn" i18n namespace.
 *
 * Run: pnpm exec tsx scripts/extract-learn-copy.ts
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// We import the TS modules directly — tsx handles transpilation.
// ---------------------------------------------------------------------------
import {
  DESCRIPTIONS,
  LANG_PAGE_COPY,
  VOCAB_OVERVIEW_COPY,
  LEVEL_COPY_TEMPLATES,
} from "../src/data/learn-copy.ts";

import {
  SCENARIO_META,
  SCENARIO_CONTENT,
  SCENARIO_KEYS,
  SCENARIO_LANGS,
} from "../src/data/scenarios.ts";

import { ALL_LEARN_LANG_SLUGS } from "../src/data/learn-content/index.ts";
import type { LearnLangSlug } from "../src/data/learn-content/index.ts";

// ---------------------------------------------------------------------------
// Build the learn namespace.
// ---------------------------------------------------------------------------

const learn: Record<string, unknown> = {};

/* ── UI chrome (shared labels / headings / buttons) ── */
learn.ui = {
  // LearnLangPage
  whyLearn: "Why learn {{lang}}?",
  whoFor: "Who is {{lang}} for?",
  levelsOfVocab_one: "{{count}} level of vocabulary",
  levelsOfVocab_other: "{{count}} levels of vocabulary",
  curatedDecks: "Curated spaced-repetition decks at every CEFR / JLPT / HSK stage.",
  nativeAudio: "Native-speaker audio",
  nativeAudioDesc: "Listen to {{lang}} as it's actually spoken, with shadowing drills.",
  dailyLoop: "10-minute daily loop",
  dailyLoopDesc: "Spaced repetition so you remember more in less time.",
  howTeaches: "How LangOria teaches {{lang}}",
  vocabStart: "Vocabulary you'll start with",
  seeAll: "See all {{count}} {{unit}} →",
  wordIncludes: "Each {{unitSingular}} includes reading, translation, and a real example {{unitSingular}}.",
  faqTitle: "Frequently asked questions",
  browseByLevel: "Browse {{lang}} vocabulary by level",
  levelCount_one: "{{count}} level, {{total}} curated {{unit}}.",
  levelCount_other: "{{count}} levels, {{total}} curated {{unit}}.",
  openVocabIndex: "Open vocabulary index",
  realWorldScenarios: "Real-world {{lang}} scenarios",
  scenarioDesc:
    "4 high-leverage situations — travel, business, food, and small talk — each with 10 phrases, a sample dialogue, and a culture tip.",
  openScenarioLessons: "Open scenario lessons",

  // LearnVocabPage (overview)
  vocabOverviewTitle: "{{lang}} vocabulary overview",
  total: "Total {{unit}}",
  levels: "Levels",
  startHere: "Start here",
  source: "Source",
  sourceTatoeba: "Tatoeba",
  sourceNative: "Native",
  vocabByLevel: "{{lang}} vocabulary by level",
  clickLevel: "Click any level to see the full list of {{unit}} at that tier.",
  whyWorks: "Why LangOria's {{lang}} vocabulary works",
  realExamples: "Real example sentences",
  realExamplesDesc:
    "Every {{unitSingular}} comes with a real example from the Tatoeba corpus — no synthetic textbook filler.",
  spacedRepetition: "Spaced repetition",
  spacedRepetitionDesc: "Reviews are scheduled at the moment you are about to forget, so you retain more in less time.",
  tenMinLoop: "10-minute daily loop",
  tenMinLoopDesc: "A short focused daily session beats a long abandoned one — streaks keep you honest.",

  // LearnVocabPage (level detail)
  aboutLevel: "About {{lang}} {{level}}",
  allNAtLevel: "All {{count}} {{unit}} at {{level}}",
  clickAnyUnit: "Click any {{unitSingular}} to see its full breakdown: reading, translation, and a real example {{unitSingular}}.",
  howToStudyLevel: "How to study {{lang}} {{level}}",
  otherLevels: "Other {{lang}} levels",
  otherLevelsDesc: "Move up or down within the same language to keep your recall curve consistent.",
  backToVocab: "← Back to {{lang}} vocabulary",

  // LearnScenarioPage
  whyScenario: "Why {{scenario}} {{lang}}?",
  tenPhrasesTitle: "10 phrases you will actually use",
  tenPhrasesDesc: "These 10 sentences cover roughly 95% of {{scenario}} in {{lang}}. Tap the speaker icon to hear the pronunciation.",
  sampleDialogueTitle: "Sample dialogue",
  sampleDialogueDesc: "Read this conversation out loud — it uses the same 10 phrases in context.",
  cultureTitle: "Culture & etiquette",
  howToStudyScenario: "How to study this scenario",
  moreScenarios: "More {{lang}} scenarios",
  moreScenariosDesc: "Jump to a different scenario in the same language.",
  allScenarios: "All {{lang}} scenarios",
  backToLang: "← Back to {{lang}}",
  backToScenarios: "← Back to {{lang}} scenarios",
  scenarioComingSoon: "Scenario lessons are coming soon for this language.",
  enLabel: "EN:",
  litLabel: "Lit:",
  phrasesBadge: "{{lang}} · 10 phrases",

  // LearnWordPage
  meaning: "Meaning",
  example: "Example",
  practiceThisWord: "Practice this {{unit}}",
  practiceDesc:
    "Add {{word}} to your spaced-repetition deck and review it tomorrow, then in 3 days, then in a week — the way your brain actually wants to learn.",
  startPracticing: "Start practicing",
  relatedWords: "Related {{unit}}",
  backToOverview: "← {{lang}} overview",
  wordNotFound: "{{unit}} not found",
  noEntry: 'No entry for "{{slug}}"',
  loading: "Loading vocabulary…",

  // Shared / misc
  startFreeTrial: "Start free trial",
  languageNotFound: "Language not found",
  languageNotSupported: "That language is not yet supported.",
  pickLanguage: "← Pick a language",
  levelNotFound: "Level not found",
  levelNotAvailable: "That level is not available for this language.",
  scenarioNotAvailable: "Scenario not available",
  scenarioNotSupported: "That language / scenario combination is not yet supported.",
  scenarioNotFound: "Scenario not found",
  scenarioNotOneOfFour: "That scenario is not one of the four supported scenarios.",
  more: "+{{count}} more",

  // Unit labels (word / sentence data shapes)
  unitWord: "words",
  unitWordSingular: "word",
  unitSentence: "sentences",
  unitSentenceSingular: "sentence",
  unitVocabulary: "vocabulary",
  unitSentencePatterns: "sentence patterns",

  // Breadcrumbs
  navHome: "Home",
  navLanguages: "Languages",
  navVocabulary: "Vocabulary",
  navScenarios: "Scenarios",

  // /languages directory page
  languagesIndexTitle: "Languages",
  languagesIndexSubtitle:
    "Pick a language to start learning. Each course is hand-curated with native-speaker audio and a 10-minute daily loop.",
  seoLanguagesTitle: "Learn a Language Online — 10 Languages from A1 to C2 | LangOria",
  seoLanguagesDesc:
    "Pick from English, Japanese, Chinese, Korean, Spanish, French, German, Italian, Thai, or Cantonese. Spaced-repetition vocabulary, native-speaker audio, and a 10-minute daily practice loop.",
  start: "Start",

  // LearnLangPage SEO
  seoLangTitle: "Learn {{lang}} online — A1 to C1 | LangOria",
  seoLangCourseName: "Learn {{lang}} online — A1 to C1",

  // LearnVocabPage page/SEO templates
  vocabPageTitle: "{{lang}} vocabulary — {{levels}} levels, {{total}} {{unit}}",
  vocabPageSubtitle:
    "Browse {{lang}} {{unit}} organised by proficiency level. Every entry includes a real example sentence from native speakers and audio shadowing drills.",
  seoVocabTitle: "{{lang}} vocabulary by level — {{count}} {{unit}} | LangOria",
  seoVocabDesc:
    "Browse {{lang}} {{unit}} organised by proficiency level. {{count}} entries across {{levels}} {{tierLabel}}, with real example sentences and spaced-repetition practice.",
  tierGeneric: "tiers",
  tierLevels: "CEFR / JLPT / HSK levels",
  vocabListName: "{{lang}} vocabulary by level",
  itemDescAtLevel: "{{count}} {{unit}} at {{level}}",
  levelPageTitle: "{{lang}} {{level}} {{unit}} — {{count}} {{unit}}",
  levelPageSubtitle:
    "Master the {{level}} {{unitLabel}} of {{lang}} with real examples and spaced-repetition practice.",
  seoLevelTitle: "{{lang}} {{level}} {{unit}} ({{count}}) | LangOria",

  // LearnScenarioPage (index)
  scenariosIndexTitle: "{{lang}} scenarios — 4 real-world situations",
  scenariosIndexSubtitle:
    "Four high-leverage {{lang}} scenarios — travel, business, food, and small talk — each with 10 hand-picked phrases, a sample dialogue, and a culture tip.",
  seoScenariosTitle: "{{lang}} scenarios — travel, business, food, small talk | LangOria",
  seoScenariosDesc:
    "Four high-leverage {{lang}} scenarios with 10 phrases each, sample dialogues, and culture tips. {{lang}} for travel, business, food, and small talk.",
  whyScenarioLearning: "Why learn {{lang}} by scenario?",
  scenarioIndexIntro:
    "Scenario-based learning is the fastest way to usable {{lang}}. Instead of memorising 1000 words you'll forget, you master 10 phrases you'll actually use — and then the next 10, and the next 10. The four scenarios below cover the situations adult learners most often ask us about: travel, business, food, and small talk. Each one is built from a 10-phrase deck, a sample dialogue, and a culture tip that tells you when to use the formal register and when the casual one is fine.",
  scenariosItemListName: "{{lang}} learning scenarios",

  // LearnWordPage extras
  noTranslation: "(no translation)",
  homeLink: "← Home",
  seoWordTitle: "{{word}} — {{lang}} vocabulary | LangOria",
  seoWordDescFallback: "{{word}} in {{lang}}",
};

/* ── LearnLangPage per-language editorial copy ── */
learn.langPage = {} as Record<string, unknown>;
for (const slug of ALL_LEARN_LANG_SLUGS) {
  const copy = LANG_PAGE_COPY[slug as LearnLangSlug];
  (learn.langPage as Record<string, unknown>)[slug] = {
    title: copy.title,
    lead: copy.lead,
    whoFor: copy.whoFor,
    method: copy.method,
    faq: copy.faq.map((f) => ({ q: f.q, a: f.a })),
  };
}

/* ── Directory card descriptions ── */
learn.descriptions = { ...DESCRIPTIONS };

/* ── Vocab overview copy ── */
learn.vocabOverview = { ...VOCAB_OVERVIEW_COPY };

/* ── Level copy templates ── */
learn.levelCopy = { ...LEVEL_COPY_TEMPLATES };

/* ── Scenario meta (name + blurb per scenario key) ── */
learn.scenarioMeta = {} as Record<string, { name: string; blurb: string }>;
for (const key of SCENARIO_KEYS) {
  const m = SCENARIO_META[key];
  (learn.scenarioMeta as Record<string, unknown>)[key] = { name: m.name, blurb: m.blurb };
}

/* ── Scenario content copy (per target-lang × per scenario) ── */
learn.scenarioContent = {} as Record<string, Record<string, unknown>>;

// Map ScenarioLang → LearnLangSlug for consistent keys
const SCENARIO_TO_LEARN: Record<string, LearnLangSlug> = {
  english: "en",
  japanese: "ja",
  chinese: "zh",
  korean: "ko",
  spanish: "es",
  french: "fr",
  german: "de",
};

for (const sLang of SCENARIO_LANGS as readonly string[]) {
  const learnSlug = SCENARIO_TO_LEARN[sLang];
  if (!learnSlug) continue;

  const perScenario: Record<string, unknown> = {};
  for (const key of SCENARIO_KEYS) {
    const content = SCENARIO_CONTENT[sLang as keyof typeof SCENARIO_CONTENT]?.[key];
    if (!content) continue;

    perScenario[key] = {
      title: content.title,
      subtitle: content.subtitle,
      intro: content.intro,
      culture: content.culture,
      howTo: content.howTo,
      // Phrase EN translations are UI-language dependent
      phrases: content.phrases.map((p, i) => ({ index: i, en: p.en })),
      // Conversation EN translations are UI-language dependent
      conversation: content.conversation.map((t, i) => ({ index: i, en: t.en })),
    };
  }
  (learn.scenarioContent as Record<string, unknown>)[learnSlug] = perScenario;
}

// ---------------------------------------------------------------------------
// Write out
// ---------------------------------------------------------------------------
const outPath = path.resolve(__dirname, "../src/locales/en/learn.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(learn, null, 2) + "\n", "utf-8");

console.log(`[extract-learn-copy] wrote ${outPath}`);
console.log(`  keys (top-level): ${Object.keys(learn).length}`);
console.log(`  langPage entries: ${Object.keys(learn.langPage as object).length}`);
console.log(`  vocabOverview entries: ${Object.keys(learn.vocabOverview as object).length}`);
console.log(`  levelCopy templates: ${Object.keys(learn.levelCopy as object).length}`);
console.log(`  scenarioMeta entries: ${Object.keys(learn.scenarioMeta as object).length}`);
console.log(`  scenarioContent langs: ${Object.keys(learn.scenarioContent as object).length}`);
