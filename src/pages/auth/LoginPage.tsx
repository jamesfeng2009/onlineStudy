import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LocaleLink from "../../components/LocaleLink";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/authStore";

// Google/GitHub 品牌色图标（简化版 SVG,避免引入新依赖）
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M12 1C5.92 1 1 5.92 1 12c0 4.86 3.15 8.98 7.52 10.44.55.1.75-.24.75-.53 0-.26-.01-.95-.02-1.86-3.06.67-3.71-1.48-3.71-1.48-.5-1.27-1.22-1.6-1.22-1.6-.99-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.97 1.67 2.55 1.19 3.17.91.1-.71.38-1.19.69-1.46-2.44-.28-5.01-1.22-5.01-5.42 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.92 0 0 .92-.3 3.02 1.13a10.5 10.5 0 0 1 5.5 0c2.1-1.43 3.02-1.13 3.02-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.75 1.13 2.95 0 4.21-2.57 5.14-5.02 5.41.39.34.74 1.01.74 2.04 0 1.47-.01 2.66-.01 3.02 0 .29.2.64.76.53A11 11 0 0 0 23 12c0-6.08-4.92-11-11-11z" />
    </svg>
  );
}

export default function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!email.trim() || !password) {
      setErr(t("auth.login.error"));
      return;
    }
    setLoading(true);
    const res = await login(email.trim(), password);
    setLoading(false);
    if (!res.ok) {
      setErr(res.error ?? t("auth.login.errorDefault"));
      return;
    }
    navigate("/");
  };

  // OAuth 入口：直接跳后端 /api/auth/oauth/:provider
  const startOAuth = (provider: "google" | "github") => {
    const base = import.meta.env.VITE_API_URL ?? "/api";
    const url = `${base.replace(/\/$/, "")}/auth/oauth/${provider}`;
    window.location.href = url;
  };

  const features = useMemo(
    () => t("auth.login.features", { returnObjects: true }) as { title: string; desc: string; c: string }[],
    [t]
  );

  const oauthDivider = t("auth.login.oauthDivider");
  const continueWithGoogle = t("auth.login.continueWithGoogle");
  const continueWithGitHub = t("auth.login.continueWithGitHub");
  const forgotPassword = t("auth.login.forgotPassword");

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute -top-32 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-500/40 via-fuchsia-500/30 to-orange-400/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-8">
        <div className="order-2 md:order-1">
          <div className="glass rounded-3xl p-8 md:p-10">
            <h2 className="font-display text-2xl font-bold text-white">{t("auth.login.title")} 👋</h2>
            <p className="mt-1 text-sm text-brand-200/70">{t("auth.login.subtitle")}</p>

            {/* OAuth 快捷登录 */}
            <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => startOAuth("google")}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                <GoogleIcon /> {continueWithGoogle}
              </button>
              <button
                type="button"
                onClick={() => startOAuth("github")}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                <GitHubIcon /> {continueWithGitHub}
              </button>
            </div>

            <div className="relative my-6 text-center text-xs text-brand-200/50">
              <span className="relative z-10 bg-transparent px-3">{oauthDivider}</span>
              <span className="absolute left-0 top-1/2 h-px w-full bg-white/10" />
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <span className="text-xs font-medium text-brand-200/80">{t("auth.email")}</span>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 transition focus-within:border-sky-400/60 focus-within:bg-white/10">
                  <Mail className="h-4 w-4 text-brand-200/70" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-sm text-white placeholder:text-brand-200/40 outline-none"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-brand-200/80">{t("auth.password")}</span>
                  {/* 忘记密码入口（功能未实现，先占位提示） */}
                  <button
                    type="button"
                    onClick={() => setErr(t("auth.login.forgotPasswordHint"))}
                    className="text-xs text-sky-300 hover:text-sky-200"
                  >
                    {forgotPassword}
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 transition focus-within:border-sky-400/60 focus-within:bg-white/10">
                  <Lock className="h-4 w-4 text-brand-200/70" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("auth.password")}
                    className="w-full bg-transparent text-sm text-white placeholder:text-brand-200/40 outline-none"
                  />
                </div>
              </div>

              {err && (
                <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">
                  {err}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 via-fuchsia-400 to-amber-300 px-5 py-3 font-semibold text-slate-900 shadow-lg shadow-fuchsia-500/30 transition hover:-translate-y-0.5 hover:shadow-fuchsia-500/50 disabled:opacity-60"
              >
                {loading ? t("auth.login.loading") : <>{t("auth.login.button")} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></>}
              </button>

              <div className="text-center text-sm text-brand-200/70">
                {t("auth.noAccount")}{" "}
                <LocaleLink to="/register" className="text-sky-300 hover:text-sky-200">
                  {t("auth.register.button")}
                </LocaleLink>
              </div>
            </form>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-brand-200/80">
              <div className="mb-1 font-semibold text-white">{t("auth.login.usageTitle")}</div>
              <div>{t("auth.login.usageText")}</div>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-100">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" /> LangOria
          </div>
          <h1 className="font-display text-5xl font-bold leading-tight text-white md:text-6xl">
            {t("auth.login.heroTitle")}
            <span className="block bg-gradient-to-r from-sky-300 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
              {t("auth.login.heroHighlight")}
            </span>
          </h1>
          <p className="mt-4 max-w-md text-brand-200/80">
            {t("auth.login.heroDesc")}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {features.map((f, i) => (
              <div
                key={i}
                className={`rounded-2xl border border-white/10 bg-gradient-to-br ${f.c} p-4 backdrop-blur`}
              >
                <div className="text-sm font-semibold text-white">{f.title}</div>
                <div className="mt-1 text-xs text-brand-200/70">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
