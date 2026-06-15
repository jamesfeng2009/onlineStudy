/**
 * Scenario-based learning content for the 3 word-level target
 * languages: English, Japanese, Chinese.
 *
 * Each language × scenario combination is a single indexable page
 * (3 languages × 4 scenarios = 12 pages). Every page is built from
 * the same template but the copy (intro / culture tip / conversation
 * dialogue / phrase list) is hand-written per (lang, scenario) so
 * Google sees genuinely unique content on every URL, not a
 * templated doorway.
 *
 * The 4 scenarios are the same across all languages:
 *   - travel      Travel & transport (airport, hotel, directions)
 *   - business    Business & meetings (email, agenda, follow-up)
 *   - food        Food & dining (menu, ordering, allergies)
 *   - small-talk  Small talk & introductions (greetings, hobbies)
 *
 * Adding a 4th language (e.g. Korean) means adding one
 * SCENARIOS_KO constant in this file — the page component will
 * pick it up automatically.
 */

export type ScenarioKey = "travel" | "business" | "food" | "small-talk";

export const SCENARIO_KEYS: ScenarioKey[] = [
  "travel",
  "business",
  "food",
  "small-talk",
];

export interface ScenarioMeta {
  key: ScenarioKey;
  /** URL slug (kebab-case). */
  slug: ScenarioKey;
  /** Human-readable English name. */
  name: string;
  /** One-sentence description used in cross-links. */
  blurb: string;
}

export const SCENARIO_META: Record<ScenarioKey, ScenarioMeta> = {
  travel: {
    key: "travel",
    slug: "travel",
    name: "Travel & transport",
    blurb:
      "Phrases you actually use at airports, hotels, train stations, and when asking for directions.",
  },
  business: {
    key: "business",
    slug: "business",
    name: "Business & meetings",
    blurb:
      "Polite, professional phrases for emails, meetings, and follow-ups in a working language.",
  },
  food: {
    key: "food",
    slug: "food",
    name: "Food & dining",
    blurb:
      "Ordering at restaurants, dietary restrictions, paying the bill, and complimenting the chef.",
  },
  "small-talk": {
    key: "small-talk",
    slug: "small-talk",
    name: "Small talk & introductions",
    blurb:
      "Greetings, introductions, hobbies, weather — the everyday phrases that turn strangers into friends.",
  },
};

export interface ScenarioPhrase {
  en: string;
  tgt: string;
  /** Romanization for ja / zh / ko. Empty string for Latin scripts. */
  romanization?: string;
  /** Literal back-translation, useful for ja/zh grammatical structure. */
  literal?: string;
}

export interface ScenarioDialogueTurn {
  speaker: "A" | "B";
  en: string;
  tgt: string;
  romanization?: string;
  /** Literal back-translation, useful for ja/zh grammatical structure. */
  literal?: string;
}

export interface ScenarioContent {
  title: string;
  subtitle: string;
  /** ~200 words on why this scenario matters for this language. */
  intro: string;
  /** ~150 words of culture/etiquette specific to this scenario. */
  culture: string;
  /** ~150 words on how to study the scenario. */
  howTo: string;
  /** 4-turn mini-dialogue. */
  conversation: ScenarioDialogueTurn[];
  /** 10 high-frequency phrases. */
  phrases: ScenarioPhrase[];
}

// ---------------------------------------------------------------------------
// English scenarios. Built last because "Learn English for X" is the
// most competitive SEO market, so the copy has to be sharpest here.
// ---------------------------------------------------------------------------

const SCENARIOS_EN: Record<ScenarioKey, ScenarioContent> = {
  travel: {
    title: "Travel phrases in English — airport, hotel, directions",
    subtitle:
      "The 10 phrases that get you through 95% of any trip to an English-speaking country, with audio and example dialogues.",
    intro:
      "Travel English is the highest-leverage English you will ever learn: the same 50 phrases get you through the airport, the hotel, the taxi, the restaurant, and the front desk of an embassy. Whether you are flying into New York, London, Sydney, or Toronto, the practical English of travel is the same — and mastering it is the difference between a stressful trip and a smooth one. LangOria's travel-phrase deck is built around the 10 sentences you actually need, not the 1000 you might need someday. Each phrase is paired with audio shadowing, an example dialogue, and the culture tip that tells you when it would be rude to use it. Beyond the airport, the same 10 phrases get you through taxi rides, hotel check-ins, train stations, and the small emergencies of being a stranger in a new place — asking for a pharmacy at midnight, finding the right bus platform, or asking a stranger to take your photo at the harbour. If you only learn ten English sentences in your life, these are the ten. The 10-minute daily loop for one week is enough to internalise them — and that single week pays off every trip for the rest of your life.",
    culture:
      "In English-speaking countries, politeness scales with indirectness: a request framed as a question ('Could I have the check, please?') is heard as neutral, while the same request as a statement ('Give me the check.') is heard as rude. Hotel staff and service workers in the UK and US respond well to 'please' and 'thank you' — these two words carry more politeness than in many other languages. Tipping 15-20% at restaurants is expected in the US and Canada; the bill will say 'tip not included' or 'gratuity suggested'. In the UK, service charge is usually included and tipping is optional.",
    howTo:
      "Spend 3-5 days on the travel deck before any trip. Review the 10 phrases with spaced repetition until your recall is automatic, then drill the example dialogue out loud with a partner or a recording. On the trip itself, try to use each phrase at least once in real life — the muscle memory of speaking English to a stranger is built in the moment, not in the app. The 10-minute daily loop is enough; travel English is a finite vocabulary that you can master in a week.",
    conversation: [
      { speaker: "A", en: "Excuse me, where is the airport?", tgt: "Excuse me, where is the airport?", romanization: "" },
      { speaker: "B", en: "The airport? Take the A train south. It's about 40 minutes.", tgt: "The airport? Take the A train south. It's about 40 minutes.", romanization: "" },
      { speaker: "A", en: "Thank you. How much is a ticket?", tgt: "Thank you. How much is a ticket?", romanization: "" },
      { speaker: "B", en: "Two dollars seventy-five. Just tap your card at the turnstile.", tgt: "Two dollars seventy-five. Just tap your card at the turnstile.", romanization: "" },
    ],
    phrases: [
      { en: "Excuse me, where is the airport?", tgt: "Excuse me, where is the airport?" },
      { en: "I have a reservation under the name [X].", tgt: "I have a reservation under the name [X]." },
      { en: "Could I have the check, please?", tgt: "Could I have the check, please?" },
      { en: "How do I get to [place]?", tgt: "How do I get to [place]?" },
      { en: "Is there a train station nearby?", tgt: "Is there a train station nearby?" },
      { en: "I would like to check in.", tgt: "I would like to check in." },
      { en: "What time does the flight leave?", tgt: "What time does the flight leave?" },
      { en: "I'm lost. Can you help me?", tgt: "I'm lost. Can you help me?" },
      { en: "How much is a ticket to [place]?", tgt: "How much is a ticket to [place]?" },
      { en: "Where is the bathroom?", tgt: "Where is the bathroom?" },
    ],
  },
  business: {
    title: "Business English — meetings, emails, follow-ups",
    subtitle:
      "Polite, professional phrases for the modern working day: scheduling, agendas, status updates, and the soft skills that get you promoted.",
    intro:
      "Business English is the difference between being understood at work and being trusted at work. The vocabulary of meetings, emails, and follow-ups is a small, finite set — the same 50 phrases cover 90% of professional communication in English. Whether you are writing a status update, opening a Monday standup, or pushing back on a deadline, the right phrase in the right register is what makes you sound like a peer, not a foreigner. LangOria's business-phrase deck is built around the 10 phrases that come up in every meeting and every email chain, with politeness levels calibrated for the US, UK, and Australian work cultures. What separates professional English from conversational English is not grammar — it is register. The same idea, said with the right formality, is what makes you sound like a peer in a Monday standup, a 1:1 with your manager, or a video call with a global team. Master these 10 phrases and you can walk into any English-language meeting and carry your weight — even if the rest of your English is still mid-B1. The phrases double as templates for the email lines you write the night before.",
    culture:
      "English business culture is direct in the US and the UK — clarity is treated as a virtue, and 'let's table this' is not rude, it is efficient. In Australia, the same directness is wrapped in understatement ('maybe we could look at this again' often means 'no'). Avoid the false friend 'actually' (it does not mean 'currently' in English); use 'currently' instead. Email subject lines should describe the action ('Q3 budget review — your input by Friday' is good; 'quick question' is bad). Meetings are called with agendas; if you call a meeting without one, people will skip it.",
    howTo:
      "Spend 5-7 days on the business deck before your first English-language meeting. Review the 10 phrases with spaced repetition until you can produce them cold, then drill the email templates out loud. In real life, listen for the register your colleagues use and mirror it — if they say 'let's touch base', you say 'let's touch base'; if they say 'let's catch up', you say 'let's catch up'. The 10-minute daily loop plus one real meeting per week is enough to reach professional working English in 3 months.",
    conversation: [
      { speaker: "A", en: "Hi all, thanks for joining. I have a quick agenda for today.", tgt: "Hi all, thanks for joining. I have a quick agenda for today.", romanization: "" },
      { speaker: "B", en: "Sure, go ahead.", tgt: "Sure, go ahead.", romanization: "" },
      { speaker: "A", en: "First, the Q3 launch status. Then, the budget review. Finally, open questions.", tgt: "First, the Q3 launch status. Then, the budget review. Finally, open questions.", romanization: "" },
      { speaker: "B", en: "Sounds good. I'll follow up via email with the agenda and the pre-read.", tgt: "Sounds good. I'll follow up via email with the agenda and the pre-read.", romanization: "" },
    ],
    phrases: [
      { en: "Let's schedule a meeting for next Tuesday.", tgt: "Let's schedule a meeting for next Tuesday." },
      { en: "Could you send me the agenda?", tgt: "Could you send me the agenda?" },
      { en: "I'll follow up via email.", tgt: "I'll follow up via email." },
      { en: "Let's touch base next week.", tgt: "Let's touch base next week." },
      { en: "I'd like to propose a deadline of [X].", tgt: "I'd like to propose a deadline of [X]." },
      { en: "Can we move the meeting to [time]?", tgt: "Can we move the meeting to [time]?" },
      { en: "What's the status on the [project]?", tgt: "What's the status on the [project]?" },
      { en: "I have a question about the contract.", tgt: "I have a question about the contract." },
      { en: "Thank you for your time.", tgt: "Thank you for your time." },
      { en: "Let's circle back on this.", tgt: "Let's circle back on this." },
    ],
  },
  food: {
    title: "Food & restaurant phrases in English",
    subtitle:
      "Ordering food, asking about ingredients, paying the bill, and complimenting the chef — the 10 phrases every traveller needs.",
    intro:
      "Food is the fastest way to feel at home in a new language. The 10 phrases in this deck cover the 95% case: walking into a restaurant, ordering, asking about allergies, paying, and leaving. Whether you are in a diner in New York, a pub in London, or a café in Melbourne, the script is the same — and the politeness register is forgiving: servers in English-speaking countries expect to be asked simple questions and respond well to direct, polite language. LangOria's food-phrase deck is built around the 10 sentences that come up in every meal out, with a culture tip on tipping and a sample dialogue so you can rehearse the whole encounter before you walk in. The same phrases get you from a fast-casual counter to a tasting menu, from a coffee shop to a wine bar, and from the awkward 'is this spicy?' to the warm 'this was amazing, thank you.' Servers in English-speaking countries are trained to flag allergies to the kitchen — say yours clearly, and they will take care of you. Food English is the most rewarding 10 minutes of any language course: you rehearse in the app, you use it for dinner, and the next morning you remember it for life.",
    culture:
      "In the US, tipping 15-20% is standard and the bill will say 'tip not included' or 'gratuity suggested' — you must calculate and add it. In the UK, a 10-12% service charge is often already included; check the fine print on the bill. In Australia, tipping is not expected and the staff wage is set accordingly. If you have a dietary restriction, say it clearly at the start of the order ('I'm allergic to peanuts' or 'I'm a vegetarian') — servers in English-speaking countries are trained to flag allergies to the kitchen. Avoid saying 'I'm a little allergic' — this is heard as a small allergy, not a real one.",
    howTo:
      "Spend 2-3 days on the food deck before any restaurant visit. Drill the dialogue out loud with a partner or a recording; restaurant English is muscle memory, not grammar. On the day, walk in with a clear script: 'Table for [X], please.' → 'Could I see the menu?' → 'I'll have [X], please.' → 'Could I have the check?' → 'Thank you, it was delicious.' The 10-minute daily loop is enough; food English is the most rewarding 10 minutes of any language course.",
    conversation: [
      { speaker: "A", en: "Hi, table for two, please.", tgt: "Hi, table for two, please.", romanization: "" },
      { speaker: "B", en: "Of course. Right this way. Here's the menu.", tgt: "Of course. Right this way. Here's the menu.", romanization: "" },
      { speaker: "A", en: "Thank you. What do you recommend?", tgt: "Thank you. What do you recommend?", romanization: "" },
      { speaker: "B", en: "The fish is excellent today. Are you allergic to anything?", tgt: "The fish is excellent today. Are you allergic to anything?", romanization: "" },
    ],
    phrases: [
      { en: "Could I see the menu, please?", tgt: "Could I see the menu, please?" },
      { en: "What do you recommend?", tgt: "What do you recommend?" },
      { en: "I'm allergic to [X].", tgt: "I'm allergic to [X]." },
      { en: "Could I have the bill, please?", tgt: "Could I have the bill, please?" },
      { en: "Is this dish spicy?", tgt: "Is this dish spicy?" },
      { en: "I'll have [X], please.", tgt: "I'll have [X], please." },
      { en: "Can I get this to go?", tgt: "Can I get this to go?" },
      { en: "Is the tip included?", tgt: "Is the tip included?" },
      { en: "I'm a vegetarian.", tgt: "I'm a vegetarian." },
      { en: "That was delicious, thank you.", tgt: "That was delicious, thank you." },
    ],
  },
  "small-talk": {
    title: "Small talk & introductions in English",
    subtitle:
      "Greetings, hobbies, weather, and the small phrases that turn a stranger into a friend — the social glue of English-speaking countries.",
    intro:
      "Small talk is the front door of English fluency. The 10 phrases in this deck are the ones that come up in every elevator, every coffee line, every conference reception, and every first date: introducing yourself, asking what someone does, talking about the weather, and finding common ground. Whether you are at a networking event in San Francisco, a house party in London, or a waiting room in Toronto, the script is the same — and the politeness register is well-tuned: English small talk is friendly but not intimate, and the 10 phrases here will keep you in the right zone. LangOria's small-talk deck is built around the 10 sentences that make you sound like a peer, not a tourist. The first five minutes of any social encounter — a coffee line, a coworking space, a party, a flight — are run on a predictable script, and the people who know that script are the ones who get asked to stay. Small talk is a habit, not a vocabulary, and the habit transfers across English-speaking countries. Drill the dialogue out loud with a partner or a recording; the trick to small talk is sounding natural, not correct.",
    culture:
      "English small talk follows a predictable pattern: weather (safe), work (allowed but don't pry), hobbies (encouraged), recent media (great), and personal life (do not ask about money, politics, or relationships on first meeting). The question 'What do you do?' is not aggressive in English — it is the standard opener in the US and the UK, even between strangers. In Australia and Canada, the same opener is often wrapped in 'How's it going?' first. Avoid the false friend 'actually' as a discourse marker ('Actually, I'm a doctor' sounds defensive; 'I'm a doctor, actually' sounds defensive too — drop it).",
    howTo:
      "Spend 3-5 days on the small-talk deck. Drill the dialogue out loud with a partner or a recording; the trick to small talk is sounding natural, not correct. The 10-minute daily loop is enough — but use at least one phrase in real life every day, even if it is just 'Nice weather today' to the barista. Small talk is a habit, not a vocabulary, and the habit transfers across English-speaking countries.",
    conversation: [
      { speaker: "A", en: "Hi, my name is Sarah. Nice to meet you.", tgt: "Hi, my name is Sarah. Nice to meet you.", romanization: "" },
      { speaker: "B", en: "Nice to meet you too. I'm David. What do you do?", tgt: "Nice to meet you too. I'm David. What do you do?", romanization: "" },
      { speaker: "A", en: "I'm a software engineer. How about you?", tgt: "I'm a software engineer. How about you?", romanization: "" },
      { speaker: "B", en: "I work in marketing. Have you seen any good movies lately?", tgt: "I work in marketing. Have you seen any good movies lately?", romanization: "" },
    ],
    phrases: [
      { en: "Hi, my name is [X]. Nice to meet you.", tgt: "Hi, my name is [X]. Nice to meet you." },
      { en: "What do you do for a living?", tgt: "What do you do for a living?" },
      { en: "Where are you from?", tgt: "Where are you from?" },
      { en: "What are your hobbies?", tgt: "What are your hobbies?" },
      { en: "Have you seen any good movies lately?", tgt: "Have you seen any good movies lately?" },
      { en: "How was your weekend?", tgt: "How was your weekend?" },
      { en: "Do you have any plans for the weekend?", tgt: "Do you have any plans for the weekend?" },
      { en: "What kind of music do you like?", tgt: "What kind of music do you like?" },
      { en: "It's nice weather today, isn't it?", tgt: "It's nice weather today, isn't it?" },
      { en: "It was lovely talking to you.", tgt: "It was lovely talking to you." },
    ],
  },
};

