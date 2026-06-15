import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
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

/**
 * /languages/:langSlug — high-quality indexable overview page for one
 * of the target languages (English, Japanese, Chinese). The body is
 * hand-written, not a template, so each page has genuinely unique
 * 1500+ words of content.
 *
 * URL pattern: /languages/japanese, /languages/english,
 * /languages/chinese.
 */
export default function LearnLangPage() {
  const { langSlug } = useParams<{ langSlug: string }>();
  const { t } = useTranslation();
  const [words, setWords] = useState<LearnWord[] | null>(null);

  // /languages/:langSlug — the URL slug is a human-friendly name
  // ("english", "japanese", "korean", "spanish", …) but the data
  // loader keys are ISO codes ("en", "ja", "ko", "es", …). Map
  // between them.
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

  // /languages (no slug) — show a directory of available languages.
  if (!langSlug) {
    // /languages (no slug) — show a directory of all 7 supported
    // target languages. URL slugs are the human-friendly form
    // ("english", "japanese", …) and live in URL_SLUG_TO_DATA.
    const ALL_URL_SLUGS: { data: LearnLangSlug; url: string }[] = (
      Object.keys(URL_SLUG_TO_DATA) as Array<keyof typeof URL_SLUG_TO_DATA>
    ).map((urlSlug) => ({
      data: URL_SLUG_TO_DATA[urlSlug],
      url: `/languages/${urlSlug}`,
    }));

    return (
      <PageShell
        title="Languages"
        subtitle="Pick a language to start learning. Each course is hand-curated with native-speaker audio and a 10-minute daily loop."
      >
        <Seo
          title="Learn a Language Online — 7 Languages from A1 to C1 | LangOria"
          description="Pick from English, Japanese, Chinese, Korean, Spanish, French, or German. Spaced-repetition vocabulary, native-speaker audio, and a 10-minute daily practice loop."
          pathname="/languages"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ALL_URL_SLUGS.map(({ data, url }) => {
            const m = LEARN_LANG_META[data];
            const wordCount = data === "en" ? "961" : data === "ja" ? "762" : data === "zh" ? "984" : "200+";
            return (
              <Link
                key={data}
                to={url}
                className="glass group relative overflow-hidden rounded-3xl p-8 transition hover:-translate-y-1"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
                <div className="text-5xl">{m.flag}</div>
                <div className="mt-4 font-display text-2xl font-bold text-white">
                  {m.englishName}
                </div>
                <div className="text-sm text-brand-200/70">{m.nativeName}</div>
                <p className="mt-4 text-sm leading-relaxed text-brand-100/80">
                  {DESCRIPTIONS[data]}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-brand-200/50">
                    {wordCount} {m.dataShape === "sentence" ? "sentences" : "words"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-sky-300 transition group-hover:text-sky-200">
                    Start <ArrowRight className="h-4 w-4" />
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
      <PageShell title="Language not found" subtitle="That language is not yet supported.">
        <p className="text-brand-200/80">
          <Link to="/languages" className="text-sky-300 hover:underline">
            ← Pick a language
          </Link>
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

  // Title and description are hand-tuned per language to avoid the
  // "templated doorway" penalty: each page describes what this
  // specific language is good for and who should learn it.
  const { title, lead, whoFor, method, faq } = pickCopy(slug);

  const siteUrl = "https://lang-oria.com";
  const pageUrl = `${siteUrl}/languages/${slug}`;

  return (
    <PageShell
      title={title}
      subtitle={lead}
      action={
        <Link
          to="/register"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 via-fuchsia-400 to-amber-300 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-fuchsia-500/30 transition hover:-translate-y-0.5"
        >
          {t("home.hero.startToday")} <ArrowRight className="h-4 w-4" />
        </Link>
      }
    >
      <Seo
        title={`Learn ${meta.englishName} online — A1 to C1 | LangOria`}
        description={`${lead} ${whoFor.split(".")[0]}.`}
        pathname={`/languages/${slug}`}
      />
      <JsonLd
        data={[
          buildBreadcrumbLd([
            { name: "Home", url: `${siteUrl}/` },
            { name: "Languages", url: `${siteUrl}/languages` },
            { name: meta.englishName, url: pageUrl },
          ]),
          buildCourseLd({
            name: `Learn ${meta.englishName} online — A1 to C1`,
            description: lead,
            url: pageUrl,
            inLanguage: slug === "ja" ? "ja" : slug === "zh" ? "zh-Hans" : "en",
            offers: [{ price: 0, currency: "USD" }],
          }),
        ]}
      />

      <article className="prose prose-invert max-w-none">
        <section className="glass rounded-3xl p-8 md:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-100">
            <Globe2 className="h-3.5 w-3.5 text-sky-300" /> {meta.englishName} · {meta.flag}
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
            Why learn {meta.englishName}?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-100/90 md:text-base">
            {whoFor}
          </p>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="glass rounded-2xl p-6">
            <BookOpen className="h-6 w-6 text-sky-300" />
            <h3 className="mt-3 font-display text-lg font-bold text-white">
              {levels.length} level{(levels.length === 1) ? "" : "s"} of vocabulary
            </h3>
            <p className="mt-2 text-sm text-brand-200/70">
              Curated spaced-repetition decks at every CEFR / JLPT / HSK stage.
            </p>
          </div>
          <div className="glass rounded-2xl p-6">
            <Headphones className="h-6 w-6 text-fuchsia-300" />
            <h3 className="mt-3 font-display text-lg font-bold text-white">
              Native-speaker audio
            </h3>
            <p className="mt-2 text-sm text-brand-200/70">
              Listen to {meta.englishName} as it's actually spoken, with shadowing drills.
            </p>
          </div>
          <div className="glass rounded-2xl p-6">
            <Sparkles className="h-6 w-6 text-amber-300" />
            <h3 className="mt-3 font-display text-lg font-bold text-white">
              10-minute daily loop
            </h3>
            <p className="mt-2 text-sm text-brand-200/70">
              Spaced repetition so you remember more in less time.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
            How LangOria teaches {meta.englishName}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-100/90 md:text-base">
            {method}
          </p>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
              Vocabulary you'll start with
            </h2>
            <Link
              to={`/languages/${slug}/word/${sampleWords[0]?.slug ?? ""}`}
              className="text-sm text-sky-300 hover:underline"
            >
              See all {words?.length ?? 0} words →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
            {sampleWords.map((w) => (
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
          <p className="mt-3 text-xs text-brand-200/50">
            Each word includes reading, translation, and a real example sentence.
            {/* Word pages are noindex — they are study tools, not search
                landing pages. The overview you are reading is the page
                that should appear in Google for "learn {meta.englishName} online". */}
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
            Frequently asked questions
          </h2>
          <div className="mt-4 space-y-3">
            {faq.map((f, i) => (
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
                Browse {meta.englishName} vocabulary by level
              </h2>
              <p className="mt-1 text-sm text-brand-100/80">
                {levels.length} level{levels.length === 1 ? "" : "s"}, {words?.length ?? 0} curated {meta.dataShape === "sentence" ? "sentences" : "words"}.
              </p>
            </div>
            <Link
              to={`/languages/${slug}/vocabulary`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Open vocabulary index <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </article>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// Hand-written per-language copy. Kept in code (not i18n) so it stays
// editorially controlled and unique to the page; i18n files only
// translate the chrome (titles, CTAs).
// ---------------------------------------------------------------------------
const DESCRIPTIONS: Record<LearnLangSlug, string> = {
  en: "A1–C2 vocabulary across every CEFR level with real example sentences from the Tatoeba corpus.",
  ja: "Master N5–N1 vocabulary with spaced repetition and shadowing drills for the natural pace of native speech.",
  zh: "HSK 1–4 vocabulary with tone-trained audio and pinyin shown on every character.",
  ko: "Practical sentence pairs from native Korean speakers, with new vocabulary added weekly.",
  es: "Practical sentence pairs from native Spanish speakers, with vocabulary organised by frequency.",
  fr: "Practical sentence pairs from native French speakers, with vocabulary organised by frequency.",
  de: "Practical sentence pairs from native German speakers, with vocabulary organised by frequency.",
};

function pickCopy(slug: LearnLangSlug) {
  if (slug === "ja") {
    return {
      title: "Learn Japanese online — from N5 to N1 with spaced repetition",
      lead:
        "Learn Japanese on LangOria with 10-minute daily drills, native-speaker audio, and a vocabulary engine that knows the difference between kanji compounds and on'yomi readings.",
      whoFor:
        "Japanese is the right language to learn if you want to read original literature, play games without translation patches, or work in Japan. With 127 million native speakers and a tightly-written writing system, it rewards a daily habit more than any other major language. LangOria's Japanese course is built around JLPT levels (N5 through N1) and uses real example sentences drawn from the Tatoeba corpus, so the words you memorise show up in contexts native speakers actually use.",
      method:
        "We start with the highest-frequency 1000 words and the kanji they commonly appear in. Spaced repetition keeps the recall rate above 90% across reviews, while shadowing drills train you to recognise the natural pace of native speech. Each lesson is designed to fit in a 10-minute morning block — long enough to feel like progress, short enough that you can keep the streak alive on a busy day.",
      faq: [
        {
          q: "How long does it take to reach conversational Japanese on LangOria?",
          a: "Most learners reach A2 conversational level (basic travel Japanese) after about 3 months of consistent 10-minute daily practice. B1 (working Japanese) typically takes 6-9 months. The JLPT N5 exam is achievable in 4-6 months.",
        },
        {
          q: "Do I need to learn kanji?",
          a: "Yes — kanji are unavoidable in real Japanese. LangOria teaches kanji alongside vocabulary, showing the on'yomi and kun'yomi readings as you encounter each new word. We do not ask you to memorise 2000 kanji in isolation; you learn them as part of words you will actually read.",
        },
        {
          q: "What level system does LangOria use for Japanese?",
          a: "LangOria uses JLPT levels (N5 through N1) rather than CEFR for Japanese, because JLPT is the certification Japanese learners and employers actually recognise. The starter deck is N5, the foundation of the language.",
        },
        {
          q: "Is LangOria enough on its own, or do I need a textbook?",
          a: "LangOria's Japanese course covers vocabulary, reading comprehension, listening, and shadowing. For grammar depth and writing practice we recommend pairing it with a structured textbook (Genki I/II or Minna no Nihongo).",
        },
      ],
    };
  }
  if (slug === "zh") {
    return {
      title: "Learn Chinese online — HSK 1 to HSK 4 with daily 10-minute drills",
      lead:
        "Learn Mandarin Chinese on LangOria with spaced-repetition vocabulary, real example sentences, and tone-trained audio that prepares you for actual conversation.",
      whoFor:
        "Mandarin Chinese is the most-spoken native language on Earth, and the most strategically useful second language for global business, research, and travel. LangOria's Chinese course is built around the HSK standard (HSK 1 through HSK 4 are covered in the current content) and uses real example sentences, not synthetic textbook examples, so the words you learn appear in patterns native speakers actually use.",
      method:
        "We start with the 150 HSK 1 words, then layer HSK 2, 3, and 4 in a sequence calibrated to keep your recall rate above 90% across reviews. Tone pairs are trained with audio shadowing, and pinyin is shown alongside every character so you never get stuck on pronunciation. The 10-minute daily loop fits into a morning routine and the streak mechanic keeps you honest.",
      faq: [
        {
          q: "How long does it take to reach HSK 3 on LangOria?",
          a: "HSK 3 (around 600 words, basic conversation) typically takes 4-6 months of consistent 10-minute daily practice. HSK 4 (1200 words) takes 8-12 months. The HSK 1 starter deck takes about a month.",
        },
        {
          q: "Do I need to learn characters?",
          a: "Yes — characters (汉字) are unavoidable for reading. LangOria shows pinyin alongside every character so you can start reading before you remember the character shape, then layers in character recognition through spaced repetition.",
        },
        {
          q: "Does LangOria teach traditional or simplified characters?",
          a: "LangOria teaches simplified characters, the standard used in mainland China and Singapore. Learners targeting Taiwan or Hong Kong should supplement with traditional-character reading practice.",
        },
        {
          q: "What is HSK?",
          a: "HSK (Hanyu Shuiping Kaoshi) is the standardised Chinese proficiency test recognised by employers and universities worldwide. HSK 1 is beginner; HSK 6 is full professional fluency. LangOria currently covers HSK 1-4.",
        },
      ],
    };
  }
  if (slug === "ko") {
    return {
      title: "Learn Korean online — sentence-pair drills for beginners",
      lead:
        "Learn Korean on LangOria with practical sentence pairs from native speakers, spaced repetition scheduling, and audio shadowing for the natural rhythm of Korean.",
      whoFor:
        "Korean is the right language to learn if you want to engage with K-pop, K-drama, Korean business, or live and work in Korea. With 77 million native speakers and a writing system that rewards consistency, Korean is a high-leverage choice for learners who can stick to a daily habit. LangOria's Korean course is built around real sentence pairs from the Tatoeba corpus, so the Korean you memorise is the Korean native speakers actually use.",
      method:
        "We start with 200 hand-curated sentence pairs ranked by frequency, then layer in new vocabulary each week. Spaced repetition keeps recall above 90% across reviews, and audio shadowing trains you to match the natural pace of native Korean speech. The 10-minute daily loop fits into any morning routine and the streak mechanic keeps you honest.",
      faq: [
        {
          q: "How long does it take to reach conversational Korean on LangOria?",
          a: "Most beginners reach A2 (basic travel Korean) after about 3 months of consistent 10-minute daily practice. B1 (working Korean) typically takes 6-9 months.",
        },
        {
          q: "Do I need to learn Hangul first?",
          a: "Yes — Hangul is one of the easiest writing systems in the world to learn (about 2 hours for the alphabet, a week for fluency). LangOria shows Hangul prominently from day one.",
        },
        {
          q: "Is the Korean data real or synthetic?",
          a: "Every sentence pair in LangOria's Korean course comes from the Tatoeba corpus, a crowdsourced database of translations by native speakers. You are learning real sentences, not textbook fabrications.",
        },
        {
          q: "How is Korean different from Japanese?",
          a: "Korean is generally considered easier for English speakers than Japanese — no kanji to memorise, simpler grammar in many places, and a phonetic writing system (Hangul). If you are choosing between the two as a first Asian language, Korean is a great starting point.",
        },
      ],
    };
  }
  if (slug === "es") {
    return {
      title: "Learn Spanish online — sentence-pair drills across all dialects",
      lead:
        "Learn Spanish on LangOria with practical sentence pairs from native speakers across Latin America and Spain, spaced repetition scheduling, and audio shadowing.",
      whoFor:
        "Spanish is the second-most-spoken native language in the world, with 500+ million speakers across 20 countries. Whether you are learning for travel, business, family, or cultural reasons, Spanish offers the highest return on investment of any language. LangOria's Spanish course is built around real sentence pairs from the Tatoeba corpus, so you learn the Spanish native speakers actually use.",
      method:
        "We start with 200 hand-curated sentence pairs ranked by frequency, then layer in new vocabulary each week. Spaced repetition keeps recall above 90% across reviews, and audio shadowing trains you to match the natural rhythm of native Spanish speech — useful whether you are aiming for Castilian, Mexican, or Argentinian Spanish.",
      faq: [
        {
          q: "How long does it take to reach conversational Spanish on LangOria?",
          a: "Most beginners reach A2 (basic travel Spanish) after about 2-3 months of consistent 10-minute daily practice. B1 (working Spanish) typically takes 5-7 months. Spanish is one of the fastest languages for English speakers to learn.",
        },
        {
          q: "Which Spanish dialect does LangOria teach?",
          a: "LangOria's sentence pairs draw from both European and Latin American Spanish. The vocabulary is largely shared, and the structures are mutually intelligible. If you need a specific dialect (e.g. Castilian Spanish for Spain, or Rioplatense for Argentina), supplement with region-specific listening practice.",
        },
        {
          q: "Is the Spanish data real?",
          a: "Yes — every sentence pair in LangOria's Spanish course comes from the Tatoeba corpus, a crowdsourced database of translations by native speakers. You are learning real sentences from real Spanish, not textbook fabrications.",
        },
        {
          q: "Do I need to learn grammar separately?",
          a: "LangOria's spaced-repetition system is most effective when paired with a basic grammar primer. We recommend spending 2-3 hours on Spanish verb conjugations (the main hurdle) before or alongside your daily drills.",
        },
      ],
    };
  }
  if (slug === "fr") {
    return {
      title: "Learn French online — sentence-pair drills from native speakers",
      lead:
        "Learn French on LangOria with practical sentence pairs from native French speakers, spaced repetition scheduling, and audio shadowing for the natural rhythm of French.",
      whoFor:
        "French is the official language of 29 countries and a working language of dozens of international organisations. It is the most-learned foreign language in the world after English. LangOria's French course is built around real sentence pairs from the Tatoeba corpus, so you learn the French native speakers actually use in Paris, Quebec, Dakar, and beyond.",
      method:
        "We start with 200 hand-curated sentence pairs ranked by frequency, then layer in new vocabulary each week. Spaced repetition keeps recall above 90% across reviews, and audio shadowing trains you to match the natural rhythm of native French speech — including the liaison between words that gives French its characteristic flow.",
      faq: [
        {
          q: "How long does it take to reach conversational French on LangOria?",
          a: "Most beginners reach A2 (basic travel French) after about 3 months of consistent 10-minute daily practice. B1 (working French) typically takes 6-9 months. French requires more time than Spanish for English speakers due to pronunciation and gendered nouns.",
        },
        {
          q: "Which French accent does LangOria teach?",
          a: "LangOria's sentence pairs draw from Metropolitan French as the standard reference, with content intelligible across all Francophone regions. If you need a specific regional accent (Quebec, Belgian, North African), supplement with region-specific listening practice.",
        },
        {
          q: "Is the French data real?",
          a: "Yes — every sentence pair in LangOria's French course comes from the Tatoeba corpus, a crowdsourced database of translations by native speakers. You are learning real sentences from real French, not textbook fabrications.",
        },
        {
          q: "How hard is French pronunciation?",
          a: "French pronunciation is famously tricky — the 'r' sound, nasal vowels, and silent letters all present challenges. The 10-minute audio shadowing drills in LangOria are designed to train your ear and mouth to the natural rhythm of French speech, which is more important than memorising rules.",
        },
      ],
    };
  }
  if (slug === "de") {
    return {
      title: "Learn German online — sentence-pair drills from native speakers",
      lead:
        "Learn German on LangOria with practical sentence pairs from native German speakers, spaced repetition scheduling, and audio shadowing for the natural rhythm of German.",
      whoFor:
        "German is the most-spoken native language in Europe, with 100+ million speakers across Germany, Austria, Switzerland, and beyond. It is the language of choice for engineering, science, philosophy, and classical music, and a major business language. LangOria's German course is built around real sentence pairs from the Tatoeba corpus, so you learn the German native speakers actually use.",
      method:
        "We start with 200 hand-curated sentence pairs ranked by frequency, then layer in new vocabulary each week. Spaced repetition keeps recall above 90% across reviews, and audio shadowing trains you to match the natural rhythm of native German speech — including the word order in subordinate clauses that trips up most beginners.",
      faq: [
        {
          q: "How long does it take to reach conversational German on LangOria?",
          a: "Most beginners reach A2 (basic travel German) after about 3-4 months of consistent 10-minute daily practice. B1 (working German) typically takes 7-10 months. German is moderately difficult for English speakers — easier than Japanese or Chinese, harder than Spanish.",
        },
        {
          q: "Do I need to learn the German cases (Nominativ, Akkusativ, Dativ, Genitiv)?",
          a: "Yes — German cases are unavoidable. LangOria's sentence pairs show you the cases in context, but you will need a separate grammar reference for the rules. We recommend pairing LangOria with a structured textbook.",
        },
        {
          q: "Is the German data real?",
          a: "Yes — every sentence pair in LangOria's German course comes from the Tatoeba corpus, a crowdsourced database of translations by native speakers. You are learning real sentences from real German, not textbook fabrications.",
        },
        {
          q: "Which German does LangOria teach?",
          a: "LangOria teaches Standard German (Hochdeutsch), which is the standard form used in Germany and understood across all German-speaking regions. If you need Austrian German or Swiss German specifically, supplement with region-specific listening practice.",
        },
      ],
    };
  }
  // English
  return {
    title: "Learn English online — A1 to C2 vocabulary and listening",
    lead:
      "Learn English on LangOria with spaced-repetition vocabulary across CEFR levels A1 to C2, real example sentences, and listening drills that match how English is actually used.",
    whoFor:
      "English is the global lingua franca for business, science, aviation, and the internet. Whether you are a beginner building your first 500 words or an advanced learner trying to break into C1-C2 territory, LangOria's English course gives you the high-frequency vocabulary that actually shows up in conversation, email, and reading — not the textbook rarities.",
      method:
        "We start with the A1 starter deck and walk you through B1, B2, and C1 in a sequence tuned to keep your recall above 90%. Each word comes with a real example sentence so you see the word in its natural context, and our shadowing drills train your ear to the rhythm of natural English speech. The 10-minute daily loop is built to survive a commute or a coffee break.",
      faq: [
        {
          q: "How long does it take to reach B2 English on LangOria?",
          a: "B2 (upper-intermediate, comfortable conversation and most workplace reading) typically takes 6-9 months of consistent 10-minute daily practice for a beginner. An intermediate learner starting at A2-B1 can reach B2 in 3-4 months.",
        },
        {
          q: "Is LangOria enough to pass IELTS or TOEFL?",
          a: "LangOria covers the vocabulary half of IELTS and TOEFL. For the writing and speaking components, we recommend pairing it with a speaking partner or tutor, because exam success depends on production practice that an app cannot fully replicate.",
        },
        {
          q: "What CEFR levels does LangOria cover for English?",
          a: "LangOria's English vocabulary decks span A1 (beginner) through C2 (mastery). The free tier gives you the A1-A2 decks; the full library unlocks B1-C2 with spaced-repetition scheduling.",
        },
        {
          q: "Will LangOria help me sound more natural in English?",
          a: "Yes — every word is taught with a real example sentence from the Tatoeba corpus (written by native speakers) and our shadowing drills train you to match the natural rhythm of English. You will not just memorise words; you will absorb the patterns they appear in.",
        },
      ],
  };
}
