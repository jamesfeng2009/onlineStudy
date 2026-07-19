import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma.js";
import { submitToIndexNow } from "../lib/indexnow.js";
import {
  UI_LANGUAGES,
  LEARN_LANGUAGES,
  LANG_CODE_TO_SLUG,
} from "../lib/i18n-registry.js";

/**
 * SEO/GEO 后端路由
 *
 * - GET  /seo/sitemap     → 动态 sitemap.xml（含博客文章 + hreflang 注解）
 * - GET  /seo/robots      → 动态 robots.txt
 * - POST /seo/indexnow    → 批量提交全量 URL 到 Bing IndexNow（首次接入/大改版用）
 *
 * 内容变更（新增题目/单词）不需要修改此文件，
 * sitemap 会自动从数据库读取最新的博客文章。
 *
 * 语言配置从 src/lib/i18n/registry.ts 派生（单一事实源）。
 */

const SITE_URL = "https://lang-oria.com";
const LOCALES = UI_LANGUAGES;
const DEFAULT_LOCALE = "en";

const LANG_SLUGS = LANG_CODE_TO_SLUG;

/**
 * Learn-only 语言 slug 列表（isUiLanguage=false，无 UI 翻译）。
 * 这些语言有 language hub + 词汇数据 + 场景内容，需要进 sitemap，
 * 但不进 hreflang（因为没有界面翻译，不存在 /ms/ /id/ /vi/ locale 变体）。
 * sitemap 中这些页面仅声明 self + x-default。
 */
