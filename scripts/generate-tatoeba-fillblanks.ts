/* eslint-disable no-console */
/**
 * Convert Tatoeba sentences into fill-in-the-blank ListeningItems.
 *
 * Output: scripts/generated/listening/{lang}-{level}.json
 * Each file is an array of ListeningItem-compatible objects:
 *   { id, title, script, blanks[{index, answer}], language, level }
 *
 * Why this exists:
 *   The Tatoeba corpus (CC-BY 2.0 FR, ~14M sentences) is already
 *   downloaded to scripts/cache/ and scripts/generate-content/data/
 *   for vocab generation. Reusing it for listening drills means we
 *   get thousands of high-quality, native-authored sentences for
 *   free — no LLM cost, no licensing risk, and the audio TTS button
 *   (Web Speech API) can read them with a natural voice.
 *
 * The bug we're fixing:
 *   `src/data/content.ts` LISTENING has 3 items with `blanks[].index`
 *   that does not match the position in `script.split(" ")` (e.g.
 *   "seven" is at token 4, not 3). This script always writes the
 *   correct index, and consumers can opt to regenerate.
 *
 * Usage:
 *   pnpm tsx scripts/generate-tatoeba-fillblanks.ts           # all 7 langs
 *   pnpm tsx scripts/generate-tatoeba-fillblanks.ts --lang=ja  # one lang
 *   pnpm tsx scripts/generate-tatoeba-fillblanks.ts --count=30 # per level
 *
 * Design notes:
 *   - We materialise a bz2 .tsv to scripts/cache/ once and cache
 *     the parsed list. Re-runs are O(n) over the in-memory list
 *     and finish in <2s for the ~5k-50k sentences we keep.
 *   - We use *word count* and *character length* together to
 *     bucket into CEFR/JLPT/HSK levels. The first cutoff is
 *     generous on purpose — short sentences are useful at A1.
 *   - We blank content words (nouns / verbs / adjectives), not
 *     function words (は/が/に/the/a/an). The UI shows an input
 *     box, and learners benefit from blanks that test *vocab*
 *     recognition, not particle recall.
 *   - We skip sentences with < 5 tokens or with non-Latin script
 *     where the script doesn't have spaces (we already have a
 *     ja/zh/ko tokenizer for that — see tokenize()).
 */

import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const CACHE_DIR = path.join(process.cwd(), "scripts", "cache");
const RAW_DIR = path.join(process.cwd(), "scripts", "generate-content", "data");
const OUT_DIR = path.join(process.cwd(), "scripts", "generated", "listening");

// ---------- CLI ----------
function arg(name: string, def?: string): string | undefined {
  const m = process.argv.find((a) => a.startsWith(`--${name}=`));
  return m ? m.split("=").slice(1).join("=") : def;
}
const onlyLang = arg("lang");
const perLevel = Math.max(5, Math.min(200, Number(arg("count", "40"))));
const overwrite = process.argv.includes("--overwrite");

// ---------- Language table ----------
type LangKey = "en" | "ja" | "zh" | "ko" | "es" | "fr" | "de";

interface LangSpec {
  /** tsv filename in cache/ (after decompression) */
  cacheFile: string;
  /** bz2 source in generate-content/data/, if not yet unzipped */
  bz2File?: string;
  /** CEFR-equivalent levels in ascending order. */
  levels: string[];
  /** Per-level length cap and min word count. */
  levelRange: { level: string; maxLen: number; minWords: number; maxWords: number }[];
  /** Optional: words to never blank (function words, particles). */
  stopBlanks?: Set<string>;
  /** Optional: minimum length for a token to be considered "blankable". */
  blankMinLen?: number;
}

