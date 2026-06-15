import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PageShell from "../components/PageShell";
import { GlassCard, StatTile } from "../components/GlassCard";
import { LineChart, RadarChart, ProgressRing, HorizontalBar } from "../components/Charts";
import { Flame, Target, BookOpen, Headphones, Mic, Pen, Trophy, TrendingUp } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useProgressStore } from "../store/progressStore";

function lastDays(n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    out.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    );
  }
  return out;
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const progress = useProgressStore((s) => s.progress);
  const progressLoading = useProgressStore((s) => s.progressLoading);
  const refresh = useProgressStore((s) => s.refresh);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) refresh();
  }, [user, refresh]);

  const days = useMemo(() => lastDays(14), []);
  const lineData = useMemo(
    () => days.map((d) => ({ label: d.slice(5), value: progress?.perDay?.[d] ?? 0 })),
    [days, progress]
  );
  const totalMinutes = lineData.reduce((a, b) => a + b.value, 0);

  const radarScores = useMemo(
    () => [
      { label: t("dashboard.skills.words"), value: progress?.moduleScores?.words ?? 0, icon: BookOpen },
      { label: t("dashboard.skills.grammar"), value: progress?.moduleScores?.grammar ?? 0, icon: Pen },
      { label: t("dashboard.skills.listening"), value: progress?.moduleScores?.listening ?? 0, icon: Headphones },
      { label: t("dashboard.skills.speaking"), value: progress?.moduleScores?.speaking ?? 0, icon: Mic },
    ],
    [progress, t]
  );

  const todayKey = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  const goalPct = Math.min(
    100,
    Math.round(
      ((progress?.perDay?.[todayKey] ?? 0) /
        Math.max(1, user?.goalMinutesPerDay ?? progress?.goalMinutesPerDay ?? 30)) *
        100
    )
  );
  const levelPct = Math.min(
    100,
    Math.round(((progress?.exp ?? 0) / Math.max(1, 50 + (progress?.level ?? 1) * 50)) * 100)
  );

  const loading = status === "loading" || (progressLoading && !progress);

  return (
    <PageShell
      title={t("dashboard.title")}
      subtitle={
        user
          ? t("dashboard.subtitle", { name: user.username })
          : t("dashboard.subtitleGuest")
      }
    >
      {/* Top stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          label={t("dashboard.streakLearn")}
          value={t("common.days", { count: progress?.streak ?? user?.streak ?? 0 })}
          icon={<Flame className="h-5 w-5 text-orange-400" />}
          hint={t("dashboard.keepGoing")}
        />
        <StatTile
          label={t("dashboard.wordsLearned")}
          value={String(progress?.wordsLearned ?? 0)}
          icon={<BookOpen className="h-5 w-5 text-sky-300" />}
          hint={t("dashboard.wordsAnswered", { count: progress?.wordTotal ?? 0 })}
        />
        <StatTile
          label={t("dashboard.grammar")}
          value={String(progress?.quizzesDone ?? 0)}
          icon={<Pen className="h-5 w-5 text-fuchsia-300" />}
          hint={t("dashboard.grammarAccuracy", {
            pct: progress?.quizTotal
              ? Math.round((progress.quizCorrect / progress.quizTotal) * 100)
              : 0,
          })}
        />
        <StatTile
          label={t("dashboard.total14")}
          value={t("dashboard.total14Value", { total: totalMinutes })}
          icon={<TrendingUp className="h-5 w-5 text-emerald-300" />}
          hint={t("dashboard.avgPerDay", { avg: Math.round(totalMinutes / 14) })}
        />
      </div>

      {loading && mounted ? (
        <div className="mt-8 rounded-2xl border border-white/5 bg-white/5 p-10 text-center text-sm text-brand-200/70">
          {t("dashboard.loading")}
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Line chart */}
            <GlassCard className="lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">{t("dashboard.chartTitle")}</div>
                  <div className="text-xs text-brand-200/60">{t("dashboard.chartUnit")}</div>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-100">
                  <Target className="h-3.5 w-3.5 text-sky-300" /> {t("dashboard.todayGoal")}
                  {user?.goalMinutesPerDay ? ` ${user.goalMinutesPerDay} ${t("common.minutes")}` : ""}
                </span>
              </div>
              <div className="mt-4">
                <LineChart data={lineData} />
              </div>
            </GlassCard>

            {/* Rings */}
            <GlassCard>
              <div className="text-sm font-semibold text-white">{t("dashboard.progressTitle")}</div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                  <ProgressRing
                    value={goalPct}
                    centerLabel={`${goalPct}%`}
                    centerHint={t("dashboard.todayGoal")}
                    color="#38BDF8"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <ProgressRing
                    value={levelPct}
                    centerLabel={`Lv.${progress?.level ?? user?.level ?? 1}`}
                    centerHint={`${progress?.exp ?? 0} ${t("dashboard.exp")}`}
                    color="#F59E0B"
                  />
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <HorizontalBar
                  items={radarScores.map((r) => ({
                    label: r.label,
                    value: Math.max(20, r.value),
                  }))}
                />
              </div>
            </GlassCard>
          </div>

          {/* Radar + Modules heatmap */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
            <GlassCard className="lg:col-span-2">
              <div className="text-sm font-semibold text-white">{t("dashboard.radarTitle")}</div>
              <div className="mt-2 text-xs text-brand-200/60">{t("dashboard.radarSubtitle")}</div>
              <div className="mt-4 flex justify-center">
                <RadarChart
                  labels={radarScores.map((x) => x.label)}
                  values={radarScores.map((x) => Math.max(15, x.value))}
                  size={320}
                />
              </div>
            </GlassCard>

            <GlassCard className="lg:col-span-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-white">{t("dashboard.moduleTitle")}</div>
                <div className="text-xs text-brand-200/60">
                  <Trophy className="mr-1 inline h-3.5 w-3.5 text-amber-300" /> {t("dashboard.moduleTip")}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {radarScores.map((s) => (
                  <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400/30 to-fuchsia-400/30 text-white">
                        <s.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{s.label}</div>
                        <div className="text-xs text-brand-200/60">{t("dashboard.moduleScore")}</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-fuchsia-400"
                          style={{ width: `${Math.max(15, s.value)}%` }}
                        />
                      </div>
                      <div className="mt-2 text-right text-xs text-brand-200/60">
                        {Math.max(15, s.value)} / 100
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* 14 days grid */}
          <div className="mt-6">
            <GlassCard>
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-white">{t("dashboard.heatmapTitle")}</div>
                <div className="text-xs text-brand-200/60">{t("dashboard.heatmapSubtitle")}</div>
              </div>
              <div className="mt-4 grid grid-cols-14 gap-2">
                {days.map((d) => {
                  const val = progress?.perDay?.[d] ?? 0;
                  const opacity = Math.min(1, 0.1 + val / 60);
                  return (
                    <div
                      key={d}
                      title={t("dashboard.heatmapTooltip", { date: d, minutes: val })}
                      className="aspect-square rounded-md border border-white/5 text-[9px] text-brand-200/60"
                      style={{
                        background: `linear-gradient(135deg, rgba(56,189,248,${opacity}), rgba(217,70,239,${opacity}))`,
                      }}
                    >
                      <div className="flex h-full flex-col items-center justify-center text-white/90">
                        <span>{d.slice(-2)}</span>
                        <span className="text-[9px] font-semibold">{val}m</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>
        </>
      )}
    </PageShell>
  );
}
