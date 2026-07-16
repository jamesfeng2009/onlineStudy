import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma.js";
import { toggleLikeIdempotent, createCommentIdempotent } from "../lib/idempotency.js";
import { sendSuccess, sendError } from "../lib/response.js";
import { createRouteLogger } from "../lib/logger.js";

const log = createRouteLogger("community");

const communityRoutes: FastifyPluginAsync = async (fastify) => {

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
      currentUserId = request.user.userId;
    } catch {
      // 未认证，视为匿名用户
    }

    return sendSuccess(
      reply,
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
  }>("/posts", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { userId } = request.user;
    const { topic, content } = request.body;

    if (!topic || !content) {
      return sendError(reply, "BAD_REQUEST", "topic 和 content 不能为空");
    }

    const post = await prisma.post.create({
      data: { authorId: userId, topic, content },
      include: { author: { select: { id: true, username: true, avatar: true } } },
    });

    log.info(request, "post created", { postId: post.id, topic });

    return sendSuccess(reply, {
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
  fastify.post<{
    Params: { id: string };
  }>("/posts/:id/like", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { userId } = request.user;
    const { id: postId } = request.params;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return sendError(reply, "NOT_FOUND", "Post 不存在");

    const result = await prisma.$transaction(async (tx) => {
      return toggleLikeIdempotent(tx, postId, userId);
    });

    log.info(request, "post like toggled", { postId, liked: result.liked });

    return sendSuccess(reply, { id: postId, likeCount: result.likeCount, likedByMe: result.liked });
  });

  // ====== 添加评论（幂等 + 事务） ======
  fastify.post<{
    Params: { id: string };
    Body: { content: string };
  }>("/posts/:id/comment", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { userId } = request.user;
    const { id: postId } = request.params;
    const { content } = request.body;

    if (!content || content.trim().length === 0) {
      return sendError(reply, "BAD_REQUEST", "content 不能为空");
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return sendError(reply, "NOT_FOUND", "Post 不存在");

    const comment = await prisma.$transaction(async (tx) => {
      return createCommentIdempotent(tx, postId, userId, content.trim());
    });

    log.info(request, "comment added", { postId, commentId: comment.id });

    return sendSuccess(reply, {
      id: comment.id,
      authorId: comment.user.id,
      authorName: comment.user.username,
      avatar: comment.user.avatar,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
    });
  });

  // ====== 删除帖子（幂等 + 事务） ======
  fastify.delete<{
    Params: { id: string };
  }>("/posts/:id", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { userId } = request.user;
    const { id: postId } = request.params;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return sendError(reply, "NOT_FOUND", "Post 不存在");
    if (post.authorId !== userId) {
      return sendError(reply, "FORBIDDEN", "无权删除此帖子");
    }

    await prisma.$transaction(async (tx) => {
      await tx.likePost.deleteMany({ where: { postId } });
      await tx.comment.deleteMany({ where: { postId } });
      await tx.post.delete({ where: { id: postId } });
    });

    return sendSuccess(reply, { ok: true, id: postId });
  });

  // ====== 删除评论（幂等） ======
  fastify.delete<{
    Params: { postId: string; commentId: string };
  }>("/posts/:postId/comments/:commentId", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { userId } = request.user;
    const { postId, commentId } = request.params;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { post: { select: { id: true } } },
    });

    if (!comment) return sendError(reply, "NOT_FOUND", "Comment 不存在");
    if (comment.postId !== postId) {
      return sendError(reply, "BAD_REQUEST", "评论不属于该帖子");
    }
    if (comment.userId !== userId) {
      return sendError(reply, "FORBIDDEN", "无权删除此评论");
    }

    await prisma.comment.delete({ where: { id: commentId } });

    return sendSuccess(reply, { ok: true, id: commentId });
  });
};

export default communityRoutes;
