import type { GrammarPoint, Language } from "../types";

/**
 * Grammar points — teachable units forming a dependency graph.
 *
 * Each point lists `prerequisites` (other point ids the learner
 * should know first). The GrammarMap walks this graph to render
 * arrows and decide which nodes are "unlocked" for the user.
 *
 * Quizzes reference a point via `QuizItem.grammarPointId`. The merge
 * script (`scripts/merge-generated-to-content.ts`) tags quizzes by
 * matching keywords in the question against each point's `keywords`.
 *
 * Coverage here is intentionally partial — enough to demonstrate the
 * graph shape. Real coverage comes from Gemini batch generation in
 * the same shape (see generate-grammar-points.yml, future work).
 */

export const GRAMMAR_POINTS: GrammarPoint[] = [
  // ── English ──
  {
    id: "gp-en-pronouns",
    language: "en",
    level: "A1",
    title: "Subject Pronouns",
    summary: "I / you / he / she / it / we / they — the subject of a sentence.",
    prerequisites: [],
    pitfalls: [
      { wrong: "he go", right: "he goes", note: "3rd person singular needs -s" },
    ],
  },
  {
    id: "gp-en-present-simple",
    language: "en",
    level: "A1",
    title: "Present Simple",
    summary: "Habitual actions and general truths. Base form for I/you/we/they.",
    prerequisites: ["gp-en-pronouns"],
    pitfalls: [
      { wrong: "I going", right: "I go", note: "don't use -ing for habits" },
    ],
  },
  {
    id: "gp-en-present-simple-3rd",
    language: "en",
    level: "A1",
    title: "Present Simple (-s)",
    summary: "He/she/it adds -s in the present simple: he works, she plays.",
    prerequisites: ["gp-en-present-simple"],
    pitfalls: [
      { wrong: "he go", right: "he goes" },
      { wrong: "she watchs", right: "she watches", note: "add 'es' after -ch/-sh/-x/-s" },
    ],
  },
  {
    id: "gp-en-past-simple",
    language: "en",
    level: "A2",
    title: "Past Simple",
    summary: "Completed past actions. Regular -ed; common verbs are irregular (go→went).",
    prerequisites: ["gp-en-present-simple"],
    pitfalls: [
      { wrong: "I goed", right: "I went", note: "'go' is irregular" },
      { wrong: "she studyed", right: "she studied", note: "y→i after consonant" },
    ],
  },
  {
    id: "gp-en-present-continuous",
    language: "en",
    level: "A2",
    title: "Present Continuous",
    summary: "be + verb-ing. Actions happening right now.",
    prerequisites: ["gp-en-present-simple"],
    pitfalls: [
      { wrong: "I am go", right: "I am going", note: "don't drop -ing" },
      { wrong: "she is runing", right: "she is running", note: "double the final consonant" },
    ],
  },
  {
    id: "gp-en-present-perfect",
    language: "en",
    level: "B1",
    title: "Present Perfect",
    summary: "have/has + past participle. Past action with present relevance.",
    prerequisites: ["gp-en-past-simple"],
    pitfalls: [
      { wrong: "I have went", right: "I have gone", note: "use past participle, not past simple" },
      { wrong: "I have seen him yesterday", right: "I saw him yesterday", note: "specific time → past simple" },
    ],
  },
  {
    id: "gp-en-conditionals",
    language: "en",
    level: "B1",
    title: "Conditionals (1st/2nd)",
    summary: "If + present, will + base (1st). If + past, would + base (2nd, hypothetical).",
    prerequisites: ["gp-en-past-simple", "gp-en-present-simple"],
    pitfalls: [
      { wrong: "If I will be rich, I would travel", right: "If I were rich, I would travel", note: "2nd conditional uses 'were' for all subjects" },
    ],
  },

  // ── Chinese ──
  {
    id: "gp-zh-pronouns",
    language: "zh",
    level: "HSK1",
    title: "代词",
    summary: "我 / 你 / 他 / 她 / 我们 / 你们 / 他们。",
    prerequisites: [],
    pitfalls: [
      { wrong: "你们们", right: "你们", note: "们不能叠用" },
    ],
  },
  {
    id: "gp-zh-shi-sentence",
    language: "zh",
    level: "HSK1",
    title: "「是」字句",
    summary: "主语 + 是 + 名词：我是学生。",
    prerequisites: ["gp-zh-pronouns"],
    pitfalls: [
      { wrong: "我是学习", right: "我是学生", note: "是后面接名词，不接动词" },
    ],
  },
  {
    id: "gp-zh-le",
    language: "zh",
    level: "HSK2",
    title: "「了」的用法",
    summary: "表示动作完成或状态改变。句末或动词后。",
    prerequisites: ["gp-zh-shi-sentence"],
    pitfalls: [
      { wrong: "我吃饭了去", right: "我吃了饭去", note: "了放在动词后" },
    ],
  },
  {
    id: "gp-zh-ba",
    language: "zh",
    level: "HSK3",
    title: "「把」字句",
    summary: "主语 + 把 + 宾语 + 动词 + 结果：我把书放在桌上。",
    prerequisites: ["gp-zh-le"],
    pitfalls: [
      { wrong: "我把书看", right: "我把书看了", note: "把字句的动词要有结果/补语" },
    ],
  },

  // ── Japanese ──
  {
    id: "gp-ja-desu",
    language: "ja",
    level: "N5",
    title: "です・ます",
    summary: "丁寧体（敬体）の基本。名词 + です、动词 ます 形。",
    prerequisites: [],
    pitfalls: [
      { wrong: "私は学生だ", right: "私は学生です", note: "丁寧体には「です」" },
    ],
  },
  {
    id: "gp-ja-particles",
    language: "ja",
    level: "N5",
    title: "助词 は・が・を・に",
    summary: "主题 は、主格 が、宾格 を、地点/时间 に。",
    prerequisites: ["gp-ja-desu"],
    pitfalls: [
      { wrong: "私は猫好き", right: "私は猫が好き", note: "好き前用 が" },
    ],
  },
  {
    id: "gp-ja-te-form",
    language: "ja",
    level: "N4",
    title: "て形",
    summary: "动词 て 形：连接句子、请求、进行。规则按动词类别。",
    prerequisites: ["gp-ja-particles"],
    pitfalls: [
      { wrong: "食べています", right: "食べています", note: "正确" },
      { wrong: "食べりて", right: "食べて", note: "一段动词去 る + て" },
    ],
  },
  {
    id: "gp-ja-past",
    language: "ja",
    level: "N4",
    title: "过去形 た",
    summary: "动词过去形：食べた、行った。规则与 て 形相同。",
    prerequisites: ["gp-ja-te-form"],
    pitfalls: [
      { wrong: "食べるた", right: "食べた", note: "一段动词去 る + た" },
    ],
  },
];