// ---------------------------------------------------------------------------
// Japanese scenarios. All phrase romanizations are in standard
// Hepburn (with long vowels marked, e.g. "kyū", "ō"). Literal
// back-translations are provided where the structure differs
// significantly from English.
// ---------------------------------------------------------------------------

const SCENARIOS_JA: Record<ScenarioKey, ScenarioContent> = {
  travel: {
    title: "旅行の日本語 — 空港、ホテル、道案内",
    subtitle:
      "空港・ホテル・電車・道案内の 95% をカバーする 10 フレーズと、会話例。",
    intro:
      "旅行日本語は、英語圏を旅行するときに最も投資対効果の高い日本語です。空港、ホテル、レストラン、駅の窓口で使う 50 フレーズを覚えれば、たいていの旅はスムーズにいきます。日本で英語が通じない場所も多いので、「すみません、〇〇はどこですか?」の一言が、旅全体を救います。LangOria の旅行フレーズ集は、実際に必要になる 10 文に絞り込みました。シャドウイング音声、文化メモ、会話例つきで、到着初日から使えます。空港を出た瞬間から同じ 10 文が、駅で道を聞くとき、コンビニで切符を買うとき、居酒屋で注文するときに、繰り返し救ってくれます。深夜の薬局を探すとき、バスの乗り場がわからないとき、神社で写真の撮影をお願いするとき — 10 フレーズを覚えていれば、困ることはほぼありません。旅行日本語の 9 割は、1 週間の 10 分間 × 7 日で身につきます。一生使える日本語の最初の 10 文を、ここで覚えてください。",
    culture:
      "日本では、駅や観光案内所で「すみません」と呼びかけても無視されることがよくあります — 大声では呼ばず、すれ違う人の目を一瞬見て軽く会釈してから声をかけます。ホテルでは、靴を脱ぐ宿が多いので、靴の脱ぎ方に気をつけましょう。電車の優先席では、スマホの電源を切る、マナーモードにする、というのが暗黙のルールです。チップの習慣はなく、駅員・旅館スタッフへの心付けは通常不要です。",
    howTo:
      "出発の 3-5 日前から旅行デッキを始めます。10 フレーズを間隔反復で覚えたら、会話例を発音練習します。当日は、空港で「すみません、〇〇はどこですか?」から始めて、駅で「〇〇行きの切符をください」、ホテルで「チェックインお願いします」の順に使う練習をしましょう。10 分間 × 3 日で、旅行日本語の 9 割は身につきます。",
    conversation: [
      { speaker: "A", en: "Excuse me, where is the airport?", tgt: "すみません、空港はどこですか?", romanization: "Sumimasen, kūkō wa doko desu ka?", literal: "Excuse me, airport is where?" },
      { speaker: "B", en: "Take the JR train south. It's about 40 minutes.", tgt: "JR で南へ行って、約 40 分です。", romanization: "JR de minami e itte, yaku yonjuppun desu." },
      { speaker: "A", en: "Thank you. How much is a ticket?", tgt: "ありがとうございます。切符はいくらですか?", romanization: "Arigatō gozaimasu. Kippu wa ikura desu ka?" },
      { speaker: "B", en: "It's 290 yen. You can use the IC card at the turnstile.", tgt: "290 円です。IC カードで改札を通れます。", romanization: "Nihyaku kyūjū en desu. IC kādo de kaisatsu o tōremasu." },
    ],
    phrases: [
      { en: "Excuse me, where is the airport?", tgt: "すみません、空港はどこですか?", romanization: "Sumimasen, kūkō wa doko desu ka?", literal: "Excuse me, airport is where?" },
      { en: "I have a reservation under the name [X].", tgt: "〇〇 という名前で予約しています。", romanization: "[X] to iu namae de yoyaku shite imasu." },
      { en: "Could I have the check, please?", tgt: "お会計をお願いします。", romanization: "Okaikei o onegai shimasu." },
      { en: "How do I get to [place]?", tgt: "〇〇 へはどうやって行けばいいですか?", romanization: "[place] e wa dō yatte ikeba ii desu ka?" },
      { en: "Is there a train station nearby?", tgt: "近くに駅はありますか?", romanization: "Chikaku ni eki wa arimasu ka?" },
      { en: "I would like to check in.", tgt: "チェックインをお願いします。", romanization: "Chekku in o onegai shimasu." },
      { en: "What time does the flight leave?", tgt: "飛行機は何時に出ますか?", romanization: "Hikōki wa nanji ni demasu ka?" },
      { en: "I'm lost. Can you help me?", tgt: "道に迷ったのですが、助けていただけますか?", romanization: "Michi ni mayotta no desu ga, tasukete itadakemasu ka?" },
      { en: "How much is a ticket to [place]?", tgt: "〇〇 までの切符はいくらですか?", romanization: "[place] made no kippu wa ikura desu ka?" },
      { en: "Where is the bathroom?", tgt: "トイレはどこですか?", romanization: "Toire wa doko desu ka?" },
    ],
  },
  business: {
    title: "ビジネスの日本語 — 会議、メール、フォローアップ",
    subtitle:
      "会議のアジェンダ、メールの書き方、フォローアップのフレーズ集。",
    intro:
      "ビジネス日本語は、英語の「let's touch base」のような決まった言い回しを、日本語なりの丁寧さで言えるかどうかで決まります。会議の設定、議事録の共有、納期交渉、お詫び — これら 50 フレーズを覚えれば、日本の職場で「外国人の新人」ではなく「同僚」として扱われます。LangOria のビジネスフレーズ集は、外資系・日本国内企業どちらでも通じる 10 文を厳選しました。ビジネス日本語と日常会話の違いは、文法ではなく 敬語(けいご, 尊敬語と謙譲語) です。同じ内容でも、敬語のレベルを正しく選べば、会議(かいぎ)で「同僚」、接待で「ゲスト」として扱われます。10 文を覚えれば、英語力が B1 レベルでも、日本語の会議で自分の役割を果たせます。フレーズは、夜に送るメールの一行や、議事録の冒頭としても、そのまま使えます。",
    culture:
      "日本の会議は「根回し」が基本 — 会議の前に、上司と同僚に非公式に相談してから本会議に臨みます。会議中は反対意見でも「それは一つの考え方ですね」と柔らかく表現するのが礼儀。メールの件名は具体的に:「【ご共有】Q3 売上レポートのご確認のお願い」のように、アクションと期日を入れます。名刺交換は、片手で渡すのは失礼 — 両手で、受け取る側も両手で受け取り、すぐに机に置かずに膝の上に置きます。",
    howTo:
      "最初の日本語会議の 1 週間前までに、ビジネスデッキを始めます。10 フレーズを間隔反復で覚えたら、自分の業務に合わせてカスタマイズ:「○○の件、進捗どうですか?」を、自分のプロジェクトの言葉に置き換えて練習します。会議の後は、必ず 24 時間以内にフォローアップメールを日本語で送ること — これが信頼を構築する最速の方法です。",
    conversation: [
      { speaker: "A", en: "Thank you for joining today. I have a brief agenda.", tgt: "本日はお集まりいただき、ありがとうございます。本日のアジェンダは簡単です。", romanization: "Honjitsu wa oatsumari itadaki, arigatō gozaimasu. Honjitsu no ajenda wa kantan desu." },
      { speaker: "B", en: "Sure, please go ahead.", tgt: "はい、どうぞ。", romanization: "Hai, dōzo." },
      { speaker: "A", en: "First, the Q3 launch status. Then, the budget. Finally, open questions.", tgt: "まず Q3 のローンチ状況、次に予算、最後に質疑応答です。", romanization: "Mazu Q3 no rōnchi jōkyō, tsugi ni yosan, saigo ni shitsugi ōtō desu." },
      { speaker: "B", en: "Understood. I'll send the agenda and pre-read via email after this.", tgt: "承知しました。会議後、アジェンダと事前資料をメールでお送りします。", romanization: "Shōchi shimashita. Kaigi-go, ajenda to jizen shiryō o mēru de o-okuri shimasu." },
    ],
    phrases: [
      { en: "Let's schedule a meeting for next Tuesday.", tgt: "来週火曜日に会議を設定しましょう。", romanization: "Raishū kayōbi ni kaigi o settei shimashō." },
      { en: "Could you send me the agenda?", tgt: "アジェンダをお送りいただけますか?", romanization: "Ajenda o o-okuri itadakemasu ka?" },
      { en: "I'll follow up via email.", tgt: "追ってメールでご連絡します。", romanization: "Otte mēru de go-renraku shimasu." },
      { en: "Let's touch base next week.", tgt: "来週もう一度擦り合わせましょう。", romanization: "Raishū mō ichido suriawase mashō." },
      { en: "I'd like to propose a deadline of [X].", tgt: "〇〇 納期を提案させてください。", romanization: "[X] nōkō o teian sasete kudasai." },
      { en: "Can we move the meeting to [time]?", tgt: "会議を [time] に変更できますか?", romanization: "Kaigi o [time] ni henkō dekimasu ka?" },
      { en: "What's the status on the [project]?", tgt: "〇〇 の進捗はいかがでしょうか?", romanization: "[project] no shinchoku wa ikaga deshō ka?" },
      { en: "I have a question about the contract.", tgt: "契約について質問があります。", romanization: "Keiyaku ni tsuite shitsumon ga arimasu." },
      { en: "Thank you for your time.", tgt: "お時間いただき、ありがとうございました。", romanization: "O-jikan itadaki, arigatō gozaimashita." },
      { en: "Let's circle back on this.", tgt: "この件、改めて議論しましょう。", romanization: "Kono ken, aratamete giron shimashō." },
    ],
  },
  food: {
    title: "食事の日本語 — 注文、会計、アレルギー",
    subtitle:
      "レストラン、居酒屋、コンビニで使う 10 フレーズ。",
    intro:
      "食事の日本語は、最も報酬が大きい日本語です。10 フレーズを覚えれば、日本のあらゆる飲食店 — 立ち飲み屋から高級鮨店まで — で困らなくなります。「おすすめは何ですか?」「辛くできますか?」「アレルギーがあります」の 3 フレーズで、食事の 90% は完結します。LangOria の食事フレーズ集は、店に入る瞬間から出て行く瞬間までを一気に通せる 10 文を厳選しました。同じ 10 フレーズが、コンビニ(こんびに) から 高級鮨店(こうきゅう ずし-てん) まで、居酒屋(いざかや) から ラーメン屋(ラーメンや) まで、どこでも通じます。「いただきます」と「ごちそうさまでした」 — この 2 つの言葉が、食事で最も重要な礼儀です。日本の飲食店では、店員が客席に来るまで待つのが礼儀ですが、注文のときは「すみません」と声をかけて OK。10 フレーズを覚えたら、ランチタイムに一人で ラーメン屋 に行き、4 位 / メニュー / おすすめ / 辛く / 买单 の全流程を 30 分で練習するのが最速です。",
    culture:
      "日本のレストランでは、店員が客席に来るまで待つのが普通 — 自分で席に座っても、店員が来るまで注文はせず、飲み物のメニューだけもらいます。注文は「すみません、〇〇 をお願いします」の一言で OK。飲食店で声をかけるときは「すみません」が標準で、店内では「店員さん!」と叫ぶのは避けましょう。食事中は「いただきます」と「ごちそうさま」を忘れない — これら二つの言葉が一番の礼儀です。",
    howTo:
      "食事デッキは 2-3 日で終わります。10 フレーズを覚えたら、コンビニやファストフードで実際に使って練習 — リアル使用が最速の習得法です。居酒屋で「とりあえず、生ビール」と「今日は〇〇 をお願いします」を覚えれば、日本の夜の 9 割はカバーできます。",
    conversation: [
      { speaker: "A", en: "Excuse me, table for two, please.", tgt: "すみません、2 名です。", romanization: "Sumimasen, ni-mei desu." },
      { speaker: "B", en: "Of course. Right this way. Here's the menu.", tgt: "はい、こちらへどうぞ。メニューです。", romanization: "Hai, kochira e dōzo. Menyū desu." },
      { speaker: "A", en: "Thank you. What do you recommend?", tgt: "ありがとうございます。おすすめは何ですか?", romanization: "Arigatō gozaimasu. Osusume wa nan desu ka?" },
      { speaker: "B", en: "The fish is excellent today. Are you allergic to anything?", tgt: "本日のお魚がおすすめです。アレルギーはありますか?", romanization: "Honjitsu no osakana ga osusume desu. Arerugī wa arimasu ka?" },
    ],
    phrases: [
      { en: "Could I see the menu, please?", tgt: "メニューをいただけますか?", romanization: "Menyū o itadakemasu ka?" },
      { en: "What do you recommend?", tgt: "おすすめは何ですか?", romanization: "Osusume wa nan desu ka?" },
      { en: "I'm allergic to [X].", tgt: "〇〇 アレルギーがあります。", romanization: "[X] arerugī ga arimasu." },
      { en: "Could I have the bill, please?", tgt: "お会計をお願いします。", romanization: "Okaikei o onegai shimasu." },
      { en: "Is this dish spicy?", tgt: "これは辛いですか?", romanization: "Kore wa karai desu ka?" },
      { en: "I'll have [X], please.", tgt: "〇〇 をお願いします。", romanization: "[X] o onegai shimasu." },
      { en: "Can I get this to go?", tgt: "持ち帰りにできますか?", romanization: "Mochikaeri ni dekimasu ka?" },
      { en: "Is the tip included?", tgt: "チップは含まれていますか?", romanization: "Chippu wa fukumarete imasu ka?" },
      { en: "I'm a vegetarian.", tgt: "ベジタリアンです。", romanization: "Bejitarian desu." },
      { en: "That was delicious, thank you.", tgt: "ごちそうさまでした、ありがとうございました。", romanization: "Gochisōsama deshita, arigatō gozaimashita." },
    ],
  },
  "small-talk": {
    title: "雑談の日本語 — 挨拶、自己紹介、趣味",
    subtitle:
      "初対面、待ち合わせ、交流会で使う 10 フレーズ。",
    intro:
      "雑談は、日本語の「入口」です。日本の初対面では、名刺交換のあと、必ず「趣味はなんですか?」「休日は何をされていますか?」と軽い話題が続きます。この 10 フレーズを覚えれば、日本の交流会、ホストファミリーとの夕食、会社の同僚との飲み会、すべてに通じます。LangOria の雑談フレーズ集は、日本の礼儀作法を含めた 10 文を厳選しました。日本の初対面 5 分は、交流会(こうりゅうかい) でも 飲み会(のみかい) でも ホストファミリー(ほすとふぁみりー) でも同じスクリプトで進みます。「はじめまして」→「お仕事」→「ご出身」→「ご趣味」 — この 4 ステップが、日本語の雑談の 9 割です。スクリプトを知っている人は、次の食事にも誘われる人。雑談は語彙ではなく習慣で、習慣は毎日の小さな実践で作られます。10 フレーズを覚えたら、自分の情報に置き換えて自己紹介を 5 回書き、録音して発音をチェック。日本人の同僚に「日本語で自己紹介したい」と 10 分間もらえれば、最速の上達ルートです。",
    culture:
      "日本の自己紹介は「〇〇 と申します。〇〇 出身です。〇〇 をしています」の定型 — 名前、出身地、職業の 3 点セットが礼儀です。「よろしくお願いします」は会話の最初に言うのが礼儀で、最後に言うのは不自然。相手が名刺を渡してくれたら、受け取った名刺をすぐ鞄に入れず、会話中はテーブルの上に置いて敬意を示します。",
    howTo:
      "雑談デッキは 3-5 日で習得できます。10 フレーズを覚えたら、自分の情報に置き換えて自己紹介を 5 回書き、録音して発音をチェック。留学先や職場の日本人同僚に「日本語で自己紹介したい」と言って、10 分間雑談する時間をもらいましょう。それが最速の上達法です。",
    conversation: [
      { speaker: "A", en: "Hi, my name is Sarah. Nice to meet you.", tgt: "サラと申します。はじめまして、よろしくお願いします。", romanization: "Sara to mōshimasu. Hajimemashite, yoroshiku onegai shimasu." },
      { speaker: "B", en: "Nice to meet you too. I'm David. What do you do?", tgt: "はじめまして。デイビッドです。お仕事は何ですか?", romanization: "Hajimemashite. Debiddo desu. Oshigoto wa nan desu ka?" },
      { speaker: "A", en: "I'm a software engineer. How about you?", tgt: "ソフトウェアエンジニアです。デイビッドさんは?", romanization: "Sofutouea enjinia desu. Debiddo-san wa?" },
      { speaker: "B", en: "I work in marketing. Do you have any hobbies?", tgt: "マーケティングで働いています。趣味はありますか?", romanization: "Mākettingu de hataraite imasu. Shumi wa arimasu ka?" },
    ],
    phrases: [
      { en: "Hi, my name is [X]. Nice to meet you.", tgt: "〇〇 と申します。はじめまして、よろしくお願いします。", romanization: "[X] to mōshimasu. Hajimemashite, yoroshiku onegai shimasu." },
      { en: "What do you do for a living?", tgt: "お仕事を教えていただけますか?", romanization: "O-shigoto o oshiete itadakemasu ka?" },
      { en: "Where are you from?", tgt: "ご出身はどこですか?", romanization: "Go-shusshin wa doko desu ka?" },
      { en: "What are your hobbies?", tgt: "ご趣味は何ですか?", romanization: "Go-shumi wa nan desu ka?" },
      { en: "Have you seen any good movies lately?", tgt: "最近、いい映画を観ましたか?", romanization: "Saikin, ii eiga o mimashita ka?" },
      { en: "How was your weekend?", tgt: "週末はどのように過ごされましたか?", romanization: "Shūmatsu wa dono yō ni sugosare mashita ka?" },
      { en: "Do you have any plans for the weekend?", tgt: "週末のご予定はありますか?", romanization: "Shūmatsu no go-yotei wa arimasu ka?" },
      { en: "What kind of music do you like?", tgt: "どんな音楽がお好きですか?", romanization: "Donna ongaku ga o-suki desu ka?" },
      { en: "It's nice weather today, isn't it?", tgt: "今日はいい天気ですね。", romanization: "Kyō wa ii tenki desu ne." },
      { en: "It was lovely talking to you.", tgt: "お喋りできて楽しかったです。", romanization: "O-shaberi dekite tanoshikatta desu." },
    ],
  },
};

