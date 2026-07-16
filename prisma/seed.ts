import { PrismaClient } from "../server/lib/prisma-generated/client/index.js";
import { LANGUAGES } from "../src/data/languages";
import { COURSES } from "../src/data/courses";

const prisma = new PrismaClient();

interface SeedWordInput {
  languageCode: string;
  level: string;
  word: string;
  translation: string;
  phonetic?: string;
  exampleSentence: string;
}

const seedWords: SeedWordInput[] = [
  // 英语
  { languageCode: "en", level: "A1", word: "hello", translation: "你好", phonetic: "/həˈləʊ/", exampleSentence: "Hello, my name is Tom." },
  { languageCode: "en", level: "A1", word: "goodbye", translation: "再见", phonetic: "/ɡʊdˈbaɪ/", exampleSentence: "Goodbye, see you tomorrow." },
  { languageCode: "en", level: "A1", word: "thank you", translation: "谢谢", phonetic: "/θæŋk juː/", exampleSentence: "Thank you for your help." },
  { languageCode: "en", level: "A1", word: "please", translation: "请", phonetic: "/pliːz/", exampleSentence: "Please sit down." },
  { languageCode: "en", level: "A1", word: "water", translation: "水", phonetic: "/ˈwɔːtə/", exampleSentence: "I would like some water." },
  { languageCode: "en", level: "A1", word: "friend", translation: "朋友", phonetic: "/frend/", exampleSentence: "She is my best friend." },
  { languageCode: "en", level: "A2", word: "family", translation: "家庭", phonetic: "/ˈfæməli/", exampleSentence: "My family is very big." },
  { languageCode: "en", level: "A2", word: "holiday", translation: "假期", phonetic: "/ˈhɒlədeɪ/", exampleSentence: "We had a great holiday." },
  { languageCode: "en", level: "A2", word: "weather", translation: "天气", phonetic: "/ˈweðə/", exampleSentence: "The weather is beautiful today." },
  { languageCode: "en", level: "B1", word: "environment", translation: "环境", phonetic: "/ɪnˈvaɪrənmənt/", exampleSentence: "We must protect the environment." },
  { languageCode: "en", level: "B1", word: "opinion", translation: "观点", phonetic: "/əˈpɪnjən/", exampleSentence: "In my opinion, this is great." },
  { languageCode: "en", level: "B1", word: "experience", translation: "经验", phonetic: "/ɪkˈspɪəriəns/", exampleSentence: "It was a wonderful experience." },
  { languageCode: "en", level: "B2", word: "achievement", translation: "成就", phonetic: "/əˈtʃiːvmənt/", exampleSentence: "That was a great achievement." },
  { languageCode: "en", level: "B2", word: "opportunity", translation: "机会", phonetic: "/ˌɒpəˈtjuːnɪti/", exampleSentence: "What a great opportunity!" },
  { languageCode: "en", level: "C1", word: "sophisticated", translation: "复杂精密的", phonetic: "/səˈfɪstɪkeɪtɪd/", exampleSentence: "A sophisticated argument." },
  { languageCode: "en", level: "C1", word: "nevertheless", translation: "尽管如此", phonetic: "/ˌnevəðəˈles/", exampleSentence: "Nevertheless, we will continue." },
  { languageCode: "en", level: "C2", word: "ubiquitous", translation: "无处不在的", phonetic: "/juːˈbɪkwɪtəs/", exampleSentence: "Smartphones are now ubiquitous." },

  // 日语
  { languageCode: "ja", level: "N5", word: "こんにちは", translation: "你好", phonetic: "konnichiwa", exampleSentence: "こんにちは、田中さん。" },
  { languageCode: "ja", level: "N5", word: "ありがとう", translation: "谢谢", phonetic: "arigatou", exampleSentence: "ありがとうございます。" },
  { languageCode: "ja", level: "N5", word: "水", translation: "水", phonetic: "mizu", exampleSentence: "水をください。" },
  { languageCode: "ja", level: "N5", word: "学校", translation: "学校", phonetic: "gakkou", exampleSentence: "学校へ行きます。" },
  { languageCode: "ja", level: "N5", word: "友達", translation: "朋友", phonetic: "tomodachi", exampleSentence: "友達と映画を見ました。" },
  { languageCode: "ja", level: "N4", word: "仕事", translation: "工作", phonetic: "shigoto", exampleSentence: "今日は仕事が忙しい。" },
  { languageCode: "ja", level: "N4", word: "時間", translation: "时间", phonetic: "jikan", exampleSentence: "時間がありません。" },
  { languageCode: "ja", level: "N3", word: "環境", translation: "环境", phonetic: "kankyou", exampleSentence: "環境問題について考える。" },
  { languageCode: "ja", level: "N3", word: "経験", translation: "经验", phonetic: "keiken", exampleSentence: "素晴らしい経験をしました。" },
  { languageCode: "ja", level: "N3", word: "挑戦", translation: "挑战", phonetic: "chousen", exampleSentence: "新しいことに挑戦する。" },
  { languageCode: "ja", level: "N2", word: "努力", translation: "努力", phonetic: "doryoku", exampleSentence: "努力は必ず報われる。" },
  { languageCode: "ja", level: "N2", word: "機会", translation: "机会", phonetic: "kikai", exampleSentence: "良い機会を逃した。" },
  { languageCode: "ja", level: "N1", word: "継続", translation: "持续", phonetic: "keizoku", exampleSentence: "継続は力なり。" },
  { languageCode: "ja", level: "N1", word: "創造", translation: "创造", phonetic: "souzou", exampleSentence: "創造的な仕事をする。" },
  { languageCode: "ja", level: "N1", word: "達成", translation: "达成", phonetic: "tassei", exampleSentence: "目標を達成した。" },

  // 韩语
  { languageCode: "ko", level: "初级", word: "안녕하세요", translation: "你好", phonetic: "annyeonghaseyo", exampleSentence: "안녕하세요, 만나서 반갑습니다." },
  { languageCode: "ko", level: "初级", word: "감사합니다", translation: "谢谢", phonetic: "gamsahamnida", exampleSentence: "정말 감사합니다." },
  { languageCode: "ko", level: "初级", word: "사랑", translation: "爱", phonetic: "sarang", exampleSentence: "사랑해요." },
  { languageCode: "ko", level: "初级", word: "친구", translation: "朋友", phonetic: "chingu", exampleSentence: "친구와 만났어요." },
  { languageCode: "ko", level: "初级", word: "학교", translation: "学校", phonetic: "hakgyo", exampleSentence: "학교에 가요." },
  { languageCode: "ko", level: "初级", word: "물", translation: "水", phonetic: "mul", exampleSentence: "물 한 잔 주세요." },
  { languageCode: "ko", level: "中级", word: "노력", translation: "努力", phonetic: "noryeok", exampleSentence: "노력은 배신하지 않는다." },
  { languageCode: "ko", level: "中级", word: "경험", translation: "经验", phonetic: "gyeongheom", exampleSentence: "좋은 경험이었습니다." },
  { languageCode: "ko", level: "中级", word: "소통", translation: "沟通", phonetic: "sotong", exampleSentence: "소통이 중요하다." },
  { languageCode: "ko", level: "中级", word: "기회", translation: "机会", phonetic: "gihoe", exampleSentence: "좋은 기회입니다." },
  { languageCode: "ko", level: "高级", word: "도전", translation: "挑战", phonetic: "dojeon", exampleSentence: "새로운 도전에 나섰다." },
  { languageCode: "ko", level: "高级", word: "성공", translation: "成功", phonetic: "seonggong", exampleSentence: "성공을 기원합니다." },
  { languageCode: "ko", level: "高级", word: "창의", translation: "创意", phonetic: "changui", exampleSentence: "창의적인 아이디어가 필요하다." },
  { languageCode: "ko", level: "高级", word: "성취", translation: "成就", phonetic: "seongchwi", exampleSentence: "큰 성취를 이룩했다." },

  // 中文 (对外汉语)
  { languageCode: "zh", level: "HSK1", word: "你好", translation: "Hello", phonetic: "nǐ hǎo", exampleSentence: "你好，我是小明。" },
  { languageCode: "zh", level: "HSK1", word: "谢谢", translation: "Thank you", phonetic: "xiè xiè", exampleSentence: "谢谢你的帮助。" },
  { languageCode: "zh", level: "HSK1", word: "朋友", translation: "Friend", phonetic: "péng yǒu", exampleSentence: "他是我的朋友。" },
  { languageCode: "zh", level: "HSK1", word: "水", translation: "Water", phonetic: "shuǐ", exampleSentence: "请给我一杯水。" },
  { languageCode: "zh", level: "HSK1", word: "再见", translation: "Goodbye", phonetic: "zài jiàn", exampleSentence: "再见，明天见。" },
  { languageCode: "zh", level: "HSK2", word: "学校", translation: "School", phonetic: "xué xiào", exampleSentence: "我在学校学习中文。" },
  { languageCode: "zh", level: "HSK2", word: "工作", translation: "Work", phonetic: "gōng zuò", exampleSentence: "我的工作很有趣。" },
  { languageCode: "zh", level: "HSK2", word: "时间", translation: "Time", phonetic: "shí jiān", exampleSentence: "时间不等人。" },
  { languageCode: "zh", level: "HSK3", word: "努力", translation: "Effort", phonetic: "nǔ lì", exampleSentence: "努力学习，天天向上。" },
  { languageCode: "zh", level: "HSK3", word: "环境", translation: "Environment", phonetic: "huán jìng", exampleSentence: "我们要保护环境。" },
  { languageCode: "zh", level: "HSK3", word: "经验", translation: "Experience", phonetic: "jīng yàn", exampleSentence: "这是很宝贵的经验。" },
  { languageCode: "zh", level: "HSK4", word: "挑战", translation: "Challenge", phonetic: "tiǎo zhàn", exampleSentence: "接受新的挑战。" },
  { languageCode: "zh", level: "HSK4", word: "机会", translation: "Opportunity", phonetic: "jī huì", exampleSentence: "机会难得。" },
  { languageCode: "zh", level: "HSK5", word: "成就", translation: "Achievement", phonetic: "chéng jiù", exampleSentence: "这是一项伟大的成就。" },
  { languageCode: "zh", level: "HSK5", word: "观点", translation: "Opinion", phonetic: "guān diǎn", exampleSentence: "我有不同的观点。" },
  { languageCode: "zh", level: "HSK6", word: "创造", translation: "Create", phonetic: "chuàng zào", exampleSentence: "创造美好的未来。" },
  // HSK 3.0 高级（HSK7-9）
  { languageCode: "zh", level: "HSK7", word: "洞察", translation: "Insight", phonetic: "dòng chá", exampleSentence: "他对这个问题有深刻的洞察。" },
  { languageCode: "zh", level: "HSK7", word: "辩证", translation: "Dialectical", phonetic: "biàn zhèng", exampleSentence: "我们需要辩证地看待这个问题。" },
  { languageCode: "zh", level: "HSK7", word: "阐释", translation: "Elucidate", phonetic: "chǎn shì", exampleSentence: "教授阐释了这一理论的内涵。" },
  { languageCode: "zh", level: "HSK8", word: "渊博", translation: "Profound/Erudite", phonetic: "yuān bó", exampleSentence: "他学识渊博，令人敬仰。" },
  { languageCode: "zh", level: "HSK8", word: "融会贯通", translation: "Integrate mastery", phonetic: "róng huì guàn tōng", exampleSentence: "学贵融会贯通，方能运用自如。" },
  { languageCode: "zh", level: "HSK8", word: "洞见", translation: "Penetrating insight", phonetic: "dòng jiàn", exampleSentence: "这篇论文对经典文本提出了精当的洞见。" },
  { languageCode: "zh", level: "HSK9", word: "高屋建瓴", translation: "Strategic overview", phonetic: "gāo wū jiàn líng", exampleSentence: "他的发言高屋建瓴，统揽全局。" },
  { languageCode: "zh", level: "HSK9", word: "钩深致远", translation: "Probe depths, reach far", phonetic: "gōu shēn zhì yuǎn", exampleSentence: "做学问当钩深致远，不囿于表层。" },
  { languageCode: "zh", level: "HSK9", word: "融通", translation: "Synthesize/harmonize", phonetic: "róng tōng", exampleSentence: "此论融通中西，自成一家之言。" },

  // 西班牙语
  { languageCode: "es", level: "A1", word: "hola", translation: "你好", phonetic: "/ˈola/", exampleSentence: "Hola, ¿cómo estás?" },
  { languageCode: "es", level: "A1", word: "gracias", translation: "谢谢", phonetic: "/ˈɡɾaθjas/", exampleSentence: "Muchas gracias por tu ayuda." },
  { languageCode: "es", level: "A1", word: "agua", translation: "水", phonetic: "/ˈaɣwa/", exampleSentence: "Quiero un poco de agua." },
  { languageCode: "es", level: "A1", word: "amigo", translation: "朋友", phonetic: "/aˈmiɣo/", exampleSentence: "Él es mi mejor amigo." },
  { languageCode: "es", level: "A2", word: "familia", translation: "家庭", phonetic: "/faˈmilja/", exampleSentence: "Mi familia es grande." },
  { languageCode: "es", level: "A2", word: "tiempo", translation: "时间/天气", phonetic: "/ˈtjempo/", exampleSentence: "No tengo tiempo." },
  { languageCode: "es", level: "B1", word: "ambiente", translation: "环境", phonetic: "/amˈbjente/", exampleSentence: "Debemos cuidar el ambiente." },
  { languageCode: "es", level: "B1", word: "experiencia", translation: "经验", phonetic: "/ekspeˈɾjenθja/", exampleSentence: "Fue una gran experiencia." },
  { languageCode: "es", level: "B1", word: "oportunidad", translation: "机会", phonetic: "/opoɾtuˈniðað/", exampleSentence: "Una gran oportunidad." },
  { languageCode: "es", level: "B2", word: "desafío", translation: "挑战", phonetic: "/desaˈfio/", exampleSentence: "Un nuevo desafío." },
  { languageCode: "es", level: "B2", word: "logro", translation: "成就", phonetic: "/ˈloɣɾo/", exampleSentence: "Un logro increíble." },
  { languageCode: "es", level: "C1", word: "perspectiva", translation: "观点", phonetic: "/peɾspektiˈβa/", exampleSentence: "Una perspectiva diferente." },
  { languageCode: "es", level: "C1", word: "sophisticado", translation: "精密的", phonetic: "/soˈfistikaðo/", exampleSentence: "Un diseño sofisticado." },

  // 法语
  { languageCode: "fr", level: "A1", word: "bonjour", translation: "你好", phonetic: "/bɔ̃ʒuʁ/", exampleSentence: "Bonjour, comment allez-vous ?" },
  { languageCode: "fr", level: "A1", word: "merci", translation: "谢谢", phonetic: "/meʁsi/", exampleSentence: "Merci beaucoup." },
  { languageCode: "fr", level: "A1", word: "eau", translation: "水", phonetic: "/o/", exampleSentence: "Je voudrais de l'eau." },
  { languageCode: "fr", level: "A1", word: "ami", translation: "朋友", phonetic: "/ami/", exampleSentence: "C'est mon meilleur ami." },
  { languageCode: "fr", level: "A2", word: "famille", translation: "家庭", phonetic: "/famij/", exampleSentence: "Ma famille est grande." },
  { languageCode: "fr", level: "A2", word: "temps", translation: "时间", phonetic: "/tɑ̃/", exampleSentence: "Je n'ai pas le temps." },
  { languageCode: "fr", level: "B1", word: "environnement", translation: "环境", phonetic: "/ɑ̃viʁɔnmɑ̃/", exampleSentence: "Protéger l'environnement." },
  { languageCode: "fr", level: "B1", word: "expérience", translation: "经验", phonetic: "/ekspeʁjɑ̃s/", exampleSentence: "Une belle expérience." },
  { languageCode: "fr", level: "B1", word: "opportunité", translation: "机会", phonetic: "/ɔpɔʁtynite/", exampleSentence: "Une belle opportunité." },
  { languageCode: "fr", level: "B2", word: "défi", translation: "挑战", phonetic: "/defi/", exampleSentence: "Relever un défi." },
  { languageCode: "fr", level: "B2", word: "succès", translation: "成功", phonetic: "/syksɛ/", exampleSentence: "C'est un grand succès." },
  { languageCode: "fr", level: "C1", word: "réussite", translation: "成功", phonetic: "/ʁeysit/", exampleSentence: "La réussite est à portée." },
  { languageCode: "fr", level: "C1", word: "perspective", translation: "观点", phonetic: "/pɛʁspektiv/", exampleSentence: "Une nouvelle perspective." },

  // 德语
  { languageCode: "de", level: "A1", word: "hallo", translation: "你好", phonetic: "/ˈhalo/", exampleSentence: "Hallo, wie geht es dir?" },
  { languageCode: "de", level: "A1", word: "danke", translation: "谢谢", phonetic: "/ˈdaŋkə/", exampleSentence: "Danke schön für deine Hilfe." },
  { languageCode: "de", level: "A1", word: "Wasser", translation: "水", phonetic: "/ˈvasɐ/", exampleSentence: "Ich möchte Wasser trinken." },
  { languageCode: "de", level: "A1", word: "Freund", translation: "朋友", phonetic: "/fʁɔʏ̯nt/", exampleSentence: "Er ist mein bester Freund." },
  { languageCode: "de", level: "A2", word: "Familie", translation: "家庭", phonetic: "/faˈmiːliə/", exampleSentence: "Meine Familie ist groß." },
  { languageCode: "de", level: "A2", word: "Zeit", translation: "时间", phonetic: "/tsaɪ̯t/", exampleSentence: "Ich habe keine Zeit." },
  { languageCode: "de", level: "B1", word: "Umwelt", translation: "环境", phonetic: "/ˈʊmˌvɛlt/", exampleSentence: "Wir müssen die Umwelt schützen." },
  { languageCode: "de", level: "B1", word: "Erfahrung", translation: "经验", phonetic: "/ɛɐ̯ˈfaːʁʊŋ/", exampleSentence: "Eine wunderbare Erfahrung." },
  { languageCode: "de", level: "B1", word: "Gelegenheit", translation: "机会", phonetic: "/ɡəˈleːɡn̩haɪ̯t/", exampleSentence: "Eine tolle Gelegenheit." },
  { languageCode: "de", level: "B2", word: "Herausforderung", translation: "挑战", phonetic: "/hɛˈʁaʊ̯sˌfɔʁdəʁʊŋ/", exampleSentence: "Eine neue Herausforderung." },
  { languageCode: "de", level: "B2", word: "Erfolg", translation: "成功", phonetic: "/ɛɐ̯ˈfɔlk/", exampleSentence: "Großer Erfolg." },
  { languageCode: "de", level: "C1", word: "Perspektive", translation: "观点", phonetic: "/pɛʁspɛkˈtiːvə/", exampleSentence: "Eine neue Perspektive." },
  { languageCode: "de", level: "C1", word: "Errungenschaft", translation: "成就", phonetic: "/ɛˈʁʊŋənʃaft/", exampleSentence: "Eine große Errungenschaft." },
];

