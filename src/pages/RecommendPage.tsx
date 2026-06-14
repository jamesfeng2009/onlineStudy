import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Flame, BookOpen, Mic, Pen, Target } from "lucide-react";
import PageShell from "../components/PageShell";
import { GlassCard } from "../components/GlassCard";
import { useAuthStore } from "../store/authStore";
import { useProgressStore } from "../store/progressStore";
import { COURSES } from "../data/courses";
import { getLanguage } from "../data/languages";

export default function RecommendPage() {
  const user = useAuthStore((s) => s.user);
  const progress = useProgressStore((s) => s.progress);
  const refresh = useProgressStore((s) => s.refresh);
  const moduleScores = progress?.moduleScores ?? {};

  const entries = Object.entries(moduleScores).sort(([, a], [, b]) => a - b);

  const iconFor: Record<string, React.ElementType> = {
    words: BookOpen,
    grammar: Pen,
    listening: Target,
    speaking: Mic,
  };
  const titleFor: Record<string, string> = {
    words: "闪卡记忆加强训练",
    grammar: "语法题库强化",
    listening: "每日听力练习",
    speaking: "口语跟读训练",
  };

  const language = user?.targetLanguage ?? "en";
  const recommendedCourses = COURSES.filter((c) => c.language === language).slice(0, 4);

  return (
    <PageShell
      title="个性化学习路径"
      subtitle="基于你最近的练习数据与目标语言，为你定制今天的提升路径。"
    >
      <div className="glass mb-8 overflow-hidden rounded-3xl">
        <div className="relative p-6 md:p-10">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="relative flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-100">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" /> 今日推荐路径
              </div>
              <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
                {user
                  ? `${user.username}，让我们巩固薄弱环节吧`
                  : "让学习有方向，不迷茫"}
              </h2>
              <p className="mt-2 max-w-lg text-sm text-brand-200/70">
                按弱项 → 强化 → 综合挑战的顺序，逐步提高各模块得分。
              </p>
              <button
                onClick={() => user && refresh()}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-brand-100 hover:bg-white/10"
              >
                刷新最新数据 <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-xs text-brand-200/60">当前级别</div>
                <div className="font-display text-3xl font-bold text-white">
                  Lv.{user?.level ?? progress?.level ?? 1}
                </div>
              </div>
              <div>
                <div className="text-xs text-brand-200/60">连续学习</div>
                <div className="flex items-center gap-1 font-display text-3xl font-bold text-white">
                  <Flame className="h-6 w-6 text-orange-400" />
                  {user?.streak ?? progress?.streak ?? 0}
                </div>
              </div>
              <div>
                <div className="text-xs text-brand-200/60">目标语言</div>
                <div className="font-display text-3xl font-bold text-white">
                  {getLanguage(language).flag} {getLanguage(language).name}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {entries.length > 0
          ? entries.map(([key, value], idx) => {
              const Icon = iconFor[key] ?? BookOpen;
              return (
                <Link to="/learn" key={key}>
                  <GlassCard className="relative h-full transition hover:-translate-y-0.5">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-xs text-brand-200/60">步骤 {idx + 1}</div>
                      <div className="text-xs text-brand-200/60">建议 10 + {Math.round((100 - value) / 10)} 分钟</div>
                    </div>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-fuchsia-500 text-white shadow-lg">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-display text-xl font-bold text-white">{titleFor[key] || `${key} 模块训练`}</h3>
                    <p className="mt-1 text-sm text-brand-200/70">当前该模块得分 {Math.max(15, value)} / 100 · 建议优先加强</p>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs text-brand-100">
                        <Target className="h-3.5 w-3.5" /> 优先度 {idx === 0 ? "最高" : idx === 1 ? "中等" : "较低"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm text-sky-300">
                        开始学习 <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </GlassCard>
                </Link>
              );
            })
          : [
              { t: "闪卡词汇入门", d: "从零开始建立第一套词汇库", c: "from-sky-400 to-blue-600", i: BookOpen },
              { t: "基础语法训练", d: "掌握语言结构的基础规则", c: "from-fuchsia-400 to-purple-600", i: Pen },
              { t: "日常会话入门", d: "跟读者最常用的口语表达", c: "from-amber-400 to-orange-500", i: Mic },
            ].map((item, idx) => (
              <Link to="/learn" key={item.t}>
                <GlassCard className="relative h-full transition hover:-translate-y-0.5">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-xs text-brand-200/60">步骤 {idx + 1}</div>
                    <div className="text-xs text-brand-200/60">建议 10 分钟</div>
                  </div>
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.c} text-white shadow-lg`}>
                    <item.i className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-white">{item.t}</h3>
                  <p className="mt-1 text-sm text-brand-200/70">{item.d}</p>
                </GlassCard>
              </Link>
            ))}
      </div>

      {/* Recommended courses */}
      <div className="mt-12">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-white md:text-2xl">
              推荐课程 · {getLanguage(language).flag} {getLanguage(language).name}
            </h2>
            <p className="mt-1 text-sm text-brand-200/70">按分级体系精选，系统化学习不迷路。</p>
          </div>
          <Link to="/courses" className="text-sm text-sky-300 hover:text-sky-200">
            浏览全部课程 →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {recommendedCourses.map((c) => (
            <Link to="/learn" key={c.id} className="glass group overflow-hidden rounded-2xl transition hover:-translate-y-1">
              <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
                <span className="text-6xl drop-shadow">{c.cover}</span>
              </div>
              <div className="p-5">
                <div className="font-semibold text-white">{c.title}</div>
                <div className="mt-1 text-xs text-brand-200/70">{c.description}</div>
                <div className="mt-4 text-xs text-sky-300 group-hover:text-sky-200">加入学习计划 →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
