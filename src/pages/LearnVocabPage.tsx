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

/**
 * /languages/:langSlug/vocabulary
 *   - the overview page: lists every level in the language with a count
 *     and a sample of the words/sentences at that level. One page per
 *     language = 7 indexable pages.
 *
 * /languages/:langSlug/vocabulary/:levelSlug
 *   - the level detail page: full list of words/sentences at that
 *     level, plus a level-specific "about" and "how to study" block.
 *     Optional for now — P1-4 ships the overview pages; level details
 *     follow naturally from the same data.
 *
 * Indexable page count today: 7 overview pages.
 */
export default function LearnVocabPage() {
  const { langSlug, levelSlug } = useParams<{
    langSlug: string;
    levelSlug?: string;
  }>();
  const [words, setWords] = useState<LearnWord[] | null>(null);

  const dataSlug = langSlug ? URL_SLUG_TO_DATA[langSlug] : undefined;
  const valid = Boolean(dataSlug);
  const slug = (dataSlug ?? "en") as LearnLangSlug;
  const meta = LEARN_LANG_META[slug];

  useEffect(() => {
    if (!valid) return;
    let cancelled = false;
    LEARN_CONTENT_LOADERS[slug]().then((data) => {
      if (!cancelled) setWords(data);
    });
    return () => {
      cancelled = true;
    };
  }, [slug, valid]);

  const grouped = useMemo(() => groupByLevel(words ?? [], slug), [words, slug]);

  if (!valid) {
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

  const isSentence = meta.dataShape === "sentence";
  const unit = isSentence ? "sentences" : "words";
  const unitSingular = isSentence ? "sentence" : "word";
  const siteUrl = "https://lang-oria.com";
  const overviewUrl = `${siteUrl}/languages/${slug}/vocabulary`;

  // --- Level-detail page ------------------------------------------------
  if (levelSlug) {
    const levelEntry = grouped.find((g) => slugifyLevel(g.level) === levelSlug);
    if (!levelEntry) {
      return (
        <PageShell title="Level not found" subtitle="That level is not available for this language.">
          <Seo noindex title="Level not found" />
          <p className="text-brand-200/80">
            <Link
              to={`/languages/${slug}/vocabulary`}
              className="text-sky-300 hover:underline"
            >
              ← Back to {meta.englishName} vocabulary
            </Link>
          </p>
        </PageShell>
      );
    }
    const levelLabel = levelEntry.level;
    const copy = pickLevelCopy(slug, levelLabel);
    const levelUrl = `${overviewUrl}/${slugifyLevel(levelLabel)}`;
    return (
      <PageShell
        title={`${meta.englishName} ${levelLabel} ${unit} — ${levelEntry.items.length} ${unit}`}
        subtitle={`Master the ${levelLabel} ${isSentence ? "sentence patterns" : "vocabulary"} of ${meta.englishName} with real examples and spaced-repetition practice.`}
      >
        <Seo
          title={`${meta.englishName} ${levelLabel} ${unit} (${levelEntry.items.length}) | LangOria`}
          description={copy.summary}
          pathname={`/languages/${slug}/vocabulary/${slugifyLevel(levelLabel)}`}
        />
        <JsonLd
          data={[
            buildBreadcrumbLd([
              { name: "Home", url: `${siteUrl}/` },
              { name: "Languages", url: `${siteUrl}/languages` },
              { name: meta.englishName, url: `${siteUrl}/languages/${slug}` },
              { name: "Vocabulary", url: overviewUrl },
              { name: levelLabel, url: levelUrl },
            ]),
          ]}
        />
        <article className="prose prose-invert max-w-none">
          <section className="glass rounded-3xl p-8 md:p-12">
            <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
              About {meta.englishName} {levelLabel}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-100/90 md:text-base">
              {copy.about}
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
              All {levelEntry.items.length} {unit} at {levelLabel}
            </h2>
            <p className="mt-2 text-sm text-brand-200/70">
              Click any {unitSingular} to see its full breakdown: reading, translation, and a real example sentence.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
              {levelEntry.items.map((w) => (
                <Link
                  key={w.slug}
                  to={`/languages/${slug}/word/${w.slug}`}
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
              How to study {meta.englishName} {levelLabel}
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
                Other {meta.englishName} levels
              </h2>
              <p className="mt-2 text-sm text-brand-200/70">
                Move up or down within the same language to keep your recall curve consistent.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                {grouped
                  .filter((g) => g.level !== levelLabel)
                  .map((g) => (
                    <Link
                      key={g.level}
                      to={`/languages/${slug}/vocabulary/${slugifyLevel(g.level)}`}
                      className="glass group flex items-center justify-between rounded-xl px-3 py-2 text-sm transition hover:bg-white/10"
                    >
                      <span className="font-display text-white">
                        {meta.englishName} {g.level}
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
      title={`${meta.englishName} vocabulary — ${grouped.length} level${grouped.length === 1 ? "" : "s"}, ${words?.length ?? 0} ${unit}`}
      subtitle={`Browse ${meta.englishName} ${unit} organised by proficiency level. Every entry includes a real example sentence from native speakers and audio shadowing drills.`}
    >
      <Seo
        title={`${meta.englishName} vocabulary by level — ${words?.length ?? 0} ${unit} | LangOria`}
        description={`Browse ${meta.englishName} ${unit} organised by proficiency level. ${words?.length ?? 0} entries across ${grouped.length} ${isSentence ? "tiers" : "CEFR / JLPT / HSK levels"}, with real example sentences and spaced-repetition practice.`}
        pathname={`/languages/${slug}/vocabulary`}
      />
      <JsonLd
        data={[
          buildBreadcrumbLd([
            { name: "Home", url: `${siteUrl}/` },
            { name: "Languages", url: `${siteUrl}/languages` },
            { name: meta.englishName, url: `${siteUrl}/languages/${slug}` },
            { name: "Vocabulary", url: overviewUrl },
          ]),
          buildItemListLd({
            name: `${meta.englishName} vocabulary by level`,
            url: overviewUrl,
            items: grouped.map((g) => ({
              name: `${meta.englishName} ${g.level}`,
              url: `${overviewUrl}/${slugifyLevel(g.level)}`,
              description: `${g.items.length} ${unit} at ${g.level}`,
            })),
          }),
        ]}
      />
      <article className="prose prose-invert max-w-none">
        <section className="glass rounded-3xl p-8 md:p-12">
          <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
            {meta.englishName} vocabulary overview
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-100/90 md:text-base">
            {VOCAB_OVERVIEW_COPY[slug]}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl font-display font-bold text-white">
                {words?.length ?? 0}
              </div>
              <div className="text-xs uppercase tracking-widest text-brand-200/60">
                Total {unit}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl font-display font-bold text-white">
                {grouped.length}
              </div>
              <div className="text-xs uppercase tracking-widest text-brand-200/60">
                Levels
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl font-display font-bold text-white">
                {grouped[0]?.level ?? "—"}
              </div>
              <div className="text-xs uppercase tracking-widest text-brand-200/60">
                Start here
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl font-display font-bold text-white">
                {isSentence ? "Tatoeba" : "Native"}
              </div>
              <div className="text-xs uppercase tracking-widest text-brand-200/60">
                Source
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
            {meta.englishName} vocabulary by level
          </h2>
          <p className="mt-2 text-sm text-brand-200/70">
            Click any level to see the full list of {unit} at that tier.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {grouped.map((g) => (
              <Link
                key={g.level}
                to={`/languages/${slug}/vocabulary/${slugifyLevel(g.level)}`}
                className="glass group rounded-3xl p-6 transition hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-display text-xl font-bold text-white">
                      {meta.englishName} {g.level}
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
                      +{g.items.length - 5} more
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
            Why LangOria's {meta.englishName} vocabulary works
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="glass rounded-2xl p-6">
              <BookOpen className="h-6 w-6 text-sky-300" />
              <h3 className="mt-3 font-display text-lg font-bold text-white">
                Real example sentences
              </h3>
              <p className="mt-2 text-sm text-brand-200/70">
                Every {unitSingular} comes with a real example from the Tatoeba corpus — no synthetic textbook filler.
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <Sparkles className="h-6 w-6 text-amber-300" />
              <h3 className="mt-3 font-display text-lg font-bold text-white">
                Spaced repetition
              </h3>
              <p className="mt-2 text-sm text-brand-200/70">
                Reviews are scheduled at the moment you are about to forget, so you retain more in less time.
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <BookOpen className="h-6 w-6 text-fuchsia-300" />
              <h3 className="mt-3 font-display text-lg font-bold text-white">
                10-minute daily loop
              </h3>
              <p className="mt-2 text-sm text-brand-200/70">
                A short focused daily session beats a long abandoned one — streaks keep you honest.
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
  ko: ["A1", "A2", "B1"],
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

// ---------------------------------------------------------------------------
// Hand-written copy. Kept in code (not i18n) so it stays editorially
// controlled and unique per page — the same pattern as LearnLangPage.
// ---------------------------------------------------------------------------

const VOCAB_OVERVIEW_COPY: Record<LearnLangSlug, string> = {
  en:
    "LangOria's English vocabulary library is organised by CEFR — the Common European Framework of Reference for Languages, which is the standard scale used by employers, universities, and immigration authorities worldwide. A1 covers the most frequent 500 words you need to get by in everyday situations; C2 covers the rarest academic and literary vocabulary. Each entry includes a real example sentence from the Tatoeba corpus, so you see the word in the contexts native speakers actually use, and our spaced-repetition scheduler reviews each word at the moment you are about to forget it.",
  ja:
    "LangOria's Japanese vocabulary library is organised by JLPT level — the Japanese Language Proficiency Test, which is the certification Japanese learners and employers actually recognise. N5 is the foundation of the language (roughly 800 words and 100 kanji) and is the right starting point for most beginners; N1 is professional fluency. Every entry shows kanji with both on'yomi and kun'yomi readings, and a real example sentence drawn from the Tatoeba corpus. The current library covers N5 in depth; N4-N1 are added as new content drops.",
  zh:
    "LangOria's Chinese vocabulary library is organised by HSK — the Hanyu Shuiping Kaoshi standardised proficiency test, the de-facto standard for measuring Chinese fluency. HSK 1 is the 150-word beginner deck; HSK 4 is 1200 words covering fluent everyday conversation. Each entry shows pinyin alongside the character so you can read on day one, and a real example sentence from the Tatoeba corpus so you see the word in native-speaker context. Tone pairs are trained with audio shadowing.",
  ko:
    "LangOria's Korean course is currently built around practical sentence pairs from the Tatoeba corpus — a crowdsourced database of translations by native Korean speakers. The vocabulary is organised by CEFR level so you can see your progress against an internationally recognised scale. A1 covers survival Korean; A2 covers everyday conversation; B1 covers working Korean. Each entry pairs a Korean sentence with its English translation so you can read, listen, and shadow the natural rhythm of native Korean speech. The corpus is sampled across mainland South Korea, the diaspora in the US and Canada, and overseas communities in Japan and Australia, so you will hear a balanced mix of standard Seoul speech and lightly regional phrasing. We de-duplicate near-identical sentence pairs and prefer entries that include honorific verb endings (-습니다 / -세요) over the casual -(아/어)요 form, because the politeness register is what most adult learners need on day one. Each sentence is also audio-rendered through the Web Speech API with a ko-KR voice so you can hear the natural rising intonation of declarative questions and the falling tone of statements — the prosody carries as much meaning as the vocabulary itself. If a sentence contains a particle you have not learned yet, hover the highlighted token to see its function (topic, subject, object, location, instrument) without breaking your reading flow.",
  es:
    "LangOria's Spanish course is currently built around practical sentence pairs from the Tatoeba corpus — a crowdsourced database of translations by native Spanish speakers across Latin America and Spain. The vocabulary is organised by CEFR level: A1 covers survival Spanish, A2 covers everyday conversation, B1 covers working Spanish. Each entry pairs a Spanish sentence with its English translation so you can read, listen, and shadow the natural rhythm of native Spanish speech — useful whether you are aiming for Castilian, Mexican, or Argentinian Spanish. The Tatoeba corpus is geographically diverse — we sample from Spain, Mexico, Argentina, Colombia, Chile, Peru, and Venezuela — so you will see 'ustedes' as the plural of 'tú' (Latin American) and 'vosotros' (Iberian) both represented, and the pronoun map at the top of every level tells you which form a given entry uses. Sentence-level prosody is preserved through the audio shadowing loop: native speakers tend to drop final /s/ in Andalusia and the Caribbean, and aspirate /d/ between vowels in central Mexico — features that do not appear in textbook transcripts but matter when you are listening to a stranger at a market in Seville or a café in Mexico City. Each entry also shows the indicative verb mood by default and flags the subjunctive form when the same verb is used in a subordinate clause, so you internalise the indicative-vs-subjunctive split gradually rather than all at once. If a sentence uses the impersonal 'se' or the passive 'se', the gloss tells you which is which — the same construction means very different things depending on context.",
  fr:
    "LangOria's French course is currently built around practical sentence pairs from the Tatoeba corpus — a crowdsourced database of translations by native French speakers from Paris, Quebec, Dakar, and beyond. The vocabulary is organised by CEFR level: A1 covers survival French, A2 covers everyday conversation, B1 covers working French. Each entry pairs a French sentence with its English translation so you can read, listen, and shadow the natural rhythm of native French speech — including the liaison between words that gives French its characteristic flow. The corpus is sampled across the major Francophone regions — France, Belgium, Switzerland, Quebec, Senegal, Côte d'Ivoire, and Morocco — so you will see both 'soixante-dix' (France, Belgium, Switzerland) and 'septante' (Belgium, Switzerland) for 70, both 'quatre-vingts' and 'octante' for 80, and both standard French from Paris and joual-influenced sentences from Montreal. The audio uses fr-FR voices that capture liaison: 'les_amis' is rendered as /le.za.mi/ rather than /le.a.mi/, and 'c'est_un' is rendered as /sɛ.t‿ɛ̃/ rather than /sɛ.ɛ̃/ — these contractions are not optional in connected speech and the shadowing drill trains your ear to expect them. Each entry also flags false friends ('bibliothèque' = library, not bookshop — that is 'librairie') and the same sentence is sometimes presented in both the formal 'vous' and the casual 'tu' register so you can see the pronoun's effect on the verb form. Subjunctive and conditional moods are surfaced one level at a time, starting with the most common triggers (il faut que, je voudrais que) so you do not get overwhelmed by the mood system on day one.",
  de:
    "LangOria's German course is currently built around practical sentence pairs from the Tatoeba corpus — a crowdsourced database of translations by native German speakers. The vocabulary is organised by CEFR level: A1 covers survival German, A2 covers everyday conversation, B1 covers working German. Each entry pairs a German sentence with its English translation so you can read, listen, and shadow the natural rhythm of native German speech — including the verb-final word order in subordinate clauses that trips up most beginners. The corpus is sampled across the major German-speaking regions — Germany, Austria, Switzerland, Liechtenstein, Luxembourg, and the South Tyrol — so you will see both 'Brötchen' (Germany) and 'Semmel' (Austria, Bavaria) for bread roll, both 'Kartoffel' and the Swiss-German-influenced 'Herdöpfel' surfaced as a tooltip, and the formal 'Sie' alongside the casual 'du'. The audio uses de-DE voices and the rate is dialed down to 0.92× so you can hear the distinction between the voiced /b/ and /d/ at the start of words and their unvoiced counterparts /p/ and /t/ at the end — a contrast that does not exist in English but is meaningful in German (rad vs Rat, Bund vs bunt). Each sentence also marks separable verbs (aufstehen → ich stehe auf, nicht: ich aufstehe) so the prefix-position pattern is visible from day one, and the same verb is shown in main-clause and subordinate-clause word order side by side at A2. Plural formation is irregular in German and the corpus entry's tooltip always shows the full nominative plural form so you do not have to guess whether to add -e, -er, or -en. The declension table for 'der / die / das' is pinned at the top of the level so you can refer back to it while you study.",
  it:
    "LangOria's Italian course is built around practical sentence pairs hand-curated for learners at every CEFR level. A1 covers greetings, ordering coffee, and asking directions; B2 covers subjunctive moods and compound tenses. Each entry pairs an Italian sentence with its English translation so you can read, listen, and shadow the musical intonation that characterises native Italian speech. The course includes both the formal 'Lei' and casual 'tu' registers so you know when to use each, and highlights the gendered article system (il/la, un/una) in context so you absorb the patterns naturally rather than memorising rules.",
  th:
    "LangOria's Thai course is built around practical sentence pairs in Thai script, each with romanization so you can pronounce every sentence from day one. A1 covers greetings and the polite particles khrap/kha; B1 covers negotiating at markets and giving directions. Thai is a tonal language with five tones that change word meaning — our audio shadowing drills train your ear to distinguish mid, low, falling, high, and rising tones in real sentences. Each entry shows the Thai script alongside its romanization, so you learn to read Thai characters while building speaking confidence.",
  yue:
    "LangOria's Cantonese course is built around practical sentence pairs in traditional Chinese characters, each with Jyutping romanization so you can pronounce every sentence correctly. A1 covers greetings and ordering food; B1 covers navigating Hong Kong's MTR and shopping at street markets. Cantonese has nine tones that give it its distinctive musical quality — our audio shadowing drills train your ear to the tone contours that distinguish meaning. Each entry shows traditional characters with Jyutping, so you learn to read Hong Kong signage and menus while building speaking confidence for real-world Cantonese conversation.",
  ms:
    "LangOria's Malay course is built around practical sentence pairs hand-curated for learners at every CEFR level. A1 covers greetings, numbers, and asking directions; B1 covers negotiating at markets and discussing work. Malay uses the Latin alphabet (Rumi) and has no tonal system, making it one of the most accessible Asian languages for English speakers to start reading from day one. Each entry pairs a Malay sentence with its English translation so you can read, listen, and shadow the natural rhythm of native Malay speech as used in Kuala Lumpur, Singapore, and Brunei.",
  id:
    "LangOria's Indonesian course is built around practical sentence pairs hand-curated for learners at every CEFR level. A1 covers greetings, ordering food, and asking directions; B1 covers negotiating at markets and discussing work. Indonesian (Bahasa Indonesia) uses the Latin alphabet and has remarkably simple grammar — no tenses, no gender, no tonal system — making it one of the easiest Asian languages for English speakers to learn. Each entry pairs an Indonesian sentence with its English translation so you can read, listen, and shadow the natural rhythm of native Indonesian speech as used in Jakarta, Bali, and across the archipelago.",
  vi:
    "LangOria's Vietnamese course is built around practical sentence pairs in chữ Quốc ngữ (the Latin-based Vietnamese script) with full diacritical tone marks. A1 covers greetings, ordering food, and asking directions; B1 covers negotiating at markets and discussing travel plans. Vietnamese has six tones that change word meaning — our audio shadowing drills train your ear to distinguish ngang, huyền, hỏi, ngã, sắc, and nặng tones in real sentences. Each entry shows the Vietnamese script with tone marks, so you learn to read Vietnamese signage and menus while building speaking confidence for real-world conversation.",
};

interface LevelCopy {
  summary: string;
  about: string;
  howTo: string;
}

function pickLevelCopy(slug: LearnLangSlug, level: string): LevelCopy {
  const dataShape = LEARN_LANG_META[slug].dataShape;
  const unit = dataShape === "sentence" ? "sentence" : "word";
  const unitPlural = dataShape === "sentence" ? "sentences" : "words";

  // Generic A-level copy used by all languages (CEFR shared)
  if (level === "A1") {
    return {
      summary: `${metaName(slug)} A1 ${unitPlural} — the survival-vocabulary tier covering greetings, directions, numbers, food, family, and the most common 500 ${unitPlural} you need to get by in everyday situations.`,
      about:
        `A1 is the entry-level tier in CEFR — the Common European Framework of Reference for Languages. At A1 you can introduce yourself, ask and answer simple questions about personal details, and hold a basic conversation provided the other person speaks slowly and clearly. The ${unitPlural} at A1 are the high-frequency ${unitPlural} that show up in the overwhelming majority of everyday speech: greetings, numbers, family, food, weather, directions, time. Mastering A1 ${unitPlural} is the foundation of ${metaName(slug)} fluency — every later level is built on these ${unitPlural}.`,
      howTo:
        `Spend your first 4-6 weeks on A1 ${unitPlural}. The 10-minute daily loop is enough — review the A1 deck with spaced repetition until your recall rate is above 90%, then start adding A2 ${unitPlural} one batch per week. Pair the deck with a basic grammar primer for ${metaName(slug)} verb forms (or sentence-final particles, for languages like Korean and Japanese) so you can start producing your own sentences from day one.`,
    };
  }
  if (level === "A2") {
    return {
      summary: `${metaName(slug)} A2 ${unitPlural} — the everyday-conversation tier covering shopping, travel, work routines, and the ${unitPlural} you need to describe your day, your family, and your plans.`,
      about:
        `A2 is the elementary tier in CEFR. At A2 you can handle most everyday interactions — ordering food, asking for directions, booking a hotel, describing your job and your weekend — and you can express yourself in simple connected sentences. The ${unitPlural} at A2 expand on the A1 foundation: common verbs, daily routines, clothing, transport, the home. A2 is the practical fluency tier: if you finish A2, you can survive comfortably in a ${metaName(slug)}-speaking country.`,
      howTo:
        `A2 takes about 6-8 weeks on top of A1. Continue spaced-repetition review of the A1 deck (your recall should now be automatic) and add 30-50 new A2 ${unitPlural} per week. Start reading simple ${metaName(slug)} texts — children's books, news headlines, restaurant menus — and listening to slow podcasts. By the end of A2 you should be able to follow a basic ${metaName(slug)} conversation at natural speed.`,
    };
  }
  if (level === "B1") {
    return {
      summary: `${metaName(slug)} B1 ${unitPlural} — the working-language tier covering opinions, experiences, abstract topics, and the ${unitPlural} you need to express yourself in most professional and travel situations.`,
      about:
        `B1 is the intermediate tier in CEFR. At B1 you can deal with most situations likely to arise while travelling, enter unprepared into conversation on familiar topics, and produce simple connected text on subjects within your field. The ${unitPlural} at B1 start to include abstract and opinion words — you can describe experiences, express hopes and plans, and give reasons for your opinions. B1 is the level most employers mean when they ask for "conversational ${metaName(slug)}".`,
      howTo:
        `B1 takes 3-6 months on top of A2. Continue spaced-repetition review of A1 and A2 (now 5-minute daily), and add 50-100 new B1 ${unitPlural} per week. Start consuming native ${metaName(slug)} content — TV shows with subtitles, podcasts at natural speed, news articles — and try writing short pieces (200-500 words) and getting them corrected by a tutor or language partner. By the end of B1 you should be able to hold your own in a debate about a familiar topic.`,
    };
  }

  // JLPT copy (Japanese)
  if (level === "N5") {
    return {
      summary: `${metaName("ja")} N5 ${unitPlural} — the foundation of Japanese, covering the 800 most common ${unitPlural} and 100 basic kanji. N5 is the right starting point for most beginners.`,
      about:
        "N5 is the entry-level tier of the Japanese Language Proficiency Test (JLPT) — the certification Japanese learners and employers actually recognise. N5 covers roughly 800 vocabulary words and 100 kanji, which is the minimum needed to read simple sentences, introduce yourself, and get by in everyday situations in Japan. Every word in LangOria's N5 deck is paired with kanji readings, an English translation, and a real example sentence from the Tatoeba corpus. Mastering N5 is the foundation for N4, N3, and beyond.",
      howTo:
        "Spend your first 3-4 months on N5. The 10-minute daily loop is enough — review the N5 deck with spaced repetition until your recall rate is above 90%, then start adding N4 vocabulary. Pair the deck with a structured textbook (Genki I or Minna no Nihongo) for grammar depth, and practice writing the kanji by hand at least once per day — handwriting builds character recognition that passive reading cannot. By the end of N5 you should be able to read simple Japanese sentences and hold a basic conversation.",
    };
  }

  // HSK copy (Chinese)
  if (level === "HSK1") {
    return {
      summary: `${metaName("zh")} HSK 1 ${unitPlural} — the 150-word beginner deck covering greetings, numbers, family, and time. HSK 1 is the right starting point for most learners of Mandarin.`,
      about:
        "HSK 1 is the beginner tier of the Hanyu Shuiping Kaoshi — the standardised Chinese proficiency test recognised by employers and universities worldwide. HSK 1 covers 150 vocabulary words and the most basic grammar patterns, which is the minimum needed to introduce yourself, order food, and hold a simple conversation in Mandarin. Every entry in LangOria's HSK 1 deck shows simplified characters with pinyin and a real example sentence from the Tatoeba corpus. Mastering HSK 1 is the foundation for HSK 2 and beyond.",
      howTo:
        "Spend your first 4-6 weeks on HSK 1. The 10-minute daily loop is enough — review the HSK 1 deck with spaced repetition until your recall rate is above 90%, then move on to HSK 2. Tone pairs are critical at HSK 1: train them with the audio shadowing drills, not just by memorising tone marks. By the end of HSK 1 you should recognise all 150 words on sight and be able to introduce yourself in Mandarin.",
    };
  }
  if (level === "HSK2") {
    return {
      summary: `${metaName("zh")} HSK 2 ${unitPlural} — the 150-word elementary deck covering shopping, travel, weather, and daily routines.`,
      about:
        "HSK 2 builds on HSK 1 with another 150 vocabulary words and slightly more complex grammar — enough to handle shopping, ordering in restaurants, asking for directions, and discussing daily routines. HSK 2 is the practical elementary tier: by the end you can get by in most everyday situations in a Mandarin-speaking environment.",
      howTo:
        "HSK 2 takes about 4-6 weeks on top of HSK 1. Continue reviewing the HSK 1 deck (your recall should be automatic) and add 30-50 new HSK 2 words per week. Start reading simple Chinese texts (children's books, menus, short news articles) and listening to slow Mandarin podcasts. By the end of HSK 2 you should be able to hold a basic conversation in Mandarin on familiar topics.",
    };
  }
  if (level === "HSK3") {
    return {
      summary: `${metaName("zh")} HSK 3 ${unitPlural} — the 300-word intermediate deck covering work, study, opinions, and abstract topics.`,
      about:
        "HSK 3 is the intermediate tier — 300 vocabulary words and the grammar needed to express opinions, describe experiences, and discuss abstract topics. HSK 3 is roughly equivalent to B1 in CEFR: by the end you can hold a fluent conversation on most everyday topics, read short Chinese news articles, and write 200-character pieces on familiar subjects.",
      howTo:
        "HSK 3 takes 3-6 months on top of HSK 2. Continue reviewing HSK 1 and HSK 2 (5-minute daily) and add 50-100 new HSK 3 words per week. Start consuming native Chinese content — TV shows with subtitles, podcasts, news articles — and try writing short pieces (200-500 characters) for correction. By the end of HSK 3 you should be able to follow a Chinese conversation at natural speed and express nuanced opinions.",
    };
  }
  if (level === "HSK4") {
    return {
      summary: `${metaName("zh")} HSK 4 ${unitPlural} — the 600-word upper-intermediate deck covering professional, academic, and cultural topics.`,
      about:
        "HSK 4 is the upper-intermediate tier — 600 vocabulary words and the grammar needed to read Chinese newspapers, follow Chinese TV shows without subtitles, and discuss professional and cultural topics in Mandarin. HSK 4 is roughly equivalent to B2 in CEFR.",
      howTo:
        "HSK 4 takes 4-6 months on top of HSK 3. Continue reviewing HSK 1-3 (5-minute daily) and add 50-100 new HSK 4 words per week. Read Chinese news daily (BBC Chinese, Sixth Tone, SupChina), watch Chinese TV shows and movies with no subtitles, and try writing 500-1000 character pieces for correction. By the end of HSK 4 you should be able to work in a Mandarin-speaking environment.",
    };
  }

  // English B2 / C1 / C2
  if (level === "B2") {
    return {
      summary: `${metaName("en")} B2 ${unitPlural} — the upper-intermediate tier covering nuanced opinions, abstract topics, and professional vocabulary.`,
      about:
        "B2 is the upper-intermediate tier of CEFR. At B2 you can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible, produce clear detailed text on a wide range of subjects, and explain a viewpoint on a topical issue. B2 is the level most universities and employers mean when they ask for 'fluent English'.",
      howTo:
        "B2 takes 3-6 months on top of B1. Continue reviewing A1-B1 (5-minute daily) and add 50-100 new B2 words per week. Read English news and long-form journalism (The Atlantic, The New Yorker, The Economist), listen to English podcasts at natural speed, and try writing 500-1000 word essays for correction. By the end of B2 you should be able to debate any familiar topic in English and read most non-technical English text without a dictionary.",
    };
  }
  if (level === "C1") {
    return {
      summary: `${metaName("en")} C1 ${unitPlural} — the advanced tier covering academic, professional, and literary vocabulary.`,
      about:
        "C1 is the advanced tier of CEFR. At C1 you can express yourself fluently and spontaneously without much obvious searching for expressions, use language flexibly and effectively for social, academic, and professional purposes, and produce clear, well-structured, detailed text on complex subjects. C1 is the level required by most top-tier universities and professional roles.",
      howTo:
        "C1 takes 6-12 months on top of B2. Continue reviewing A1-B2 (5-minute daily) and add 50-100 new C1 words per week. Read English literature, academic papers, and long-form journalism; listen to English lectures and documentaries; and try writing 1000-2000 word essays on complex topics. By the end of C1 you should be able to read any English text (including academic papers) and express yourself with near-native precision.",
    };
  }
  if (level === "C2") {
    return {
      summary: `${metaName("en")} C2 ${unitPlural} — the mastery tier covering the rarest academic, literary, and specialist vocabulary.`,
      about:
        "C2 is the mastery tier of CEFR. At C2 you can understand with ease virtually everything heard or read, summarise information from different spoken and written sources, reconstruct arguments and accounts in a coherent presentation, and express yourself spontaneously, very fluently, and precisely, differentiating finer shades of meaning even in more complex situations. C2 is the level of an educated native speaker.",
      howTo:
        "C2 is a long-term pursuit — most learners spend years refining C1 to C2. Continue reviewing everything below (5-minute daily) and add C2 vocabulary through immersion: read literature, watch films, listen to lectures, and engage with native English speakers in professional and academic settings. By the end of C2 you should be able to use English at the level of an educated native speaker.",
    };
  }

  // Fallback (e.g. unknown level)
  return {
    summary: `${metaName(slug)} ${level} ${unitPlural} — a curated subset of the ${metaName(slug)} vocabulary library at the ${level} proficiency tier.`,
    about: `The ${level} tier in ${metaName(slug)} covers a curated set of ${unitPlural} organised by frequency and difficulty. Every entry includes a real example sentence from the Tatoeba corpus and is reviewed with spaced repetition so you retain more in less time.`,
    howTo: `Review the ${level} ${unitPlural} with spaced repetition — the 10-minute daily loop is enough to keep your recall above 90% across reviews. Pair the deck with a basic ${metaName(slug)} grammar primer so you can start producing your own sentences from day one.`,
  };
}

function metaName(slug: LearnLangSlug): string {
  return LEARN_LANG_META[slug].englishName;
}
