import { useEffect, useMemo, useRef, useState } from "react";
import {
  Flame, Trophy, Sparkles, BookOpen, BookMarked, Pencil, GraduationCap,
  Mic, Headphones, Crown, Zap,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import PageShell from "../components/PageShell";
import { GlassCard } from "../components/GlassCard";
import { useAuthStore } from "../store/authStore";
import { useProgressStore } from "../store/progressStore";
import { api } from "../lib/api";
import { BADGES, checkBadge } from "../data/badges";
import type { Badge } from "../types";

/** Icon name → component lookup. Driven by the `icon` string in
 *  src/data/badges.ts so adding a new badge only requires editing
 *  that data file (plus adding the icon name here). */
const ICONS: Record<string, React.ElementType> = {
  Flame,
  Zap,
  Trophy,
  BookOpen,
  BookMarked,
  Pencil,
  GraduationCap,
  Mic,
  Headphones,
  Sparkles,
  Crown,
};

interface UnlockedBadge {
  unlockedAt: string;
  isRead: boolean;
}

interface AchievementContext {
  streak: number;
  wordsLearned: number;
  quizzesDone: number;
  speakingMinutes: number;
  listeningMinutes: number;
  level: number;
}

function getBadgeProgress(
  badge: Badge,
  ctx: AchievementContext,
): { earned: boolean; progress: number; total: number } {
  const { type, value } = badge.requirement;
  let current = 0;
  switch (type) {
    case "streak": current = ctx.streak; break;
    case "words": current = ctx.wordsLearned; break;
    case "quizzes": current = ctx.quizzesDone; break;
    case "speaking": current = ctx.speakingMinutes; break;
    case "listening": current = ctx.listeningMinutes; break;
    case "level": current = ctx.level; break;
  }
  return {
    earned: checkBadge(badge, ctx),
    progress: Math.min(current, value),
    total: value,
  };
}

/** Format an ISO timestamp into a short local date for display. */
function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString();
  } catch {
    return "";
  }
}

