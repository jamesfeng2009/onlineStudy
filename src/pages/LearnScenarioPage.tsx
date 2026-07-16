import { Link, useParams } from "react-router-dom";
import LocaleLink from "../components/LocaleLink";
import { ArrowRight, MessageSquare, Sparkles } from "lucide-react";
import PageShell from "../components/PageShell";
import { Seo } from "../components/Seo";
import { JsonLd, buildBreadcrumbLd, buildItemListLd } from "../components/JsonLd";
import AudioButton from "../components/AudioButton";
import {
  LEARN_LANG_META,
  URL_SLUG_TO_DATA,
  type LearnLangSlug,
} from "../data/learn-content";
import {
  SCENARIO_CONTENT,
  SCENARIO_KEYS,
  SCENARIO_LANGS,
  SCENARIO_META,
  type ScenarioContent,
  type ScenarioKey,
  type ScenarioLang,
} from "../data/scenarios";

/**
 * /languages/:langSlug/scenarios/:scenarioSlug
 *   - Scenario-specific learning page. One per (lang, scenario)
 *     combination. Currently 3 languages × 4 scenarios = 12 indexable
 *     pages.
 *
 * The body is built from SCENARIO_CONTENT[lang][scenario] which
 * contains a hand-written intro, culture tip, mini-dialogue, and 10
 * high-frequency phrases (with romanization where the script is
 * non-Latin). The page template is the same across all 12 pages;
 * the copy is what makes each page unique.
 */
