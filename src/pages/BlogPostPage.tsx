import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, BookOpen, Eye, Loader2 } from "lucide-react";
import PageShell from "../components/PageShell";
import { Seo } from "../components/Seo";
import { api } from "../lib/api";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tag: string;
  readTime: string;
  publishedAt: string | null;
  coverEmoji?: string | null;
  coverImageUrl?: string | null;
  tldr?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  baseLanguageCode: string;
  viewCount?: number;
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let alive = true;
    setLoading(true);
    setNotFound(false);
    api
      .getBlogPost(slug)
      .then((data) => {
        if (alive) setPost(data as unknown as BlogPost);
      })
      .catch(() => {
        if (alive) setNotFound(true);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <PageShell>
        <Seo title={t("blog.title")} />
        <div className="flex items-center justify-center py-20 text-brand-200/70">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {t("admin.loading")}
        </div>
      </PageShell>
    );
  }

  if (notFound || !post) {
    return (
      <PageShell title={t("blog.notFoundTitle")} subtitle={t("blog.notFoundDesc")}>
        <Seo title={t("blog.notFoundTitle")} />
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-sky-300 hover:text-sky-200">
          <ArrowLeft className="h-4 w-4" /> {t("blog.backToList")}
        </Link>
      </PageShell>
    );
  }

  const seoTitle = post.seoTitle ?? post.title;
  const seoDesc = post.seoDescription ?? post.excerpt;
  const pagePath = typeof window !== "undefined" ? `/blog/${post.slug}` : `/blog/${post.slug}`;

  return (
    <PageShell>
      <Seo
        title={`${seoTitle} · LinguaVerse`}
        description={seoDesc}
        image={post.coverImageUrl ?? undefined}
        type="article"
        lang={post.baseLanguageCode}
        pathname={pagePath}
      />
      <Link
        to="/blog"
        className="inline-flex items-center gap-1 text-sm text-sky-300 hover:text-sky-200"
      >
        <ArrowLeft className="h-4 w-4" /> {t("blog.backToList")}
      </Link>

      <article className="mt-6">
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 font-medium uppercase tracking-wide text-emerald-300">
            {post.tag}
          </span>
          <span className="text-brand-200/50">·</span>
          <span className="text-brand-200/60">{post.readTime}</span>
          {post.publishedAt && (
            <>
              <span className="text-brand-200/50">·</span>
              <span className="text-brand-200/60">{post.publishedAt.slice(0, 10)}</span>
            </>
          )}
          {typeof post.viewCount === "number" && (
            <>
              <span className="text-brand-200/50">·</span>
              <span className="inline-flex items-center gap-1 text-brand-200/60">
                <Eye className="h-3 w-3" /> {post.viewCount}
              </span>
            </>
          )}
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold text-white md:text-5xl">
          {post.coverEmoji && <span className="mr-3">{post.coverEmoji}</span>}
          {post.title}
        </h1>
        {post.coverImageUrl && (
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="mt-6 w-full rounded-2xl object-cover"
            style={{ maxHeight: "420px" }}
          />
        )}
        {post.tldr && (
          <div className="mt-6 rounded-2xl border border-sky-400/20 bg-sky-400/5 p-5 text-base leading-relaxed text-brand-100">
            <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-sky-300">
              TL;DR
            </div>
            {post.tldr}
          </div>
        )}
        <p className="mt-6 text-lg text-brand-200/80">{post.excerpt}</p>

        <div className="prose prose-invert mt-10 max-w-none rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-base leading-relaxed text-brand-100">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      <div className="mt-12">
        <div className="glass relative overflow-hidden rounded-3xl p-8 md:p-12">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <BookOpen className="h-6 w-6 text-sky-300" />
              <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
                {t("blog.ctaTitle")}
              </h2>
              <p className="mt-2 max-w-xl text-sm text-brand-200/70 md:text-base">
                {t("blog.ctaDesc")}
              </p>
            </div>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 via-fuchsia-400 to-amber-300 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-fuchsia-500/30"
            >
              {t("blog.cta")} <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
