import fs from "node:fs";
import path from "node:path";

const SQL_FILE = path.join(process.cwd(), "generated", "import-generated-content.sql");
const OUT_DIR = path.join(process.cwd(), "generated", "split-sql");

const BATCH_SIZE = 200;

function main() {
  if (!fs.existsSync(SQL_FILE)) {
    console.error(`SQL file not found: ${SQL_FILE}`);
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const sql = fs.readFileSync(SQL_FILE, "utf-8");
  const lines = sql.split("\n");

  const header: string[] = [];
  const wordLines: string[] = [];
  const quizLines: string[] = [];

  let section: "header" | "words" | "quizzes" | "footer" = "header";

  for (const line of lines) {
    if (line.trim() === "-- WordBank") {
      section = "words";
      continue;
    }
    if (line.trim() === "-- Quizzes") {
      section = "quizzes";
      continue;
    }
    if (line.trim() === "COMMIT;") {
      section = "footer";
      continue;
    }

    if (section === "header") {
      header.push(line);
    } else if (section === "words") {
      if (line.trim().startsWith("INSERT INTO word_bank")) {
        wordLines.push(line);
      }
    } else if (section === "quizzes") {
      if (line.trim().startsWith("INSERT INTO quizzes")) {
        quizLines.push(line);
      }
    }
  }

  // 按语言分组
  const wordsByLang = new Map<string, string[]>();
  const quizzesByLang = new Map<string, string[]>();

  for (const line of wordLines) {
    const m = line.match(/'gen-(en|ja|zh)-/);
    const lang = m ? m[1] : "other";
    if (!wordsByLang.has(lang)) wordsByLang.set(lang, []);
    wordsByLang.get(lang)!.push(line);
  }

  for (const line of quizLines) {
    const m = line.match(/'q-gen-(en|ja|zh)-/);
    const lang = m ? m[1] : "other";
    if (!quizzesByLang.has(lang)) quizzesByLang.set(lang, []);
    quizzesByLang.get(lang)!.push(line);
  }

  const langNames: Record<string, string> = { en: "english", ja: "japanese", zh: "chinese" };
  let fileCount = 0;

  for (const [lang, lines] of wordsByLang) {
    const batches = chunk(lines, BATCH_SIZE);
    for (let i = 0; i < batches.length; i++) {
      const filename = `words-${langNames[lang] || lang}-${String(i + 1).padStart(2, "0")}.sql`;
      writeSql(path.join(OUT_DIR, filename), header, batches[i]);
      fileCount++;
    }
  }

  for (const [lang, lines] of quizzesByLang) {
    const batches = chunk(lines, BATCH_SIZE);
    for (let i = 0; i < batches.length; i++) {
      const filename = `quizzes-${langNames[lang] || lang}-${String(i + 1).padStart(2, "0")}.sql`;
      writeSql(path.join(OUT_DIR, filename), header, batches[i]);
      fileCount++;
    }
  }

  console.log(`Split into ${fileCount} files in ${OUT_DIR}`);
}

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function writeSql(dest: string, header: string[], inserts: string[]) {
  const content = [
    ...header.filter((l) => l.trim() && !l.startsWith("-- 来源")),
    "BEGIN;",
    ...inserts,
    "COMMIT;",
    "",
  ].join("\n");
  fs.writeFileSync(dest, content, "utf-8");
}

main();
