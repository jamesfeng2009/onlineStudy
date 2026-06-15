import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Sparkles,
  ArrowRight,
  Flame,
  BookOpen,
  Headphones,
  Mic,
  Pen,
  Trophy,
  Target,
  Zap,
  Search,
  Quote,
  ChevronDown,
} from "lucide-react";
import PageShell from "../components/PageShell";
import { StatTile, GlassCard } from "../components/GlassCard";
import { Seo } from "../components/Seo";
import { LANGUAGES } from "../data/languages";
import { COURSES } from "../data/courses";
import { useAuthStore } from "../store/authStore";
import { useProgressStore } from "../store/progressStore";
import { getLanguage } from "../data/languages";
import { api } from "../lib/api";
import type { CourseResp } from "../lib/api";

export default function HomePage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const updateLanguage = useAuthStore((s) => s.updateLanguage);
  const progress = useProgressStore((s) => s.progress);
  const refreshProgress = useProgressStore((s) => s.refresh);
  const [courses, setCourses] = useState<CourseResp[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) refreshProgress();
  }, [user, refreshProgress]);

  useEffect(() => {
    let alive = true;
    setCoursesLoading(true);
    api
      .courses()
      .then((data) => {
        if (alive) setCourses(data);
      })
      .catch(() => {
        if (alive) setCourses([]);
      })
      .finally(() => {
        if (alive) setCoursesLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const featureCourses = useMemo(() => {
    if (courses.length > 0) return courses.slice(0, 4);
    return COURSES.slice(0, 4).map((c) => ({
      ...c,
      id: c.id,
      title: c.title,
      language: c.language,
      level: c.level,
      levelGroup: c.levelGroup,
      description: c.description,
      lessons: c.lessons,
      minutes: c.minutes,
      cover: c.cover,
      tags: c.tags,
      vipOnly: false,
    })) as CourseResp[];
  }, [courses]);

  const today = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);
  const minutesToday = progress?.perDay?.[today] ?? 0;
  const goal = user?.goalMinutesPerDay ?? 30;
  const pctGoal = Math.min(100, Math.round((minutesToday / Math.max(1, goal)) * 100));

  const tasks = useMemo(
    () => t("home.tasks.items", { returnObjects: true }) as { title: string; time: string }[],
    [t]
  );
  const features = useMemo(
    () => t("home.features.items", { returnObjects: true }) as { title: string; desc: string; action: string }[],
    [t]
  );
  const steps = useMemo(
    () => t("home.steps.items", { returnObjects: true }) as { title: string; desc: string }[],
    [t]
  );
  const stories = useMemo(
    () => t("home.stories.items", { returnObjects: true }) as { name: string; role: string; quote: string }[],
    [t]
  );
  const faqs = useMemo(
    () => t("home.faq.items", { returnObjects: true }) as { q: string; a: string }[],
    [t]
  );

  return (
    <PageShell>
      <Seo
        title={t("home.seoTitle", { defaultValue: "LinguaVerse — Learn languages with spaced repetition" })}
        description={t("home.seoDescription", {
          defaultValue:
            "Master English, Japanese, Spanish, French, German, Korean and Chinese through bite-sized lessons, spaced repetition vocabulary, and native-speaker listening practice.",
        })}
        pathname="/"
      />
      {/* Hero */}
      <section id="hero" className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-500/30 via-fuchsia-500/20 to-amber-400/20 blur-3xl" />
        </div>
        <div className="relative grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-100">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" /> {t("home.hero.badge")}
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white md:text-6xl">
              {t("home.hero.title")}
              <span className="block bg-gradient-to-r from-sky-300 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
                {t("home.hero.titleHighlight")}
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-brand-200/80">
              {user ? (
                <>{t("home.hero.welcomeBack", { name: user.username, minutes: minutesToday, goal })}</>
              ) : (
                <>{t("home.hero.guest")}</>
              )}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 via-fuchsia-400 to-amber-300 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-fuchsia-500/30 transition hover:-translate-y-0.5 hover:shadow-fuchsia-500/50"
              >
                {t("home.hero.startToday")} <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                {t("home.hero.learnMethod")}
              </a>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <StatTile
                label={t("home.hero.streak")}
                value={user ? `${user.streak ?? 0}` : status === "loading" ? "..." : "—"}
                icon={<Flame className="h-5 w-5 text-orange-400" />}
              />
              <StatTile
                label={t("home.hero.level")}
                value={user ? `Lv.${user.level ?? 1}` : status === "loading" ? "..." : "—"}
                icon={<Trophy className="h-5 w-5 text-amber-300" />}
              />
              <StatTile
                label={t("home.hero.todaysGoal")}
                value={`${pctGoal}%`}
                icon={<Target className="h-5 w-5 text-sky-300" />}
                hint={t("home.hero.minutesOfGoal", { minutes: minutesToday, goal })}
              />
            </div>
          </div>

          {/* 语言卡片 carousel */}
          <div className="relative">
            <div className="mb-3 flex items-center justify-between text-xs text-brand-200/70">
              <span>{t("home.languages.choose")}</span>
              {user && <span>{t("home.languages.current", { language: getLanguage(user.targetLanguage).native })}</span>}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {LANGUAGES.map((l, i) => {
                const active = user?.targetLanguage === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={async () => {
                      if (user) {
                        await updateLanguage(l.id);
                      } else {
                        navigate("/register");
                      }
                    }}
                    className={`glass group relative overflow-hidden rounded-2xl p-5 text-left transition hover:-translate-y-1 ${
                      active ? "ring-2 ring-sky-400/60" : ""
                    }`}
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
                    <div className="text-4xl">{l.flag}</div>
                    <div className="mt-4 font-display text-xl font-bold text-white">{l.native}</div>
                    <div className="text-xs text-brand-200/70">{l.native}</div>
                    <div className="mt-3 text-xs text-brand-200/60">{l.tagline}</div>
                    <div className="mt-4 inline-flex items-center text-xs text-sky-300 transition group-hover:text-sky-200">
                      {active ? t("home.languages.currentLanguage") : t("home.languages.select")} <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 今日任务 */}
            <GlassCard className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Zap className="h-4 w-4 text-amber-300" /> {t("home.tasks.title")}
                </div>
                <Link to="/recommend" className="text-xs text-sky-300 hover:text-sky-200">
                  {t("home.tasks.viewAll")}
                </Link>
              </div>
              <div className="grid gap-2">
                {tasks.map((x, i) => {
                  const icons = [BookOpen, Pen, Mic, Headphones];
                  const colors = ["from-sky-400/30", "from-fuchsia-400/30", "from-amber-400/30", "from-rose-400/30"];
                  const Icon = icons[i] ?? BookOpen;
                  return (
                    <Link
                      key={i}
                      to="/learn"
                      className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 transition hover:bg-white/5"
                    >
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${colors[i]} text-white`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-white">{x.title}</div>
                        <div className="text-xs text-brand-200/60">{x.time}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-brand-200/50" />
                    </Link>
                  );
                })}
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mt-20">
        <div className="mb-8 max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-widest text-sky-300">
            {t("home.steps.badge")}
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">
            {t("home.steps.title")}
          </h2>
          <p className="mt-2 text-sm text-brand-200/70 md:text-base">{t("home.steps.desc")}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((s, i) => {
            const colors = ["from-sky-400 to-blue-600", "from-fuchsia-400 to-purple-600", "from-amber-400 to-orange-500"];
            return (
              <div key={i} className="glass relative overflow-hidden rounded-2xl p-6">
                <div className="absolute -right-6 -top-6 text-7xl font-display font-bold text-white/5">
                  0{i + 1}
                </div>
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${colors[i]} text-white shadow-lg`}>
                  {i === 0 ? <Search className="h-5 w-5" /> : i === 1 ? <BookOpen className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-200/70">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features strip */}
      <section className="mt-20">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">{t("home.features.title")}</h2>
            <p className="mt-1 text-sm text-brand-200/70">{t("home.features.desc")}</p>
          </div>
          <Link to="/courses" className="hidden text-sm text-sky-300 hover:text-sky-200 md:block">
            {t("home.features.enter")}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {features.map((f, i) => {
            const icons = [BookOpen, Pen, Mic, Headphones];
            const colors = ["from-sky-400 to-blue-600", "from-fuchsia-400 to-purple-600", "from-amber-400 to-orange-500", "from-rose-400 to-pink-600"];
            const Icon = icons[i] ?? BookOpen;
            return (
              <Link to="/courses" key={i} className="glass group rounded-2xl p-5 transition hover:-translate-y-1">
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${colors[i]} text-white shadow-lg`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4 font-semibold text-white">{f.title}</div>
                <div className="mt-1 text-sm text-brand-200/70">{f.desc}</div>
                <div className="mt-4 inline-flex text-xs text-sky-300 group-hover:text-sky-200">
                  {f.action} <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured courses */}
      <section className="mt-20">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">{t("home.courses.title")}</h2>
            <p className="mt-1 text-sm text-brand-200/70">{t("home.courses.desc")}</p>
          </div>
          <Link to="/courses" className="text-sm text-sky-300 hover:text-sky-200">
            {t("home.courses.viewAll")}
          </Link>
        </div>
        {coursesLoading && courses.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-white/5 p-10 text-center text-sm text-brand-200/70">
            {t("home.courses.loading")}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featureCourses.map((c) => (
              <Link to="/courses" key={c.id} className="glass group overflow-hidden rounded-2xl transition hover:-translate-y-1">
                <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
                  <span className="text-6xl drop-shadow">{c.cover}</span>
                  <span className="absolute left-3 top-3 rounded-full bg-white/10 px-2 py-1 text-[10px] text-white backdrop-blur">
                    {c.level}
                  </span>
                  <span className="absolute right-3 top-3 rounded-full bg-white/10 px-2 py-1 text-[10px] text-white backdrop-blur">
                    {getLanguage(c.language as string).native}
                  </span>
                </div>
                <div className="p-5">
                  <div className="font-semibold text-white">{c.title}</div>
                  <div className="mt-1 line-clamp-2 text-xs text-brand-200/70">{c.description}</div>
                  <div className="mt-3 flex items-center justify-between text-xs text-brand-200/60">
                    <span>{t("home.courses.lessons", { count: c.lessons })}</span>
                    <span>{t("home.courses.minutes", { count: c.minutes })}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Stories */}
      <section className="mt-20">
        <div className="mb-8 max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-widest text-fuchsia-300">
            {t("home.stories.badge")}
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">
            {t("home.stories.title")}
          </h2>
          <p className="mt-2 text-sm text-brand-200/70 md:text-base">{t("home.stories.desc")}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {stories.map((s, i) => (
            <div key={i} className="glass relative rounded-2xl p-6">
              <Quote className="h-6 w-6 text-sky-300/60" />
              <p className="mt-3 text-sm leading-relaxed text-brand-100">{s.quote}</p>
              <div className="mt-5 border-t border-white/5 pt-4">
                <div className="text-sm font-semibold text-white">{s.name}</div>
                <div className="text-xs text-brand-200/60">{s.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mt-20">
        <div className="mb-8 max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-widest text-amber-300">
            {t("home.faq.badge")}
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">
            {t("home.faq.title")}
          </h2>
          <p className="mt-2 text-sm text-brand-200/70 md:text-base">{t("home.faq.desc")}</p>
        </div>
        <div className="glass divide-y divide-white/5 overflow-hidden rounded-2xl">
          {faqs.map((item, i) => (
            <details key={i} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="text-sm font-medium text-white md:text-base">{item.q}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-brand-200/60 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-brand-200/80">{item.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/faq" className="inline-flex items-center gap-1 text-sm text-sky-300 hover:text-sky-200">
            {t("home.faq.viewAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Blog teaser */}
      <section className="mt-20">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-emerald-300">
              {t("home.blog.badge")}
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">
              {t("home.blog.title")}
            </h2>
            <p className="mt-2 text-sm text-brand-200/70 md:text-base">{t("home.blog.desc")}</p>
          </div>
          <Link to="/blog" className="hidden text-sm text-sky-300 hover:text-sky-200 md:block">
            {t("home.blog.viewAll")}
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {(
            t("home.blog.items", { returnObjects: true }) as { title: string; excerpt: string; tag: string }[]
          ).map((p, i) => (
            <Link to="/blog" key={i} className="glass group rounded-2xl p-6 transition hover:-translate-y-1">
              <div className="text-xs font-medium uppercase tracking-wide text-emerald-300">{p.tag}</div>
              <h3 className="mt-3 font-display text-lg font-semibold text-white">{p.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-brand-200/70">{p.excerpt}</p>
              <div className="mt-4 inline-flex items-center text-xs text-sky-300 group-hover:text-sky-200">
                {t("home.blog.readMore")} <ArrowRight className="ml-1 h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mt-20">
        <div className="glass relative overflow-hidden rounded-3xl p-10 text-center md:p-16">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-sky-500/10 via-fuchsia-500/10 to-amber-400/10" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              {t("home.cta.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-brand-200/70 md:text-base">
              {t("home.cta.desc")}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 via-fuchsia-400 to-amber-300 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-fuchsia-500/30 transition hover:-translate-y-0.5"
              >
                {t("home.cta.start")} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                {t("home.cta.browse")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
