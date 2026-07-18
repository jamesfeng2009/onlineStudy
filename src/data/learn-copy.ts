/**
 * Editorial copy for the /languages/* pages — English source of truth.
 *
 * This module is NOT imported by any page at runtime. It is the
 * hand-written editorial source that scripts/extract-learn-copy.ts
 * serialises into src/locales/en/learn.json (the "learn" i18n
 * namespace). Pages render the copy via react-i18next t("learn:..."),
 * so every UI locale can override it; missing locales fall back to en.
 *
 * Workflow when editing copy:
 *   1. Edit the strings in this file (or scenarios.ts for scenario copy).
 *   2. Run `pnpm exec tsx scripts/extract-learn-copy.ts` to regenerate
 *      src/locales/en/learn.json.
 *   3. Re-translate the changed keys in the other 9 locales.
 *
 * Placeholders: {{lang}} (localised language display name), {{unit}} /
 * {{unitPlural}} (localised "word/words/sentence/sentences"). These are
 * resolved by i18next interpolation at render time.
 */
import { cefrEquivalent } from "../lib/level-utils";
import type { LearnLangSlug } from "./learn-content";

// ---------------------------------------------------------------------------
// /languages directory cards — one short pitch per target language.
// ---------------------------------------------------------------------------
export const DESCRIPTIONS: Record<LearnLangSlug, string> = {
  en: "A1–C2 vocabulary across every CEFR level with real example sentences from the Tatoeba corpus.",
  ja: "Master N5–N1 vocabulary with spaced repetition and shadowing drills for the natural pace of native speech.",
  zh: "HSK 1–4 vocabulary with tone-trained audio and pinyin shown on every character.",
  ko: "Practical sentence pairs from native Korean speakers, with new vocabulary added weekly.",
  es: "Practical sentence pairs from native Spanish speakers, with vocabulary organised by frequency.",
  fr: "Practical sentence pairs from native French speakers, with vocabulary organised by frequency.",
  de: "Practical sentence pairs from native German speakers, with vocabulary organised by frequency.",
  it: "Practical sentence pairs from native Italian speakers, covering daily life, travel, and food.",
  th: "Practical sentence pairs in Thai script, covering greetings, shopping, and daily life in Thailand.",
  yue: "Practical Cantonese sentence pairs in traditional characters, covering food, travel, and daily life in Hong Kong.",
  ms: "Practical sentence pairs from native Malay speakers, covering daily life, travel, and food across Malaysia, Singapore, and Brunei.",
  id: "Practical sentence pairs from native Indonesian speakers, covering daily life, travel, and business across the Indonesian archipelago.",
  vi: "Practical sentence pairs in chữ Quốc ngữ with full diacritics, covering greetings, food, and travel across Vietnam's three regions.",
};

// ---------------------------------------------------------------------------
// /languages/:langSlug overview — hand-written per-language copy.
// ---------------------------------------------------------------------------
export interface LangPageCopy {
  title: string;
  lead: string;
  whoFor: string;
  method: string;
  faq: { q: string; a: string }[];
}

