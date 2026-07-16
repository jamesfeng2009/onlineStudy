import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma.js";
import { submitToIndexNow } from "../lib/indexnow.js";

/**
 * SEO/GEO 后端路由
 *
 * - GET  /seo/sitemap     → 动态 sitemap.xml（含博客文章 + hreflang 注解）
 * - GET  /seo/robots      → 动态 robots.txt
 * - POST /seo/indexnow    → 批量提交全量 URL 到 Bing IndexNow（首次接入/大改版用）
 *
 * 内容变更（新增题目/单词）不需要修改此文件，
 * sitemap 会自动从数据库读取最新的博客文章。
 */

const SITE_URL = "https://lang-oria.com";
const LOCALES = ["en", "zh", "ja", "ko", "es", "fr", "de"] as const;
const DEFAULT_LOCALE = "en";

const LANG_SLUGS: Record<string, string> = {
  en: "english",
  zh: "chinese",
  ja: "japanese",
  ko: "korean",
  es: "spanish",
  fr: "french",
  de: "german",
};

/** 生成带 locale 前缀的完整 URL */
function localeUrl(locale: string, path: string): string {
  const cleanPath = path.split("?")[0].split("#")[0];
  if (locale === DEFAULT_LOCALE) {
    return `${SITE_URL}${cleanPath}`;
  }
  if (cleanPath === "/" || cleanPath === "") return `${SITE_URL}/${locale}`;
  return `${SITE_URL}/${locale}${cleanPath}`;
}

