import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import CoursesPage from "./pages/CoursesPage";
import PlacementTestPage from "./pages/PlacementTestPage";
import AlphabetPage from "./pages/AlphabetPage";
import ReadingPage from "./pages/ReadingPage";
import LeaguePage from "./pages/LeaguePage";
import CefrSelfAssessmentPage from "./pages/CefrSelfAssessmentPage";
import WritingPage from "./pages/WritingPage";
import AiConversationPage from "./pages/AiConversationPage";
import LearnPage from "./pages/LearnPage";
import DashboardPage from "./pages/DashboardPage";
import RecommendPage from "./pages/RecommendPage";
import CommunityPage from "./pages/CommunityPage";
import AchievementsPage from "./pages/AchievementsPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import FaqPage from "./pages/FaqPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import OAuthCallbackPage from "./pages/auth/OAuthCallbackPage";
import LearnLangPage from "./pages/LearnLangPage";
import LearnWordPage from "./pages/LearnWordPage";
import LearnVocabPage from "./pages/LearnVocabPage";
import LearnScenarioPage from "./pages/LearnScenarioPage";
import { useAuthStore } from "./store/authStore";
import i18n, { SUPPORTED_LANGUAGES, type SupportedLanguage } from "./lib/i18n";
import { langSlugFromCode } from "./lib/i18n/registry";
import { LocaleLink } from "./components/LocaleLink";

/**
 * Syncs the active i18n language to the `:locale` URL segment.
 * The i18n module already reads the URL on its own, but matching it here
 * too means React Router's matched `locale` is the source of truth for
 * components that need to read it (language switchers, analytics, etc).
 */
function LocaleSync() {
  const { locale } = useParams<{ locale: string }>();
  useEffect(() => {
    if (locale && (SUPPORTED_LANGUAGES as readonly string[]).includes(locale)) {
      if (i18n.language !== locale) {
        void i18n.changeLanguage(locale as SupportedLanguage);
      }
      if (document.documentElement.lang !== locale) {
        document.documentElement.lang = locale;
      }
    }
  }, [locale]);
  return <Outlet />;
}

/**
 * Redirect /:locale/:langCode to the language hub page.
 *
 * Example: /zh/id → /zh/languages/indonesian
 *          /ja/ms → /ja/languages/malay
 *
 * This handles the case where a user or crawler constructs a URL like
 * /zh/id (locale prefix + language code) instead of the correct
 * /zh/languages/indonesian. Without this redirect, React Router falls
 * through to the * catch-all and shows a 404.
 *
 * Performance: O(1) lookup via LANG_CODE_TO_SLUG map; no DB or async work.
 * Idempotency: replace={true} ensures no redirect loops.
 */
function LangCodeRedirect() {
  const { locale, langCode } = useParams<{ locale: string; langCode: string }>();
  const location = useLocation();

  // Only redirect if:
  // 1. locale is a valid UI language
  // 2. langCode is a valid learn language code (e.g. id, ms, vi, ja, ...)
  // 3. langCode is NOT a valid UI language (otherwise it might be a real page)
  //
  // Note: we don't need a RESERVED path list — if langCode is not a valid
  // learn language code, langSlugFromCode returns undefined and we fall
  // through to the * catch-all naturally. This is more robust than
  // maintaining a hardcoded RESERVED set.
  if (
    locale &&
    langCode &&
    (SUPPORTED_LANGUAGES as readonly string[]).includes(locale) &&
    !(SUPPORTED_LANGUAGES as readonly string[]).includes(langCode)
  ) {
    const slug = langSlugFromCode(langCode);
    if (slug) {
      const target = `/${locale}/languages/${slug}${location.search}${location.hash}`;
      return <Navigate to={target} replace />;
    }
  }

  // Not a language code — let the router continue to the * catch-all
  return <Outlet />;
}

/**
 * Redirect /jp/* to /ja/*.
 *
 * "/jp" is not a valid UI locale (the correct code is "ja"), but
 * Google keeps discovering /jp/* URLs from external links. Vercel
 * already has a redirect rule, but it only fires on the edge — if the
 * request ever hits the SPA fallback we handle it here too.
 */
function JpRedirect() {
  const location = useLocation();
  const target = location.pathname.replace(/^\/jp/, "/ja") + location.search + location.hash;
  return <Navigate to={target} replace />;
}

