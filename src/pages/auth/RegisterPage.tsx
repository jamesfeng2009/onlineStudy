import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, UserCircle, ArrowRight, Sparkles } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { LANGUAGES } from "../../data/languages";
import type { Language } from "../../types";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lang, setLang] = useState<Language>("en");
  const [err, setErr] = useState("");
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!username.trim() || !email.trim() || password.length < 4) {
      setErr("请填写用户名和邮箱，密码至少 4 位");
      return;
    }
    const res = register({ username, email, password, language: lang });
    if (!res.ok) {
      setErr(res.error ?? "注册失败");
      return;
    }
    navigate("/");
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute -top-32 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-500/40 via-fuchsia-500/30 to-orange-400/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-8">
        <div className="hidden md:block">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-100">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" /> 沉浸式学语言
          </div>
          <h1 className="font-display text-5xl font-bold leading-tight text-white">
            让整个世界
            <span className="block bg-gradient-to-r from-sky-300 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
              都成为你的课堂。
            </span>
          </h1>
          <p className="mt-4 max-w-md text-brand-200/80">
            注册一个账号，开启个性化分级学习路径，跟踪你的进步，与全球学习者一起成长。
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {LANGUAGES.map((l) => (
              <div
                key={l.id}
                className={
                  "glass flex items-center justify-between rounded-xl px-3 py-4 " +
                  (lang === l.id ? "ring-2 ring-sky-400/50" : "")
                }
                onClick={() => setLang(l.id)}
              >
                <div>
                  <div className="text-2xl">{l.flag}</div>
                  <div className="mt-2 text-sm text-white">{l.name}</div>
                  <div className="text-[10px] text-brand-200/60">{l.native}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-8 md:p-10">
          <h2 className="font-display text-2xl font-bold text-white">创建你的账号</h2>
          <p className="mt-1 text-sm text-brand-200/70">几秒钟即可开始学习</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <Field
              icon={<UserCircle className="h-4 w-4" />}
              label="用户名"
              value={username}
              onChange={setUsername}
              placeholder="显示在社区和成就墙"
            />
            <Field
              icon={<Mail className="h-4 w-4" />}
              label="邮箱"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
            />
            <Field
              icon={<Lock className="h-4 w-4" />}
              label="密码"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="至少 4 位"
            />

            <div className="md:hidden">
              <div className="mb-2 text-xs text-brand-200/70">你最想学的语言</div>
              <div className="grid grid-cols-3 gap-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLang(l.id)}
                    className={
                      "rounded-xl border px-2 py-3 text-xs transition " +
                      (lang === l.id
                        ? "border-sky-400/60 bg-sky-400/10 text-white"
                        : "border-white/10 bg-white/5 text-brand-100 hover:bg-white/10")
                    }
                  >
                    <div className="text-xl">{l.flag}</div>
                    <div className="mt-1">{l.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {err && (
              <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">
                {err}
              </div>
            )}

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 via-fuchsia-400 to-amber-300 px-5 py-3 font-semibold text-slate-900 shadow-lg shadow-fuchsia-500/30 transition hover:-translate-y-0.5 hover:shadow-fuchsia-500/50"
            >
              立即注册 <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>

            <div className="text-center text-sm text-brand-200/70">
              已经有账号？{" "}
              <Link to="/login" className="text-sky-300 hover:text-sky-200">
                前往登录
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-brand-200/80">{label}</span>
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 transition focus-within:border-sky-400/60 focus-within:bg-white/10">
        <span className="text-brand-200/70">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-white placeholder:text-brand-200/40 outline-none"
        />
      </div>
    </label>
  );
}