// ---------------------------------------------------------------------------
// Chinese scenarios. Simplified characters and pinyin.
// ---------------------------------------------------------------------------

const SCENARIOS_ZH: Record<ScenarioKey, ScenarioContent> = {
  travel: {
    title: "旅行中文 — 机场、酒店、问路",
    subtitle:
      "机场、酒店、地铁、问路最常用的 10 句中文,带拼音和场景对话。",
    intro:
      "旅行中文是性价比最高的中文投资。同样 50 个句子,能让你在中国大陆、台湾、香港、新加坡的机场、酒店、餐厅、出租车上畅通无阻。即使你不会说中文,把这 10 句背下来,再加上手机翻译,就已经能应付 95% 的旅行场景。LangOria 的旅行短语集专注于「真正会用到」的 10 句,配有拼音、音频、对话示例,落地第一天就能用。出机场后,这 10 句能帮你打车、问路、办酒店入住、找地铁口、点餐、问洗手间 — 同一组句子覆盖整个行程。深夜找药店、不确定公交在哪一站、想请路人帮忙拍张照 — 10 句学会,旅行中 99% 的困境都能解决。每天 10 分钟、连续 7 天,旅行中文的 9 成就能搞定。值得一辈子反复使用的 10 句中文,从这里开始。",
    culture:
      "在中国,问路最好用「请问」开头 — 直接喊「哎,机场在哪?」会被当作粗鲁。大城市里警察、地铁站工作人员、便利店店员是免费问路的最稳定渠道;出租车司机有时听不懂英文,只问「到机场多少钱?」即可。酒店和高端餐厅有 10-15% 服务费(不强制),出租车不收小费。地铁站里禁止饮食(喝水也不行),违者罚款。",
    howTo:
      "出发前 3-5 天开始旅行短语集。10 个句子用间隔重复背熟后,跟读对话示例。当天到了之后,从「请问,机场怎么走?」开始,接着是「到机场多少钱?」、「我要办入住」、「请问洗手间在哪?」这 4 句基本能覆盖整个行程。每天 10 分钟、连续 3 天,旅行中文的 9 成就能搞定。",
    conversation: [
      { speaker: "A", en: "Excuse me, where is the airport?", tgt: "请问,机场怎么走?", romanization: "Qǐngwèn, jīchǎng zěnme zǒu?", literal: "Excuse me, airport how to go?" },
      { speaker: "B", en: "Take Metro Line 2 south. About 40 minutes.", tgt: "坐地铁二号线往南,大概 40 分钟。", romanization: "Zuò dìtiě èr hào xiàn wǎng nán, dàgài sìshí fēnzhōng." },
      { speaker: "A", en: "Thank you. How much is a ticket?", tgt: "谢谢。票多少钱?", romanization: "Xièxie. Piào duōshǎo qián?", literal: "Thanks, ticket how much?" },
      { speaker: "B", en: "8 yuan. You can buy a ticket at the machine, or just use your phone.", tgt: "8 块钱。可以在机器上买票,也可以直接刷手机。", romanization: "Bā kuài qián. Kěyǐ zài jīqì shàng mǎi piào, yě kěyǐ zhíjiē shuā shǒujī." },
    ],
    phrases: [
      { en: "Excuse me, where is the airport?", tgt: "请问,机场怎么走?", romanization: "Qǐngwèn, jīchǎng zěnme zǒu?" },
      { en: "I have a reservation under the name [X].", tgt: "我预订了一间房,名字叫 [X]。", romanization: "Wǒ yùdìng le yì jiān fáng, míngzì jiào [X]." },
      { en: "Could I have the check, please?", tgt: "麻烦结账。", romanization: "Máfan jiézhàng." },
      { en: "How do I get to [place]?", tgt: "请问去 [place] 怎么走?", romanization: "Qǐngwèn qù [place] zěnme zǒu?" },
      { en: "Is there a train station nearby?", tgt: "请问附近有地铁站吗?", romanization: "Qǐngwèn fùjìn yǒu dìtiě zhàn ma?" },
      { en: "I would like to check in.", tgt: "我要办入住。", romanization: "Wǒ yào bàn rùzhù." },
      { en: "What time does the flight leave?", tgt: "请问航班几点起飞?", romanization: "Qǐngwèn hángbǎn jǐ diǎn qǐfēi?" },
      { en: "I'm lost. Can you help me?", tgt: "我迷路了,能帮我一下吗?", romanization: "Wǒ mílù le, néng bāng wǒ yīxià ma?" },
      { en: "How much is a ticket to [place]?", tgt: "到 [place] 的票多少钱?", romanization: "Dào [place] de piào duōshǎo qián?" },
      { en: "Where is the bathroom?", tgt: "请问洗手间在哪?", romanization: "Qǐngwèn xǐshǒujiān zài nǎ?" },
    ],
  },
  business: {
    title: "商务中文 — 会议、邮件、跟进",
    subtitle:
      "会议安排、议程分享、工作跟进 — 职场最常说的 10 句。",
    intro:
      "商务中文,核心是「得体」。同样一件事,用「麻烦您看一下」和「给我看一下」说,效果天差地别。商务场景的 50 个固定句式,能让你在中外合资企业、中国本土公司、外贸生意中都显得专业。LangOria 的商务短语集挑选的是「每周都会用到」的 10 句:开会、议程、跟进、致谢、调整时间,这些占了你职场沟通的 9 成。商务中文与日常中文的差别,不是语法,而是 得体(dé-tǐ, 体面与礼貌)。同一句话,得体等级选对了,在 会议(huìyì) 里是「同事」、在 客户面前是「合作伙伴」、在微信里是「下属」对「上司」该有的样子。这 10 句掌握了,即便你的中文只有 A2 水平,也能在中国的会议上发挥应有的作用。短语可以直接套用到你的工作邮件、微信工作群、议程文档的标题里。",
    culture:
      "中国的职场,「面子」很重要 — 拒绝别人的方案时,不要直接说「不行」,而是用「我再考虑一下」、「这个方案可能还要再优化一下」来表达。邮件主题要写得清楚:「【请审阅】Q3 项目报告(截止 10/15)」比「项目报告」更有效。微信是中国职场的主要沟通工具,大部分内部沟通都在微信群里,而不是邮件。会议前给老板发一条「王总,明天的会议我会准备 Q3 的数据」,效果远胜于会上直接说。",
    howTo:
      "第一次参加中文会议前 5-7 天,过一遍商务短语集。把 10 个句子背熟后,挑出最常用的 3 个,改成你自己的话术:比如「请审阅」、「麻烦您看一下」、「我稍后邮件您」。商务中文的 10 分钟/天,坚持 3 个月就足够应付大部分会议。",
    conversation: [
      { speaker: "A", en: "Thank you for joining today. I have a brief agenda.", tgt: "感谢大家今天到场。今天的议程很简单。", romanization: "Gǎnxiè dàjiā jīntiān dàochǎng. Jīntiān de yìchéng hěn jiǎndān." },
      { speaker: "B", en: "Sure, please go ahead.", tgt: "好的,请讲。", romanization: "Hǎo de, qǐng jiǎng." },
      { speaker: "A", en: "First, the Q3 launch status. Then, the budget. Finally, open questions.", tgt: "首先,Q3 上线情况;然后,预算;最后,自由讨论。", romanization: "Shǒuxiān, Q3 shàngxiàn qíngkuàng; ránhòu, yùsuàn; zuìhòu, zìyóu tǎolùn." },
      { speaker: "B", en: "Understood. I'll send the agenda and pre-read via email after this.", tgt: "好的。会后我把议程和会前材料发到邮件里。", romanization: "Hǎo de. Huì hòu wǒ bǎ yìchéng hé huì qián cáiliào fā dào yóujiàn lǐ." },
    ],
    phrases: [
      { en: "Let's schedule a meeting for next Tuesday.", tgt: "我们定在下周二开会吧。", romanization: "Wǒmen dìng zài xià xīngqī'èr kāihuì ba." },
      { en: "Could you send me the agenda?", tgt: "能把议程发给我吗?", romanization: "Néng bǎ yìchéng fā gěi wǒ ma?" },
      { en: "I'll follow up via email.", tgt: "我稍后邮件您。", romanization: "Wǒ shāohòu yóujiàn nín." },
      { en: "Let's touch base next week.", tgt: "我们下周再碰一下。", romanization: "Wǒmen xià zhōu zài pèng yīxià." },
      { en: "I'd like to propose a deadline of [X].", tgt: "我建议把截止时间定在 [X]。", romanization: "Wǒ jiànyì bǎ jiézhǐ shíjiān dìng zài [X]." },
      { en: "Can we move the meeting to [time]?", tgt: "会议能改到 [time] 吗?", romanization: "Huìyì néng gǎi dào [time] ma?" },
      { en: "What's the status on the [project]?", tgt: "[project] 进展如何?", romanization: "[project] jìnzhǎn rúhé?" },
      { en: "I have a question about the contract.", tgt: "关于合同我有一个问题。", romanization: "Guānyú hétong wǒ yǒu yīgè wèntí." },
      { en: "Thank you for your time.", tgt: "感谢您的时间。", romanization: "Gǎnxiè nín de shíjiān." },
      { en: "Let's circle back on this.", tgt: "这个事我们再讨论一下。", romanization: "Zhège shì wǒmen zài tǎolùn yīxià." },
    ],
  },
  food: {
    title: "点餐中文 — 餐厅、点菜、结账",
    subtitle:
      "餐厅、便利店、外卖都用得到的 10 个核心句子。",
    intro:
      "吃饭是中国日常生活最有温度的场景,也是学中文最好玩的入口。在中国,大街上几乎所有餐厅都需要你直接告诉店员你想吃什么 — 没有人会来问「Can I help you?」。把这 10 句背下来,你就可以独立走进任何一家面馆、火锅店、烧烤摊、便利店,完成从进门到结账的完整流程。LangOria 的点餐短语集覆盖了中国餐厅从「几位?」到「买单」的完整对话。同样的 10 句,从 便利店(biànlìdiàn) 到 火锅店(huǒguō diàn) 、从 面馆(miànguǎn) 到 高档餐厅(gāodàng cāntīng) ,全部通吃。「您好」(nín hǎo) 和「谢谢」(xièxie) — 这两个词是任何一餐里最重要的礼貌。中国餐厅大多使用「扫码点单」,但口头点餐依然行得通,尤其是服务员主动来问的时候。10 句学会后,找一个工作日午餐,独自去一家面馆或饺子馆完成「4 位 / 菜单 / 推荐 / 辣不辣 / 买单 / 打包」的全流程 — 这是学中文最有满足感的 30 分钟,胜过一周课本。",
    culture:
      "在中国餐厅,进门第一句通常是「几位?」或「您几位?」,这是「how many people in your party」的中国版。「扫码点单」(扫桌上的二维码用微信点菜)是中国餐厅 2020 年以后的主流,大多数连锁店都没有纸质菜单,只提供二维码。点菜时如果不知道点什么,直接问「您这有什么推荐?」(What do you recommend?),服务员会很高兴推荐。吃不完想打包,说「打包」(takeaway)即可。中国没有小费文化,买单后直接走即可。",
    howTo:
      "点餐短语集是最快上手的 — 2-3 天足够。10 句背熟后,找一个工作日午餐时间,独自去一家面馆或饺子馆完成「4 位 / 菜单 / 推荐 / 买单 / 打包」的全流程。这是学中文最有满足感的 30 分钟,胜过一周课本。",
    conversation: [
      { speaker: "A", en: "Hi, table for two, please.", tgt: "您好,两位。", romanization: "Nín hǎo, liǎng wèi.", literal: "Hello, two people" },
      { speaker: "B", en: "Of course. Right this way. Here's the menu.", tgt: "好,这边请。菜单给您。", romanization: "Hǎo, zhèbiān qǐng. Càidān gěi nín." },
      { speaker: "A", en: "Thank you. What do you recommend?", tgt: "谢谢。您这有什么推荐?", romanization: "Xièxie. Nín zhè yǒu shénme tuījiàn?" },
      { speaker: "B", en: "The fish is excellent today. Are you allergic to anything?", tgt: "今天的鱼很新鲜。您有什么忌口吗?", romanization: "Jīntiān de yú hěn xīnxiān. Nín yǒu shénme jìkǒu ma?", literal: "What foods do you avoid?" },
    ],
    phrases: [
      { en: "Could I see the menu, please?", tgt: "麻烦给我看一下菜单。", romanization: "Máfan gěi wǒ kàn yīxià càidān." },
      { en: "What do you recommend?", tgt: "您这有什么推荐?", romanization: "Nín zhè yǒu shénme tuījiàn?" },
      { en: "I'm allergic to [X].", tgt: "我对 [X] 过敏。", romanization: "Wǒ duì [X] guòmǐn." },
      { en: "Could I have the bill, please?", tgt: "麻烦买单。", romanization: "Máfan mǎidān." },
      { en: "Is this dish spicy?", tgt: "这个菜辣吗?", romanization: "Zhège cài là ma?" },
      { en: "I'll have [X], please.", tgt: "我要一份 [X]。", romanization: "Wǒ yào yī fèn [X]." },
      { en: "Can I get this to go?", tgt: "可以打包吗?", romanization: "Kěyǐ dǎbāo ma?" },
      { en: "Is the tip included?", tgt: "包含服务费吗?", romanization: "Bāohán fúwùfèi ma?" },
      { en: "I'm a vegetarian.", tgt: "我吃素。", romanization: "Wǒ chī sù." },
      { en: "That was delicious, thank you.", tgt: "很好吃,谢谢。", romanization: "Hěn hǎochī, xièxie." },
    ],
  },
  "small-talk": {
    title: "闲聊中文 — 自我介绍、寒暄",
    subtitle:
      "第一次见面、寒暄客套、聊兴趣爱好的 10 句中文。",
    intro:
      "闲聊是中文社交的入口。在中国,陌生人之间 5 分钟内就会问「您贵姓?」「您是哪里人?」「您做哪行的?」 — 这种「陌生人问隐私」的习惯,和中国社会的「关系」文化直接相关。把 10 句闲聊短语记熟,你在出租车、火车、电梯、招待会都能和中国人聊起来。LangOria 的闲聊短语集覆盖了从「你好」到「您慢走」的中国式寒暄完整流程。中国的初次见面 5 分钟,无论在 商务晚宴(shāngwù wǎnyàn) 、 微信群(Wēixìn qún) 还是 朋友聚会(péngyǒu jùhuì) ,都遵循「您好」→「贵姓」→「哪里人」→「做什么工作」→「爱好」这一固定流程。掌握这个流程的人,会被邀请下一顿饭;掌握不了的,只会被客气地结束对话。闲聊不是词汇量,而是反射弧。10 句学会后,挑 3 句最常用的改成自己的版本(比如「我来自北京,做设计工作」、「我喜欢跑步和摄影」),在中国旅行时主动和出租车司机、酒店前台、便利店店员搭话 — 会比你想象的受欢迎。",
    culture:
      "中国人初次见面喜欢问「您贵姓?」(您的姓是? ) — 回答时只说姓即可,「我姓王」(I am surnamed Wang)。「您是哪里人?」(Where are you from?) 是固定开场白,即使你们已经在同一个城市,这也是礼节性的「我们来自哪里」的开场。称谓在中国很重要:对陌生人和长辈用「您」(nín) 而不是「你」(nǐ),朋友和晚辈才用「你」。送客时主人说「您慢走」、「您走好」,客人说「您留步」、「别送了」 — 这些都是场面话,不是真的让你慢慢走。",
    howTo:
      "闲聊短语集 3-5 天可以掌握。10 句背熟后,挑 3 句最常用的,改成自己的版本:比如「我来自北京,做设计工作」、「我喜欢跑步和摄影」。在中国旅行时,主动和出租车司机、酒店前台、便利店店员搭话,会比你想象的受欢迎。",
    conversation: [
      { speaker: "A", en: "Hi, my name is Sarah. Nice to meet you.", tgt: "您好,我叫 Sarah,很高兴认识您。", romanization: "Nín hǎo, wǒ jiào Sarah, hěn gāoxìng rènshì nín." },
      { speaker: "B", en: "Nice to meet you too. I'm David. What do you do?", tgt: "您好,我叫 David。您是做什么工作的?", romanization: "Nín hǎo, wǒ jiào David. Nín shì zuò shénme gōngzuò de?" },
      { speaker: "A", en: "I'm a software engineer. How about you?", tgt: "我做软件工程师,您呢?", romanization: "Wǒ zuò ruǎnjiàn gōngchéngshī, nín ne?" },
      { speaker: "B", en: "I work in marketing. Do you have any hobbies?", tgt: "我做市场工作。您有什么爱好吗?", romanization: "Wǒ zuò shìchǎng gōngzuò. Nín yǒu shénme àihào ma?" },
    ],
    phrases: [
      { en: "Hi, my name is [X]. Nice to meet you.", tgt: "您好,我叫 [X],很高兴认识您。", romanization: "Nín hǎo, wǒ jiào [X], hěn gāoxìng rènshì nín." },
      { en: "What do you do for a living?", tgt: "您是做什么工作的?", romanization: "Nín shì zuò shénme gōngzuò de?" },
      { en: "Where are you from?", tgt: "您是哪里人?", romanization: "Nín shì nǎlǐ rén?" },
      { en: "What are your hobbies?", tgt: "您有什么爱好吗?", romanization: "Nín yǒu shénme àihào ma?" },
      { en: "Have you seen any good movies lately?", tgt: "最近看什么好电影了吗?", romanization: "Zuìjìn kàn shénme hǎo diànyǐng le ma?" },
      { en: "How was your weekend?", tgt: "您周末过得怎么样?", romanization: "Nín zhōumò guò de zěnmeyàng?" },
      { en: "Do you have any plans for the weekend?", tgt: "您周末有什么安排?", romanization: "Nín zhōumò yǒu shénme ānpái?" },
      { en: "What kind of music do you like?", tgt: "您喜欢什么音乐?", romanization: "Nín xǐhuān shénme yīnyuè?" },
      { en: "It's nice weather today, isn't it?", tgt: "今天天气真不错。", romanization: "Jīntiān tiānqì zhēn bùcuò." },
      { en: "It was lovely talking to you.", tgt: "和您聊天很愉快。", romanization: "Hé nín liáotiān hěn yúkuài." },
    ],
  },
};

