import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import PageShell from "../components/PageShell";
import { api } from "../lib/api";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  tag: string;
  readTime: string;
  publishedAt: string | null;
  coverEmoji?: string | null;
  baseLanguageCode: string;
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
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-sky-300 hover:text-sky-200">
          <ArrowLeft className="h-4 w-4" /> {t("blog.backToList")}
        </Link>
      </PageShell>
    );
  }

  return (
    <PageShell>
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
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold text-white md:text-5xl">
          {post.coverEmoji && <span className="mr-3">{post.coverEmoji}</span>}
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-brand-200/80">{post.excerpt}</p>
        <div className="glass mt-10 space-y-5 rounded-2xl p-8 text-base leading-relaxed text-brand-100">
          {post.content.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
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
