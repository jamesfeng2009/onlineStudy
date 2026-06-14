import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma";

const communityRoutes: FastifyPluginAsync = async (fastify) => {
  const authenticate = async (request: any, reply: any) => {
    await request.jwtVerify();
  };

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

    let currentUserId: string | null = null;
    try {
      await request.jwtVerify();
      const u = request.user as { userId: string } | undefined;
      if (u?.userId) currentUserId = u.userId;
    } catch {
      // no auth: treat as anonymous
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

  fastify.post<{
    Body: { topic: string; content: string };
  }>("/posts", { onRequest: [authenticate] }, async (request, reply) => {
    const { userId } = request.user as { userId: string };
    const { topic, content } = request.body;
    if (!topic || !content) {
      return reply.status(400).send({ error: "topic 和 content 不能为空" });
    }

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

  fastify.post<{
    Params: { id: string };
  }>("/posts/:id/like", { onRequest: [authenticate] }, async (request, reply) => {
    const { userId } = request.user as { userId: string };
    const { id } = request.params;

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return reply.status(404).send({ error: "Post 不存在" });

    const existingLike = await prisma.likePost.findUnique({
      where: {
        postId_userId: { postId: id, userId },
      },
    });

    let likedByMe: boolean;
    if (existingLike) {
      await prisma.likePost.delete({ where: { id: existingLike.id } });
      likedByMe = false;
    } else {
      await prisma.likePost.create({ data: { postId: id, userId } });
      likedByMe = true;
    }

    const likeCount = await prisma.likePost.count({ where: { postId: id } });

    return reply.send({ id, likeCount, likedByMe });
  });

  fastify.post<{
    Params: { id: string };
    Body: { content: string };
  }>("/posts/:id/comment", { onRequest: [authenticate] }, async (request, reply) => {
    const { userId } = request.user as { userId: string };
    const { id } = request.params;
    const { content } = request.body;

    if (!content) return reply.status(400).send({ error: "content 不能为空" });

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return reply.status(404).send({ error: "Post 不存在" });

    const comment = await prisma.comment.create({
      data: { postId: id, userId, content },
      include: { user: { select: { id: true, username: true, avatar: true } } },
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
};

export default communityRoutes;