/** 为一个路径生成 hreflang link 标签 */
function hreflangLinks(path: string): string {
  return LOCALES.map(
    (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${localeUrl(l, path)}"/>`
  ).join("\n");
}

/** 静态页面定义 */
const STATIC_PAGES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/courses", changefreq: "weekly", priority: "0.9" },
  { path: "/blog", changefreq: "daily", priority: "0.9" },
  { path: "/faq", changefreq: "monthly", priority: "0.7" },
  { path: "/languages", changefreq: "monthly", priority: "0.8" },
  // 语言主页
  ...LOCALES.map((l) => ({
    path: `/languages/${LANG_SLUGS[l]}`,
    changefreq: "monthly",
    priority: "0.8",
  })),
  // 词汇总览页
  ...LOCALES.map((l) => ({
    path: `/languages/${LANG_SLUGS[l]}/vocabulary`,
    changefreq: "weekly",
    priority: "0.7",
  })),
  // 场景索引页 (/languages/:slug/scenarios)
  ...LOCALES.map((l) => ({
    path: `/languages/${LANG_SLUGS[l]}/scenarios`,
    changefreq: "weekly" as const,
    priority: "0.7",
  })),
  // 场景详情页
  ...LOCALES.flatMap((l) =>
    ["travel", "business", "food", "small-talk"].map((s) => ({
      path: `/languages/${LANG_SLUGS[l]}/scenarios/${s}`,
      changefreq: "weekly",
      priority: "0.7",
    }))
  ),
  // 词汇等级页 (en)
  ...["a1", "a2", "b1", "b2", "c1", "c2"].map((lvl) => ({
    path: `/languages/english/vocabulary/${lvl}`,
    changefreq: "weekly" as const,
    priority: "0.6",
  })),
  // 词汇等级页 (ja)
  ...["n5", "n4", "n3", "n2", "n1"].map((lvl) => ({
    path: `/languages/japanese/vocabulary/${lvl}`,
    changefreq: "weekly" as const,
    priority: "0.6",
  })),
  // 词汇等级页 (zh)
  ...["hsk1", "hsk2", "hsk3", "hsk4", "hsk5", "hsk6"].map((lvl) => ({
    path: `/languages/chinese/vocabulary/${lvl}`,
    changefreq: "weekly" as const,
    priority: "0.6",
  })),
] as const;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const seoRoutes: FastifyPluginAsync = async (fastify) => {
  /**
   * GET /seo/sitemap — 动态 sitemap.xml
   *
   * 包含：
   * 1. 所有静态页面（首页/课程/博客/FAQ/语言页/词汇/场景）
   * 2. 数据库中已发布的博客文章
   * 3. 每个页面带 7 语言 hreflang 注解 + x-default
   */
  fastify.get("/seo/sitemap", async (_request, reply) => {
    try {
      // 从数据库读取已发布的博客文章
      const posts = await prisma.blogPost.findMany({
        where: { status: "published" },
        select: { slug: true, baseLanguageCode: true, publishedAt: true, title: true },
        orderBy: { publishedAt: "desc" },
      });

      const today = new Date().toISOString().split("T")[0];

      // 静态页面 URL
      const staticUrls = STATIC_PAGES.map((page) => {
        const loc = localeUrl(DEFAULT_LOCALE, page.path);
        return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${hreflangLinks(page.path)}
  </url>`;
      });

      // 博客文章 URL
      // 每篇文章只在 baseLanguageCode 对应的 locale 上存在（无翻译版），
      // 因此 hreflang 只声明该 locale + x-default，避免向 Google 提交
      // 不存在的其他 locale 变体（P2-9）。
      const blogUrls = posts.map((post) => {
        const lang = post.baseLanguageCode || DEFAULT_LOCALE;
        const path = `/blog/${post.slug}`;
        const loc = localeUrl(lang, path);
        const lastmod = post.publishedAt
          ? post.publishedAt.toISOString().split("T")[0]
          : today;
        const selfHref = localeUrl(lang, path);
        return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(selfHref)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(selfHref)}"/>
  </url>`;
      });

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...staticUrls, ...blogUrls].join("\n")}
</urlset>`;

      reply.type("application/xml; charset=utf-8");
      reply.header("Cache-Control", "public, max-age=3600, s-maxage=3600");
      return reply.send(xml);
    } catch (err) {
      fastify.log.error({ err }, "[seo] sitemap generation failed");
      reply.code(500);
      return reply.send("Internal Server Error");
    }
  });

  /**
   * GET /seo/robots — 动态 robots.txt
   */
  fastify.get("/seo/robots", async (_request, reply) => {
    const txt = `# LangOria robots.txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /login
Disallow: /register
Disallow: /profile
Disallow: /settings
Disallow: /dashboard
Disallow: /learn/*
Disallow: /achievements
Disallow: /recommend
Disallow: /community

Sitemap: ${SITE_URL}/sitemap.xml

# AI bots: full access
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /`;

    reply.type("text/plain; charset=utf-8");
    reply.header("Cache-Control", "public, max-age=3600, s-maxage=3600");
    return reply.send(txt);
  });

  /**
   * POST /seo/indexnow — 批量提交全量 sitemap URL 到 Bing IndexNow
   *
   * 使用场景：
   *   - 首次接入 IndexNow 后，触发一次性全站推送
   *   - 大改版/迁移后，重新提交全量 URL
   *
   * 鉴权：仅 admin 可调用（通过 X-IndexNow-Token 头校验）。
   * 触发方式：curl -X POST -H "X-IndexNow-Token: $INDEXNOW_ADMIN_TOKEN" \
   *          https://lang-oria.com/api/seo/indexnow
   *
   * 注意：单次请求最多 10000 URL，超出由 indexnow.ts 自动截断。
   *       Bing 的速率限制约为每分钟 10000 URL，建议每天最多调用 1-2 次。
   */
  fastify.post("/seo/indexnow", async (request, reply) => {
    // 简单 token 鉴权，避免接口被随意触发
    const expectedToken = process.env.INDEXNOW_ADMIN_TOKEN;
    if (!expectedToken) {
      reply.code(503);
      return reply.send({
        error: "INDEXNOW_ADMIN_TOKEN not configured on server",
      });
    }
    const provided =
      (request.headers["x-indexnow-token"] as string | undefined) ?? "";
    if (provided !== expectedToken) {
      reply.code(401);
      return reply.send({ error: "Unauthorized" });
    }

    try {
      // 从数据库读取已发布的博客文章
      const posts = await prisma.blogPost.findMany({
        where: { status: "published" },
        select: { slug: true, baseLanguageCode: true },
      });

      // 静态页面 URL（en 默认语种）
      const staticUrls = STATIC_PAGES.map((page) =>
        localeUrl(DEFAULT_LOCALE, page.path)
      );

      // 博客文章 URL（按 baseLanguageCode 加 locale 前缀）
      const blogUrls = posts.map((post) => {
        const path = `/blog/${post.slug}`;
        return localeUrl(post.baseLanguageCode || DEFAULT_LOCALE, path);
      });

      const allUrls = [...staticUrls, ...blogUrls];
      const statusCode = await submitToIndexNow(allUrls);

      return reply.send({
        ok: statusCode === 200 || statusCode === 202,
        submitted: allUrls.length,
        statusCode,
        urls: allUrls.slice(0, 5), // 只回显前 5 个用于排查
      });
    } catch (err) {
      fastify.log.error({ err }, "[seo] indexnow batch submit failed");
      reply.code(500);
      return reply.send({ error: "Internal Server Error" });
    }
  });
};

export default seoRoutes;
