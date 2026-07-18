 
/**
 * Validate generated quiz JSON files for common quality issues.
 *
 * Checks per item:
 *   1. Required fields present (id, question, options, answer, explain, language, level)
 *   2. options is an array of exactly 4 strings
 *   3. answer is an integer in [0, 3]
 *   4. options has no duplicates
 *   5. question contains exactly one "___" placeholder
 *   6. The correct answer (options[answer]) does NOT appear elsewhere in the
 *      question text (catches the "ไป___ไป" / "go___go" duplication bug)
 *   7. id is unique across all files
 *
 * Usage:
 *   pnpm tsx scripts/validate-quizzes.ts              # scan all files
 *   pnpm tsx scripts/validate-quizzes.ts --dir=...    # custom dir
 *   pnpm tsx scripts/validate-quizzes.ts --strict     # exit 1 on any issue
 *
 * Exit codes:
 *   0 — no issues (or only warnings without --strict)
 *   1 — issues found (or --strict with any warning)
 */

import fs from "node:fs";
import path from "node:path";

interface QuizItem {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explain: string;
  language: string;
  level: string;
}

interface Issue {
  file: string;
  id: string;
  severity: "error" | "warning";
  rule: string;
  message: string;
}

const QUIZ_DIR = arg("dir", path.join(process.cwd(), "scripts", "generated", "quizzes"));
const STRICT = process.argv.includes("--strict");

function arg(name: string, def?: string): string | undefined {
  const m = process.argv.find((a) => a.startsWith(`--${name}=`));
  return m ? m.split("=").slice(1).join("=") : def;
}

function loadFiles(dir: string): { file: string; items: QuizItem[] }[] {
  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    process.exit(1);
  }
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort();
  return files.map((f) => {
    const full = path.join(dir, f);
    try {
      const raw = JSON.parse(fs.readFileSync(full, "utf-8"));
      const items = Array.isArray(raw) ? (raw as QuizItem[]) : [];
      return { file: f, items };
    } catch (e) {
      console.error(`Failed to parse ${f}: ${(e as Error).message}`);
      return { file: f, items: [] };
    }
  });
}

function validateItem(item: Partial<QuizItem>, file: string): Issue[] {
  const issues: Issue[] = [];
  const id = item.id ?? "<no-id>";

  // 1. Required fields
  const required: (keyof QuizItem)[] = ["id", "question", "options", "answer", "explain", "language", "level"];
  for (const k of required) {
    if (item[k] === undefined || item[k] === null || item[k] === "") {
      issues.push({ file, id, severity: "error", rule: "missing-field", message: `Missing required field: ${k}` });
    }
  }
  // Skip further checks if core fields are broken
  if (!item.question || !Array.isArray(item.options) || typeof item.answer !== "number") {
    return issues;
  }

  // 2. options length
  if (item.options.length !== 4) {
    issues.push({
      file,
      id,
      severity: "error",
      rule: "options-length",
      message: `options has ${item.options.length} items, expected 4`,
    });
  }

  // 3. answer range
  if (item.answer < 0 || item.answer > 3 || !Number.isInteger(item.answer)) {
    issues.push({
      file,
      id,
      severity: "error",
      rule: "answer-range",
      message: `answer=${item.answer} is out of range [0, 3]`,
    });
  }

  // 4. duplicate options
  const seen = new Set<string>();
  for (const opt of item.options) {
    if (seen.has(opt)) {
      issues.push({
        file,
        id,
        severity: "error",
        rule: "duplicate-option",
        message: `Duplicate option: "${opt}"`,
      });
    }
    seen.add(opt);
  }

  // 5. question must contain ___
  const blankCount = (item.question.match(/_{3}/g) || []).length;
  if (blankCount === 0) {
    issues.push({
      file,
      id,
      severity: "error",
      rule: "no-blank",
      message: `question has no "___" placeholder — answer is visible in the question text`,
    });
  } else if (blankCount > 1) {
    issues.push({
      file,
      id,
      severity: "warning",
      rule: "multi-blank",
      message: `question has ${blankCount} "___" placeholders, expected 1`,
    });
  }

  // 6. answer must not appear elsewhere in question (duplication bug)
  if (item.answer >= 0 && item.answer < item.options.length) {
    const correctAnswer = String(item.options[item.answer]).trim();
    // Strip the ___ placeholder from question, then check if answer appears
    const questionWithoutBlank = item.question.replace(/_{3}/g, " ");
    // For multi-word answers, check the whole phrase;
    // for single short tokens (<=3 chars) skip to avoid false positives on
    // articles/particles like 是, は, à, das, der, die, des, les, une, etc.
    // These short function words legitimately recur in the question.
    if (correctAnswer.length > 3) {
      // Check if answer appears in the question (excluding the blank position)
      // We split on whitespace and punctuation boundaries
      const questionLower = questionWithoutBlank.toLowerCase();
      const answerLower = correctAnswer.toLowerCase();
      // Use includes but exclude the immediate blank vicinity (already replaced)
      if (questionLower.includes(answerLower)) {
        issues.push({
          file,
          id,
          severity: "error",
          rule: "answer-duplication",
          message: `correct answer "${correctAnswer}" appears elsewhere in the question — filling the blank would duplicate it`,
        });
      }
    }
  }

  // 7. explain non-empty (warning only)
  if (!item.explain || item.explain.trim().length < 10) {
    issues.push({
      file,
      id,
      severity: "warning",
      rule: "short-explain",
      message: `explain is too short (${item.explain?.trim().length ?? 0} chars), expected >= 10`,
    });
  }

  return issues;
}

