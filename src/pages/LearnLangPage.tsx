import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LocaleLink from "../components/LocaleLink";
import { ArrowRight, BookOpen, Headphones, Sparkles, Globe2 } from "lucide-react";
import PageShell from "../components/PageShell";
import { Seo } from "../components/Seo";
import { JsonLd, buildCourseLd, buildBreadcrumbLd } from "../components/JsonLd";
import {
  LEARN_CONTENT_LOADERS,
  LEARN_LANG_META,
  URL_SLUG_TO_DATA,
  type LearnLangSlug,
  type LearnWord,
} from "../data/learn-content";
import { getLanguageDisplayName } from "../data/languages";
import { useLearnTranslation } from "../lib/learn-i18n";

interface FaqItem {
  q: string;
  a: string;
}

/**
 * /languages/:langSlug — high-quality indexable overview page for one
 * of the target languages. All editorial copy lives in the "learn"
 * i18n namespace (src/locales/<ui-lng>/learn.json), so every UI locale
 * renders fully localised content; English is the fallback.
 *
 * URL pattern: /languages/japanese, /languages/english,
 * /languages/chinese.
 */
export default function LearnLangPage() {
  const { langSlug } = useParams<{ langSlug: string }>();
  const { t, i18n, ready } = useLearnTranslation();
  // SSR 时 entry-server 会预加载数据到 globalThis.__LEARN_WORDS__
  const [words, setWords] = useState<LearnWord[] | null>(() => {
    if (typeof window === "undefined") {
      return ((globalThis as Record<string, unknown>).__LEARN_WORDS__ as LearnWord[] | undefined) ?? null;
    }
    return null;
  });

  // /languages/:langSlug — the URL slug is a human-friendly name
  // ("english", "japanese", "korean", "spanish", "french", "german", …) but the data
  // loader keys are ISO codes ("en", "ja", "ko", "es", "fr", "de", …). Map
  // between them.
  const dataSlug = langSlug ? URL_SLUG_TO_DATA[langSlug] : undefined;
  const valid = Boolean(dataSlug);
  const slug = (dataSlug ?? "en") as LearnLangSlug;
  const meta = LEARN_LANG_META[slug];

  useEffect(() => {
    if (!valid) return;
    // 已有 SSR 注入的数据时跳过客户端加载
    if (words !== null) return;
    let cancelled = false;
    LEARN_CONTENT_LOADERS[slug]().then((data) => {
      if (!cancelled) setWords(data);
    });
    return () => {
      cancelled = true;
    };
  }, [slug, valid, words]);

  // Hold render until the learn namespace is loaded (SPA navigations).
  // SSR / first-load hydration always has the bundle (preloaded), so
  // this only triggers for in-app route changes.
  if (!ready) {
    return (
      <PageShell title="">
        <div className="min-h-[40vh]" />
      </PageShell>
    );
  }

  const unit = meta.dataShape === "sentence" ? t("ui.unitSentence") : t("ui.unitWord");
  const unitSingular =
    meta.dataShape === "sentence" ? t("ui.unitSentenceSingular") : t("ui.unitWordSingular");

  // /languages (no slug) — show a directory of available languages.
  if (!langSlug) {
    const ALL_URL_SLUGS: { data: LearnLangSlug; url: string }[] = (
      Object.keys(URL_SLUG_TO_DATA) as Array<keyof typeof URL_SLUG_TO_DATA>
    ).map((urlSlug) => ({
      data: URL_SLUG_TO_DATA[urlSlug],
      url: `/languages/${urlSlug}`,
    }));

    return (
      <PageShell
        title={t("ui.languagesIndexTitle")}
        subtitle={t("ui.languagesIndexSubtitle")}
      >
        <Seo
          title={t("ui.seoLanguagesTitle")}
          description={t("ui.seoLanguagesDesc")}
          pathname="/languages"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ALL_URL_SLUGS.map(({ data, url }) => {
            const m = LEARN_LANG_META[data];
            const wordCount = data === "en" ? "961" : data === "ja" ? "762" : data === "zh" ? "984" : data === "ko" || data === "es" || data === "fr" || data === "de" ? "200+" : data === "ms" || data === "id" || data === "vi" ? "50" : "50";
            return (
              <Link
                key={data}
                to={url}
                className="glass group relative overflow-hidden rounded-3xl p-8 transition hover:-translate-y-1"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
                <div className="text-5xl">{m.flag}</div>
                <div className="mt-4 font-display text-2xl font-bold text-white">
                  {getLanguageDisplayName(data, i18n.language)}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-brand-100/80">
                  {t(`descriptions.${data}`)}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-brand-200/50">
                    {wordCount} {m.dataShape === "sentence" ? t("ui.unitSentence") : t("ui.unitWord")}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-sky-300 transition group-hover:text-sky-200">
                    {t("ui.start")} <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </PageShell>
    );
  }

  if (!valid) {
    return (
      <PageShell title={t("ui.languageNotFound")} subtitle={t("ui.languageNotSupported")}>
        <Seo noindex title={t("ui.languageNotFound")} />
        <p className="text-brand-200/80">
          <LocaleLink to="/languages" className="text-sky-300 hover:underline">
            {t("ui.pickLanguage")}
          </LocaleLink>
        </p>
      </PageShell>
    );
  }

  // Levels actually present in the data. For ja the generator emits
  // everything as N5; for en we have A1..C2; for zh we have HSK1..HSK4.
  const levels = Array.from(new Set((words ?? []).map((w) => w.level))).filter(
    Boolean
  );

  // Sample words: first 12 from the data, used to render a real
  // vocabulary preview that varies per language.
  const sampleWords = (words ?? []).slice(0, 12);

  const langName = getLanguageDisplayName(slug, i18n.language);
  const title = t(`langPage.${slug}.title`);
  const lead = t(`langPage.${slug}.lead`);
  const whoFor = t(`langPage.${slug}.whoFor`);
  const method = t(`langPage.${slug}.method`);
  const faq = t(`langPage.${slug}.faq`, { returnObjects: true }) as FaqItem[];

  const siteUrl = "https://lang-oria.com";
  const pageUrl = `${siteUrl}/languages/${langSlug}`;

  return (
    <PageShell
      title={title}
      subtitle={lead}
      action={
        <LocaleLink
          to="/register"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 via-fuchsia-400 to-amber-300 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-fuchsia-500/30 transition hover:-translate-y-0.5"
        >
          {t("translation:home.hero.startToday")} <ArrowRight className="h-4 w-4" />
        </LocaleLink>
      }
    >
      <Seo
        title={t("ui.seoLangTitle", { lang: langName })}
        description={`${lead} ${whoFor.split(".")[0]}.`}
        pathname={`/languages/${langSlug}`}
      />
      <JsonLd
        data={[
          buildBreadcrumbLd([
            { name: t("ui.navHome"), url: `${siteUrl}/` },
            { name: t("ui.navLanguages"), url: `${siteUrl}/languages` },
            { name: langName, url: pageUrl },
          ]),
          buildCourseLd({
            name: t("ui.seoLangCourseName", { lang: langName }),
            description: lead,
            url: pageUrl,
            inLanguage: slug === "ja" ? "ja" : slug === "zh" ? "zh-Hans" : "en",
            offers: [{ price: 0, currency: "USD" }],
          }),
        ]}
      />

      <article className="prose prose-invert max-w-none">
        {/* TL;DR — GEO: one-paragraph quotable summary for AI answer
            engines. Built from the same hand-written copy as the page
            body so it stays unique per language. */}
        <div className="not-prose mb-8 rounded-2xl border border-sky-400/20 bg-sky-400/5 p-5 text-sm leading-relaxed text-brand-100 md:text-base">
          <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-sky-300">
            TL;DR
          </div>
          {lead} {method.split(".")[0]}.
        </div>

        <section className="glass rounded-3xl p-8 md:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-100">
            <Globe2 className="h-3.5 w-3.5 text-sky-300" /> {langName} · {meta.flag}
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
            {t("ui.whyLearn", { lang: langName })}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-100/90 md:text-base">
            {whoFor}
          </p>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="glass rounded-2xl p-6">
            <BookOpen className="h-6 w-6 text-sky-300" />
            <h3 className="mt-3 font-display text-lg font-bold text-white">
              {t("ui.levelsOfVocab", { count: levels.length })}
            </h3>
            <p className="mt-2 text-sm text-brand-200/70">
              {t("ui.curatedDecks")}
            </p>
          </div>
          <div className="glass rounded-2xl p-6">
            <Headphones className="h-6 w-6 text-fuchsia-300" />
            <h3 className="mt-3 font-display text-lg font-bold text-white">
              {t("ui.nativeAudio")}
            </h3>
            <p className="mt-2 text-sm text-brand-200/70">
              {t("ui.nativeAudioDesc", { lang: langName })}
            </p>
          </div>
          <div className="glass rounded-2xl p-6">
            <Sparkles className="h-6 w-6 text-amber-300" />
            <h3 className="mt-3 font-display text-lg font-bold text-white">
              {t("ui.dailyLoop")}
            </h3>
            <p className="mt-2 text-sm text-brand-200/70">
              {t("ui.dailyLoopDesc")}
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
            {t("ui.howTeaches", { lang: langName })}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-100/90 md:text-base">
            {method}
          </p>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
              {t("ui.vocabStart")}
            </h2>
            <Link
              to={`/languages/${langSlug}/word/${sampleWords[0]?.slug ?? ""}`}
              className="text-sm text-sky-300 hover:underline"
            >
              {t("ui.seeAll", { count: words?.length ?? 0, unit })}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
            {sampleWords.map((w) => (
              <Link
                key={w.slug}
                to={`/languages/${langSlug}/word/${w.slug}`}
                className="glass group flex items-center justify-between rounded-xl px-3 py-2 text-sm transition hover:bg-white/10"
              >
                <span className="truncate font-mono text-white">{w.word}</span>
                <ArrowRight className="h-3 w-3 text-brand-200/40 transition group-hover:text-sky-300" />
              </Link>
            ))}
          </div>
          <p className="mt-3 text-xs text-brand-200/50">
            {t("ui.wordIncludes", { unitSingular })}
            {/* Word pages are noindex — they are study tools, not search
                landing pages. The overview you are reading is the page
                that should appear in Google for "learn {meta.englishName} online". */}
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
            {t("ui.faqTitle")}
          </h2>
          <div className="mt-4 space-y-3">
            {Array.isArray(faq) && faq.map((f, i) => (
              <details key={i} className="glass group rounded-2xl p-4">
                <summary className="cursor-pointer text-sm font-semibold text-white">
                  {f.q}
                </summary>
                <p className="mt-2 text-sm text-brand-100/80">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-10 glass rounded-3xl p-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-xl font-bold text-white md:text-2xl">
                {t("ui.browseByLevel", { lang: langName })}
              </h2>
              <p className="mt-1 text-sm text-brand-100/80">
                {t("ui.levelCount", { count: levels.length, total: words?.length ?? 0, unit })}
              </p>
            </div>
            <Link
              to={`/languages/${langSlug}/vocabulary`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {t("ui.openVocabIndex")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {(slug === "en" || slug === "ja" || slug === "zh" || slug === "ko" || slug === "es" || slug === "fr" || slug === "de") ? (
          <section className="mt-6 glass rounded-3xl p-8">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="font-display text-xl font-bold text-white md:text-2xl">
                  {t("ui.realWorldScenarios", { lang: langName })}
                </h2>
                <p className="mt-1 text-sm text-brand-100/80">
                  {t("ui.scenarioDesc")}
                </p>
              </div>
              <Link
                to={`/languages/${langSlug}/scenarios`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {t("ui.openScenarioLessons")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        ) : null}
      </article>
    </PageShell>
  );
}
