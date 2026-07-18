/* eslint-disable @typescript-eslint/no-explicit-any */
 
/**
 * Merge generated dialogue scenes into the hand-authored list in
 * src/data/dialogue-scenes.ts. Idempotent: scenes that already
 * exist by id are skipped (no overwrite of the human-authored ones).
 *
 * **Gatekeeper role**: this script is the last line of defense before
 * generated scenes reach `src/data/` and get type-checked by `pnpm build`.
 * Each scene is validated with the same rules as
 * `validate-dialogue-scenes.ts`; invalid scenes are SKIPPED (not merged)
 * and logged so the workflow stays green even when a handful of LLM
 * outputs can't be repaired.
 *
 * Usage: pnpm tsx scripts/merge-dialogue-scenes.ts
 */
import fs from "node:fs";
import path from "node:path";

const SRC = path.join(process.cwd(), "scripts", "generated", "dialogues");
const EXISTING_FILE = path.join(
  process.cwd(),
  "src",
  "data",
  "dialogue-scenes.ts",
);

interface Turn {
  id: string;
  prompt?: string;
  promptTranslation?: string;
  branches?: { keywords?: string[]; nextTurnId?: string }[];
  fallbackBranchId?: string;
  isTerminal?: boolean;
}
interface Scene {
  id: string;
  language: string;
  level: string;
  scenario: string;
  title?: string;
  opening?: string;
  startTurnId: string;
  turns: Record<string, Turn>;
}

/**
 * Validate a single scene. Returns a list of error strings; empty = ok.
 * Mirrors the rules in validate-dialogue-scenes.ts (intentionally
 * duplicated here so this script has no cross-file dependency and can
 * be the authoritative gatekeeper).
 */
function validateScene(scene: any): string[] {
  const errors: string[] = [];
  if (!scene || typeof scene !== "object") {
    return ["not an object"];
  }
  if (!scene.id) errors.push("missing `id`");
  if (!scene.language) errors.push("missing `language`");
  if (!scene.opening) errors.push("missing `opening`");
  if (!scene.turns || typeof scene.turns !== "object") {
    errors.push("`turns` is not an object");
    return errors;
  }
  const turnIds = new Set(Object.keys(scene.turns));
  if (turnIds.size === 0) {
    errors.push("`turns` is empty");
    return errors;
  }
  if (!turnIds.has(scene.startTurnId)) {
    errors.push(`startTurnId "${scene.startTurnId}" not found`);
  }
  let hasTerminal = false;
  for (const [turnId, turn] of Object.entries<any>(scene.turns)) {
    if (!turn || typeof turn !== "object") {
      errors.push(`turn "${turnId}" is not an object`);
      continue;
    }
    if (turn.id !== turnId) {
      errors.push(`turn key "${turnId}" != inner id "${turn.id}"`);
    }
    if (!turn.prompt || String(turn.prompt).trim().length < 2) {
      errors.push(`turn "${turnId}" has empty/short prompt`);
    }
    if (turn.isTerminal) hasTerminal = true;
    if (!Array.isArray(turn.branches)) {
      errors.push(`turn "${turnId}" branches is not an array`);
      continue;
    }
    if (turn.branches.length === 0 && !turn.isTerminal) {
      errors.push(`turn "${turnId}" has no branches and is not terminal`);
      continue;
    }
    for (let i = 0; i < turn.branches.length; i++) {
      const b = turn.branches[i];
      if (!b || typeof b !== "object") {
        errors.push(`turn "${turnId}" branch ${i} is not an object`);
        continue;
      }
      if (!b.nextTurnId || !turnIds.has(b.nextTurnId)) {
        errors.push(
          `turn "${turnId}" branch ${i} → nextTurnId "${b.nextTurnId}" not found`,
        );
      }
      const isLast = i === turn.branches.length - 1;
      const nonEmpty = (b.keywords ?? []).filter(
        (k: any) => typeof k === "string" && k.trim().length > 0,
      );
      if (nonEmpty.length === 0 && !isLast) {
        errors.push(
          `turn "${turnId}" branch ${i}: empty keywords and not the last branch`,
        );
      }
    }
    if (
      typeof turn.fallbackBranchId !== "string" ||
      !turnIds.has(turn.fallbackBranchId)
    ) {
      errors.push(
        `turn "${turnId}" → fallbackBranchId "${turn.fallbackBranchId}" not found`,
      );
    }
  }
  if (!hasTerminal) errors.push("no terminal turn");
  return errors;
}

function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`No ${SRC}; nothing to merge.`);
    process.exit(0);
  }
  const files = fs.readdirSync(SRC).filter((f) => f.endsWith(".json"));
  if (files.length === 0) {
    console.log("No generated scenes to merge.");
    return;
  }

  // Parse the existing file to find the array bounds and existing ids.
  const existingText = fs.readFileSync(EXISTING_FILE, "utf-8");
  const existingIdMatches = [
    ...existingText.matchAll(/id:\s*"(dlg-[a-z0-9-]+)"/g),
  ];
  const existingIds = new Set(existingIdMatches.map((m) => m[1]));

  const newScenes: any[] = [];
  let skippedDuplicate = 0;
  let skippedInvalid = 0;
  let skippedParse = 0;

  for (const file of files) {
    const fp = path.join(SRC, file);
    let scene: Scene;
    try {
      scene = JSON.parse(fs.readFileSync(fp, "utf-8"));
    } catch (e) {
      console.error(`skip ${file}: parse error: ${(e as Error).message}`);
      skippedParse++;
      continue;
    }

    if (existingIds.has(scene.id)) {
      skippedDuplicate++;
      continue;
    }

    // Gatekeeper: reject scenes that don't pass validation. Better
    // to drop them here than to let `pnpm build` fail on type errors.
    const errors = validateScene(scene);
    if (errors.length > 0) {
      console.error(
        `skip ${file} (id=${scene.id ?? "?"}): ${errors.length} validation error(s):`,
      );
      for (const e of errors) console.error(`  - ${e}`);
      skippedInvalid++;
      continue;
    }

    newScenes.push(scene);
    existingIds.add(scene.id);
  }

  console.log(
    `\nMerge summary: ${newScenes.length} to merge, ${skippedDuplicate} duplicate, ${skippedInvalid} invalid (skipped), ${skippedParse} unparseable.`,
  );

  if (newScenes.length === 0) {
    console.log("No valid new scenes to merge.");
    return;
  }

  // Inject just before the closing `];` of DIALOGUE_SCENES.
  const lines: string[] = [];
  for (const scene of newScenes) {
    lines.push("");
    lines.push(
      `  // AUTO-GENERATED: ${scene.id} (${scene.language}/${scene.scenario})`,
    );
    lines.push(`  ${JSON.stringify(scene)},`);
  }
  const trailing = "\n];";
  const insertAt = existingText.lastIndexOf(trailing);
  if (insertAt === -1) {
    console.error("Could not find DIALOGUE_SCENES closing in existing file");
    process.exit(1);
  }
  const out = existingText.slice(0, insertAt) + lines.join("\n") + existingText.slice(insertAt);
  fs.writeFileSync(EXISTING_FILE, out);
  console.log(`Merged ${newScenes.length} new scenes.`);
}

main();
