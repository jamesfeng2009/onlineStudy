import type { WordItem, QuizItem, ListeningItem, SpeakingPhrase } from "../types";

export const WORDS: WordItem[] = [
  // English
  { id: "w-en-1", word: "serendipity", translation: "意外的美好发现", phonetic: "/ˌsɛr.ənˈdɪp.ə.ti/", example: "Finding this book was pure serendipity.", language: "en" },
  { id: "w-en-2", word: "ephemeral", translation: "短暂的", phonetic: "/ɪˈfɛm.ər.əl/", example: "Cherry blossoms are ephemeral, lasting only a few days.", language: "en" },
  { id: "w-en-3", word: "resilient", translation: "有韧性的", phonetic: "/rɪˈzɪl.jənt/", example: "Children are remarkably resilient.", language: "en" },
  { id: "w-en-4", word: "endeavor", translation: "努力；尝试", phonetic: "/ɪnˈdɛv.ər/", example: "She will endeavor to finish on time.", language: "en" },
  { id: "w-en-5", word: "luminous", translation: "发光的；明亮的", phonetic: "/ˈluː.mɪ.nəs/", example: "The luminous moon lit the path.", language: "en" },
  { id: "w-en-6", word: "whimsical", translation: "异想天开的", phonetic: "/ˈwɪm.zɪ.kəl/", example: "A whimsical tale of talking cats.", language: "en" },
  { id: "w-en-7", word: "meticulous", translation: "一丝不苟的", phonetic: "/məˈtɪk.jə.ləs/", example: "He is meticulous about his work.", language: "en" },
  { id: "w-en-8", word: "eloquent", translation: "雄辩的", phonetic: "/ˈɛl.ə.kwənt/", example: "Her eloquent speech moved everyone.", language: "en" },
  { id: "w-en-9", word: "tranquil", translation: "宁静的", phonetic: "/ˈtræŋ.kwɪl/", example: "A tranquil morning by the lake.", language: "en" },
  { id: "w-en-10", word: "vivid", translation: "生动的", phonetic: "/ˈvɪv.ɪd/", example: "She has vivid memories of her childhood.", language: "en" },

  // Japanese
  { id: "w-ja-1", word: "桜（さくら）", translation: "樱花", example: "桜がきれいです。", language: "ja" },
  { id: "w-ja-2", word: "猫（ねこ）", translation: "猫", example: "猫が好きです。", language: "ja" },
  { id: "w-ja-3", word: "海（うみ）", translation: "海", example: "夏は海へ行きます。", language: "ja" },
  { id: "w-ja-4", word: "勉強（べんきょう）", translation: "学习", example: "日本語を勉強しています。", language: "ja" },
  { id: "w-ja-5", word: "夢（ゆめ）", translation: "梦想", example: "夢を追いかける。", language: "ja" },
  { id: "w-ja-6", word: "空（そら）", translation: "天空", example: "青い空が広がる。", language: "ja" },
  { id: "w-ja-7", word: "美しい（うつくしい）", translation: "美丽的", example: "美しい景色。", language: "ja" },
  { id: "w-ja-8", word: "優しい（やさしい）", translation: "温柔的", example: "彼女は優しい。", language: "ja" },

  // Korean
  { id: "w-ko-1", word: "사랑 (sarang)", translation: "爱", example: "사랑해요.", language: "ko" },
  { id: "w-ko-2", word: "친구 (chingu)", translation: "朋友", example: "친구를 만나요.", language: "ko" },
  { id: "w-ko-3", word: "음악 (eumak)", translation: "音乐", example: "음악을 들어요.", language: "ko" },
  { id: "w-ko-4", word: "여행 (yeohaeng)", translation: "旅行", example: "여행을 가요.", language: "ko" },
  { id: "w-ko-5", word: "행복 (haengbok)", translation: "幸福", example: "행복해요.", language: "ko" },
  { id: "w-ko-6", word: "커피 (keopi)", translation: "咖啡", example: "커피를 마셔요.", language: "ko" },
];

