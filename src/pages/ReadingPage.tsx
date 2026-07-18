/**
 * P1-2: 阅读模块前端（ReadingPage）
 *
 * 路由：
 *   /reading                                    — 语言选择 + 文章列表（无 lang 时先选语言）
 *   /reading?lang=ja&level=N5                   — 指定语言/等级筛选
 *   /reading/:id                                — 文章详情 + 阅读理解题
 *
 * 流程：
 *   1. 用户在 /reading 选语言 → 拉取该语言所有 reading passages
 *   2. 点击文章 → 进入详情页（含正文 + glossary + 理解题）
 *   3. 作答 → 提交进度（auth，未登录提示登录）
 *   4. 显示正确率，可重做（保留最佳记录）
 */

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Check, X, BookOpen, Clock, Sparkles,
  Loader2, RotateCcw, Trophy, BookMarked, Info, Wand2,
} from "lucide-react";
import PageShell from "../components/PageShell";
import { Seo } from "../components/Seo";
import { GlassCard } from "../components/GlassCard";
import LevelMetaCard from "../components/LevelMetaCard";
import LoginPromptModal from "../components/LoginPromptModal";
import { api } from "../lib/api";
import type {
  ReadingPassageSummary, ReadingPassageDetail, ReadingProgressEntry,
} from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { useTranslation } from "react-i18next";
import { LANGUAGES, getLanguage, getLanguageDisplayName } from "../data/languages";
import { cefrEquivalent } from "../lib/level-utils";
import type { Language } from "../types";

export default function ReadingPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useAuthStore((s) => s.user);

  const selectedLang = (searchParams.get("lang") as Language | null) ?? null;
  const selectedLevel = searchParams.get("level") ?? null;

  // ====== Detail view (route param `id` set) ======
  if (id) {
    return <ReadingDetail id={id} onBack={() => navigate("/reading")} />;
  }

  // ====== List view ======
  return (
    <ReadingList
      lang={selectedLang}
      level={selectedLevel}
      user={user}
      onLangChange={(lang) => {
        const qs = new URLSearchParams();
        if (lang) qs.set("lang", lang);
        setSearchParams(qs);
      }}
      onLevelChange={(level) => {
        const qs = new URLSearchParams(searchParams);
        if (level) qs.set("level", level);
        else qs.delete("level");
        setSearchParams(qs);
      }}
      onOpen={(pid) => navigate(`/reading/${pid}`)}
    />
  );
}

// ============================================================
// ReadingList: 语言选择 + 文章列表
// ============================================================

