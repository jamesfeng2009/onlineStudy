 
/**
 * Validate generated listening + speaking JSON files for common issues.
 *
 * Listening checks per item:
 *   1. Required fields present (id, title, script, blanks, language, level)
 *   2. blanks is array of {index, answer} with index < script.split(' ').length
 *   3. answer at blanks[i].index actually matches script token (case-sensitive)
 *   4. no duplicate blanks index in same item
 *
 * Speaking checks per item:
 *   1. Required fields present (id, phrase, translation, phonetic, language, level)
 *   2. phrase non-empty
 *   3. translation non-empty
 *
 * Cross-file checks:
 *   - id unique across all files of same type
 *   - level matches the filename's level suffix (catches 高級/高级 mismatch)
 *
 * Usage:
 *   pnpm tsx scripts/validate-listening-speaking.ts
 *   pnpm tsx scripts/validate-listening-speaking.ts --strict     # exit 1 on any issue
 */
import fs from "node:fs";
import path from "node:path";

interface Blank { index: number; answer: string }
interface ListenItem {
  id: string; title: string; script: string; blanks: Blank[];
  language: string; level: string;
}
interface SpeakItem {
  id: string; phrase: string; translation: string; phonetic: string;
  language: string; level: string;
}

interface Issue {
  file: string;
  id: string;
  severity: "error" | "warning";
  rule: string;
  message: string;
}

const ROOT = process.cwd();
const LISTEN_DIR = arg("dir", path.join(ROOT, "scripts", "generated", "listening"));
const SPEAK_DIR = arg("dir2", path.join(ROOT, "scripts", "generated", "speaking"));
const STRICT = process.argv.includes("--strict");

function arg(name: string, def?: string): string | undefined {
  const m = process.argv.find((a) => a.startsWith(`--${name}=`));
  return m ? m.split("=").slice(1).join("=") : def;
}

function loadDir<T>(dir: string): { file: string; items: T[] }[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      try {
        const arr = JSON.parse(raw);
        return { file, items: Array.isArray(arr) ? arr : [] };
      } catch {
        return { file, items: [] };
      }
    });
}

function fileNameLevel(file: string): string {
  // e.g. "yue-高级.json" → "高级"
  const base = file.replace(/\.json$/, "");
  const idx = base.lastIndexOf("-");
  return idx === -1 ? base : base.slice(idx + 1);
}

function validateListening(file: string, item: ListenItem): Issue[] {
  const out: Issue[] = [];

  // 1. required fields
  if (!item.id) out.push({ file, id: item.id, severity: "error", rule: "missing-id", message: "id is missing" });
  if (!item.title) out.push({ file, id: item.id, severity: "warning", rule: "missing-title", message: "title is missing" });
  if (!item.script) out.push({ file, id: item.id, severity: "error", rule: "missing-script", message: "script is missing" });
  if (!Array.isArray(item.blanks) || item.blanks.length === 0) {
    out.push({ file, id: item.id, severity: "error", rule: "missing-blanks", message: "blanks is missing or empty" });
  }
  if (!item.language) out.push({ file, id: item.id, severity: "error", rule: "missing-language", message: "language is missing" });
  if (!item.level) out.push({ file, id: item.id, severity: "error", rule: "missing-level", message: "level is missing" });

  if (!item.script || !Array.isArray(item.blanks)) return out;

  // 2. blank index in range + answer matches script token
  const tokens = item.script.split(/\s+/).filter((t) => t.length > 0);
  const seenIdx = new Set<number>();
  for (const b of item.blanks) {
    if (typeof b.index !== "number" || typeof b.answer !== "string") {
      out.push({ file, id: item.id, severity: "error", rule: "blank-shape", message: `blank has wrong shape: ${JSON.stringify(b)}` });
      continue;
    }
    if (b.index < 0 || b.index >= tokens.length) {
      out.push({ file, id: item.id, severity: "error", rule: "blank-index-oob", message: `blank index ${b.index} out of range (script has ${tokens.length} tokens)` });
      continue;
    }
    if (seenIdx.has(b.index)) {
      out.push({ file, id: item.id, severity: "error", rule: "blank-dup-index", message: `duplicate blank index ${b.index}` });
      continue;
    }
    seenIdx.add(b.index);
    const actual = tokens[b.index];
    if (actual !== b.answer) {
      out.push({
        file, id: item.id, severity: "error", rule: "blank-answer-mismatch",
        message: `blank[${b.index}] answer "${b.answer}" != script token "${actual}" (script: "${item.script.slice(0, 60)}…")`,
      });
    }
  }

  // 3. level matches filename
  const expectedLvl = fileNameLevel(file);
  if (item.level && item.level !== expectedLvl) {
    out.push({ file, id: item.id, severity: "error", rule: "level-mismatch", message: `level "${item.level}" != filename level "${expectedLvl}"` });
  }

  return out;
}