const EXTRA_LEARN_SLUGS = LEARN_LANGUAGES.filter(
  (e) => !e.isUiLanguage
).map((e) => e.slug);

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
  // 词汇等级页 (en) — CEFR A1-C2
  ...["a1", "a2", "b1", "b2", "c1", "c2"].map((lvl) => ({
    path: `/languages/english/vocabulary/${lvl}`,
    changefreq: "weekly" as const,
    priority: "0.6",
  })),
  // 词汇等级页 (ja) — 数据实际只含 N5
  ...["n5"].map((lvl) => ({
    path: `/languages/japanese/vocabulary/${lvl}`,
    changefreq: "weekly" as const,
    priority: "0.6",
  })),
  // 词汇等级页 (zh) — 数据实际含 HSK1-HSK4
  ...["hsk1", "hsk2", "hsk3", "hsk4"].map((lvl) => ({
    path: `/languages/chinese/vocabulary/${lvl}`,
    changefreq: "weekly" as const,
    priority: "0.6",
  })),
  // 词汇等级页 (ko) — 数据实际含 TOPIK1-3
  ...["topik1", "topik2", "topik3"].map((lvl) => ({
    path: `/languages/korean/vocabulary/${lvl}`,
    changefreq: "weekly" as const,
    priority: "0.6",
  })),
  // 词汇等级页 (es) — 数据实际含 A1-B1
  ...["a1", "a2", "b1"].map((lvl) => ({
    path: `/languages/spanish/vocabulary/${lvl}`,
    changefreq: "weekly" as const,
    priority: "0.6",
  })),
  // 词汇等级页 (fr) — 数据实际含 A1-B1
  ...["a1", "a2", "b1"].map((lvl) => ({
    path: `/languages/french/vocabulary/${lvl}`,
    changefreq: "weekly" as const,
    priority: "0.6",
  })),
  // 词汇等级页 (de) — 数据实际含 A1-B1
  ...["a1", "a2", "b1"].map((lvl) => ({
    path: `/languages/german/vocabulary/${lvl}`,
    changefreq: "weekly" as const,
    priority: "0.6",
  })),
  // 词汇等级页 (it) — CEFR A1-C2
  ...["a1", "a2", "b1", "b2", "c1", "c2"].map((lvl) => ({
    path: `/languages/italian/vocabulary/${lvl}`,
    changefreq: "weekly" as const,
    priority: "0.6",
  })),
  // 词汇等级页 (th) — CEFR A1-C2
  ...["a1", "a2", "b1", "b2", "c1", "c2"].map((lvl) => ({
    path: `/languages/thai/vocabulary/${lvl}`,
    changefreq: "weekly" as const,
    priority: "0.6",
  })),
  // 词汇等级页 (yue) — CEFR A1-C2
  ...["a1", "a2", "b1", "b2", "c1", "c2"].map((lvl) => ({
    path: `/languages/cantonese/vocabulary/${lvl}`,
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
      // 博客文章最新发布日期，作为全站内容变更的 lastmod 信号
      const latestPostDate = posts.length > 0 && posts[0].publishedAt
        ? posts[0].publishedAt.toISOString().split("T")[0]
        : today;
      // 静态页面用构建日期，动态聚合页（语言/词汇/场景）用最新内容日期
      const contentLastmod = latestPostDate > today ? today : latestPostDate;

      // 静态页面 URL
      const staticUrls = STATIC_PAGES.map((page) => {
        const loc = localeUrl(DEFAULT_LOCALE, page.path);
        return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${contentLastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${hreflangLinks(page.path)}
  </url>`;
      });

      // Learn-only 语言页面（ms/id/vi，无 UI 翻译 → 不进 hreflang，仅 self + x-default）
      // 包含：language hub、词汇总览、词汇等级页、场景索引、场景详情
      const extraLearnUrls = EXTRA_LEARN_SLUGS.flatMap((slug) => {
        const pages: Array<{ path: string; changefreq: string; priority: string }> = [
          { path: `/languages/${slug}`, changefreq: "monthly", priority: "0.8" },
          { path: `/languages/${slug}/vocabulary`, changefreq: "weekly", priority: "0.7" },
          { path: `/languages/${slug}/scenarios`, changefreq: "weekly", priority: "0.7" },
          ...["travel", "business", "food", "small-talk"].map((s) => ({
            path: `/languages/${slug}/scenarios/${s}`,
            changefreq: "weekly",
            priority: "0.7",
          })),
          ...["a1", "a2", "b1", "b2", "c1", "c2"].map((lvl) => ({
            path: `/languages/${slug}/vocabulary/${lvl}`,
            changefreq: "weekly",
            priority: "0.6",
          })),
        ];
        return pages.map((page) => {
          const loc = localeUrl(DEFAULT_LOCALE, page.path);
          return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${contentLastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(loc)}"/>
  </url>`;
        });
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
${[...staticUrls, ...extraLearnUrls, ...blogUrls].join("\n")}
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
    // 通用禁止项（特定 bot 组不继承 `*` 组规则，需完整重复）
    const commonDisallow = `Disallow: /admin
Disallow: /api/
Disallow: /login
Disallow: /register
Disallow: /profile
Disallow: /settings
Disallow: /dashboard
Disallow: /learn/*
Disallow: /achievements
Disallow: /recommend
Disallow: /community`;

    const txt = `# LangOria robots.txt
User-agent: *
Allow: /
${commonDisallow}

Sitemap: ${SITE_URL}/sitemap.xml

# AI bots 分两类对待（P1-2 反爬）：
#   1. 纯训练爬虫（GPTBot / ClaudeBot）：不带来流量，只白嫖内容训练竞品模型
#      → 额外禁止抓取词汇库页面（/languages/），保护核心内容资产
#   2. AI 搜索爬虫（PerplexityBot / Google-Extended）：带来 AI 引用流量（GEO）
#      → 保持全站允许，与 prerender 的 AI-友好策略一致
User-agent: GPTBot
Allow: /
${commonDisallow}
Disallow: /languages/

User-agent: ClaudeBot
Allow: /
${commonDisallow}
Disallow: /languages/

User-agent: PerplexityBot
Allow: /
${commonDisallow}

User-agent: Google-Extended
Allow: /
${commonDisallow}`;

    reply.type("text/plain; charset=utf-8");
    reply.header("Cache-Control", "public, max-age=3600, s-maxage=3600");
    return reply.send(txt);
  });

  /**
   * GET /seo/rss — RSS 2.0 feed of published blog posts
   *
   * 每篇文章只在其 baseLanguageCode 对应的 locale URL 上存在（与
   * sitemap 的博客 hreflang 策略一致），guid 使用该规范 URL。
   */
  fastify.get("/seo/rss", async (_request, reply) => {
    try {
      const posts = await prisma.blogPost.findMany({
        where: { status: "published" },
        select: {
          slug: true,
          title: true,
          excerpt: true,
          baseLanguageCode: true,
          publishedAt: true,
        },
        orderBy: { publishedAt: "desc" },
        take: 50,
      });

      const items = posts
        .map((post) => {
          const url = localeUrl(post.baseLanguageCode || DEFAULT_LOCALE, `/blog/${post.slug}`);
          const pubDate = post.publishedAt
            ? post.publishedAt.toUTCString()
            : new Date().toUTCString();
          return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
        })
        .join("\n");

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>LangOria Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Language learning articles: methods, vocabulary, and speaking practice.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

      reply.type("application/rss+xml; charset=utf-8");
      reply.header("Cache-Control", "public, max-age=3600, s-maxage=3600");
      return reply.send(xml);
    } catch (err) {
      fastify.log.error({ err }, "[seo] rss generation failed");
      reply.code(500);
      return reply.send("Internal Server Error");
    }
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

      // Learn-only 语言 URL（ms/id/vi）
      const extraLearnUrls = EXTRA_LEARN_SLUGS.flatMap((slug) => [
        `/languages/${slug}`,
        `/languages/${slug}/vocabulary`,
        `/languages/${slug}/scenarios`,
        ...["travel", "business", "food", "small-talk"].map(
          (s) => `/languages/${slug}/scenarios/${s}`
        ),
        ...["a1", "a2", "b1", "b2", "c1", "c2"].map(
          (lvl) => `/languages/${slug}/vocabulary/${lvl}`
        ),
      ]).map((path) => localeUrl(DEFAULT_LOCALE, path));

      // 博客文章 URL（按 baseLanguageCode 加 locale 前缀）
      const blogUrls = posts.map((post) => {
        const path = `/blog/${post.slug}`;
        return localeUrl(post.baseLanguageCode || DEFAULT_LOCALE, path);
      });

      const allUrls = [...staticUrls, ...extraLearnUrls, ...blogUrls];
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