function ReadingList({
  lang, level, user, onLangChange, onLevelChange, onOpen,
}: {
  lang: Language | null;
  level: string | null;
  user: { nativeLanguage?: string } | null;
  onLangChange: (lang: Language | null) => void;
  onLevelChange: (level: string | null) => void;
  onOpen: (id: string) => void;
}) {
  const { t, i18n } = useTranslation();
  const [passages, setPassages] = useState<ReadingPassageSummary[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, ReadingProgressEntry>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nativeLanguage = (user?.nativeLanguage as string) || "en";

  // Fetch passages when lang changes
  useEffect(() => {
    if (!lang) {
      setPassages([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    api.readingPassages({ language: lang, level: level ?? undefined, nativeLanguage })
      .then((data) => {
        if (!cancelled) setPassages(data);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : t("reading.fetchFailed"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [lang, level, nativeLanguage]);

  // Fetch user progress (auth)
  useEffect(() => {
    if (!user || !lang) {
      setProgressMap({});
      return;
    }
    api.readingProgress(lang)
      .then((list) => {
        const m: Record<string, ReadingProgressEntry> = {};
        for (const p of list) m[p.readingId] = p;
        setProgressMap(m);
      })
      .catch(() => {
        /* silent — user may be unauthenticated */
      });
  }, [user, lang]);

  // Levels available for the selected language
  const levels = useMemo(() => {
    if (!lang) return [];
    const langMeta = getLanguage(lang);
    return Array.isArray(langMeta.levels) ? (langMeta.levels as string[]) : [];
  }, [lang]);

  // ====== Render: language picker ======
  if (!lang) {
    return (
      <PageShell title={t("reading.title")} subtitle={t("reading.subtitle")}>
        <Seo
          title={t("reading.seoTitle")}
          description={t("reading.seoDescription")}
          pathname="/reading"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              onClick={() => onLangChange(l.id as Language)}
              className="glass rounded-2xl p-4 text-center transition hover:-translate-y-0.5 hover:border-white/20"
            >
              <div className="text-4xl">{l.flag}</div>
              <div className="mt-2 text-sm font-medium text-white">{getLanguageDisplayName(l.id, i18n.language)}</div>
              <div className="text-[11px] text-brand-200/60">{getLanguageDisplayName(l.id, i18n.language)}</div>
            </button>
          ))}
        </div>
        <p className="mt-6 text-center text-[11px] text-brand-200/40">
          {t("reading.disclaimer")}
        </p>
      </PageShell>
    );
  }

  const langMeta = getLanguage(lang);

  const langName = getLanguageDisplayName(lang, i18n.language);

  return (
    <PageShell
      title={`${langMeta.flag} ${langName} · ${t("reading.title")}`}
      subtitle={t("reading.listSubtitle")}
      action={
        <button
          onClick={() => onLangChange(null)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-brand-100 transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" /> {t("reading.switchLanguage")}
        </button>
      }
    >
      <Seo
        title={`${langName} ${t("reading.title")} — LangOria`}
        description={t("reading.seoDescriptionLang", { language: langName })}
        pathname={`/reading?lang=${lang}`}
      />

      {/* Level filter */}
      {levels.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          <button
            onClick={() => onLevelChange(null)}
            className={
              "rounded-full border px-3 py-1.5 text-xs transition " +
              (!level
                ? "border-fuchsia-400/60 bg-fuchsia-400/15 text-fuchsia-100"
                : "border-white/10 bg-white/5 text-brand-200/80 hover:bg-white/10")
            }
          >
            {t("common.all")}
          </button>
          {levels.map((lv) => (
            <button
              key={lv}
              onClick={() => onLevelChange(lv)}
              className={
                "rounded-full border px-3 py-1.5 text-xs transition " +
                (level === lv
                  ? "border-fuchsia-400/60 bg-fuchsia-400/15 text-fuchsia-100"
                  : "border-white/10 bg-white/5 text-brand-200/80 hover:bg-white/10")
              }
            >
              {lv}
              {cefrEquivalent(lang, lv) && (
                <span className="ml-1 text-[10px] text-brand-200/50">
                  · {cefrEquivalent(lang, lv)}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20 text-brand-200/70">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-3 text-sm">{t("common.loading")}</span>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      {!loading && !error && passages.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-10 text-center text-brand-200/70">
          <BookMarked className="mx-auto h-8 w-8 text-brand-200/40" />
          <div className="mt-3">{t("reading.empty")}</div>
          <div className="mt-1 text-xs text-brand-200/50">{t("reading.emptyHint")}</div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {passages.map((p) => {
          const prog = progressMap[p.id];
          const isCompleted = prog?.status === "completed";
          return (
            <GlassCard
              key={p.id}
              onClick={() => onOpen(p.id)}
              className="flex flex-col"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-sky-400/10 px-2.5 py-1 text-[11px] font-medium text-sky-300">
                  {p.level}
                  {cefrEquivalent(lang, p.level) && (
                    <span className="ml-1 text-sky-300/60">· {cefrEquivalent(lang, p.level)}</span>
                  )}
                </span>
                {isCompleted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                    <Check className="h-3 w-3" /> {t("reading.completed")}
                  </span>
                )}
                {prog && !isCompleted && prog.attemptCount > 0 && (
                  <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-[11px] font-medium text-amber-300">
                    {t("reading.bestAccuracy", { accuracy: prog.bestAccuracy })}
                  </span>
                )}
              </div>
              <h3 className="mt-3 font-display text-lg font-bold text-white">{p.title}</h3>
              {p.summary && (
                <p className="mt-1 text-sm text-brand-200/70 line-clamp-3">{p.summary}</p>
              )}
              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs text-brand-200/70">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" /> {t("reading.words", { count: p.wordCount })}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {t("reading.minutes", { count: p.estMinutes })}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-sky-300">
                  {t("reading.start")} <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {lang && (
        <div className="mt-6">
          <LevelMetaCard language={lang} level={level ?? ""} variant="compact" />
        </div>
      )}
    </PageShell>
  );
}

// ============================================================
// ReadingDetail: 文章详情 + 理解题作答
// ============================================================

function ReadingDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const nativeLanguage = (user?.nativeLanguage as string) || "en";

  const [passage, setPassage] = useState<ReadingPassageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [savedProgress, setSavedProgress] = useState<ReadingProgressEntry | null>(null);

  // P3-1: AI 句子解释
  const [aiSentence, setAiSentence] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiRemaining, setAiRemaining] = useState<number | null>(null);

  async function handleAiExplain(sentence: string) {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    if (!passage) return;
    // 同一句已展示，点击关闭
    if (aiSentence === sentence && aiExplanation) {
      setAiSentence(null);
      setAiExplanation(null);
      return;
    }
    setAiSentence(sentence);
    setAiExplanation(null);
    setAiError(null);
    setAiLoading(true);
    try {
      const r = await api.aiExplainReading(passage.id, sentence);
      setAiExplanation(r.explanation);
      setAiRemaining(r.remainingToday);
    } catch (e) {
      setAiError(e instanceof Error ? e.message : t("reading.aiExplainFailed"));
    } finally {
      setAiLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api.readingPassage(id, nativeLanguage)
      .then((data) => {
        if (!cancelled) {
          setPassage(data);
          setAnswers({});
          setSubmitted(false);
          setSavedProgress(null);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : t("reading.loadFailed"));
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id, nativeLanguage]);

  const allAnswered = useMemo(() => {
    if (!passage) return false;
    return passage.questions.every((q) => answers[q.id] !== undefined);
  }, [passage, answers]);

  const correctCount = useMemo(() => {
    if (!passage) return 0;
    return passage.questions.filter((q) => answers[q.id] === q.answer).length;
  }, [passage, answers]);

  const accuracy = passage && passage.questions.length > 0
    ? Math.round((correctCount / passage.questions.length) * 100)
    : 0;

  async function submit() {
    if (!passage || !allAnswered) return;
    if (!user) {
      // Show answers anyway, prompt to save progress
      setSubmitted(true);
      setShowLoginPrompt(true);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const results = passage.questions.map((q) => ({
        questionId: q.id,
        selectedIndex: answers[q.id],
        correct: answers[q.id] === q.answer,
      }));
      const saved = await api.submitReading(passage.id, {
        results,
        totalQuestions: passage.questions.length,
        correctCount,
      });
      setSavedProgress(saved);
      setSubmitted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t("reading.submitFailed"));
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setAnswers({});
    setSubmitted(false);
    setSavedProgress(null);
  }

  if (loading) {
    return (
      <PageShell title={t("reading.loadingTitle")}>
        <div className="flex items-center justify-center py-20 text-brand-200/70">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-3 text-sm">{t("common.loading")}</span>
        </div>
      </PageShell>
    );
  }

  if (error || !passage) {
    return (
      <PageShell title={t("reading.title")}>
        <div className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200">
          {error ?? t("reading.loadPassageFailed")}
        </div>
        <div className="mt-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-brand-100 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" /> {t("reading.backToList")}
          </button>
        </div>
      </PageShell>
    );
  }

  const lang = passage.language as Language;
  const paragraphs = passage.body.split(/\n\n+/);

  return (
    <PageShell
      title={passage.title}
      subtitle={t("reading.passageMeta", {
        level: passage.level,
        cefr: cefrEquivalent(lang, passage.level) ? `CEFR ${cefrEquivalent(lang, passage.level)}` : "",
        words: passage.wordCount,
        minutes: passage.estMinutes,
      })}
      action={
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-brand-100 hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" /> {t("reading.backToList")}
        </button>
      }
    >
      <Seo
        title={`${passage.title} — LangOria ${t("reading.title")}`}
        description={passage.summary || passage.title}
        pathname={`/reading/${id}`}
        noindex
      />

      {savedProgress && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4">
          <Trophy className="h-5 w-5 flex-none text-emerald-300" />
          <div className="flex-1 text-sm text-emerald-100">
            {t("reading.accuracyThisTime", { accuracy, correct: correctCount, total: passage.questions.length })}
            {savedProgress.status === "completed" && (
              <span className="ml-2 text-emerald-300">· {t("reading.passageCompleted")}</span>
            )}
            {savedProgress.attemptCount > 1 && (
              <span className="ml-2 text-emerald-200/70">· {t("reading.attemptHistory", { count: savedProgress.attemptCount, best: savedProgress.bestAccuracy })}</span>
            )}
          </div>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-100 hover:bg-emerald-400/20"
          >
            <RotateCcw className="h-3.5 w-3.5" /> {t("reading.redo")}
          </button>
        </div>
      )}

      {/* Reading body */}
      <GlassCard className="flex flex-col">
        <div className="mb-3 inline-flex items-center gap-1.5 self-start rounded-full bg-sky-400/10 px-3 py-1 text-[11px] font-medium text-sky-300">
          <BookOpen className="h-3 w-3" />
          {passage.level}
          {cefrEquivalent(lang, passage.level) && (
            <span className="text-sky-300/60">· CEFR {cefrEquivalent(lang, passage.level)}</span>
          )}
        </div>

        <article className="prose prose-invert max-w-none">
          {paragraphs.map((p, i) => (
            <div key={i} className="group relative mb-4">
              <p className="text-base leading-relaxed text-brand-100 md:text-lg">
                {p}
              </p>
              <button
                onClick={() => handleAiExplain(p)}
                className={
                  "absolute -right-1 -top-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] transition opacity-0 group-hover:opacity-100 " +
                  (aiSentence === p
                    ? "bg-fuchsia-400/20 text-fuchsia-200 opacity-100"
                    : "bg-white/5 text-brand-200/70 hover:bg-white/10")
                }
              >
                <Wand2 className="h-3 w-3" />
                {aiSentence === p && aiLoading ? t("reading.aiExplaining") : t("reading.aiExplain")}
              </button>
            </div>
          ))}
        </article>

        {/* P3-1: AI 解释结果 */}
        {aiSentence && (
          <div className="mt-4 rounded-2xl border border-fuchsia-400/30 bg-fuchsia-400/5 p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-fuchsia-200">
                <Wand2 className="h-3.5 w-3.5" /> {t("reading.aiSentenceTitle")}
              </div>
              {aiRemaining !== null && (
                <span className="text-[10px] text-fuchsia-300/60">
                  {t("reading.aiRemaining", { count: aiRemaining })}
                </span>
              )}
            </div>
            <p className="mb-3 rounded-lg bg-white/5 px-3 py-2 text-sm italic text-brand-200/80">
              "{aiSentence.length > 120 ? aiSentence.slice(0, 120) + "…" : aiSentence}"
            </p>
            {aiLoading && (
              <div className="flex items-center gap-2 text-sm text-fuchsia-200/70">
                <Loader2 className="h-4 w-4 animate-spin" /> {t("reading.aiGenerating")}
              </div>
            )}
            {aiError && (
              <div className="text-sm text-rose-300">{aiError}</div>
            )}
            {aiExplanation && (
              <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-sm text-brand-100">
                {aiExplanation}
              </div>
            )}
          </div>
        )}

        {passage.source && (
          <p className="mt-4 border-t border-white/5 pt-3 text-[11px] text-brand-200/40">
            {t("reading.source", { source: passage.source })}
          </p>
        )}
      </GlassCard>

      {/* Glossary */}
      {passage.glossary.length > 0 && (
        <GlassCard className="mt-5">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-fuchsia-300" />
            <h2 className="font-display text-base font-semibold text-white">{t("reading.glossary")}</h2>
          </div>
          <ul className="space-y-2">
            {passage.glossary.map((g, i) => (
              <li key={i} className="flex flex-wrap items-baseline gap-x-2 text-sm">
                <span className="font-medium text-white">{g.term}</span>
                {g.reading && <span className="text-xs text-sky-300">{g.reading}</span>}
                <span className="text-brand-200/70">{g.definition}</span>
                {g.translation && (
                  <span className="text-xs text-brand-200/50">· {g.translation}</span>
                )}
              </li>
            ))}
          </ul>
        </GlassCard>
      )}

      {/* Comprehension questions */}
      {passage.questions.length > 0 && (
        <GlassCard className="mt-5">
          <div className="mb-4 flex items-center gap-2">
            <Info className="h-4 w-4 text-sky-300" />
            <h2 className="font-display text-base font-semibold text-white">
              {t("reading.comprehensionTitle", { count: passage.questions.length })}
            </h2>
          </div>

          <div className="space-y-6">
            {passage.questions.map((q, qi) => (
              <div key={q.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="mb-3 flex gap-2">
                  <span className="font-display text-sm font-bold text-fuchsia-300">
                    {qi + 1}.
                  </span>
                  <div className="text-sm text-white">{q.question}</div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {q.options.map((opt, oi) => {
                    const isSelected = answers[q.id] === oi;
                    const isCorrect = oi === q.answer;
                    const showStyle = submitted
                      ? isCorrect
                        ? "border-emerald-400/60 bg-emerald-400/15 text-emerald-100"
                        : isSelected
                          ? "border-rose-400/60 bg-rose-400/15 text-rose-100"
                          : "border-white/5 text-brand-200/60"
                      : isSelected
                        ? "border-sky-400/60 bg-sky-400/10 text-white"
                        : "border-white/10 text-brand-100 hover:border-white/20 hover:bg-white/5";
                    return (
                      <button
                        key={oi}
                        disabled={submitted}
                        onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: oi }))}
                        className={
                          "flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition " +
                          showStyle
                        }
                      >
                        <span>{opt}</span>
                        {submitted && isCorrect && <Check className="h-4 w-4" />}
                        {submitted && isSelected && !isCorrect && <X className="h-4 w-4" />}
                      </button>
                    );
                  })}
                </div>
                {submitted && q.explain && (
                  <div className="mt-3 rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs text-brand-200/70">
                    {t("reading.explanation")}{q.explain}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit / score area */}
          {!submitted ? (
            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="text-xs text-brand-200/60">
                {t("reading.answered", { answered: Object.keys(answers).length, total: passage.questions.length })}
              </div>
              <button
                onClick={submit}
                disabled={!allAnswered || submitting}
                className={
                  "inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition " +
                  (allAnswered && !submitting
                    ? "bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white hover:opacity-90"
                    : "cursor-not-allowed border border-white/10 bg-white/5 text-brand-200/50")
                }
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {t("reading.submit")}
              </button>
            </div>
          ) : (
            <div className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm">
                <div className="font-display text-2xl font-bold text-white">{accuracy}%</div>
                <div className="text-xs text-brand-200/60">
                  {t("reading.correctCount", { correct: correctCount, total: passage.questions.length })}
                </div>
              </div>
              {!savedProgress && (
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-brand-100 hover:bg-white/10"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> {t("reading.redo")}
                </button>
              )}
            </div>
          )}
        </GlassCard>
      )}

      {showLoginPrompt && (
        <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />
      )}
    </PageShell>
  );
}