export const LANG_PAGE_COPY: Record<LearnLangSlug, LangPageCopy> = {
  ja: {
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
  },
  zh: {
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
  },
  ko: {
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
  },
  es: {
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
  },
  fr: {
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
  },
  de: {
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
  },
  it: {
    title: "Learn Italian online — sentence-pair drills from native speakers",
    lead:
      "Learn Italian on LangOria with practical sentence pairs from native speakers, spaced repetition scheduling, and audio shadowing for the natural melody of Italian.",
    whoFor:
      "Italian is the language of art, music, food, and design — spoken by 85 million people worldwide and the key to experiencing Italy beyond the tourist surface. Whether you are planning a trip to Rome, learning for heritage reasons, or drawn to Italian cinema and cuisine, LangOria's Italian course gives you the sentence patterns native speakers actually use in everyday conversation.",
    method:
      "We start with 50 hand-curated sentence pairs covering greetings, travel, food, and daily life, then layer in new vocabulary each week. Spaced repetition keeps recall above 90% across reviews, and audio shadowing trains you to match the musical intonation that makes Italian one of the most pleasant languages to listen to.",
    faq: [
      {
        q: "How long does it take to reach conversational Italian on LangOria?",
        a: "Most beginners reach A2 (basic travel Italian) after about 2-3 months of consistent 10-minute daily practice. B1 (conversational Italian) typically takes 5-7 months. Italian is one of the easier languages for English speakers due to shared Latin vocabulary.",
      },
      {
        q: "Which Italian dialect does LangOria teach?",
        a: "LangOria teaches Standard Italian, the official language used in education, media, and business throughout Italy. All sentence pairs are in standard Italian, which is understood everywhere from Milan to Palermo.",
      },
      {
        q: "Do I need to learn Italian grammar rules first?",
        a: "LangOria's sentence-pair approach teaches grammar in context — you absorb verb conjugations and gendered articles naturally through exposure. For deeper grammar study, pair LangOria with a basic Italian grammar reference.",
      },
      {
        q: "Is Italian useful outside of Italy?",
        a: "Yes — Italian is an official language in Switzerland, San Marino, and Vatican City, and has significant speaker communities in Argentina, the US, and Canada. It is also the language of opera, classical music terminology, and culinary arts worldwide.",
      },
    ],
  },
  th: {
    title: "Learn Thai online — sentence-pair drills with Thai script and romanization",
    lead:
      "Learn Thai on LangOria with practical sentence pairs in Thai script, romanization for every sentence, and audio shadowing for the five tones of Thai.",
    whoFor:
      "Thai is the gateway to Southeast Asia — spoken by 60 million people in Thailand and understood across the region. Whether you are traveling to Bangkok, retiring in Chiang Mai, doing business in Thailand, or connecting with Thai family, LangOria's Thai course gives you the sentence patterns that matter in real Thai conversation, with romanization so you can start speaking before you master the script.",
    method:
      "We start with 50 hand-curated sentence pairs covering greetings, shopping, food, and travel — each with Thai script and romanization so you can read and pronounce every sentence from day one. Spaced repetition keeps recall above 90%, and audio shadowing trains your ear to the five tones that distinguish meaning in Thai.",
    faq: [
      {
        q: "How long does it take to reach conversational Thai on LangOria?",
        a: "Most beginners reach A2 (basic travel Thai) after about 3-4 months of consistent 10-minute daily practice. Thai tones take extra practice — expect 6+ months for comfortable B1 conversation.",
      },
      {
        q: "Do I need to learn Thai script?",
        a: "LangOria shows both Thai script and romanization for every sentence, so you can start learning immediately without mastering the alphabet. However, learning Thai script (about 44 consonants and 32 vowels) will significantly improve your reading ability and is recommended after the first month.",
      },
      {
        q: "Are Thai tones really that important?",
        a: "Yes — Thai has five tones (mid, low, falling, high, rising) that change word meaning. For example, 'mai' can mean 'new', 'no', 'silk', 'burn', or 'wood' depending on the tone. LangOria's audio shadowing drills train your ear to distinguish tones naturally.",
      },
      {
        q: "Which Thai does LangOria teach — formal or casual?",
        a: "LangOria teaches Central Thai, the standard dialect used in Bangkok, media, and education. Sentence pairs include polite particles (khrap/kha) so you can adjust register naturally. The vocabulary is understood across all Thai dialects.",
      },
    ],
  },
  yue: {
    title: "Learn Cantonese online — sentence-pair drills with Jyutping romanization",
    lead:
      "Learn Cantonese on LangOria with practical sentence pairs in traditional Chinese characters, Jyutping romanization for every sentence, and audio shadowing for the nine tones of Cantonese.",
    whoFor:
      "Cantonese is the language of Hong Kong, Macau, and the global Cantonese diaspora — spoken by 85 million people worldwide. Whether you are doing business in Hong Kong, connecting with family, watching Hong Kong cinema, or exploring the food culture of Guangdong, LangOria's Cantonese course gives you authentic sentence pairs in the language people actually speak on the streets of Hong Kong.",
    method:
      "We start with 50 hand-curated sentence pairs covering greetings, food, travel, and daily life — each in traditional Chinese characters with Jyutping romanization so you can pronounce every sentence correctly from day one. Spaced repetition keeps recall above 90%, and audio shadowing trains your ear to the nine tones that give Cantonese its distinctive musical quality.",
    faq: [
      {
        q: "How long does it take to reach conversational Cantonese on LangOria?",
        a: "Most beginners reach A2 (basic travel Cantonese) after about 3-4 months of consistent 10-minute daily practice. Cantonese tones are challenging — expect 8+ months for comfortable B1 conversation.",
      },
      {
        q: "Is Cantonese the same as Mandarin?",
        a: "No — Cantonese and Mandarin are mutually unintelligible spoken languages that share the same writing system (with traditional vs simplified characters). Cantonese has nine tones (vs Mandarin's four), different vocabulary, and different grammar. If you already speak Mandarin, Cantonese is easier to learn but still requires significant study.",
      },
      {
        q: "Does LangOria teach traditional or simplified characters?",
        a: "LangOria teaches traditional Chinese characters (繁體字), which are used in Hong Kong, Macau, and Taiwan. This is the standard for Cantonese — Hong Kong signage, newspapers, and official documents all use traditional characters.",
      },
      {
        q: "What is Jyutping?",
        a: "Jyutping (粤拼) is the standard romanization system for Cantonese, developed by the Linguistic Society of Hong Kong. It uses numbers to mark tones (1-9) and Latin letters for sounds. LangOria shows Jyutping for every sentence so you can pronounce Cantonese correctly even before you can read the characters.",
      },
    ],
  },
  ms: {
    title: "Learn Malay online — sentence-pair drills for Bahasa Melayu",
    lead:
      "Learn Malay on LangOria with practical sentence pairs from native speakers, spaced repetition scheduling, and audio shadowing for the natural rhythm of Malay.",
    whoFor:
      "Malay (Bahasa Melayu) is the official language of Malaysia, Brunei, and Singapore, and is mutually intelligible with Indonesian — giving it a reach of over 290 million speakers across the Malay world. It uses the Latin alphabet (Rumi), making it one of the most accessible Asian languages for English speakers to start reading from day one. Whether you are traveling in Southeast Asia, doing business in Kuala Lumpur, or connecting with family, LangOria's Malay course gives you authentic sentence pairs in the language people actually speak.",
    method:
      "We start with 50 hand-curated sentence pairs covering greetings, food, travel, and daily life. Spaced repetition keeps recall above 90%, and audio shadowing trains your ear to Malay's relatively flat intonation compared to other tonal Southeast Asian languages. The 10-minute daily loop fits into any morning routine.",
    faq: [
      {
        q: "Is Malay hard to learn?",
        a: "Malay is one of the easiest Asian languages for English speakers. It uses the Latin alphabet, has no tonal system, and has relatively simple grammar with no verb conjugations or gendered nouns. Most learners reach A2 conversational level in 2-3 months of consistent daily practice.",
      },
      {
        q: "Are Malay and Indonesian the same language?",
        a: "Malay and Indonesian (Bahasa Indonesia) are mutually intelligible — they share the same linguistic roots and most vocabulary. The differences are mainly in vocabulary choices, pronunciation, and some formal registers. If you learn Malay, you can communicate with Indonesian speakers and vice versa, though LangOria offers separate courses for each.",
      },
      {
        q: "Which Malay does LangOria teach?",
        a: "LangOria teaches standard Malay (Bahasa Melayu) as used in Malaysia, with content intelligible across Singapore and Brunei. The vocabulary is largely shared with Indonesian, so it also serves as a foundation for communicating across the Malay archipelago.",
      },
      {
        q: "Do I need to learn Jawi script?",
        a: "No — LangOria uses Rumi (the Latin alphabet), which is the standard writing system for Malay in Malaysia, Singapore, and Brunei. Jawi (Arabic-based script) is used in some religious and traditional contexts but is not required for everyday communication.",
      },
    ],
  },
  id: {
    title: "Learn Indonesian online — sentence-pair drills for Bahasa Indonesia",
    lead:
      "Learn Indonesian on LangOria with practical sentence pairs from native speakers, spaced repetition scheduling, and audio shadowing for the natural rhythm of Indonesian.",
    whoFor:
      "Indonesian (Bahasa Indonesia) is the official language of Indonesia, the world's fourth-most populous country with 270+ million people. It uses the Latin alphabet and has remarkably simple grammar — no tenses, no gender, no tonal system — making it one of the easiest Asian languages for English speakers to learn. Whether you are traveling to Bali, doing business in Jakarta, or connecting with family across the archipelago, LangOria's Indonesian course gives you authentic sentence pairs in the language people actually speak.",
    method:
      "We start with 50 hand-curated sentence pairs covering greetings, food, travel, and daily life. Spaced repetition keeps recall above 90%, and audio shadowing trains your ear to Indonesian's natural rhythm. The 10-minute daily loop fits into any morning routine.",
    faq: [
      {
        q: "Is Indonesian easy to learn?",
        a: "Indonesian is widely considered one of the easiest languages for English speakers. It uses the Latin alphabet, has no tonal system, no verb conjugations, no gendered nouns, and no complex tense systems. Most learners reach A2 conversational level in 2-3 months of consistent daily practice.",
      },
      {
        q: "Are Indonesian and Malay the same?",
        a: "Indonesian and Malay are mutually intelligible — they share the same linguistic roots. The differences are mainly in vocabulary choices (Indonesian uses 'Anda' for formal 'you', Malay uses 'awak' or 'kamu'), some Dutch vs English/Arabic loanwords, and pronunciation. LangOria offers separate courses for each to reflect these differences.",
      },
      {
        q: "Which Indonesian does LangOria teach?",
        a: "LangOria teaches standard Indonesian (Bahasa Indonesia) as used in Jakarta and understood across the archipelago. The vocabulary is intelligible from Sumatra to Papua, and the sentence pairs reflect how Indonesians actually speak in daily life.",
      },
      {
        q: "Do I need to learn formal or casual Indonesian?",
        a: "LangOria teaches both registers. Formal Indonesian (bahasa baku) is used in news, official documents, and education; casual Indonesian (bahasa gaul) is what people speak on the street. Our sentence pairs include both so you can navigate formal and informal situations.",
      },
    ],
  },
  vi: {
    title: "Learn Vietnamese online — sentence-pair drills with six tones",
    lead:
      "Learn Vietnamese on LangOria with practical sentence pairs in chữ Quốc ngữ, spaced repetition scheduling, and audio shadowing for the six tones of Vietnamese.",
    whoFor:
      "Vietnamese is the official language of Vietnam, spoken by 95+ million people in Vietnam and a global diaspora of 4+ million. It uses the Latin alphabet (chữ Quốc ngữ) with diacritical tone marks, so you can start reading from day one — but the six tones make pronunciation challenging. Whether you are traveling from Hanoi to Ho Chi Minh City, doing business in Vietnam, or connecting with family, LangOria's Vietnamese course gives you authentic sentence pairs in the language people actually speak.",
    method:
      "We start with 50 hand-curated sentence pairs in chữ Quốc ngữ with full diacritics. Spaced repetition keeps recall above 90%, and audio shadowing trains your ear to distinguish the six tones (ngang, huyền, hỏi, ngã, sắc, nặng) that change word meaning. The 10-minute daily loop fits into any morning routine.",
    faq: [
      {
        q: "Is Vietnamese hard to learn?",
        a: "Vietnamese is moderately challenging for English speakers. The Latin alphabet makes reading accessible, and grammar is relatively simple (no conjugations, no gender). The main challenge is the six tones — but with consistent audio shadowing practice, most learners reach A2 in 3-4 months.",
      },
      {
        q: "Which Vietnamese dialect does LangOria teach?",
        a: "LangOria teaches standard Vietnamese as used in Hanoi (northern dialect), which is the reference for media and education. The vocabulary is intelligible across Vietnam's three regions (north, central, south), with regional differences mainly in pronunciation and some vocabulary.",
      },
      {
        q: "What are the six tones of Vietnamese?",
        a: "Vietnamese has six tones: ngang (level), huyền (falling), hỏi ( dipping-rising), ngã (rising glottalized), sắc (rising), and nặng (falling glottalized). Each tone changes the meaning of a word — 'ma' means ghost, mother, rice seedling, tomb, horse, or code depending on the tone. LangOria's audio shadowing trains your ear to distinguish them.",
      },
      {
        q: "Why does Vietnamese use the Latin alphabet?",
        a: "Vietnamese uses chữ Quốc ngữ (national script), a Latin-based writing system developed by Portuguese and French missionaries in the 17th century. It replaced Chữ Nôm (Chinese-based characters) in the early 20th century and is now the universal writing system for Vietnamese. The tone marks are diacritics added to the Latin letters.",
      },
    ],
  },
  en: {
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
  },
};

