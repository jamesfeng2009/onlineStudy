import { create } from "zustand";
import type { Language, MistakeLogEntry } from "../types";

/**
 * Per-grammar-point mistake log, persisted in localStorage.
 *
 * The GrammarModule records a wrong answer here (in addition to
 * pushing the quiz into the SRS queue). The GrammarMap reads this
 * to mark nodes red and the side panel shows "top weak points".
 *
 * Keyed by grammarPointId — one entry per point per language.
 */

const STORAGE_KEY = "lv_mistake_log_v1";

interface MistakeState {
  /** All mistake entries, keyed by grammarPointId. */
  entries: Record<string, MistakeLogEntry>;
  hydrated: boolean;

  hydrate: () => void;
  /** Record a wrong answer for a grammar point. Creates or
   *  increments the entry. */
  recordWrong: (grammarPointId: string, language: Language) => void;
  /** Reset mistakes for one grammar point (e.g. user re-studied it). */
  clearPoint: (grammarPointId: string) => void;
  /** All entries for a language, sorted by wrongCount desc. */
  byLanguage: (language: Language) => MistakeLogEntry[];
  /** Get a single entry. */
  get: (grammarPointId: string) => MistakeLogEntry | undefined;
}

function readStore(): Record<string, MistakeLogEntry> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as Record<string, MistakeLogEntry>;
    return {};
  } catch {
    return {};
  }
}

function writeStore(entries: Record<string, MistakeLogEntry>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* ignore */
  }
}

export const useMistakeStore = create<MistakeState>()((set, get) => ({
  entries: {},
  hydrated: false,

  hydrate() {
    if (get().hydrated) return;
    set({ entries: readStore(), hydrated: true });
  },

  recordWrong(grammarPointId, language) {
    const entries = { ...get().entries };
    const existing = entries[grammarPointId];
    if (existing) {
      entries[grammarPointId] = {
        ...existing,
        wrongCount: existing.wrongCount + 1,
        lastWrongAt: new Date().toISOString(),
      };
    } else {
      entries[grammarPointId] = {
        grammarPointId,
        language,
        wrongCount: 1,
        lastWrongAt: new Date().toISOString(),
      };
    }
    writeStore(entries);
    set({ entries });
  },

  clearPoint(grammarPointId) {
    const entries = { ...get().entries };
    delete entries[grammarPointId];
    writeStore(entries);
    set({ entries });
  },

  byLanguage(language) {
    return Object.values(get().entries)
      .filter((e) => e.language === language)
      .sort((a, b) => b.wrongCount - a.wrongCount);
  },

  get(grammarPointId) {
    return get().entries[grammarPointId];
  },
}));
