import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Flame, BookOpen, Mic, Pen, Target } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageShell from "../components/PageShell";
import { GlassCard } from "../components/GlassCard";
import { useAuthStore } from "../store/authStore";
import { useProgressStore } from "../store/progressStore";
import { COURSES } from "../data/courses";
import { getLanguage } from "../data/languages";

export default function RecommendPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const progress = useProgressStore((s) => s.progress);
  const refresh = useProgressStore((s) => s.refresh);
  const moduleScores = progress?.moduleScores ?? {};

  const entries = Object.entries(moduleScores as Record<string, number>).sort(([, a], [, b]) => a - b);

  const iconFor: Record<string, React.ElementType> = {
    words: BookOpen,
    grammar: Pen,
    listening: Target,
    speaking: Mic,
  };
  const titleFor: Record<string, string> = {
    words: t("recommend.titles.words"),
    grammar: t("recommend.titles.grammar"),
    listening: t("recommend.titles.listening"),
    speaking: t("recommend.titles.speaking"),
  };

  const fallbackItems = useMemo(
    () => t("recommend.fallback", { returnObjects: true }) as { title: string; desc: string }[],
    [t]
  );
  const fallbackIcons = [BookOpen, Pen, Mic];
  const fallbackColors = [
    "from-sky-400 to-blue-600",
    "from-fuchsia-400 to-purple-600",
    "from-amber-400 to-orange-500",
  ];

  const language = user?.targetLanguage ?? "en";
  const recommendedCourses = COURSES.filter((c) => c.language === language).slice(0, 4);

  return (
    <PageShell
      title={t("recommend.title")}
      subtitle={t("recommend.subtitle")}
    >
      <div className="glass mb-8 overflow-hidden rounded-3xl">
        <div className="relative p-6 md:p-10">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="relative flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-100">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" /> {t("recommend.badge")}
              </div>
              <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
                {user
                  ? t("recommend.heading", { name: user.username })
                  : t("recommend.headingGuest")}
              </h2>
              <p className="mt-2 max-w-lg text-sm text-brand-200/70">
                {t("recommend.description")}
              </p>
              <button
                onClick={() => user && refresh()}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-brand-100 hover:bg-white/10"
              >
                {t("recommend.refresh")} <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-xs text-brand-200/60">{t("recommend.currentLevel")}</div>
                <div className="font-display text-3xl font-bold text-white">
                  Lv.{user?.level ?? progress?.level ?? 1}
                </div>
              </div>
              <div>
                <div className="text-xs text-brand-200/60">{t("recommend.streak")}</div>
                <div className="flex items-center gap-1 font-display text-3xl font-bold text-white">
                  <Flame className="h-6 w-6 text-orange-400" />
                  {user?.streak ?? progress?.streak ?? 0}
                </div>
              </div>
              <div>
                <div className="text-xs text-brand-200/60">{t("recommend.targetLanguage")}</div>
                <div className="font-display text-3xl font-bold text-white">
                  {getLanguage(language).flag} {getLanguage(language).native}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {entries.length > 0
          ? entries.map(([key, value], idx) => {
              const Icon = iconFor[key] ?? BookOpen;
              return (
                <Link to="/learn" key={key}>
                  <GlassCard className="relative h-full transition hover:-translate-y-0.5">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-xs text-brand-200/60">{t("recommend.step", { n: idx + 1 })}</div>
                      <div className="text-xs text-brand-200/60">{t("recommend.suggestMinutes", { minutes: 10 + Math.round((100 - value) / 10) })}</div>
                    </div>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-fuchsia-500 text-white shadow-lg">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-display text-xl font-bold text-white">{titleFor[key] || t("recommend.moduleTraining", { key })}</h3>
                    <p className="mt-1 text-sm text-brand-200/70">{t("recommend.scoreHint", { score: Math.max(15, value) })}</p>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs text-brand-100">
                        <Target className="h-3.5 w-3.5" /> {t("recommend.priorityLabel")} {idx === 0 ? t("recommend.priorityHigh") : idx === 1 ? t("recommend.priorityMedium") : t("recommend.priorityLow")}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm text-sky-300">
                        {t("recommend.start")} <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </GlassCard>
                </Link>
              );
            })
          : fallbackItems.map((item, idx) => {
              const Icon = fallbackIcons[idx] ?? BookOpen;
              return (
                <Link to="/learn" key={item.title}>
                  <GlassCard className="relative h-full transition hover:-translate-y-0.5">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-xs text-brand-200/60">{t("recommend.step", { n: idx + 1 })}</div>
                      <div className="text-xs text-brand-200/60">{t("recommend.suggestMinutes", { minutes: 10 })}</div>
                    </div>
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${fallbackColors[idx]} text-white shadow-lg`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-display text-xl font-bold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm text-brand-200/70">{item.desc}</p>
                  </GlassCard>
                </Link>
              );
            })}
      </div>

      {/* Recommended courses */}
      <div className="mt-12">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-white md:text-2xl">
              {t("recommend.coursesTitle", { flag: getLanguage(language).flag, name: getLanguage(language).native })}
            </h2>
            <p className="mt-1 text-sm text-brand-200/70">{t("recommend.coursesDesc")}</p>
          </div>
          <Link to="/courses" className="text-sm text-sky-300 hover:text-sky-200">
            {t("recommend.browseAll")}
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {recommendedCourses.map((c) => (
            <Link to="/learn" key={c.id} className="glass group overflow-hidden rounded-2xl transition hover:-translate-y-1">
              <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
                <span className="text-6xl drop-shadow">{c.cover}</span>
              </div>
              <div className="p-5">
                <div className="font-semibold text-white">{c.title}</div>
                <div className="mt-1 text-xs text-brand-200/70">{c.description}</div>
                <div className="mt-4 text-xs text-sky-300 group-hover:text-sky-200">{t("recommend.joinPlan")}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
