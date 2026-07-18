import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LocaleLink from "../components/LocaleLink";
import { useTranslation } from "react-i18next";
import {
  Sparkles,
  ArrowRight,
  Flame,
  Trophy,
  Target,
  ChevronDown,
  Globe2,
} from "lucide-react";
import PageShell from "../components/PageShell";
import { StatTile } from "../components/GlassCard";
import { Seo } from "../components/Seo";
import { JsonLd, buildCourseLd, buildFaqLd, buildBreadcrumbLd } from "../components/JsonLd";
import { LANGUAGES } from "../data/languages";
import { URL_SLUG_TO_DATA } from "../data/learn-content";

// 语言 id → URL slug 反向映射（用于首页语言卡片内链到语言主页）
const LANG_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(URL_SLUG_TO_DATA).map(([slug, id]) => [id, slug])
);
import { COURSES } from "../data/courses";
import { useAuthStore } from "../store/authStore";
import { useProgressStore } from "../store/progressStore";
import { getLanguageDisplayName } from "../data/languages";
import { api } from "../lib/api";
import type { CourseResp } from "../lib/api";

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const progress = useProgressStore((s) => s.progress);
  const refreshProgress = useProgressStore((s) => s.refresh);
  // 预渲染 HTML 已带本地课程数据，直接用 COURSES 作为初始值，
  // 避免首屏 "Loading courses..." 空白。API 返回后静默更新。
  const [courses, setCourses] = useState<CourseResp[]>(() =>
    COURSES.slice(0, 4).map((c) => ({ ...c, vipOnly: false }))
  );
  const [coursesLoading, setCoursesLoading] = useState(false);

  useEffect(() => {
    if (user) refreshProgress();
  }, [user, refreshProgress]);

  useEffect(() => {
    let alive = true;
    // 如果已经有本地数据（预渲染或 COURSES fallback），不显示 loading
    if (courses.length === 0) setCoursesLoading(true);
    api
      .courses()
      .then((data) => {
        if (alive && data.length > 0) setCourses(data);
      })
      .catch(() => {
        // 静默失败，保留本地 COURSES 数据
      })
      .finally(() => {
        if (alive) setCoursesLoading(false);
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const featureCourses = useMemo(() => {
    const localMap = new Map(COURSES.map((c) => [c.id, c]));
    if (courses.length > 0) {
      return courses.slice(0, 4).map((c) => {
        const local = localMap.get(c.id);
        return {
          ...c,
          title: local?.title ?? c.title,
          description: local?.description ?? c.description,
        };
      });
    }
    return COURSES.slice(0, 4).map((c) => ({ ...c, vipOnly: false })) as CourseResp[];
  }, [courses]);

  const today = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);
  const minutesToday = progress?.perDay?.[today] ?? 0;
  const goal = user?.goalMinutesPerDay ?? 30;
  const pctGoal = Math.min(100, Math.round((minutesToday / Math.max(1, goal)) * 100));

  const faqs = useMemo(
    () => t("home.faq.items", { returnObjects: true }) as { q: string; a: string }[],
    [t]
  );

  return (
    <PageShell>
      <Seo
        title={t("home.seoTitle")}
        description={t("home.seoDescription")}
        pathname="/"
      />
      <JsonLd
        data={[
          buildBreadcrumbLd([{ name: "Home", url: "https://lang-oria.com/" }]),
          {
            "@type": "WebSite",
            name: "LangOria",
            url: "https://lang-oria.com/",
            description: "Immersive language learning platform",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://lang-oria.com/courses?q={query}",
              "query-input": "required name=query",
            },
          },
          {
            "@type": "Organization",
            name: "LangOria",
            url: "https://lang-oria.com/",
            logo: "https://lang-oria.com/favicon.svg",
            sameAs: [],
          },
          buildCourseLd({
            name: t("home.seoTitle"),
            description: t("home.seoDescription"),
            url: "https://lang-oria.com/",
            inLanguage: "en",
            offers: [{ price: 0, currency: "USD" }],
          }),
          buildFaqLd(
            (t("home.faq.items", { returnObjects: true }) as { q: string; a: string }[]).map(
              (x) => ({ question: x.q, answer: x.a })
            )
          ),
        ]}
      />
      {/* AI-readable summary for LLM crawlers and answer engines */}
      <div className="sr-only" data-ai-summary="homepage">
        {t("home.seoDescription")} LangOria offers free structured courses from A1 to C2 across 10 languages with spaced repetition, native audio, and daily speaking drills.
      </div>
      {/* Hero */}
      <section id="hero" className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-500/30 via-fuchsia-500/20 to-amber-400/20 blur-3xl" />
        </div>
        <div className="relative grid grid-cols-1 items-center gap-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-100">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" /> {t("home.hero.badge")}
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white md:text-6xl">
              {t("home.hero.title")}
              <span className="block bg-gradient-to-r from-sky-300 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
                {t("home.hero.titleHighlight")}
              </span>
            </h1>
            <p className="mt-4 text-brand-200/80 md:text-lg">
              {user ? (
                <>{t("home.hero.welcomeBack", { name: user.username, minutes: minutesToday, goal })}</>
              ) : (
                <>{t("home.hero.guest")}</>
              )}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <LocaleLink
                to="/courses"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 via-fuchsia-400 to-amber-300 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-fuchsia-500/30 transition hover:-translate-y-0.5 hover:shadow-fuchsia-500/50"
              >
                {t("home.hero.startToday")} <ArrowRight className="h-4 w-4" />
              </LocaleLink>
            </div>

            <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-3">
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
        </div>
      </section>

      {/* Featured courses */}
      <section className="mt-20">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">{t("home.courses.title")}</h2>
            <p className="mt-1 text-sm text-brand-200/70">{t("home.courses.desc")}</p>
          </div>
          <LocaleLink to="/courses" className="text-sm text-sky-300 hover:text-sky-200">
            {t("home.courses.viewAll")}
          </LocaleLink>
        </div>
        {coursesLoading && courses.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-white/5 p-10 text-center text-sm text-brand-200/70">
            {t("home.courses.loading")}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featureCourses.map((c) => (
              <LocaleLink to="/courses" key={c.id} className="glass group overflow-hidden rounded-2xl transition hover:-translate-y-1">
                <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
                  <span className="text-6xl drop-shadow">{c.cover}</span>
                  <span className="absolute left-3 top-3 rounded-full bg-white/10 px-2 py-1 text-[10px] text-white backdrop-blur">
                    {c.level}
                  </span>
                  <span className="absolute right-3 top-3 rounded-full bg-white/10 px-2 py-1 text-[10px] text-white backdrop-blur">
                    {getLanguageDisplayName(c.language, i18n.language)}
                  </span>
                </div>
                <div className="p-5">
                  <div className="font-semibold text-white">{t(c.title)}</div>
                  <div className="mt-1 line-clamp-2 text-xs text-brand-200/70">{t(c.description)}</div>
                  <div className="mt-3 flex items-center justify-between text-xs text-brand-200/60">
                    <span>{t("home.courses.lessons", { count: c.lessons })}</span>
                    <span>{t("home.courses.minutes", { count: c.minutes })}</span>
                  </div>
                </div>
              </LocaleLink>
            ))}
          </div>
        )}
      </section>

      {/* Stories */}
      {/* (Removed: the "Learner Stories" / Testimonials section was based on
          fictional quotes, which Google can detect and which damages the
          site's E-E-A-T signal. Re-introduce only after we have real
          verifiable testimonials.) */}

      {/* Supported Languages — independent indexable section so that
          /  surfaces all 7 language landing pages as internal links
          and shows Googlebot a clear "this site teaches these
          languages" signal. */}
      <section id="languages" className="mt-20">
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-100">
            <Globe2 className="h-3.5 w-3.5 text-sky-300" /> {t("home.languages.countBadge")}
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
            {t("home.languages.choose")}
          </h2>
          <p className="mt-2 text-sm text-brand-200/70 md:text-base">
            {t("home.languages.standaloneDesc", {
              defaultValue:
                "Pick the language you are learning. Each course is leveled, with spaced-repetition vocab, native-speaker audio, and a daily 10-minute loop.",
            })}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {LANGUAGES.map((l) => {
            const slug = LANG_SLUG[l.id];
            return (
            <Link
              key={l.id}
              to={slug ? `/languages/${slug}` : `/learn?lang=${l.id}`}
              className="glass group relative overflow-hidden rounded-2xl p-5 text-left transition hover:-translate-y-1"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
              <div className="text-4xl">{l.flag}</div>
              <div className="mt-4 font-display text-xl font-bold text-white">{getLanguageDisplayName(l.id, i18n.language)}</div>
              <div className="mt-3 text-xs text-brand-200/60">{t(`home.languages.taglines.${l.id}`)}</div>
              <div className="mt-4 inline-flex items-center text-xs text-sky-300 transition group-hover:text-sky-200">
                {t("home.languages.select")} <ArrowRight className="ml-1 h-3 w-3" />
              </div>
            </Link>
            );
          })}
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
          <LocaleLink to="/faq" className="inline-flex items-center gap-1 text-sm text-sky-300 hover:text-sky-200">
            {t("home.faq.viewAll")} <ArrowRight className="h-4 w-4" />
          </LocaleLink>
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
          <LocaleLink to="/blog" className="hidden text-sm text-sky-300 hover:text-sky-200 md:block">
            {t("home.blog.viewAll")}
          </LocaleLink>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {(
            t("home.blog.items", { returnObjects: true }) as { title: string; excerpt: string; tag: string }[]
          ).map((p, i) => (
            <LocaleLink to="/blog" key={i} className="glass group rounded-2xl p-6 transition hover:-translate-y-1">
              <div className="text-xs font-medium uppercase tracking-wide text-emerald-300">{p.tag}</div>
              <h3 className="mt-3 font-display text-lg font-semibold text-white">{p.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-brand-200/70">{p.excerpt}</p>
              <div className="mt-4 inline-flex items-center text-xs text-sky-300 group-hover:text-sky-200">
                {t("home.blog.readMore")} <ArrowRight className="ml-1 h-3 w-3" />
              </div>
            </LocaleLink>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
