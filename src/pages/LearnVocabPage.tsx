import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LocaleLink from "../components/LocaleLink";
import { ArrowRight, BookOpen, ChevronRight, Sparkles } from "lucide-react";
import PageShell from "../components/PageShell";
import { Seo } from "../components/Seo";
import { JsonLd, buildBreadcrumbLd, buildItemListLd } from "../components/JsonLd";
import {
  LEARN_CONTENT_LOADERS,
  LEARN_LANG_META,
  URL_SLUG_TO_DATA,
  type LearnLangSlug,
  type LearnWord,
} from "../data/learn-content";
import { cefrEquivalent } from "../lib/level-utils";
import { getLanguageDisplayName } from "../data/languages";
import { useLearnTranslation } from "../lib/learn-i18n";

/**
 * /languages/:langSlug/vocabulary
 *   - the overview page: lists every level in the language with a count
 *     and a sample of the words/sentences at that level.
 *
 * /languages/:langSlug/vocabulary/:levelSlug
 *   - the level detail page: full list of words/sentences at that
 *     level, plus a level-specific "about" and "how to study" block.
 *
 * All copy lives in the "learn" i18n namespace so every UI locale
 * renders fully localised content (English fallback).
 */
export default function LearnVocabPage() {
  const { langSlug, levelSlug } = useParams<{
    langSlug: string;
    levelSlug?: string;
  }>();
  const { t, i18n, ready } = useLearnTranslation();
  // SSR 时 entry-server 会预加载数据到 globalThis.__LEARN_WORDS__
  const [words, setWords] = useState<LearnWord[] | null>(() => {
    if (typeof window === "undefined") {
      return ((globalThis as Record<string, unknown>).__LEARN_WORDS__ as LearnWord[] | undefined) ?? null;
    }
    return null;
  });

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

  const grouped = useMemo(() => groupByLevel(words ?? [], slug), [words, slug]);

  if (!ready) {
    return (
      <PageShell title="">
        <div className="min-h-[40vh]" />
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

  const langName = getLanguageDisplayName(slug, i18n.language);
  const isSentence = meta.dataShape === "sentence";
  const unit = isSentence ? t("ui.unitSentence") : t("ui.unitWord");
  const unitSingular = isSentence ? t("ui.unitSentenceSingular") : t("ui.unitWordSingular");
  const siteUrl = "https://lang-oria.com";
  const overviewUrl = `${siteUrl}/languages/${langSlug}/vocabulary`;

  // --- Level-detail page ------------------------------------------------
  if (levelSlug) {
    const levelEntry = grouped.find((g) => slugifyLevel(g.level) === levelSlug);
    if (!levelEntry) {
      if (words === null) {
        // 数据仍在加载（useEffect 动态导入）。此时绝不能渲染 noindex
        // 的 "levelNotFound" —— Googlebot 若在数据到达前快照页面，
        // 会把整页误判为 noindex（GSC "Excluded by 'noindex' tag"）。
        return (
          <PageShell title="">
            <div className="min-h-[40vh]" />
          </PageShell>
        );
      }
      return (
        <PageShell title={t("ui.levelNotFound")} subtitle={t("ui.levelNotAvailable")}>
          <Seo noindex title={t("ui.levelNotFound")} />
          <p className="text-brand-200/80">
            <Link
              to={`/languages/${langSlug}/vocabulary`}
              className="text-sky-300 hover:underline"
            >
              {t("ui.backToVocab", { lang: langName })}
            </Link>
          </p>
        </PageShell>
      );
    }
    const levelLabel = levelEntry.level;
    const copyVars = {
      lang: langName,
      level: levelLabel,
      unit,
      unitPlural: unit,
      unitSingular,
    };
    const copyKey = levelCopyKey(slug, levelLabel);
    const copy = {
      summary: t(`levelCopy.${copyKey}.summary`, copyVars),
      about: t(`levelCopy.${copyKey}.about`, copyVars),
      howTo: t(`levelCopy.${copyKey}.howTo`, copyVars),
    };
    const levelUrl = `${overviewUrl}/${slugifyLevel(levelLabel)}`;
    return (
      <PageShell
        title={t("ui.levelPageTitle", { ...copyVars, count: levelEntry.items.length })}
        subtitle={t("ui.levelPageSubtitle", {
          ...copyVars,
          unitLabel: isSentence ? t("ui.unitSentencePatterns") : t("ui.unitVocabulary"),
        })}
      >
        <Seo
          title={t("ui.seoLevelTitle", { ...copyVars, count: levelEntry.items.length })}
          description={copy.summary}
          pathname={`/languages/${langSlug}/vocabulary/${slugifyLevel(levelLabel)}`}
        />
        <JsonLd
          data={[
            buildBreadcrumbLd([
              { name: t("ui.navHome"), url: `${siteUrl}/` },
              { name: t("ui.navLanguages"), url: `${siteUrl}/languages` },
              { name: langName, url: `${siteUrl}/languages/${slug}` },
              { name: t("ui.navVocabulary"), url: overviewUrl },
              { name: levelLabel, url: levelUrl },
            ]),
          ]}
        />
        <article className="prose prose-invert max-w-none">
          <section className="glass rounded-3xl p-8 md:p-12">
            <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
              {t("ui.aboutLevel", { lang: langName, level: levelLabel })}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-100/90 md:text-base">
              {copy.about}
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
              {t("ui.allNAtLevel", { count: levelEntry.items.length, unit, level: levelLabel })}
            </h2>
            <p className="mt-2 text-sm text-brand-200/70">
              {t("ui.clickAnyUnit", { unitSingular })}
            </p>
            <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
              {levelEntry.items.map((w) => (
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
          </section>

          <section className="mt-10">
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
              {t("ui.howToStudyLevel", { lang: langName, level: levelLabel })}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-100/90 md:text-base">
              {copy.howTo}
            </p>
          </section>

          {/* Sibling-level cross-links. Showing the other levels in the
              same language keeps users (and crawlers) inside the
              vocabulary hub and helps distribute page authority. */}
          {grouped.length > 1 ? (
            <section className="mt-10">
              <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
                {t("ui.otherLevels", { lang: langName })}
              </h2>
              <p className="mt-2 text-sm text-brand-200/70">
                {t("ui.otherLevelsDesc")}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                {grouped
                  .filter((g) => g.level !== levelLabel)
                  .map((g) => (
                    <Link
                        key={g.level}
                        to={`/languages/${langSlug}/vocabulary/${slugifyLevel(g.level)}`}
                        className="glass group flex items-center justify-between rounded-xl px-3 py-2 text-sm transition hover:bg-white/10"
                      >
                      <span className="font-display text-white">
                        {langName} {g.level}
                      </span>
                      <span className="text-xs text-brand-200/50">
                        {g.items.length} {unit}
                      </span>
                    </Link>
                  ))}
              </div>
            </section>
          ) : null}
        </article>
      </PageShell>
    );
  }

  // --- Overview page ---------------------------------------------------
  return (
    <PageShell
      title={t("ui.vocabPageTitle", { lang: langName, levels: grouped.length, total: words?.length ?? 0, unit })}
      subtitle={t("ui.vocabPageSubtitle", { lang: langName, unit })}
    >
      <Seo
        title={t("ui.seoVocabTitle", { lang: langName, count: words?.length ?? 0, unit })}
        description={t("ui.seoVocabDesc", {
          lang: langName,
          unit,
          count: words?.length ?? 0,
          levels: grouped.length,
          tierLabel: isSentence ? t("ui.tierGeneric") : t("ui.tierLevels"),
        })}
        pathname={`/languages/${langSlug}/vocabulary`}
      />
      <JsonLd
        data={[
          buildBreadcrumbLd([
            { name: t("ui.navHome"), url: `${siteUrl}/` },
            { name: t("ui.navLanguages"), url: `${siteUrl}/languages` },
            { name: langName, url: `${siteUrl}/languages/${slug}` },
            { name: t("ui.navVocabulary"), url: overviewUrl },
          ]),
          buildItemListLd({
            name: t("ui.vocabListName", { lang: langName }),
            url: overviewUrl,
            items: grouped.map((g) => ({
              name: `${langName} ${g.level}`,
              url: `${overviewUrl}/${slugifyLevel(g.level)}`,
              description: t("ui.itemDescAtLevel", { count: g.items.length, unit, level: g.level }),
            })),
          }),
        ]}
      />
      <article className="prose prose-invert max-w-none">
        <section className="glass rounded-3xl p-8 md:p-12">
          <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
            {t("ui.vocabOverviewTitle", { lang: langName })}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-100/90 md:text-base">
            {t(`vocabOverview.${slug}`)}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl font-display font-bold text-white">
                {words?.length ?? 0}
              </div>
              <div className="text-xs uppercase tracking-widest text-brand-200/60">
                {t("ui.total", { unit })}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl font-display font-bold text-white">
                {grouped.length}
              </div>
              <div className="text-xs uppercase tracking-widest text-brand-200/60">
                {t("ui.levels")}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl font-display font-bold text-white">
                {grouped[0]?.level ?? "—"}
              </div>
              <div className="text-xs uppercase tracking-widest text-brand-200/60">
                {t("ui.startHere")}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl font-display font-bold text-white">
                {isSentence ? t("ui.sourceTatoeba") : t("ui.sourceNative")}
              </div>
              <div className="text-xs uppercase tracking-widest text-brand-200/60">
                {t("ui.source")}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
            {t("ui.vocabByLevel", { lang: langName })}
          </h2>
          <p className="mt-2 text-sm text-brand-200/70">
            {t("ui.clickLevel", { unit })}
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {grouped.map((g) => (
              <Link
                key={g.level}
                to={`/languages/${langSlug}/vocabulary/${slugifyLevel(g.level)}`}
                className="glass group rounded-3xl p-6 transition hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-display text-xl font-bold text-white">
                      {langName} {g.level}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-widest text-brand-200/50">
                      {g.items.length} {unit}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-sky-300 transition group-hover:translate-x-1" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {g.items.slice(0, 5).map((w) => (
                    <span
                      key={w.slug}
                      className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-brand-100"
                    >
                      {w.word.length > 20 ? w.word.slice(0, 18) + "…" : w.word}
                    </span>
                  ))}
                  {g.items.length > 5 && (
                    <span className="text-xs text-brand-200/50">
                      {t("ui.more", { count: g.items.length - 5 })}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
            {t("ui.whyWorks", { lang: langName })}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="glass rounded-2xl p-6">
              <BookOpen className="h-6 w-6 text-sky-300" />
              <h3 className="mt-3 font-display text-lg font-bold text-white">
                {t("ui.realExamples")}
              </h3>
              <p className="mt-2 text-sm text-brand-200/70">
                {t("ui.realExamplesDesc", { unitSingular })}
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <Sparkles className="h-6 w-6 text-amber-300" />
              <h3 className="mt-3 font-display text-lg font-bold text-white">
                {t("ui.spacedRepetition")}
              </h3>
              <p className="mt-2 text-sm text-brand-200/70">
                {t("ui.spacedRepetitionDesc")}
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <BookOpen className="h-6 w-6 text-fuchsia-300" />
              <h3 className="mt-3 font-display text-lg font-bold text-white">
                {t("ui.tenMinLoop")}
              </h3>
              <p className="mt-2 text-sm text-brand-200/70">
                {t("ui.tenMinLoopDesc")}
              </p>
            </div>
          </div>
        </section>
      </article>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** CEFR/JLPT/HSK ordering per language. Used to sort the level list. */
const LEVEL_ORDER: Record<LearnLangSlug, string[]> = {
  en: ["A1", "A2", "B1", "B2", "C1", "C2"],
  ja: ["N5", "N4", "N3", "N2", "N1"],
  zh: ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6", "HSK7", "HSK8", "HSK9"],
  ko: ["TOPIK1", "TOPIK2", "TOPIK3", "TOPIK4", "TOPIK5", "TOPIK6"],
  es: ["A1", "A2", "B1"],
  fr: ["A1", "A2", "B1"],
  de: ["A1", "A2", "B1"],
  it: ["A1", "A2", "B1", "B2", "C1", "C2"],
  th: ["A1", "A2", "B1", "B2", "C1", "C2"],
  yue: ["A1", "A2", "B1", "B2", "C1", "C2"],
  ms: ["A1", "A2", "B1", "B2", "C1", "C2"],
  id: ["A1", "A2", "B1", "B2", "C1", "C2"],
  vi: ["A1", "A2", "B1", "B2", "C1", "C2"],
};

function slugifyLevel(level: string): string {
  return level.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

interface Grouped {
  level: string;
  items: LearnWord[];
}

function groupByLevel(words: LearnWord[], slug: LearnLangSlug): Grouped[] {
  const map = new Map<string, LearnWord[]>();
  for (const w of words) {
    const lvl = w.level || "Unclassified";
    if (!map.has(lvl)) map.set(lvl, []);
    map.get(lvl)!.push(w);
  }
  const order = LEVEL_ORDER[slug];
  return Array.from(map.entries())
    .map(([level, items]) => ({ level, items }))
    .sort((a, b) => {
      const ai = order.indexOf(a.level);
      const bi = order.indexOf(b.level);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
}

/**
 * Which levelCopy.<key> template applies to a (language, raw level)
 * pair. Language-specific levels (N5, HSK1-4) win over the generic
 * CEFR copy; everything else normalises through cefrEquivalent.
 * (Mirror of resolveLevelCopyKey in src/data/learn-copy.ts, kept here
 * so the editorial-copy module stays out of the client bundle.)
 */
const KNOWN_LEVEL_COPY_KEYS = new Set([
  "A1", "A2", "B1", "B2", "C1", "C2",
  "N5",
  "HSK1", "HSK2", "HSK3", "HSK4",
]);

function levelCopyKey(slug: LearnLangSlug, level: string): string {
  if (/^(N[1-5]|HSK[1-9])$/.test(level) && KNOWN_LEVEL_COPY_KEYS.has(level)) {
    return level;
  }
  const eff = cefrEquivalent(slug, level) || level;
  return KNOWN_LEVEL_COPY_KEYS.has(eff) ? eff : "fallback";
}
