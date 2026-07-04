/**
 * SM-2 spaced-repetition scheduling.
 *
 * Classic SuperMemo-2 algorithm (Piotr Wozniak, 1987). Pure functions,
 * no side effects, no I/O — the store layer is responsible for
 * persisting the returned SrsState.
 *
 * Reference: https://www.supermemo.com/en/blog/application-of-a-spacing-effect
 *
 * Quality scale (q ∈ 0..5):
 *   0 = total blackout
 *   1 = incorrect, but felt familiar
 *   2 = incorrect, but easy to recall once shown
 *   3 = correct, but with serious difficulty
 *   4 = correct, after some hesitation
 *   5 = perfect recall
 *
 * We map the four-button UX (again/hard/good/easy) to 0/3/4/5.
 */

import type { ReviewQuality, SrsState } from "../types";

/** Default starting state for a brand-new SRS item. */
export const INITIAL_SRS_STATE: SrsState = {
  easeFactor: 2.5,
  interval: 0,
  repetitions: 0,
  // Due immediately — the item is queued as soon as it's added.
  nextReviewAt: new Date(0).toISOString(),
};

/** Map the four-button UX to the SM-2 quality scale. */
const QUALITY_MAP: Record<ReviewQuality, number> = {
  again: 0,
  hard: 3,
  good: 4,
  easy: 5,
};

/** Convert a quality (0-5) into the user-facing label. Used by the
 *  UI to show what each button "means" in SRS terms. */
export function qualityToLabel(quality: ReviewQuality): string {
  switch (quality) {
    case "again":
      return "不记得";
    case "hard":
      return "困难";
    case "good":
      return "良好";
    case "easy":
      return "轻松";
  }
}

/**
 * Compute the next SRS state given the current state and the user's
 * self-rating. Returns a NEW state object; does not mutate the input.
 *
 * The SM-2 rules:
 *   - If q < 3: reset repetitions to 0, interval = 1 day (re-learn).
 *   - Else: increment repetitions.
 *     - rep 1 → 1 day
 *     - rep 2 → 6 days
 *     - rep n → previous interval × easeFactor
 *   - Update easeFactor: EF' = EF + (0.1 - (5-q)*(0.08 + (5-q)*0.02))
 *     Clamp EF to a minimum of 1.3 (SuperMemo's floor).
 *   - For "hard" (q=3), shorten the interval slightly so the user
 *     sees it again sooner — a small UX tweak on top of pure SM-2.
 */
export function scheduleNext(
  current: SrsState,
  quality: ReviewQuality,
): SrsState {
  const q = QUALITY_MAP[quality];
  const now = Date.now();

  let { easeFactor, interval, repetitions } = current;

  if (q < 3) {
    // Lapse: start over.
    repetitions = 0;
    interval = 1; // 1 day — see it again tomorrow.
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    // "Hard" rating: shrink the computed interval ~20% so the card
    // resurfaces a bit sooner. Pure SM-2 would only adjust easeFactor.
    if (quality === "hard") {
      interval = Math.max(1, Math.round(interval * 0.8));
    }
  }

  // Ease factor update (the canonical SM-2 formula).
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextMs = now + interval * 24 * 60 * 60 * 1000;

  return {
    easeFactor: Math.round(easeFactor * 100) / 100,
    interval,
    repetitions,
    nextReviewAt: new Date(nextMs).toISOString(),
    lastReviewedAt: new Date(now).toISOString(),
  };
}

/** True if the item is due for review (or overdue). */
export function isDue(srs: SrsState, now: number = Date.now()): boolean {
  const dueMs = new Date(srs.nextReviewAt).getTime();
  return now >= dueMs;
}

/** Human-readable summary of "when do I see this again", e.g.
 *  "tomorrow", "in 3 days", "in 2 weeks". Used as button hint text. */
export function describeNextInterval(quality: ReviewQuality, srs: SrsState): string {
  const next = scheduleNext(srs, quality);
  const days = next.interval;
  if (days <= 0) return "立刻";
  if (days === 1) return "1 天后";
  if (days < 7) return `${days} 天后`;
  if (days < 30) {
    const w = Math.round(days / 7);
    return w === 1 ? "1 周后" : `${w} 周后`;
  }
  const m = Math.round(days / 30);
  return m === 1 ? "1 个月后" : `${m} 个月后`;
}