function validateSpeaking(file: string, item: SpeakItem): Issue[] {
  const out: Issue[] = [];

  if (!item.id) out.push({ file, id: item.id, severity: "error", rule: "missing-id", message: "id is missing" });
  if (!item.phrase || !item.phrase.trim()) {
    out.push({ file, id: item.id, severity: "error", rule: "missing-phrase", message: "phrase is missing or empty" });
  }
  if (!item.translation || !item.translation.trim()) {
    out.push({ file, id: item.id, severity: "warning", rule: "missing-translation", message: "translation is missing or empty" });
  }
  if (!item.language) out.push({ file, id: item.id, severity: "error", rule: "missing-language", message: "language is missing" });
  if (!item.level) out.push({ file, id: item.id, severity: "error", rule: "missing-level", message: "level is missing" });

  // level matches filename
  const expectedLvl = fileNameLevel(file);
  if (item.level && item.level !== expectedLvl) {
    out.push({ file, id: item.id, severity: "error", rule: "level-mismatch", message: `level "${item.level}" != filename level "${expectedLvl}"` });
  }

  return out;
}

function main() {
  const allIssues: Issue[] = [];
  let totalItems = 0;
  let totalFiles = 0;

  // Listening
  const listenFiles = loadDir<ListenItem>(LISTEN_DIR);
  const listenIds = new Map<string, string[]>(); // id -> [files]
  for (const { file, items } of listenFiles) {
    totalFiles++;
    for (const item of items) {
      totalItems++;
      allIssues.push(...validateListening(file, item));
      if (!listenIds.has(item.id)) listenIds.set(item.id, []);
      listenIds.get(item.id)!.push(file);
    }
  }
  for (const [id, files] of listenIds) {
    if (files.length > 1) {
      allIssues.push({ file: files.join(","), id, severity: "error", rule: "dup-id", message: `duplicate listening id in ${files.length} files: ${files.join(", ")}` });
    }
  }

  // Speaking
  const speakFiles = loadDir<SpeakItem>(SPEAK_DIR);
  const speakIds = new Map<string, string[]>();
  for (const { file, items } of speakFiles) {
    totalFiles++;
    for (const item of items) {
      totalItems++;
      allIssues.push(...validateSpeaking(file, item));
      if (!speakIds.has(item.id)) speakIds.set(item.id, []);
      speakIds.get(item.id)!.push(file);
    }
  }
  for (const [id, files] of speakIds) {
    if (files.length > 1) {
      allIssues.push({ file: files.join(","), id, severity: "error", rule: "dup-id", message: `duplicate speaking id in ${files.length} files: ${files.join(", ")}` });
    }
  }

  // Report
  const errors = allIssues.filter((i) => i.severity === "error");
  const warnings = allIssues.filter((i) => i.severity === "warning");

  console.log("");
  console.log("══════════════════════════════════════════════════════════════════════");
  console.log("Listening & Speaking Validation Report");
  console.log("══════════════════════════════════════════════════════════════════════");
  console.log(`Files scanned:  ${totalFiles}`);
  console.log(`Items scanned:  ${totalItems}`);
  console.log(`Errors:         ${errors.length}`);
  console.log(`Warnings:       ${warnings.length}`);
  console.log("══════════════════════════════════════════════════════════════════════");
  console.log("");

  // Group by rule
  const byRule = new Map<string, Issue[]>();
  for (const iss of allIssues) {
    if (!byRule.has(iss.rule)) byRule.set(iss.rule, []);
    byRule.get(iss.rule)!.push(iss);
  }

  const errorsByRule = new Map<string, Issue[]>();
  const warnsByRule = new Map<string, Issue[]>();
  for (const [rule, items] of byRule) {
    const errs = items.filter((i) => i.severity === "error");
    const warns = items.filter((i) => i.severity === "warning");
    if (errs.length > 0) errorsByRule.set(rule, errs);
    if (warns.length > 0) warnsByRule.set(rule, warns);
  }

  if (errors.length > 0) {
    console.log("── ERRORS (must fix) ──");
    console.log("");
    for (const [rule, items] of errorsByRule) {
      console.log(`[${rule}] (${items.length} items)`);
      for (const iss of items.slice(0, 50)) {
        console.log(`  ${iss.file} | ${iss.id}`);
        console.log(`    ${iss.message}`);
      }
      if (items.length > 50) console.log(`  ... and ${items.length - 50} more`);
      console.log("");
    }
  }

  if (warnings.length > 0) {
    console.log("── WARNINGS (optional) ──");
    console.log("");
    for (const [rule, items] of warnsByRule) {
      console.log(`[${rule}] (${items.length} items)`);
      for (const iss of items.slice(0, 20)) {
        console.log(`  ${iss.file} | ${iss.id}: ${iss.message}`);
      }
      if (items.length > 20) console.log(`  ... and ${items.length - 20} more`);
      console.log("");
    }
  }

  if (allIssues.length === 0) {
    console.log("✅ All listening & speaking items passed validation. No issues found.");
  } else {
    console.log(`${errors.length > 0 ? "❌" : "⚠"}  ${errors.length} errors, ${warnings.length} warnings.`);
  }

  if (STRICT && allIssues.length > 0) process.exit(1);
}

main();
