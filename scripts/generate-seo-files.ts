/**
 * Build-time SEO file generator.
 *
 *   pnpm tsx scripts/generate-seo-files.ts
 *
 * Generates three static files into ./public so that Vite copies them to
 * ./dist on build:
 *
 *   - public/sitemap.xml   – lists all static pages + every published blog post
 *   - public/robots.txt    – crawl rules + sitemap location
 *   - public/llms.txt      – GEO: plain-text site summary for LLM crawlers
 *
 * Why build-time, not a Vercel Function?
 *   - Zero runtime overhead, served straight from Vercel's edge CDN.
 *   - No changes needed to vercel.json.
 *   - Database access during build is fine; Vercel exposes DATABASE_URL.
 *
 * Safe to run without a database: it falls back to a sitemap with only
 * static pages, and prints a warning. That keeps `pnpm build` working
 * even when the build container can't reach Supabase.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");

const SITE_URL = "https://lang-oria.com";
const SUPPORTED_LANGUAGES = ["en", "zh", "ja", "ko", "es", "fr", "de"] as const;

// ---------- minimal .env loader (avoid dotenv dep) ----------
function loadDotenv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!m) continue;
    const [, key, valueRaw] = m;
    if (key === undefined || valueRaw === undefined) continue;
    if (process.env[key] !== undefined) continue; // already set (e.g. Vercel)
    let value = valueRaw.trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadDotenv();

// ---------- static pages ----------
// Note: /learn/* is intentionally not in this list — every /learn page
// is a noindex course player. /languages/* and /blog/* slug pages are
// added below from filesystem data.
const STATIC_PAGES = [
  { path: "/", changefreq: "weekly", priority: 1.0 },
  { path: "/courses", changefreq: "weekly", priority: 0.9 },
  { path: "/blog", changefreq: "daily", priority: 0.9 },
  { path: "/faq", changefreq: "monthly", priority: 0.7 },
  { path: "/languages", changefreq: "monthly", priority: 0.8 },
  { path: "/languages/japanese", changefreq: "monthly", priority: 0.8 },
  { path: "/languages/english", changefreq: "monthly", priority: 0.8 },
  { path: "/languages/chinese", changefreq: "monthly", priority: 0.8 },
  // Vocabulary aggregation index pages (P1-4) — one per supported language.
  // These are programmatic-but-data-driven: each renders a real
  // ItemList of levels (CEFR / JLPT / HSK tiers) with actual word counts
  // and a sample of vocabulary, so they are not doorway-page duplicates.
  { path: "/languages/english/vocabulary", changefreq: "weekly", priority: 0.7 },
  { path: "/languages/japanese/vocabulary", changefreq: "weekly", priority: 0.7 },
  { path: "/languages/chinese/vocabulary", changefreq: "weekly", priority: 0.7 },
  { path: "/languages/korean/vocabulary", changefreq: "weekly", priority: 0.7 },
  { path: "/languages/spanish/vocabulary", changefreq: "weekly", priority: 0.7 },
  { path: "/languages/french/vocabulary", changefreq: "weekly", priority: 0.7 },
  { path: "/languages/german/vocabulary", changefreq: "weekly", priority: 0.7 },
  // Vocabulary level detail pages — one per (language, level) pair.
  // 3 word-level languages: en (6 CEFR levels) + ja (1 JLPT level) +
  // zh (4 HSK levels) = 11 indexable URLs. Each is hand-tuned copy
  // (A1/A2/B1/B2/C1/C2/N5/HSK1-4) so the level pages are editorially
  // unique, not templated doorway duplicates.
  ...(["english", "japanese", "chinese"] as const).flatMap((slug) => {
    const LEVELS_BY_LANG: Record<string, readonly string[]> = {
      english: ["a1", "a2", "b1", "b2", "c1", "c2"],
      japanese: ["n5"],
      chinese: ["hsk1", "hsk2", "hsk3", "hsk4"],
    };
    return LEVELS_BY_LANG[slug].map((lvl) => ({
      path: `/languages/${slug}/vocabulary/${lvl}`,
      changefreq: "weekly" as const,
      priority: 0.6,
    }));
  }),
  // Scenario pages (P1-3) — 3 word-level languages × 4 scenarios + 3
  // scenario index pages = 15 indexable URLs. Each /scenarios/:slug
  // page is hand-written for that (lang, scenario) pair, so the
  // content is editorially unique per URL — not a templated doorway.
  ...(["english", "japanese", "chinese"] as const).flatMap((slug) => {
    const index = {
      path: `/languages/${slug}/scenarios`,
      changefreq: "weekly" as const,
      priority: 0.7,
    };
    const details = (["travel", "business", "food", "small-talk"] as const).map((s) => ({
      path: `/languages/${slug}/scenarios/${s}`,
      changefreq: "weekly" as const,
      priority: 0.7,
    }));
    return [index, ...details];
  }),
  { path: "/register", changefreq: "monthly", priority: 0.5 },
  { path: "/login", changefreq: "monthly", priority: 0.4 },
] as const;

// ---------- sitemap ----------
function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(loc: string, lastmod?: string, changefreq = "weekly", priority = 0.7) {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>${
      lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""
    }
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
}

function buildSitemap(blogPosts: BlogPostRow[]) {
  const today = new Date().toISOString().slice(0, 10);
  const lines: string[] = [];
  for (const p of STATIC_PAGES) {
    lines.push(urlEntry(`${SITE_URL}${p.path}`, today, p.changefreq, p.priority));
  }
  for (const post of blogPosts) {
    const lastmod = (post.updatedAt ?? post.publishedAt ?? new Date()).toString().slice(0, 10);
    lines.push(
      urlEntry(
        `${SITE_URL}/blog/${post.slug}`,
        lastmod,
        "monthly",
        0.8
      )
    );
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${lines.join("\n")}
</urlset>
`;
}

// ---------- robots.txt ----------
function buildRobots() {
  return `# LangOria robots.txt
# Generated at build time by scripts/generate-seo-files.ts

User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /profile
Disallow: /settings
Disallow: /dashboard
Disallow: /learn/*   # course player — no SEO value, huge index bloat
Disallow: /achievements
Disallow: /recommend
Disallow: /community

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml

# Common AI / search bots: full access
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /
`;
}

// ---------- llms.txt (GEO) ----------
function buildLlmsTxt(blogPosts: BlogPostRow[]) {
  const published = blogPosts
    .filter((p) => p.status === "published")
    .sort((a, b) => (b.publishedAt?.getTime?.() ?? 0) - (a.publishedAt?.getTime?.() ?? 0));

  const lines: string[] = [];
  lines.push("# LangOria");
  lines.push("");
  lines.push("> LangOria is a multilingual learning platform with bite-sized lessons,");
  lines.push("> spaced-repetition vocabulary, listening practice, and speaking drills across");
  lines.push("> English, Japanese, Korean, Chinese, Spanish, French and German.");
  lines.push("");
  lines.push("Site: " + SITE_URL);
  lines.push("Languages: " + SUPPORTED_LANGUAGES.join(", "));
  lines.push("Audience: self-directed adult language learners, especially beginners to A2.");
  lines.push("");
  lines.push("## Main pages");
  const bare = (p: string) => `${SITE_URL}${p}`;
  lines.push(`- [LangOria — language learning platform](${bare("/")}): homepage with hero, how-it-works, language list, featured courses, FAQ teaser, blog teaser.`);
  lines.push(`- [Courses catalog](${bare("/courses")}): structured language courses from A1 to C1.`);
  lines.push(`- [Blog](${bare("/blog")}): language learning articles.`);
  lines.push(`- [FAQ](${bare("/faq")}): common questions about how LangOria works.`);
  lines.push(`- [Learn Japanese online](${bare("/languages/japanese")}): hand-written guide to learning Japanese with JLPT-level spaced repetition.`);
  lines.push(`- [Learn English online](${bare("/languages/english")}): hand-written guide to learning English across CEFR A1-C2.`);
  lines.push(`- [Learn Chinese online](${bare("/languages/chinese")}): hand-written guide to learning Mandarin with HSK-level spaced repetition.`);
  lines.push("");
  lines.push("## Vocabulary indexes");
  lines.push("One per supported language. Each page lists every level (CEFR / JLPT / HSK tier) with the actual word count, a sample of the vocabulary, and a link to the level detail page.");
  for (const slug of ["english", "japanese", "chinese", "korean", "spanish", "french", "german"]) {
    const name = slug.charAt(0).toUpperCase() + slug.slice(1);
    lines.push(`- [${name} vocabulary by level](${bare(`/languages/${slug}/vocabulary`)}): data-driven list of every ${name} vocabulary level in the library, with example sentences.`);
  }
  lines.push("");
  lines.push("## Vocabulary level details");
  lines.push("Hand-written detail page for each (language, level) pair. 11 pages total: 6 English CEFR levels (A1-C2), 1 Japanese JLPT level (N5), and 4 Chinese HSK levels (HSK 1-4).");
  const LEVEL_DETAIL: Array<{ slug: string; name: string; levelSlug: string; label: string }> = [
    { slug: "english", name: "English", levelSlug: "a1", label: "A1" },
    { slug: "english", name: "English", levelSlug: "a2", label: "A2" },
    { slug: "english", name: "English", levelSlug: "b1", label: "B1" },
    { slug: "english", name: "English", levelSlug: "b2", label: "B2" },
    { slug: "english", name: "English", levelSlug: "c1", label: "C1" },
    { slug: "english", name: "English", levelSlug: "c2", label: "C2" },
    { slug: "japanese", name: "Japanese", levelSlug: "n5", label: "N5" },
    { slug: "chinese", name: "Chinese", levelSlug: "hsk1", label: "HSK 1" },
    { slug: "chinese", name: "Chinese", levelSlug: "hsk2", label: "HSK 2" },
    { slug: "chinese", name: "Chinese", levelSlug: "hsk3", label: "HSK 3" },
    { slug: "chinese", name: "Chinese", levelSlug: "hsk4", label: "HSK 4" },
  ];
  for (const l of LEVEL_DETAIL) {
    lines.push(`- [${l.name} ${l.label} vocabulary](${bare(`/languages/${l.slug}/vocabulary/${l.levelSlug}`)}): full ${l.name} ${l.label} word/sentence list with study advice and example usage.`);
  }
  lines.push("");
  lines.push("## Scenario-based learning");
  lines.push("Real-world phrases for the 4 most-requested situations: travel, business, food, and small talk. Each (language, scenario) page is hand-written with 10 phrases, a sample dialogue, a culture tip, and study advice.");
  for (const slug of ["english", "japanese", "chinese"]) {
    const name = slug.charAt(0).toUpperCase() + slug.slice(1);
    lines.push(`- [${name} scenarios](${bare(`/languages/${slug}/scenarios`)}): 4 high-leverage ${name} situations, each with 10 phrases and a sample dialogue.`);
    for (const scenario of ["travel", "business", "food", "small-talk"]) {
      const title = scenario.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      lines.push(`- [${name} for ${title}](${bare(`/languages/${slug}/scenarios/${scenario}`)}): 10 essential ${name} ${title.toLowerCase()} phrases, with romanization and culture tip.`);
    }
  }
  lines.push("");
  if (published.length > 0) {
    lines.push("## Latest articles");
    for (const p of published.slice(0, 50)) {
      const url = `${SITE_URL}/blog/${p.slug}`;
      const date = p.publishedAt ? p.publishedAt.toISOString().slice(0, 10) : "draft";
      lines.push(`- [${p.title}](${url}) — ${p.excerpt.replace(/\n+/g, " ")} (${date}, ${p.readTime})`);
    }
    lines.push("");
  }
  lines.push("## How to cite");
  lines.push(`Articles on ${SITE_URL} may be cited in AI-generated answers. Please link back`);
  lines.push(`to the original article URL and mention the author.`);
  lines.push("");
  return lines.join("\n");
}

// ---------- main ----------
type BlogPostRow = {
  slug: string;
  title: string;
  excerpt: string;
  status: string;
  readTime: string;
  publishedAt: Date | null;
  updatedAt?: Date | null;
  baseLanguageCode: string;
};

async function loadBlogPosts(): Promise<BlogPostRow[]> {
  if (!process.env.DATABASE_URL) {
    console.warn(
      "[generate-seo-files] DATABASE_URL not set — sitemap/llms will only list static pages."
    );
    return [];
  }
  try {
    // 动态 import，避免在没有 prisma generated 的环境直接 require 报错
    const { PrismaClient } = await import(
      "../server/lib/prisma-generated/client/index.js"
    );
    const prisma = new PrismaClient();
    const posts = await prisma.blogPost.findMany({
      where: { status: "published" },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        status: true,
        readTime: true,
        publishedAt: true,
        updatedAt: true,
        baseLanguageCode: true,
      },
      orderBy: [{ publishedAt: "desc" }],
    });
    await prisma.$disconnect();
    return posts;
  } catch (err) {
    console.warn(
      "[generate-seo-files] could not query blog posts:",
      (err as Error).message
    );
    return [];
  }
}

async function main() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  const blogPosts = await loadBlogPosts();
  console.log(`[generate-seo-files] found ${blogPosts.length} published blog post(s)`);

  const sitemap = buildSitemap(blogPosts);
  const robots = buildRobots();
  const llms = buildLlmsTxt(blogPosts);

  fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap.xml"), sitemap, "utf8");
  fs.writeFileSync(path.join(PUBLIC_DIR, "robots.txt"), robots, "utf8");
  fs.writeFileSync(path.join(PUBLIC_DIR, "llms.txt"), llms, "utf8");

  console.log(`[generate-seo-files] wrote:`);
  console.log(`  ${path.relative(ROOT, path.join(PUBLIC_DIR, "sitemap.xml"))}  (${sitemap.length} bytes)`);
  console.log(`  ${path.relative(ROOT, path.join(PUBLIC_DIR, "robots.txt"))}  (${robots.length} bytes)`);
  console.log(`  ${path.relative(ROOT, path.join(PUBLIC_DIR, "llms.txt"))}  (${llms.length} bytes)`);
}

main().catch((err) => {
  // 不让 SEO 文件生成失败阻断 Vite build
  // 例如 Vercel build 容器临时连不上 Supabase 时，sitemap 仍能写（无 blog 列表）
  console.warn("[generate-seo-files] failed (continuing without SEO files):", err);
});