// ---------------------------------------------------------------------------
// Korean scenarios. The 10 phrases are real sentence-pairs curated from
// the Tatoeba corpus, with natural Korean phrasing (해요체) appropriate
// for traveller-level politeness. Romanization is Revised Romanization.
// ---------------------------------------------------------------------------

const SCENARIOS_KO: Record<ScenarioKey, ScenarioContent> = {
  travel: {
    title: "여행 한국어 — 공항, 호텔, 길 묻기",
    subtitle:
      "공항, 호텔, 지하철, 길 묻기 상황별 한국어 10문장, 로마자 + 대화 예시.",
    intro:
      "여행 한국어는 영어권 여행과 마찬가지로 같은 50 문장이면 한국 어디서든 통합니다. 공항, 호텔, 식당, 길거리에서 한국어를 거의 못 하는 사람을 가장 살려주는 한 마디는 「실례합니다, OO 은/는 어디예요?」 입니다. 한국에서는 영어가 통하는 곳이 제한적이라, 이 한 마디가 여행 전체를 살립니다. LangOria 의 여행 한국어 10 문장은 발음, 문화 메모, 대화 예시와 함께 묶여 있어, 도착 첫날부터 바로 쓸 수 있습니다.",
    culture:
      "한국에서는 「실례합니다」로 시작하는 것이 기본 예의입니다 — 「저기요」도 통하지만 「실례합니다」가 더 정중합니다. 지하철에서 노약자석 부근에서는 전화기를 무음으로 하고, 큰 소리로 통화하지 않습니다. 식당에서는 직원에게 직접 손을 들어 부르지 말고, 눈이 마주치면 「저기요」로 부르는 것이 일반적입니다. 호텔에서는 팁 문화가 없고, 길거리 음식점이나 카페에서도 동일합니다.",
    howTo:
      "출발 3-5 일 전부터 여행 한국어 10 문장을 시작합니다. 간격 반복으로 10 문장을 자동화한 뒤, 대화 예시를 소리 내어 연습합니다. 도착 후 공항에서 「실례합니다, 공항은 어디예요?」로 시작해서, 지하철에서 「OO 까지 어떻게 가요?」, 호텔에서 「체크인 하려고요」의 순서로 하루 5 문장씩 쓰면 한국어 여행의 9 할을 커버합니다. 매일 10 분 × 7 일이면 충분합니다.",
    conversation: [
      { speaker: "A", en: "Excuse me, where is the airport?", tgt: "실례합니다, 공항은 어디예요?", romanization: "Sillyehamnida, gonghang-eun eodiyeyo?" },
      { speaker: "B", en: "Take subway line 2. About 40 minutes.", tgt: "지하철 2 호선을 타세요. 약 40 분이에요.", romanization: "Jihacheol i ho-seul taseyo. Yak sipbun-ieyo." },
      { speaker: "A", en: "Thank you. How much is a ticket?", tgt: "감사합니다. 표는 얼마예요?", romanization: "Gamsahamnida. Pyoneun eolmayeyo?" },
      { speaker: "B", en: "1,450 won. You can use a T-money card at the gate.", tgt: "1,450 원이에요. T-money 카드로도 탈 수 있어요.", romanization: "Cheon-sa-baek-o-sip-won-ieyo. T-money kadeu-ro-do tal su isseoyo." },
    ],
    phrases: [
      { en: "Excuse me, where is the airport?", tgt: "실례합니다, 공항은 어디예요?", romanization: "Sillyehamnida, gonghang-eun eodiyeyo?" },
      { en: "I have a reservation under the name [X].", tgt: "[이름] 으로 예약했어요.", romanization: "[X]-eulo yeyakhaesseoyo." },
      { en: "Could I have the check, please?", tgt: "계산서 주세요.", romanization: "Gyesanseo juseyo." },
      { en: "How do I get to [place]?", tgt: "[장소] 에 어떻게 가요?", romanization: "[place]-e eotteoke gayo?" },
      { en: "Is there a train station nearby?", tgt: "근처에 기차역이 있어요?", romanization: "Geunche-e gichayeok-i isseoyo?" },
      { en: "I would like to check in.", tgt: "체크인 하려고요.", romanization: "Chekeu-in haryeoyo." },
      { en: "What time does the flight leave?", tgt: "비행기가 몇 시에 출발해요?", romanization: "Bihaeng-gi-ga myeot si-e chulbalhaeyo?" },
      { en: "I'm lost. Can you help me?", tgt: "길을 잃었어요. 도와주실 수 있어요?", romanization: "Gil-eul ireosseoyo. Dowajusil su isseoyo?" },
      { en: "How much is a ticket to [place]?", tgt: "[장소] 까지 표가 얼마예요?", romanization: "[place]-kkaji pyo-ga eolmayeyo?" },
      { en: "Where is the bathroom?", tgt: "화장실은 어디예요?", romanization: "Hwajangsil-eun eodiyeyo?" },
    ],
  },
  business: {
    title: "비즈니스 한국어 — 회의, 이메일, 팔로업",
    subtitle:
      "회의 잡기, 안건 공유, 팔로업 이메일, 한국 직장 예절의 10 문장.",
    intro:
      "비즈니스 한국어의 핵심은 존댓말입니다. 영어의 「let's touch base」와 같은 정해진 표현을 한국어의 높임말로 정확히 구사할 수 있느냐가 회사에서 「외국인 신입」인지 「동료」인지 를 가릅니다. 회의 잡기, 안건 공유, 마감 협상, 사과 — 이 50 문장만 알아도 한국 직장에서 「외국인 신입」이 아닌 「동료」로 대접받습니다. LangOria 의 비즈니스 한국어 10 문장은 외투기업, 한국 로컬 회사 모두에서 통하는 문장만 추렸습니다.",
    culture:
      "한국의 회의는 「넌이미(根回し)」 가 기본 — 정식 회의 전에 상사와 동료에게 비공식적으로 먼저 컨택한 뒤 본 회의에 들어갑니다. 명함 교환은 두 손으로, 받기도 두 손으로. 이메일 제목은 구체적으로:「[공유] Q3 매출 보고서 검토 요청 (마감 10/15)」처럼 액션과 마감일을 적습니다. 한국 회사에서는 카톡(카카오톡)이 주요 업무 소통 채널이며, 이메일을 잘 안 열어보는 상사도 많습니다.",
    howTo:
      "처음 한국어 회의 1 주일 전부터 비즈니스 덱을 시작합니다. 10 문장을 간격 반복으로 자동화한 뒤, 자신의 업무에 맞게 커스터마이즈: 「OO 건, 진행 상황 어때요?」 를 자신의 프로젝트 용어로 바꿔 연습합니다. 회의 후 24 시간 안에 한국어로 팔로업 메시지를 보내는 것이 신뢰 구축의 가장 빠른 길입니다. 매일 10 분 × 3 개월이면 한국어 회의 9 할을 소화할 수 있습니다.",
    conversation: [
      { speaker: "A", en: "Thank you for joining today. I have a brief agenda.", tgt: "오늘 참석해 주셔서 감사합니다. 간단한 안건이 있어요.", romanization: "Oneul chamseokhae jusyeoseo gamsahamnida. Gandanhan angeon-i isseoyo." },
      { speaker: "B", en: "Sure, please go ahead.", tgt: "네, 말씀하세요.", romanization: "Ne, malsseumhaseyo." },
      { speaker: "A", en: "First, the Q3 launch status. Then, the budget. Finally, open questions.", tgt: "먼저 Q3 출시 현황, 다음 예산, 마지막으로 질의응답 순서로 하겠습니다.", romanization: "Meonjeo Q3 chulsi hyeonhwang, daeum yesan, majimak-euro jilgieongdap sunseo-ro hagetseumnida." },
      { speaker: "B", en: "Understood. I'll send the agenda and pre-read via email after this.", tgt: "알겠습니다. 회의 후에 안건과 사전 자료를 메일로 보내 드리겠습니다.", romanization: "Algesseumnida. Hoei hue-e angoen-gwa jigeon jaryo-reul meil-lo bonae deurigetseumnida." },
    ],
    phrases: [
      { en: "Let's schedule a meeting for next Tuesday.", tgt: "다음 주 화요일에 회의 잡을까요?", romanization: "Daeum ju hwayo-il-e hoei jap-eulkkayo?" },
      { en: "Could you send me the agenda?", tgt: "안건 보내 주실 수 있어요?", romanization: "Angeon bonae jusil su isseoyo?" },
      { en: "I'll follow up via email.", tgt: "메일로 후속 연락 드릴게요.", romanization: "Meil-ro husok yeollak deurilgeyo." },
      { en: "Let's touch base next week.", tgt: "다음 주에 다시 얘기해요.", romanization: "Daeum ju-e dasi yaegihaeyo." },
      { en: "I'd like to propose a deadline of [X].", tgt: "마감일을 [X] 로 하면 어떨까요?", romanization: "Magam-il-eul [X]-ro hamyeon eotteolkkayo?" },
      { en: "Can we move the meeting to [time]?", tgt: "회의를 [시간] 으로 바꿀 수 있어요?", romanization: "Hoei-reul [time]-euro bakkul su isseoyo?" },
      { en: "What's the status on the [project]?", tgt: "[프로젝트] 진행 상황 어때요?", romanization: "[project] jinhwaeng sanghwang eottaeyo?" },
      { en: "I have a question about the contract.", tgt: "계약에 대해 질문이 있어요.", romanization: "Gyeyak-e daehae jilmun-i isseoyo." },
      { en: "Thank you for your time.", tgt: "시간 내 주셔서 감사합니다.", romanization: "Sigan nae jusyeoseo gamsahamnida." },
      { en: "Let's circle back on this.", tgt: "이 부분 다시 논의해요.", romanization: "I bubun dasi nonl-uihaeyo." },
    ],
  },
  food: {
    title: "식당 한국어 — 주문, 계산, 알레르기",
    subtitle:
      "식당, 분식집, 카페에서 바로 쓰는 한국어 10 문장.",
    intro:
      "식당 한국어는 보상이 가장 큰 한국어입니다. 10 문장만 알아도 한국의 모든 음식점 — 분식집부터 고급 한정식까지 — 에서 자유롭습니다. 「메뉴판 주세요」, 「추천 메뉴가 뭐예요?」, 「OO 알레르기 있어요」 의 3 문장이 식사의 9 할을 완성합니다. 한국에서는 「음식 나오면 다 먹어야 한다」 는 압박이 없고, 안 먹고 싶은 음식은 「저는 안 먹어요」 로 자연스럽게 거절합니다. 한국에는 팁 문화가 없으며, 식당 계산은 테이블에서 카드로 냅니다.",
    culture:
      "한국 식당에서는 「어서오세요」 가 입구에서 자동 인사가 됩니다. 자리에 앉으면 먼저 물과 숟가락, 젓가락이 나오고, 주문을 마치고 「잘 먹겠습니다」 가 표준 인사입니다. 식사가 끝나면 「잘 먹었습니다」 로 마무리합니다. 매운 정도를 조절하고 싶으면 「덜 매운 거로 주세요」 (less spicy) 또는 「안 매운 거 있어요?」 (do you have non-spicy?). 반찬(banchan) 은 무료로 계속 리필되지만, 더 달라고 하면 「OO 더 주세요」 로 요청합니다.",
    howTo:
      "식당 덱은 2-3 일이면 끝납니다. 10 문장을 외운 후 점심시간에 혼자 분식집이나 김밥집에 가서 「2 인이에요」 → 「메뉴판 주세요」 → 「추천 메뉴 뭐예요?」 → 「덜 매운 거 주세요」 → 「카드로 계산할게요」 의 전 과정을 30 분 안에 실전으로 해보세요. 한국어 학습에서 가장 보람 있는 30 분입니다.",
    conversation: [
      { speaker: "A", en: "Hi, table for two, please.", tgt: "안녕하세요, 2 명이에요.", romanization: "Annyeonghaseyo, du myeong-ieyo." },
      { speaker: "B", en: "Of course. Right this way. Here's the menu.", tgt: "네, 이쪽으로 오세요. 메뉴판이에요.", romanization: "Ne, ijjo-geuro oseyo. Menyu-pan-ieyo." },
      { speaker: "A", en: "Thank you. What do you recommend?", tgt: "감사합니다. 추천 메뉴가 뭐예요?", romanization: "Gamsahamnida. Chucheon menyu-ga mwoyeyo?" },
      { speaker: "B", en: "The kimchi jjigae is excellent today. Are you allergic to anything?", tgt: "오늘 김치찌개가 잘 나왔어요. 알레르기 있는 거 있어요?", romanization: "Oneul gimchi-jjigae-ga jal nawatseoyo. Allereugi inneun geo isseoyo?" },
    ],
    phrases: [
      { en: "Could I see the menu, please?", tgt: "메뉴판 좀 보여 주실 수 있어요?", romanization: "Menyu-pan jom boyeo jusil su isseoyo?" },
      { en: "What do you recommend?", tgt: "추천 메뉴가 뭐예요?", romanization: "Chucheon menyu-ga mwoyeyo?" },
      { en: "I'm allergic to [X].", tgt: "[X] 알레르기가 있어요.", romanization: "[X] allereugi-ga isseoyo." },
      { en: "Could I have the bill, please?", tgt: "계산서 주세요.", romanization: "Gyesanseo juseyo." },
      { en: "Is this dish spicy?", tgt: "이 음식 매워요?", romanization: "I eumsik maewoyo?" },
      { en: "I'll have [X], please.", tgt: "[X] 로 주세요.", romanization: "[X]-ro juseyo." },
      { en: "Can I get this to go?", tgt: "포장해 갈 수 있어요?", romanization: "Pojanghae gal su isseoyo?" },
      { en: "Is the tip included?", tgt: "팁 포함이에요?", romanization: "Tip poham-ieyo?" },
      { en: "I'm a vegetarian.", tgt: "저는 채식주의자에요.", romanization: "Jeoneun chaesikjuuija-eyo." },
      { en: "That was delicious, thank you.", tgt: "정말 맛있었어요, 감사합니다.", romanization: "Jeongmal masisseosseoyo, gamsahamnida." },
    ],
  },
  "small-talk": {
    title: "잡담 한국어 — 인사, 자기소개, 취미",
    subtitle:
      "첫 만남, 약속, 모임에서 쓰는 한국어 10 문장.",
    intro:
      "잡담은 한국어의 「입구」 입니다. 한국에서는 처음 만나면 「이름이 어떻게 되세요?」 「어디서 오셨어요?」 「직업이 어떻게 되세요?」 가 자동으로 이어집니다. 이 10 문장을 외우면 한국의 동호회, 호스트 패밀리, 회식 자리 어디서든 자연스럽게 어울릴 수 있습니다. LangOria 의 잡담 10 문장은 한국식 인사와 예의 범위를 정확히 담았습니다.",
    culture:
      "한국의 자기소개는 「OO 입니다. OO 에서 왔습니다. OO 을/를 하고 있습니다」 의 3 점 세트 — 이름, 출신, 직업 — 가 예의입니다. 처음 보는 사람에게는 「-습니다 / -세요」 체 (formal speech) 를 사용하고, 친해지면 「-어요 / -아요」 (casual polite) 로 낮춥니다. 한국에서는 나이 차이가 대화의 톤을 결정하는 중요한 요소 — 연장자에게 반말을 쓰면 큰 실례가 됩니다. 만주 칭찬(「잘 생겼어요」, 「요리 잘하네요」) 은 자연스럽게 받아들이는 것이 좋습니다.",
    howTo:
      "잡담 덱은 3-5 일이면 익힐 수 있습니다. 10 문장을 외운 뒤 자기 정보로 바꿔서 자기소개를 5 번 쓰고, 녹음해서 발음을 체크하세요. 한국에 있는 직장 동료에게 「한국어로 자기소개 하고 싶어요」 라고 말해 10 분 잡담 시간만 달라고 하면, 가장 빠른 성장 루트입니다.",
    conversation: [
      { speaker: "A", en: "Hi, my name is Sarah. Nice to meet you.", tgt: "안녕하세요, Sarah 입니다. 만나서 반가워요.", romanization: "Annyeonghaseyo, Sarah-imnida. Mannaseo bangawoyo." },
      { speaker: "B", en: "Nice to meet you too. I'm David. What do you do?", tgt: "만나서 반가워요. David 입니다. 직업이 어떻게 되세요?", romanization: "Mannaseo bangawoyo. David-imnida. Jigeop-i eotteoke doeseyo?" },
      { speaker: "A", en: "I'm a software engineer. How about you?", tgt: "저는 소프트웨어 엔지니어예요. David 씨는요?", romanization: "Jeoneun software engineer-yeyo. David-sseun-eyo?" },
      { speaker: "B", en: "I work in marketing. Do you have any hobbies?", tgt: "저는 마케팅 일을 해요. 취미가 뭐예요?", romanization: "Jeoneun marketing il-eul haeyo. Chumi-ga mwoyeyo?" },
    ],
    phrases: [
      { en: "Hi, my name is [X]. Nice to meet you.", tgt: "안녕하세요, [X] 입니다. 만나서 반가워요.", romanization: "Annyeonghaseyo, [X]-imnida. Mannaseo bangawoyo." },
      { en: "What do you do for a living?", tgt: "직업이 어떻게 되세요?", romanization: "Jigeop-i eotteoke doeseyo?" },
      { en: "Where are you from?", tgt: "어디서 오셨어요?", romanization: "Eodiseo osyeosseoyo?" },
      { en: "What are your hobbies?", tgt: "취미가 뭐예요?", romanization: "Chumi-ga mwoyeyo?" },
      { en: "Have you seen any good movies lately?", tgt: "최근에 괜찮은 영화 봤어요?", romanization: "Choegun-e gwahanh-eun yeonghwa bwasseoyo?" },
      { en: "How was your weekend?", tgt: "주말 잘 보냈어요?", romanization: "Jumal jal bonaesseoyo?" },
      { en: "Do you have any plans for the weekend?", tgt: "주말에 뭐 할 계획이에요?", romanization: "Jumal-e mwo hal gyehoek-ieyo?" },
      { en: "What kind of music do you like?", tgt: "어떤 음악 좋아하세요?", romanization: "Eotteon eumak joahaseyo?" },
      { en: "It's nice weather today, isn't it?", tgt: "오늘 날씨 좋지요?", romanization: "Oneul nalssi jochiyo?" },
      { en: "It was lovely talking to you.", tgt: "이야기해서 즐거웠어요.", romanization: "Iyagihaeseo jeulgeowosseoyo." },
    ],
  },
};

