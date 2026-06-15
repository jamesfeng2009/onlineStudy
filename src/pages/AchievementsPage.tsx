import { useMemo } from "react";
import { Flame, Trophy, Sparkles, BookOpen, Pen, Mic, Headphones, Crown, Target, Zap, Bookmark } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageShell from "../components/PageShell";
import { GlassCard } from "../components/GlassCard";
import { useAuthStore } from "../store/authStore";
import { useProgressStore } from "../store/progressStore";

const BADGE_IDS = [
  "streak-3",
  "streak-7",
  "streak-30",
  "words-20",
  "words-100",
  "quizzes-10",
  "quizzes-50",
  "speaking-10",
  "listening-10",
  "level-5",
  "level-10",
] as const;

const BADGE_ICONS: Record<string, React.ElementType> = {
  "streak-3": Flame,
  "streak-7": Zap,
  "streak-30": Trophy,
  "words-20": BookOpen,
  "words-100": Bookmark,
  "quizzes-10": Pen,
  "quizzes-50": Sparkles,
  "speaking-10": Mic,
  "listening-10": Headphones,
  "level-5": Target,
  "level-10": Crown,
};

const BADGE_COLORS: Record<string, string> = {
  "streak-3": "from-orange-400 to-rose-500",
  "streak-7": "from-amber-300 to-orange-500",
  "streak-30": "from-yellow-300 to-amber-500",
  "words-20": "from-sky-400 to-blue-600",
  "words-100": "from-cyan-400 to-teal-600",
  "quizzes-10": "from-emerald-400 to-green-600",
  "quizzes-50": "from-lime-400 to-emerald-600",
  "speaking-10": "from-rose-400 to-pink-600",
  "listening-10": "from-violet-400 to-purple-600",
  "level-5": "from-fuchsia-400 to-rose-600",
  "level-10": "from-amber-300 to-yellow-500",
};

interface AchievementContext {
  streak: number;
  wordsLearned: number;
  quizzesDone: number;
  speakingMinutes: number;
  listeningMinutes: number;
  level: number;
}

const BADGE_CHECKS: Record<
  string,
  (ctx: AchievementContext) => { earned: boolean; progress: number; total: number }
> = {
  "streak-3": (ctx) => ({ earned: ctx.streak >= 3, progress: Math.min(ctx.streak, 3), total: 3 }),
  "streak-7": (ctx) => ({ earned: ctx.streak >= 7, progress: Math.min(ctx.streak, 7), total: 7 }),
  "streak-30": (ctx) => ({ earned: ctx.streak >= 30, progress: Math.min(ctx.streak, 30), total: 30 }),
  "words-20": (ctx) => ({ earned: ctx.wordsLearned >= 20, progress: Math.min(ctx.wordsLearned, 20), total: 20 }),
  "words-100": (ctx) => ({ earned: ctx.wordsLearned >= 100, progress: Math.min(ctx.wordsLearned, 100), total: 100 }),
  "quizzes-10": (ctx) => ({ earned: ctx.quizzesDone >= 10, progress: Math.min(ctx.quizzesDone, 10), total: 10 }),
  "quizzes-50": (ctx) => ({ earned: ctx.quizzesDone >= 50, progress: Math.min(ctx.quizzesDone, 50), total: 50 }),
  "speaking-10": (ctx) => ({ earned: ctx.speakingMinutes >= 10, progress: Math.min(ctx.speakingMinutes, 10), total: 10 }),
  "listening-10": (ctx) => ({ earned: ctx.listeningMinutes >= 10, progress: Math.min(ctx.listeningMinutes, 10), total: 10 }),
  "level-5": (ctx) => ({ earned: ctx.level >= 5, progress: Math.min(ctx.level, 5), total: 5 }),
  "level-10": (ctx) => ({ earned: ctx.level >= 10, progress: Math.min(ctx.level, 10), total: 10 }),
};

export default function AchievementsPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const progress = useProgressStore((s) => s.progress);

  const badges = useMemo(
    () =>
      BADGE_IDS.map((id) => ({
        id,
        title: t(`achievements.badges.${id}.title`),
        description: t(`achievements.badges.${id}.description`),
        icon: BADGE_ICONS[id],
        color: BADGE_COLORS[id],
        check: BADGE_CHECKS[id],
      })),
    [t]
  );

  const ctx: AchievementContext = {
    streak: user?.streak ?? progress?.streak ?? 0,
    wordsLearned: progress?.wordsLearned ?? 0,
    quizzesDone: progress?.quizzesDone ?? 0,
    speakingMinutes: progress?.speakingMinutes ?? 0,
    listeningMinutes: progress?.listeningMinutes ?? 0,
    level: user?.level ?? progress?.level ?? 1,
  };

  const earnedCount = badges.reduce((acc, b) => acc + (b.check(ctx).earned ? 1 : 0), 0);

  const stats = useMemo(
    () => [
      { key: "streak", value: ctx.streak, unit: t("achievements.units.streak"), color: "text-orange-300" },
      { key: "level", value: ctx.level, unit: t("achievements.units.level"), color: "text-amber-300" },
      { key: "words", value: ctx.wordsLearned, unit: t("achievements.units.words"), color: "text-sky-300" },
      { key: "quizzes", value: ctx.quizzesDone, unit: t("achievements.units.quizzes"), color: "text-fuchsia-300" },
    ],
    [ctx, t]
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
        {badges.map((b) => {
          const Icon = b.icon;
          const { earned, progress, total } = b.check(ctx);
          const pct = Math.round((progress / total) * 100);
          return (
            <GlassCard
              key={b.id}
              className={
                earned
                  ? "ring-1 ring-amber-300/40 shadow-[0_0_40px_-10px] shadow-amber-500/30"
                  : "opacity-90"
              }
            >
              <div className="flex items-start justify-between">
                <div className={"inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br " + (earned ? b.color + " text-white shadow-lg" : "bg-white/10 text-white/60")}>
                  <Icon className="h-7 w-7" />
                </div>
                {earned && (
                  <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium text-amber-200">
                    {t("achievements.unlocked")}
                  </span>
                )}
              </div>
              <div className="mt-4 font-display text-lg font-semibold text-white">{b.title}</div>
              <div className="mt-1 text-xs text-brand-200/70">{b.description}</div>
              <div className="mt-4">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className={
                      "h-full rounded-full " +
                      (earned ? "bg-gradient-to-r from-amber-300 to-rose-400" : "bg-gradient-to-r from-sky-400 to-fuchsia-400")
                    }
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-1 text-right text-[11px] text-brand-200/60">
                  {progress} / {total}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </PageShell>
  );
}