export default function LearnScenarioPage() {
  const { langSlug, scenarioSlug } = useParams<{
    langSlug: string;
    scenarioSlug?: string;
  }>();

  const dataSlug = langSlug ? URL_SLUG_TO_DATA[langSlug] : undefined;
  const validLang = dataSlug !== undefined;
  const langKey = (langSlug ?? "english") as ScenarioLang;
  const hasContent = (SCENARIO_LANGS as readonly string[]).includes(langKey);
  const slug = (dataSlug ?? "en") as LearnLangSlug;
  const meta = LEARN_LANG_META[slug];

  const siteUrl = "https://lang-oria.com";

  // /languages/:langSlug/scenarios — index of all 4 scenarios for this lang
  if (!scenarioSlug) {
    if (!validLang) {
      return (
        <PageShell title="Language not found" subtitle="That language is not yet supported.">
          <Seo noindex title="Language not found" />
          <p className="text-brand-200/80">
            <LocaleLink to="/languages" className="text-sky-300 hover:underline">
              ← Pick a language
            </LocaleLink>
          </p>
        </PageShell>
      );
    }
    if (!hasContent) {
      return (
        <PageShell
          title={`${meta.englishName} scenarios`}
          subtitle="Scenario lessons are coming soon for this language."
        >
          <Seo noindex title={`${meta.englishName} scenarios`} />
          <p className="text-brand-200/80">
            <Link
              to={`/languages/${langSlug}`}
              className="text-sky-300 hover:underline"
            >
              ← Back to {meta.englishName}
            </Link>
          </p>
        </PageShell>
      );
    }
    const scenariosForLang = SCENARIO_CONTENT[langKey]!;
    const overviewUrl = `${siteUrl}/languages/${langSlug}/scenarios`;
    return (
      <PageShell
        title={`${meta.englishName} scenarios — 4 real-world situations`}
        subtitle={`Four high-leverage ${meta.englishName} scenarios — travel, business, food, and small talk — each with 10 hand-picked phrases, a sample dialogue, and a culture tip.`}
      >
        <Seo
          title={`${meta.englishName} scenarios — travel, business, food, small talk | LangOria`}
          description={`Four high-leverage ${meta.englishName} scenarios with 10 phrases each, sample dialogues, and culture tips. ${meta.englishName} for travel, business, food, and small talk.`}
          pathname={`/languages/${langSlug}/scenarios`}
        />
        <JsonLd
          data={[
            buildBreadcrumbLd([
              { name: "Home", url: `${siteUrl}/` },
              { name: "Languages", url: `${siteUrl}/languages` },
              { name: meta.englishName, url: `${siteUrl}/languages/${langSlug}` },
              { name: "Scenarios", url: overviewUrl },
            ]),
            buildItemListLd({
              name: `${meta.englishName} learning scenarios`,
              url: overviewUrl,
              items: SCENARIO_KEYS.map((s) => ({
                name: SCENARIO_META[s].name,
                url: `${overviewUrl}/${s}`,
                description: SCENARIO_META[s].blurb,
              })),
            }),
          ]}
        />
        <article className="prose prose-invert max-w-none">
          <section className="glass rounded-3xl p-8 md:p-12">
            <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
              Why learn {meta.englishName} by scenario?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-100/90 md:text-base">
              Scenario-based learning is the fastest way to usable {meta.englishName}.
              Instead of memorising 1000 words you'll forget, you master 10 phrases you'll
              actually use — and then the next 10, and the next 10. The four scenarios
              below cover the situations adult learners most often ask us about: travel,
              business, food, and small talk. Each one is built from a 10-phrase deck, a
              sample dialogue, and a culture tip that tells you when to use the formal
              register and when the casual one is fine.
            </p>
          </section>
          <section className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {SCENARIO_KEYS.map((s) => {
              const sc = SCENARIO_META[s];
              return (
                <Link
                  key={s}
                  to={`/languages/${langSlug}/scenarios/${s}`}
                  className="glass group rounded-3xl p-6 transition hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-display text-xl font-bold text-white">
                        {sc.name}
                      </div>
                      <div className="mt-1 text-xs uppercase tracking-widest text-brand-200/50">
                        {meta.englishName} · 10 phrases
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-sky-300 transition group-hover:translate-x-1" />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-brand-100/80">
                    {sc.blurb}
                  </p>
                </Link>
              );
            })}
          </section>
        </article>
      </PageShell>
    );
  }

  // /languages/:langSlug/scenarios/:scenarioSlug
  if (!validLang || !hasContent) {
    return (
      <PageShell
        title="Scenario not available"
        subtitle="That language / scenario combination is not yet supported."
      >
        <Seo noindex title="Scenario not available" />
        <p className="text-brand-200/80">
          <Link to={`/languages/${langSlug}`} className="text-sky-300 hover:underline">
            ← Back to {meta.englishName}
          </Link>
        </p>
      </PageShell>
    );
  }
  if (!(SCENARIO_KEYS as readonly string[]).includes(scenarioSlug)) {
    return (
      <PageShell
        title="Scenario not found"
        subtitle="That scenario is not one of the four supported scenarios."
      >
        <Seo noindex title="Scenario not found" />
        <p className="text-brand-200/80">
          <Link
            to={`/languages/${langSlug}/scenarios`}
            className="text-sky-300 hover:underline"
          >
            ← Back to {meta.englishName} scenarios
          </Link>
        </p>
      </PageShell>
    );
  }

  const scenarioKey = scenarioSlug as ScenarioKey;
  const content: ScenarioContent = SCENARIO_CONTENT[langKey]![scenarioKey];
  const scMeta = SCENARIO_META[scenarioKey];
  const pageUrl = `${siteUrl}/languages/${langSlug}/scenarios/${scenarioKey}`;
  const ttsLang = TTS_LANG_FOR_SCENARIO[langKey];

  return (
    <PageShell
      title={content.title}
      subtitle={content.subtitle}
      action={
        <LocaleLink
          to="/register"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 via-fuchsia-400 to-amber-300 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-fuchsia-500/30 transition hover:-translate-y-0.5"
        >
          Start free trial <ArrowRight className="h-4 w-4" />
        </LocaleLink>
      }
    >
      <Seo
        title={`${content.title} | LangOria`}
        description={content.intro.slice(0, 180)}
        pathname={`/languages/${langSlug}/scenarios/${scenarioKey}`}
      />
      <JsonLd
        data={[
          buildBreadcrumbLd([
            { name: "Home", url: `${siteUrl}/` },
            { name: "Languages", url: `${siteUrl}/languages` },
            { name: meta.englishName, url: `${siteUrl}/languages/${langSlug}` },
            { name: "Scenarios", url: `${siteUrl}/languages/${langSlug}/scenarios` },
            { name: scMeta.name, url: pageUrl },
          ]),
        ]}
      />
      <article className="prose prose-invert max-w-none">
        <section className="glass rounded-3xl p-8 md:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-100">
            <Sparkles className="h-3.5 w-3.5 text-sky-300" /> {scMeta.name} · {meta.englishName} · {meta.flag}
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
            Why {scMeta.name.toLowerCase()} {meta.englishName}?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-100/90 md:text-base">
            {content.intro}
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
            10 phrases you will actually use
          </h2>
          <p className="mt-2 text-sm text-brand-200/70">
            These 10 sentences cover roughly 95% of {scMeta.name.toLowerCase()} in {meta.englishName}. Tap the speaker icon to hear the pronunciation.
          </p>
          <div className="mt-6 space-y-3">
            {content.phrases.map((p, i) => (
              <div key={i} className="glass rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-xs font-bold text-brand-200/60">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-semibold text-white md:text-lg">
                      {p.tgt}
                    </div>
                    {p.romanization ? (
                      <div className="mt-1 text-sm italic text-sky-300/80">
                        {p.romanization}
                      </div>
                    ) : null}
                    <div className="mt-2 text-sm text-brand-100/80">
                      <span className="text-brand-200/50">EN:</span> {p.en}
                    </div>
                    {p.literal ? (
                      <div className="mt-1 text-xs text-brand-200/60">
                        <span className="text-brand-200/40">Lit:</span> {p.literal}
                      </div>
                    ) : null}
                  </div>
                  <AudioButton text={p.tgt} lang={ttsLang} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
            Sample dialogue
          </h2>
          <p className="mt-2 text-sm text-brand-200/70">
            Read this conversation out loud — it uses the same 10 phrases in context.
          </p>
          <div className="mt-6 glass rounded-3xl p-6 md:p-8">
            <MessageSquare className="h-5 w-5 text-sky-300" />
            <div className="mt-4 space-y-4">
              {content.conversation.map((t, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-400 text-xs font-bold text-slate-900">
                    {t.speaker}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="text-base text-white">{t.tgt}</div>
                        {t.romanization ? (
                          <div className="mt-1 text-sm italic text-sky-300/70">
                            {t.romanization}
                          </div>
                        ) : null}
                        {t.literal ? (
                          <div className="mt-1 text-xs text-brand-200/60">
                            <span className="text-brand-200/40">Lit:</span> {t.literal}
                          </div>
                        ) : null}
                        <div className="mt-1 text-sm text-brand-200/60">{t.en}</div>
                      </div>
                      <AudioButton text={t.tgt} lang={ttsLang} size="sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
            Culture & etiquette
          </h2>
          <div className="mt-4 glass rounded-3xl p-8">
            <p className="text-sm leading-relaxed text-brand-100/90 md:text-base">
              {content.culture}
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
            How to study this scenario
          </h2>
          <div className="mt-4 glass rounded-3xl p-8">
            <p className="text-sm leading-relaxed text-brand-100/90 md:text-base">
              {content.howTo}
            </p>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-xl font-bold text-white md:text-2xl">
                More {meta.englishName} scenarios
              </h2>
              <p className="mt-1 text-sm text-brand-100/80">
                Jump to a different scenario in the same language.
              </p>
            </div>
            <Link
              to={`/languages/${langSlug}/scenarios`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              All {meta.englishName} scenarios <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            {SCENARIO_KEYS.filter((k) => k !== scenarioKey).map((k) => {
              const m = SCENARIO_META[k];
              return (
                <Link
                  key={k}
                  to={`/languages/${langSlug}/scenarios/${k}`}
                  className="glass group flex items-center justify-between rounded-2xl p-4 text-sm transition hover:bg-white/10"
                >
                  <span className="font-semibold text-white">{m.name}</span>
                  <ArrowRight className="h-4 w-4 text-brand-200/40 transition group-hover:text-sky-300" />
                </Link>
              );
            })}
          </div>
        </section>
      </article>
    </PageShell>
  );
}

/**
 * Map scenario language key → BCP-47 tag for the Web Speech API.
 * Each language gets a region-specific tag so the OS picks the
 * most natural voice (e.g. ja-JP > ja for Japanese, es-ES for
 * Castilian Spanish). If the user has no voice for the region we
 * fall back to the language root inside AudioButton.
 */
const TTS_LANG_FOR_SCENARIO: Record<ScenarioLang, string> = {
  english: "en-US",
  japanese: "ja-JP",
  chinese: "zh-CN",
  korean: "ko-KR",
  spanish: "es-ES",
  french: "fr-FR",
  german: "de-DE",
};
