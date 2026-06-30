import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Compass, Home, Search } from "lucide-react";
import PageShell from "../components/PageShell";
import { Seo } from "../components/Seo";

/**
 * 404 page — shown when no route matches the URL.
 *
 * Important SEO note: previously this was silently rendered as the homepage
 * (via `<Route path="*" element={<HomePage />} />`), which Google penalises
 * as a "soft 404" — the URL stays 200 OK but the page content does not match
 * the address. That dilutes crawl budget and can cause duplicate-content
 * issues across thousands of typo / bot-scraped URLs.
 *
 * To mitigate:
 * 1. This component renders real 404 content, not a homepage re-skin.
 * 2. The server-side route handler (api/handler.ts) should also return HTTP
 *    404 for unmatched paths; if not yet wired, that's the next fix.
 * 3. The <Seo /> component sets the page as noindex so search engines do
 *    not waste crawl budget indexing random 404 pages.
 */
export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <PageShell
      title={t("notFound.title", { defaultValue: "Page not found" })}
      subtitle={t("notFound.subtitle", {
        defaultValue:
          "The page you're looking for doesn't exist or has been moved.",
      })}
    >
      <Seo
        title={t("notFound.seoTitle", { defaultValue: "Page not found — LangOria" })}
        description={t("notFound.seoDescription", {
          defaultValue:
            "The page you're looking for doesn't exist on LangOria. Head back to the homepage to start learning languages.",
        })}
        pathname="/404"
        noindex
      />

      <div className="mx-auto flex max-w-xl flex-col items-center gap-8 py-12 text-center">
        <div className="relative">
          <div className="font-display text-8xl font-bold text-white/10 md:text-9xl">
            404
          </div>
          <Compass
            className="absolute inset-0 m-auto h-12 w-12 text-brand-300 md:h-16 md:w-16"
            strokeWidth={1.5}
          />
        </div>

        <p className="text-base text-brand-200/70 md:text-lg">
          {t("notFound.suggestion", {
            defaultValue: "Check the URL for typos, or try one of these:",
          })}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-400"
          >
            <Home className="h-4 w-4" />
            {t("notFound.goHome", { defaultValue: "Homepage" })}
          </Link>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            <Search className="h-4 w-4" />
            {t("notFound.browseCourses", { defaultValue: "Browse courses" })}
          </Link>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            {t("notFound.readBlog", { defaultValue: "Read the blog" })}
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
