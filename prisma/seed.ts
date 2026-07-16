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

  // ============================================================
  // P3-2: HSK5-9 内容扩容（写作题目 + 阅读段落 + quiz）
  // 现有 seed 只覆盖 HSK1-4，且无 Writing/Reading 内容。
  // 这里为 HSK5/6/7/8/9 各加 2 道写作题 + 1 篇阅读 + 2 道 quiz。
  // ============================================================
  console.log("Seeding HSK5-9 writing prompts, reading passages, quizzes...");

  type HskWritingSeed = {
    id: string;
    level: string;
    type: string;
    title: string;
    prompt: string;
    tips: string[];
    minWords: number;
    maxWords: number;
    estMinutes: number;
    sampleAnswer: string;
    keywords: string[];
  };

  const hskWritingSeeds: HskWritingSeed[] = [
    // HSK5 高级
    {
      id: "w-zh-hsk5-01",
      level: "HSK5",
      type: "essay",
      title: "互联网对学习的影响",
      prompt: "请用 200-300 字议论文，论述互联网对当代学习方式的改变，至少包含正反两方面观点。",
      tips: ["结构：引言-正方-反方-结论", "使用 不仅...而且 等连词", "避免口语化表达"],
      minWords: 200,
      maxWords: 300,
      estMinutes: 20,
      sampleAnswer: "互联网深刻改变了当代学习方式。一方面，它打破了信息获取的边界，让任何人都能随时随地学习。另一方面，碎片化阅读也削弱了深度思考的能力。我认为，关键在于建立自律的学习节奏。",
      keywords: ["互联网", "学习", "改变", "信息", "深度思考"],
    },
    {
      id: "w-zh-hsk5-02",
      level: "HSK5",
      type: "email",
      title: "申请参加学术会议",
      prompt: "写一封 150-200 字的正式邮件，向导师申请参加一个学术会议，说明理由和预期收获。",
      tips: ["使用敬语 您", "开头自我介绍", "结尾表达感谢"],
      minWords: 150,
      maxWords: 200,
      estMinutes: 15,
      sampleAnswer: "尊敬的张教授：您好！我是您的硕士研究生李明。得知下月将在上海举办语言学国际会议，我希望申请参加。会议议题与我的研究方向高度相关，参加后我能在文献综述和研究方法上获得新的启发。期待您的回复，谢谢！",
      keywords: ["教授", "会议", "研究", "参加", "感谢"],
    },
    // HSK6 高级后
    {
      id: "w-zh-hsk6-01",
      level: "HSK6",
      type: "essay",
      title: "传统文化在现代社会的价值",
      prompt: "请用 300-400 字议论文，探讨传统文化在现代社会中的价值与传承困境。",
      tips: ["用 却 转折", "用 并 强化", "结合具体例子"],
      minWords: 300,
      maxWords: 400,
      estMinutes: 25,
      sampleAnswer: "传统文化是民族的精神根脉，但在快节奏的现代社会中却面临传承困境。一方面，年轻一代更易被流行文化吸引；另一方面，传统价值观中的仁、义、礼、智、信，依然是社会运转的底层伦理。我们应当以创新方式激活传统，而非简单复古。",
      keywords: ["传统", "文化", "传承", "价值", "创新"],
    },
    {
      id: "w-zh-hsk6-02",
      level: "HSK6",
      type: "summary",
      title: "学术论文摘要",
      prompt: "为一段关于汉语声调习得的研究写 200-300 字摘要，包含研究问题、方法、结论。",
      tips: ["使用书面体", "包含目的/方法/结论三段", "避免口语"],
      minWords: 200,
      maxWords: 300,
      estMinutes: 20,
      sampleAnswer: "本研究探讨母语为英语的学习者在习得汉语声调时的典型偏误。研究采用语音实验法，对 30 名中高级学习者进行声调产出测试。结果显示，去声与上声的混淆率最高，且受母语重音系统干扰显著。研究建议教学中引入对比训练。",
      keywords: ["研究", "声调", "习得", "偏误", "方法"],
    },
    // HSK7 高级进阶
    {
      id: "w-zh-hsk7-01",
      level: "HSK7",
      type: "essay",
      title: "人工智能与人文精神的辩证关系",
      prompt: "请用 500-700 字论述文，辩证分析人工智能发展对人文精神的冲击与重塑。",
      tips: ["辩证看待问题", "阐释而非简单陈述", "结构严谨"],
      minWords: 500,
      maxWords: 700,
      estMinutes: 30,
      sampleAnswer: "人工智能的迅猛发展，既冲击了传统人文精神的边界，也为重塑人文价值提供了新的可能。从辩证的视角看，AI 并非人文精神的对立面，而是其镜像：它以理性的算法凸显了情感、伦理、审美等不可量化的部分。我们对 AI 的反思，本质上是对人自身的反思。唯有以深厚的人文底蕴驾驭技术，才能避免被技术所役。",
      keywords: ["人工智能", "人文", "辩证", "阐释", "反思"],
    },
    {
      id: "w-zh-hsk7-02",
      level: "HSK7",
      type: "story",
      title: "古典意象的现代改写",
      prompt: "选择一首中国古典诗词，用 500-700 字现代散文改写其意境，保留原诗韵味。",
      tips: ["保留核心意象", "用现代语言重组", "注意语体切换"],
      minWords: 500,
      maxWords: 700,
      estMinutes: 30,
      sampleAnswer: "月光如水倾泻在床前，我抬头望见那轮明月，恍惚间以为是秋霜铺地。低下头，思乡的浪潮涌上心头。这不是李白的诗，而是此刻每个异乡人的心境。古典的月光，照在现代的窗上，依然清冷。",
      keywords: ["古典", "意象", "改写", "意境", "现代"],
    },
    // HSK8 精通
    {
      id: "w-zh-hsk8-01",
      level: "HSK8",
      type: "essay",
      title: "学术批评：当代汉语写作的西化倾向",
      prompt: "请用 700-1000 字学术批评，分析当代汉语写作中欧化句式的问题及其对策。",
      tips: ["学术语体规范", "举例分析", "提出建设性建议"],
      minWords: 700,
      maxWords: 1000,
      estMinutes: 40,
      sampleAnswer: "当代汉语写作呈现明显的西化倾向，主要表现为长定语堆叠、被动句滥用、抽象名词泛化。这一现象源于翻译文学的深刻影响，但已超出合理借鉴的边界，导致汉语表达力的衰减。对策不在于排外，而在于融会贯通：既要保留汉语简练有力的传统优势，又要适度吸收外来句式以丰富表达层次。学者应承担起规范汉语的责任，在学术写作中作出表率。",
      keywords: ["汉语", "西化", "学术", "批评", "规范"],
    },
    {
      id: "w-zh-hsk8-02",
      level: "HSK8",
      type: "dialogue",
      title: "跨文化对话：东方智慧与西方理性",
      prompt: "编写 600-900 字对话，模拟一位东方哲人与西方学者的讨论，主题为 '何为智慧'。",
      tips: ["体现双方思想差异", "对话推进有层次", "避免脸谱化"],
      minWords: 600,
      maxWords: 900,
      estMinutes: 35,
      sampleAnswer: "哲人：智慧，在于知其不可而为之。学者：智慧，在于以理性追问未知。哲人：理性是舟，智慧是海。学者：没有舟，人无法渡海。哲人：然舟之终点，应是忘舟。两人相视而笑，各自有所领悟。智慧不是占有，而是放下；不是抵达，而是在路上。",
      keywords: ["智慧", "对话", "理性", "东方", "西方"],
    },
    // HSK9 通级
    {
      id: "w-zh-hsk9-01",
      level: "HSK9",
      type: "essay",
      title: "通级论述：文明互鉴与人类未来",
      prompt: "请用 1000-1500 字论述文，从历史与现实双重维度，论述文明互鉴对人类未来的意义。",
      tips: ["高屋建瓴统揽全局", "钩深致远不囿于表层", "融通中西自成一家之言"],
      minWords: 1000,
      maxWords: 1500,
      estMinutes: 50,
      sampleAnswer: "文明互鉴，是人类应对共同挑战的根本之道。回望历史，丝绸之路上的文化交流催生了盛唐气象；近代东西方思想的碰撞，孕育了五四新文化。当下，气候、伦理、技术等议题已超越单一文明的解决能力，唯有以互鉴之心，融通不同文明的智慧资源，方能在差异中寻求共识，在共识中开创未来。文明互鉴不是同化，而是在保持自身主体性的前提下与他者深度对话。这种对话的能力，正是成熟文明的标志。",
      keywords: ["文明", "互鉴", "融通", "未来", "对话"],
    },
    {
      id: "w-zh-hsk9-02",
      level: "HSK9",
      type: "essay",
      title: "通级散文：论汉语之美",
      prompt: "请用 800-1200 字散文，从音韵、字形、语义、文化四个维度论述汉语的独特之美。",
      tips: ["语体色彩精准把握", "全部语法体系精通", "文言与现代汉语融合"],
      minWords: 800,
      maxWords: 1200,
      estMinutes: 40,
      sampleAnswer: "汉语之美，美在音韵的起伏跌宕，平仄相生间自有一段乐感。美在字形的意蕴深厚，每一字都是一幅浓缩的画。美在语义的多层意蕴，'道'之一字，可道路、可道理、可道法自然。美在文化的积淀，从《诗经》到唐诗，从宋词到现代散文，汉语承载着五千年的精神脉络。习汉语至深处，便会明白：这不是一种工具，而是一种世界观。",
      keywords: ["汉语", "美", "音韵", "字形", "文化"],
    },
  ];

  for (const w of hskWritingSeeds) {
    await prisma.writingPrompt.upsert({
      where: { id: w.id },
      update: {
        languageCode: "zh",
        level: w.level,
        type: w.type,
        title: w.title,
        prompt: w.prompt,
        tips: w.tips,
        minWords: w.minWords,
        maxWords: w.maxWords,
        estMinutes: w.estMinutes,
        sampleAnswer: w.sampleAnswer,
        keywords: w.keywords,
      },
      create: {
        id: w.id,
        languageCode: "zh",
        level: w.level,
        type: w.type,
        title: w.title,
        prompt: w.prompt,
        tips: w.tips,
        minWords: w.minWords,
        maxWords: w.maxWords,
        estMinutes: w.estMinutes,
        sampleAnswer: w.sampleAnswer,
        keywords: w.keywords,
      },
    });

    // 英文翻译（HSK 题目需要让非中文母语者理解）
    await prisma.writingTranslation.upsert({
      where: { writingId_baseLanguageCode: { writingId: w.id, baseLanguageCode: "en" } },
      update: {
        title: w.title,
        prompt: w.prompt,
        tips: w.tips,
        sampleAnswer: w.sampleAnswer,
      },
      create: {
        writingId: w.id,
        baseLanguageCode: "en",
        title: w.title,
        prompt: w.prompt,
        tips: w.tips,
        sampleAnswer: w.sampleAnswer,
      },
    });
  }

  // HSK5-9 阅读段落
  type HskReadingSeed = {
    id: string;
    level: string;
    title: string;
    body: string;
    glossary: { term: string; definition: string }[];
    questions: { id: string; question: string; options: string[]; answer: number }[];
    wordCount: number;
    estMinutes: number;
  };

  const hskReadingSeeds: HskReadingSeed[] = [
    {
      id: "r-zh-hsk5-01",
      level: "HSK5",
      title: "茶与中国文化",
      body: "茶，在中国人的生活中，远不止是一种饮料。它是一种生活的态度，一种文化的载体。从唐代的陆羽著《茶经》开始，茶便被赋予了精神内涵。中国人品茶，讲究的是 '和、静、怡、真' 四字。和，是人与自然的和谐；静，是内心的宁静；怡，是品茗时的愉悦；真，是返璞归真的境界。一杯清茶，承载着东方哲学的精髓。",
      glossary: [
        { term: "载体", definition: "carrier, vehicle" },
        { term: "精神内涵", definition: "spiritual connotation" },
        { term: "返璞归真", definition: "return to original purity" },
      ],
      questions: [
        {
          id: "q1",
          question: "茶的 '和、静、怡、真' 四字体现了什么？",
          options: ["饮茶技巧", "东方哲学精髓", "商业价值", "历史年代"],
          answer: 1,
        },
        {
          id: "q2",
          question: "《茶经》的作者是哪个朝代的？",
          options: ["宋代", "明代", "唐代", "清代"],
          answer: 2,
        },
      ],
      wordCount: 180,
      estMinutes: 5,
    },
    {
      id: "r-zh-hsk7-01",
      level: "HSK7",
      title: "论礼的现代意义",
      body: "孔子所言 '礼'，并非今人所理解的繁文缛节，而是一种内化于心的秩序感。礼的核心，在于对 '他者' 的承认与尊重。现代社会虽已抛弃了古礼的形式，但礼所承载的精神——人与人之间的相互承认——却从未过时。当我们说一个人 '有礼'，我们赞扬的不仅是他的行为得体，更是他内在对他者的体认能力。礼，是文明社会的基石。",
      glossary: [
        { term: "繁文缛节", definition: "red tape, cumbersome formalities" },
        { term: "内化于心", definition: "internalized in the heart" },
        { term: "体认", definition: "to recognize, to acknowledge" },
      ],
      questions: [
        {
          id: "q1",
          question: "作者认为 '礼' 的核心是什么？",
          options: ["行为规范", "对他人承认与尊重", "古代仪式", "社交技巧"],
          answer: 1,
        },
        {
          id: "q2",
          question: "文章认为现代社会需要 '礼' 的哪一部分？",
          options: ["形式", "仪式", "相互承认的精神", "古代制度"],
          answer: 2,
        },
      ],
      wordCount: 220,
      estMinutes: 6,
    },
    {
      id: "r-zh-hsk9-01",
      level: "HSK9",
      title: "文明的对话",
      body: "文明之间真正的对话，不在于互相说服，而在于互相启发。当一种文明遇到了另一种截然不同的文明，它首先感受到的应是惊异而非排斥。惊异，是认识自身局限的开始；排斥，则是封闭自我的延续。历史上每一次伟大的文明交融，都伴随着这种惊异——古希腊人对埃及的惊异，唐人对西域的惊异，近代中国对西方的惊异。正是在惊异中，文明得以突破自身的边界，向更深处生长。",
      glossary: [
        { term: "惊异", definition: "wonder, astonishment" },
        { term: "排斥", definition: "to reject, to exclude" },
        { term: "交融", definition: "integration, blending" },
      ],
      questions: [
        {
          id: "q1",
          question: "作者认为文明对话的本质是什么？",
          options: ["互相说服", "互相启发", "互相竞争", "互相模仿"],
          answer: 1,
        },
        {
          id: "q2",
          question: "'惊异' 在文中的作用是什么？",
          options: ["导致排斥", "认识自身局限", "强化自我", "避免对话"],
          answer: 1,
        },
        {
          id: "q3",
          question: "下列哪一组合体现了文中的 '文明交融'？",
          options: ["唐人-西域", "古希腊-埃及", "近代中国-西方", "以上都是"],
          answer: 3,
        },
      ],
      wordCount: 260,
      estMinutes: 8,
    },
  ];

  for (const r of hskReadingSeeds) {
    await prisma.readingPassage.upsert({
      where: { id: r.id },
      update: {
        languageCode: "zh",
        level: r.level,
        title: r.title,
        body: r.body,
        glossary: r.glossary,
        questions: r.questions,
        wordCount: r.wordCount,
        estMinutes: r.estMinutes,
        readOrder: 0,
      },
      create: {
        id: r.id,
        languageCode: "zh",
        level: r.level,
        title: r.title,
        body: r.body,
        glossary: r.glossary,
        questions: r.questions,
        wordCount: r.wordCount,
        estMinutes: r.estMinutes,
        readOrder: 0,
      },
    });
  }

  // HSK5-9 Quiz（少量示例，复用现有 quiz 模式）
  type HskQuizSeed = {
    id: string;
    level: string;
    question: string;
    options: string[];
    answer: number;
    explain: string;
  };

  const hskQuizSeeds: HskQuizSeed[] = [
    { id: "q-zh-hsk5-01", level: "HSK5", question: "下列哪个句子中 '却' 用法正确？",
      options: ["他却没来参加聚会。", "他却来了。", "他没来参加却聚会。", "他却来不参加聚会。"],
      answer: 0, explain: "'却' 表示转折，应置于主语后、动词前。" },
    { id: "q-zh-hsk5-02", level: "HSK5", question: "'以免' 的正确用法是？",
      options: ["以免天气好，我们去散步。", "带伞以免下雨。", "以免他没来，我们开始吧。", "他以免来了。"],
      answer: 1, explain: "'以免' 表示目的（避免某事发生），后接需要避免的情况。" },
    { id: "q-zh-hsk7-01", level: "HSK7", question: "'阐释' 与 '解释' 的主要区别是？",
      options: ["无区别", "'阐释' 更书面、更深入", "'解释' 更正式", "'阐释' 只用于口语"],
      answer: 1, explain: "'阐释' 多用于学术/书面语境，强调深入剖析；'解释' 更口语化、更通用。" },
    { id: "q-zh-hsk7-02", level: "HSK7", question: "下列成语使用正确的是？",
      options: ["他学识渊博，融会贯通。", "他融会贯通地跑步。", "融会贯通的天气真好。", "融会贯通地吃晚饭。"],
      answer: 0, explain: "'融会贯通' 指把各方面的知识融合贯穿，多用于学习/思考语境。" },
    { id: "q-zh-hsk9-01", level: "HSK9", question: "'高屋建瓴' 比喻什么？",
      options: ["房屋高大", "占据有利地势，势不可挡", "建筑技术高超", "地势险要"],
      answer: 1, explain: "原指在高层屋顶倾倒瓶水，比喻居高临下、势不可挡。" },
    { id: "q-zh-hsk9-02", level: "HSK9", question: "'钩深致远' 的含义是？",
      options: ["钓得深走得远", "探索深奥、追求远大", "钓鱼技术高超", "深远的水域"],
      answer: 1, explain: "'钩深' 指探索深奥之理，'致远' 指达到远大境界，比喻学问精深。" },
  ];

  for (const q of hskQuizSeeds) {
    await prisma.quiz.upsert({
      where: { id: q.id },
      update: {
        languageCode: "zh",
        level: q.level,
        question: q.question,
        options: q.options,
        answer: q.answer,
        explain: q.explain,
        quizOrder: 0,
      },
      create: {
        id: q.id,
        languageCode: "zh",
        level: q.level,
        question: q.question,
        options: q.options,
        answer: q.answer,
        explain: q.explain,
        quizOrder: 0,
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
    `Seeded: ${LANGUAGES.length} languages, ${COURSES.length} courses, ${seedWords.length} words, ${hskWritingSeeds.length} HSK5-9 writing prompts, ${hskReadingSeeds.length} HSK5-9 reading passages, ${hskQuizSeeds.length} HSK5-9 quizzes, ${seedPostsData.length} posts.`
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