// ---------------------------------------------------------------------------
// /languages/:langSlug/vocabulary overview — one long paragraph per language.
// ---------------------------------------------------------------------------
export const VOCAB_OVERVIEW_COPY: Record<LearnLangSlug, string> = {
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

// ---------------------------------------------------------------------------
// /languages/:langSlug/vocabulary/:levelSlug — per-level copy templates.
// {{lang}} / {{unit}} / {{unitPlural}} are interpolated at render time.
// ---------------------------------------------------------------------------
export interface LevelCopyTemplate {
  summary: string;
  about: string;
  howTo: string;
}

export const LEVEL_COPY_TEMPLATES: Record<string, LevelCopyTemplate> = {
  // Generic CEFR A-level copy used by all languages (CEFR shared).
  A1: {
    summary:
      "{{lang}} A1 {{unitPlural}} — the survival-vocabulary tier covering greetings, directions, numbers, food, family, and the most common 500 {{unitPlural}} you need to get by in everyday situations.",
    about:
      "A1 is the entry-level tier in CEFR — the Common European Framework of Reference for Languages. At A1 you can introduce yourself, ask and answer simple questions about personal details, and hold a basic conversation provided the other person speaks slowly and clearly. The {{unitPlural}} at A1 are the high-frequency {{unitPlural}} that show up in the overwhelming majority of everyday speech: greetings, numbers, family, food, weather, directions, time. Mastering A1 {{unitPlural}} is the foundation of {{lang}} fluency — every later level is built on these {{unitPlural}}.",
    howTo:
      "Spend your first 4-6 weeks on A1 {{unitPlural}}. The 10-minute daily loop is enough — review the A1 deck with spaced repetition until your recall rate is above 90%, then start adding A2 {{unitPlural}} one batch per week. Pair the deck with a basic grammar primer for {{lang}} verb forms (or sentence-final particles, for languages like Korean and Japanese) so you can start producing your own sentences from day one.",
  },
  A2: {
    summary:
      "{{lang}} A2 {{unitPlural}} — the everyday-conversation tier covering shopping, travel, work routines, and the {{unitPlural}} you need to describe your day, your family, and your plans.",
    about:
      "A2 is the elementary tier in CEFR. At A2 you can handle most everyday interactions — ordering food, asking for directions, booking a hotel, describing your job and your weekend — and you can express yourself in simple connected sentences. The {{unitPlural}} at A2 expand on the A1 foundation: common verbs, daily routines, clothing, transport, the home. A2 is the practical fluency tier: if you finish A2, you can survive comfortably in a {{lang}}-speaking country.",
    howTo:
      "A2 takes about 6-8 weeks on top of A1. Continue spaced-repetition review of the A1 deck (your recall should now be automatic) and add 30-50 new A2 {{unitPlural}} per week. Start reading simple {{lang}} texts — children's books, news headlines, restaurant menus — and listening to slow podcasts. By the end of A2 you should be able to follow a basic {{lang}} conversation at natural speed.",
  },
  B1: {
    summary:
      "{{lang}} B1 {{unitPlural}} — the working-language tier covering opinions, experiences, abstract topics, and the {{unitPlural}} you need to express yourself in most professional and travel situations.",
    about:
      "B1 is the intermediate tier in CEFR. At B1 you can deal with most situations likely to arise while travelling, enter unprepared into conversation on familiar topics, and produce simple connected text on subjects within your field. The {{unitPlural}} at B1 start to include abstract and opinion words — you can describe experiences, express hopes and plans, and give reasons for your opinions. B1 is the level most employers mean when they ask for \"conversational {{lang}}\".",
    howTo:
      "B1 takes 3-6 months on top of A2. Continue spaced-repetition review of A1 and A2 (now 5-minute daily), and add 50-100 new B1 {{unitPlural}} per week. Start consuming native {{lang}} content — TV shows with subtitles, podcasts at natural speed, news articles — and try writing short pieces (200-500 words) and getting them corrected by a tutor or language partner. By the end of B1 you should be able to hold your own in a debate about a familiar topic.",
  },
  B2: {
    summary:
      "{{lang}} B2 {{unitPlural}} — the upper-intermediate tier covering nuanced opinions, abstract topics, and professional vocabulary.",
    about:
      "B2 is the upper-intermediate tier of CEFR. At B2 you can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible, produce clear detailed text on a wide range of subjects, and explain a viewpoint on a topical issue. B2 is the level most universities and employers mean when they ask for 'fluent {{lang}}'.",
    howTo:
      "B2 takes 3-6 months on top of B1. Continue reviewing A1-B1 (5-minute daily) and add 50-100 new B2 {{unitPlural}} per week. Read {{lang}} news and long-form journalism, listen to {{lang}} podcasts at natural speed, and try writing 500-1000 word essays for correction. By the end of B2 you should be able to debate any familiar topic in {{lang}} and read most non-technical {{lang}} text without a dictionary.",
  },
  C1: {
    summary:
      "{{lang}} C1 {{unitPlural}} — the advanced tier covering academic, professional, and literary vocabulary.",
    about:
      "C1 is the advanced tier of CEFR. At C1 you can express yourself fluently and spontaneously without much obvious searching for expressions, use language flexibly and effectively for social, academic, and professional purposes, and produce clear, well-structured, detailed text on complex subjects. C1 is the level required by most top-tier universities and professional roles.",
    howTo:
      "C1 takes 6-12 months on top of B2. Continue reviewing A1-B2 (5-minute daily) and add 50-100 new C1 {{unitPlural}} per week. Read {{lang}} literature, academic papers, and long-form journalism; listen to {{lang}} lectures and documentaries; and try writing 1000-2000 word essays on complex topics. By the end of C1 you should be able to read any {{lang}} text (including academic papers) and express yourself with near-native precision.",
  },
  C2: {
    summary:
      "{{lang}} C2 {{unitPlural}} — the mastery tier covering the rarest academic, literary, and specialist vocabulary.",
    about:
      "C2 is the mastery tier of CEFR. At C2 you can understand with ease virtually everything heard or read, summarise information from different spoken and written sources, reconstruct arguments and accounts in a coherent presentation, and express yourself spontaneously, very fluently, and precisely, differentiating finer shades of meaning even in more complex situations. C2 is the level of an educated native speaker.",
    howTo:
      "C2 is a long-term pursuit — most learners spend years refining C1 to C2. Continue reviewing everything below (5-minute daily) and add C2 vocabulary through immersion: read literature, watch films, listen to lectures, and engage with native {{lang}} speakers in professional and academic settings. By the end of C2 you should be able to use {{lang}} at the level of an educated native speaker.",
  },

  // JLPT copy (Japanese)
  N5: {
    summary:
      "{{lang}} N5 {{unitPlural}} — the foundation of Japanese, covering the 800 most common {{unitPlural}} and 100 basic kanji. N5 is the right starting point for most beginners.",
    about:
      "N5 is the entry-level tier of the Japanese Language Proficiency Test (JLPT) — the certification Japanese learners and employers actually recognise. N5 covers roughly 800 vocabulary words and 100 kanji, which is the minimum needed to read simple sentences, introduce yourself, and get by in everyday situations in Japan. Every word in LangOria's N5 deck is paired with kanji readings, an English translation, and a real example sentence from the Tatoeba corpus. Mastering N5 is the foundation for N4, N3, and beyond.",
    howTo:
      "Spend your first 3-4 months on N5. The 10-minute daily loop is enough — review the N5 deck with spaced repetition until your recall rate is above 90%, then start adding N4 vocabulary. Pair the deck with a structured textbook (Genki I or Minna no Nihongo) for grammar depth, and practice writing the kanji by hand at least once per day — handwriting builds character recognition that passive reading cannot. By the end of N5 you should be able to read simple Japanese sentences and hold a basic conversation.",
  },

  // HSK copy (Chinese)
  HSK1: {
    summary:
      "{{lang}} HSK 1 {{unitPlural}} — the 150-word beginner deck covering greetings, numbers, family, and time. HSK 1 is the right starting point for most learners of Mandarin.",
    about:
      "HSK 1 is the beginner tier of the Hanyu Shuiping Kaoshi — the standardised Chinese proficiency test recognised by employers and universities worldwide. HSK 1 covers 150 vocabulary words and the most basic grammar patterns, which is the minimum needed to introduce yourself, order food, and hold a simple conversation in Mandarin. Every entry in LangOria's HSK 1 deck shows simplified characters with pinyin and a real example sentence from the Tatoeba corpus. Mastering HSK 1 is the foundation for HSK 2 and beyond.",
    howTo:
      "Spend your first 4-6 weeks on HSK 1. The 10-minute daily loop is enough — review the HSK 1 deck with spaced repetition until your recall rate is above 90%, then move on to HSK 2. Tone pairs are critical at HSK 1: train them with the audio shadowing drills, not just by memorising tone marks. By the end of HSK 1 you should recognise all 150 words on sight and be able to introduce yourself in Mandarin.",
  },
  HSK2: {
    summary:
      "{{lang}} HSK 2 {{unitPlural}} — the 150-word elementary deck covering shopping, travel, weather, and daily routines.",
    about:
      "HSK 2 builds on HSK 1 with another 150 vocabulary words and slightly more complex grammar — enough to handle shopping, ordering in restaurants, asking for directions, and discussing daily routines. HSK 2 is the practical elementary tier: by the end you can get by in most everyday situations in a Mandarin-speaking environment.",
    howTo:
      "HSK 2 takes about 4-6 weeks on top of HSK 1. Continue reviewing the HSK 1 deck (your recall should be automatic) and add 30-50 new HSK 2 words per week. Start reading simple Chinese texts (children's books, menus, short news articles) and listening to slow Mandarin podcasts. By the end of HSK 2 you should be able to hold a basic conversation in Mandarin on familiar topics.",
  },
  HSK3: {
    summary:
      "{{lang}} HSK 3 {{unitPlural}} — the 300-word intermediate deck covering work, study, opinions, and abstract topics.",
    about:
      "HSK 3 is the intermediate tier — 300 vocabulary words and the grammar needed to express opinions, describe experiences, and discuss abstract topics. HSK 3 is roughly equivalent to B1 in CEFR: by the end you can hold a fluent conversation on most everyday topics, read short Chinese news articles, and write 200-character pieces on familiar subjects.",
    howTo:
      "HSK 3 takes 3-6 months on top of HSK 2. Continue reviewing HSK 1 and HSK 2 (5-minute daily) and add 50-100 new HSK 3 words per week. Start consuming native Chinese content — TV shows with subtitles, podcasts, news articles — and try writing short pieces (200-500 characters) for correction. By the end of HSK 3 you should be able to follow a Chinese conversation at natural speed and express nuanced opinions.",
  },
  HSK4: {
    summary:
      "{{lang}} HSK 4 {{unitPlural}} — the 600-word upper-intermediate deck covering professional, academic, and cultural topics.",
    about:
      "HSK 4 is the upper-intermediate tier — 600 vocabulary words and the grammar needed to read Chinese newspapers, follow Chinese TV shows without subtitles, and discuss professional and cultural topics in Mandarin. HSK 4 is roughly equivalent to B2 in CEFR.",
    howTo:
      "HSK 4 takes 4-6 months on top of HSK 3. Continue reviewing HSK 1-3 (5-minute daily) and add 50-100 new HSK 4 words per week. Read Chinese news daily (BBC Chinese, Sixth Tone, SupChina), watch Chinese TV shows and movies with no subtitles, and try writing 500-1000 character pieces for correction. By the end of HSK 4 you should be able to work in a Mandarin-speaking environment.",
  },

  // Fallback (e.g. unknown level)
  fallback: {
    summary:
      "{{lang}} {{level}} {{unitPlural}} — a curated subset of the {{lang}} vocabulary library at the {{level}} proficiency tier.",
    about:
      "The {{level}} tier in {{lang}} covers a curated set of {{unitPlural}} organised by frequency and difficulty. Every entry includes a real example sentence from the Tatoeba corpus and is reviewed with spaced repetition so you retain more in less time.",
    howTo:
      "Review the {{level}} {{unitPlural}} with spaced repetition — the 10-minute daily loop is enough to keep your recall above 90% across reviews. Pair the deck with a basic {{lang}} grammar primer so you can start producing your own sentences from day one.",
  },
};

/**
 * Resolve which levelCopy template applies to a (language, raw level)
 * pair. Language-specific levels (N5, HSK1-4) win over the generic
 * CEFR copy; everything else normalises through cefrEquivalent.
 */
export function resolveLevelCopyKey(slug: LearnLangSlug, level: string): string {
  if (level in LEVEL_COPY_TEMPLATES && level !== "fallback") {
    // N5 / HSK1-4 — language-specific copy takes priority over the
    // generic CEFR tier it maps to (N5→A1 etc.).
    if (/^(N[1-5]|HSK[1-9])$/.test(level)) return level;
  }
  const eff = cefrEquivalent(slug, level) || level;
  if (eff in LEVEL_COPY_TEMPLATES && eff !== "fallback") return eff;
  return "fallback";
}
