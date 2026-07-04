import type { WordFamily } from "../types";

/**
 * Word families group words sharing a root (e.g. work/worker/working).
 * Used by WordsModule to show "related words" on the flashcard back.
 *
 * Each WordItem can reference a family via `familyId`.
 *
 * NOTE: This is a starter set of seed families for the focused languages
 * (en/zh/yue/ja). To scale this up, a generator script can ask an LLM
 * to produce families for the top-N frequent words per language.
 */
export const WORD_FAMILIES: WordFamily[] = [
  // ── English ──
  {
    id: "fam-en-work",
    head: "work",
    root: "work",
    rootMeaning: "to labor, to function",
    language: "en",
    members: [
      { word: "work", pos: "verb/noun", relation: "head", meaning: "to labor; labor itself" },
      { word: "worker", pos: "noun", relation: "derivative", meaning: "a person who works" },
      { word: "working", pos: "adj", relation: "inflection", meaning: "functioning; employed" },
      { word: "worked", pos: "verb", relation: "inflection", meaning: "past tense of work" },
      { word: "workshop", pos: "noun", relation: "compound", meaning: "room/building for working" },
      { word: "homework", pos: "noun", relation: "compound", meaning: "school work done at home" },
      { word: "network", pos: "noun", relation: "compound", meaning: "system of connected things" },
    ],
  },
  {
    id: "fam-en-port",
    head: "port",
    root: "port",
    rootMeaning: "to carry",
    language: "en",
    members: [
      { word: "port", pos: "verb/noun", relation: "head", meaning: "to carry; a harbor" },
      { word: "portable", pos: "adj", relation: "derivative", meaning: "able to be carried" },
      { word: "transport", pos: "verb/noun", relation: "derivative", meaning: "carry across" },
      { word: "import", pos: "verb/noun", relation: "derivative", meaning: "carry in" },
      { word: "export", pos: "verb/noun", relation: "derivative", meaning: "carry out" },
      { word: "report", pos: "verb/noun", relation: "derivative", meaning: "carry back (information)" },
      { word: "support", pos: "verb/noun", relation: "derivative", meaning: "carry from below" },
    ],
  },
  {
    id: "fam-en-act",
    head: "act",
    root: "act",
    rootMeaning: "to do, to drive",
    language: "en",
    members: [
      { word: "act", pos: "verb/noun", relation: "head", meaning: "to do; a thing done" },
      { word: "action", pos: "noun", relation: "derivative", meaning: "the process of doing" },
      { word: "active", pos: "adj", relation: "derivative", meaning: "characterized by action" },
      { word: "actor", pos: "noun", relation: "derivative", meaning: "one who acts" },
      { word: "react", pos: "verb", relation: "derivative", meaning: "act in response" },
      { word: "interact", pos: "verb", relation: "derivative", meaning: "act upon each other" },
      { word: "actual", pos: "adj", relation: "derivative", meaning: "existing in fact" },
    ],
  },

  // ── Chinese (普通话) ──
  {
    id: "fam-zh-xue",
    head: "学",
    root: "学",
    rootMeaning: "to learn, to study",
    language: "zh",
    members: [
      { word: "学", pos: "verb", relation: "head", meaning: "to learn" },
      { word: "学习", pos: "verb", relation: "compound", meaning: "to study" },
      { word: "学生", pos: "noun", relation: "compound", meaning: "student" },
      { word: "学校", pos: "noun", relation: "compound", meaning: "school" },
      { word: "学问", pos: "noun", relation: "compound", meaning: "knowledge" },
      { word: "大学", pos: "noun", relation: "compound", meaning: "university" },
      { word: "同学", pos: "noun", relation: "compound", meaning: "classmate" },
    ],
  },
  {
    id: "fam-zh-shuo",
    head: "说",
    root: "说",
    rootMeaning: "to speak, to say",
    language: "zh",
    members: [
      { word: "说", pos: "verb", relation: "head", meaning: "to speak" },
      { word: "说话", pos: "verb", relation: "compound", meaning: "to talk" },
      { word: "小说", pos: "noun", relation: "compound", meaning: "novel (small talk)" },
      { word: "说明", pos: "verb/noun", relation: "compound", meaning: "to explain" },
      { word: "听说", pos: "verb", relation: "compound", meaning: "to hear of" },
      { word: "说服", pos: "verb", relation: "compound", meaning: "to persuade" },
    ],
  },

  // ── Japanese ──
  {
    id: "fam-ja-yomu",
    head: "読む",
    root: "読",
    rootMeaning: "to read",
    language: "ja",
    members: [
      { word: "読む", pos: "verb", relation: "head", meaning: "to read" },
      { word: "読書", pos: "noun", relation: "compound", meaning: "reading (books)" },
      { word: "読者", pos: "noun", relation: "compound", meaning: "reader" },
      { word: "読み方", pos: "noun", relation: "compound", meaning: "way of reading" },
      { word: "音読み", pos: "noun", relation: "compound", meaning: "Chinese reading of kanji" },
      { word: "訓読み", pos: "noun", relation: "compound", meaning: "Japanese reading of kanji" },
    ],
  },
  {
    id: "fam-ja-taberu",
    head: "食べる",
    root: "食べ",
    rootMeaning: "to eat",
    language: "ja",
    members: [
      { word: "食べる", pos: "verb", relation: "head", meaning: "to eat" },
      { word: "食べ物", pos: "noun", relation: "compound", meaning: "food" },
      { word: "食堂", pos: "noun", relation: "compound", meaning: "cafeteria" },
      { word: "朝食", pos: "noun", relation: "compound", meaning: "breakfast" },
      { word: "夕食", pos: "noun", relation: "compound", meaning: "dinner" },
    ],
  },

  // ── Cantonese (粤语) ──
  {
    id: "fam-yue-sik",
    head: "食",
    root: "食",
    rootMeaning: "to eat (also used in nouns for meals)",
    language: "yue",
    members: [
      { word: "食", pos: "verb", relation: "head", meaning: "to eat" },
      { word: "食飯", pos: "verb", relation: "compound", meaning: "to eat a meal" },
      { word: "食物", pos: "noun", relation: "compound", meaning: "food" },
      { word: "餐廳", pos: "noun", relation: "compound", meaning: "restaurant (meal hall)" },
      { word: "早餐", pos: "noun", relation: "compound", meaning: "breakfast" },
      { word: "晏晝", pos: "noun", relation: "compound", meaning: "lunch (afternoon)" },
    ],
  },
  {
    id: "fam-yue-gong",
    head: "講",
    root: "講",
    rootMeaning: "to speak, to talk",
    language: "yue",
    members: [
      { word: "講", pos: "verb", relation: "head", meaning: "to speak" },
      { word: "講嘢", pos: "verb", relation: "compound", meaning: "to talk" },
      { word: "講師", pos: "noun", relation: "compound", meaning: "lecturer" },
      { word: "講座", pos: "noun", relation: "compound", meaning: "lecture" },
      { word: "傾偈", pos: "verb", relation: "compound", meaning: "to chat" },
    ],
  },
];

/** Get a word family by id. Returns undefined if not found. */
export function getWordFamily(id: string): WordFamily | undefined {
  return WORD_FAMILIES.find((f) => f.id === id);
}

/** Get all families for a language. */
export function getWordFamiliesByLanguage(language: string): WordFamily[] {
  return WORD_FAMILIES.filter((f) => f.language === language);
}
