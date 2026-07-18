import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LocaleLink from "../../components/LocaleLink";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/authStore";

/**
 * OAuth 回调页：后端重定向到 /auth/callback#token=xxx
 * 这里解析 hash 拿 token，写入 store 后跳首页。
 */
export default function OAuthCallbackPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const writeTokenAndBootstrap = useAuthStore((s) => s.bootstrap);
  const logout = useAuthStore((s) => s.logout);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    // StrictMode 下 useEffect 会执行两次，但 token 只能消费一次。
    // 第一次执行后清除 hash，第二次执行时 token 为空，自然走错误分支。
    const hash = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(hash);
    const token = params.get("token");

    if (!token) {
      // 第二次执行（StrictMode remount）或真实无 token
      setErr(t("auth.oauth.callbackNoToken"));
      return;
    }

    // 消费 token：立即清除 hash，防止 StrictMode 重复执行
    window.history.replaceState(null, "", window.location.pathname + window.location.search);

    (async () => {
      try {
        localStorage.setItem("lv_token", token);
        await writeTokenAndBootstrap();
        navigate("/", { replace: true });
      } catch {
        logout();
        setErr(t("auth.oauth.callbackFailed"));
      }
    })();
  }, [writeTokenAndBootstrap, logout, navigate, t]);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute -top-32 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-500/40 via-fuchsia-500/30 to-orange-400/30 blur-3xl" />
      <div className="relative mx-auto flex max-w-md flex-col items-center gap-6 px-4 py-24 text-center">
        {err ? (
          <>
            <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-6 py-4 text-rose-200">
              {err}
            </div>
            <LocaleLink
              to="/login"
              className="rounded-xl bg-gradient-to-r from-sky-400 via-fuchsia-400 to-amber-300 px-5 py-2.5 font-semibold text-slate-900"
            >
              {t("auth.login.button")}
            </LocaleLink>
          </>
        ) : (
          <>
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-sky-300" />
            <div className="text-brand-100">{t("auth.oauth.processing")}</div>
          </>
        )}
      </div>
    </div>
  );
}
