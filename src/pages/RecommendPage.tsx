import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Target, Flame, BookOpen, Mic, Headphones, Pen } from "lucide-react";
import PageShell from "../components/PageShell";
import { GlassCard } from "../components/GlassCard";
import { useAuthStore } from "../store/authStore";
import { useProgressStore } from "../store/progressStore";
import { COURSES } from "../data/courses";
import { getLanguage } from "../data/languages";
import type { UserProgress } from "../types";

const EMPTY_MODULE: UserProgress["moduleScores"] = {};

interface Step {
  icon: React.ElementType;
  title: string;
  reason: string;
  minutes: number;
  color: string;
  target: string;
}

export default function RecommendPage() {
  const currentUserId = useAuthStore((s) => s.currentUserId);
  const users = useAuthStore((s) => s.users);
  const user = useMemo(() => users.find((u) => u.id === currentUserId) ?? null, [users, currentUserId]);
  const progressMap = useProgressStore((s) => s.progressMap);
  const moduleScores = useMemo(
    () => (currentUserId ? (progressMap[currentUserId]?.moduleScores ?? EMPTY_MODULE) : EMPTY_MODULE),
    [progressMap, currentUserId]
  );

  const scores = moduleScores;
  const entries = Object.entries(scores) as [keyof typeof scores, number][];
  // sorted ascending - weakest first
  const sorted = entries.sort(([, a], [, b]) => (a ?? 0) - (b ?? 0));

  const steps: Step[] = useMemo(() => {
    const iconFor: Record<string, React.ElementType> = {
      words: BookOpen,
      grammar: Pen,
      listening: Headphones,
      speaking: Mic,
    };
    const titleFor: Record<string, string> = {
      words: "单词弱 → 闪卡加强训练",
      grammar: "语法弱 → 选择与填空练习",
      listening: "听力弱 → 每日听写 5 分钟",
      speaking: "开口少 → 每日跟读 5 句",
    };
    const colorFor: Record<string, string> = {
      words: "from-sky-400 to-blue-600",
      grammar: "from-fuchsia-400 to-purple-600",
      listening: "from-amber-400 to-orange-500",
      speaking: "from-rose-400 to-pink-600",
    };
    const out: Step[] = sorted.slice(0, 3).map(([key, value]) => ({
      icon: iconFor[key],
      title: titleFor[key],
      reason: `当前该模块得分 ${Math.max(15, value)} / 100 · 建议优先加强`,
      minutes: 10 + Math.round((100 - (value ?? 0)) / 10),
      color: colorFor[key],
      target: key,
    }));
    if (out.length === 0) {
      out.push({
        icon: BookOpen,
        title: "综合训练计划",
        reason: "从单词到口语，每天 30 分钟稳步提升。",
        minutes: 30,
        color: "from-sky-400 to-fuchsia-500",
        target: "words",
      });
    }
    return out;
  }, [sorted]);

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
                你离下一个等级只差{" "}
                <span className="bg-gradient-to-r from-amber-300 to-rose-400 bg-clip-text text-transparent">
                  这几步
                </span>
              </h2>
              <p className="mt-2 max-w-lg text-sm text-brand-200/70">
                建议顺序：弱项优先 → 模块巩固 → 综合挑战。
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-xs text-brand-200/60">当前级别</div>
                <div className="font-display text-3xl font-bold text-white">Lv.{user?.level ?? 1}</div>
              </div>
              <div>
                <div className="text-xs text-brand-200/60">学习连续</div>
                <div className="flex items-center gap-1 font-display text-3xl font-bold text-white">
                  <Flame className="h-6 w-6 text-orange-400" /> {user?.streak ?? 0}
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
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <GlassCard key={idx} className="relative">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-xs text-brand-200/60">步骤 {idx + 1}</div>
                <div className="text-xs text-brand-200/60">{s.minutes} 分钟</div>
              </div>
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} text-white shadow-lg`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-white">{s.title}</h3>
              <p className="mt-1 text-sm text-brand-200/70">{s.reason}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs text-brand-100">
                  <Target className="h-3.5 w-3.5" /> 优先度 {idx === 0 ? "最高" : "中等"}
                </span>
                <Link
                  to="/learn"
                  className="inline-flex items-center gap-1 text-sm text-sky-300 hover:text-sky-200"
                >
                  开始 <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </GlassCard>
          );
        })}
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
            <Link
              key={c.id}
              to="/learn"
              className="glass group overflow-hidden rounded-2xl transition hover:-translate-y-1"
            >
              <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
                <span className="text-6xl drop-shadow">{c.cover}</span>
                <span className="absolute left-3 top-3 rounded-full bg-white/10 px-2 py-1 text-[10px] text-white backdrop-blur">
                  {c.level}
                </span>
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
