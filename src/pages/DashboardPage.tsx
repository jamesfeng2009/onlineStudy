import { useMemo } from "react";
import PageShell from "../components/PageShell";
import { GlassCard, StatTile } from "../components/GlassCard";
import { LineChart, RadarChart, ProgressRing, HorizontalBar } from "../components/Charts";
import { Flame, Target, BookOpen, Headphones, Mic, Pen, Trophy, TrendingUp } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useProgressStore } from "../store/progressStore";
import { lastDays } from "../utils/utils";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.currentUser());
  const progress = useProgressStore((s) => s.getForCurrent());
  const addExp = useProgressStore((s) => s.addExp);

  const days = useMemo(() => lastDays(14), []);
  const lineData = useMemo(
    () => days.map((d) => ({ label: d.slice(5), value: progress.perDay[d] ?? 0 })),
    [days, progress]
  );
  const totalMinutes = lineData.reduce((a, b) => a + b.value, 0);

  const radarScores = [
    { label: "词汇", value: progress.moduleScores.words, icon: BookOpen },
    { label: "语法", value: progress.moduleScores.grammar, icon: Pen },
    { label: "听力", value: progress.moduleScores.listening, icon: Headphones },
    { label: "口语", value: progress.moduleScores.speaking, icon: Mic },
  ];

  const goalPct = Math.min(
    100,
    Math.round(((progress.perDay[new Date().toISOString().slice(0, 10)] ?? 0) / (user?.goalMinutesPerDay ?? 30)) * 100)
  );
  const levelPct = Math.min(100, Math.round(((user?.exp ?? 0) / Math.max(1, 50 + (user?.level ?? 1) * 50)) * 100));

  // fake bump to demonstrate state persistence on reload
  void addExp;

  return (
    <PageShell
      title="学习进度仪表盘"
      subtitle={user ? `你好 ${user.username}，这里是你的学习数据全景。` : "请先登录以查看你的学习进度。"}
    >
      {/* Top stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          label="连续学习"
          value={`${user?.streak ?? 0} 天`}
          icon={<Flame className="h-5 w-5 text-orange-400" />}
          hint="保持节奏，就是胜利。"
        />
        <StatTile
          label="累计单词"
          value={progress.wordsLearned}
          icon={<BookOpen className="h-5 w-5 text-sky-300" />}
          hint={`已答题 ${progress.wordTotal} 次`}
        />
        <StatTile
          label="语法练习"
          value={progress.quizzesDone}
          icon={<Pen className="h-5 w-5 text-fuchsia-300" />}
          hint={`正确率 ${progress.quizTotal ? Math.round((progress.quizCorrect / progress.quizTotal) * 100) : 0}%`}
        />
        <StatTile
          label="14 日累计"
          value={`${totalMinutes} 分`}
          icon={<TrendingUp className="h-5 w-5 text-emerald-300" />}
          hint={`平均 ${Math.round(totalMinutes / 14)} 分/天`}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Line chart */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white">最近 14 天学习时长</div>
              <div className="text-xs text-brand-200/60">单位：分钟 · 每日累计</div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-100">
              <Target className="h-3.5 w-3.5 text-sky-300" /> 今日目标
              {user ? ` ${user.goalMinutesPerDay} 分钟` : ""}
            </span>
          </div>
          <div className="mt-4">
            <LineChart data={lineData} />
          </div>
        </GlassCard>

        {/* Rings */}
        <GlassCard>
          <div className="text-sm font-semibold text-white">达成进度</div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <ProgressRing
                value={goalPct}
                centerLabel={`${goalPct}%`}
                centerHint="今日目标"
                color="#38BDF8"
              />
            </div>
            <div className="flex flex-col items-center">
              <ProgressRing
                value={levelPct}
                centerLabel={`Lv.${user?.level ?? 1}`}
                centerHint={`${user?.exp ?? 0} EXP`}
                color="#F59E0B"
              />
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <HorizontalBar
              items={radarScores.map((r) => ({ label: r.label, value: Math.max(20, r.value) }))}
            />
          </div>
        </GlassCard>
      </div>

      {/* Radar + Modules heatmap */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <GlassCard className="lg:col-span-2">
          <div className="text-sm font-semibold text-white">能力雷达</div>
          <div className="mt-2 text-xs text-brand-200/60">词汇 · 语法 · 听力 · 口语</div>
          <div className="mt-4 flex justify-center">
            <RadarChart
              labels={radarScores.map((x) => x.label)}
              values={radarScores.map((x) => Math.max(15, x.value))}
              size={320}
            />
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-white">模块表现 · 最近表现</div>
            <div className="text-xs text-brand-200/60">
              <Trophy className="mr-1 inline h-3.5 w-3.5 text-amber-300" /> 持续练习会让指标逐步上升
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {radarScores.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400/30 to-fuchsia-400/30 text-white">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{s.label}</div>
                    <div className="text-xs text-brand-200/60">练习得分</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-400 to-fuchsia-400"
                      style={{ width: `${Math.max(15, s.value)}%` }}
                    />
                  </div>
                  <div className="mt-2 text-right text-xs text-brand-200/60">
                    {Math.max(15, s.value)} / 100
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* 14 days grid */}
      <div className="mt-6">
        <GlassCard>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-white">14 天学习热力</div>
            <div className="text-xs text-brand-200/60">每格代表一天 · 颜色越深学习越久</div>
          </div>
          <div className="mt-4 grid grid-cols-14 gap-2">
            {days.map((d) => {
              const val = progress.perDay[d] ?? 0;
              const opacity = Math.min(1, 0.1 + val / 60);
              return (
                <div
                  key={d}
                  title={`${d} · ${val} 分钟`}
                  className="aspect-square rounded-md border border-white/5 text-[9px] text-brand-200/60"
                  style={{
                    background: `linear-gradient(135deg, rgba(56,189,248,${opacity}), rgba(217,70,239,${opacity}))`,
                  }}
                >
                  <div className="flex h-full flex-col items-center justify-center text-white/90">
                    <span>{d.slice(-2)}</span>
                    <span className="text-[9px] font-semibold">{val}m</span>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </PageShell>
  );
}