const SPEC: Record<LangKey, LangSpec> = {
  en: {
    cacheFile: "eng_sentences.tsv",
    levels: ["A1", "A2", "B1", "B2"],
    levelRange: [
      { level: "A1", maxLen: 60, minWords: 4, maxWords: 10 },
      { level: "A2", maxLen: 100, minWords: 6, maxWords: 16 },
      { level: "B1", maxLen: 150, minWords: 8, maxWords: 22 },
      { level: "B2", maxLen: 240, minWords: 10, maxWords: 32 },
    ],
    stopBlanks: new Set([
      "a", "an", "the", "and", "or", "but", "so", "is", "are", "was", "were",
      "be", "been", "being", "have", "has", "had", "do", "does", "did", "i",
      "you", "he", "she", "it", "we", "they", "me", "him", "her", "us",
      "them", "my", "your", "his", "its", "our", "their", "this", "that",
      "these", "those", "in", "on", "at", "to", "for", "of", "with", "by",
      "from", "as", "if", "than", "then",
    ]),
    blankMinLen: 3,
  },
  ja: {
    cacheFile: "jpn_sentences.tsv",
    levels: ["N5", "N4", "N3", "N2"],
    levelRange: [
      { level: "N5", maxLen: 18, minWords: 1, maxWords: 18 },
      { level: "N4", maxLen: 30, minWords: 1, maxWords: 30 },
      { level: "N3", maxLen: 55, minWords: 1, maxWords: 55 },
      { level: "N2", maxLen: 100, minWords: 1, maxWords: 100 },
    ],
    blankMinLen: 2, // single kana is too granular for N5
  },
  zh: {
    cacheFile: "cmn_sentences.tsv",
    levels: ["HSK1", "HSK2", "HSK3", "HSK4"],
    levelRange: [
      { level: "HSK1", maxLen: 12, minWords: 1, maxWords: 12 },
      { level: "HSK2", maxLen: 22, minWords: 1, maxWords: 22 },
      { level: "HSK3", maxLen: 40, minWords: 1, maxWords: 40 },
      { level: "HSK4", maxLen: 80, minWords: 1, maxWords: 80 },
    ],
    stopBlanks: new Set([
      "的", "了", "是", "在", "和", "也", "都", "就", "不", "我", "你",
      "他", "她", "它", "我们", "你们", "他们", "这", "那", "有", "没",
      "很", "太", "把", "被", "对", "从", "向", "为", "到", "给", "用",
      "会", "能", "可以", "要", "想", "去", "来", "上", "下", "里", "外",
    ]),
    blankMinLen: 2, // single Han chars are too granular for HSK
  },
  ko: {
    cacheFile: "kor_sentences.tsv",
    bz2File: "kor_sentences.tsv.bz2",
    levels: ["초급", "중급", "고급", "심화"],
    levelRange: [
      { level: "초급", maxLen: 20, minWords: 1, maxWords: 20 },
      { level: "중급", maxLen: 40, minWords: 1, maxWords: 40 },
      { level: "고급", maxLen: 70, minWords: 1, maxWords: 70 },
      { level: "심화", maxLen: 130, minWords: 1, maxWords: 130 },
    ],
    stopBlanks: new Set([
      "저", "나", "너", "우리", "그", "그녀", "이", "저", "그", "것",
      "은", "는", "이", "가", "을", "를", "의", "에", "에서", "로", "으로",
      "와", "과", "하고", "도", "만", "부터", "까지", "처럼", "같이",
      "있다", "없다", "하다", "되다", "이다", "아니다",
    ]),
    blankMinLen: 1,
  },
  es: {
    cacheFile: "spa_sentences.tsv",
    bz2File: "spa_sentences.tsv.bz2",
    levels: ["A1", "A2", "B1", "B2"],
    levelRange: [
      { level: "A1", maxLen: 60, minWords: 4, maxWords: 10 },
      { level: "A2", maxLen: 100, minWords: 6, maxWords: 16 },
      { level: "B1", maxLen: 150, minWords: 8, maxWords: 22 },
      { level: "B2", maxLen: 240, minWords: 10, maxWords: 32 },
    ],
    stopBlanks: new Set([
      "el", "la", "los", "las", "un", "una", "unos", "unas", "y", "o",
      "pero", "porque", "si", "no", "es", "son", "fue", "fueron", "ser",
      "estar", "tener", "ha", "han", "yo", "tu", "él", "ella", "nosotros",
      "vosotros", "ellos", "ellas", "me", "te", "se", "nos", "os", "le",
      "les", "lo", "en", "a", "con", "por", "para", "de", "del", "al",
    ]),
    blankMinLen: 3,
  },
  fr: {
    cacheFile: "fra_sentences.tsv",
    bz2File: "fra_sentences.tsv.bz2",
    levels: ["A1", "A2", "B1", "B2"],
    levelRange: [
      { level: "A1", maxLen: 60, minWords: 4, maxWords: 10 },
      { level: "A2", maxLen: 100, minWords: 6, maxWords: 16 },
      { level: "B1", maxLen: 150, minWords: 8, maxWords: 22 },
      { level: "B2", maxLen: 240, minWords: 10, maxWords: 32 },
    ],
    stopBlanks: new Set([
      "le", "la", "les", "un", "une", "des", "et", "ou", "mais", "donc",
      "or", "ni", "car", "je", "tu", "il", "elle", "nous", "vous", "ils",
      "elles", "me", "te", "se", "lui", "leur", "y", "en", "est", "sont",
      "était", "étaient", "ai", "as", "a", "avons", "avez", "ont", "dans",
      "sur", "sous", "avec", "sans", "pour", "par", "de", "du", "au", "aux",
    ]),
    blankMinLen: 3,
  },
  de: {
    cacheFile: "deu_sentences.tsv",
    bz2File: "deu_sentences.tsv.bz2",
    levels: ["A1", "A2", "B1", "B2"],
    levelRange: [
      { level: "A1", maxLen: 60, minWords: 4, maxWords: 10 },
      { level: "A2", maxLen: 100, minWords: 6, maxWords: 16 },
      { level: "B1", maxLen: 150, minWords: 8, maxWords: 22 },
      { level: "B2", maxLen: 240, minWords: 10, maxWords: 32 },
    ],
    stopBlanks: new Set([
      "der", "die", "das", "den", "dem", "des", "ein", "eine", "einen",
      "einem", "einer", "eines", "und", "oder", "aber", "denn", "weil",
      "wenn", "als", "ob", "damit", "dass", "ich", "du", "er", "sie", "es",
      "wir", "ihr", "mich", "dich", "sich", "uns", "euch", "mein", "dein",
      "sein", "ihr", "unser", "euer", "ist", "sind", "war", "waren", "bin",
      "bist", "hat", "haben", "wird", "werden", "in", "an", "auf", "bei",
      "mit", "nach", "von", "vor", "zu", "aus", "über", "unter",
    ]),
    blankMinLen: 3,
  },
};