// ---------------------------------------------------------------------------
// Spanish scenarios. Phrasing is Castilian (usted) where the politeness
// register matters (business, formal travel) and Latin-American neutral
// (tú + usted) where it does not. Surnames and accent marks are
// preserved.
// ---------------------------------------------------------------------------

const SCENARIOS_ES: Record<ScenarioKey, ScenarioContent> = {
  travel: {
    title: "Frases de viaje en español — aeropuerto, hotel, indicaciones",
    subtitle:
      "Las 10 frases de español para el 95% de cualquier viaje: aeropuerto, hotel, taxi y pedir direcciones.",
    intro:
      "El español de viaje es el español con mejor relación esfuerzo-resultado: las mismas 50 frases te llevan por el aeropuerto, el hotel, el taxi, el restaurante y la recepción de una embajada. Tanto si vuelas a Madrid, a Ciudad de México, a Buenos Aires o a Bogotá, el español práctico del viaje es el mismo — y dominarlo es la diferencia entre un viaje estresante y uno que fluye. Las 10 frases del mazo de viaje de LangOria son las que realmente necesitas, no las 1000 que podrías necesitar algún día. Cada frase viene con audio de repetición, un diálogo de ejemplo y un consejo cultural.",
    culture:
      "En los países hispanohablantes, la cortesía se expresa con «por favor» y «gracias» (no tan obligatoria como en inglés, pero muy valorada). En España se usa más el «usted» formal; en Latinoamérica se usa más el «tú» coloquial — en la duda, empieza con «usted» y deja que el interlocutor te invite a tutearte. La propina no es obligatoria: en España se deja 5-10% redondeando; en México y Argentina es 10-15%. En los menús, «primer plato» / «segundo plato» / «postre» es la estructura de España; en Latinoamérica se dice más «entrada» / «plato fuerte» / «postre».",
    howTo:
      "Dedica 3-5 días al mazo de viaje antes de cualquier viaje. Repasa las 10 frases con repetición espaciada hasta que salgan en automático, luego practica el diálogo en voz alta con un compañero o una grabación. De viaje, intenta usar cada frase al menos una vez en la vida real — la memoria muscular de hablar español con un extraño se construye en el momento, no en la app. El bucle diario de 10 minutos es suficiente.",
    conversation: [
      { speaker: "A", en: "Excuse me, where is the airport?", tgt: "Disculpe, ¿dónde está el aeropuerto?", romanization: "" },
      { speaker: "B", en: "Take metro line 8 south. It's about 40 minutes.", tgt: "Tome la línea 8 del metro hacia el sur. Son unos 40 minutos.", romanization: "" },
      { speaker: "A", en: "Thank you. How much is a ticket?", tgt: "Gracias. ¿Cuánto cuesta el billete?", romanization: "" },
      { speaker: "B", en: "1,50 euros. You can use the contactless card at the turnstile.", tgt: "1,50 euros. Puede usar la tarjeta sin contacto en el torno.", romanization: "" },
    ],
    phrases: [
      { en: "Excuse me, where is the airport?", tgt: "Disculpe, ¿dónde está el aeropuerto?" },
      { en: "I have a reservation under the name [X].", tgt: "Tengo una reserva a nombre de [X]." },
      { en: "Could I have the check, please?", tgt: "La cuenta, por favor." },
      { en: "How do I get to [place]?", tgt: "¿Cómo llego a [lugar]?" },
      { en: "Is there a train station nearby?", tgt: "¿Hay una estación de tren cerca?" },
      { en: "I would like to check in.", tgt: "Quisiera registrarme." },
      { en: "What time does the flight leave?", tgt: "¿A qué hora sale el vuelo?" },
      { en: "I'm lost. Can you help me?", tgt: "Estoy perdido. ¿Puede ayudarme?" },
      { en: "How much is a ticket to [place]?", tgt: "¿Cuánto cuesta un billete a [lugar]?" },
      { en: "Where is the bathroom?", tgt: "¿Dónde está el baño?" },
    ],
  },
  business: {
    title: "Español de negocios — reuniones, correos, seguimiento",
    subtitle:
      "Frases profesionales para el día laboral: agendar, agendas, seguimiento y habilidades blandas que te hacen ascender.",
    intro:
      "El español de negocios es la diferencia entre ser entendido en el trabajo y ser de confianza en el trabajo. El vocabulario de reuniones, correos y seguimientos es un conjunto pequeño y finito — las mismas 50 frases cubren el 90% de la comunicación profesional en español. Ya sea escribiendo un informe de estado, abriendo una reunión de lunes o negociando una fecha límite, la frase correcta en el registro correcto es lo que te hace sonar como un par, no como un extranjero. El mazo de español de negocios de LangOria está construido alrededor de las 10 frases que aparecen en cada reunión y cada hilo de correo.",
    culture:
      "La cultura empresarial en español es generalmente más formal que en inglés: el «usted» se mantiene con clientes y superiores hasta que ellos inviten a tutearse. Evita las reuniones improvisadas: agenda con 24-48 horas de anticipación. Los correos electrónicos en español suelen ser más largos y contextuales que en inglés — un buen correo de negocios comienza con un «Espero que esté bien» y termina con un «Quedo a la espera de su respuesta». La puntualidad varía: España y Chile son puntuales, México y Argentina suelen empezar 15-30 minutos tarde.",
    howTo:
      "Dedica 5-7 días al mazo de negocios antes de tu primera reunión en español. Repasa las 10 frases con repetición espaciada hasta que puedas producirlas en frío, luego practica las plantillas de correo en voz alta. En la vida real, escucha el registro que usan tus colegas y hazlo espejo — si ellos dicen «agendemos», tú dices «agendemos»; si ellos dicen «conversamos», tú dices «conversamos». El bucle diario de 10 minutos más una reunión real por semana es suficiente para alcanzar español profesional de trabajo en 3 meses.",
    conversation: [
      { speaker: "A", en: "Good morning. Thanks for joining. I have a brief agenda.", tgt: "Buenos días. Gracias por unirse. Tengo una agenda breve.", romanization: "" },
      { speaker: "B", en: "Sure, please go ahead.", tgt: "Por supuesto, adelante.", romanization: "" },
      { speaker: "A", en: "First, the Q3 launch status. Then, the budget. Finally, open questions.", tgt: "Primero, el estado del lanzamiento del Q3. Luego, el presupuesto. Finalmente, preguntas abiertas.", romanization: "" },
      { speaker: "B", en: "Sounds good. I'll send the agenda and pre-read via email.", tgt: "Perfecto. Enviaré la agenda y la documentación previa por correo.", romanization: "" },
    ],
    phrases: [
      { en: "Let's schedule a meeting for next Tuesday.", tgt: "Programemos una reunión para el martes que viene." },
      { en: "Could you send me the agenda?", tgt: "¿Puede enviarme la agenda?" },
      { en: "I'll follow up via email.", tgt: "Le haré seguimiento por correo." },
      { en: "Let's touch base next week.", tgt: "Volvamos a hablar la próxima semana." },
      { en: "I'd like to propose a deadline of [X].", tgt: "Quisiera proponer una fecha límite de [X]." },
      { en: "Can we move the meeting to [time]?", tgt: "¿Podemos mover la reunión a las [hora]?" },
      { en: "What's the status on the [project]?", tgt: "¿Cómo va el [proyecto]?" },
      { en: "I have a question about the contract.", tgt: "Tengo una pregunta sobre el contrato." },
      { en: "Thank you for your time.", tgt: "Gracias por su tiempo." },
      { en: "Let's circle back on this.", tgt: "Volvamos a tratar este tema." },
    ],
  },
  food: {
    title: "Frases de comida en español — restaurantes, pedir, pagar",
    subtitle:
      "Pedir en restaurantes, restricciones dietéticas, pedir la cuenta y felicitar al chef.",
    intro:
      "La comida es la forma más rápida de sentirse en casa en un nuevo idioma. Las 10 frases de este mazo cubren el caso del 95%: entrar en un restaurante, pedir, preguntar por alergias, pagar y salir. Tanto si estás en un bar de Madrid como en una fonda mexicana, una parrilla argentina o un café colombiano, el guion es el mismo — y el registro de cortesía es indulgente: los camareros en países hispanohablantes esperan preguntas simples y responden bien al lenguaje directo y educado. El mazo de comida de LangOria está construido alrededor de las 10 frases que aparecen en cada comida fuera.",
    culture:
      "En España, el camarero te pregunta «¿Qué va a tomar?» al sentarte — listo para pedir. En México, te dan más tiempo y vuelven después. El pan y las tapas son comunes en España, pero no en Latinoamérica. La propina varía: en España 5-10% redondeando (o nada), en México 10-15% (el 10% a veces viene incluido en la cuenta como «servicio»), en Argentina no se espera propina. Si tienes restricciones, dilo claramente al principio: «Soy alérgico a los frutos secos» o «Soy vegetariano» — los chefs suelen estar encantados de adaptar.",
    howTo:
      "Dedica 2-3 días al mazo de comida antes de cualquier visita a un restaurante. Practica el diálogo en voz alta con un compañero o una grabación; el español de restaurante es memoria muscular, no gramática. En el momento, entra con un guion claro: «Mesa para [X], por favor» → «¿Puedo ver la carta?» → «Voy a pedir [X], por favor» → «La cuenta, por favor» → «Estaba delicioso, gracias». El bucle diario de 10 minutos es suficiente.",
    conversation: [
      { speaker: "A", en: "Hi, table for two, please.", tgt: "Hola, una mesa para dos, por favor.", romanization: "" },
      { speaker: "B", en: "Of course. Right this way. Here's the menu.", tgt: "Por supuesto. Por aquí. Aquí tiene la carta.", romanization: "" },
      { speaker: "A", en: "Thank you. What do you recommend?", tgt: "Gracias. ¿Qué recomienda?", romanization: "" },
      { speaker: "B", en: "The fish is excellent today. Are you allergic to anything?", tgt: "El pescado está excelente hoy. ¿Es alérgico a algo?", romanization: "" },
    ],
    phrases: [
      { en: "Could I see the menu, please?", tgt: "¿Puedo ver la carta, por favor?" },
      { en: "What do you recommend?", tgt: "¿Qué recomienda?" },
      { en: "I'm allergic to [X].", tgt: "Soy alérgico a [X]." },
      { en: "Could I have the bill, please?", tgt: "La cuenta, por favor." },
      { en: "Is this dish spicy?", tgt: "¿Este plato es picante?" },
      { en: "I'll have [X], please.", tgt: "Voy a pedir [X], por favor." },
      { en: "Can I get this to go?", tgt: "¿Me lo puede llevar para llevar?" },
      { en: "Is the tip included?", tgt: "¿Está incluida la propina?" },
      { en: "I'm a vegetarian.", tgt: "Soy vegetariano." },
      { en: "That was delicious, thank you.", tgt: "Estaba delicioso, gracias." },
    ],
  },
  "small-talk": {
    title: "Conversación ligera en español — presentaciones y hobbies",
    subtitle:
      "Saludos, presentaciones, pasatiempos y las frases que convierten a un desconocido en un amigo.",
    intro:
      "La conversación ligera es la puerta de entrada de la fluidez en español. Las 10 frases de este mazo son las que aparecen en cada ascensor, cada cola de café, cada recepción de conferencia y cada primera cita: presentarte, preguntar a qué se dedica alguien, hablar del tiempo y encontrar puntos en común. Tanto si estás en un evento de networking en Madrid, una fiesta en Buenos Aires o una sala de espera en Bogotá, el guion es el mismo — y el registro de cortesía está bien calibrado: la conversación ligera en español es amigable pero no íntima, y las 10 frases aquí te mantendrán en la zona correcta. El mazo de conversación ligera de LangOria está construido alrededor de las 10 frases que te hacen sonar como un par, no como un turista.",
    culture:
      "En los países hispanohablantes, «¿Cómo te llamas?» es el primer acercamiento estándar, seguido de «¿De dónde eres?» y «¿A qué te dedicas?». A diferencia del inglés, en español se usa «tú» rápidamente — en una fiesta es habitual tutearse desde la primera conversación. El «abrazo» (abrazo de un solo lado) y los dos besos (en España) o un solo beso (en muchos países latinoamericanos) son los saludos estándar. Evita el falso amigo «embarazada» (pregnant, not embarrassed — di «tengo vergüenza» o «estoy avergonzado» en su lugar).",
    howTo:
      "Dedica 3-5 días al mazo de conversación ligera. Practica el diálogo en voz alta con un compañero o una grabación; el truco está en sonar natural, no correcto. El bucle diario de 10 minutos es suficiente — pero usa al menos una frase en la vida real cada día, aunque sea un «¡Qué bien!» al camarero. La conversación ligera es un hábito, no un vocabulario, y el hábito se transfiere entre países hispanohablantes.",
    conversation: [
      { speaker: "A", en: "Hi, my name is Sarah. Nice to meet you.", tgt: "Hola, me llamo Sarah. Mucho gusto.", romanization: "" },
      { speaker: "B", en: "Nice to meet you too. I'm David. What do you do?", tgt: "Mucho gusto. Yo soy David. ¿A qué se dedica?", romanization: "" },
      { speaker: "A", en: "I'm a software engineer. How about you?", tgt: "Soy ingeniera de software. ¿Y usted?", romanization: "" },
      { speaker: "B", en: "I work in marketing. Have you seen any good movies lately?", tgt: "Trabajo en marketing. ¿Ha visto alguna buena película últimamente?", romanization: "" },
    ],
    phrases: [
      { en: "Hi, my name is [X]. Nice to meet you.", tgt: "Hola, me llamo [X]. Mucho gusto." },
      { en: "What do you do for a living?", tgt: "¿A qué se dedica?" },
      { en: "Where are you from?", tgt: "¿De dónde es?" },
      { en: "What are your hobbies?", tgt: "¿Cuáles son sus aficiones?" },
      { en: "Have you seen any good movies lately?", tgt: "¿Ha visto alguna buena película últimamente?" },
      { en: "How was your weekend?", tgt: "¿Qué tal el fin de semana?" },
      { en: "Do you have any plans for the weekend?", tgt: "¿Tiene planes para el fin de semana?" },
      { en: "What kind of music do you like?", tgt: "¿Qué tipo de música le gusta?" },
      { en: "It's nice weather today, isn't it?", tgt: "Hace buen tiempo hoy, ¿verdad?" },
      { en: "It was lovely talking to you.", tgt: "Fue un placer charlar con usted.", romanization: "" },
    ],
  },
};

