import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import LearnPage from "./pages/LearnPage";
import DashboardPage from "./pages/DashboardPage";
import RecommendPage from "./pages/RecommendPage";
import CommunityPage from "./pages/CommunityPage";
import AchievementsPage from "./pages/AchievementsPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#050c1a] text-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/recommend" element={<RecommendPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <footer className="border-t border-white/5 py-10 text-center text-xs text-brand-200/50">
          © {new Date().getFullYear()} LinguaVerse · 沉浸式多语种学习平台
        </footer>
      </div>
    </BrowserRouter>
  );
}
