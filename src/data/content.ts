import type { WordItem, QuizItem, ListeningItem, SpeakingPhrase } from "../types";

// P0 反爬：generated-quizzes / generated-listening / generated-speaking /
// real-conversations 不再打进前端 bundle —— 完整内容统一走后端 API
// （/api/quizzes、/api/listening、/api/speaking、/api/real-conversations）。
// 此处仅保留手工编写的小规模样例，作为 API 不可用时的离线兜底；
// 原始数据文件仍保留在 src/data/ 下供 seed 脚本使用，但不会被打包。

export const WORDS: WordItem[] = [
  // English A1
  { id: "w-en-1", word: "serendipity", translation: "意外的美好发现", phonetic: "/ˌsɛr.ənˈdɪp.ə.ti/", example: "Finding this book was pure serendipity.", language: "en", level: "A1" },
  { id: "w-en-2", word: "ephemeral", translation: "短暂的", phonetic: "/ɪˈfɛm.ər.əl/", example: "Cherry blossoms are ephemeral, lasting only a few days.", language: "en", level: "A1" },
  { id: "w-en-3", word: "resilient", translation: "有韧性的", phonetic: "/rɪˈzɪl.jənt/", example: "Children are remarkably resilient.", language: "en", level: "A1" },
  { id: "w-en-4", word: "endeavor", translation: "努力；尝试", phonetic: "/ɪnˈdɛv.ər/", example: "She will endeavor to finish on time.", language: "en", level: "A1" },
  { id: "w-en-5", word: "luminous", translation: "发光的；明亮的", phonetic: "/ˈluː.mɪ.nəs/", example: "The luminous moon lit the path.", language: "en", level: "A2" },
  { id: "w-en-6", word: "whimsical", translation: "异想天开的", phonetic: "/ˈwɪm.zɪ.kəl/", example: "A whimsical tale of talking cats.", language: "en", level: "A2" },
  { id: "w-en-7", word: "meticulous", translation: "一丝不苟的", phonetic: "/məˈtɪk.jə.ləs/", example: "He is meticulous about his work.", language: "en", level: "B1" },
  { id: "w-en-8", word: "eloquent", translation: "雄辩的", phonetic: "/ˈɛl.ə.kwənt/", example: "Her eloquent speech moved everyone.", language: "en", level: "B1" },
  { id: "w-en-9", word: "tranquil", translation: "宁静的", phonetic: "/ˈtræŋ.kwɪl/", example: "A tranquil morning by the lake.", language: "en", level: "B2" },
  { id: "w-en-10", word: "vivid", translation: "生动的", phonetic: "/ˈvɪv.ɪd/", example: "She has vivid memories of her childhood.", language: "en", level: "C1" },

  // Japanese
  { id: "w-ja-1", word: "桜（さくら）", translation: "樱花", example: "桜がきれいです。", language: "ja", level: "N5" },
  { id: "w-ja-2", word: "猫（ねこ）", translation: "猫", example: "猫が好きです。", language: "ja", level: "N5" },
  { id: "w-ja-3", word: "海（うみ）", translation: "海", example: "夏は海へ行きます。", language: "ja", level: "N5" },
  { id: "w-ja-4", word: "勉強（べんきょう）", translation: "学习", example: "日本語を勉強しています。", language: "ja", level: "N4" },
  { id: "w-ja-5", word: "夢（ゆめ）", translation: "梦想", example: "夢を追いかける。", language: "ja", level: "N4" },
  { id: "w-ja-6", word: "空（そら）", translation: "天空", example: "青い空が広がる。", language: "ja", level: "N3" },
  { id: "w-ja-7", word: "美しい（うつくしい）", translation: "美丽的", example: "美しい景色。", language: "ja", level: "N3" },
  { id: "w-ja-8", word: "優しい（やさしい）", translation: "温柔的", example: "彼女は優しい。", language: "ja", level: "N2" },

  // Chinese HSK1-HSK4
  { id: "w-zh-1", word: "你好 (nǐ hǎo)", translation: "你好", phonetic: "nǐ hǎo", example: "你好，请问你叫什么名字？", language: "zh", level: "HSK1" },
  { id: "w-zh-2", word: "谢谢 (xièxie)", translation: "谢谢", phonetic: "xièxie", example: "谢谢你的帮助。", language: "zh", level: "HSK1" },
  { id: "w-zh-3", word: "吃饭 (chīfàn)", translation: "吃饭", phonetic: "chī fàn", example: "我们中午一起吃饭吧。", language: "zh", level: "HSK1" },
  { id: "w-zh-4", word: "朋友 (péngyou)", translation: "朋友", phonetic: "péng you", example: "他是我的好朋友。", language: "zh", level: "HSK1" },
  { id: "w-zh-5", word: "学习 (xuéxí)", translation: "学习", phonetic: "xué xí", example: "我每天学习三个小时。", language: "zh", level: "HSK2", pos: "verb", root: "学", rootMeaning: "to learn, to study", familyId: "fam-zh-xue" },
  { id: "w-zh-6", word: "开始 (kāishǐ)", translation: "开始", phonetic: "kāi shǐ", example: "课程八点开始。", language: "zh", level: "HSK2" },
  { id: "w-zh-7", word: "准备 (zhǔnbèi)", translation: "准备", phonetic: "zhǔn bèi", example: "我已经准备好了。", language: "zh", level: "HSK2" },
  { id: "w-zh-8", word: "觉得 (juéde)", translation: "觉得", phonetic: "jué de", example: "我觉得这个主意很好。", language: "zh", level: "HSK2" },
  { id: "w-zh-9", word: "帮助 (bāngzhù)", translation: "帮助", phonetic: "bāng zhù", example: "谢谢你对我的帮助。", language: "zh", level: "HSK3" },
  { id: "w-zh-10", word: "完成 (wánchéng)", translation: "完成", phonetic: "wán chéng", example: "他已经完成了作业。", language: "zh", level: "HSK3" },
  { id: "w-zh-11", word: "关心 (guānxīn)", translation: "关心", phonetic: "guān xīn", example: "妈妈一直很关心我的学习。", language: "zh", level: "HSK3" },
  { id: "w-zh-12", word: "解释 (jiěshì)", translation: "解释", phonetic: "jiě shì", example: "请解释一下这句话的意思。", language: "zh", level: "HSK3" },
  { id: "w-zh-13", word: "经验 (jīngyàn)", translation: "经验", phonetic: "jīng yàn", example: "他在这方面有很多经验。", language: "zh", level: "HSK4" },
  { id: "w-zh-14", word: "提高 (tígāo)", translation: "提高", phonetic: "tí gāo", example: "我想提高自己的中文水平。", language: "zh", level: "HSK4" },
  { id: "w-zh-15", word: "适应 (shìyìng)", translation: "适应", phonetic: "shì yìng", example: "我已经适应了这里的生活。", language: "zh", level: "HSK4" },
  { id: "w-zh-16", word: "重视 (zhòngshì)", translation: "重视", phonetic: "zhòng shì", example: "公司非常重视员工的成长。", language: "zh", level: "HSK4" },

  // Korean
  { id: "w-ko-1", word: "사랑 (sarang)", translation: "爱", example: "사랑해요.", language: "ko", level: "初级" },
  { id: "w-ko-2", word: "친구 (chingu)", translation: "朋友", example: "친구를 만나요.", language: "ko", level: "初级" },
  { id: "w-ko-3", word: "음악 (eumak)", translation: "音乐", example: "음악을 들어요.", language: "ko", level: "初级" },
  { id: "w-ko-4", word: "여행 (yeohaeng)", translation: "旅行", example: "여행을 가요.", language: "ko", level: "中级" },
  { id: "w-ko-5", word: "행복 (haengbok)", translation: "幸福", example: "행복해요.", language: "ko", level: "中级" },
  { id: "w-ko-6", word: "커피 (keopi)", translation: "咖啡", example: "커피를 마셔요.", language: "ko", level: "高级" },
];

