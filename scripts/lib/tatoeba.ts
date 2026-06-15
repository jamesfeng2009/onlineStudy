import fs from "node:fs";
import path from "node:path";

const CACHE_DIR = path.join(process.cwd(), "scripts", "cache");

export interface SentenceEntry {
  id: number;
  lang: string;
  text: string;
}

class SentenceStore {
  private byLang = new Map<string, SentenceEntry[]>();
  private loaded = new Set<string>();

  load(lang: string) {
    if (this.loaded.has(lang)) return;
    const file = path.join(CACHE_DIR, `${lang}_sentences.tsv`);
    if (!fs.existsSync(file)) {
      throw new Error(`Tatoeba sentence file not found: ${file}. Please run the download command first.`);
    }
    const lines = fs.readFileSync(file, "utf-8").split("\n");
    const entries: SentenceEntry[] = [];
    for (const line of lines) {
      if (!line.trim()) continue;
      const [id, language, text] = line.split("\t");
      if (!text) continue;
      entries.push({ id: Number(id), lang: language, text });
    }
    this.byLang.set(lang, entries);
    this.loaded.add(lang);
  }

  findExample(word: string, lang: string, maxLength = 120): string | undefined {
    this.load(lang);
    const entries = this.byLang.get(lang) ?? [];
    const lowerWord = word.toLowerCase();

    for (const entry of entries) {
      const text = entry.text.trim();
      if (text.length > maxLength) continue;
      if (lang === "en") {
        if (new RegExp(`\\b${escapeRegex(lowerWord)}\\b`, "i").test(text)) return text;
      } else {
        if (text.includes(word)) return text;
      }
    }
    return undefined;
  }

  findExamples(word: string, lang: string, count = 3, maxLength = 120): string[] {
    this.load(lang);
    const entries = this.byLang.get(lang) ?? [];
    const lowerWord = word.toLowerCase();
    const results: string[] = [];

    for (const entry of entries) {
      if (results.length >= count) break;
      const text = entry.text.trim();
      if (text.length > maxLength) continue;
      if (lang === "en") {
        if (new RegExp(`\\b${escapeRegex(lowerWord)}\\b`, "i").test(text)) results.push(text);
      } else {
        if (text.includes(word)) results.push(text);
      }
    }
    return results;
  }
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const tatoeba = new SentenceStore();
