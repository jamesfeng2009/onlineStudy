import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
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
import { useAuthStore } from "./store/authStore";
import i18n from "./lib/i18n";

export default function App() {
  const { t } = useTranslation();
  const bootstrap = useAuthStore((s) => s.bootstrap);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    const preferred = (user?.uiLanguage as string) || i18n.language;
    if (preferred && preferred !== i18n.language) {
      i18n.changeLanguage(preferred);
    }
  }, [user]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#050c1a] text-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/learn/:courseId" element={<LearnPage />} />
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
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <footer className="border-t border-white/5 py-10 text-center text-xs text-brand-200/50">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 md:flex-row md:justify-between md:px-8">
            <div>{t("footer.copyright", { year: new Date().getFullYear() })}</div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="/faq" className="hover:text-white">{t("nav.faq")}</a>
              <span className="text-white/10">·</span>
              <a href="/blog" className="hover:text-white">{t("nav.blog")}</a>
              <span className="text-white/10">·</span>
              <a href="/courses" className="hover:text-white">{t("nav.courses")}</a>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
