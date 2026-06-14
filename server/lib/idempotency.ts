/**
 * 幂等性和事务工具库
 * 
 * 核心原则：
 * 1. 所有写操作必须支持幂等（重复调用结果一致）
 * 2. 涉及多表操作必须用事务包裹
 * 3. Stripe webhook 必须记录 event ID 防止重复处理
 */

import { prisma, Prisma, TransactionClient } from "./prisma.js";

// ====== Stripe Event 幂等性 ======

/**
 * 检查 Stripe event 是否已处理
 * @returns true = 已处理（跳过），false = 未处理（继续）
 */
export async function isStripeEventProcessed(eventId: string): Promise<boolean> {
  const existing = await prisma.stripeEvent.findUnique({ where: { id: eventId } });
  return existing !== null;
}

/**
 * 记录 Stripe event 已处理（在事务内调用）
 */
export async function recordStripeEvent(
  tx: TransactionClient,
  eventId: string,
  eventType: string,
  payload: Prisma.InputJsonValue,
  userId?: string
): Promise<void> {
  await tx.stripeEvent.create({
    data: {
      id: eventId,
      type: eventType,
      payload,
      userId,
    },
  });
}

/**
 * Stripe webhook 幂等处理包装器
 * 自动检查 + 记录，防止重复处理同一 event
 */
export async function withStripeIdempotency<T>(
  eventId: string,
  eventType: string,
  payload: Prisma.InputJsonValue,
  handler: (tx: TransactionClient) => Promise<T>,
  userId?: string
): Promise<{ processed: boolean; result?: T }> {
  // 1. 先检查是否已处理（快速路径，不进事务）
  if (await isStripeEventProcessed(eventId)) {
    return { processed: true }; // 已处理，跳过
  }

  // 2. 未处理，进入事务执行 handler + 记录 event
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 事务内再次检查（防止并发）
      const existing = await tx.stripeEvent.findUnique({ where: { id: eventId } });
      if (existing) {
        throw new Error("ALREADY_PROCESSING"); // 另一个并发请求正在处理
      }

      // 执行业务逻辑
      const r = await handler(tx);

      // 记录 event
      await recordStripeEvent(tx, eventId, eventType, payload, userId);

      return r;
    });

    return { processed: false, result };
  } catch (err: unknown) {
    if ((err as Error).message === "ALREADY_PROCESSING") {
      return { processed: true }; // 并发冲突，视为已处理
    }
    throw err; // 其他错误抛出
  }
}

// ====== 通用事务包装器 ======

/**
 * 事务执行包装器（统一错误处理）
 */
export async function withTransaction<T>(
  handler: (tx: TransactionClient) => Promise<T>
): Promise<T> {
  return prisma.$transaction(handler);
}

// ====== 进度记录幂等性 ======

/**
 * 进度记录的幂等键（userId + date + operationType）
 * 用于防止同一天同一操作的重复记录
 * 
 * 注意：当前设计中 user_progress_days 表已有 userId + studyDate unique constraint
 * 所以同一天的多次调用会更新同一条记录，天然幂等
 * 
 * 但如果需要更细粒度的幂等（如防止同一单词被重复计分），需要额外机制
 */

// ====== 请求幂等键 ======

/**
 * 基于请求内容的幂等键生成
 * 用于防止短时间内重复提交
 */
export function generateIdempotencyKey(
  userId: string,
  operation: string,
  dataHash: string
): string {
  return `${userId}:${operation}:${dataHash}`;
}

// ====== 用户操作幂等性 ======

/**
 * 检查用户是否存在（用于注册幂等）
 * @returns true = 已存在，false = 不存在
 */
export async function isEmailRegistered(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  return user !== null;
}

/**
 * 用户注册事务（幂等）
 * 如果邮箱已存在，返回现有用户；否则创建新用户
 */
export async function registerUserIdempotent(
  tx: TransactionClient,
  email: string,
  username: string,
  passwordHash: string,
  targetLanguage: string
): Promise<{ user: Prisma.UserGetPayload<{}>; isNew: boolean }> {
  const normalizedEmail = email.toLowerCase().trim();

  // 检查是否已存在
  const existing = await tx.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return { user: existing, isNew: false };
  }

  // 创建新用户
  const user = await tx.user.create({
    data: {
      email: normalizedEmail,
      username,
      passwordHash,
      targetLanguage,
      level: 1,
      exp: 0,
      streak: 1,
      role: "user",
      goalMinutesPerDay: 30,
      jwtVersion: 1,
    },
  });

  return { user, isNew: true };
}

// ====== 点赞幂等性 ======

/**
 * 点赞/取消点赞的幂等操作
 * 使用 unique constraint (postId + userId) 保证幂等
 */
export async function toggleLikeIdempotent(
  tx: TransactionClient,
  postId: string,
  userId: string
): Promise<{ liked: boolean; likeCount: number }> {
  // 检查是否已点赞
  const existing = await tx.likePost.findUnique({
    where: { postId_userId: { postId, userId } },
  });

  if (existing) {
    // 已点赞 → 取消
    await tx.likePost.delete({ where: { id: existing.id } });
  } else {
    // 未点赞 → 创建
    await tx.likePost.create({ data: { postId, userId } });
  }

  // 统计当前点赞数
  const likeCount = await tx.likePost.count({ where: { postId } });

  return { liked: !existing, likeCount };
}

// ====== 评论幂等性 ======

/**
 * 评论创建（天然幂等，每次创建都是新 ID）
 * 如果需要防止重复内容评论，可以加 content hash 检查
 */
export async function createCommentIdempotent(
  tx: TransactionClient,
  postId: string,
  userId: string,
  content: string
): Promise<{
  id: string;
  content: string;
  userId: string;
  postId: string;
  createdAt: Date;
  user: { id: string; username: string; avatar: string | null };
}> {
  const comment = await tx.comment.create({
    data: { postId, userId, content },
    include: { user: { select: { id: true, username: true, avatar: true } } },
  });

  return comment as unknown as {
    id: string;
    content: string;
    userId: string;
    postId: string;
    createdAt: Date;
    user: { id: string; username: string; avatar: string | null };
  };
}