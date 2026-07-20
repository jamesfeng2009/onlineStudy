import { useEffect, useState } from "react";
import { UserCircle2, Globe2, Target, LogOut, Check, Flame, Trophy, BookOpen, Monitor, MessageCircleQuestion } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import { GlassCard } from "../components/GlassCard";
import { useLocalePath } from "../components/LocaleLink";
import { useAuthStore } from "../store/authStore";
import { useProgressStore } from "../store/progressStore";
import { LANGUAGES, getLanguageDisplayName } from "../data/languages";
import { SUPPORTED_LANGUAGES, buildLocalePath, type SupportedLanguage } from "../lib/i18n";

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const logout = useAuthStore((s) => s.logout);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const progress = useProgressStore((s) => s.progress);
  const navigate = useNavigate();
  const loginPath = useLocalePath("/login");

  const [username, setUsername] = useState(user?.username ?? "");
  const [goal, setGoal] = useState<number>(user?.goalMinutesPerDay ?? 30);
  const [lang, setLang] = useState<string>(user?.targetLanguage ?? "en");
  const [uiLang, setUiLang] = useState<string>((user?.uiLanguage as string) ?? i18n.language ?? "en");
  const [nativeLang, setNativeLang] = useState<string>((user?.nativeLanguage as string) ?? "en");
  // 高级设置：默认隐藏"解释语言"选择器，跟随界面语言
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username ?? "");
      setGoal(user.goalMinutesPerDay ?? 30);
      setLang(user.targetLanguage ?? "en");
      setUiLang((user.uiLanguage as string) ?? i18n.language ?? "en");
      setNativeLang((user.nativeLanguage as string) ?? "en");
    }
  }, [user, i18n.language]);

  // 当界面语言变化时，自动同步解释语言（除非用户已展开高级设置手动改过）
  useEffect(() => {
    if (!showAdvanced) {
      setNativeLang(uiLang);
    }
  }, [uiLang, showAdvanced]);

  if (!user && status !== "loading") {
    return (
      <PageShell title={t("profile.title")}>
        <GlassCard className="p-10 text-center">
          <UserCircle2 className="mx-auto h-10 w-10 text-brand-200/60" />
          <div className="mt-4 text-white">
            <p>{t("profile.pleaseLogin")}</p>
            <button
              onClick={() => navigate(loginPath)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-fuchsia-500 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
            >
              {t("profile.goLogin")}
            </button>
          </div>
        </GlassCard>
      </PageShell>
    );
  }

  const save = async () => {
    setErr("");
    setLoading(true);
    const patch: Parameters<typeof updateProfile>[0] = {
      username: username.trim() || user?.username,
      targetLanguage: lang,
      goalMinutesPerDay: Number(goal) || 30,
      uiLanguage: uiLang,
      nativeLanguage: nativeLang,
    };
    const res = await updateProfile(patch);
    setLoading(false);
    if (!res.ok) {
      setErr(res.error ?? t("profile.saveFailed"));
      return;
    }
    i18n.changeLanguage(uiLang);
    const target = buildLocalePath(
      uiLang as SupportedLanguage,
      window.location.pathname
    );
    if (target !== window.location.pathname) {
      navigate(target);
    }
    setSavedMsg(t("profile.saved"));
    window.setTimeout(() => setSavedMsg(""), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <PageShell
      title={t("profile.title")}
      subtitle={t("profile.subtitle")}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 左：卡片档案 */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-fuchsia-500 to-amber-400 text-2xl text-white shadow-lg shadow-fuchsia-500/20">
              {user?.username?.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="font-display text-xl font-bold text-white">{user?.username}</div>
              <div className="text-xs text-brand-200/70">{user?.email}</div>
              <div className="mt-2 text-xs text-brand-200/60">{t("profile.createdAt", { date: user?.createdAt })}</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Info label={t("profile.info.streak")} value={`${user?.streak ?? 0} ${t("common.days")}`} />
            <Info label={t("profile.info.level")} value={`Lv.${user?.level ?? 1}`} />
            <Info label={t("profile.info.words")} value={progress ? `${progress.wordsLearned}` : "—"} />
            <Info label={t("profile.info.grammar")} value={progress ? `${progress.quizzesDone}` : "—"} />
            <Info
              label={t("profile.info.speaking")}
              value={progress ? `${progress.speakingMinutes} ${t("common.minutes")}` : "—"}
            />
            <Info
              label={t("profile.info.listening")}
              value={progress ? `${progress.listeningMinutes} ${t("common.minutes")}` : "—"}
            />
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-rose-200 transition hover:bg-rose-500/10"
          >
            <LogOut className="h-4 w-4" /> {t("profile.logout")}
          </button>
        </GlassCard>

        {/* 中：设置 */}
        <GlassCard className="p-6 lg:col-span-2">
          <div className="text-sm font-semibold text-white">{t("profile.settingsTitle")}</div>
          <p className="mt-1 text-xs text-brand-200/70">{t("profile.settingsHint")}</p>

          <div className="mt-6 grid gap-5">
            <Field label={t("profile.fields.nickname")}>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-sky-400/60"
              />
            </Field>

            <Field label={t("profile.fields.email")}>
              <input
                value={user?.email ?? ""}
                disabled
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-brand-200/60 outline-none"
              />
            </Field>

            <Field label={t("profile.fields.targetLanguage")}>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.id}
                    type="button"
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
                      {l.flag} {getLanguageDisplayName(l.id, i18n.language)}
                    </span>
                    {lang === l.id && <Check className="h-4 w-4 text-sky-300" />}
                  </button>
                ))}
              </div>
            </Field>

            <Field label={t("profile.fields.uiLanguage")}>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {SUPPORTED_LANGUAGES.map((id) => {
                  const l = LANGUAGES.find((x) => x.id === id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setUiLang(id)}
                      className={
                        "flex items-center justify-between rounded-xl border px-3 py-3 text-sm transition " +
                        (uiLang === id
                          ? "border-sky-400/50 bg-sky-400/10 text-white"
                          : "border-white/10 bg-white/5 text-brand-100 hover:bg-white/10")
                      }
                    >
                      <span className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        {l?.flag ?? "🌐"} {getLanguageDisplayName(id, i18n.language)}
                      </span>
                      {uiLang === id && <Check className="h-4 w-4 text-sky-300" />}
                    </button>
                  );
                })}
              </div>
            </Field>

            {/* 高级设置：默认折叠，展开后可单独设置解释语言（默认跟随界面语言） */}
            <Field label={t("profile.fields.advanced") ?? "高级设置"}>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-brand-100 transition hover:bg-white/10"
              >
                <span className="flex items-center gap-2">
                  <MessageCircleQuestion className="h-4 w-4" />
                  {showAdvanced
                    ? (t("profile.fields.nativeLanguage") ?? "解释语言")
                    : (t("profile.fields.advancedHint") ?? "默认跟随界面语言，展开可单独设置")}
                </span>
                <span className={`text-brand-200/70 transition-transform ${showAdvanced ? "rotate-180" : ""}`}>▼</span>
              </button>
              {showAdvanced && (
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {SUPPORTED_LANGUAGES.map((id) => {
                    const l = LANGUAGES.find((x) => x.id === id);
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setNativeLang(id)}
                        className={
                          "flex items-center justify-between rounded-xl border px-3 py-3 text-sm transition " +
                          (nativeLang === id
                            ? "border-fuchsia-400/50 bg-fuchsia-400/10 text-white"
                            : "border-white/10 bg-white/5 text-brand-100 hover:bg-white/10")
                        }
                      >
                        <span className="flex items-center gap-2">
                          {l?.flag ?? "🌐"} {getLanguageDisplayName(id, i18n.language)}
                        </span>
                        {nativeLang === id && <Check className="h-4 w-4 text-fuchsia-300" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </Field>

            <Field label={t("profile.fields.dailyGoal", { goal })}>
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
                  {goal} {t("common.minutes")}
                </span>
              </div>
            </Field>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs text-emerald-300">{savedMsg}</span>
              <span className="text-xs text-rose-300">{err}</span>
            </div>
            <button
              onClick={save}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading ? t("profile.saving") : <>{t("profile.save")} <Target className="h-4 w-4" /></>}
            </button>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-2 text-xs text-brand-200/70">
              <Flame className="h-4 w-4 text-orange-400" />
              <Trophy className="h-4 w-4 text-amber-300" />
              <BookOpen className="h-4 w-4 text-sky-300" />
              <span className="ml-1">{t("profile.bannerTitle")}</span>
            </div>
            <div className="mt-2 text-sm text-brand-100/90">
              {t("profile.bannerText")}
            </div>
          </div>
        </GlassCard>
      </div>
    </PageShell>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 text-xs font-medium text-brand-200/80">{label}</div>
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
