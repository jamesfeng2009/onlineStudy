import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Flame,
  BookOpen,
  Headphones,
  Mic,
  Pen,
  Trophy,
  Target,
  Zap,
} from "lucide-react";
import PageShell from "../components/PageShell";
import { StatTile, GlassCard } from "../components/GlassCard";
import { LANGUAGES } from "../data/languages";
import { COURSES } from "../data/courses";
import { useAuthStore } from "../store/authStore";
import { useProgressStore } from "../store/progressStore";
import { getLanguage } from "../data/languages";
import type { Language } from "../types";

export default function HomePage() {
  const user = useAuthStore((s) => s.currentUser());
  const setLang = useAuthStore((s) => s.setLanguage);
  const progress = useProgressStore((s) => s.getForCurrent());
  const today = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);
  const minutesToday = progress.perDay[today] ?? 0;
  const goal = user?.goalMinutesPerDay ?? 30;
  const pctGoal = Math.min(100, Math.round((minutesToday / goal) * 100));
  const navigate = useNavigate();

  const featured = COURSES.slice(0, 4);

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-500/30 via-fuchsia-500/20 to-amber-400/20 blur-3xl" />
        </div>
        <div className="relative grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-100">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" /> 沉浸式多语种学习平台
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white md:text-6xl">
              今天，让世界
              <span className="block bg-gradient-to-r from-sky-300 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
                多一种说母语的方式。
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-brand-200/80">
              {user ? (
                <>
                  欢迎回来，<span className="text-white">{user.username}</span>
                  ！你今天已学习 <b className="text-sky-300">{minutesToday}</b> 分钟，目标{" "}
                  {goal} 分钟。继续加油！
                </>
              ) : (
                <>选择一门你想征服的语言，从今天开始建立属于你的学习习惯。</>
              )}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/learn"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 via-fuchsia-400 to-amber-300 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-fuchsia-500/30 transition hover:-translate-y-0.5 hover:shadow-fuchsia-500/50"
              >
                开始今日学习 <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                浏览课程
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <StatTile label="连续天数" value={user ? `${user.streak}` : "—"} icon={<Flame className="h-5 w-5 text-orange-400" />} />
              <StatTile label="等级" value={user ? `Lv.${user.level}` : "—"} icon={<Trophy className="h-5 w-5 text-amber-300" />} />
              <StatTile
                label="今日目标"
                value={`${pctGoal}%`}
                icon={<Target className="h-5 w-5 text-sky-300" />}
                hint={`${minutesToday}/${goal} 分钟`}
              />
            </div>
          </div>

          {/* 语言卡片 carousel */}
          <div className="relative">
            <div className="mb-3 flex items-center justify-between text-xs text-brand-200/70">
              <span>选择你正在学习的语言</span>
              {user && <span>当前：{getLanguage(user.targetLanguage).name}</span>}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {LANGUAGES.map((l, i) => {
                const active = user?.targetLanguage === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => {
                      if (user) setLang(l.id);
                      else navigate("/register");
                    }}
                    className={`glass group relative overflow-hidden rounded-2xl p-5 text-left transition hover:-translate-y-1 ${
                      active ? "ring-2 ring-sky-400/60" : ""
                    }`}
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
                    <div className="text-4xl">{l.flag}</div>
                    <div className="mt-4 font-display text-xl font-bold text-white">{l.name}</div>
                    <div className="text-xs text-brand-200/70">{l.native}</div>
                    <div className="mt-3 text-xs text-brand-200/60">{l.tagline}</div>
                    <div className="mt-4 inline-flex items-center text-xs text-sky-300 transition group-hover:text-sky-200">
                      {active ? "当前语言" : "点击选择"} <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 今日任务 */}
            <GlassCard className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Zap className="h-4 w-4 text-amber-300" /> 今日推荐
                </div>
                <Link to="/recommend" className="text-xs text-sky-300 hover:text-sky-200">
                  查看全部 →
                </Link>
              </div>
              <div className="grid gap-2">
                {[
                  { t: "记 20 个新单词", m: "10 分钟", i: BookOpen, c: "from-sky-400/30" },
                  { t: "语法练习 · 基础时态", m: "15 分钟", i: Pen, c: "from-fuchsia-400/30" },
                  { t: "跟读一段对话", m: "8 分钟", i: Mic, c: "from-amber-400/30" },
                  { t: "听力 5 分钟", m: "5 分钟", i: Headphones, c: "from-rose-400/30" },
                ].map((x, i) => (
                  <Link
                    key={i}
                    to="/learn"
                    className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 transition hover:bg-white/5"
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${x.c} text-white`}>
                      <x.i className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-white">{x.t}</div>
                      <div className="text-xs text-brand-200/60">{x.m}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-brand-200/50" />
                  </Link>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
              四种核心练习，构筑完整的语言能力
            </h2>
            <p className="mt-1 text-sm text-brand-200/70">输入 · 输出 · 反馈，构建真正能说出口的自信。</p>
          </div>
          <Link to="/learn" className="hidden text-sm text-sky-300 hover:text-sky-200 md:block">
            进入学习 →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { t: "闪卡记单词", d: "基于间隔记忆，记住就是记住了", i: BookOpen, c: "from-sky-400 to-blue-600" },
            { t: "语法练习", d: "即时反馈 + 答案解析，规则清晰易懂", i: Pen, c: "from-fuchsia-400 to-purple-600" },
            { t: "口语跟读", d: "读出来，让你的舌头形成肌肉记忆", i: Mic, c: "from-amber-400 to-orange-500" },
            { t: "听力训练", d: "真实语境，填空练习，越听越清楚", i: Headphones, c: "from-rose-400 to-pink-600" },
          ].map((f, i) => (
            <Link to="/learn" key={i} className="glass group rounded-2xl p-5 transition hover:-translate-y-1">
              <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.c} text-white shadow-lg`}>
                <f.i className="h-5 w-5" />
              </div>
              <div className="mt-4 font-semibold text-white">{f.t}</div>
              <div className="mt-1 text-sm text-brand-200/70">{f.d}</div>
              <div className="mt-4 inline-flex text-xs text-sky-300 group-hover:text-sky-200">
                去试一试 <ArrowRight className="ml-1 h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured courses */}
      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">精选课程</h2>
            <p className="mt-1 text-sm text-brand-200/70">系统分级 · 循序渐进 · 适配多种学习目标</p>
          </div>
          <Link to="/courses" className="text-sm text-sky-300 hover:text-sky-200">
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((c) => (
            <Link to="/courses" key={c.id} className="glass group overflow-hidden rounded-2xl transition hover:-translate-y-1">
              <div className="relative h-32 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center">
                <span className="text-6xl drop-shadow">{c.cover}</span>
                <span className="absolute left-3 top-3 rounded-full bg-white/10 px-2 py-1 text-[10px] text-white backdrop-blur">
                  {c.level}
                </span>
                <span className="absolute right-3 top-3 rounded-full bg-white/10 px-2 py-1 text-[10px] text-white backdrop-blur">
                  {getLanguage(c.language as Language).name}
                </span>
              </div>
              <div className="p-5">
                <div className="font-semibold text-white">{c.title}</div>
                <div className="mt-1 line-clamp-2 text-xs text-brand-200/70">{c.description}</div>
                <div className="mt-3 flex items-center justify-between text-xs text-brand-200/60">
                  <span>{c.lessons} 课时</span>
                  <span>{c.minutes} 分钟</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
