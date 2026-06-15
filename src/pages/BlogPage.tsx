import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Loader2 } from "lucide-react";
import PageShell from "../components/PageShell";
import { Seo } from "../components/Seo";
import { api } from "../lib/api";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  readTime: string;
  publishedAt: string | null;
  coverEmoji?: string | null;
  baseLanguageCode: string;
}

export default function BlogPage() {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    // 优先按用户当前 UI 语言拉取；没有结果时再拉英文
    api
      .getBlogPosts({ language: i18n.language })
      .then((data) => {
        if (!alive) return;
        if (data.length > 0) {
          setPosts(data as unknown as BlogPost[]);
        } else {
          api.getBlogPosts({ language: "en" }).then((fb) => {
            if (alive) setPosts(fb as unknown as BlogPost[]);
          });
        }
      })
      .catch(() => {
        if (alive) setPosts([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [i18n.language]);

  return (
    <PageShell title={t("blog.title")} subtitle={t("blog.subtitle")}>
      <Seo
        title={t("blog.seoTitle", { defaultValue: "Blog — LinguaVerse" })}
        description={t("blog.seoDescription", {
          defaultValue:
            "Articles on spaced repetition, vocabulary, listening and speaking — practical guides for language learners.",
        })}
        pathname="/blog"
      />
      {loading ? (
        <div className="flex items-center justify-center py-20 text-brand-200/70">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {t("admin.loading")}
        </div>
      ) : posts.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-sm text-brand-200/70">
          {t("blog.empty")}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {posts.map((p, i) => (
            <article
              key={p.id}
              className={`glass group rounded-2xl p-6 transition hover:-translate-y-1 ${
                i === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 font-medium uppercase tracking-wide text-emerald-300">
                  {p.tag}
                </span>
                <span className="text-brand-200/50">·</span>
                <span className="text-brand-200/60">{p.readTime}</span>
                {p.publishedAt && (
                  <>
                    <span className="text-brand-200/50">·</span>
                    <span className="text-brand-200/60">{p.publishedAt.slice(0, 10)}</span>
                  </>
                )}
              </div>
              <h2 className={`mt-4 font-display font-bold text-white ${i === 0 ? "text-2xl md:text-3xl" : "text-lg"}`}>
                {p.coverEmoji && <span className="mr-2">{p.coverEmoji}</span>}
                {p.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-brand-200/70 md:text-base">
                {p.excerpt}
              </p>
              <Link
                to={`/blog/${p.slug}`}
                className="mt-5 inline-flex items-center gap-1 text-sm text-sky-300 group-hover:text-sky-200"
              >
                {t("blog.readMore")} <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      )}

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
              {t("blog.cta")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
