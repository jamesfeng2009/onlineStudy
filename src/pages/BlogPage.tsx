import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import PageShell from "../components/PageShell";

export default function BlogPage() {
  const { t } = useTranslation();

  const posts = useMemo(
    () =>
      t("blog.posts", { returnObjects: true }) as {
        slug: string;
        title: string;
        excerpt: string;
        tag: string;
        readTime: string;
        date: string;
      }[],
    [t]
  );

  return (
    <PageShell title={t("blog.title")} subtitle={t("blog.subtitle")}>
      <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {posts.map((p, i) => (
          <article
            key={p.slug}
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
              <span className="text-brand-200/50">·</span>
              <span className="text-brand-200/60">{p.date}</span>
            </div>
            <h2 className={`mt-4 font-display font-bold text-white ${i === 0 ? "text-2xl md:text-3xl" : "text-lg"}`}>
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
