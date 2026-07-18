/**
 * Build-time prerender — generates static HTML snapshots for every
 * public indexable route so AI crawlers (GPTBot, PerplexityBot, etc.)
 * can read real page content without executing JavaScript.
 *
 * Workflow:
 *   1. vite build 已经生成 dist/index.html + dist/assets/*
 *   2. 本脚本用 Vite dev-server 的 ssrLoadModule 加载 entry-server.tsx
 *   3. 对每个路由调用 render(url) → React renderToString
 *   4. 将结果注入 dist/<route>/index.html 的 <div id="root">
 *   5. 剥离 #seo-inline-prerender（预渲染页面已含 resolved meta）
 *
 * Output:
 *   dist/index.html          (/)    — overwritten with prerendered HTML
 *   dist/courses/index.html  (/courses)
 *   dist/languages/index.html (/languages)
 *   dist/languages/english/index.html
 *   … and every locale variant (/ja/courses, /zh/languages, …)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");
const templatePath = path.join(distDir, "index.html");

/* ───────── 路由生成 ───────── */

const UI_LOCALES = ["en", "zh", "ja", "ko", "es", "fr", "de", "it", "th", "yue"] as const;

const LEARN_LANG_SLUGS = [
  "english",
  "japanese",
  "chinese",
  "korean",
  "spanish",
  "french",
  "german",
  "italian",
  "thai",
  "cantonese",
  "malay",
  "indonesian",
  "vietnamese",
];

function generateRoutes(): string[] {
  const routes: string[] = [];

  for (const locale of UI_LOCALES) {
    const prefix = locale === "en" ? "" : `/${locale}`;

    // 核心索引页
    routes.push(prefix || "/");
    routes.push(`${prefix}/courses`);
    routes.push(`${prefix}/faq`);
    routes.push(`${prefix}/languages`);
    routes.push(`${prefix}/blog`);
    routes.push(`${prefix}/cefr-self-assessment`);

    // 语言相关页
    for (const slug of LEARN_LANG_SLUGS) {
      routes.push(`${prefix}/languages/${slug}`);
      routes.push(`${prefix}/languages/${slug}/vocabulary`);
      routes.push(`${prefix}/languages/${slug}/scenarios`);
    }
  }

  return routes;
}

/* ───────── 预渲染执行 ───────── */