const seedPostsData = [
  {
    topic: "每日一句",
    content:
      "「The best time to plant a tree was 20 years ago. The second best time is now.」——学语言也一样，从今天开始吧！",
  },
  {
    topic: "学习心得",
    content: "每天坚持 30 分钟，比周末突击 5 小时更有效。贵在坚持，大家一起加油！",
  },
  {
    topic: "日语学习心得",
    content: "每天看一集不带字幕的动漫，坚持两个月，听力明显提升了。分享给同样在学日语的同学们～",
  },
  {
    topic: "韩语学习笔记",
    content: "坚持每天背 10 个单词，2 个月后看简单的韩剧已经能听懂基本对话了，加油！",
  },
  {
    topic: "提问求助",
    content: "请教大家法语的联诵（liaison）怎么练习？感觉好难掌握，有推荐的资源吗？",
  },
  {
    topic: "文化分享",
    content: "德语区的圣诞节习俗非常有趣，比如 Advent 日历、圣诞市场和 Glühwein（热红酒）～",
  },
  {
    topic: "学习心得",
    content: "用西班牙语写日记三个月，现在写作速度快了很多，语法错误也明显减少。",
  },
  {
    topic: "每日一句",
    content: "「C'est en forgeant qu'on devient forgeron.」（熟能生巧）——法语谚语分享。",
  },
];