// Root-level routes (no locale prefix → English default).
// Paths MUST be absolute (start with "/").
const rootRoutes = (
  <>
    <Route path="/" element={<HomePage />} />
    <Route path="/courses" element={<CoursesPage />} />
    <Route path="/placement" element={<PlacementTestPage />} />
    <Route path="/alphabet" element={<AlphabetPage />} />
    <Route path="/alphabet/:language" element={<AlphabetPage />} />
    <Route path="/reading" element={<ReadingPage />} />
    <Route path="/reading/:id" element={<ReadingPage />} />
    <Route path="/league" element={<LeaguePage />} />
    <Route path="/cefr-self-assessment" element={<CefrSelfAssessmentPage />} />
    <Route path="/writing" element={<WritingPage />} />
    <Route path="/writing/:id" element={<WritingPage />} />
    <Route path="/ai-conversation" element={<AiConversationPage />} />
    <Route path="/learn" element={<LearnPage />} />
    <Route path="/learn/:courseId" element={<LearnPage />} />
    <Route path="/languages" element={<LearnLangPage />} />
    <Route path="/languages/:langSlug" element={<LearnLangPage />} />
    <Route path="/languages/:langSlug/vocabulary" element={<LearnVocabPage />} />
    <Route path="/languages/:langSlug/vocabulary/:levelSlug" element={<LearnVocabPage />} />
    <Route path="/languages/:langSlug/scenarios" element={<LearnScenarioPage />} />
    <Route path="/languages/:langSlug/scenarios/:scenarioSlug" element={<LearnScenarioPage />} />
    <Route path="/languages/:langSlug/word/:wordSlug" element={<LearnWordPage />} />
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/recommend" element={<RecommendPage />} />
    <Route path="/community" element={<CommunityPage />} />
    <Route path="/achievements" element={<AchievementsPage />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/settings" element={<SettingsPage />} />
    <Route path="/faq" element={<FaqPage />} />
    <Route path="/blog" element={<BlogPage />} />
    <Route path="/blog/:slug" element={<BlogPostPage />} />
    <Route path="/admin" element={<AdminPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/auth/callback" element={<OAuthCallbackPage />} />
    <Route path="/auth/callback/:provider" element={<OAuthCallbackPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </>
);

// Locale-level routes (under "/:locale" parent).
// Paths MUST be relative (no leading "/"); the index route matches the
// bare "/:locale" URL.
const localeRoutes = (
  <>
    <Route index element={<HomePage />} />
    <Route path="courses" element={<CoursesPage />} />
      <Route path="placement" element={<PlacementTestPage />} />
      <Route path="alphabet" element={<AlphabetPage />} />
      <Route path="alphabet/:language" element={<AlphabetPage />} />
      <Route path="reading" element={<ReadingPage />} />
      <Route path="reading/:id" element={<ReadingPage />} />
      <Route path="league" element={<LeaguePage />} />
      <Route path="cefr-self-assessment" element={<CefrSelfAssessmentPage />} />
      <Route path="writing" element={<WritingPage />} />
      <Route path="writing/:id" element={<WritingPage />} />
      <Route path="ai-conversation" element={<AiConversationPage />} />
    <Route path="learn" element={<LearnPage />} />
    <Route path="learn/:courseId" element={<LearnPage />} />
    <Route path="languages" element={<LearnLangPage />} />
    <Route path="languages/:langSlug" element={<LearnLangPage />} />
    <Route path="languages/:langSlug/vocabulary" element={<LearnVocabPage />} />
    <Route path="languages/:langSlug/vocabulary/:levelSlug" element={<LearnVocabPage />} />
    <Route path="languages/:langSlug/scenarios" element={<LearnScenarioPage />} />
    <Route path="languages/:langSlug/scenarios/:scenarioSlug" element={<LearnScenarioPage />} />
    <Route path="languages/:langSlug/word/:wordSlug" element={<LearnWordPage />} />
    <Route path="dashboard" element={<DashboardPage />} />
    <Route path="recommend" element={<RecommendPage />} />
    <Route path="community" element={<CommunityPage />} />
    <Route path="achievements" element={<AchievementsPage />} />
    <Route path="profile" element={<ProfilePage />} />
    <Route path="settings" element={<SettingsPage />} />
    <Route path="faq" element={<FaqPage />} />
    <Route path="blog" element={<BlogPage />} />
    <Route path="blog/:slug" element={<BlogPostPage />} />
    <Route path="admin" element={<AdminPage />} />
    <Route path="login" element={<LoginPage />} />
    <Route path="register" element={<RegisterPage />} />
    <Route path="auth/callback" element={<OAuthCallbackPage />} />
    <Route path="auth/callback/:provider" element={<OAuthCallbackPage />} />
  </>
);

export default function App() {
  const { t } = useTranslation();
  const bootstrap = useAuthStore((s) => s.bootstrap);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  // When the user is logged in and the URL has no locale, prefer their
  // stored uiLanguage for the first paint, but never clobber an explicit
  // /<locale>/ URL.
  useEffect(() => {
    const preferred = user?.uiLanguage as string | undefined;
    if (!preferred) return;
    const { locale } = (() => {
      const segs = window.location.pathname.split("/").filter(Boolean);
      const isLocaleSeg =
        segs.length > 0 && (SUPPORTED_LANGUAGES as readonly string[]).includes(segs[0]);
      return { locale: isLocaleSeg ? segs[0] : "" };
    })();
    if (locale) return; // explicit locale in URL — leave it alone
    if (preferred && preferred !== i18n.language) {
      void i18n.changeLanguage(preferred);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-[#050c1a] text-white">
      <Header />
      <main>
        <Routes>
          {rootRoutes}
          <Route path="/jp/*" element={<JpRedirect />} />
          <Route path="/:locale" element={<LocaleSync />}>
            <Route path=":langCode" element={<LangCodeRedirect />}>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            {localeRoutes}
          </Route>
        </Routes>
      </main>
      <footer className="border-t border-white/5 py-10 text-center text-xs text-brand-200/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 md:flex-row md:justify-between md:px-8">
          <div>{t("footer.copyright", { year: new Date().getFullYear() })}</div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <LocaleLink to="/faq" className="hover:text-white">{t("nav.faq")}</LocaleLink>
            <span className="text-white/10">·</span>
            <LocaleLink to="/blog" className="hover:text-white">{t("nav.blog")}</LocaleLink>
            <span className="text-white/10">·</span>
            <LocaleLink to="/courses" className="hover:text-white">{t("nav.courses")}</LocaleLink>
          </div>
        </div>
      </footer>
    </div>
  );
}
