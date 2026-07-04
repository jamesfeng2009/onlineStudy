/* eslint-disable no-console */
/**
 * Validate generated dialogue scenes against the 4 defenses:
 *   1. id 唯一 (no duplicate scene ids)
 *   2. turn id 引用合法 (every branch.nextTurnId and startTurnId
 *      refers to a turn that actually exists in the same scene)
 *   3. 关键词非空 (every branch has at least 1 non-empty keyword,
 *      except the LAST branch which may be a wildcard)
 *   4. startTurnId 存在 (startTurnId must be a key in `turns`)
 *
 * Usage: pnpm tsx scripts/validate-dialogue-scenes.ts
 *        pnpm tsx scripts/validate-dialogue-scenes.ts --strict (exit 1 on warnings too)
 */
import fs from "node:fs";
import path from "node:path";

const SRC = path.join(process.cwd(), "scripts", "generated", "dialogues");
const STRICT = process.argv.includes("--strict");

interface Turn {
  id: string;
  prompt: string;
  promptTranslation?: string;
  branches: { keywords: string[]; nextTurnId: string }[];
  fallbackBranchId: string;
  isTerminal?: boolean;
}
interface Scene {
  id: string;
  language: string;
  level: string;
  scenario: string;
  title: string;
  opening: string;
  startTurnId: string;
  turns: Record<string, Turn>;
}

function isValidScene(s: any): s is Scene {
  return s && typeof s === "object" && s.turns && typeof s.turns === "object" && s.id && s.startTurnId;
}

function validate(file: string, scene: Scene): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const turnIds = new Set(Object.keys(scene.turns));

  if (!scene.id) errors.push("missing `id`");
  if (!scene.language) errors.push("missing `language`");
  if (!scene.opening) errors.push("missing `opening`");
  if (!Array.isArray(Object.values(scene.turns)) || turnIds.size === 0) {
    errors.push("`turns` is empty");
  }

  // Defense 4: startTurnId 存在
  if (!turnIds.has(scene.startTurnId)) {
    errors.push(`startTurnId "${scene.startTurnId}" not found in turns`);
  }

  // Defense 2 + 3: per-turn checks
  let hasTerminal = false;
  for (const [turnId, turn] of Object.entries(scene.turns)) {
    if (turn.id !== turnId) {
      errors.push(`turn key "${turnId}" doesn't match inner id "${turn.id}"`);
    }
    if (!turn.prompt || turn.prompt.trim().length < 2) {
      errors.push(`turn "${turnId}" has empty/short prompt`);
    }
    if (turn.isTerminal) hasTerminal = true;
    // Terminal turns are allowed to have empty branches (they end
    // the conversation). Non-terminal turns must have at least one
    // branch.
    if (!Array.isArray(turn.branches)) {
      errors.push(`turn "${turnId}" branches is not an array`);
      continue;
    }
    if (turn.branches.length === 0 && !turn.isTerminal) {
      errors.push(`turn "${turnId}" has no branches and is not terminal`);
      continue;
    }
    if (turn.branches.length === 0) continue; // valid terminal
    // Defense 3: 关键词非空
    for (let i = 0; i < turn.branches.length; i++) {
      const b = turn.branches[i];
      const isLast = i === turn.branches.length - 1;
      const nonEmpty = (b.keywords ?? []).filter((k) => k && k.trim().length > 0);
      if (nonEmpty.length === 0 && !isLast) {
        errors.push(`turn "${turnId}" branch ${i}: empty keywords and not the last branch (wildcard only allowed on last branch)`);
      }
      // Defense 2: branch 引用合法
      if (b.nextTurnId && !turnIds.has(b.nextTurnId)) {
        errors.push(`turn "${turnId}" branch ${i} → nextTurnId "${b.nextTurnId}" not found`);
      }
    }
    // Defense 2: fallback 引用合法
    if (turn.fallbackBranchId && !turnIds.has(turn.fallbackBranchId)) {
      errors.push(`turn "${turnId}" → fallbackBranchId "${turn.fallbackBranchId}" not found`);
    }
  }
  if (!hasTerminal) errors.push("no terminal turn (no turn has isTerminal=true)");

  // Soft warnings (non-fatal)
  if (!scene.title) warnings.push("missing `title`");
  for (const turn of Object.values(scene.turns)) {
    if (!turn.promptTranslation) warnings.push(`turn "${turn.id}" missing promptTranslation`);
  }
  return { errors, warnings };
}

function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`No ${SRC}; nothing to validate.`);
    process.exit(0);
  }
  const files = fs.readdirSync(SRC).filter((f) => f.endsWith(".json"));
  if (files.length === 0) {
    console.log("No generated dialogue scenes found.");
    return;
  }
  let totalErrors = 0;
  let totalWarnings = 0;
  const seenIds = new Map<string, string>();
  for (const file of files) {
    const fp = path.join(SRC, file);
    let scene: Scene | null = null;
    try {
      const raw = fs.readFileSync(fp, "utf-8");
      const parsed = JSON.parse(raw);
      if (!isValidScene(parsed)) {
        console.error(`✗ ${file}: not a valid DialogueScene shape`);
        totalErrors++;
        continue;
      }
      scene = parsed;
    } catch (e) {
      console.error(`✗ ${file}: parse error: ${(e as Error).message}`);
      totalErrors++;
      continue;
    }
    // Defense 1: id 唯一
    if (seenIds.has(scene.id)) {
      console.error(`✗ ${file}: duplicate scene id "${scene.id}" also in ${seenIds.get(scene.id)}`);
      totalErrors++;
    } else {
      seenIds.set(scene.id, file);
    }
    const { errors, warnings } = validate(file, scene);
    if (errors.length === 0 && warnings.length === 0) {
      console.log(`✓ ${file}`);
    } else {
      for (const e of errors) console.error(`  ✗ ${e}`);
      for (const w of warnings) console.warn(`  ! ${w}`);
    }
    totalErrors += errors.length;
    totalWarnings += warnings.length;
  }
  console.log(`\n=== ${files.length} files: ${totalErrors} errors, ${totalWarnings} warnings ===`);
  if (totalErrors > 0 || (STRICT && totalWarnings > 0)) process.exit(1);
}

main();