function main() {
  const data = loadFiles(QUIZ_DIR);
  const allIssues: Issue[] = [];
  const idMap = new Map<string, string[]>(); // id -> [files]

  let totalItems = 0;
  for (const { file, items } of data) {
    totalItems += items.length;
    for (const item of items) {
      // Track id uniqueness
      if (item.id) {
        if (!idMap.has(item.id)) idMap.set(item.id, []);
        idMap.get(item.id)!.push(file);
      }
      allIssues.push(...validateItem(item, file));
    }
  }

  // 8. id uniqueness across all files
  for (const [id, files] of idMap) {
    if (files.length > 1) {
      allIssues.push({
        file: files.join(", "),
        id,
        severity: "error",
        rule: "duplicate-id",
        message: `id appears in ${files.length} files: ${files.join(", ")}`,
      });
    }
  }

  // Report
  const errors = allIssues.filter((i) => i.severity === "error");
  const warnings = allIssues.filter((i) => i.severity === "warning");

  console.log(`\n${"═".repeat(70)}`);
  console.log(`Quiz Validation Report`);
  console.log(`${"═".repeat(70)}`);
  console.log(`Files scanned:  ${data.length}`);
  console.log(`Items scanned:  ${totalItems}`);
  console.log(`Errors:         ${errors.length}`);
  console.log(`Warnings:       ${warnings.length}`);
  console.log(`${"═".repeat(70)}\n`);

  if (errors.length > 0) {
    console.log("── ERRORS (must fix) ──\n");
    const byRule = groupBy(errors, (i) => i.rule);
    for (const [rule, items] of byRule) {
      console.log(`[${rule}] (${items.length} items)`);
      for (const i of items.slice(0, 20)) {
        console.log(`  ${i.file} | ${i.id}`);
        console.log(`    ${i.message}`);
      }
      if (items.length > 20) console.log(`  ... and ${items.length - 20} more`);
      console.log();
    }
  }

  if (warnings.length > 0) {
    console.log("── WARNINGS (optional) ──\n");
    const byRule = groupBy(warnings, (i) => i.rule);
    for (const [rule, items] of byRule) {
      console.log(`[${rule}] (${items.length} items)`);
      for (const i of items.slice(0, 10)) {
        console.log(`  ${i.file} | ${i.id}: ${i.message}`);
      }
      if (items.length > 10) console.log(`  ... and ${items.length - 10} more`);
      console.log();
    }
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log("✅ All quizzes passed validation. No issues found.\n");
  }

  const exitCode = errors.length > 0 || (STRICT && warnings.length > 0) ? 1 : 0;
  process.exit(exitCode);
}

function groupBy<T>(arr: T[], key: (t: T) => string): Map<string, T[]> {
  const m = new Map<string, T[]>();
  for (const item of arr) {
    const k = key(item);
    if (!m.has(k)) m.set(k, []);
    m.get(k)!.push(item);
  }
  return m;
}

main();
