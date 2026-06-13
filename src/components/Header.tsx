import { useState, useMemo } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Globe2,
  Home,
  BookOpen,
  GraduationCap,
  TrendingUp,
  MessageCircle,
  Trophy,
  User,
  LogOut,
  Sparkles,
  Flame,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { cn } from "../lib/utils";

const NAV = [
  { to: "/", label: "首页", icon: Home },
  { to: "/courses", label: "课程中心", icon: BookOpen },
  { to: "/learn", label: "学习模块", icon: GraduationCap },
  { to: "/dashboard", label: "学习进度", icon: TrendingUp },
  { to: "/recommend", label: "推荐路径", icon: Sparkles },
  { to: "/community", label: "社区", icon: MessageCircle },
  { to: "/achievements", label: "成就", icon: Trophy },
  { to: "/profile", label: "我的", icon: User },
];

export default function Header() {
  const currentUserId = useAuthStore((s) => s.currentUserId);
  const users = useAuthStore((s) => s.users);
  const user = useMemo(() => users.find((u) => u.id === currentUserId) ?? null, [users, currentUserId]);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 via-sky-500 to-fuchsia-500 shadow-lg shadow-sky-500/30">
            <Globe2 className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-bold tracking-wide text-white">
              LinguaVerse
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-brand-200/70">
              immersive learning
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-brand-200/80 transition",
                  "hover:bg-white/5 hover:text-white",
                  isActive && "bg-white/10 text-white shadow-inner"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user && currentUserId ? (
            <>
              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-brand-100 md:flex">
                <Flame className="h-4 w-4 text-orange-400" />
                <span className="font-medium">{user.streak} 天连续</span>
                <span className="mx-1 h-3 w-px bg-white/10" />
                <span className="text-brand-200">Lv.{user.level}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-brand-200 transition hover:bg-white/10 hover:text-white hidden md:flex"
                title="退出登录"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-gradient-to-r from-sky-400 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-fuchsia-500/30 transition hover:shadow-fuchsia-500/50"
            >
              登录 / 注册
            </Link>
          )}

          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-brand-100 lg:hidden"
            onClick={() => setMobileOpen((s) => !s)}
            aria-label="menu"
          >
            <span className="block h-[2px] w-5 bg-current" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/5 bg-[#020617]/95 lg:hidden">
          <div className="grid grid-cols-2 gap-1 p-3">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-brand-100",
                    isActive ? "bg-white/10 text-white" : "hover:bg-white/5"
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
