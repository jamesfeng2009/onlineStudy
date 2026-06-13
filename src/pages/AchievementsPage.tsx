import { Flame, Trophy, Sparkles, BookOpen, Pen, Mic, Headphones, Crown, Target, Zap, BookMarked } from "lucide-react";
import PageShell from "../components/PageShell";
import { GlassCard } from "../components/GlassCard";
import { useAuthStore } from "../store/authStore";
import { useProgressStore } from "../store/progressStore";

const BADGES: {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  check: (ctx: AchievementContext) => { earned: boolean; progress: number; total: number };
}[] = [
  {
    id: "streak-3",
    title: "三日坚持",
    description: "连续学习 3 天，养成小习惯",
    icon: Flame,
    color: "from-orange-400 to-rose-500",
    check: (ctx) => ({ earned: ctx.streak >= 3, progress: Math.min(ctx.streak, 3), total: 3 }),
  },
  {
    id: "streak-7",
    title: "一周之星",
    description: "连续学习 7 天",
    icon: Zap,
    color: "from-amber-300 to-orange-500",
    check: (ctx) => ({ earned: ctx.streak >= 7, progress: Math.min(ctx.streak, 7), total: 7 }),
  },
  {
    id: "streak-30",
    title: "月度冠军",
    description: "连续学习 30 天",
    icon: Trophy,
    color: "from-yellow-300 to-amber-500",
    check: (ctx) => ({ earned: ctx.streak >= 30, progress: Math.min(ctx.streak, 30), total: 30 }),
  },
  {
    id: "words-20",
    title: "词汇新星",
    description: "掌握 20 个新单词",
    icon: BookOpen,
    color: "from-sky-400 to-blue-600",
    check: (ctx) => ({
      earned: ctx.wordsLearned >= 20,
      progress: Math.min(ctx.wordsLearned, 20),
      total: 20,
    }),
  },
  {
    id: "words-100",
    title: "词汇达人",
    description: "掌握 100 个新单词",
    icon: BookMarked,
    color: "from-cyan-400 to-teal-600",
    check: (ctx) => ({
      earned: ctx.wordsLearned >= 100,
      progress: Math.min(ctx.wordsLearned, 100),
      total: 100,
    }),
  },
  {
    id: "quizzes-10",
    title: "语法练习生",
    description: "完成 10 道语法题",
    icon: Pen,
    color: "from-emerald-400 to-green-600",
    check: (ctx) => ({
      earned: ctx.quizzesDone >= 10,
      progress: Math.min(ctx.quizzesDone, 10),
      total: 10,
    }),
  },
  {
    id: "quizzes-50",
    title: "语法大师",
    description: "完成 50 道语法题",
    icon: Sparkles,
    color: "from-lime-400 to-emerald-600",
    check: (ctx) => ({
      earned: ctx.quizzesDone >= 50,
      progress: Math.min(ctx.quizzesDone, 50),
      total: 50,
    }),
  },
  {
    id: "speaking-10",
    title: "开口勇者",
    description: "口语跟读累计 10 分钟",
    icon: Mic,
    color: "from-rose-400 to-pink-600",
    check: (ctx) => ({
      earned: ctx.speakingMinutes >= 10,
      progress: Math.min(ctx.speakingMinutes, 10),
      total: 10,
    }),
  },
  {
    id: "listening-10",
    title: "聆听者",
    description: "听力训练累计 10 分钟",
    icon: Headphones,
    color: "from-violet-400 to-purple-600",
    check: (ctx) => ({
      earned: ctx.listeningMinutes >= 10,
      progress: Math.min(ctx.listeningMinutes, 10),
      total: 10,
    }),
  },
  {
    id: "level-5",
    title: "步步进阶",
    description: "达到等级 5",
    icon: Target,
    color: "from-fuchsia-400 to-rose-600",
    check: (ctx) => ({
      earned: ctx.level >= 5,
      progress: Math.min(ctx.level, 5),
      total: 5,
    }),
  },
  {
    id: "level-10",
    title: "登堂入室",
    description: "达到等级 10",
    icon: Crown,
    color: "from-amber-300 to-yellow-500",
    check: (ctx) => ({
      earned: ctx.level >= 10,
      progress: Math.min(ctx.level, 10),
      total: 10,
    }),
  },
];

