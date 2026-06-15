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
// Public lookup: url-slug (lang, scenario) → content.
// The lang param is the URL_SLUG_TO_DATA key (e.g. "english", "japanese").
// ---------------------------------------------------------------------------

export const SCENARIO_CONTENT: Record<string, Record<ScenarioKey, ScenarioContent> | undefined> = {
  english: SCENARIOS_EN,
  japanese: SCENARIOS_JA,
  chinese: SCENARIOS_ZH,
};

/** Languages that currently have scenario content shipped. */
export const SCENARIO_LANGS = ["english", "japanese", "chinese"] as const;
export type ScenarioLang = (typeof SCENARIO_LANGS)[number];