export const QUIZZES: QuizItem[] = [
  // ── Hand-crafted quizzes (离线兜底样本；完整题库走 /api/quizzes) ──
  {
    id: "q-en-1",
    question: "She ___ to the gym every morning before work.",
    options: ["go", "goes", "going", "gone"],
    answer: 1,
    explain: "主语为第三人称单数 she，一般现在时动词加 -s。",
    language: "en",
    level: "A1",
  },
  {
    id: "q-en-2",
    question: "If I ___ rich, I would travel the world.",
    options: ["am", "was", "were", "be"],
    answer: 2,
    explain: "与现在事实相反的虚拟语气，be 动词统一用 were。",
    language: "en",
    level: "B1",
  },
  {
    id: "q-en-3",
    question: "This is the ___ book I have ever read.",
    options: ["more interesting", "most interesting", "interesting", "interestinger"],
    answer: 1,
    explain: "范围是 I have ever read，使用最高级 most interesting。",
    language: "en",
    level: "B2",
  },
  {
    id: "q-en-4",
    question: "He suggested that she ___ a doctor.",
    options: ["sees", "saw", "see", "seeing"],
    answer: 2,
    explain: "suggest 后 that 从句用 (should) + 动词原形。",
    language: "en",
    level: "C1",
  },
  {
    id: "q-en-5",
    question: "By next year, I ___ here for ten years.",
    options: ["will work", "will have worked", "work", "have worked"],
    answer: 1,
    explain: "by + 将来时间，主句用将来完成时 will have done。",
    language: "en",
    level: "C1",
  },
  {
    id: "q-ja-1",
    question: "私は毎日日本語を ___ います。",
    options: ["勉強する", "勉強して", "勉強した", "勉強しよう"],
    answer: 1,
    explain: "～ています 表示正在进行或习惯。",
    language: "ja",
    level: "N5",
  },
  {
    id: "q-ja-2",
    question: "これは ___ 本ですか。",
    options: ["なん", "なに", "どれ", "どこ"],
    answer: 0,
    explain: "修饰名词时用「なん」（なん本→何の本）。",
    language: "ja",
    level: "N4",
  },
  {
    id: "q-ja-3",
    question: "昨日、友達 ___ 映画を見ました。",
    options: ["と", "に", "が", "へ"],
    answer: 0,
    explain: "「と」表示共同做某事的对象，和…一起。",
    language: "ja",
    level: "N3",
  },
  {
    id: "q-ko-1",
    question: "저는 학생 ___ 입니다.",
    options: ["은", "는", "이", "가"],
    answer: 1,
    explain: "주어 학생은 받침으로 끝나지만 관용적으로 '학생은' 입니다（一般强调主题用 은/는）。",
    language: "ko",
    level: "初级",
  },
  {
    id: "q-ko-2",
    question: "오늘 날씨가 정말 ___ !",
    options: ["예뻐요", "예쁘다", "예쁘네요", "예쁜"],
    answer: 2,
    explain: "感叹句常用 -네요 结尾表评价与感叹。",
    language: "ko",
    level: "中级",
  },
];