interface SeoData {
  title: string;
  description?: string;
  ogImage: string;
  canonicalUrl: string;
  ogLocale: string;
  alternates: { lang: string; url: string }[];
  xDefault?: { lang: string; url: string };
  noindex: boolean;
  type: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 将 SSR 时 <Seo> / <JsonLd> 写入全局对象的数据注入 <head> */
function injectSeoData(page: string, route: string): string {
  const seo = (globalThis as Record<string, unknown>).__SEO_DATA__ as SeoData | undefined;
  const jsonLd = (globalThis as Record<string, unknown>).__JSON_LD__ as string | undefined;

  // 每次渲染前清空，避免跨路由污染
  delete (globalThis as Record<string, unknown>).__SEO_DATA__;
  delete (globalThis as Record<string, unknown>).__JSON_LD__;

  // 根据路由设置 <html lang>
  const locale = route.split("/").filter(Boolean)[0];
  const validLocale = UI_LOCALES.includes(locale as (typeof UI_LOCALES)[number]) ? locale : "en";
  page = page.replace(/<html lang="[^"]*"/, `<html lang="${validLocale}"`);

  if (!seo) return page;

  const tags: string[] = [];

  // title
  tags.push(`<title>${escapeHtml(seo.title)}</title>`);

  // meta
  if (seo.description) {
    tags.push(`<meta name="description" content="${escapeHtml(seo.description)}" />`);
  }
  tags.push(`<meta property="og:title" content="${escapeHtml(seo.title)}" />`);
  tags.push(`<meta property="og:type" content="${seo.type}" />`);
  if (seo.description) {
    tags.push(`<meta property="og:description" content="${escapeHtml(seo.description)}" />`);
  }
  tags.push(`<meta property="og:url" content="${seo.canonicalUrl}" />`);
  tags.push(`<meta property="og:site_name" content="LangOria" />`);
  tags.push(`<meta property="og:locale" content="${seo.ogLocale}" />`);
  tags.push(`<meta property="og:image" content="${seo.ogImage}" />`);
  tags.push(`<meta name="twitter:card" content="summary_large_image" />`);
  if (seo.description) {
    tags.push(`<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`);
  }
  tags.push(`<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`);
  tags.push(`<meta name="twitter:image" content="${seo.ogImage}" />`);
  tags.push(
    `<meta name="robots" content="${seo.noindex ? "noindex, nofollow, noarchive" : "index, follow, max-image-preview:large"}" />`
  );

  // canonical
  tags.push(`<link rel="canonical" href="${seo.canonicalUrl}" data-seo="1" />`);

  // hreflang
  for (const a of seo.alternates) {
    tags.push(`<link rel="alternate" hreflang="${a.lang}" href="${a.url}" data-seo="1" />`);
  }
  if (seo.xDefault) {
    tags.push(`<link rel="alternate" hreflang="x-default" href="${seo.xDefault.url}" data-seo="1" />`);
  }

  // JSON-LD
  if (jsonLd) {
    tags.push(`<script type="application/ld+json" id="json-ld-main">${jsonLd}</script>`);
  }

  // 替换原有 <title>，追加其余标签到 </head> 前
  page = page.replace(/<title>[^<]*<\/title>/, "");
  page = page.replace("</head>", `    ${tags.join("\n    ")}\n  </head>`);

  return page;
}

async function prerender() {
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}. Run "vite build" first.`);
  }

  let template = fs.readFileSync(templatePath, "utf-8");
  // 若模板在之前的构建中已被污染（含 trae-inspector），先还原为干净骨架
  template = template.replace(/\s*<div id="root">[\s\S]*?<\/div>/, '<div id="root"></div>');
  template = template.replace(/\s+trae-inspector-[a-z-]+="[^"]*"/g, "");
  const routes = generateRoutes();

  console.log(`[prerender] ${routes.length} routes`);

  const vite = await createServer({
    root: path.resolve(__dirname, ".."),
    server: { middlewareMode: true },
    appType: "custom",
  });

  try {
    const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");

    for (const route of routes) {
      try {
        const html: string = await render(route);

        // 1) 把 renderToString 结果注入 root。
        //    ssrLoadModule 走 Vite dev pipeline，Trae inspector 插件会在
        //    每个元素上注入 trae-inspector-* 调试属性（含源码路径），
        //    必须在写入前剥离，避免污染线上 HTML。
        const cleanHtml = html.replace(/\s+trae-inspector-[a-z-]+="[^"]*"/g, "");
        let page = template.replace('<div id="root"></div>', `<div id="root">${cleanHtml}</div>`);

        // 2) 剥离内联脚本：预渲染后的页面已经由 <Seo> 插入了
        //    canonical / hreflang / og:*，不需要再执行 inline script。
        page = page.replace(/<script id="seo-inline-prerender">[\s\S]*?<\/script>/, "");

        // 3) 注入 SSR 时 <Seo> / <JsonLd> 写入全局对象的 SEO 数据
        page = injectSeoData(page, route);

        // 4) 写入文件
        const outPath =
          route === "/"
            ? path.join(distDir, "index.html")
            : path.join(distDir, route, "index.html");

        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, page, "utf-8");

        console.log(`  ✓ ${route}`);
      } catch (err) {
        console.error(`  ✗ ${route}:`, err instanceof Error ? err.message : err);
      }
    }
  } finally {
    await vite.close();
  }

  console.log("[prerender] done");
}

prerender().catch((err) => {
  console.error("[prerender] failed:", err);
  process.exit(1);
});
