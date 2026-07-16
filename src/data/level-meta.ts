/**
 * P0-2: 等级元数据
 *
 * 每个等级的学习目标、词汇量、学时、语法点。
 *
 * ⚠️ 法律合规：
 * - `learningGoals` 是本项目原创描述，参考 CEFR 能力维度思路但用自己语言重写
 * - 不抄 CEFR Companion Volume 的官方 Can-Do 语句原文（版权归 Council of Europe）
 * - 只在 `frameworkAlignment` 字段标注对齐关系（合理使用）
 *
 * 数据来源参考：
 * - Cambridge English / British Council 的 CEFR 引导学时数据
 * - JLPT 官方词汇/汉字/学时统计
 * - HSK 2.0 / 3.0 词汇表
 * - TOPIK 官方等级能力描述
 * - 项目内现有 grammar-points.ts 的语法点
 */

import type { LevelMeta } from "../types";
import type { CefrLevel } from "../lib/level-utils";

type LevelMetaMap = Record<string, LevelMeta>;

// ============================================================
// 通用 CEFR 等级元数据模板（en/es/fr/de/it 共用）
// ============================================================

const CEFR_LEVEL_META: Record<CefrLevel, Omit<LevelMeta, "code">> = {
  A1: {
    cefrAlignment: "A1",
    name: "Beginner",
    learningGoals: [
      "掌握日常问候、自我介绍等 50 个核心句型",
      "认识约 700 个高频词汇",
      "能听懂慢速日常对话（理解率约 60%）",
      "能写 50-100 词的简单短文",
    ],
    vocabTarget: 700,
    guidedHours: 100,
    grammarPoints: ["be 动词", "一般疑问句", "物主代词", "一般现在时", "名词单复数"],
    frameworkAlignment: { framework: "CEFR", level: "A1" },
  },
  A2: {
    cefrAlignment: "A2",
    name: "Elementary",
    learningGoals: [
      "能处理购物、问路、点餐等日常高频场景",
      "认识约 1,500 个词汇",
      "能读懂简短通知、广告、邮件",
      "能写 100-150 词的日常生活描述",
    ],
    vocabTarget: 1500,
    guidedHours: 200,
    grammarPoints: ["一般过去时", "现在进行时", "比较级", "冠词", "可数/不可数名词"],
    frameworkAlignment: { framework: "CEFR", level: "A2" },
  },
  B1: {
    cefrAlignment: "B1",
    name: "Intermediate",
    learningGoals: [
      "能应对旅行中大多数情境",
      "认识约 2,500-3,000 个词汇",
      "能读懂日常书面材料、短篇新闻",
      "能就经历/观点做简单连贯的口头或书面表达",
    ],
    vocabTarget: 3000,
    guidedHours: 400,
    grammarPoints: ["现在完成时", "被动语态", "条件句", "定语从句", "情态动词"],
    frameworkAlignment: { framework: "CEFR", level: "B1" },
  },
  B2: {
    cefrAlignment: "B2",
    name: "Upper-Intermediate",
    learningGoals: [
      "能理解复杂文本主旨、抽象话题",
      "认识约 4,000-5,000 个词汇",
      "能与母语者较流利自然交流",
      "能写详细的观点文、议论文",
    ],
    vocabTarget: 5000,
    guidedHours: 600,
    grammarPoints: ["虚拟语气", "过去完成时", "非谓语动词", "倒装句", "名词性从句"],
    frameworkAlignment: { framework: "CEFR", level: "B2" },
  },
  C1: {
    cefrAlignment: "C1",
    name: "Advanced",
    learningGoals: [
      "能理解长篇难度文本、隐含意义",
      "认识约 8,000 个词汇",
      "能流畅自发表达，用于社交/学术/职场",
      "能写结构清晰的复杂论述",
    ],
    vocabTarget: 8000,
    guidedHours: 800,
    grammarPoints: ["复杂从句嵌套", "高级虚拟语气", "修辞倒装", "独立主格结构"],
    frameworkAlignment: { framework: "CEFR", level: "C1" },
  },
  C2: {
    cefrAlignment: "C2",
    name: "Mastery",
    learningGoals: [
      "几乎无障碍理解听到/读到的所有内容",
      "认识约 16,000 个词汇",
      "能精准表达细微差别，接近母语水平",
      "能处理学术、文学、专业领域的复杂文本",
    ],
    vocabTarget: 16000,
    guidedHours: 1200,
    grammarPoints: ["全部语法体系精通", "语体色彩辨析", "修辞手法运用"],
    frameworkAlignment: { framework: "CEFR", level: "C2" },
  },
};

