/**
 * P0-3: 分级测试页面（Placement Test）
 *
 * 自适应算法（staircase 二分查找）：
 *   1. 一次性拉取该语言所有 level 的题目（GET /placement/questions/:lang）
 *   2. 起始 level = 中间 rank（如 6 级中的 B1）
 *   3. 答对 → 上一级；答错 → 下一级
 *   4. 直到：达到上限题数（默认 6）或触及阶梯两端
 *   5. 推荐 level = 用户答对过的最高 level
 *
 * 用户路径：
 *   - 未登录可测，看到推荐结果
 *   - 登录后调用 savePlacementResult 持久化
 *   - 通过 "开始这门课程" CTA 跳转到 /learn/<courseId>
 */

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight, ArrowLeft, Check, X, Sparkles, Trophy, Loader2, RotateCcw,
} from "lucide-react";
import PageShell from "../components/PageShell";
import { Seo } from "../components/Seo";
import { GlassCard } from "../components/GlassCard";
import LoginPromptModal from "../components/LoginPromptModal";
import LevelMetaCard from "../components/LevelMetaCard";
import { api } from "../lib/api";
import type {
  PlacementQuestion, PlacementQuestionsResp, PlacementAnswerPayload,
} from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { LANGUAGES, getLanguageDisplayName } from "../data/languages";
import { COURSES } from "../data/courses";
import { cefrEquivalent, cefrRank } from "../lib/level-utils";
import type { Language } from "../types";

const MAX_QUESTIONS = 6;

type Phase = "lang-pick" | "loading" | "testing" | "result";

interface TestState {
  levels: string[];                                  // sorted by CEFR rank asc
  questionsByLevel: Map<string, PlacementQuestion[]>;
  usedIdxByLevel: Map<string, number>;              // next-unused question index per level
  currentLevelIdx: number;
  currentQuestion: PlacementQuestion | null;
  answers: PlacementAnswerPayload[];
  questionNumber: number;                           // 1-based
  done: boolean;
}

/** Sort levels by CEFR rank ascending (A1 first, C2 last). */
function sortByCefrRank(language: string, levels: string[]): string[] {
  return [...levels].sort((a, b) => {
    const ra = cefrRank(language, a) || 0;
    const rb = cefrRank(language, b) || 0;
    return ra - rb;
  });
}

/** Pick the starting level = middle of the ladder. */
function pickStartIdx(levels: string[]): number {
  if (levels.length === 0) return -1;
  return Math.floor(levels.length / 2);
}

/** Get the next unused question at the current level, or null if exhausted. */
function pickNextQuestion(state: TestState): PlacementQuestion | null {
  if (state.currentLevelIdx < 0 || state.currentLevelIdx >= state.levels.length) {
    return null;
  }
  const level = state.levels[state.currentLevelIdx];
  const pool = state.questionsByLevel.get(level) ?? [];
  const idx = state.usedIdxByLevel.get(level) ?? 0;
  if (idx >= pool.length) return null;
  return pool[idx];
}

/** Compute the recommended level = highest level where user answered correctly,
 *  or the easiest level if they got everything wrong. */
function computeRecommendation(state: TestState): string {
  let highestCorrectIdx = -1;
  for (const answer of state.answers) {
    if (answer.correct) {
      const idx = state.levels.indexOf(answer.level);
      if (idx > highestCorrectIdx) highestCorrectIdx = idx;
    }
  }
  if (highestCorrectIdx === -1) {
    // user got everything wrong → recommend easiest
    return state.levels[0] ?? "A1";
  }
  return state.levels[highestCorrectIdx];
}

