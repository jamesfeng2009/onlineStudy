import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/authStore";

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

  const features = useMemo(
    () => t("auth.login.features", { returnObjects: true }) as { title: string; desc: string; c: string }[],
    [t]
  );

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute -top-32 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-500/40 via-fuchsia-500/30 to-orange-400/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-8">
        <div className="order-2 md:order-1">
          <div className="glass rounded-3xl p-8 md:p-10">
            <h2 className="font-display text-2xl font-bold text-white">{t("auth.login.title")} 👋</h2>
            <p className="mt-1 text-sm text-brand-200/70">{t("auth.login.subtitle")}</p>

            <form onSubmit={submit} className="mt-8 space-y-4">
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
                <span className="text-xs font-medium text-brand-200/80">{t("auth.password")}</span>
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
                <Link to="/register" className="text-sky-300 hover:text-sky-200">
                  {t("auth.register.button")}
                </Link>
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
