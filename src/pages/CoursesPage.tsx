import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Clock, BookOpen, Sparkles } from "lucide-react";
import PageShell from "../components/PageShell";
import { GlassCard } from "../components/GlassCard";
import { Seo } from "../components/Seo";
import { COURSES } from "../data/courses";
import { LANGUAGES } from "../data/languages";
import { getLanguage } from "../data/languages";
import type { Language } from "../types";

export default function CoursesPage() {
  const { t } = useTranslation();
  const [lang, setLang] = useState<Language | "all">("all");
  const [lv, setLv] = useState<string>("all");
  const navigate = useNavigate();

  const LEVELS = useMemo(
    () => [
      { key: "all", label: t("courses.filter.all") },
      { key: "beginner", label: t("courses.levelGroups.beginner"), group: "beginner" as const },
      { key: "intermediate", label: t("courses.levelGroups.intermediate"), group: "intermediate" as const },
      { key: "advanced", label: t("courses.levelGroups.advanced"), group: "advanced" as const },
    ],
    [t]
  );

  const filtered = useMemo(() => {
    return COURSES.filter((c) => {
      if (lang !== "all" && c.language !== lang) return false;
      if (lv !== "all") {
        const found = LEVELS.find((x) => x.key === lv);
        if (found?.group && c.levelGroup !== found.group) return false;
      }
      return true;
    });
  }, [lang, lv, LEVELS]);

  return (
    <PageShell title={t("courses.title")} subtitle={t("courses.subtitle")}>
      <Seo
        title={t("courses.seoTitle", { defaultValue: "Courses — LangOria" })}
        description={t("courses.seoDescription", {
          defaultValue:
            "Browse structured language courses from A1 to C1 across English, Japanese, Korean, Chinese, Spanish, French and German.",
        })}
        pathname="/courses"
      />
      {/* 语言切换 */}
      <div className="glass mb-6 flex flex-wrap items-center gap-2 rounded-2xl p-3">
        <span className="px-2 text-xs text-brand-200/70">{t("courses.filter.language")}</span>
        <Pill active={lang === "all"} onClick={() => setLang("all")}>
          {t("courses.filter.all")}
        </Pill>
        {LANGUAGES.map((l) => (
          <Pill key={l.id} active={lang === l.id} onClick={() => setLang(l.id)}>
            <span className="mr-1">{l.flag}</span>
            {l.native}
          </Pill>
        ))}
        <div className="mx-3 h-5 w-px bg-white/10" />
        <span className="px-2 text-xs text-brand-200/70">{t("courses.filter.level")}</span>
        {LEVELS.map((l) => (
          <Pill key={l.key} active={lv === l.key} onClick={() => setLv(l.key)}>
            {l.label}
          </Pill>
        ))}
      </div>

      {/* 课程列表 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <GlassCard
            key={c.id}
            onClick={() => navigate(`/learn/${c.id}`)}
            className="flex flex-col"
          >
            <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
              <span className="text-6xl drop-shadow">{c.cover}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-sky-400/10 px-2.5 py-1 text-[11px] font-medium text-sky-300">
                {c.level}
              </span>
              <span className="rounded-full bg-fuchsia-400/10 px-2.5 py-1 text-[11px] font-medium text-fuchsia-300">
                {getLanguage(c.language).flag} {getLanguage(c.language).native}
              </span>
              {c.tags.slice(0, 1).map((tag, i) => (
                <span key={i} className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-brand-200/70">
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="mt-3 font-display text-lg font-bold text-white">{c.title}</h3>
            <p className="mt-1 text-sm text-brand-200/70">{c.description}</p>
            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-brand-200/70">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" /> {t("courses.lessons", { count: c.lessons })}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {t("courses.minutes", { count: c.minutes })}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-sky-300 group-hover:text-sky-200">
                <Sparkles className="h-3.5 w-3.5" /> {t("courses.start")} <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </GlassCard>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-white/10 bg-white/5 p-10 text-center text-brand-200/70">
            {t("courses.noResults")}
          </div>
        )}
      </div>
    </PageShell>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-full px-3 py-1.5 text-xs transition " +
        (active
          ? "bg-gradient-to-r from-sky-400/30 to-fuchsia-400/30 text-white ring-1 ring-white/20"
          : "bg-white/5 text-brand-200/80 hover:bg-white/10 hover:text-white")
      }
    >
      {children}
    </button>
  );
}