interface AchievementContext {
  streak: number;
  wordsLearned: number;
  quizzesDone: number;
  speakingMinutes: number;
  listeningMinutes: number;
  level: number;
}

export default function AchievementsPage() {
  const user = useAuthStore((s) => s.currentUser());
  const progress = useProgressStore((s) => s.getForCurrent());

  const ctx: AchievementContext = {
    streak: user?.streak ?? 0,
    wordsLearned: progress.wordsLearned,
    quizzesDone: progress.quizzesDone,
    speakingMinutes: progress.speakingMinutes,
    listeningMinutes: progress.listeningMinutes,
    level: user?.level ?? 0,
  };

  const earnedCount = BADGES.reduce((acc, b) => acc + (b.check(ctx).earned ? 1 : 0), 0);

  return (
    <PageShell
      title="成就系统"
      subtitle="每一次坚持都值得被看见。"
    >
      {/* Hero */}
      <div className="glass relative mb-8 overflow-hidden rounded-3xl p-6 md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
        <div className="relative grid grid-cols-1 items-center gap-6 md:grid-cols-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-100">
              <Trophy className="h-3.5 w-3.5 text-amber-300" /> 成就墙
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold text-white md:text-4xl">
              解锁 {earnedCount} / {BADGES.length} 个徽章
            </h2>
            <p className="mt-2 text-sm text-brand-200/70">
              完成系统判定的学习里程碑，获得荣誉徽章，记录你的每一次成长。
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-300 via-rose-400 to-fuchsia-500"
                style={{ width: `${Math.round((earnedCount / BADGES.length) * 100)}%` }}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { l: "连续天数", v: ctx.streak, u: "天", c: "text-orange-300" },
                { l: "等级", v: ctx.level, u: "Lv.", c: "text-amber-300" },
                { l: "累计单词", v: ctx.wordsLearned, u: "词", c: "text-sky-300" },
                { l: "练习答题", v: ctx.quizzesDone, u: "题", c: "text-fuchsia-300" },
              ].map((x, i) => (
                <GlassCard key={i} className="p-4">
                  <div className="text-xs text-brand-200/70">{x.l}</div>
                  <div className={"mt-1 font-display text-2xl font-bold " + x.c}>
                    {x.v} <span className="text-sm text-white/60">{x.u}</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Badges grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {BADGES.map((b) => {
          const Icon = b.icon;
          const { earned, progress, total } = b.check(ctx);
          const pct = Math.round((progress / total) * 100);
          return (
            <GlassCard
              key={b.id}
              className={
                earned
                  ? "ring-1 ring-amber-300/40 shadow-[0_0_40px_-10px] shadow-amber-500/30"
                  : "opacity-90"
              }
            >
              <div className="flex items-start justify-between">
                <div
                  className={
                    "inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br " +
                    (earned ? b.color + " text-white shadow-lg" : "bg-white/10 text-white/60")
                  }
                >
                  <Icon className="h-7 w-7" />
                </div>
                {earned && (
                  <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium text-amber-200">
                    已解锁
                  </span>
                )}
              </div>
              <div className="mt-4 font-display text-lg font-semibold text-white">
                {b.title}
              </div>
              <div className="mt-1 text-xs text-brand-200/70">{b.description}</div>
              <div className="mt-4">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className={
                      "h-full rounded-full " +
                      (earned
                        ? "bg-gradient-to-r from-amber-300 to-rose-400"
                        : "bg-gradient-to-r from-sky-400 to-fuchsia-400")
                    }
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-1 text-right text-[11px] text-brand-200/60">
                  {progress} / {total}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </PageShell>
  );
}
