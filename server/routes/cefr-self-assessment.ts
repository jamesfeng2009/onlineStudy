/**
 * P2-2: CEFR 自评（Cefr Self-Assessment）API
 *
 * 设计原则：
 *   1. 每用户每语言一条记录（upsert），保留最近一次更新时间
 *   2. canDoKeys 仅存勾选条目 key（不存原文），原文由前端常量维护
 *   3. 与 PlacementResult 分离：自评是主观，分级测试是客观
 *   4. can-do 描述使用项目原创文案，避免 CEFR 官方 Can-Do 条目版权问题
 *
 * 路由：
 *   GET   /user/cefr-self-assessment?language=ja     (auth)  读取（language 省略则返回全部）
 *   PUT   /user/cefr-self-assessment                  (auth)  upsert（language + cefrLevel + canDoKeys + note）
 *   GET   /cefr-can-do-statements                     (no auth) 拉取项目原创 can-do 条目（前端常量副本）
 */

import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma.js";
import { sendSuccess, sendError } from "../lib/response.js";

// ============================================================
// 常量：CEFR 等级 + 项目原创 Can-Do 条目
// ============================================================

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
type CefrLevel = (typeof CEFR_LEVELS)[number];

const CEFR_RANK: Record<CefrLevel, number> = {
  A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6,
};

function isCefrLevel(v: unknown): v is CefrLevel {
  return typeof v === "string" && (CEFR_LEVELS as readonly string[]).includes(v);
}

interface CanDoStatement {
  key: string;       // 稳定 id，前端用此 key 引用
  level: CefrLevel;
  skill: "listening" | "reading" | "speaking" | "writing";
  text: string;     // 项目原创描述（中文）
}

// 项目原创 Can-Do 条目（参考 CEFR 框架能力维度，但全部为原创文案）
const CAN_DO_STATEMENTS: CanDoStatement[] = [
  // ===== A1 =====
  { key: "a1-listen-1", level: "A1", skill: "listening", text: "能听懂对方缓慢、清晰地说出常见问候与自我介绍" },
  { key: "a1-read-1",   level: "A1", skill: "reading",   text: "能看懂海报、菜单、公告中的简单日常词汇" },
  { key: "a1-speak-1",  level: "A1", skill: "speaking",  text: "能用简单句子介绍自己的姓名、国籍、爱好" },
  { key: "a1-write-1",  level: "A1", skill: "writing",   text: "能填写姓名、地址、电话等基本个人信息表格" },

  // ===== A2 =====
  { key: "a2-listen-1", level: "A2", skill: "listening", text: "能听懂关于购物、点餐、问路等日常话题的简短对话要点" },
  { key: "a2-read-1",   level: "A2", skill: "reading",   text: "能看懂简短私人邮件、便条中的主要信息" },
  { key: "a2-speak-1",  level: "A2", skill: "speaking",  text: "能用连贯句子描述过去的经历、计划与日常安排" },
  { key: "a2-write-1",  level: "A2", skill: "writing",   text: "能写短信或邮件邀请朋友，描述事情经过" },

  // ===== B1 =====
  { key: "b1-listen-1", level: "B1", skill: "listening", text: "能听懂正常语速下关于熟悉话题的对话和新闻要点" },
  { key: "b1-read-1",   level: "B1", skill: "reading",   text: "能看懂旅行指南、产品说明等实用文本的主旨" },
  { key: "b1-speak-1",  level: "B1", skill: "speaking",  text: "能在旅行时应对突发情况，简要表达观点和理由" },
  { key: "b1-write-1",  level: "B1", skill: "writing",   text: "能写一篇连贯的短文，叙述经历或表达看法" },

  // ===== B2 =====
  { key: "b2-listen-1", level: "B2", skill: "listening", text: "能听懂较复杂话题的访谈、播客，理解说话者立场" },
  { key: "b2-read-1",   level: "B2", skill: "reading",   text: "能阅读当代小说、新闻报道，理解作者态度与隐含信息" },
  { key: "b2-speak-1",  level: "B2", skill: "speaking",  text: "能就抽象话题进行流利对话，权衡利弊并给出建议" },
  { key: "b2-write-1",  level: "B2", skill: "writing",   text: "能写一篇观点明确的论述文，结构清晰、论据充分" },

  // ===== C1 =====
  { key: "c1-listen-1", level: "C1", skill: "listening", text: "能听懂学术讲座、辩论、电影对白，无需费力理解" },
  { key: "c1-read-1",   level: "C1", skill: "reading",   text: "能阅读长篇专业文章、文学原著，理解修辞与隐喻" },
  { key: "c1-speak-1",  level: "C1", skill: "speaking",  text: "能就复杂话题即兴发言，灵活使用各种连接手段" },
  { key: "c1-write-1",  level: "C1", skill: "writing",   text: "能写结构清晰、表达准确的长篇报告或论文" },

  // ===== C2 =====
  { key: "c2-listen-1", level: "C2", skill: "listening", text: "能完全听懂任何口语材料，包括方言、口音、快速语流" },
  { key: "c2-read-1",   level: "C2", skill: "reading",   text: "能阅读几乎所有类型的复杂文本，包括古典文学与学术专著" },
  { key: "c2-speak-1",  level: "C2", skill: "speaking",  text: "能参与任何高难度对话，自然运用习语与文化梗" },
  { key: "c2-write-1",  level: "C2", skill: "writing",   text: "能写出风格鲜明、修辞精湛的长篇作品" },
];

