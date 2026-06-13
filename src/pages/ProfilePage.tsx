import { useState } from "react";
import { UserCircle2, Globe2, Target, LogOut, Check } from "lucide-react";
import PageShell from "../components/PageShell";
import { GlassCard } from "../components/GlassCard";
import { useAuthStore } from "../store/authStore";
import { useProgressStore } from "../store/progressStore";
import { LANGUAGES } from "../data/languages";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.currentUser());
  const users = useAuthStore((s) => s.users);
  const updateUser = useAuthStore((s) => s.updateUser);
  const logout = useAuthStore((s) => s.logout);
  const progress = useProgressStore((s) => s.getForCurrent());

  const [username, setUsername] = useState(user?.username ?? "");
  const [goal, setGoal] = useState(user?.goalMinutesPerDay ?? 30);
  const [lang, setLang] = useState(user?.targetLanguage ?? "en");
  const [savedMsg, setSavedMsg] = useState("");

  if (!user) {
    return (
      <PageShell title="我的">
        <GlassCard className="p-10 text-center">
          <UserCircle2 className="mx-auto h-10 w-10 text-brand-200/60" />
          <div className="mt-4 text-white">请先登录以查看个人信息。</div>
        </GlassCard>
      </PageShell>
    );
  }

  const save = () => {
    updateUser({
      username: username.trim() || user.username,
      targetLanguage: lang,
      goalMinutesPerDay: Number(goal) || 30,
    });
    setSavedMsg("已保存 ✓");
    window.setTimeout(() => setSavedMsg(""), 2000);
  };

  return (
    <PageShell
      title="个人中心"
      subtitle="管理你的账户信息、学习目标与偏好。"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 左：卡片档案 */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-fuchsia-500 to-amber-400 text-2xl text-white shadow-lg shadow-fuchsia-500/20">
              {user.username.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="font-display text-xl font-bold text-white">{user.username}</div>
              <div className="text-xs text-brand-200/70">{user.email}</div>
              <div className="mt-2 text-xs text-brand-200/60">创建于 {user.createdAt}</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Info label="等级" value={`Lv. ${user.level}`} />
            <Info label="经验" value={`${user.exp} EXP`} />
            <Info label="连续学习" value={`${user.streak} 天`} />
            <Info label="累计单词" value={progress.wordsLearned + ""} />
            <Info label="语法练习" value={progress.quizzesDone + ""} />
            <Info label="口语/听力" value={`${progress.speakingMinutes + progress.listeningMinutes} 分`} />
          </div>

          <button
            onClick={logout}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-rose-200 transition hover:bg-rose-500/10"
          >
            <LogOut className="h-4 w-4" /> 退出当前账号
          </button>
        </GlassCard>

        {/* 中：设置 */}
        <GlassCard className="p-6 lg:col-span-2">
          <div className="text-sm font-semibold text-white">账户与偏好</div>
          <p className="mt-1 text-xs text-brand-200/70">修改后点击"保存"。</p>

          <div className="mt-6 grid gap-5">
            <Field label="昵称">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-sky-400/60"
              />
            </Field>

            <Field label="邮箱">
              <input
                value={user.email}
                disabled
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-brand-200/60 outline-none"
              />
            </Field>

            <Field label="目标语言">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLang(l.id)}
                    className={
                      "flex items-center justify-between rounded-xl border px-3 py-3 text-sm transition " +
                      (lang === l.id
                        ? "border-sky-400/50 bg-sky-400/10 text-white"
                        : "border-white/10 bg-white/5 text-brand-100 hover:bg-white/10")
                    }
                  >
                    <span className="flex items-center gap-2">
                      <Globe2 className="h-4 w-4" />
                      {l.flag} {l.name}
                    </span>
                    {lang === l.id && <Check className="h-4 w-4 text-sky-300" />}
                  </button>
                ))}
              </div>
            </Field>

            <Field label={`每日目标（${goal} 分钟）`}>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={10}
                  max={120}
                  step={5}
                  value={goal}
                  onChange={(e) => setGoal(Number(e.target.value))}
                  className="flex-1 accent-sky-400"
                />
                <span className="min-w-[60px] rounded-full bg-white/5 px-3 py-1 text-center text-xs text-brand-100">
                  {goal} 分钟
                </span>
              </div>
            </Field>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <span className="text-xs text-emerald-300">{savedMsg}</span>
            <button
              onClick={save}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
            >
              保存修改 <Target className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-xs uppercase tracking-wider text-brand-200/60">账号信息</div>
            <div className="mt-2 text-sm text-brand-100/90">
              本系统为纯前端演示版本，账户与学习数据保存在浏览器本地 (localStorage)。
              当前共有 {users.length} 个本地账户。
            </div>
          </div>
        </GlassCard>
      </div>
    </PageShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs font-medium text-brand-200/70">{label}</div>
      {children}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="text-[10px] uppercase tracking-wider text-brand-200/60">{label}</div>
      <div className="mt-1 font-display text-lg font-semibold text-white">{value}</div>
    </div>
  );
}
