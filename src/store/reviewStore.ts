import { create } from "zustand";
import type { Language, ReviewItem, ReviewQuality } from "../types";
import { INITIAL_SRS_STATE, isDue, scheduleNext } from "../lib/sm2";
import { getToken } from "../lib/auth";
import { getWordReviews, getQuizReviews, reviewWord, reviewQuiz } from "../lib/api";

/**
 * Client-side SRS queue with backend write-through.
 *
 * Per-item SM-2 state is mirrored in localStorage (offline cache / guest
 * mode). When the user is logged in, `hydrate()` first pulls from the
 * API (the source of truth) and falls back to localStorage on failure.
 * `reviewItem()` always updates local state immediately (optimistic) and
 * then fire-and-forgets a POST to the backend so the server can keep
 * its own copy in sync. Failures are logged but never roll back the
 * optimistic update — next hydrate will re-sync from the server.
 */

const STORAGE_KEY = "lv_review_queue_v1";

interface ReviewState {
  /** All tracked items, keyed by itemId. */
  items: Record<string, ReviewItem>;
  /** True once we've loaded (from API or localStorage) on startup. */
  hydrated: boolean;

  hydrate: () => Promise<void>;
  /** Add (or refresh the snapshot of) an item. If the item already
   *  exists, only the front/back/hint snapshot is updated — the SRS
   *  state is preserved so we don't reset a learner's progress.
   *  Local-only — does not sync to the backend. */
  trackItem: (item: Omit<ReviewItem, "srs">) => void;
  /** Apply a review rating. Updates the SRS state optimistically,
   *  writes to localStorage, and (if logged in) fire-and-forgets a
   *  write-through POST to the backend. */
  reviewItem: (itemId: string, quality: ReviewQuality) => Promise<void>;
  /** Remove an item (e.g. user reset). */
  removeItem: (itemId: string) => void;
  /** All items due now, oldest-due first. */
  dueQueue: () => ReviewItem[];
  /** Count of due items, for badge display. */
  dueCount: () => number;
}

function readStore(): Record<string, ReviewItem> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as Record<string, ReviewItem>;
    return {};
  } catch {
    return {};
  }
}

function writeStore(items: Record<string, ReviewItem>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota exceeded or storage disabled — ignore, in-memory only */
  }
}

/** Coerce a numeric/unknown field into a finite number with a fallback. */
function num(val: unknown, fallback: number): number {
  const n = typeof val === "number" ? val : Number(val);
  return Number.isFinite(n) ? n : fallback;
}

/** Defensive mapper for a word-review row returned by /user/word-reviews. */
function mapApiWordReview(raw: Record<string, unknown>): ReviewItem | null {
  const itemId =
    (raw.itemId as string) ??
    (raw.wordBankId as string) ??
    (raw.wordId as string) ??
    (raw.id as string);
  if (!itemId) return null;
  const srsRaw = (raw.srsState ?? raw.srs ?? {}) as Record<string, unknown>;
  const lang = (raw.language as Language) ?? "en";
  return {
    itemId,
    kind: "word",
    front: (raw.word as string) ?? (raw.front as string) ?? "",
    back: (raw.translation as string) ?? (raw.back as string) ?? "",
    hint: (raw.phonetic as string) ?? (raw.hint as string) ?? undefined,
    language: lang,
    level: (raw.level as string) ?? undefined,
    srs: {
      easeFactor: num(srsRaw.easeFactor, 2.5),
      interval: num(srsRaw.interval, 0),
      repetitions: num(srsRaw.repetitions, 0),
      nextReviewAt:
        (srsRaw.nextReviewAt as string) ?? new Date(0).toISOString(),
      lastReviewedAt: srsRaw.lastReviewedAt as string | undefined,
    },
  };
}

/** Defensive mapper for a quiz-review row returned by /user/quiz-reviews. */
function mapApiQuizReview(raw: Record<string, unknown>): ReviewItem | null {
  const itemId =
    (raw.itemId as string) ??
    (raw.quizId as string) ??
    (raw.id as string);
  if (!itemId) return null;
  const srsRaw = (raw.srsState ?? raw.srs ?? {}) as Record<string, unknown>;
  const lang = (raw.language as Language) ?? "en";
  return {
    itemId,
    kind: "quiz",
    front: (raw.question as string) ?? (raw.front as string) ?? "",
    back: (raw.answer as string) ?? (raw.back as string) ?? "",
    hint: (raw.explain as string) ?? (raw.hint as string) ?? undefined,
    language: lang,
    level: (raw.level as string) ?? undefined,
    srs: {
      easeFactor: num(srsRaw.easeFactor, 2.5),
      interval: num(srsRaw.interval, 0),
      repetitions: num(srsRaw.repetitions, 0),
      nextReviewAt:
        (srsRaw.nextReviewAt as string) ?? new Date(0).toISOString(),
      lastReviewedAt: srsRaw.lastReviewedAt as string | undefined,
    },
  };
}

