import { create } from "zustand";
import type { Language, ReviewItem, ReviewQuality } from "../types";
import { INITIAL_SRS_STATE, isDue, scheduleNext } from "../lib/sm2";

/**
 * Client-side SRS queue.
 *
 * Stores per-item SM-2 state in localStorage. No backend involved —
 * the record-word/record-quiz calls (Phase 1.1) still fire to update
 * aggregate progress; this store layers per-item scheduling on top.
 *
 * Cross-device sync is a future concern (Phase 5+): when we add a
 * `UserReviewItem` Prisma model, this store can hydrate from the
 * server and write-through on each review.
 */

const STORAGE_KEY = "lv_review_queue_v1";

interface ReviewState {
  /** All tracked items, keyed by itemId. */
  items: Record<string, ReviewItem>;
  /** True once we've loaded from localStorage on startup. */
  hydrated: boolean;

  hydrate: () => void;
  /** Add (or refresh the snapshot of) an item. If the item already
   *  exists, only the front/back/hint snapshot is updated — the SRS
   *  state is preserved so we don't reset a learner's progress. */
  trackItem: (item: Omit<ReviewItem, "srs">) => void;
  /** Apply a review rating. Updates the SRS state and persists. */
  reviewItem: (itemId: string, quality: ReviewQuality) => void;
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

export const useReviewStore = create<ReviewState>()((set, get) => ({
  items: {},
  hydrated: false,

  hydrate() {
    if (get().hydrated) return;
    set({ items: readStore(), hydrated: true });
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

  reviewItem(itemId, quality) {
    const items = { ...get().items };
    const existing = items[itemId];
    if (!existing) return;
    items[itemId] = { ...existing, srs: scheduleNext(existing.srs, quality) };
    writeStore(items);
    set({ items });
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
