/* eslint-disable no-console */
/**
 * Merge generated dialogue scenes into the hand-authored list in
 * src/data/dialogue-scenes.ts. Idempotent: scenes that already
 * exist by id are skipped (no overwrite of the human-authored ones).
 *
 * Usage: pnpm tsx scripts/merge-dialogue-scenes.ts
 */
import fs from "node:fs";
import path from "node:path";

const SRC = path.join(process.cwd(), "scripts", "generated", "dialogues");
const EXISTING_FILE = path.join(process.cwd(), "src", "data", "dialogue-scenes.ts");

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
  const existingIdMatches = [...existingText.matchAll(/id:\s*"(dlg-[a-z0-9-]+)"/g)];
  const existingIds = new Set(existingIdMatches.map((m) => m[1]));

  const newScenes: any[] = [];
  let skipped = 0;
  for (const file of files) {
    const fp = path.join(SRC, file);
    try {
      const scene = JSON.parse(fs.readFileSync(fp, "utf-8"));
      if (existingIds.has(scene.id)) {
        skipped++;
        continue;
      }
      newScenes.push(scene);
      existingIds.add(scene.id);
    } catch (e) {
      console.error(`skip ${file}: ${(e as Error).message}`);
      skipped++;
    }
  }

  if (newScenes.length === 0) {
    console.log(`All ${files.length} generated scenes already present (skipped ${skipped}).`);
    return;
  }

  // Inject just before the closing `];` of DIALOGUE_SCENES.
  const lines: string[] = [];
  for (const scene of newScenes) {
    lines.push("");
    lines.push(`  // AUTO-GENERATED: ${scene.id} (${scene.language}/${scene.scenario})`);
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
  console.log(`Merged ${newScenes.length} new scenes (skipped ${skipped} already-present).`);
}

main();