/** Get all grammar points for a language, sorted by CEFR rank. */
export function getGrammarPoints(language: Language): GrammarPoint[] {
  return GRAMMAR_POINTS.filter((p) => p.language === language);
}

/** Look up a single grammar point by id. */
export function getGrammarPoint(id: string): GrammarPoint | undefined {
  return GRAMMAR_POINTS.find((p) => p.id === id);
}

/**
 * Map a (language, quiz-question) pair to a grammar point id by
 * matching keywords in the question. Used by the merge script to
 * tag generated quizzes. Returns undefined if no match.
 *
 * Each grammar point's `keywords` are the lowercased distinctive
 * tokens that appear in its quiz questions.
 */
const KEYWORD_MAP: Record<string, { pattern: RegExp; pointId: string }[]> = {
  en: [
    { pattern: /\b(go(es)?|walk(s|ed)?|run(s|ned)?)\b.*\b(she|he|it)\b/, pointId: "gp-en-present-simple-3rd" },
    { pattern: /\b(went|didn't|did not|last (night|week|year))\b/, pointId: "gp-en-past-simple" },
    { pattern: /\b(is|are|am)\s+\w+ing\b/, pointId: "gp-en-present-continuous" },
    { pattern: /\b(have|has)\s+\w+(n|ed)\b/, pointId: "gp-en-present-perfect" },
    { pattern: /\bif\b.*\b(would|will)\b/, pointId: "gp-en-conditionals" },
    { pattern: /\b(i|you|we|they)\b.*\b(go|like|play)\b/, pointId: "gp-en-present-simple" },
    { pattern: /\b(i|you|he|she|we|they)\b/, pointId: "gp-en-pronouns" },
  ],
  zh: [
    { pattern: /把/, pointId: "gp-zh-ba" },
    { pattern: /了/, pointId: "gp-zh-le" },
    { pattern: /是/, pointId: "gp-zh-shi-sentence" },
    { pattern: /(我|你|他|她|我们|你们|他们)/, pointId: "gp-zh-pronouns" },
  ],
  ja: [
    { pattern: /た$|た。|ました|ませんでした/, pointId: "gp-ja-past" },
    { pattern: /て(ください|いる|います)/, pointId: "gp-ja-te-form" },
    { pattern: /(は|が|を|に)/, pointId: "gp-ja-particles" },
    { pattern: /(です|ます)/, pointId: "gp-ja-desu" },
  ],
};

/** Match a quiz question to a grammar point. Returns the point id
 *  or undefined. The first matching pattern wins. */
export function matchGrammarPoint(
  language: Language,
  question: string,
): string | undefined {
  const rules = KEYWORD_MAP[language];
  if (!rules) return undefined;
  for (const rule of rules) {
    if (rule.pattern.test(question)) return rule.pointId;
  }
  return undefined;
}
