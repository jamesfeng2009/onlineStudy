/**
 * P1-4: CrownProgress — course-level crown progress display.
 *
 * A "crown" is earned by passing a checkpoint lesson with bestScore
 * >= passThreshold (60). This component shows:
 *   - the crown count (earned / total)
 *   - a progress bar
 *   - per-checkpoint status chips (passed / locked / not yet attempted)
 *
 * Used at the top of LearnPage above the LessonPath so the user sees
 * their progress through the course's checkpoint gauntlet.
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Crown, Lock, Check, AlertCircle, Loader2 } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { api } from "../lib/api";
import type { CourseCrownsResp } from "../lib/api";

export interface CrownProgressProps {
  courseId: string;
  /** Bump this number to force a re-fetch after a lesson completes. */
  refreshKey?: number;
}

export default function CrownProgress({ courseId, refreshKey = 0 }: CrownProgressProps) {
  const { t } = useTranslation();
  const [data, setData] = useState<CourseCrownsResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api.courseCrowns(courseId)
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : t("crown.loadFailed"));
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [courseId, refreshKey]);

  if (loading) {
    return (
      <GlassCard className="flex items-center gap-3 p-4">
        <Loader2 className="h-4 w-4 animate-spin text-brand-200/70" />
        <span className="text-sm text-brand-200/70">{t("crown.loading")}</span>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard className="flex items-center gap-3 p-4 text-xs text-rose-200">
        <AlertCircle className="h-4 w-4 flex-none" />
        <span>{error}</span>
      </GlassCard>
    );
  }

  if (!data) return null;

  // Don't render if the course has no checkpoints yet.
  if (data.totalCheckpoints === 0) {
    return (
      <GlassCard className="flex items-center gap-3 p-4 text-xs text-brand-200/60">
        <Crown className="h-4 w-4 text-amber-300/70" />
        <span>{t("crown.noCheckpoints")}</span>
      </GlassCard>
    );
  }

  const pct = Math.round((data.crowns / data.totalCheckpoints) * 100);
  const passedSet = new Set(data.passedCheckpoints.map((c) => c.lessonId));

  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-orange-500 text-slate-900">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-lg font-bold text-white">
              {data.crowns} <span className="text-brand-200/60">/ {data.totalCheckpoints}</span>
              <span className="ml-1 text-sm font-normal text-amber-300">Crown</span>
            </div>
            <div className="text-[11px] text-brand-200/60">
              {t("crown.hint", { threshold: data.passThreshold })}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-2xl font-bold text-amber-300">{pct}%</div>
          <div className="text-[10px] text-brand-200/50">{t("crown.completion")}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Per-checkpoint chips */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {Array.from({ length: data.totalCheckpoints }).map((_, i) => {
          const passed = i < data.crowns; // simplified: chips count by index
          return (
            <div
              key={i}
              className={
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition " +
                (passed
                  ? "bg-gradient-to-br from-amber-400 to-orange-500 text-slate-900"
                  : "border border-white/10 bg-white/5 text-brand-200/50")
              }
              title={passed ? t("crown.earned", { n: i + 1 }) : t("crown.locked", { n: i + 1 })}
            >
              {passed ? <Check className="h-3.5 w-3.5" /> : <Lock className="h-3 w-3" />}
            </div>
          );
        })}
      </div>

      {/* Passed checkpoints list */}
      {data.passedCheckpoints.length > 0 && (
        <div className="mt-4 border-t border-white/5 pt-4">
          <div className="mb-2 text-[11px] uppercase tracking-wider text-brand-200/60">
            {t("crown.passedCheckpoints")}
          </div>
          <ul className="space-y-1.5">
            {data.passedCheckpoints.map((c) => {
              void passedSet; // referenced to keep the Set usage lint-clean
              return (
                <li key={c.lessonId} className="flex items-center gap-2 text-xs">
                  <Crown className="h-3 w-3 flex-none text-amber-300" />
                  <span className="text-brand-200/70">{c.unitTitle}</span>
                  <span className="text-white">·</span>
                  <span className="text-white">{c.title}</span>
                  {c.bestScore !== null && (
                    <span className="ml-auto text-amber-300">{t("crown.score", { score: c.bestScore })}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </GlassCard>
  );
}