async function main() {
  console.log("Seeding languages...");
  for (const lang of LANGUAGES) {
    await prisma.language.upsert({
      where: { code: lang.id },
      update: {
        name: lang.name,
        native: lang.native,
        flag: lang.flag,
        tagline: lang.tagline,
        levels: lang.levels,
        status: "active",
      },
      create: {
        code: lang.id,
        name: lang.name,
        native: lang.native,
        flag: lang.flag,
        tagline: lang.tagline,
        levels: lang.levels,
        status: "active",
      },
    });
  }

  console.log("Seeding courses...");
  for (let i = 0; i < COURSES.length; i++) {
    const c = COURSES[i];
    await prisma.course.upsert({
      where: { id: c.id },
      update: {
        languageCode: c.language,
        title: c.title,
        level: c.level,
        levelGroup: c.levelGroup,
        description: c.description,
        lessons: c.lessons,
        minutes: c.minutes,
        cover: c.cover,
        tags: c.tags,
        vipOnly: c.levelGroup === "advanced",
        courseOrder: i + 1,
      },
      create: {
        id: c.id,
        languageCode: c.language,
        title: c.title,
        level: c.level,
        levelGroup: c.levelGroup,
        description: c.description,
        lessons: c.lessons,
        minutes: c.minutes,
        cover: c.cover,
        tags: c.tags,
        vipOnly: c.levelGroup === "advanced",
        courseOrder: i + 1,
      },
    });
  }

  console.log("Seeding word bank...");
  // SeedWordInput.translation 是中文释义（zh 的 seed 例外，是英文释义）。
  // WordBank 表本身不存 translation（按 schema 是 WordBankTranslation 表），
  // 所以先 upsert WordBank，再 upsert 对应的 WordBankTranslation。
  for (let i = 0; i < seedWords.length; i++) {
    const w = seedWords[i];
    const id = `word-${w.languageCode}-${i}`;
    // zh 的目标语言是中文，所以释义用英文（baseLanguageCode="en"）；
    // 其他语言的释义都是中文。
    const baseLanguageCode = w.languageCode === "zh" ? "en" : "zh";

    await prisma.wordBank.upsert({
      where: { id },
      update: {
        languageCode: w.languageCode,
        level: w.level,
        word: w.word,
        phonetic: w.phonetic ?? null,
        exampleSentence: w.exampleSentence,
        vocabOrder: i,
      },
      create: {
        id,
        languageCode: w.languageCode,
        level: w.level,
        word: w.word,
        phonetic: w.phonetic ?? null,
        exampleSentence: w.exampleSentence,
        vocabOrder: i,
      },
    });

    await prisma.wordBankTranslation.upsert({
      where: { wordBankId_baseLanguageCode: { wordBankId: id, baseLanguageCode } },
      update: {
        baseLanguageCode,
        translation: w.translation,
      },
      create: {
        wordBankId: id,
        baseLanguageCode,
        translation: w.translation,
      },
    });
  }

  console.log("Seeding posts...");
  let systemUser = await prisma.user.findUnique({
    where: { email: "system@linguaverse.app" },
  });
  if (!systemUser) {
    systemUser = await prisma.user.create({
      data: {
        email: "system@linguaverse.app",
        username: "LinguaVerse 官方",
        passwordHash: "$2b$10$systemUserPlaceholderNeverLogsIn",
        role: "admin",
        targetLanguage: "en",
      },
    });
  }

  for (const post of seedPostsData) {
    const existing = await prisma.post.findFirst({
      where: { topic: post.topic, authorId: systemUser.id, content: post.content },
    });
    if (!existing) {
      await prisma.post.create({
        data: {
          authorId: systemUser.id,
          topic: post.topic,
          content: post.content,
        },
      });
    }
  }

  console.log(
    `Seeded: ${LANGUAGES.length} languages, ${COURSES.length} courses, ${seedWords.length} words, ${seedPostsData.length} posts.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