/** Merge API items on top of local: API wins on srs (when present);
 *  local display snapshots are kept when API doesn't supply them. */
function mergeItems(
  local: Record<string, ReviewItem>,
  apiItems: ReviewItem[],
): Record<string, ReviewItem> {
  const merged: Record<string, ReviewItem> = { ...local };
  for (const apiItem of apiItems) {
    const localItem = merged[apiItem.itemId];
    if (localItem) {
      merged[apiItem.itemId] = {
        ...localItem,
        ...apiItem,
        // Prefer local snapshot for display fields when API returns blanks.
        front: apiItem.front || localItem.front,
        back: apiItem.back || localItem.back,
        hint: apiItem.hint ?? localItem.hint,
      };
    } else {
      merged[apiItem.itemId] = apiItem;
    }
  }
  return merged;
}

export const useReviewStore = create<ReviewState>()((set, get) => ({
  items: {},
  hydrated: false,

  async hydrate() {
    if (get().hydrated) return;
    const localItems = readStore();

    // If logged in, prefer the API as the source of truth. Fall back
    // to localStorage if the request fails (offline / backend down).
    if (getToken()) {
      try {
        const [wordRows, quizRows] = await Promise.all([
          getWordReviews().catch(() => [] as Record<string, unknown>[]),
          getQuizReviews().catch(() => [] as Record<string, unknown>[]),
        ]);
        const apiWordItems = wordRows
          .map(mapApiWordReview)
          .filter((x): x is ReviewItem => x !== null);
        const apiQuizItems = quizRows
          .map(mapApiQuizReview)
          .filter((x): x is ReviewItem => x !== null);
        const merged = mergeItems(localItems, [...apiWordItems, ...apiQuizItems]);
        writeStore(merged);
        set({ items: merged, hydrated: true });
        return;
      } catch (err) {
        console.warn("reviewStore: API hydrate failed, using localStorage:", err);
      }
    }

    set({ items: localItems, hydrated: true });
  },

  trackItem(item) {
    const items = { ...get().items };
    if (items[item.itemId]) {
      // Preserve SRS state; only refresh the display snapshot.
      items[item.itemId] = { ...items[item.itemId], ...item };
    } else {
      items[item.itemId] = { ...item, srs: { ...INITIAL_SRS_STATE } };
    }
    writeStore(items);
    set({ items });
  },

  async reviewItem(itemId, quality) {
    const items = { ...get().items };
    const existing = items[itemId];
    if (!existing) return;
    const nextSrs = scheduleNext(existing.srs, quality);
    items[itemId] = { ...existing, srs: nextSrs };
    // 1. Optimistic local update.
    writeStore(items);
    set({ items });

    // 2. Fire-and-forget write-through to backend when logged in.
    if (!getToken()) return;
    const body = {
      quality,
      srsState: {
        easeFactor: nextSrs.easeFactor,
        interval: nextSrs.interval,
        repetitions: nextSrs.repetitions,
        nextReviewAt: nextSrs.nextReviewAt,
      },
    };
    try {
      if (existing.kind === "word") {
        void reviewWord(itemId, body).catch((err) => {
          console.warn("reviewStore: reviewWord sync failed:", err);
        });
      } else if (existing.kind === "quiz") {
        void reviewQuiz(itemId, body).catch((err) => {
          console.warn("reviewStore: reviewQuiz sync failed:", err);
        });
      }
    } catch (err) {
      console.warn("reviewStore: review sync failed:", err);
    }
  },

  removeItem(itemId) {
    const items = { ...get().items };
    delete items[itemId];
    writeStore(items);
    set({ items });
  },

  dueQueue() {
    const now = Date.now();
    return Object.values(get().items)
      .filter((it) => isDue(it.srs, now))
      .sort((a, b) =>
        new Date(a.srs.nextReviewAt).getTime() - new Date(b.srs.nextReviewAt).getTime(),
      );
  },

  dueCount() {
    return get().dueQueue().length;
  },
}));

/** Convenience helper: track a word card after the user marks it
 *  "unknown" in WordsModule. Snapshots the word + translation so the
 *  ReviewModule can render without re-fetching content. */
export function trackWordReview(opts: {
  itemId: string;
  word: string;
  translation: string;
  phonetic?: string;
  language: Language;
  level?: string;
}) {
  useReviewStore.getState().trackItem({
    itemId: opts.itemId,
    kind: "word",
    front: opts.word,
    back: opts.translation,
    hint: opts.phonetic,
    language: opts.language,
    level: opts.level,
  });
}

/** Convenience helper: track a quiz after the user answers wrong. */
export function trackQuizReview(opts: {
  itemId: string;
  question: string;
  answer: string;
  explain?: string;
  language: Language;
  level?: string;
}) {
  useReviewStore.getState().trackItem({
    itemId: opts.itemId,
    kind: "quiz",
    front: opts.question,
    back: opts.answer,
    hint: opts.explain,
    language: opts.language,
    level: opts.level,
  });
}
