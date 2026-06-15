import fs from "node:fs";
import path from "node:path";
import { tatoeba } from "./lib/tatoeba.js";

const OUT_DIR = path.join(process.cwd(), "generated");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const CEDICT_PATH = path.join(process.cwd(), "scripts", "cache", "cedict_1_0_ts_utf-8_mdbg.txt");

// 简单 HSK 1-4 高频词种子（与 CEDICT 对齐）
const HSK_WORDS: Record<string, string[]> = {
  "HSK1": ["我", "你", "他", "她", "我们", "这", "那", "这里", "那里", "谁", "什么", "几", "个", "岁", "家", "学校", "老师", "学生", "朋友", "中国", "北京", "喜欢", "爱", "吃", "喝", "看", "听", "说", "读", "写"],
  "HSK2": ["时间", "现在", "昨天", "今天", "明天", "早上", "中午", "晚上", "年", "月", "日", "星期", "天气", "雨", "雪", "风", "冷", "热", "高兴", "累", "忙", "饿", "渴", "舒服", "漂亮", "帅", "聪明", "努力", "认真", "马虎"],
  "HSK3": ["机场", "火车", "地铁", "公共汽车", "出租车", "宾馆", "饭店", "医院", "银行", "商店", "超市", "公园", "图书馆", "博物馆", "电影院", "机会", "经验", "习惯", "关系", "办法", "原因", "结果", "道歉", "感谢", "放心", "担心", "关心", "惊讶", "失望", "满意"],
  "HSK4": ["文化", "历史", "艺术", "科学", "技术", "经济", "政治", "社会", "环境", "教育", "健康", "安全", "法律", "道德", "责任", "权利", "自由", "平等", "和平", "发展", "变化", "影响", "支持", "反对", "参加", "组织", "讨论", "决定", "安排", "准备"],
};

interface CedictEntry {
  traditional: string;
  simplified: string;
  pinyin: string;
  definitions: string[];
}

function parseCedictLine(raw: string): CedictEntry | null {
  const line = raw.trim();
  if (line.startsWith("#")) return null;
  const match = line.match(/^(.+?)\s+(.+?)\s+\[(.+?)\]\s+\/(.+)\/$/);
  if (!match) return null;
  const [, traditional, simplified, pinyin, defStr] = match;
  const definitions = defStr.split("/").filter(Boolean);
  return { traditional, simplified, pinyin, definitions };
}

async function generate() {
  if (!fs.existsSync(CEDICT_PATH)) {
    throw new Error(`CC-CEDICT not found at ${CEDICT_PATH}. Run: curl -L -o scripts/cache/cedict_1_0_ts_utf-8_mdbg.txt.gz https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz && gunzip scripts/cache/cedict_1_0_ts_utf-8_mdbg.txt.gz`);
  }

  console.log("Parsing CC-CEDICT...");
  const cedictLines = fs.readFileSync(CEDICT_PATH, "utf-8").split("\n");
  const cedictMap = new Map<string, CedictEntry>();
  for (const line of cedictLines) {
    const entry = parseCedictLine(line);
    if (entry) cedictMap.set(entry.simplified, entry);
  }

  const wordItems: Record<string, unknown>[] = [];
  const quizItems: Record<string, unknown>[] = [];

  for (const [level, words] of Object.entries(HSK_WORDS)) {
    for (const word of words) {
      const entry = cedictMap.get(word);
      if (!entry) continue;
      const meaning = entry.definitions[0] || "";
      const example = tatoeba.findExample(word, "cmn") || "";

      wordItems.push({
        id: `gen-zh-${word}`,
        word,
        translation: meaning,
        phonetic: entry.pinyin,
        example,
        language: "zh",
        level,
      });

      if (meaning && quizItems.length < 200) {
        const distractors = words
          .filter((w) => w !== word)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map((w) => cedictMap.get(w)?.definitions[0])
          .filter(Boolean) as string[];
        const options = [meaning, ...distractors];
        while (options.length < 4) options.push("—");
        const shuffled = options.slice(0, 4).sort(() => 0.5 - Math.random());
        quizItems.push({
          id: `gen-zh-q-${word}`,
          languageCode: "zh",
          level,
          question: `“${word}”是什么意思？`,
          options: shuffled,
          answer: shuffled.indexOf(meaning),
          explain: `“${word}”（${entry.pinyin}）的意思是：${meaning}`,
        });
      }
    }
  }

  fs.writeFileSync(path.join(OUT_DIR, "zh-words.json"), JSON.stringify(wordItems, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "zh-quizzes.json"), JSON.stringify(quizItems, null, 2));

  console.log(`Generated ${wordItems.length} Chinese words and ${quizItems.length} quizzes.`);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
