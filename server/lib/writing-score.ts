/**
 * P3-3: 写作评分纯函数模块
 *
 * 从 server/routes/writing.ts 提取出来，便于单元测试。
 * 不依赖 prisma / fastify，纯函数 + 类型 export。
 */

export interface TokenizeResult {
  words: string[];
  isCjk: boolean;
}

/** 简单分词：按空格 / 标点切分；对 CJK 字符按字符计数 */
export function tokenize(text: string): TokenizeResult {
  if (!text) return { words: [], isCjk: false };
  // 检测是否主要为 CJK（中文/日文/韩文）
  const cjkChars = (text.match(/[\u3400-\u9fff\u3040-\u30ff\uac00-\ud7af]/g) ?? []).length;
  const isCjk = cjkChars > text.length * 0.3;

  if (isCjk) {
    // CJK：去除标点后按字符计数（去掉空格）
    const chars = text.replace(/[\s\p{P}]/gu, "").split("");
    return { words: chars, isCjk: true };
  }
  // 拉丁字母：按空格切分（去除标点）
  const words = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0);
  return { words, isCjk: false };
}

export interface ScoreResult {
  wordCount: number;
  score: number;
  lengthScore: number;
  varietyScore: number;
  keywordScore: number;
  feedback: {
    lengthHint: string;
    varietyHint: string;
    keywordHint: string;
    matchedKeywords: string[];
    missedKeywords: string[];
    suggestions: string[];
  };
}

export interface ComputeScoreOptions {
  minWords: number;
  maxWords: number;
  keywords: string[];
  isCjkHint?: boolean;
}

export function computeScore(content: string, opts: ComputeScoreOptions): ScoreResult {
  const { words, isCjk } = tokenize(content);
  const wordCount = words.length;
  const { minWords, maxWords, keywords } = opts;

  // ===== lengthScore =====
  let lengthScore: number;
  let lengthHint: string;
  if (wordCount < minWords) {
    lengthScore = Math.round((wordCount / minWords) * 100);
    lengthHint = `字数偏少（${wordCount} / 推荐 ${minWords}-${maxWords}），可补充更多细节或例证`;
  } else if (wordCount > maxWords * 1.5) {
    const excess = wordCount - maxWords;
    lengthScore = Math.max(40, 100 - Math.floor(excess / maxWords) * 20);
    lengthHint = `字数偏多（${wordCount} / 推荐 ${minWords}-${maxWords}），可适当精简`;
  } else {
    lengthScore = 100;
    lengthHint = `字数合适（${wordCount} 字，推荐 ${minWords}-${maxWords}）`;
  }

  // ===== varietyScore：1 - 重复率 =====
  let varietyScore: number;
  let varietyHint: string;
  if (wordCount === 0) {
    varietyScore = 0;
    varietyHint = "尚未提交内容";
  } else {
    const freq = new Map<string, number>();
    for (const w of words) {
      freq.set(w, (freq.get(w) ?? 0) + 1);
    }
    const uniqueCount = freq.size;
    const repeatCount = wordCount - uniqueCount;
    const repeatRate = repeatCount / wordCount;
    varietyScore = Math.round((1 - Math.min(repeatRate, 1)) * 100);
    if (varietyScore >= 80) {
      varietyHint = `词汇多样（${uniqueCount} 个不同词 / 共 ${wordCount} 词）`;
    } else if (varietyScore >= 60) {
      varietyHint = `词汇较为多样（${uniqueCount} 个不同词），可尝试用同义替换重复词`;
    } else {
      varietyHint = `词汇重复较多（${uniqueCount} 个不同词 / 共 ${wordCount} 词），建议替换高频重复词`;
    }
  }

  // ===== keywordScore =====
  let keywordScore: number;
  let keywordHint: string;
  const matchedKeywords: string[] = [];
  const missedKeywords: string[] = [];
  if (keywords.length === 0) {
    keywordScore = 100;
    keywordHint = "本题未设置关键词要求";
  } else {
    const lower = content.toLowerCase();
    for (const kw of keywords) {
      const k = kw.toLowerCase();
      if (lower.includes(k)) matchedKeywords.push(kw);
      else missedKeywords.push(kw);
    }
    keywordScore = Math.round((matchedKeywords.length / keywords.length) * 100);
    if (matchedKeywords.length === keywords.length) {
      keywordHint = `命中全部 ${keywords.length} 个关键词`;
    } else if (matchedKeywords.length > 0) {
      keywordHint = `命中 ${matchedKeywords.length} / ${keywords.length} 个关键词，缺失：${missedKeywords.join(", ")}`;
    } else {
      keywordHint = `未命中任何关键词（${keywords.length} 个期望词），建议围绕主题展开`;
    }
  }

  // ===== 综合评分 =====
  const score = Math.round(lengthScore * 0.3 + varietyScore * 0.3 + keywordScore * 0.4);

  // ===== 综合建议 =====
  const suggestions: string[] = [];
  if (lengthScore < 80) suggestions.push(lengthHint);
  if (varietyScore < 80) suggestions.push(varietyHint);
  if (keywordScore < 80) suggestions.push(keywordHint);
  if (isCjk) {
    suggestions.push("中文/日文/韩文写作：注意标点与段落分隔，避免一逗到底");
  }
  if (suggestions.length === 0) {
    suggestions.push("整体表现良好，继续保持！");
  }

  return {
    wordCount,
    score,
    lengthScore,
    varietyScore,
    keywordScore,
    feedback: {
      lengthHint,
      varietyHint,
      keywordHint,
      matchedKeywords,
      missedKeywords,
      suggestions,
    },
  };
}
