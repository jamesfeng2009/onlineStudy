import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Monitor, MessageCircleQuestion, Globe2, Check, Target } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageShell from "../components/PageShell";
import { GlassCard } from "../components/GlassCard";
import { useAuthStore } from "../store/authStore";
import { LANGUAGES } from "../data/languages";
import { SUPPORTED_LANGUAGES, buildLocalePath, type SupportedLanguage } from "../lib/i18n";

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [uiLang, setUiLang] = useState<string>(user?.uiLanguage ?? i18n.language ?? "en");
  const [nativeLang, setNativeLang] = useState<string>(user?.nativeLanguage ?? "en");
  const [savedMsg, setSavedMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUiLang((user.uiLanguage as string) ?? i18n.language ?? "en");
      setNativeLang((user.nativeLanguage as string) ?? "en");
    }
  }, [user, i18n.language]);

  const save = async () => {
    setErr("");
    setLoading(true);
    const res = await updateProfile({
      uiLanguage: uiLang,
      nativeLanguage: nativeLang,
    });
    setLoading(false);
    if (!res.ok) {
      setErr(res.error ?? t("settings.saveFailed"));
      return;
    }
    // Persisted UI language should match the URL locale.  We jump to the
    // URL that corresponds to the new language, keeping the user on the
    // same page otherwise.
    i18n.changeLanguage(uiLang);
    const target = buildLocalePath(
      uiLang as SupportedLanguage,
      window.location.pathname
    );
    if (target !== window.location.pathname) {
      navigate(target);
    }
    setSavedMsg(t("settings.saved"));
    window.setTimeout(() => setSavedMsg(""), 2000);
  };

  return (
    <PageShell title={t("settings.title")} subtitle={t("settings.subtitle")}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
              <Monitor className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{t("settings.interface")}</div>
              <div className="text-xs text-brand-200/70">{t("settings.interfaceDesc")}</div>
            </div>
          </div>
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
                    {l?.flag ?? "🌐"} {l?.native ?? id}
                  </span>
                  {uiLang === id && <Check className="h-4 w-4 text-sky-300" />}
                </button>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-400/10 text-fuchsia-300">
              <MessageCircleQuestion className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{t("settings.native")}</div>
              <div className="text-xs text-brand-200/70">{t("settings.nativeDesc")}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
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
                    {l?.flag ?? "🌐"} {l?.native ?? id}
                  </span>
                  {nativeLang === id && <Check className="h-4 w-4 text-fuchsia-300" />}
                </button>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
              <Globe2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{t("settings.target")}</div>
              <div className="text-xs text-brand-200/70">{t("settings.targetDesc")}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {LANGUAGES.map((l) => (
              <div
                key={l.id}
                className={
                  "flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-sm " +
                  (user?.targetLanguage === l.id
                    ? "border-amber-400/50 bg-amber-400/10 text-white"
                    : "border-white/10 bg-white/5 text-brand-100")
                }
              >
                <span className="text-2xl">{l.flag}</span>
                <span>{l.native}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-brand-200/50">{t("profile.settingsHint")}</p>
        </GlassCard>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center gap-3">
          <span className="text-xs text-emerald-300">{savedMsg}</span>
          <span className="text-xs text-rose-300">{err}</span>
        </div>
        <button
          onClick={save}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {loading ? t("settings.saving") : <>{t("settings.save")} <Target className="h-4 w-4" /></>}
        </button>
      </div>
    </PageShell>
  );
}