/** 给 CEFR 体系语言生成 levelMeta map */
function makeCefrLevelMeta(levels: string[]): Record<string, LevelMeta> {
  const result: Record<string, LevelMeta> = {};
  for (const code of levels) {
    const cefr = code as CefrLevel;
    const base = CEFR_LEVEL_META[cefr];
    if (base) {
      result[code] = { ...base, code };
    }
  }
  return result;
}

// ============================================================
// 各语言的等级元数据
// ============================================================

export const LEVEL_META: Record<string, LevelMetaMap> = {
  // ── 欧洲语言（en/es/fr/de/it）直接用 CEFR 模板 ──
  en: makeCefrLevelMeta(["A1", "A2", "B1", "B2", "C1", "C2"]),
  es: makeCefrLevelMeta(["A1", "A2", "B1", "B2", "C1", "C2"]),
  fr: makeCefrLevelMeta(["A1", "A2", "B1", "B2", "C1", "C2"]),
  de: makeCefrLevelMeta(["A1", "A2", "B1", "B2", "C1", "C2"]),
  it: makeCefrLevelMeta(["A1", "A2", "B1", "B2", "C1", "C2"]),

  // ── 日语（JLPT N5-N1）──
  ja: {
    N5: {
      code: "N5",
      cefrAlignment: "A1",
      name: "初級",
      learningGoals: [
        "掌握平假名、片假名及约 100 个基础汉字",
        "认识约 800 个词汇",
        "能听懂慢速日常对话",
        "能读懂基础短文和告示",
      ],
      vocabTarget: 800,
      guidedHours: 200,
      grammarPoints: ["です/ます 形", "は が 主题", "助词 は/が/を/に/で", "形容词（い/な）", "动词ます形"],
      frameworkAlignment: { framework: "JLPT", level: "N5" },
    },
    N4: {
      code: "N4",
      cefrAlignment: "A2",
      name: "初級後期",
      learningGoals: [
        "认识约 1,500 个词汇、约 300 个汉字",
        "能读懂日常熟悉话题的基本文章",
        "能听懂日常会话（中速）",
      ],
      vocabTarget: 1500,
      guidedHours: 400,
      grammarPoints: ["动词て形", "た/ない形", "可能态", "条件形 と/ば/たら", "授受动词 てあげる/てもらう"],
      frameworkAlignment: { framework: "JLPT", level: "N4" },
    },
    N3: {
      code: "N3",
      cefrAlignment: "B1",
      name: "中級",
      learningGoals: [
        "认识约 3,500-4,000 个词汇、约 600 个汉字",
        "能读懂日常书面材料概要",
        "能听懂接近自然语速的日常会话",
      ],
      vocabTarget: 4000,
      guidedHours: 700,
      grammarPoints: ["被动使役", "形式名词 こと/もの/ところ", "样态 そう/よう", "条件 なら", "敬语基础"],
      frameworkAlignment: { framework: "JLPT", level: "N3" },
    },
    N2: {
      code: "N2",
      cefrAlignment: "B2",
      name: "中上級",
      learningGoals: [
        "认识约 6,000 个词汇、约 1,000 个汉字",
        "能读懂报刊评论、一般评论文章",
        "能听懂自然语速的连贯对话与新闻",
      ],
      vocabTarget: 6000,
      guidedHours: 1000,
      grammarPoints: ["敬语完整体系", "书面体 だ/である", "文语残留", "复合动词", "高级助词组合"],
      frameworkAlignment: { framework: "JLPT", level: "N2" },
    },
    N1: {
      code: "N1",
      cefrAlignment: "C1",
      name: "上級",
      learningGoals: [
        "认识约 10,000-15,000 个词汇、约 2,000 个汉字",
        "能读懂逻辑复杂/抽象的文章",
        "能听懂自然语速的讲座、新闻、讨论",
      ],
      vocabTarget: 12000,
      guidedHours: 1500,
      grammarPoints: ["古文残余表达", "高级书面语", "学术用语", "复杂长句解析"],
      frameworkAlignment: { framework: "JLPT", level: "N1" },
    },
  },

  // ── 韩语（TOPIK 1-6，P0-2 迁移）──
  ko: {
    TOPIK1: {
      code: "TOPIK1",
      cefrAlignment: "A1",
      name: "입문",
      learningGoals: [
        "掌握韩文字母（한글）读写",
        "认识约 800 个基础词汇",
        "能做自我介绍、问候、点餐、问路",
        "能读懂简单日常短文",
      ],
      vocabTarget: 800,
      guidedHours: 100,
      grammarPoints: ["입니다/입니까", "은/는 主题", "이/가 主语", "을/를 宾语", "에/에서 处所"],
      frameworkAlignment: { framework: "TOPIK", level: "TOPIK1" },
    },
    TOPIK2: {
      code: "TOPIK2",
      cefrAlignment: "A2",
      name: "초급",
      learningGoals: [
        "认识约 1,500-2,000 个词汇",
        "能处理日常事务、使用公共设施",
        "能读懂简单短文、写便条",
      ],
      vocabTarget: 2000,
      guidedHours: 200,
      grammarPoints: ["아요/어요 终结词尾", "았/었 过去时", "고 并列", "지만 转折", "를 원하다/하고 싶다"],
      frameworkAlignment: { framework: "TOPIK", level: "TOPIK2" },
    },
    TOPIK3: {
      code: "TOPIK3",
      cefrAlignment: "B1",
      name: "중급",
      learningGoals: [
        "认识约 3,000-4,000 个词汇",
        "能独立处理日常、理解社会关系",
        "能看懂熟悉新闻话题",
      ],
      vocabTarget: 4000,
      guidedHours: 400,
      grammarPoints: ["게 되다/게 하다", "기 때문에", "느라고", "을/ㄹ 수 있다", "은/는 편이다"],
      frameworkAlignment: { framework: "TOPIK", level: "TOPIK3" },
    },
    TOPIK4: {
      code: "TOPIK4",
      cefrAlignment: "B2",
      name: "중상급",
      learningGoals: [
        "认识约 4,000-6,000 个词汇",
        "能使用公共设施、维护社交关系",
        "能看懂新闻报纸（留学门槛）",
      ],
      vocabTarget: 6000,
      guidedHours: 600,
      grammarPoints: ["은/ㄴ 것 같다", "기로 하다", "더라", "ㄹ/을 뻔하다", "는/(으)ㄴ 척하다"],
      frameworkAlignment: { framework: "TOPIK", level: "TOPIK4" },
    },
    TOPIK5: {
      code: "TOPIK5",
      cefrAlignment: "C1",
      name: "고급",
      learningGoals: [
        "认识约 6,000-8,000 个词汇",
        "能进行专业沟通、理解陌生话题",
        "能得体使用正式/非正式语言",
      ],
      vocabTarget: 8000,
      guidedHours: 900,
      grammarPoints: ["기 마련이다", "ㄹ/을 법하다", "는/(으)ㄴ 김에", "자마자", "ㄴ/는다기보다"],
      frameworkAlignment: { framework: "TOPIK", level: "TOPIK5" },
    },
    TOPIK6: {
      code: "TOPIK6",
      cefrAlignment: "C2",
      name: "심화",
      learningGoals: [
        "认识约 8,000-10,000+ 个词汇",
        "接近母语流利水平",
        "能精准表达观点，胜任学术/专业场景",
      ],
      vocabTarget: 10000,
      guidedHours: 1200,
      grammarPoints: ["고급 한자어", "문어체 笔语体", "비유/은유 比喻隐喻"],
      frameworkAlignment: { framework: "TOPIK", level: "TOPIK6" },
    },
  },

  // ── 汉语（HSK 3.0，1-9 级；HSK1-6 沿用 2.0 词汇表，HSK7-9 为 3.0 高级/精通/通级）──
  zh: {
    HSK1: {
      code: "HSK1",
      cefrAlignment: "A1",
      name: "入门",
      learningGoals: [
        "掌握拼音、声调及约 500 个常用汉字（HSK 3.0）",
        "能理解并使用基础问候与简单短语",
        "能听懂慢速日常对话",
      ],
      vocabTarget: 500,
      guidedHours: 80,
      grammarPoints: ["是/不是", "的 所属", "在 处所", "疑问词 什么/谁/哪", "数字与量词"],
      frameworkAlignment: { framework: "HSK", level: "HSK1" },
    },
    HSK2: {
      code: "HSK2",
      cefrAlignment: "A2",
      name: "基础",
      learningGoals: [
        "认识约 1,200 个词汇（HSK 3.0）",
        "能就日常熟悉话题简单交流",
        "能读懂简短文本",
      ],
      vocabTarget: 1200,
      guidedHours: 200,
      grammarPoints: ["了 完成", "正在 进行", "想/要 愿望", "太...了 程度", "比较句 比"],
      frameworkAlignment: { framework: "HSK", level: "HSK2" },
    },
    HSK3: {
      code: "HSK3",
      cefrAlignment: "B1",
      name: "进阶",
      learningGoals: [
        "认识约 2,200 个词汇（HSK 3.0）",
        "能就生活/学习/工作做基本交流",
        "能听懂正常语速日常对话",
      ],
      vocabTarget: 2200,
      guidedHours: 400,
      grammarPoints: ["过 经历", "结果补语", "把 字句", "被 字句", "虽然...但是"],
      frameworkAlignment: { framework: "HSK", level: "HSK3" },
    },
    HSK4: {
      code: "HSK4",
      cefrAlignment: "B2",
      name: "中级",
      learningGoals: [
        "认识约 3,245 个词汇（HSK 3.0）",
        "能较流利地就较广话题交流",
        "能读懂报刊文章、看懂影视",
      ],
      vocabTarget: 3245,
      guidedHours: 600,
      grammarPoints: ["连...都", "不仅...而且", "既然...就", "即使...也", "程度补语 极了/得很"],
      frameworkAlignment: { framework: "HSK", level: "HSK4" },
    },
    HSK5: {
      code: "HSK5",
      cefrAlignment: "C1",
      name: "高级",
      learningGoals: [
        "认识约 4,316 个词汇（HSK 3.0）",
        "能阅读中文报刊、看影视、写短文",
        "能听懂广播、新闻",
      ],
      vocabTarget: 4316,
      guidedHours: 900,
      grammarPoints: ["却 转折", "并 强化", "何况 递进", "以免 目的", "连字句 程度极限"],
      frameworkAlignment: { framework: "HSK", level: "HSK5" },
    },
    HSK6: {
      code: "HSK6",
      cefrAlignment: "C1",
      name: "高级后",
      learningGoals: [
        "认识约 5,456 个词汇（HSK 3.0）",
        "能轻松理解听说读写各类内容",
        "能写较长论述文、学术文章",
      ],
      vocabTarget: 5456,
      guidedHours: 1200,
      grammarPoints: ["文言残余", "成语熟语", "书面体运用", "复杂长句结构"],
      frameworkAlignment: { framework: "HSK", level: "HSK6" },
    },
    HSK7: {
      code: "HSK7",
      cefrAlignment: "C2",
      name: "高级进阶",
      learningGoals: [
        "认识约 6,000+ 个词汇（HSK 3.0 高级）",
        "能读懂长篇学术、专业、文学文本",
        "能听懂各类讲座、辩论、广播节目",
        "能就复杂话题写结构严谨的论述",
      ],
      vocabTarget: 6488,
      guidedHours: 1500,
      grammarPoints: ["书面语体转换", "高级连词运用", "古汉语残留辨析", "长句拆解重组", "成语典故应用"],
      frameworkAlignment: { framework: "HSK", level: "HSK7" },
    },
    HSK8: {
      code: "HSK8",
      cefrAlignment: "C2",
      name: "精通",
      learningGoals: [
        "认识约 8,000+ 个词汇（HSK 3.0 精通）",
        "能无障碍理解专业领域中文文献",
        "能参与高难度学术辩论、即兴演讲",
        "能写出接近母语者水准的学术与文学作品",
      ],
      vocabTarget: 8226,
      guidedHours: 1800,
      grammarPoints: ["学术语体规范", "修辞手法综合运用", "书面与口语灵活切换", "跨文化语境表达", "复杂句式嵌套"],
      frameworkAlignment: { framework: "HSK", level: "HSK8" },
    },
    HSK9: {
      code: "HSK9",
      cefrAlignment: "C2",
      name: "通级",
      learningGoals: [
        "认识约 11,000+ 个词汇（HSK 3.0 通级）",
        "能自由应对任何中文场景，接近母语者水平",
        "能批判性分析复杂文本，洞察隐含意义",
        "能在学术、外交、文学创作等专业领域游刃有余",
      ],
      vocabTarget: 11092,
      guidedHours: 2200,
      grammarPoints: ["语体色彩精准把握", "全部语法体系精通", "文言与现代汉语融合", "修辞极致运用", "跨语言思维转换"],
      frameworkAlignment: { framework: "HSK", level: "HSK9" },
    },
  },

  // ── 泰语（对齐 CEFR A1-C1）──
  th: {
    A1: { ...CEFR_LEVEL_META.A1, code: "A1", frameworkAlignment: { framework: "CEFR", level: "A1" } },
    A2: { ...CEFR_LEVEL_META.A2, code: "A2", frameworkAlignment: { framework: "CEFR", level: "A2" } },
    B1: { ...CEFR_LEVEL_META.B1, code: "B1", frameworkAlignment: { framework: "CEFR", level: "B1" } },
    B2: { ...CEFR_LEVEL_META.B2, code: "B2", frameworkAlignment: { framework: "CEFR", level: "B2" } },
    C1: { ...CEFR_LEVEL_META.C1, code: "C1", frameworkAlignment: { framework: "CEFR", level: "C1" } },
  },

  // ── 粤语（对齐 CEFR A1-B2；粤语暂无国际通用标准）──
  yue: {
    A1: {
      ...CEFR_LEVEL_META.A1,
      code: "A1",
      learningGoals: [
        "掌握粤语九声六调基础",
        "认识约 800 个常用粤语词汇",
        "能做日常问候、自我介绍、点餐",
        "能听懂慢速粤语对话",
      ],
      frameworkAlignment: { framework: "CEFR", level: "A1" },
    },
    A2: {
      ...CEFR_LEVEL_META.A2,
      code: "A2",
      learningGoals: [
        "认识约 1,500 个粤语词汇",
        "能处理购物、问路、闲聊场景",
        "能听懂中速日常对话",
      ],
      frameworkAlignment: { framework: "CEFR", level: "A2" },
    },
    B1: {
      ...CEFR_LEVEL_META.B1,
      code: "B1",
      learningGoals: [
        "认识约 3,000 个粤语词汇",
        "能就较广话题交流",
        "能看懂港剧、粤语新闻主要信息",
      ],
      frameworkAlignment: { framework: "CEFR", level: "B1" },
    },
    B2: {
      ...CEFR_LEVEL_META.B2,
      code: "B2",
      learningGoals: [
        "认识约 5,000 个粤语词汇",
        "能与母语者流利交流",
        "能听懂快语速港产片、新闻",
      ],
      frameworkAlignment: { framework: "CEFR", level: "B2" },
    },
  },
};

/**
 * 获取某语言某等级的 LevelMeta。
 * 若该语言没在 LEVEL_META 注册，返回 undefined。
 */
export function getLevelMeta(language: string, level: string): LevelMeta | undefined {
  return LEVEL_META[language]?.[level];
}

/**
 * 列出某语言所有等级的 LevelMeta。
 */
export function listLevelMeta(language: string): LevelMeta[] {
  const map = LEVEL_META[language];
  if (!map) return [];
  return Object.values(map);
}