const CEFR_LEVEL_META: Record<CefrLevel, { label: string; description: string }> = {
  A1: { label: "入门级", description: "能理解并使用日常表达和基本短语，满足具体需求" },
  A2: { label: "初级", description: "能进行简单直接的信息交换，处理日常事务" },
  B1: { label: "中级", description: "能应对旅行中可能出现的大多数情况，描述经历和事件" },
  B2: { label: "中高级", description: "能就广泛话题进行清晰、流畅的交流，表达观点" },
  C1: { label: "高级", description: "能灵活有效地运用语言进行社交、学术和专业交流" },
  C2: { label: "精通级", description: "能毫不费力地理解几乎所有听到或读到的内容" },
};

// ============================================================
// 路由
// ============================================================

const cefrRoutes: FastifyPluginAsync = async (fastify) => {
  // ====== 1. 拉取 Can-Do 条目（无登录）======
  fastify.get("/cefr-can-do-statements", async (_request, reply) => {
    reply.header("Cache-Control", "public, s-maxage=86400, immutable");
    return sendSuccess(reply, {
      levels: CEFR_LEVELS.map((level) => ({
        level,
        rank: CEFR_RANK[level],
        label: CEFR_LEVEL_META[level].label,
        description: CEFR_LEVEL_META[level].description,
        statements: CAN_DO_STATEMENTS
          .filter((s) => s.level === level)
          .map((s) => ({ key: s.key, skill: s.skill, text: s.text })),
      })),
    });
  });

  // ====== 2. 读取用户自评（auth）======
  fastify.get<{
    Querystring: { language?: string };
  }>("/user/cefr-self-assessment", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { userId } = request.user;
    const { language } = request.query;

    const rows = await prisma.cefrSelfAssessment.findMany({
      where: {
        userId,
        ...(language ? { language } : {}),
      },
      orderBy: { updatedAt: "desc" },
    });

    return sendSuccess(
      reply,
      rows.map((r) => ({
        id: r.id,
        language: r.language,
        cefrLevel: r.cefrLevel,
        cefrRank: r.cefrRank,
        canDoKeys: r.canDoKeys,
        note: r.note,
        assessedAt: r.assessedAt,
        updatedAt: r.updatedAt,
      }))
    );
  });

  // ====== 3. Upsert 用户自评（auth）======
  fastify.put<{
    Body: {
      language?: string;
      cefrLevel?: string;
      canDoKeys?: string[];
      note?: string;
    };
  }>("/user/cefr-self-assessment", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { userId } = request.user;
    const body = request.body ?? ({} as typeof request.body);
    const language = body.language;
    const cefrLevel = body.cefrLevel;

    if (!language || typeof language !== "string" || language.length > 16) {
      return sendError(reply, "BAD_REQUEST", "language 必填且长度需 ≤ 16");
    }
    if (!isCefrLevel(cefrLevel)) {
      return sendError(reply, "BAD_REQUEST", `cefrLevel 必须是 ${CEFR_LEVELS.join("/")} 之一`);
    }

    const canDoKeys = Array.isArray(body.canDoKeys)
      ? body.canDoKeys.filter((k): k is string => typeof k === "string" && k.length <= 64).slice(0, 200)
      : [];

    const note =
      typeof body.note === "string" && body.note.length <= 500 ? body.note : null;

    const saved = await prisma.cefrSelfAssessment.upsert({
      where: { userId_language: { userId, language } },
      create: {
        userId,
        language,
        cefrLevel,
        cefrRank: CEFR_RANK[cefrLevel],
        canDoKeys: canDoKeys as unknown as object,
        note,
      },
      update: {
        cefrLevel,
        cefrRank: CEFR_RANK[cefrLevel],
        canDoKeys: canDoKeys as unknown as object,
        note,
        assessedAt: new Date(),
      },
    });

    request.log.info(
      { userId, language, cefrLevel, canDoCount: canDoKeys.length },
      "cefr-self-assessment: saved"
    );

    return sendSuccess(reply, {
      id: saved.id,
      language: saved.language,
      cefrLevel: saved.cefrLevel,
      cefrRank: saved.cefrRank,
      canDoKeys: saved.canDoKeys,
      note: saved.note,
      assessedAt: saved.assessedAt,
      updatedAt: saved.updatedAt,
    });
  });
};

export default cefrRoutes;
