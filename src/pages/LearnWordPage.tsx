import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import LocaleLink from "../components/LocaleLink";
import { ArrowRight, ArrowLeft, BookOpen, Sparkles, Volume2 } from "lucide-react";
import PageShell from "../components/PageShell";
import { Seo } from "../components/Seo";
import { JsonLd, buildBreadcrumbLd } from "../components/JsonLd";
import { useLearnTranslation } from "../lib/learn-i18n";
import { getLanguageDisplayName } from "../data/languages";
import {
  LEARN_CONTENT_LOADERS,
  LEARN_LANG_META,
  URL_SLUG_TO_DATA,
  type LearnLangSlug,
  type LearnWord,
} from "../data/learn-content";

/**
 * /languages/:langSlug/word/:wordSlug — single word detail page.
 *
 * These pages are **noindex by default**. They are a study tool, not
 * a Google landing page. Each one is structurally similar, so
 * indexing 2000+ of them risks triggering Google's doorway-pages
 * spam policy. The /languages/:langSlug overview page is the
 * indexable entry point.
 *
 * If you ever want to expose a curated subset to Google, flip the
 * `noindex` prop on `<Seo>` for a whitelisted set of word slugs.
 */
export default function LearnWordPage() {
  const { langSlug, wordSlug } = useParams<{ langSlug: string; wordSlug: string }>();
  const { t, i18n, ready } = useLearnTranslation();
  const [words, setWords] = useState<LearnWord[] | null>(null);

  const dataSlug = langSlug ? URL_SLUG_TO_DATA[langSlug] : undefined;
  const valid = Boolean(dataSlug);
  const slug = (dataSlug ?? "en") as LearnLangSlug;
  const meta = LEARN_LANG_META[slug];
  const langName = getLanguageDisplayName(slug, i18n.language);
  // 4 new languages (ko/es/fr/de) ship per-sentence-pair data, not
  // per-word. The page renders them as "sentence cards" — same UI,
  // bigger word field.
  const isSentence = meta.dataShape === "sentence";
  const unit = isSentence ? t("learn:ui.unitSentence") : t("learn:ui.unitWord");
  const unitSingular = isSentence ? t("learn:ui.unitSentenceSingular") : t("learn:ui.unitWordSingular");

  useEffect(() => {
    let cancelled = false;
    LEARN_CONTENT_LOADERS[slug]().then((data) => {
      if (!cancelled) setWords(data);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const word = useMemo(
    () => (words ?? []).find((w) => w.slug === wordSlug) ?? null,
    [words, wordSlug]
  );

  // Build a small "related words" list so each page links to
  // siblings and we don't end up with 2000+ orphan pages.
  const related = useMemo(() => {
    if (!word || !words) return [];
    return words
      .filter((w) => w.slug !== word.slug && w.level === word.level)
      .slice(0, 8);
  }, [word, words]);

  if (!ready) {
    return (
      <PageShell title="">
        <div className="min-h-[40vh]" />
      </PageShell>
    );
  }

  if (!valid) {
    return (
      <PageShell title={t("learn:ui.languageNotFound")}>
        <Link to="/" className="text-sky-300 hover:underline">
          {t("learn:ui.homeLink")}
        </Link>
      </PageShell>
    );
  }

  if (!word && words !== null) {
    return (
      <PageShell
        title={t("learn:ui.wordNotFound", { unit: unitSingular })}
        subtitle={t("learn:ui.noEntry", { slug: wordSlug })}
      >
        <Link
          to={`/languages/${langSlug}`}
          className="inline-flex items-center gap-1 text-sky-300 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> {t("learn:ui.backToOverview", { lang: langName })}
        </Link>
      </PageShell>
    );
  }

  const siteUrl = "https://lang-oria.com";
  const pageUrl = `${siteUrl}/languages/${langSlug}/word/${word?.slug ?? ""}`;

  return (
    <PageShell
      title={word?.word ?? t("learn:ui.loading")}
      subtitle={
        word
          ? `${langName} · ${word.level} · ${word.translation || t("learn:ui.noTranslation")}`
          : t("learn:ui.loading")
      }
      action={
        <Link
          to={`/languages/${langSlug}`}
          className="inline-flex items-center gap-1 text-sm text-sky-300 hover:text-sky-200"
        >
          <ArrowLeft className="h-4 w-4" /> {t("learn:ui.backToOverview", { lang: langName })}
        </Link>
      }
    >
      <Seo
        title={t("learn:ui.seoWordTitle", { word: word?.word ?? "", lang: langName })}
        description={
          word?.example
            ? `"${word.example}" — ${word.exampleTranslation}`
            : t("learn:ui.seoWordDescFallback", { word: word?.word ?? "", lang: langName })
        }
        noindex
        pathname={`/languages/${langSlug}/word/${word?.slug ?? ""}`}
      />
      {word && (
        <JsonLd
          data={[
            buildBreadcrumbLd([
              { name: t("learn:ui.navHome"), url: `${siteUrl}/` },
              { name: langName, url: `${siteUrl}/languages/${slug}` },
              { name: word.word, url: pageUrl },
            ]),
            {
              "@type": "DefinedTerm",
              name: word.word,
              ...(word.reading ? { alternateName: word.reading } : {}),
              description: word.translation || undefined,
              inLanguage: slug,
              ...(word.example
                ? {
                    exampleWork: {
                      "@type": "Quotation",
                      text: word.example,
                      ...(word.exampleTranslation
                        ? { comment: word.exampleTranslation }
                        : {}),
                    },
                  }
                : {}),
            },
          ]}
        />
      )}

      {word ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="glass rounded-3xl p-8 lg:col-span-2">
            <div className="flex items-baseline gap-3">
              <span
                className={
                  isSentence
                    ? "font-display text-2xl font-bold leading-tight text-white md:text-3xl"
                    : "font-display text-5xl font-bold text-white"
                }
              >
                {word.word}
              </span>
              {word.reading && (
                <span className="text-xl text-brand-200/70">{word.reading}</span>
              )}
            </div>
            {isSentence && word.translation && (
              <div className="mt-3 text-sm leading-relaxed text-brand-100/90 md:text-base">
                {word.translation}
              </div>
            )}
            {word.phonetic && (
              <div className="mt-1 text-sm text-brand-200/60">
                <Volume2 className="mr-1 inline h-3.5 w-3.5" />
                {word.phonetic}
              </div>
            )}
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-200/80">
              <BookOpen className="h-3.5 w-3.5" /> {word.level} · {unitSingular}
            </div>

            {!isSentence && word.translation && (
              <div className="mt-6">
                <div className="text-xs font-semibold uppercase tracking-widest text-fuchsia-300">
                  {t("learn:ui.meaning")}
                </div>
                <p className="mt-2 text-base leading-relaxed text-white">
                  {word.translation}
                </p>
              </div>
            )}

            {word.example && word.example !== word.word && (
              <div className="mt-8">
                <div className="text-xs font-semibold uppercase tracking-widest text-fuchsia-300">
                  {t("learn:ui.example")}
                </div>
                <blockquote className="mt-2 rounded-2xl border-l-4 border-fuchsia-400/60 bg-white/5 p-4 text-base italic text-white">
                  {word.example}
                </blockquote>
                {word.exampleTranslation && (
                  <p className="mt-2 text-sm text-brand-200/70">
                    {word.exampleTranslation}
                  </p>
                )}
              </div>
            )}
          </div>

          <aside className="glass rounded-3xl p-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-sky-300">
              <Sparkles className="h-3.5 w-3.5" /> {t("learn:ui.practiceThisWord", { unit: unitSingular })}
            </div>
            <p className="mt-3 text-sm text-brand-100/80">
              {t("learn:ui.practiceDesc", { word: word.word })}
            </p>
            <LocaleLink
              to="/register"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 via-fuchsia-400 to-amber-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
            >
              {t("learn:ui.startPracticing")} <ArrowRight className="h-4 w-4" />
            </LocaleLink>

            <div className="mt-6 border-t border-white/10 pt-5">
              <div className="text-xs font-semibold uppercase tracking-widest text-sky-300">
                {t("learn:ui.relatedWords", { unit })}
              </div>
              <ul className="mt-3 space-y-1.5">
                {related.map((w) => (
                  <li key={w.slug}>
                    <Link
                        to={`/languages/${langSlug}/word/${w.slug}`}
                        className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm text-brand-100 hover:bg-white/5"
                      >
                      <span className="truncate">{w.word}</span>
                      <ArrowRight className="h-3 w-3 text-brand-200/40" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      ) : (
        <div className="text-brand-200/60">{t("learn:ui.loading")}</div>
      )}
    </PageShell>
  );
}