// ---------------------------------------------------------------------------
// French scenarios. Phrasing is Metropolitan French (vous form) where
// politeness register matters and "tu" where small-talk intimacy applies.
// The two-letter connector liaison marks (e.g. "vous_avez") are not
// shown — French speakers produce them naturally from listening.
// ---------------------------------------------------------------------------

const SCENARIOS_FR: Record<ScenarioKey, ScenarioContent> = {
  travel: {
    title: "Phrases de voyage en français — aéroport, hôtel, indications",
    subtitle:
      "Les 10 phrases françaises pour 95% de tout voyage: aéroport, hôtel, taxi et demandes d'indications.",
    intro:
      "Le français de voyage est le français au meilleur rapport effort-résultat: les mêmes 50 phrases vous mènent à travers l'aéroport, l'hôtel, le taxi, le restaurant et l'accueil d'une ambassade. Que vous voliez vers Paris, Montréal, Dakar ou Bruxelles, le français pratique du voyage est le même — et le maîtriser fait la différence entre un voyage stressant et un voyage qui coule. Les 10 phrases du jeu de voyage de LangOria sont celles dont vous avez réellement besoin, pas les 1000 dont vous pourriez avoir besoin un jour. Chaque phrase est accompagnée d'un audio d'ombroscopie, d'un dialogue exemple et d'un conseil culturel.",
    culture:
      "Dans les pays francophones, la politesse commence par « bonjour » — entrer dans un commerce sans dire « bonjour » est considéré comme impoli, et c'est souvent la première cause de froideur dans une interaction. En France, on tutoie rarement un inconnu; on garde le « vous » jusqu'à ce que l'interlocuteur propose le « tu ». Le pourboire n'est pas obligatoire: en France le service est inclus (mention « service compris » sur l'addition); en Suisse et au Québec on arrondit à 5 CHF / 2-3 CAD. Dans les menus, « entrée / plat / dessert » est la structure standard.",
    howTo:
      "Consacrez 3-5 jours au jeu de voyage avant tout déplacement. Révisez les 10 phrases avec la répétition espacée jusqu'à ce qu'elles soient automatiques, puis pratiquez le dialogue à voix haute avec un partenaire ou un enregistrement. En voyage, essayez d'utiliser chaque phrase au moins une fois dans la vie réelle — la mémoire musculaire de parler français à un inconnu se construit dans l'instant, pas dans l'application. La boucle quotidienne de 10 minutes suffit.",
    conversation: [
      { speaker: "A", en: "Excuse me, where is the airport?", tgt: "Excusez-moi, où est l'aéroport?", romanization: "" },
      { speaker: "B", en: "Take the RER B south. It's about 40 minutes.", tgt: "Prenez le RER B en direction du sud. C'est environ 40 minutes.", romanization: "" },
      { speaker: "A", en: "Thank you. How much is a ticket?", tgt: "Merci. Combien coûte un billet?", romanization: "" },
      { speaker: "B", en: "11,80 euros. You can use a Navigo card or contactless.", tgt: "11,80 euros. Vous pouvez utiliser une carte Navigo ou sans contact.", romanization: "" },
    ],
    phrases: [
      { en: "Excuse me, where is the airport?", tgt: "Excusez-moi, où est l'aéroport?" },
      { en: "I have a reservation under the name [X].", tgt: "J'ai une réservation au nom de [X]." },
      { en: "Could I have the check, please?", tgt: "L'addition, s'il vous plaît." },
      { en: "How do I get to [place]?", tgt: "Comment aller à [lieu]?" },
      { en: "Is there a train station nearby?", tgt: "Y a-t-il une gare près d'ici?" },
      { en: "I would like to check in.", tgt: "Je voudrais m'enregistrer." },
      { en: "What time does the flight leave?", tgt: "À quelle heure part le vol?" },
      { en: "I'm lost. Can you help me?", tgt: "Je suis perdu. Pouvez-vous m'aider?" },
      { en: "How much is a ticket to [place]?", tgt: "Combien coûte un billet pour [lieu]?" },
      { en: "Where is the bathroom?", tgt: "Où sont les toilettes?" },
    ],
  },
  business: {
    title: "Français des affaires — réunions, e-mails, suivi",
    subtitle:
      "Phrases professionnelles pour la journée de travail: planifier, ordres du jour, suivi et compétences relationnelles qui vous font promouvoir.",
    intro:
      "Le français des affaires est la différence entre être compris au travail et être de confiance au travail. Le vocabulaire des réunions, des e-mails et des suivis est un ensemble petit et fini — les mêmes 50 phrases couvrent 90% de la communication professionnelle en français. Que vous rédigiez un rapport d'état, ouvriez une réunion du lundi ou négociiez un délai, la bonne phrase au bon registre est ce qui vous fait ressembler à un pair, pas à un étranger. Le jeu de français des affaires de LangOria est construit autour des 10 phrases qui reviennent dans chaque réunion et chaque fil d'e-mail.",
    culture:
      "La culture d'entreprise en français est plus formelle qu'en anglais: le « vous » se maintient avec les clients et les supérieurs jusqu'à ce qu'ils proposent le « tu ». Évitez les réunions improvisées: prévenez 24-48 heures à l'avance. Les e-mails professionnels en français sont généralement plus longs et plus contextuels qu'en anglais — un bon e-mail commence par « J'espère que vous allez bien » et se termine par « Je reste à votre disposition ». La ponctualité est plus stricte en Suisse et en Allemagne qu'en France; au Sénégal et en Côte d'Ivoire, les réunions peuvent commencer 15-30 minutes après l'heure.",
    howTo:
      "Consacrez 5-7 jours au jeu des affaires avant votre première réunion en français. Révisez les 10 phrases avec la répétition espacée jusqu'à ce que vous puissiez les produire à froid, puis pratiquez les modèles d'e-mail à voix haute. En pratique, écoutez le registre que vos collègues utilisent et reproduisez-le — s'ils disent « on fait le point », vous dites « on fait le point »; s'ils disent « on se cale », vous dites « on se cale ». La boucle quotidienne de 10 minutes plus une vraie réunion par semaine suffit pour atteindre un français professionnel de travail en 3 mois.",
    conversation: [
      { speaker: "A", en: "Good morning. Thanks for joining. I have a brief agenda.", tgt: "Bonjour. Merci d'être présents. J'ai un ordre du jour bref.", romanization: "" },
      { speaker: "B", en: "Sure, please go ahead.", tgt: "Bien sûr, allez-y.", romanization: "" },
      { speaker: "A", en: "First, the Q3 launch status. Then, the budget. Finally, open questions.", tgt: "D'abord, le statut du lancement Q3. Ensuite, le budget. Enfin, les questions ouvertes.", romanization: "" },
      { speaker: "B", en: "Sounds good. I'll send the agenda and pre-read via email.", tgt: "Parfait. J'enverrai l'ordre du jour et la documentation préalable par e-mail.", romanization: "" },
    ],
    phrases: [
      { en: "Let's schedule a meeting for next Tuesday.", tgt: "Planifions une réunion pour mardi prochain." },
      { en: "Could you send me the agenda?", tgt: "Pouvez-vous m'envoyer l'ordre du jour?" },
      { en: "I'll follow up via email.", tgt: "Je ferai un suivi par e-mail." },
      { en: "Let's touch base next week.", tgt: "Reprenons contact la semaine prochaine." },
      { en: "I'd like to propose a deadline of [X].", tgt: "Je voudrais proposer un délai de [X]." },
      { en: "Can we move the meeting to [time]?", tgt: "Pouvons-nous déplacer la réunion à [heure]?" },
      { en: "What's the status on the [project]?", tgt: "Où en est le [projet]?" },
      { en: "I have a question about the contract.", tgt: "J'ai une question sur le contrat." },
      { en: "Thank you for your time.", tgt: "Merci pour votre temps." },
      { en: "Let's circle back on this.", tgt: "Revenons sur ce sujet." },
    ],
  },
  food: {
    title: "Phrases de restauration en français — restaurants, commander, payer",
    subtitle:
      "Commander au restaurant, restrictions alimentaires, demander l'addition et féliciter le chef.",
    intro:
      "La nourriture est le moyen le plus rapide de se sentir chez soi dans une nouvelle langue. Les 10 phrases de ce jeu couvrent le cas à 95%: entrer dans un restaurant, commander, demander pour les allergies, payer et partir. Que vous soyez dans un bistrot parisien, une brasserie québécoise, un restaurant sénégalais ou un café belge, le script est le même — et le registre de politesse est indulgent: les serveurs dans les pays francophones attendent des questions simples et répondent bien à un langage direct et poli. Le jeu de nourriture de LangOria est construit autour des 10 phrases qui reviennent à chaque repas au restaurant.",
    culture:
      "En France, le serveur vous demandera « Vous avez choisi? » quand il pense que vous êtes prêt — ne soyez pas surpris s'il revient 2-3 fois. Au Québec, on dit « la facture » au lieu de « l'addition ». Le pain est systématiquement apporté en France (et souvent facturé 1-2€), au Québec on l'offre. La propina n'est pas obligatoire en France (le service est inclus); au Québec on laisse 15-20% (« laisser un pourboire »). Pour les restrictions, annoncez clairement dès le début: « Je suis allergique aux fruits à coque » ou « Je suis végétarien » — les chefs s'adaptent volontiers.",
    howTo:
      "Consacrez 2-3 jours au jeu de nourriture avant toute visite au restaurant. Pratiquez le dialogue à voix haute avec un partenaire ou un enregistrement; le français de restaurant est une mémoire musculaire, pas une grammaire. Au moment, entrez avec un script clair: « Une table pour [X], s'il vous plaît » → « Je peux voir le menu? » → « Je vais prendre [X], s'il vous plaît » → « L'addition, s'il vous plaît » → « C'était délicieux, merci ». La boucle quotidienne de 10 minutes suffit.",
    conversation: [
      { speaker: "A", en: "Hi, table for two, please.", tgt: "Bonjour, une table pour deux, s'il vous plaît.", romanization: "" },
      { speaker: "B", en: "Of course. Right this way. Here's the menu.", tgt: "Bien sûr. Par ici. Voici le menu.", romanization: "" },
      { speaker: "A", en: "Thank you. What do you recommend?", tgt: "Merci. Que recommandez-vous?", romanization: "" },
      { speaker: "B", en: "The fish is excellent today. Are you allergic to anything?", tgt: "Le poisson est excellent aujourd'hui. Êtes-vous allergique à quelque chose?", romanization: "" },
    ],
    phrases: [
      { en: "Could I see the menu, please?", tgt: "Puis-je voir le menu, s'il vous plaît?" },
      { en: "What do you recommend?", tgt: "Que recommandez-vous?" },
      { en: "I'm allergic to [X].", tgt: "Je suis allergique à [X]." },
      { en: "Could I have the bill, please?", tgt: "L'addition, s'il vous plaît." },
      { en: "Is this dish spicy?", tgt: "Ce plat est-il épicé?" },
      { en: "I'll have [X], please.", tgt: "Je vais prendre [X], s'il vous plaît." },
      { en: "Can I get this to go?", tgt: "Puis-je l'emporter?" },
      { en: "Is the tip included?", tgt: "Le pourboire est-il inclus?" },
      { en: "I'm a vegetarian.", tgt: "Je suis végétarien." },
      { en: "That was delicious, thank you.", tgt: "C'était délicieux, merci." },
    ],
  },
  "small-talk": {
    title: "Petite conversation en français — présentations et loisirs",
    subtitle:
      "Salutations, présentations, loisirs et les phrases qui transforment un inconnu en ami.",
    intro:
      "La petite conversation est la porte d'entrée de la fluidité en français. Les 10 phrases de ce jeu sont celles qui reviennent dans chaque ascenseur, chaque file d'attente, chaque réception de conférence et chaque premier rendez-vous: vous présenter, demander ce que quelqu'un fait, parler du temps et trouver des terrains d'entente. Que vous soyez à un événement de networking à Paris, une fête à Montréal ou une salle d'attente à Dakar, le script est le même — et le registre de politesse est bien calibré: la conversation légère en français est amicale mais pas intime, et les 10 phrases ici vous maintiendront dans la bonne zone. Le jeu de conversation légère de LangOria est construit autour des 10 phrases qui vous font ressembler à un pair, pas à un touriste.",
    culture:
      "Dans les pays francophones, le « bonjour » initial est sacré — sans lui, toute la suite est mal reçue. « Comment allez-vous? » est un rituel de politesse, pas une vraie question — répondre « Bien, merci, et vous? » suffit, et l'interlocuteur enchaîne. En France, on garde le « vous » en contexte professionnel ou avec des inconnus; le « tu » se propose naturellement dans un groupe d'amis ou après un moment partagé. La bise (deux, trois ou quatre fois selon la région) est le salut entre amis et collègues proches. Évitez le faux ami « bibliothèque » (library, not bookshop — c'est « librairie »).",
    howTo:
      "Consacrez 3-5 jours au jeu de conversation légère. Pratiquez le dialogue à voix haute avec un partenaire ou un enregistrement; l'astuce est de sonner naturel, pas correct. La boucle quotidienne de 10 minutes suffit — mais utilisez au moins une phrase dans la vie réelle chaque jour, même si c'est juste un « Bonne journée! » au boulanger. La conversation légère est une habitude, pas un vocabulaire, et l'habitude se transfère entre pays francophones.",
    conversation: [
      { speaker: "A", en: "Hi, my name is Sarah. Nice to meet you.", tgt: "Bonjour, je m'appelle Sarah. Enchantée.", romanization: "" },
      { speaker: "B", en: "Nice to meet you too. I'm David. What do you do?", tgt: "Enchanté. Je suis David. Que faites-vous dans la vie?", romanization: "" },
      { speaker: "A", en: "I'm a software engineer. How about you?", tgt: "Je suis ingénieure logicielle. Et vous?", romanization: "" },
      { speaker: "B", en: "I work in marketing. Have you seen any good movies lately?", tgt: "Je travaille dans le marketing. Avez-vous vu un bon film récemment?", romanization: "" },
    ],
    phrases: [
      { en: "Hi, my name is [X]. Nice to meet you.", tgt: "Bonjour, je m'appelle [X]. Enchanté(e)." },
      { en: "What do you do for a living?", tgt: "Que faites-vous dans la vie?" },
      { en: "Where are you from?", tgt: "D'où venez-vous?" },
      { en: "What are your hobbies?", tgt: "Quels sont vos hobbies?" },
      { en: "Have you seen any good movies lately?", tgt: "Avez-vous vu un bon film récemment?" },
      { en: "How was your weekend?", tgt: "Comment était votre week-end?" },
      { en: "Do you have any plans for the weekend?", tgt: "Avez-vous des projets pour le week-end?" },
      { en: "What kind of music do you like?", tgt: "Quel genre de musique aimez-vous?" },
      { en: "It's nice weather today, isn't it?", tgt: "Il fait beau aujourd'hui, n'est-ce pas?" },
      { en: "It was lovely talking to you.", tgt: "C'était un plaisir de discuter avec vous." },
    ],
  },
};

