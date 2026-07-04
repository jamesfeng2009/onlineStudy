import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { X, LogIn } from "lucide-react";
import { useLocalePath } from "./LocaleLink";

export default function LoginPromptModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const loginPath = useLocalePath("/login");
  const registerPath = useLocalePath("/register");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#020617] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-brand-200/60 transition hover:bg-white/5 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400/20 to-fuchsia-500/20">
          <LogIn className="h-6 w-6 text-sky-300" />
        </div>

        <h2 className="mt-4 text-lg font-bold text-white">
          {t("loginPrompt.title")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-brand-200/80">
          {t("loginPrompt.message")}
        </p>

        <div className="mt-5 flex gap-2">
          <button
            onClick={() => navigate(loginPath)}
            className="flex-1 rounded-xl bg-gradient-to-r from-sky-400 to-fuchsia-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-fuchsia-500/30 transition hover:shadow-fuchsia-500/50"
          >
            {t("loginPrompt.login")}
          </button>
          <button
            onClick={() => navigate(registerPath)}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-brand-100 transition hover:bg-white/10"
          >
            {t("loginPrompt.register")}
          </button>
        </div>
      </div>
    </div>
  );
}
