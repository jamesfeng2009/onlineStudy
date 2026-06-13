import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const res = login(email, password);
    if (!res.ok) {
      setErr(res.error ?? "登录失败");
      return;
    }
    navigate("/");
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute -top-32 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-500/40 via-fuchsia-500/30 to-orange-400/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-8">
        <div className="order-2 md:order-1">
          <div className="glass rounded-3xl p-8 md:p-10">
            <h2 className="font-display text-2xl font-bold text-white">欢迎回来 👋</h2>
            <p className="mt-1 text-sm text-brand-200/70">登录继续你的沉浸式学习之旅</p>

            <form onSubmit={submit} className="mt-8 space-y-4">
              <div>
                <span className="text-xs font-medium text-brand-200/80">邮箱</span>
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
                <span className="text-xs font-medium text-brand-200/80">密码</span>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 transition focus-within:border-sky-400/60 focus-within:bg-white/10">
                  <Lock className="h-4 w-4 text-brand-200/70" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="至少 4 位"
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
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 via-fuchsia-400 to-amber-300 px-5 py-3 font-semibold text-slate-900 shadow-lg shadow-fuchsia-500/30 transition hover:-translate-y-0.5 hover:shadow-fuchsia-500/50"
              >
                登录 <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>

              <div className="text-center text-sm text-brand-200/70">
                还没有账号？{" "}
                <Link to="/register" className="text-sky-300 hover:text-sky-200">
                  立即注册
                </Link>
              </div>
            </form>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-brand-200/80">
              <div className="mb-1 font-semibold text-white">演示账号</div>
              <div>随便输入任何注册过的邮箱 + 密码，或先去注册页面新建一个即可。</div>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-100">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" /> LinguaVerse
          </div>
          <h1 className="font-display text-5xl font-bold leading-tight text-white md:text-6xl">
            用你自己的节奏
            <span className="block bg-gradient-to-r from-sky-300 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
              征服一门新语言。
            </span>
          </h1>
          <p className="mt-4 max-w-md text-brand-200/80">
            分级课程、互动练习、社区激励——把学习变成一种习惯，而不是任务。
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              { t: "分级课程体系", d: "从入门到精通", c: "from-sky-400/20 to-sky-500/0" },
              { t: "多语种支持", d: "英语 · 日语 · 韩语", c: "from-fuchsia-400/20 to-fuchsia-500/0" },
              { t: "个性化路径", d: "基于数据的智能推荐", c: "from-amber-400/20 to-amber-500/0" },
              { t: "成就激励", d: "徽章 · 等级 · 积分", c: "from-rose-400/20 to-rose-500/0" },
            ].map((f, i) => (
              <div
                key={i}
                className={`rounded-2xl border border-white/10 bg-gradient-to-br ${f.c} p-4 backdrop-blur`}
              >
                <div className="text-sm font-semibold text-white">{f.t}</div>
                <div className="mt-1 text-xs text-brand-200/70">{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
