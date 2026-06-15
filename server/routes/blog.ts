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

type PostWithExtras = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tag: string;
  readTime: string;
  coverEmoji: string | null;
  coverImageUrl: string | null;
  tldr: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  baseLanguageCode: string;
  status: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: { views: number };
};

function serializePost(p: PostWithExtras) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    tag: p.tag,
    readTime: p.readTime,
    coverEmoji: p.coverEmoji,
    coverImageUrl: p.coverImageUrl,
    tldr: p.tldr,
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    baseLanguageCode: p.baseLanguageCode,
    status: p.status,
    publishedAt: p.publishedAt?.toISOString() ?? null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    viewCount: p._count?.views ?? 0,
  };
}

async function createRevision(
  postId: string,
  editorId: string | null,
  data: {
    title: string;
    excerpt: string;
    content: string;
    tag: string;
    readTime: string;
    coverImageUrl: string | null;
    tldr: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
    baseLanguageCode: string;
    status: string;
  }
) {
  const last = await prisma.blogPostRevision.findFirst({
    where: { postId },
    orderBy: { revisionNo: "desc" },
  });
  await prisma.blogPostRevision.create({
    data: {
      postId,
      revisionNo: (last?.revisionNo ?? 0) + 1,
      editorId: editorId ?? null,
      ...data,
    },
  });
}