export default function PlacementTestPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const [phase, setPhase] = useState<Phase>("lang-pick");
  const [lang, setLang] = useState<Language | null>(
    (searchParams.get("lang") as Language | null) ?? null,
  );
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<TestState | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedResult, setSavedResult] = useState<{ recommendedLevel: string; recommendedCourseId: string | null } | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Start the test when a language is picked
  async function startTest(language: Language) {
    setLang(language);
    setSearchParams({ lang: language });
    setPhase("loading");
    setError(null);
    try {
      const nativeLanguage = (user?.nativeLanguage as string) || "en";
      const resp: PlacementQuestionsResp = await api.placementQuestions(language, {
        countPerLevel: 3,
        nativeLanguage,
      });
      if (!resp.questions.length) {
        setError(t("placement.errors.noQuestions"));
        setPhase("lang-pick");
        return;
      }
      // Group questions by level
      const questionsByLevel = new Map<string, PlacementQuestion[]>();
      for (const q of resp.questions) {
        const arr = questionsByLevel.get(q.level) ?? [];
        arr.push(q);
        questionsByLevel.set(q.level, arr);
      }
      const sortedLevels = sortByCefrRank(language, resp.levels);
      const startIdx = pickStartIdx(sortedLevels);
      const initialState: TestState = {
        levels: sortedLevels,
        questionsByLevel,
        usedIdxByLevel: new Map(),
        currentLevelIdx: startIdx,
        currentQuestion: null,
        answers: [],
        questionNumber: 1,
        done: false,
      };
      initialState.currentQuestion = pickNextQuestion(initialState);
      if (!initialState.currentQuestion) {
        setError(t("placement.errors.noStartQuestion"));
        setPhase("lang-pick");
        return;
      }
      setState(initialState);
      setPhase("testing");
    } catch (e) {
      setError(e instanceof Error ? e.message : t("placement.errors.fetchFailed"));
      setPhase("lang-pick");
    }
  }

  // Submit current answer + advance
  function submitAnswer() {
    if (!state || !state.currentQuestion || selectedOption === null) return;
    const q = state.currentQuestion;
    const correct = selectedOption === q.answer;
    const answer: PlacementAnswerPayload = {
      level: q.level,
      itemId: q.id,
      selectedOption,
      correct,
    };
    const newAnswers = [...state.answers, answer];
    // Mark this question as used (increment per-level index)
    const newUsedIdx = new Map(state.usedIdxByLevel);
    newUsedIdx.set(q.level, (newUsedIdx.get(q.level) ?? 0) + 1);
    // Adaptive step: correct → up, wrong → down
    const newLevelIdx = correct ? state.currentLevelIdx + 1 : state.currentLevelIdx - 1;
    const newQuestionNumber = state.questionNumber + 1;
    // Check terminal conditions
    const reachedTop = newLevelIdx >= state.levels.length;
    const reachedBottom = newLevelIdx < 0;
    const reachedMaxQuestions = newQuestionNumber > MAX_QUESTIONS;
    const done = reachedTop || reachedBottom || reachedMaxQuestions;
    const newState: TestState = {
      ...state,
      answers: newAnswers,
      usedIdxByLevel: newUsedIdx,
      currentLevelIdx: newLevelIdx,
      currentQuestion: null,
      questionNumber: newQuestionNumber,
      done,
    };
    if (!done) {
      newState.currentQuestion = pickNextQuestion(newState);
      // If we ran out of questions at this level, end the test
      if (!newState.currentQuestion) {
        newState.done = true;
      }
    }
    setState(newState);
    setSelectedOption(null);
    setRevealed(false);
    if (newState.done) {
      setPhase("result");
    }
  }

  // Persist result (auth)
  async function saveResult() {
    if (!state || !lang || !user) return;
    setSaving(true);
    setError(null);
    try {
      const recommendedLevel = computeRecommendation(state);
      const rank = cefrRank(lang, recommendedLevel) || 1;
      // Find a course for this language + level
      const course = COURSES.find((c) => c.language === lang && c.level === recommendedLevel) ?? null;
      await api.savePlacementResult({
        language: lang,
        recommendedLevel,
        recommendedCourseId: course?.id ?? null,
        totalQuestions: state.answers.length,
        correctCount: state.answers.filter((a) => a.correct).length,
        finalCefrRank: rank,
        answers: state.answers,
      });
      setSavedResult({
        recommendedLevel,
        recommendedCourseId: course?.id ?? null,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : t("placement.errors.saveFailed"));
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setPhase("lang-pick");
    setState(null);
    setSelectedOption(null);
    setRevealed(false);
    setSavedResult(null);
    setError(null);
  }

  // ====== Render: language picker ======
  if (phase === "lang-pick") {
    return (
      <PageShell title={t("placement.title")} subtitle={t("placement.subtitle")}>
        <Seo title={t("placement.seoTitle")} description={t("placement.seoDescription")} pathname="/placement" noindex />
        {error && (
          <div className="mb-4 rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-200">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              onClick={() => startTest(l.id)}
              className="glass rounded-2xl p-4 text-center transition hover:-translate-y-0.5 hover:border-white/20"
            >
              <div className="text-4xl">{l.flag}</div>
              <div className="mt-2 text-sm font-medium text-white">{getLanguageDisplayName(l.id, i18n.language)}</div>
              <div className="text-[11px] text-brand-200/60">{getLanguageDisplayName(l.id, i18n.language)}</div>
            </button>
          ))}
        </div>
        <p className="mt-6 text-center text-[11px] text-brand-200/40">
          {t("placement.loginHint")}
        </p>
      </PageShell>
    );
  }

  // ====== Render: loading ======
  if (phase === "loading") {
    return (
      <PageShell title={t("placement.title")} subtitle={t("placement.loading", { lang: lang ?? "" })}>
        <div className="flex items-center justify-center py-20 text-brand-200/70">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-3 text-sm">{t("placement.loadingText")}</span>
        </div>
      </PageShell>
    );
  }

  // ====== Render: testing ======
  if (phase === "testing" && state && state.currentQuestion) {
    const q = state.currentQuestion;
    const progressPct = Math.round(((state.questionNumber - 1) / MAX_QUESTIONS) * 100);
    return (
      <PageShell
        title={t("placement.questionTitle", { current: state.questionNumber, total: MAX_QUESTIONS })}
        subtitle={t("placement.questionSubtitle", { level: q.level, cefr: cefrEquivalent(lang ?? "en", q.level) ?? "?" })}
      >
        <Seo title={t("placement.seoTitle")} pathname="/placement" noindex />
        {/* 进度条 */}
        <div className="mb-6">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 to-fuchsia-400 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <GlassCard className="flex flex-col">
          <div className="mb-3 inline-flex items-center gap-1.5 self-start rounded-full bg-sky-400/10 px-3 py-1 text-[11px] font-medium text-sky-300">
            <Sparkles className="h-3 w-3" />
            {q.level}
          </div>
          <h2 className="font-display text-xl font-bold text-white md:text-2xl">
            {q.question || t("placement.emptyQuestion")}
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-2">
            {q.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              const isCorrect = i === q.answer;
              const showStyle = revealed
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
                  key={i}
                  disabled={revealed}
                  onClick={() => setSelectedOption(i)}
                  className={
                    "flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition " +
                    showStyle
                  }
                >
                  <span>{opt}</span>
                  {revealed && isCorrect && <Check className="h-4 w-4" />}
                  {revealed && isSelected && !isCorrect && <X className="h-4 w-4" />}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <button
              onClick={() => navigate("/placement")}
              className="text-xs text-brand-200/60 hover:text-white"
            >
              <ArrowLeft className="mr-1 inline h-3 w-3" />{t("placement.reselectLang")}
            </button>
            {!revealed ? (
              <button
                disabled={selectedOption === null}
                onClick={() => {
                  setRevealed(true);
                  // 自动进入下一题（短延迟让用户看到正误）
                  setTimeout(() => submitAnswer(), 900);
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-sky-400 to-fuchsia-500 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-sky-500/20 transition disabled:opacity-40 disabled:shadow-none"
              >
                {t("placement.submit")} <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <span className="text-xs text-brand-200/60">{t("placement.nextQuestion")}</span>
            )}
          </div>
        </GlassCard>
      </PageShell>
    );
  }

  // ====== Render: result ======
  if (phase === "result" && state && lang) {
    const recommendedLevel = computeRecommendation(state);
    const correctCount = state.answers.filter((a) => a.correct).length;
    const cefr = cefrEquivalent(lang, recommendedLevel) ?? "A1";
    const rank = cefrRank(lang, recommendedLevel) || 1;
    const course = COURSES.find((c) => c.language === lang && c.level === recommendedLevel) ?? null;
    return (
      <PageShell
        title={t("placement.resultTitle")}
        subtitle={t("placement.resultSubtitle", { level: recommendedLevel, cefr })}
      >
        <Seo title={t("placement.resultSeoTitle")} pathname="/placement" noindex />

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* 左侧：分数摘要 */}
          <GlassCard className="flex flex-col items-start">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-3 py-1 text-[11px] font-medium text-amber-300">
              <Trophy className="h-3 w-3" />
              {t("placement.testComplete")}
            </div>
            <div className="font-display text-5xl font-bold text-white">
              {correctCount}<span className="text-2xl text-brand-200/50">/{state.answers.length}</span>
            </div>
            <div className="mt-1 text-xs text-brand-200/60">{t("placement.correctCount")}</div>

            <div className="mt-5 w-full space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-200/70">{t("placement.recommendedLevel")}</span>
                <span className="font-semibold text-white">{recommendedLevel}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-200/70">{t("placement.cefrAlignment")}</span>
                <span className="rounded-full bg-sky-400/10 px-2 py-0.5 text-xs text-sky-300">{cefr}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-200/70">{t("placement.cefrRank")}</span>
                <span className="text-white">{rank} / 6</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-200/70">{t("placement.language")}</span>
                <span className="text-white">{getLanguageDisplayName(lang, i18n.language)}</span>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="mt-6 flex w-full flex-col gap-2">
              {course && (
                <button
                  onClick={() => navigate(`/learn/${course.id}`)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-fuchsia-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5"
                >
                  <Sparkles className="h-4 w-4" />
                  {t("placement.startCourse")} <ArrowRight className="h-4 w-4" />
                </button>
              )}
              {!course && (
                <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-3 text-[11px] text-amber-200">
                  {t("placement.noCourseMatch", { level: recommendedLevel })}
                </div>
              )}

              {user ? (
                !savedResult ? (
                  <button
                    disabled={saving}
                    onClick={saveResult}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-brand-100 transition hover:bg-white/10 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    {saving ? t("placement.saving") : t("placement.saveResult")}
                  </button>
                ) : (
                  <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-3 text-[11px] text-emerald-200">
                    {t("placement.saved")}
                  </div>
                )
              ) : (
                <button
                  onClick={() => setShowLoginPrompt(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-brand-100 transition hover:bg-white/10"
                >
                  {t("placement.loginToSave")}
                </button>
              )}

              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 text-xs text-brand-200/60 hover:text-white"
              >
                <RotateCcw className="h-3 w-3" /> {t("placement.retake")}
              </button>
            </div>

            {error && (
              <div className="mt-3 w-full rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-xs text-rose-200">
                {error}
              </div>
            )}
          </GlassCard>

          {/* 右侧：等级详情 */}
          <LevelMetaCard language={lang} level={recommendedLevel} variant="full" />
        </div>

        {showLoginPrompt && <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />}
      </PageShell>
    );
  }

  // Fallback (shouldn't reach here)
  return (
    <PageShell title={t("placement.title")}>
      <div className="py-20 text-center text-brand-200/60">
        {t("placement.errorOccurred")} <button onClick={reset} className="text-sky-300 underline">{t("placement.restart")}</button>
      </div>
    </PageShell>
  );
}