export const QUIZZES: QuizItem[] = [
  {
    id: "q-en-1",
    question: "She ___ to the gym every morning before work.",
    options: ["go", "goes", "going", "gone"],
    answer: 1,
    explain: "主语为第三人称单数 she，一般现在时动词加 -s。",
    language: "en",
  },
  {
    id: "q-en-2",
    question: "If I ___ rich, I would travel the world.",
    options: ["am", "was", "were", "be"],
    answer: 2,
    explain: "与现在事实相反的虚拟语气，be 动词统一用 were。",
    language: "en",
  },
  {
    id: "q-en-3",
    question: "This is the ___ book I have ever read.",
    options: ["more interesting", "most interesting", "interesting", "interestinger"],
    answer: 1,
    explain: "范围是 I have ever read，使用最高级 most interesting。",
    language: "en",
  },
  {
    id: "q-en-4",
    question: "He suggested that she ___ a doctor.",
    options: ["sees", "saw", "see", "seeing"],
    answer: 2,
    explain: "suggest 后 that 从句用 (should) + 动词原形。",
    language: "en",
  },
  {
    id: "q-en-5",
    question: "By next year, I ___ here for ten years.",
    options: ["will work", "will have worked", "work", "have worked"],
    answer: 1,
    explain: "by + 将来时间，主句用将来完成时 will have done。",
    language: "en",
  },
  {
    id: "q-ja-1",
    question: "私は毎日日本語を ___ います。",
    options: ["勉強する", "勉強して", "勉強した", "勉強しよう"],
    answer: 1,
    explain: "～ています 表示正在进行或习惯。",
    language: "ja",
  },
  {
    id: "q-ja-2",
    question: "これは ___ 本ですか。",
    options: ["なん", "なに", "どれ", "どこ"],
    answer: 0,
    explain: "修饰名词时用「なん」（なん本→何の本）。",
    language: "ja",
  },
  {
    id: "q-ja-3",
    question: "昨日、友達 ___ 映画を見ました。",
    options: ["と", "に", "が", "へ"],
    answer: 0,
    explain: "「と」表示共同做某事的对象，和…一起。",
    language: "ja",
  },
  {
    id: "q-ko-1",
    question: "저는 학생 ___ 입니다.",
    options: ["은", "는", "이", "가"],
    answer: 1,
    explain: "주어 학생은 받침으로 끝나지만 관용적으로 '학생은' 입니다（一般强调主题用 은/는）。",
    language: "ko",
  },
  {
    id: "q-ko-2",
    question: "오늘 날씨가 정말 ___ !",
    options: ["예뻐요", "예쁘다", "예쁘네요", "예쁜"],
    answer: 2,
    explain: "感叹句常用 -네요 结尾表评价与感叹。",
    language: "ko",
  },
];

export const LISTENING: ListeningItem[] = [
  {
    id: "l-en-1",
    title: "Morning Routine",
    script: "I wake up at seven every day. After breakfast, I take the subway to work. It usually takes about thirty minutes.",
    blanks: [
      { index: 3, answer: "seven" },
      { index: 9, answer: "subway" },
      { index: 15, answer: "minutes" },
    ],
    language: "en",
  },
  {
    id: "l-en-2",
    title: "Weekend Plan",
    script: "This Saturday, I want to visit a new coffee shop downtown and read a book in the park.",
    blanks: [
      { index: 2, answer: "Saturday" },
      { index: 9, answer: "coffee" },
      { index: 14, answer: "park" },
    ],
    language: "en",
  },
  {
    id: "l-ja-1",
    title: "週末の予定",
    script: "今週末は友達と一緒に京都へ行きます。桜を見ながら、お弁当を食べたいです。",
    blanks: [
      { index: 0, answer: "今週末" },
      { index: 7, answer: "京都" },
      { index: 11, answer: "桜" },
    ],
    language: "ja",
  },
  {
    id: "l-ko-1",
    title: "주말 계획",
    script: "주말에 친구들과 함께 영화를 보고 맛있는 식당에서 밥을 먹을 거예요.",
    blanks: [
      { index: 0, answer: "주말" },
      { index: 5, answer: "영화" },
      { index: 9, answer: "식당" },
    ],
    language: "ko",
  },
];

export const SPEAKING: SpeakingPhrase[] = [
  { id: "s-en-1", phrase: "Hello! Nice to meet you.", translation: "你好！很高兴认识你。", phonetic: "/həˈloʊ/ /naɪs/ /tə/ /mit/ /ju/", language: "en" },
  { id: "s-en-2", phrase: "How was your weekend?", translation: "你周末过得怎么样？", phonetic: "/haʊ/ /wʌz/ /jʊr/ /ˈwikˌɛnd/", language: "en" },
  { id: "s-en-3", phrase: "Could you repeat that, please?", translation: "你能重复一下吗？", phonetic: "/kʊd/ /ju/ /rɪˈpit/ /ðæt/", language: "en" },
  { id: "s-en-4", phrase: "I'm looking forward to it.", translation: "我很期待。", phonetic: "/aɪm/ /ˈlʊkɪŋ/ /ˈfɔrwərd/ /tə/ /ɪt/", language: "en" },
  { id: "s-ja-1", phrase: "はじめまして、よろしくお願いします。", translation: "初次见面，请多关照。", language: "ja" },
  { id: "s-ja-2", phrase: "お元気ですか？", translation: "你好吗？", language: "ja" },
  { id: "s-ja-3", phrase: "ありがとうございます。", translation: "非常感谢。", language: "ja" },
  { id: "s-ko-1", phrase: "안녕하세요, 만나서 반갑습니다.", translation: "你好，很高兴见到你。", language: "ko" },
  { id: "s-ko-2", phrase: "감사합니다!", translation: "谢谢！", language: "ko" },
  { id: "s-ko-3", phrase: "잘 부탁드립니다.", translation: "请多关照。", language: "ko" },
];

export const getWords = (language: string) => WORDS.filter((w) => w.language === language);
export const getQuizzes = (language: string) => QUIZZES.filter((q) => q.language === language);
export const getListening = (language: string) => LISTENING.filter((l) => l.language === language);
export const getSpeaking = (language: string) => SPEAKING.filter((s) => s.language === language);
