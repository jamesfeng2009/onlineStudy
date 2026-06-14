import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma";
import { toggleLikeIdempotent, createCommentIdempotent } from "../lib/idempotency";

const communityRoutes: FastifyPluginAsync = async (fastify) => {
  const authenticate = async (request: any, reply: any) => {
    await request.jwtVerify();
  };

  // ====== 获取帖子列表（读操作，无需事务） ======
  fastify.get<{
    Querystring: { topic?: string };
  }>("/posts", async (request, reply) => {
    const { topic } = request.query;

    const where: Record<string, unknown> = {};
    if (topic) where.topic = topic;

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        likes: true,
        comments: {
          orderBy: { createdAt: "asc" },
          include: { user: { select: { id: true, username: true, avatar: true } } },
        },
      },
    });

    // 尝试获取当前用户（可选认证）
    let currentUserId: string | null = null;
    try {
      await request.jwtVerify();
      const u = request.user as { userId: string } | undefined;
      if (u?.userId) currentUserId = u.userId;
    } catch {
      // 未认证，视为匿名用户
    }

    return reply.send(
      posts.map((p) => ({
        id: p.id,
        authorId: p.author.id,
        authorName: p.author.username,
        avatar: p.author.avatar,
        topic: p.topic,
        content: p.content,
        createdAt: p.createdAt.toISOString(),
        likeCount: p.likes.length,
        likedByMe: currentUserId ? p.likes.some((l) => l.userId === currentUserId) : false,
        comments: p.comments.map((c) => ({
          id: c.id,
          authorId: c.userId,
          authorName: c.user.username,
          avatar: c.user.avatar,
          content: c.content,
          createdAt: c.createdAt.toISOString(),
        })),
      }))
    );
  });

  // ====== 创建帖子（幂等：每次创建新 ID） ======
  fastify.post<{
    Body: { topic: string; content: string };
  }>("/posts", { onRequest: [authenticate] }, async (request, reply) => {
    const { userId } = request.user as { userId: string };
    const { topic, content } = request.body;

    if (!topic || !content) {
      return reply.status(400).send({ error: "topic 和 content 不能为空" });
    }

    // 单表创建，天然幂等（每次生成新 UUID）
    const post = await prisma.post.create({
      data: { authorId: userId, topic, content },
      include: { author: { select: { id: true, username: true, avatar: true } } },
    });

    return reply.status(201).send({
      id: post.id,
      authorId: post.author.id,
      authorName: post.author.username,
      avatar: post.author.avatar,
      topic: post.topic,
      content: post.content,
      createdAt: post.createdAt.toISOString(),
      likeCount: 0,
      likedByMe: false,
      comments: [],
    });
  });

  // ====== 点赞/取消点赞（幂等 + 事务） ======
  // 使用 unique constraint (postId + userId) 保证幂等
  fastify.post<{
    Params: { id: string };
  }>("/posts/:id/like", { onRequest: [authenticate] }, async (request, reply) => {
    const { userId } = request.user as { userId: string };
    const { id: postId } = request.params;

    // 检查帖子是否存在
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return reply.status(404).send({ error: "Post 不存在" });

    // 使用事务包裹点赞操作（幂等）
    const result = await prisma.$transaction(async (tx) => {
      return toggleLikeIdempotent(tx, postId, userId);
    });

    return reply.send({ id: postId, likeCount: result.likeCount, likedByMe: result.liked });
  });

  // ====== 添加评论（幂等 + 事务） ======
  // 每次创建新评论，天然幂等（新 UUID）
  fastify.post<{
    Params: { id: string };
    Body: { content: string };
  }>("/posts/:id/comment", { onRequest: [authenticate] }, async (request, reply) => {
    const { userId } = request.user as { userId: string };
    const { id: postId } = request.params;
    const { content } = request.body;

    if (!content || content.trim().length === 0) {
      return reply.status(400).send({ error: "content 不能为空" });
    }

    // 检查帖子是否存在
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return reply.status(404).send({ error: "Post 不存在" });

    // 使用事务创建评论（幂等）
    const comment = await prisma.$transaction(async (tx) => {
      return createCommentIdempotent(tx, postId, userId, content.trim());
    });

    return reply.status(201).send({
      id: comment.id,
      authorId: comment.user.id,
      authorName: comment.user.username,
      avatar: comment.user.avatar,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
    });
  });

  // ====== 删除帖子（幂等 + 事务） ======
  // 删除操作天然幂等：删除已删除的记录 = 无操作
  fastify.delete<{
    Params: { id: string };
  }>("/posts/:id", { onRequest: [authenticate] }, async (request, reply) => {
    const { userId } = request.user as { userId: string };
    const { id: postId } = request.params;

    // 检查帖子是否存在且属于当前用户
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return reply.status(404).send({ error: "Post 不存在" });
    if (post.authorId !== userId) {
      return reply.status(403).send({ error: "无权删除此帖子" });
    }

    // 使用事务删除帖子及其关联数据（likes + comments）
    await prisma.$transaction(async (tx) => {
      // 先删除关联的点赞和评论
      await tx.likePost.deleteMany({ where: { postId } });
      await tx.comment.deleteMany({ where: { postId } });
      // 再删除帖子本身
      await tx.post.delete({ where: { id: postId } });
    });

    return reply.send({ ok: true, id: postId });
  });

  // ====== 删除评论（幂等） ======
  fastify.delete<{
    Params: { postId: string; commentId: string };
  }>("/posts/:postId/comments/:commentId", { onRequest: [authenticate] }, async (request, reply) => {
    const { userId } = request.user as { userId: string };
    const { postId, commentId } = request.params;

    // 检查评论是否存在且属于当前用户
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { post: { select: { id: true } } },
    });

    if (!comment) return reply.status(404).send({ error: "Comment 不存在" });
    if (comment.postId !== postId) {
      return reply.status(400).send({ error: "评论不属于该帖子" });
    }
    if (comment.userId !== userId) {
      return reply.status(403).send({ error: "无权删除此评论" });
    }

    // 删除评论（幂等：删除已删除的 = 无操作）
    await prisma.comment.delete({ where: { id: commentId } });

    return reply.send({ ok: true, id: commentId });
  });
};

export default communityRoutes;