// ====== Public routes (no auth) ======
const publicRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Querystring: { language?: string; limit?: string; tag?: string } }>(
    "/blog/posts",
    async (request, reply) => {
      const { language, tag } = request.query;
      const limit = Math.min(50, Math.max(1, Number(request.query.limit ?? 20)));
      const where: Record<string, unknown> = { status: "published" };
      if (language) where.baseLanguageCode = language;
      if (tag) where.tag = tag;
      const posts = await prisma.blogPost.findMany({
        where,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        take: limit,
        include: { _count: { select: { views: true } } },
      });
      return sendSuccess(reply, posts.map((p) => serializePost(p as unknown as PostWithExtras)));
    }
  );

  fastify.get<{ Params: { slug: string } }>("/blog/posts/:slug", async (request, reply) => {
    const { slug } = request.params;
    // slug 在 (baseLanguageCode, slug) 复合键下不再唯一；
    // 公开访问按 publishedAt desc 取最新一条。
    const post = await prisma.blogPost.findFirst({
      where: { slug, status: "published" },
      orderBy: { publishedAt: "desc" },
      include: { _count: { select: { views: true } } },
    });
    if (!post) {
      return sendError(reply, "NOT_FOUND", "Article not found");
    }
    // 记录阅读量（异步、不阻塞响应）
    const userId =
      typeof (request as unknown as { user?: { id?: string } }).user?.id === "string"
        ? (request as unknown as { user: { id: string } }).user.id
        : null;
    prisma.blogPostView
      .create({ data: { postId: post.id, userId } })
      .catch(() => {
        // ignore
      });
    return sendSuccess(reply, serializePost(post as unknown as PostWithExtras));
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
          { seoTitle: { contains: q, mode: "insensitive" } },
        ];
      }
      const posts = await prisma.blogPost.findMany({
        where,
        orderBy: [{ updatedAt: "desc" }],
        include: { _count: { select: { views: true } } },
      });
      return sendSuccess(reply, posts.map((p) => serializePost(p as unknown as PostWithExtras)));
    }
  );

  fastify.get<{ Params: { id: string } }>("/admin/blog/posts/:id", async (request, reply) => {
    const post = await prisma.blogPost.findUnique({
      where: { id: request.params.id },
      include: { _count: { select: { views: true } } },
    });
    if (!post) return sendError(reply, "NOT_FOUND", "Post not found");
    return sendSuccess(reply, serializePost(post as unknown as PostWithExtras));
  });

  // 列出修订历史
  fastify.get<{ Params: { id: string } }>("/admin/blog/posts/:id/revisions", async (request, reply) => {
    const revisions = await prisma.blogPostRevision.findMany({
      where: { postId: request.params.id },
      orderBy: { revisionNo: "desc" },
    });
    return sendSuccess(reply, revisions);
  });

  fastify.post<{ Body: Record<string, unknown> }>("/admin/blog/posts", async (request, reply) => {
    const {
      title,
      excerpt,
      content,
      tag,
      readTime,
      coverEmoji,
      coverImageUrl,
      tldr,
      seoTitle,
      seoDescription,
      baseLanguageCode,
      status,
      slug,
    } = request.body;
    if (!title || !excerpt || !content || !tag) {
      return badRequest(reply, "缺少必填字段: title, excerpt, content, tag");
    }
    if (typeof content !== "string") return badRequest(reply, "content 必须是字符串 (markdown)");

    const lang = typeof baseLanguageCode === "string" ? baseLanguageCode : "en";
    let finalSlug = typeof slug === "string" && slug.trim() ? slugify(slug) : slugify(String(title));
    if (!finalSlug) return badRequest(reply, "无法生成 slug，请手动填写");
    let candidate = finalSlug;
    let n = 1;
    while (true) {
      const exists = await prisma.blogPost.findUnique({
        where: { baseLanguageCode_slug: { baseLanguageCode: lang, slug: candidate } },
      });
      if (!exists) break;
      candidate = `${finalSlug}-${n++}`;
    }
    finalSlug = candidate;

    const postStatus = status === "published" ? "published" : "draft";
    const now = new Date();
    const editorId =
      typeof (request as unknown as { user?: { id?: string } }).user?.id === "string"
        ? (request as unknown as { user: { id: string } }).user.id
        : null;

    const post = await prisma.blogPost.create({
      data: {
        slug: finalSlug,
        title: String(title),
        excerpt: String(excerpt),
        content: String(content),
        tag: String(tag),
        readTime: typeof readTime === "string" ? readTime : "5 min read",
        coverEmoji: typeof coverEmoji === "string" ? coverEmoji : null,
        coverImageUrl: typeof coverImageUrl === "string" ? coverImageUrl : null,
        tldr: typeof tldr === "string" ? tldr : null,
        seoTitle: typeof seoTitle === "string" ? seoTitle : null,
        seoDescription: typeof seoDescription === "string" ? seoDescription : null,
        baseLanguageCode: lang,
        status: postStatus,
        publishedAt: postStatus === "published" ? now : null,
      },
    });
    // 创建首版修订
    await createRevision(post.id, editorId, {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      tag: post.tag,
      readTime: post.readTime,
      coverImageUrl: post.coverImageUrl,
      tldr: post.tldr,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      baseLanguageCode: post.baseLanguageCode,
      status: post.status,
    });
    return sendSuccess(reply, serializePost(post as unknown as PostWithExtras));
  });

  fastify.put<{ Params: { id: string }; Body: Record<string, unknown> }>(
    "/admin/blog/posts/:id",
    async (request, reply) => {
      const existing = await prisma.blogPost.findUnique({ where: { id: request.params.id } });
      if (!existing) return sendError(reply, "NOT_FOUND", "Post not found");

      const {
        title,
        excerpt,
        content,
        tag,
        readTime,
        coverEmoji,
        coverImageUrl,
        tldr,
        seoTitle,
        seoDescription,
        baseLanguageCode,
        status,
        slug,
      } = request.body;
      const update: Record<string, unknown> = {};
      if (typeof title === "string") update.title = title;
      if (typeof excerpt === "string") update.excerpt = excerpt;
      if (typeof content === "string") update.content = content;
      if (typeof tag === "string") update.tag = tag;
      if (typeof readTime === "string") update.readTime = readTime;
      if (typeof coverEmoji === "string" || coverEmoji === null) update.coverEmoji = coverEmoji;
      if (typeof coverImageUrl === "string" || coverImageUrl === null) update.coverImageUrl = coverImageUrl;
      if (typeof tldr === "string" || tldr === null) update.tldr = tldr;
      if (typeof seoTitle === "string" || seoTitle === null) update.seoTitle = seoTitle;
      if (typeof seoDescription === "string" || seoDescription === null) update.seoDescription = seoDescription;
      if (typeof baseLanguageCode === "string") update.baseLanguageCode = baseLanguageCode;
      if (status === "published" || status === "draft") {
        update.status = status;
        if (status === "published" && !existing.publishedAt) {
          update.publishedAt = new Date();
        }
      }
      if (typeof slug === "string" && slug.trim() && slugify(slug) !== existing.slug) {
        const newSlug = slugify(slug);
        const lang =
          typeof baseLanguageCode === "string" ? baseLanguageCode : existing.baseLanguageCode;
        const dup = await prisma.blogPost.findUnique({
          where: { baseLanguageCode_slug: { baseLanguageCode: lang, slug: newSlug } },
        });
        if (dup) return badRequest(reply, "slug 已被占用");
        update.slug = newSlug;
      }

      if (Object.keys(update).length === 0) return badRequest(reply, "缺少可更新字段");
      const post = await prisma.blogPost.update({ where: { id: request.params.id }, data: update });
      // 创建新修订
      const editorId =
        typeof (request as unknown as { user?: { id?: string } }).user?.id === "string"
          ? (request as unknown as { user: { id: string } }).user.id
          : null;
      await createRevision(post.id, editorId, {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        tag: post.tag,
        readTime: post.readTime,
        coverImageUrl: post.coverImageUrl,
        tldr: post.tldr,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        baseLanguageCode: post.baseLanguageCode,
        status: post.status,
      });
      return sendSuccess(reply, serializePost(post as unknown as PostWithExtras));
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