export const LISTENING: ListeningItem[] = [
  // ── Hand-crafted listening exercises (离线兜底样本；完整材料走 /api/listening) ──
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
    level: "A1",
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
    level: "A2",
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
    level: "N5",
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
    level: "初级",
  },
];

export const SPEAKING: SpeakingPhrase[] = [
  // ── Hand-crafted speaking phrases (离线兜底样本；完整语料走 /api/speaking) ──
  { id: "s-en-1", phrase: "Hello! Nice to meet you.", translation: "你好！很高兴认识你。", phonetic: "/həˈloʊ/ /naɪs/ /tə/ /mit/ /ju/", language: "en", level: "A1" },
  { id: "s-en-2", phrase: "How was your weekend?", translation: "你周末过得怎么样？", phonetic: "/haʊ/ /wʌz/ /jʊr/ /ˈwikˌɛnd/", language: "en", level: "A2" },
  { id: "s-en-3", phrase: "Could you repeat that, please?", translation: "你能重复一下吗？", phonetic: "/kʊd/ /ju/ /rɪˈpit/ /ðæt/", language: "en", level: "B1" },
  { id: "s-en-4", phrase: "I'm looking forward to it.", translation: "我很期待。", phonetic: "/aɪm/ /ˈlʊkɪŋ/ /ˈfɔrwərd/ /tə/ /ɪt/", language: "en", level: "B2" },
  { id: "s-ja-1", phrase: "はじめまして、よろしくお願いします。", translation: "初次见面，请多关照。", language: "ja", level: "N5" },
  { id: "s-ja-2", phrase: "お元気ですか？", translation: "你好吗？", language: "ja", level: "N4" },
  { id: "s-ja-3", phrase: "ありがとうございます。", translation: "非常感谢。", language: "ja", level: "N5" },
  { id: "s-ko-1", phrase: "안녕하세요, 만나서 반갑습니다.", translation: "你好，很高兴见到你。", language: "ko", level: "初级" },
  { id: "s-ko-2", phrase: "감사합니다!", translation: "谢谢！", language: "ko", level: "初级" },
  { id: "s-ko-3", phrase: "잘 부탁드립니다.", translation: "请多关照。", language: "ko", level: "中级" },
  // Italian
  { id: "s-it-1", phrase: "Ciao! Piacere di conoscerti.", translation: "你好！很高兴认识你。", language: "it", level: "A1" },
  { id: "s-it-2", phrase: "Come stai oggi?", translation: "你今天好吗？", language: "it", level: "A1" },
  { id: "s-it-3", phrase: "Posso avere il menu, per favore?", translation: "请给我菜单好吗？", language: "it", level: "B1" },
  // Thai — level aligned with the quiz's CEFR scheme (A1/A2/B1/B2)
  { id: "s-th-1", phrase: "สวัสดีครับ", translation: "你好（男性说话）。", language: "th", level: "A1" },
  { id: "s-th-2", phrase: "ขอบคุณครับ", translation: "谢谢（男性说话）。", language: "th", level: "A1" },
  { id: "s-th-3", phrase: "ราคาเท่าไหร่", translation: "多少钱？", language: "th", level: "A2" },
  // Cantonese
  { id: "s-yue-1", phrase: "你好，好高興見到你。", translation: "你好，很高兴见到你。", language: "yue", level: "初级" },
  { id: "s-yue-2", phrase: "多謝你！", translation: "谢谢你！", language: "yue", level: "初级" },
  { id: "s-yue-3", phrase: "唔該畀個餐牌我。", translation: "请给我菜单。", language: "yue", level: "中级" },
];

export const getWords = (language: string, level?: string) => filterByLangLevel(WORDS, language, level);
export const getQuizzes = (language: string, level?: string) => filterByLangLevel(QUIZZES, language, level);
export const getListening = (language: string, level?: string) => filterByLangLevel(LISTENING, language, level);
export const getSpeaking = (language: string, level?: string) => filterByLangLevel(SPEAKING, language, level);

function filterByLangLevel<T extends { language: string; level?: string }>(items: T[], language: string, level?: string): T[] {
  const byLang = items.filter((item) => item.language === language);
  if (!level) return byLang;
  const byLevel = byLang.filter((item) => item.level === level);
  return byLevel.length > 0 ? byLevel : byLang;
}
