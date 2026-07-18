/**
 * Build-time SEO file generator.
 *
 *   pnpm tsx scripts/generate-seo-files.ts
 *
 * Generates one static file into ./public so that Vite copies it to
 * ./dist on build:
 *
 *   - public/llms.txt      – GEO: plain-text site summary for LLM crawlers
 *
 * sitemap.xml 与 robots.txt 已改由 server/routes/seo.ts 动态生成，
 * 通过 vercel.json 的 rewrite 从 /sitemap.xml、/robots.txt 路由到
 * /api/seo/sitemap、/api/seo/robots，保证内容与数据库实时同步。
 *
 * Safe to run without a database: llms.txt falls back to static pages
 * only, and prints a warning. That keeps `pnpm build` working even
 * when the build container can't reach Supabase.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");

const SITE_URL = "https://lang-oria.com";
const SUPPORTED_LANGUAGES = ["en", "zh", "ja", "ko", "es", "fr", "de", "it", "th", "yue", "ms", "id", "vi"] as const;

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
  lines.push("> English, Japanese, Korean, Chinese, Spanish, French, German, Italian, Thai, and Cantonese.");
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
  lines.push(`- [CEFR self-assessment](${bare("/cefr-self-assessment")}): quick level check mapping study history to CEFR A1-C2.`);
  lines.push("");
  lines.push("## Language hubs");
  lines.push("One hand-written guide per language: why learn it, how the platform teaches it, level system (CEFR / JLPT / HSK / TOPIK), and entry points to vocabulary and scenarios.");
  const ALL_LANG_SLUGS = [
    "english", "japanese", "chinese", "korean", "spanish",
    "french", "german", "italian", "thai", "cantonese",
    "malay", "indonesian", "vietnamese",
  ] as const;
  for (const slug of ALL_LANG_SLUGS) {
    const name = slug.charAt(0).toUpperCase() + slug.slice(1);
    lines.push(`- [Learn ${name} online](${bare(`/languages/${slug}`)}): hand-written guide to learning ${name} with level-based spaced repetition.`);
  }
  lines.push("");
  lines.push("## Vocabulary indexes");
  lines.push("One per supported language. Each page lists every level (CEFR / JLPT / HSK / TOPIK tier) with the actual word count, a sample of the vocabulary, and a link to the level detail page.");
  for (const slug of ALL_LANG_SLUGS) {
    const name = slug.charAt(0).toUpperCase() + slug.slice(1);
    lines.push(`- [${name} vocabulary by level](${bare(`/languages/${slug}/vocabulary`)}): data-driven list of every ${name} vocabulary level in the library, with example sentences.`);
  }
  lines.push("");
  lines.push("## Vocabulary level details");
  lines.push("Detail page for each (language, level) pair actually backed by data: English A1-C2, Japanese N5, Chinese HSK1-4, Korean TOPIK1-3, Spanish/French/German A1-B1, Italian/Thai/Cantonese/Malay/Indonesian/Vietnamese A1-C2.");
  const LEVELS_BY_LANG: Record<string, readonly string[]> = {
    english: ["a1", "a2", "b1", "b2", "c1", "c2"],
    japanese: ["n5"],
    chinese: ["hsk1", "hsk2", "hsk3", "hsk4"],
    korean: ["topik1", "topik2", "topik3"],
    spanish: ["a1", "a2", "b1"],
    french: ["a1", "a2", "b1"],
    german: ["a1", "a2", "b1"],
    italian: ["a1", "a2", "b1", "b2", "c1", "c2"],
    thai: ["a1", "a2", "b1", "b2", "c1", "c2"],
    cantonese: ["a1", "a2", "b1", "b2", "c1", "c2"],
    malay: ["a1", "a2", "b1", "b2", "c1", "c2"],
    indonesian: ["a1", "a2", "b1", "b2", "c1", "c2"],
    vietnamese: ["a1", "a2", "b1", "b2", "c1", "c2"],
  };
  for (const [slug, levels] of Object.entries(LEVELS_BY_LANG)) {
    const name = slug.charAt(0).toUpperCase() + slug.slice(1);
    for (const lvl of levels) {
      const label = lvl.toUpperCase().replace(/^HSK(\d)/, "HSK $1").replace(/^TOPIK(\d)/, "TOPIK $1");
      lines.push(`- [${name} ${label} vocabulary](${bare(`/languages/${slug}/vocabulary/${lvl}`)}): full ${name} ${label} word/sentence list with study advice and example usage.`);
    }
  }
  lines.push("");
  lines.push("## Scenario-based learning");
  lines.push("Real-world phrases for the 4 most-requested situations: travel, business, food, and small talk. Each (language, scenario) page is hand-written with 10 phrases, a sample dialogue, a culture tip, and study advice.");
  for (const slug of ALL_LANG_SLUGS) {
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

  // sitemap.xml 与 robots.txt 现由 server/routes/seo.ts 动态生成
  // （vercel.json rewrite 到 /api/seo/sitemap、/api/seo/robots）。
  // 这里只生成 llms.txt。
  const llms = buildLlmsTxt(blogPosts);

  fs.writeFileSync(path.join(PUBLIC_DIR, "llms.txt"), llms, "utf8");

  console.log(`[generate-seo-files] wrote:`);
  console.log(`  ${path.relative(ROOT, path.join(PUBLIC_DIR, "llms.txt"))}  (${llms.length} bytes)`);
}

main().catch((err) => {
  // 不让 SEO 文件生成失败阻断 Vite build
  // 例如 Vercel build 容器临时连不上 Supabase 时，sitemap 仍能写（无 blog 列表）
  console.warn("[generate-seo-files] failed (continuing without SEO files):", err);
});