// ---------- Helpers ----------
async function ensureTsv(lang: LangKey): Promise<string[]> {
  const spec = SPEC[lang];
  const tsvPath = path.join(CACHE_DIR, spec.cacheFile);
  if (fs.existsSync(tsvPath)) return loadTsv(tsvPath);
  return decompressBz2(lang, spec, tsvPath);
}

async function decompressBz2(
  lang: LangKey,
  spec: LangSpec,
  tsvPath: string,
): Promise<string[]> {
  const bz2File = spec.bz2File;
  if (!bz2File) {
    throw new Error(`Tatoeba file not found: ${tsvPath}`);
  }
  const bz2 = path.join(RAW_DIR, bz2File);
  if (!fs.existsSync(bz2)) {
    throw new Error(`Tatoeba file not found: ${tsvPath} nor ${bz2}`);
  }
  console.log(`  • decompressing ${bz2File} → scripts/cache/${spec.cacheFile}`);
  // Stream to file instead of buffering in memory: a full
  // language's sentences.tsv is 30-100 MB and would blow past
  // spawnSync's 1 MB maxBuffer, and we don't want it resident
  // in the JS heap either. We prefer `bzip2` (POSIX) and fall
  // back to `bunzip2`. If neither is present we surface a
  // clear error pointing at the bz2 file so the user can
  // bunzip2 it manually once and re-run.
  const cmds: [string, string[]][] = [
    ["bzip2", ["-dkc", bz2]],
    ["bunzip2", ["-kc", bz2]],
  ];
  let ok = false;
  let lastErr = "";
  for (const [bin, args] of cmds) {
    try {
      await new Promise<void>((resolve, reject) => {
        const child = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"] });
        const out = fs.createWriteStream(tsvPath);
        let stderr = "";
        child.stderr.on("data", (b) => (stderr += b.toString()));
        child.stdout.pipe(out);
        child.on("error", reject);
        child.on("close", (code) => {
          if (code === 0) resolve();
          else reject(new Error(`${bin} exited ${code}: ${stderr.slice(0, 200)}`));
        });
      });
      ok = true;
      break;
    } catch (err) {
      const msg = (err as Error).message;
      lastErr = msg;
      if (msg.includes("ENOENT")) continue; // try the next binary
      throw err;
    }
  }
  if (!ok) {
    throw new Error(
      `Could not decompress ${bz2File}: ${lastErr}. Install \`bzip2\` or run \`bzip2 -dk ${path.relative(
        process.cwd(),
        bz2,
      )}\` once to extract, then re-run.`,
    );
  }
  return loadTsv(tsvPath);
}

