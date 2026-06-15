import type { FastifyPluginAsync, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma.js";
import { sendSuccess, sendError } from "../lib/response.js";
import { adminOnly } from "../lib/admin.js";

function badRequest(reply: FastifyReply, message: string) {
  return sendError(reply, "BAD_REQUEST", message);
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function serializePost(p: {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: unknown;
  tag: string;
  readTime: string;
  coverEmoji: string | null;
  baseLanguageCode: string;
  status: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content as string[],
    tag: p.tag,
    readTime: p.readTime,
    coverEmoji: p.coverEmoji,
    baseLanguageCode: p.baseLanguageCode,
    status: p.status,
    publishedAt: p.publishedAt?.toISOString() ?? null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

// ====== Public routes (no auth) ======
const publicRoutes: FastifyPluginAsync = async (fastify) => {
  // List published posts, optional ?language=xx
  fastify.get<{ Querystring: { language?: string; limit?: string } }>("/blog/posts", async (request, reply) => {
    const { language } = request.query;
    const limit = Math.min(50, Math.max(1, Number(request.query.limit ?? 20)));
    const where: Record<string, unknown> = { status: "published" };
    if (language) where.baseLanguageCode = language;
    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: limit,
    });
    return sendSuccess(reply, posts.map(serializePost));
  });

  // Get a single post by slug
  fastify.get<{ Params: { slug: string } }>("/blog/posts/:slug", async (request, reply) => {
    const post = await prisma.blogPost.findUnique({ where: { slug: request.params.slug } });
    if (!post || post.status !== "published") {
      return sendError(reply, "NOT_FOUND", "Article not found");
    }
    return sendSuccess(reply, serializePost(post));
  });
};

// ====== Admin routes (auth required) ======
const adminRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", adminOnly);

  fastify.get<{ Querystring: { language?: string; status?: string; q?: string } }>(
    "/admin/blog/posts",
    async (request, reply) => {
      const { language, status, q } = request.query;
      const where: Record<string, unknown> = {};
      if (language) where.baseLanguageCode = language;
      if (status) where.status = status;
      if (q) {
        where.OR = [
          { title: { contains: q, mode: "insensitive" } },
          { excerpt: { contains: q, mode: "insensitive" } },
        ];
      }
      const posts = await prisma.blogPost.findMany({
        where,
        orderBy: [{ updatedAt: "desc" }],
      });
      return sendSuccess(reply, posts.map(serializePost));
    }
  );

  fastify.get<{ Params: { id: string } }>("/admin/blog/posts/:id", async (request, reply) => {
    const post = await prisma.blogPost.findUnique({ where: { id: request.params.id } });
    if (!post) return sendError(reply, "NOT_FOUND", "Post not found");
    return sendSuccess(reply, serializePost(post));
  });

  fastify.post<{ Body: Record<string, unknown> }>("/admin/blog/posts", async (request, reply) => {
    const { title, excerpt, content, tag, readTime, coverEmoji, baseLanguageCode, status, slug } = request.body;
    if (!title || !excerpt || !content || !tag) {
      return badRequest(reply, "缺少必填字段: title, excerpt, content, tag");
    }
    if (!Array.isArray(content)) return badRequest(reply, "content 必须是字符串数组");

    let finalSlug = typeof slug === "string" && slug.trim() ? slugify(slug) : slugify(String(title));
    if (!finalSlug) return badRequest(reply, "无法生成 slug，请手动填写");
    // Ensure uniqueness
    let candidate = finalSlug;
    let n = 1;
    while (true) {
      const exists = await prisma.blogPost.findUnique({ where: { slug: candidate } });
      if (!exists) break;
      candidate = `${finalSlug}-${n++}`;
    }
    finalSlug = candidate;

    const now = new Date();
    const post = await prisma.blogPost.create({
      data: {
        slug: finalSlug,
        title: String(title),
        excerpt: String(excerpt),
        content: content as string[],
        tag: String(tag),
        readTime: typeof readTime === "string" ? readTime : "5 min read",
        coverEmoji: typeof coverEmoji === "string" ? coverEmoji : null,
        baseLanguageCode: typeof baseLanguageCode === "string" ? baseLanguageCode : "en",
        status: status === "published" ? "published" : "draft",
        publishedAt: status === "published" ? now : null,
      },
    });
    return sendSuccess(reply, serializePost(post));
  });

  fastify.put<{ Params: { id: string }; Body: Record<string, unknown> }>(
    "/admin/blog/posts/:id",
    async (request, reply) => {
      const existing = await prisma.blogPost.findUnique({ where: { id: request.params.id } });
      if (!existing) return sendError(reply, "NOT_FOUND", "Post not found");

      const { title, excerpt, content, tag, readTime, coverEmoji, baseLanguageCode, status, slug } = request.body;
      const update: Record<string, unknown> = {};
      if (typeof title === "string") update.title = title;
      if (typeof excerpt === "string") update.excerpt = excerpt;
      if (Array.isArray(content)) update.content = content;
      if (typeof tag === "string") update.tag = tag;
      if (typeof readTime === "string") update.readTime = readTime;
      if (typeof coverEmoji === "string" || coverEmoji === null) update.coverEmoji = coverEmoji;
      if (typeof baseLanguageCode === "string") update.baseLanguageCode = baseLanguageCode;
      if (status === "published" || status === "draft") {
        update.status = status;
        if (status === "published" && !existing.publishedAt) {
          update.publishedAt = new Date();
        }
      }
      if (typeof slug === "string" && slug.trim() && slugify(slug) !== existing.slug) {
        const newSlug = slugify(slug);
        const dup = await prisma.blogPost.findFirst({ where: { slug: newSlug, NOT: { id: existing.id } } });
        if (dup) return badRequest(reply, "slug 已被占用");
        update.slug = newSlug;
      }

      if (Object.keys(update).length === 0) return badRequest(reply, "缺少可更新字段");
      const post = await prisma.blogPost.update({ where: { id: request.params.id }, data: update });
      return sendSuccess(reply, serializePost(post));
    }
  );

  fastify.delete<{ Params: { id: string } }>("/admin/blog/posts/:id", async (request, reply) => {
    await prisma.blogPost.delete({ where: { id: request.params.id } });
    return sendSuccess(reply, { id: request.params.id });
  });
};

const blogRoutes: FastifyPluginAsync = async (fastify) => {
  await fastify.register(publicRoutes);
  await fastify.register(adminRoutes);
};

export default blogRoutes;