export default function AchievementsPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const progress = useProgressStore((s) => s.progress);

  // Badges the backend says the user has unlocked.
  const [unlockedMap, setUnlockedMap] = useState<Record<string, UnlockedBadge>>({});
  const [apiLoaded, setApiLoaded] = useState(false);
  // Track which badges we've already kicked off an unlock request for,
  // so we don't fire duplicates while the first request is in flight.
  const unlockInitiated = useRef<Set<string>>(new Set());

  const streak = user?.streak ?? progress?.streak ?? 0;
  const wordsLearned = progress?.wordsLearned ?? 0;
  const quizzesDone = progress?.quizzesDone ?? 0;
  const speakingMinutes = progress?.speakingMinutes ?? 0;
  const listeningMinutes = progress?.listeningMinutes ?? 0;
  const level = user?.level ?? progress?.level ?? 1;

  const ctx: AchievementContext = {
    streak,
    wordsLearned,
    quizzesDone,
    speakingMinutes,
    listeningMinutes,
    level,
  };

  // Pull unlocked badges from the API on mount (only when logged in)
  // and fire-and-forget a mark-read so the badge notification dot clears.
  useEffect(() => {
    if (!user) {
      setUnlockedMap({});
      setApiLoaded(true);
      return;
    }
    let cancelled = false;
    api
      .achievements()
      .then((rows) => {
        if (cancelled) return;
        const map: Record<string, UnlockedBadge> = {};
        for (const row of rows) {
          const key = row.badgeKey as string | undefined;
          if (!key) continue;
          map[key] = {
            unlockedAt: (row.unlockedAt as string) ?? new Date().toISOString(),
            isRead: !!row.isRead,
          };
        }
        setUnlockedMap(map);
        setApiLoaded(true);
        // Mark all unlocked badges as read on entry — fire-and-forget.
        api.markAchievementsRead().catch((err) => {
          console.warn("AchievementsPage: failed to mark as read:", err);
        });
      })
      .catch((err) => {
        if (cancelled) return;
        console.warn("AchievementsPage: failed to load achievements:", err);
        setApiLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Auto-unlock badges the user has earned (per checkBadge) but that
  // aren't yet recorded in the DB. Fire-and-forget; backend dedupes.
  useEffect(() => {
    if (!user || !apiLoaded) return;
    for (const badge of BADGES) {
      if (unlockInitiated.current.has(badge.id)) continue;
      if (unlockedMap[badge.id]) continue;
      if (!checkBadge(badge, ctx)) continue;
      unlockInitiated.current.add(badge.id);
      api
        .unlockAchievement(badge.id)
        .then((res) => {
          const unlockedAt = (res?.unlockedAt as string) ?? new Date().toISOString();
          setUnlockedMap((prev) => ({
            ...prev,
            [badge.id]: { unlockedAt, isRead: !!res?.isRead },
          }));
        })
        .catch((err) => {
          console.warn(`AchievementsPage: failed to unlock ${badge.id}:`, err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user,
    apiLoaded,
    unlockedMap,
    streak,
    wordsLearned,
    quizzesDone,
    speakingMinutes,
    listeningMinutes,
    level,
  ]);

  const badges = useMemo(
    () =>
      BADGES.map((b) => {
        // The translation file uses keys without the "b-" prefix
        // (e.g. "streak-3"); badges.ts uses "b-streak-3".
        const badgeKey = b.id.startsWith("b-") ? b.id.slice(2) : b.id;
        const title = t(`achievements.badges.${badgeKey}.title`, { defaultValue: b.title });
        const description = t(`achievements.badges.${badgeKey}.description`, { defaultValue: b.description });
        const Icon = ICONS[b.icon] ?? Sparkles;
        return { badge: b, title, description, Icon };
      }),
    [t]
  );

  const earnedCount = useMemo(
    () =>
      badges.reduce((acc, { badge }) => {
        const isUnlocked = !!unlockedMap[badge.id];
        const isEarnedNow = checkBadge(badge, ctx);
        return acc + (isUnlocked || isEarnedNow ? 1 : 0);
      }, 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [badges, unlockedMap, streak, wordsLearned, quizzesDone, speakingMinutes, listeningMinutes, level]
  );

  const stats = useMemo(
    () => [
      { key: "streak", value: ctx.streak, unit: t("achievements.units.streak"), color: "text-orange-300" },
      { key: "level", value: ctx.level, unit: t("achievements.units.level"), color: "text-amber-300" },
      { key: "words", value: ctx.wordsLearned, unit: t("achievements.units.words"), color: "text-sky-300" },
      { key: "quizzes", value: ctx.quizzesDone, unit: t("achievements.units.quizzes"), color: "text-fuchsia-300" },
    ],
    [ctx.streak, ctx.level, ctx.wordsLearned, ctx.quizzesDone, t]
  );

  return (
    <PageShell
      title={t("achievements.title")}
      subtitle={t("achievements.subtitle")}
    >
      {/* Hero */}
      <div className="glass relative mb-8 overflow-hidden rounded-3xl p-6 md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
        <div className="relative grid grid-cols-1 items-center gap-6 md:grid-cols-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-100">
              <Trophy className="h-3.5 w-3.5 text-amber-300" /> {t("achievements.wall")}
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold text-white md:text-4xl">
              {t("achievements.heading", { earned: earnedCount, total: badges.length })}
            </h2>
            <p className="mt-2 text-sm text-brand-200/70">
              {t("achievements.description")}
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-300 via-rose-400 to-fuchsia-500"
                style={{ width: `${Math.round((earnedCount / badges.length) * 100)}%` }}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {stats.map((x) => (
                <GlassCard key={x.key} className="p-4">
                  <div className="text-xs text-brand-200/70">{t(`achievements.stats.${x.key}`)}</div>
                  <div className={"mt-1 font-display text-2xl font-bold " + x.color}>
                    {x.value} <span className="text-sm text-white/60">{x.unit}</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Badges grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {badges.map(({ badge, title, description, Icon }) => {
          const unlocked = !!unlockedMap[badge.id];
          const { earned, progress, total } = getBadgeProgress(badge, ctx);
          // A badge is "earned" if either the DB says it's unlocked OR
          // the user just satisfied the conditions (DB sync pending).
          const isEarned = unlocked || earned;
          const pct = Math.round((progress / total) * 100);
          const unlockedAt = unlockedMap[badge.id]?.unlockedAt;
          return (
            <GlassCard
              key={badge.id}
              className={
                isEarned
                  ? "ring-1 ring-amber-300/40 shadow-[0_0_40px_-10px] shadow-amber-500/30"
                  : "opacity-90"
              }
            >
              <div className="flex items-start justify-between">
                <div className={"inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br " + (isEarned ? badge.color + " text-white shadow-lg" : "bg-white/10 text-white/60")}>
                  <Icon className="h-7 w-7" />
                </div>
                {isEarned && (
                  <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium text-amber-200">
                    {t("achievements.unlocked")}
                  </span>
                )}
              </div>
              <div className="mt-4 font-display text-lg font-semibold text-white">{title}</div>
              <div className="mt-1 text-xs text-brand-200/70">{description}</div>
              <div className="mt-4">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className={
                      "h-full rounded-full " +
                      (isEarned ? "bg-gradient-to-r from-amber-300 to-rose-400" : "bg-gradient-to-r from-sky-400 to-fuchsia-400")
                    }
                    style={{ width: `${isEarned ? 100 : pct}%` }}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-brand-200/60">
                  <span>{isEarned ? `${total} / ${total}` : `${progress} / ${total}`}</span>
                  {unlocked && unlockedAt && (
                    <span>{formatDate(unlockedAt)}</span>
                  )}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </PageShell>
  );
}