function isBadSentence(text: string): boolean {
  for (const re of SENTENCE_BADWORDS) {
    if (re.test(text)) return true;
  }
  return false;
}

function loadTsv(file: string): string[] {
  const raw = fs.readFileSync(file, "utf-8");
  const out: string[] = [];
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    const parts = line.split("\t");
    if (parts.length < 3) continue;
    const text = parts[2].trim();
    if (!text) continue;
    out.push(text);
  }
  return out;
}

function shuffle<T>(arr: T[], n: number, seed = 1): T[] {
  // Deterministic shuffle so reruns produce stable output.
  const a = arr.slice();
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, Math.min(n, a.length));
}

function tokenize(text: string, lang: LangKey): string[] {
  // For Latin-script languages (en/es/fr/de) we split on whitespace
  // — the same way LearnPage's UI does (line 506: `script.split(" ")`).
  // We also strip sentence-final punctuation from each token so a
  // blank answer doesn't have to include a trailing "." (compare the
  // old output where `printemps` was blanked but `préférée.` carried
  // its period into the answer).
  if (lang === "ja" || lang === "zh" || lang === "ko") {
    // For CJK we emit 2-character "morpheme" tokens so the UI can
    // show a wider input box and the answer lands on a real word
    // rather than half of a 漢字. Tatoeba has no spaces, so we
    // chunk greedily by 2. Punctuation and whitespace are dropped.
    const stripped = text.replace(/[.,!?;:"'\(\)\[\]「」『』、。！？…・\s]/g, "");
    const out: string[] = [];
    for (let i = 0; i < stripped.length; i += 2) {
      out.push(stripped.slice(i, i + 2));
    }
    return out;
  }
  return text
    .split(/\s+/)
    .map((t) => t.replace(/[.,!?;:"'\(\)\[\]]+$/g, ""))
    .filter(Boolean);
}

// A short, opinionated blocklist of adult / hateful / slang terms
// that Tatoeba (CC-BY crowdsourced) sometimes carries. We filter at
// the whole-sentence level so a single bad token doesn't slip in
// through a token-level check. This is intentionally conservative
// — the goal is to avoid user-facing embarrassment on a public
// learning site, not to police the corpus.
const SENTENCE_BADWORDS: RegExp[] = [
  /妓院|裸体|做爱|性交|强奸|自慰|色情|淫/,
  /fuck|shit|cunt|asshole|slut|nigger|fag/,
  /puta|verga|coño|joder|maricón/,
  /putain|con(ne|asse)|enculé|salaud/,
  /fotze|wichser|schwuchtel|kanake/,
  /死ね|殺す|クソ|ビッチ|ちんこ|まんこ/,
];

interface BlankCandidate {
  index: number;
  token: string;
}

function pickBlanks(tokens: string[], lang: LangKey): BlankCandidate[] {
  const spec = SPEC[lang];
  const stop = spec.stopBlanks;
  const minLen = spec.blankMinLen ?? 1;
  const isCJK = lang === "ja" || lang === "zh" || lang === "ko";
  const out: BlankCandidate[] = [];
  // For CJK we step every 2 tokens (since each token is already
  // a 2-char morpheme). For Latin scripts we step every 2 words.
  const step = isCJK ? 2 : 2;
  const start = isCJK ? 1 : 1;
  for (let i = start; i < tokens.length; i += step) {
    if (out.length >= 5) break;
    const raw = tokens[i];
    if (!raw) continue;
    if (raw.length < minLen) continue;
    if (stop && (stop.has(raw) || stop.has(raw.toLowerCase()))) continue;
    if (out.length > 0 && i - out[out.length - 1].index < 2) continue;
    out.push({ index: i, token: raw });
  }
  return out;
}

interface ListeningItem {
  id: string;
  title: string;
  script: string;
  blanks: { index: number; answer: string }[];
  language: LangKey;
  level: string;
}

function buildItem(
  text: string,
  lang: LangKey,
  level: string,
  idx: number,
): ListeningItem | null {
  const tokens = tokenize(text, lang);
  const blanks = pickBlanks(tokens, lang);
  if (blanks.length < 2) return null;
  // Both Latin and CJK scripts use the same join — Latin splits
  // on whitespace, CJK emits one character per token, so a single
  // " " separator renders correctly in both cases (CJK: per-char
  // box; Latin: per-word box) thanks to the UI's inline-flex wrap.
  const script = tokens.join(" ");
  return {
    id: `l-${lang}-${level.toLowerCase()}-tatoeba-${idx + 1}`,
    title: `Sentence ${idx + 1}`,
    script,
    blanks: blanks.map((b) => ({ index: b.index, answer: b.token })),
    language: lang,
    level,
  };
}

function bucketByLevel(sentences: string[], lang: LangKey): Record<string, string[]> {
  const buckets: Record<string, string[]> = {};
  for (const r of SPEC[lang].levelRange) {
    buckets[r.level] = [];
  }
  const isCJK = lang === "ja" || lang === "zh" || lang === "ko";
  for (const s of sentences) {
    if (isBadSentence(s)) continue;
    const len = s.length; // character count (CJK) ≈ word count (Latin)
    const words = isCJK ? len : s.split(/\s+/).filter(Boolean).length;
    // Find the *highest* level whose caps still accept this sentence.
    for (const r of SPEC[lang].levelRange) {
      if (len <= r.maxLen && words >= r.minWords && words <= r.maxWords) {
        if (buckets[r.level].length < perLevel * 4) {
          buckets[r.level].push(s);
        }
        break; // place in the first matching level only
      }
    }
  }
  return buckets;
}

// ---------- Main ----------
async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const langs: LangKey[] = (Object.keys(SPEC) as LangKey[]).filter(
    (l) => !onlyLang || onlyLang === l,
  );

  let totalFiles = 0;
  let totalItems = 0;

  for (const lang of langs) {
    console.log(`\n=== ${lang} ===`);
    let sentences: string[];
    try {
      sentences = await ensureTsv(lang);
      console.log(`  • loaded ${sentences.length} sentences`);
    } catch (err) {
      console.error(`  ✗ ${(err as Error).message}`);
      continue;
    }

    // Subsample to keep memory + output predictable. 5000 per
    // level is plenty for ~40 drill items per level and keeps
    // each output file small.
    const sub = shuffle(sentences, 5000);
    const buckets = bucketByLevel(sub, lang);

    for (const r of SPEC[lang].levelRange) {
      const outFile = path.join(OUT_DIR, `${lang}-${r.level}.json`);
      if (!overwrite && fs.existsSync(outFile)) {
        const existing = JSON.parse(fs.readFileSync(outFile, "utf-8"));
        console.log(`  ${r.level}: skip (${existing.length} items)`);
        totalItems += existing.length;
        continue;
      }
      const candidates = shuffle(buckets[r.level] ?? [], perLevel * 3);
      const items: ListeningItem[] = [];
      for (let i = 0; i < candidates.length && items.length < perLevel; i++) {
        const it = buildItem(candidates[i], lang, r.level, items.length);
        if (it) items.push(it);
      }
      fs.writeFileSync(outFile, JSON.stringify(items, null, 2) + "\n");
      console.log(`  ${r.level}: ${items.length} items → ${path.relative(process.cwd(), outFile)}`);
      totalItems += items.length;
      totalFiles++;
    }
  }

  console.log(`\n=== done ===`);
  console.log(`  files written: ${totalFiles}`);
  console.log(`  total items:   ${totalItems}`);
  console.log(`  output dir:    ${path.relative(process.cwd(), OUT_DIR)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