// ---------------------------------------------------------------------------
// German scenarios. Phrasing uses the formal "Sie" register where
// politeness matters and "du" where small-talk intimacy applies.
// All nouns are capitalised per German orthography.
// ---------------------------------------------------------------------------

const SCENARIOS_DE: Record<ScenarioKey, ScenarioContent> = {
  travel: {
    title: "Reise-Phrasen auf Deutsch — Flughafen, Hotel, Wegbeschreibungen",
    subtitle:
      "Die 10 deutschen Sätze für 95% jeder Reise: Flughafen, Hotel, Taxi und nach dem Weg fragen.",
    intro:
      "Reise-Deutsch ist das Deutsch mit dem besten Aufwand-Nutzen-Verhältnis: dieselben 50 Sätze bringen Sie durch den Flughafen, das Hotel, das Taxi, das Restaurant und den Empfang einer Botschaft. Egal ob Sie nach Berlin, Wien, Zürich oder München fliegen — das praktische Reise-Deutsch ist dasselbe, und es zu beherrschen ist der Unterschied zwischen einer stressigen und einer fließenden Reise. LangOrias Reise-Phrasen-Set konzentriert sich auf die 10 Sätze, die Sie tatsächlich brauchen, nicht auf die 1000, die Sie vielleicht irgendwann brauchen könnten. Jede Phrase kommt mit Audio, einem Beispieldialog und einem Kulturhinweis.",
    culture:
      "In Deutschland, Österreich und der Schweiz beginnt jede Interaktion mit «Hallo» oder «Guten Tag» — ohne Gruß direkt nach etwas zu fragen gilt als unhöflich. Das «Sie» bleibt mit Fremden und im beruflichen Kontext, bis man auf das «Du» eingeladen wird. Trinkgeld ist üblich, aber nicht obligatorisch: in Deutschland und Österreich rundet man auf 5-10% auf; in der Schweiz ist Trinkgeld selten und oft im Service inbegriffen («Service inklusive»). In den Speisekarten ist die Reihenfolge «Vorspeise / Hauptgang / Nachspeise» Standard.",
    howTo:
      "Widmen Sie 3-5 Tage dem Reise-Set vor jeder Reise. Lernen Sie die 10 Sätze mit Spaced Repetition, bis sie automatisch kommen, und üben Sie dann den Dialog laut mit einem Partner oder einer Aufnahme. Auf der Reise selbst versuchen Sie, jeden Satz mindestens einmal im wirklichen Leben zu benutzen — das Muskelgedächtnis, mit einem Fremden Deutsch zu sprechen, entsteht im Moment, nicht in der App. Die tägliche 10-Minuten-Routine reicht.",
    conversation: [
      { speaker: "A", en: "Excuse me, where is the airport?", tgt: "Entschuldigen Sie, wo ist der Flughafen?" },
      { speaker: "B", en: "Take the S-Bahn line 8 or 9. It's about 40 minutes.", tgt: "Nehmen Sie die S-Bahn Linie 8 oder 9. Es sind ungefähr 40 Minuten." },
      { speaker: "A", en: "Thank you. How much is a ticket?", tgt: "Danke. Wie viel kostet eine Fahrkarte?" },
      { speaker: "B", en: "4,40 euros. You can use the contactless card at the turnstile.", tgt: "4,40 Euro. Sie können die kontaktlose Karte am Drehkreuz benutzen." },
    ],
    phrases: [
      { en: "Excuse me, where is the airport?", tgt: "Entschuldigen Sie, wo ist der Flughafen?" },
      { en: "I have a reservation under the name [X].", tgt: "Ich habe eine Reservierung auf den Namen [X]." },
      { en: "Could I have the check, please?", tgt: "Die Rechnung, bitte." },
      { en: "How do I get to [place]?", tgt: "Wie komme ich zu [Ort]?" },
      { en: "Is there a train station nearby?", tgt: "Gibt es einen Bahnhof in der Nähe?" },
      { en: "I would like to check in.", tgt: "Ich möchte einchecken." },
      { en: "What time does the flight leave?", tgt: "Wann geht der Flug?" },
      { en: "I'm lost. Can you help me?", tgt: "Ich habe mich verlaufen. Können Sie mir helfen?" },
      { en: "How much is a ticket to [place]?", tgt: "Wie viel kostet eine Fahrkarte nach [Ort]?" },
      { en: "Where is the bathroom?", tgt: "Wo ist die Toilette?" },
    ],
  },
  business: {
    title: "Geschäftsdeutsch — Meetings, E-Mails, Follow-ups",
    subtitle:
      "Professionelle Sätze für den Arbeitsalltag: Termine planen, Tagesordnungen, Follow-ups und Soft Skills, die Sie befördern.",
    intro:
      "Geschäftsdeutsch ist der Unterschied zwischen im Beruf verstanden und im Beruf vertraut zu werden. Der Wortschatz für Meetings, E-Mails und Follow-ups ist eine kleine, endliche Menge — dieselben 50 Sätze decken 90% der beruflichen Kommunikation auf Deutsch ab. Ob Sie einen Statusbericht schreiben, ein Montags-Meeting eröffnen oder eine Deadline verhandeln, der richtige Satz im richtigen Register ist das, was Sie wie einen Kollegen wirken lässt, nicht wie einen Ausländer. LangOrias Geschäftsdeutsch-Set ist um die 10 Sätze gebaut, die in jedem Meeting und jeder E-Mail-Kette vorkommen.",
    culture:
      "Die Geschäftskultur im deutschsprachigen Raum ist formeller als im Englischen: das «Sie» bleibt mit Kunden und Vorgesetzten, bis sie auf das «Du» anstoßen. Vermeiden Sie spontane Meetings: kündigen Sie 24-48 Stunden im Voraus an. Geschäfts-E-Mails auf Deutsch sind in der Regel länger und kontextueller als auf Englisch — eine gute E-Mail beginnt mit «Ich hoffe, es geht Ihnen gut» und endet mit «Mit freundlichen Grüßen». Pünktlichkeit ist im deutschsprachigen Raum sehr wichtig: 5 Minuten zu spät gilt bereits als verspätet. «Smalltalk» vor Meetings ist kürzer als in den USA — kommen Sie schnell zum Thema.",
    howTo:
      "Widmen Sie 5-7 Tage dem Geschäftsset vor Ihrem ersten Meeting auf Deutsch. Lernen Sie die 10 Sätze mit Spaced Repetition, bis Sie sie kalt produzieren können, und üben Sie dann die E-Mail-Vorlagen laut. Im Arbeitsalltag hören Sie auf das Register, das Ihre Kollegen verwenden, und spiegeln es — wenn sie «Lass uns mal schauen» sagen, sagen Sie auch «Lass uns mal schauen». Die tägliche 10-Minuten-Routine plus ein echtes Meeting pro Woche reichen aus, um in 3 Monaten berufstaugliches Geschäftsdeutsch zu erreichen.",
    conversation: [
      { speaker: "A", en: "Good morning. Thanks for joining. I have a brief agenda.", tgt: "Guten Morgen. Danke fürs Kommen. Ich habe eine kurze Tagesordnung." },
      { speaker: "B", en: "Sure, please go ahead.", tgt: "Gerne, fahren Sie fort." },
      { speaker: "A", en: "First, the Q3 launch status. Then, the budget. Finally, open questions.", tgt: "Zuerst der Q3-Launch-Status, dann das Budget, zum Schluss offene Fragen." },
      { speaker: "B", en: "Sounds good. I'll send the agenda and pre-read via email.", tgt: "Gut. Ich schicke die Tagesordnung und die Vorab-Unterlagen per E-Mail." },
    ],
    phrases: [
      { en: "Let's schedule a meeting for next Tuesday.", tgt: "Lassen Sie uns ein Meeting für nächsten Dienstag planen." },
      { en: "Could you send me the agenda?", tgt: "Können Sie mir die Tagesordnung schicken?" },
      { en: "I'll follow up via email.", tgt: "Ich melde mich per E-Mail nochmal." },
      { en: "Let's touch base next week.", tgt: "Lassen Sie uns nächste Woche wieder sprechen." },
      { en: "I'd like to propose a deadline of [X].", tgt: "Ich würde eine Deadline von [X] vorschlagen." },
      { en: "Can we move the meeting to [time]?", tgt: "Können wir das Meeting auf [Uhrzeit] verschieben?" },
      { en: "What's the status on the [project]?", tgt: "Wie ist der Stand bei [Projekt]?" },
      { en: "I have a question about the contract.", tgt: "Ich habe eine Frage zum Vertrag." },
      { en: "Thank you for your time.", tgt: "Vielen Dank für Ihre Zeit." },
      { en: "Let's circle back on this.", tgt: "Lassen Sie uns darauf zurückkommen." },
    ],
  },
  food: {
    title: "Restaurant-Phrasen auf Deutsch — bestellen, bezahlen, Allergien",
    subtitle:
      "Im Restaurant bestellen, auf Allergien hinweisen, die Rechnung bestellen und dem Koch ein Kompliment machen.",
    intro:
      "Essen ist der schnellste Weg, sich in einer neuen Sprache zu Hause zu fühlen. Die 10 Sätze in diesem Set decken den 95%-Fall ab: ein Restaurant betreten, bestellen, nach Allergien fragen, bezahlen und gehen. Egal ob Sie in einer Berliner Eckkneipe, einem Wiener Kaffeehaus, einem Zürcher Restaurant oder einem Münchner Biergarten sitzen — der Ablauf ist derselbe, und das Höflichkeitsregister ist nachsichtig: Kellner im deutschsprachigen Raum erwarten einfache Fragen und reagieren gut auf direkte, höfliche Sprache. LangOrias Restaurant-Set ist um die 10 Sätze gebaut, die bei jeder auswärtigen Mahlzeit vorkommen.",
    culture:
      "Im deutschsprachigen Raum ist es üblich, dass der Kellner am Anfang kommt und nach den Getränken fragt (« Was darf es sein? » oder « Was möchten Sie trinken? »). Er kommt erst wieder, wenn er sieht, dass Sie bereit sind — oder Sie signalisieren mit einem leichten Blickkontakt oder einem diskreten Handzeichen, dass Sie bestellen möchten. « Die Rechnung, bitte » oder « Zahlen, bitte » ist Standard. In der Schweiz sagt man « Die Rechnung, bitte » und der Service ist oft inklusive; in Deutschland und Österreich rundet man auf 5-10% auf. Für Allergien sagen Sie deutlich am Anfang: « Ich bin allergisch gegen Nüsse » oder « Ich bin Vegetarier » — Köche passen gerne an.",
    howTo:
      "Widmen Sie 2-3 Tage dem Restaurant-Set vor jedem Restaurantbesuch. Üben Sie den Dialog laut mit einem Partner oder einer Aufnahme; Restaurant-Deutsch ist Muskelgedächtnis, nicht Grammatik. Im Moment betreten Sie mit einem klaren Skript: « Einen Tisch für [X], bitte » → « Kann ich die Speisekarte sehen? » → « Ich nehme [X], bitte » → « Die Rechnung, bitte » → « Das war köstlich, danke ». Die tägliche 10-Minuten-Routine reicht.",
    conversation: [
      { speaker: "A", en: "Hi, table for two, please.", tgt: "Hallo, einen Tisch für zwei, bitte." },
      { speaker: "B", en: "Of course. Right this way. Here's the menu.", tgt: "Gerne. Bitte hier entlang. Hier ist die Speisekarte." },
      { speaker: "A", en: "Thank you. What do you recommend?", tgt: "Danke. Was empfehlen Sie?" },
      { speaker: "B", en: "The fish is excellent today. Are you allergic to anything?", tgt: "Der Fisch ist heute ausgezeichnet. Sind Sie allergisch gegen etwas?" },
    ],
    phrases: [
      { en: "Could I see the menu, please?", tgt: "Kann ich bitte die Speisekarte sehen?" },
      { en: "What do you recommend?", tgt: "Was empfehlen Sie?" },
      { en: "I'm allergic to [X].", tgt: "Ich bin allergisch gegen [X]." },
      { en: "Could I have the bill, please?", tgt: "Die Rechnung, bitte." },
      { en: "Is this dish spicy?", tgt: "Ist dieses Gericht scharf?" },
      { en: "I'll have [X], please.", tgt: "Ich nehme [X], bitte." },
      { en: "Can I get this to go?", tgt: "Kann ich das zum Mitnehmen bekommen?" },
      { en: "Is the tip included?", tgt: "Ist das Trinkgeld inbegriffen?" },
      { en: "I'm a vegetarian.", tgt: "Ich bin Vegetarier." },
      { en: "That was delicious, thank you.", tgt: "Das war köstlich, danke." },
    ],
  },
  "small-talk": {
    title: "Smalltalk auf Deutsch — Vorstellungen und Hobbys",
    subtitle:
      "Begrüßungen, Vorstellungen, Hobbys und die Sätze, die einen Fremden in einen Freund verwandeln.",
    intro:
      "Smalltalk ist die Eingangstür zur deutschen Sprachgewandtheit. Die 10 Sätze in diesem Set sind die, die in jedem Aufzug, jeder Schlange, jedem Konferenzempfang und jedem ersten Date vorkommen: sich vorstellen, fragen, was jemand macht, über das Wetter reden und Gemeinsamkeiten finden. Egal ob Sie bei einem Networking-Event in Berlin, einer Party in Wien oder einem Wartezimmer in Zürich sind — der Ablauf ist derselbe, und das Höflichkeitsregister ist gut kalibriert: Smalltalk auf Deutsch ist freundlich, aber nicht intim, und die 10 Sätze hier halten Sie in der richtigen Zone. LangOrias Smalltalk-Set ist um die 10 Sätze gebaut, die Sie wie einen Kollegen wirken lassen, nicht wie einen Touristen.",
    culture:
      "Im deutschsprachigen Raum ist die direkte Frage nach dem Beruf (« Was machen Sie beruflich? ») am Anfang der meisten Smalltalk-Gespräche — anders als im Englischen wird sie hier nicht als aufdringlich empfunden. Das «Du» wird unter Erwachsenen seltener angeboten als im Englischen; Sie bleiben oft monatelang beim «Sie», bis der andere aktiv vorschlägt, sich zu duzen. Wetter ist ein sicheres Smalltalk-Thema; das Lieblingsessen, der Urlaub und der Beruf sind auch gute Themen. Vermeiden Sie das falsche Wort «aktuell» im Sinne von «currently» — das bedeutet auf Deutsch «derzeit». Nutzen Sie «derzeit» oder «gerade».",
    howTo:
      "Widmen Sie 3-5 Tage dem Smalltalk-Set. Üben Sie den Dialog laut mit einem Partner oder einer Aufnahme; der Trick ist, natürlich zu klingen, nicht korrekt. Die tägliche 10-Minuten-Routine reicht — aber benutzen Sie mindestens einen Satz pro Tag in der realen Welt, auch wenn es nur « Schönen Tag noch » zum Bäcker ist. Smalltalk ist eine Gewohnheit, kein Wortschatz, und die Gewohnheit überträgt sich zwischen Deutschland, Österreich und der Schweiz.",
    conversation: [
      { speaker: "A", en: "Hi, my name is Sarah. Nice to meet you.", tgt: "Hallo, ich heiße Sarah. Freut mich." },
      { speaker: "B", en: "Nice to meet you too. I'm David. What do you do?", tgt: "Freut mich auch. Ich bin David. Was machen Sie beruflich?" },
      { speaker: "A", en: "I'm a software engineer. How about you?", tgt: "Ich bin Softwareingenieurin. Und Sie?" },
      { speaker: "B", en: "I work in marketing. Have you seen any good movies lately?", tgt: "Ich arbeite im Marketing. Haben Sie in letzter Zeit einen guten Film gesehen?" },
    ],
    phrases: [
      { en: "Hi, my name is [X]. Nice to meet you.", tgt: "Hallo, ich heiße [X]. Freut mich." },
      { en: "What do you do for a living?", tgt: "Was machen Sie beruflich?" },
      { en: "Where are you from?", tgt: "Woher kommen Sie?" },
      { en: "What are your hobbies?", tgt: "Was sind Ihre Hobbys?" },
      { en: "Have you seen any good movies lately?", tgt: "Haben Sie in letzter Zeit einen guten Film gesehen?" },
      { en: "How was your weekend?", tgt: "Wie war Ihr Wochenende?" },
      { en: "Do you have any plans for the weekend?", tgt: "Haben Sie Pläne für das Wochenende?" },
      { en: "What kind of music do you like?", tgt: "Was für Musik mögen Sie?" },
      { en: "It's nice weather today, isn't it?", tgt: "Heute ist schönes Wetter, nicht wahr?" },
      { en: "It was lovely talking to you.", tgt: "Es war schön, mit Ihnen zu sprechen." },
    ],
  },
};

// ---------------------------------------------------------------------------
// Public lookup: url-slug (lang, scenario) → content.
// The lang param is the URL_SLUG_TO_DATA key (e.g. "english", "japanese").
// ---------------------------------------------------------------------------

export const SCENARIO_CONTENT: Record<string, Record<ScenarioKey, ScenarioContent> | undefined> = {
  english: SCENARIOS_EN,
  japanese: SCENARIOS_JA,
  chinese: SCENARIOS_ZH,
  korean: SCENARIOS_KO,
  spanish: SCENARIOS_ES,
  french: SCENARIOS_FR,
  german: SCENARIOS_DE,
};

/** Languages that currently have scenario content shipped. */
export const SCENARIO_LANGS = ["english", "japanese", "chinese", "korean", "spanish", "french", "german"] as const;
export type ScenarioLang = (typeof SCENARIO_LANGS)[number];
