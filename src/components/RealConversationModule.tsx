/**
 * RealConversationModule — 真实对话影子跟读模式
 *
 * This module is lazy-loaded by LearnPage to keep the main bundle
 * small (the REAL_CONVERSATIONS data adds ~1.4 MB / ~300 KB gz).
 * Only loaded when the user actually switches to the "Real
 * conversations" tab.
 *
 * 来源:Taskmaster-2 真实人机对话数据集
 * 模式:逐句听 ASSISTANT → 跟读 → 打分 → 下一句
 */
import { useEffect, useMemo, useState } from "react";
import { Mic, ArrowRight, MessagesSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { GlassCard } from "../components/GlassCard";
import PronunciationScore from "../components/PronunciationScore";
// Direct import (bypassing ../data/content) so Vite keeps the ~1.4 MB
// REAL_CONVERSATIONS array bundled inside this lazy chunk instead of
// pulling it into the main chunk via content.ts.
import { REAL_CONVERSATIONS } from "../data/real-conversations";
import type { Language, RealConversation } from "../types";

function getRealConversations(
  language: Language,
  domain?: string,
): RealConversation[] {
  const byLang = REAL_CONVERSATIONS.filter((c) => c.language === language);
  const filtered = domain
    ? byLang.filter((c) => c.domain === domain)
    : byLang;
  if (filtered.length === 0 && language !== "en") {
    const enAll = REAL_CONVERSATIONS.filter((c) => c.language === "en");
    return domain ? enAll.filter((c) => c.domain === domain) : enAll;
  }
  return filtered;
}

const BCP47: Record<Language, string> = {
  en: "en-US",
  ja: "ja-JP",
  ko: "ko-KR",
  zh: "zh-CN",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  th: "th-TH",
  yue: "zh-HK",
  ms: "ms-MY",
  id: "id-ID",
  vi: "vi-VN",
};

const REAL_CONV_DOMAINS = [
  { id: "restaurant", labelKey: "learn.realConv.domains.restaurant" },
  { id: "food-ordering", labelKey: "learn.realConv.domains.foodOrdering" },
  { id: "movies", labelKey: "learn.realConv.domains.movies" },
  { id: "hotels", labelKey: "learn.realConv.domains.hotels" },
  { id: "flights", labelKey: "learn.realConv.domains.flights" },
  { id: "music", labelKey: "learn.realConv.domains.music" },
  { id: "sports", labelKey: "learn.realConv.domains.sports" },
] as const;

export default function RealConversationModule({
  language,
  isLoggedIn,
  onNeedLogin,
}: {
  language: Language;
  isLoggedIn: boolean;
  onNeedLogin: () => void;
}) {
  const { t } = useTranslation();
  const [domain, setDomain] = useState<string>("restaurant");
  const conversations = useMemo(
    () => getRealConversations(language, domain),
    [language, domain],
  );
  const [convIdx, setConvIdx] = useState(0);
  const [uttIdx, setUttIdx] = useState(0);
  const [scoredCount, setScoredCount] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [bestScores, setBestScores] = useState<Record<number, number>>({});

  // Pick the first non-empty conversation for this domain.
  const conv: RealConversation | null =
    conversations[convIdx % Math.max(1, conversations.length)] ?? null;
  // Filter to ASSISTANT turns for shadowing (USER turns only show text).
  const utterances = conv?.utterances ?? [];
  const currentUtt = utterances[uttIdx];

  // Reset state when domain/language changes.
  useEffect(() => {
    setConvIdx(0);
    setUttIdx(0);
    setScoredCount(0);
    setTotalScore(0);
    setBestScores({});
  }, [domain, language]);

  const handleScored = (score: number) => {
    if (!currentUtt || currentUtt.speaker !== "ASSISTANT") return;
    setBestScores((prev) => ({
      ...prev,
      [uttIdx]: Math.max(prev[uttIdx] ?? 0, score),
    }));
  };

  // Only advance when the user explicitly clicks "next".
  const next = () => {
    if (uttIdx < utterances.length - 1) {
      setUttIdx((n) => n + 1);
    } else {
      // Conversation done — record aggregate stats.
      const convBestScores = Object.values(bestScores);
      if (convBestScores.length > 0) {
        const convTotal = convBestScores.reduce((s, v) => s + v, 0);
        setScoredCount((n) => n + convBestScores.length);
        setTotalScore((s) => s + convTotal);
      }
      // Move to next conversation.
      setConvIdx((n) => n + 1);
      setUttIdx(0);
      setBestScores({});
    }
  };

  const prev = () => {
    if (uttIdx > 0) setUttIdx((n) => n - 1);
    else if (convIdx > 0) {
      setConvIdx((n) => n - 1);
      setUttIdx(0);
    }
  };

  const avgScore = scoredCount > 0 ? Math.round(totalScore / scoredCount) : 0;
  const completedInConv = Object.keys(bestScores).length;
  const totalAssistantUtts = utterances.filter(
    (u) => u.speaker === "ASSISTANT",
  ).length;
  const progress =
    totalAssistantUtts > 0
      ? Math.round((completedInConv / totalAssistantUtts) * 100)
      : 0;

  if (!conv) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GlassCard className="flex min-h-[380px] flex-col items-center justify-center py-12">
            <MessagesSquare className="h-12 w-12 text-brand-200/40" />
            <div className="mt-4 text-sm text-brand-200/70">
              {t("learn.realConv.empty")}
            </div>
            <div className="mt-1 text-xs text-brand-200/50">
              {t("learn.realConv.emptyHint")}
            </div>
          </GlassCard>
        </div>
        <div className="space-y-4">
          <GlassCard className="p-5">
            <div className="text-xs uppercase tracking-wider text-brand-200/60">
              {t("learn.realConv.aboutTitle")}
            </div>
            <div className="mt-2 text-xs text-brand-100/80">
              {t("learn.realConv.about")}
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <GlassCard>
          {/* Domain picker */}
          <div className="mb-4 flex flex-wrap gap-2">
            {REAL_CONV_DOMAINS.map((d) => (
              <button
                key={d.id}
                onClick={() => setDomain(d.id)}
                className={
                  "rounded-full px-3 py-1.5 text-xs transition " +
                  (d.id === domain
                    ? "bg-gradient-to-r from-sky-400 to-fuchsia-500 text-white"
                    : "bg-white/5 text-brand-200/70 hover:text-white")
                }
              >
                {t(d.labelKey)}
              </button>
            ))}
          </div>

          {/* Conversation picker (prev / index / next) */}
          <div className="mb-4 flex items-center justify-between text-xs text-brand-200/70">
            <button
              onClick={prev}
              className="rounded-md bg-white/5 px-2 py-1 hover:bg-white/10"
            >
              ← {t("learn.realConv.prevConv")}
            </button>
            <span>
              {t("learn.realConv.conversationN", {
                n: convIdx + 1,
                total: conversations.length,
              })}
            </span>
            <button
              onClick={() => {
                setConvIdx((n) => n + 1);
                setUttIdx(0);
                setBestScores({});
              }}
              className="rounded-md bg-white/5 px-2 py-1 hover:bg-white/10"
            >
              {t("learn.realConv.nextConv")} →
            </button>
          </div>

          {/* Progress bar */}
          <div className="mb-4 h-[3px] overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-fuchsia-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Conversation area — show only the current utterance */}
          {currentUtt && (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-brand-200/60">
                <span>
                  {currentUtt.speaker === "ASSISTANT"
                    ? t("learn.realConv.assistantTurn")
                    : t("learn.realConv.userTurn")}
                </span>
                <span>
                  {uttIdx + 1} / {utterances.length}
                </span>
              </div>
              <div className="mt-3 font-display text-2xl font-semibold leading-snug text-white md:text-3xl">
                {currentUtt.text}
              </div>

              {currentUtt.speaker === "ASSISTANT" ? (
                <div className="mt-5">
                  {isLoggedIn ? (
                    <PronunciationScore
                      key={`${conv?.id}-${uttIdx}`}
                      text={currentUtt.text}
                      lang={BCP47[language]}
                      onScored={handleScored}
                    />
                  ) : (
                    <button
                      onClick={onNeedLogin}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                    >
                      <Mic className="h-4 w-4" />{" "}
                      {t("learn.speakingModule.loginToStart")}
                    </button>
                  )}
                  {bestScores[uttIdx] !== undefined && (
                    <div className="mt-2 text-xs text-emerald-300">
                      {t("learn.realConv.bestScore")}: {bestScores[uttIdx]}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-4 text-xs text-brand-200/60">
                  {t("learn.realConv.userTurnHint")}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={prev}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white transition hover:bg-white/10"
            >
              ← {t("learn.realConv.prev")}
            </button>
            <button
              onClick={next}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
            >
              {t("learn.realConv.next")} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </GlassCard>
      </div>

      <div className="space-y-4">
        <GlassCard className="p-5">
          <div className="text-xs uppercase tracking-wider text-brand-200/60">
            {t("learn.realConv.sessionTitle")}
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-white">
            {avgScore}
          </div>
          <div className="text-xs text-brand-200/60">
            {t("learn.realConv.avgScore")}
          </div>
          <div className="mt-3 text-xs text-brand-200/60">
            {t("learn.realConv.shadowed", { n: scoredCount })}
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="text-xs uppercase tracking-wider text-brand-200/60">
            {t("learn.realConv.aboutTitle")}
          </div>
          <div className="mt-2 text-xs text-brand-100/80">
            {t("learn.realConv.about")}
          </div>
          <ul className="mt-3 space-y-1.5 text-xs text-brand-100/90">
            <li>· {t("learn.realConv.tip1")}</li>
            <li>· {t("learn.realConv.tip2")}</li>
            <li>· {t("learn.realConv.tip3")}</li>
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
