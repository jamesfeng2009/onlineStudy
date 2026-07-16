/**
 * P0-1: LessonPlayer — renders a single lesson's exercises and lets
 * the user work through them, then mark the lesson complete.
 *
 * Flow:
 *   1. Fetch lesson detail (GET /lessons/:id) → grouped exercises.
 *   2. User clicks "Start" → POST /lessons/:id/start (auth).
 *   3. User works through words / quizzes / listenings / speakings.
 *   4. User clicks "Complete" → POST /lessons/:id/complete (auth).
 *   5. On success, shows the unlocked-next hint and calls onDone.
 *
 * The exercise rendering is intentionally compact (no full SM-2
 * write-through here — the standalone Words/Grammar tabs handle SRS).
 * The player's job is to give a guided, ordered walk-through of one
 * lesson and record its completion.
 */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Check,
  X,
  Clock,
  Trophy,
  Play,
  Pause,
  Mic,
  BookOpen,
  Pen,
  Headphones,
  Volume2,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { GlassCard } from "./GlassCard";
import LoginPromptModal from "./LoginPromptModal";
import { api } from "../lib/api";
import type {
  LessonDetailResp,
  LessonExerciseWord,
  LessonExerciseQuiz,
  LessonExerciseListening,
  LessonExerciseSpeaking,
} from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { speak as ttsSpeak, stopSpeaking } from "../lib/tts";
import type { Language } from "../types";

interface LessonPlayerProps {
  lessonId: string;
  /** Called when the user clicks "back to path". */
  onBack: () => void;
  /** Called after a lesson is completed (so the parent can refresh
   *  the path tree and navigate back). */
  onDone: (unlockedLessonId: string | null) => void;
}

const SKILL_ICON: Record<string, React.ElementType> = {
  vocab: BookOpen,
  grammar: Pen,
  listening: Headphones,
  speaking: Mic,
  mixed: Trophy,
};

export default function LessonPlayer({ lessonId, onBack, onDone }: LessonPlayerProps) {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [lesson, setLesson] = useState<LessonDetailResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [started, setStarted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [completeResult, setCompleteResult] = useState<{
    bestScore: number | null;
    unlockedLessonId: string | null;
  } | null>(null);
  // P1-4: track quiz accuracy to compute checkpoint score.
  const [quizStats, setQuizStats] = useState<{ correct: number; total: number }>({
    correct: 0,
    total: 0,
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setStarted(false);
    setCompleteResult(null);
    api
      .lesson(lessonId)
      .then((l) => {
        if (cancelled) return;
        setLesson(l);
        setStarted(l.status === "in_progress" || l.status === "completed");
      })
      .catch((err) => {
        if (cancelled) return;
        setError((err as Error).message ?? t("lessonPlayer.loadFailed"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
      stopSpeaking();
    };
  }, [lessonId, t]);

  const handleStart = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    try {
      await api.startLesson(lessonId);
      setStarted(true);
    } catch (err) {
      setError((err as Error).message ?? t("lessonPlayer.startFailed"));
    }
  };

  const handleComplete = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setCompleting(true);
    setError(null);
    try {
      // P1-4: for checkpoint lessons, compute a 0-100 score from quiz
      // accuracy so the user has to actually pass to earn the crown.
      const isCheckpoint = !!lesson?.isCheckpoint;
      const score =
        isCheckpoint && quizStats.total > 0
          ? Math.round((quizStats.correct / quizStats.total) * 100)
          : undefined;
      const result = await api.completeLesson(lessonId, score !== undefined ? { score } : undefined);
      setCompleteResult({
        bestScore: result.bestScore,
        unlockedLessonId: result.unlockedLessonId,
      });
    } catch (err) {
      setError((err as Error).message ?? t("lessonPlayer.completeFailed"));
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <GlassCard className="p-8 text-center text-sm text-brand-200/70">
        {t("lessonPlayer.loading")}
      </GlassCard>
    );
  }

  if (error && !lesson) {
    return (
      <GlassCard className="p-8 text-center">
        <div className="text-sm text-rose-300">{error}</div>
        <button
          onClick={onBack}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm text-brand-100 hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" /> {t("lessonPlayer.backToPath")}
        </button>
      </GlassCard>
    );
  }

  if (!lesson) return null;

  const SkillIcon = SKILL_ICON[lesson.skillType] ?? BookOpen;
  const isLocked = lesson.status === "locked";
  const totalExercises = lesson.exerciseIds.length;
  const hasExercises = totalExercises > 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <GlassCard className="p-5">
        <div className="flex items-start gap-4">
          <button
            onClick={onBack}
            className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-white/5 text-brand-200 transition hover:bg-white/10"
            title={t("lessonPlayer.backToPath")}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div
            className={
              "flex h-12 w-12 flex-none items-center justify-center rounded-xl " +
              (lesson.isCheckpoint
                ? "bg-gradient-to-br from-amber-400 to-orange-500 text-slate-900"
                : "bg-gradient-to-br from-sky-400 to-fuchsia-500 text-white")
            }
          >
            {lesson.isCheckpoint ? <Trophy className="h-6 w-6" /> : <SkillIcon className="h-6 w-6" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-brand-200/60">
              <span>{t(`lesson.skill.${lesson.skillType}`) ?? lesson.skillType}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-0.5">
                <Clock className="h-3 w-3" />
                {lesson.durationMin}min
              </span>
              <span>·</span>
              <span>{t("lessonPlayer.exerciseCount", { count: totalExercises })}</span>
              {lesson.bestScore !== null && (
                <>
                  <span>·</span>
                  <span className="text-amber-300">{t("lessonPlayer.bestScore", { score: lesson.bestScore })}</span>
                </>
              )}
            </div>
            <h2 className="mt-1 font-display text-xl font-bold text-white">
              {lesson.title}
            </h2>
          </div>
        </div>

        {/* Locked banner */}
        {isLocked && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
            <Lock className="h-4 w-4" />
            <span>{t("lessonPlayer.lockedHint")}</span>
          </div>
        )}

        {/* Start CTA / status */}
        {!isLocked && !started && (
          <button
            onClick={handleStart}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-fuchsia-400 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
          >
            <Play className="h-4 w-4" /> {t("lessonPlayer.start")}
          </button>
        )}
        {!isLocked && started && !completeResult && (
          <div className="mt-4 flex items-center gap-2 text-xs text-amber-300">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-amber-400" />
            {t("lessonPlayer.inProgressHint")}
          </div>
        )}
      </GlassCard>

      {/* Completion banner */}
      {completeResult && (
        <GlassCard className="border-emerald-400/30 p-5 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" />
          <div className="mt-2 font-display text-lg font-bold text-white">
            {t("lessonPlayer.completed")}
          </div>
          {completeResult.bestScore !== null && (
            <div className="mt-1 text-sm text-amber-300">
              {t("lessonPlayer.scoreThisTime", { score: completeResult.bestScore })}
            </div>
          )}
          {completeResult.unlockedLessonId && (
            <div className="mt-1 text-xs text-brand-200/70">
              {t("lessonPlayer.nextUnlocked")}
            </div>
          )}
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-fuchsia-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
            >
              {t("lessonPlayer.backToPath")}
            </button>
          </div>
          {completeResult.unlockedLessonId && (
            <button
              onClick={() => onDone(completeResult.unlockedLessonId)}
              className="mt-2 text-xs text-sky-300 hover:underline"
            >
              {t("lessonPlayer.nextLesson")} →
            </button>
          )}
        </GlassCard>
      )}

      {/* Empty exercises */}
      {!isLocked && !hasExercises && !completeResult && (
        <GlassCard className="p-5 text-center text-sm text-brand-200/70">
          {t("lessonPlayer.emptyExercises")}
          <br />
          {t("lessonPlayer.emptyExercisesHint")}
        </GlassCard>
      )}

      {/* Exercises */}
      {!isLocked && !completeResult && hasExercises && (
        <>
          {lesson.exercises.words.length > 0 && (
            <WordExercises
              words={lesson.exercises.words}
              language={lesson.course?.language as Language | undefined}
            />
          )}
          {lesson.exercises.quizzes.length > 0 && (
            <QuizExercises
              quizzes={lesson.exercises.quizzes}
              onProgress={setQuizStats}
            />
          )}
          {lesson.exercises.listenings.length > 0 && (
            <ListeningExercises
              listenings={lesson.exercises.listenings}
              language={lesson.course?.language as Language | undefined}
              isLoggedIn={!!user}
              onNeedLogin={() => setShowLogin(true)}
            />
          )}
          {lesson.exercises.speakings.length > 0 && (
            <SpeakingExercises
              speakings={lesson.exercises.speakings}
              language={lesson.course?.language as Language | undefined}
              isLoggedIn={!!user}
              onNeedLogin={() => setShowLogin(true)}
            />
          )}

          {/* Complete CTA */}
          <GlassCard className="p-5 text-center">
            <button
              onClick={handleComplete}
              disabled={completing}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              {completing ? t("lessonPlayer.submitting") : t("lessonPlayer.complete")}
            </button>
            <div className="mt-2 text-xs text-brand-200/50">
              {t("lessonPlayer.completeHint")}
            </div>
          </GlassCard>
        </>
      )}

      {error && (
        <div className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
          {error}
        </div>
      )}

      {showLogin && <LoginPromptModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}

/* ===============================
   Word exercises (flashcards)
================================== */
function WordExercises({
  words,
  language,
}: {
  words: LessonExerciseWord[];
  language: Language | undefined;
}) {
  const { t } = useTranslation();
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [unknown, setUnknown] = useState(0);
  const card = words[i % Math.max(1, words.length)];

  const playAudio = async () => {
    if (!language || !card) return;
    await ttsSpeak(card.word, { language, rate: 0.9 });
  };

  return (
    <GlassCard>
      <div className="mb-3 flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1.5 text-sky-300">
          <BookOpen className="h-4 w-4" /> {t("lessonPlayer.vocabTitle", { count: words.length })}
        </span>
        <span className="text-brand-200/70">
          <span className="text-emerald-300">✓ {known}</span>{" "}
          <span className="text-rose-300">✗ {unknown}</span>
        </span>
      </div>
      {card && (
        <div className="card-flip">
          <div
            className={"card-flip-inner" + (flipped ? " is-flipped" : "")}
            onClick={() => setFlipped((f) => !f)}
            style={{ cursor: "pointer" }}
          >
            <div className="card-face glass flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/20 via-slate-900/20 to-fuchsia-500/20 p-8">
              <div className="text-xs uppercase tracking-[0.3em] text-sky-300">{t("learn.word")}</div>
              <div className="mt-3 font-display text-4xl font-bold text-white">{card.word}</div>
              {card.phonetic && (
                <div className="mt-2 text-sm text-brand-200/70">{card.phonetic}</div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  void playAudio();
                }}
                className="mt-4 inline-flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1 text-xs text-brand-100 hover:bg-white/10"
              >
                <Volume2 className="h-3 w-3" /> {t("lessonPlayer.readAloud")}
              </button>
              <div className="mt-4 text-xs text-brand-200/50">{t("lessonPlayer.tapToFlip")}</div>
            </div>
            <div className="card-face back glass flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/20 via-slate-900/20 to-rose-500/20 p-8">
              <div className="text-xs uppercase tracking-[0.3em] text-amber-300">{t("learn.translation")}</div>
              <div className="mt-3 font-display text-2xl font-bold text-white">{card.translation}</div>
              <div className="mt-4 max-w-md text-center text-sm italic text-brand-100/90">
                "{card.exampleSentence}"
              </div>
              {card.exampleTranslation && (
                <div className="mt-2 text-xs text-brand-200/60">{card.exampleTranslation}</div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          onClick={() => {
            setUnknown((n) => n + 1);
            setFlipped(false);
            setI((n) => n + 1);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-200 hover:bg-rose-500/20"
        >
          <X className="h-4 w-4" /> {t("learn.notFamiliar")}
        </button>
        <button
          onClick={() => {
            setKnown((n) => n + 1);
            setFlipped(false);
            setI((n) => n + 1);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:-translate-y-0.5"
        >
          <Check className="h-4 w-4" /> {t("learn.remembered")}
        </button>
      </div>
    </GlassCard>
  );
}

/* ===============================
   Quiz exercises (MCQ)
================================== */
function QuizExercises({
  quizzes,
  onProgress,
}: {
  quizzes: LessonExerciseQuiz[];
  onProgress?: (stats: { correct: number; total: number }) => void;
}) {
  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const q = quizzes[idx % Math.max(1, quizzes.length)];

  const next = () => {
    setPick(null);
    setIdx((n) => n + 1);
  };

  // P1-4: report progress to parent so checkpoint scoring can use it.
  useEffect(() => {
    onProgress?.({ correct, total: correct + wrong });
  }, [correct, wrong, onProgress]);

  if (!q) return null;

  return (
    <GlassCard>
      <div className="mb-3 flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1.5 text-fuchsia-300">
          <Pen className="h-4 w-4" /> {t("lessonPlayer.grammarTitle", { count: quizzes.length })}
        </span>
        <span className="text-brand-200/70">
          {t("lessonPlayer.correct")} <span className="text-emerald-300">{correct}</span> · {t("lessonPlayer.wrong")}{" "}
          <span className="text-rose-300">{wrong}</span>
        </span>
      </div>
      <div className="font-display text-lg font-semibold text-white">{q.question}</div>
      <div className="mt-4 grid gap-2">
        {q.options.map((opt, i) => {
          const isAns = i === q.answer;
          const isPick = pick !== null && i === pick;
          let cls = "border-white/10 bg-white/5 hover:bg-white/10 text-white";
          if (pick !== null) {
            if (isAns) cls = "border-emerald-400/50 bg-emerald-400/15 text-emerald-100";
            else if (isPick) cls = "border-rose-400/50 bg-rose-500/15 text-rose-100";
            else cls = "border-white/10 bg-white/5 text-brand-100/60";
          }
          return (
            <button
              key={i}
              disabled={pick !== null}
              onClick={() => {
                setPick(i);
                if (i === q.answer) setCorrect((n) => n + 1);
                else setWrong((n) => n + 1);
              }}
              className={"flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-sm transition " + cls}
            >
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-md bg-white/5 text-xs font-bold text-brand-200">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{opt}</span>
              {pick !== null && isAns && <Check className="h-4 w-4 text-emerald-300" />}
              {pick !== null && isPick && !isAns && <X className="h-4 w-4 text-rose-300" />}
            </button>
          );
        })}
      </div>
      {pick !== null && (
        <div className="mt-4 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-50/90">
          <span className="font-semibold">{t("lessonPlayer.explanation")}</span>
          {q.explain}
        </div>
      )}
      <div className="mt-4 flex justify-end">
        <button
          onClick={next}
          disabled={pick === null}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-fuchsia-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 disabled:opacity-40"
        >
          {t("lessonPlayer.next")} →
        </button>
      </div>
    </GlassCard>
  );
}

/* ===============================
   Listening exercises
================================== */
function ListeningExercises({
  listenings,
  language,
  isLoggedIn,
  onNeedLogin,
}: {
  listenings: LessonExerciseListening[];
  language: Language | undefined;
  isLoggedIn: boolean;
  onNeedLogin: () => void;
}) {
  const { t } = useTranslation();
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const item = listenings[i % Math.max(1, listenings.length)];

  const play = async () => {
    if (playing) {
      stopSpeaking();
      setPlaying(false);
      return;
    }
    if (!isLoggedIn) {
      onNeedLogin();
      return;
    }
    if (!language || !item) return;
    setPlaying(true);
    await ttsSpeak(item.script, { language, rate: 0.9 });
    setPlaying(false);
  };

  if (!item) return null;

  return (
    <GlassCard>
      <div className="mb-3 flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1.5 text-sky-300">
          <Headphones className="h-4 w-4" /> {t("lessonPlayer.listeningTitle", { count: listenings.length })}
        </span>
        <span className="text-brand-200/70">{i + 1} / {listenings.length}</span>
      </div>
      <div className="text-sm font-semibold text-white">{item.title}</div>
      <button
        onClick={play}
        className="mt-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-white transition hover:-translate-y-1"
      >
        {playing ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7" />}
      </button>
      <div className="mt-2 text-xs text-brand-200/70">
        {playing ? t("lessonPlayer.playing") : t("lessonPlayer.tapToPlay")}
      </div>
      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-brand-100/90">
        {item.script}
      </div>
      <div className="mt-3 flex justify-end">
        <button
          onClick={() => setI((n) => n + 1)}
          className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5 text-xs text-brand-100 hover:bg-white/10"
        >
          {t("lessonPlayer.nextSegment")} →
        </button>
      </div>
    </GlassCard>
  );
}

/* ===============================
   Speaking exercises
================================== */
const BCP47: Record<string, string> = {
  en: "en-US", ja: "ja-JP", ko: "ko-KR", zh: "zh-CN",
  es: "es-ES", fr: "fr-FR", de: "de-DE", it: "it-IT",
  th: "th-TH", yue: "zh-HK",
};

function SpeakingExercises({
  speakings,
  language,
  isLoggedIn,
  onNeedLogin,
}: {
  speakings: LessonExerciseSpeaking[];
  language: Language | undefined;
  isLoggedIn: boolean;
  onNeedLogin: () => void;
}) {
  const { t } = useTranslation();
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const p = speakings[i % Math.max(1, speakings.length)];

  const play = async () => {
    if (playing) {
      stopSpeaking();
      setPlaying(false);
      return;
    }
    if (!isLoggedIn) {
      onNeedLogin();
      return;
    }
    if (!language || !p) return;
    setPlaying(true);
    await ttsSpeak(p.phrase, { language, rate: 0.9 });
    setPlaying(false);
  };

  // Optional STT listen (reuses the vendor-prefixed API). Keep it
  // minimal — the full pronunciation scoring lives in the Speaking
  // tab. Here we just offer play + a "I said it" acknowledge button.
  if (!p) return null;

  return (
    <GlassCard>
      <div className="mb-3 flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1.5 text-amber-300">
          <Mic className="h-4 w-4" /> {t("lessonPlayer.speakingTitle", { count: speakings.length })}
        </span>
        <span className="text-brand-200/70">{i + 1} / {speakings.length}</span>
      </div>
      <div className="text-center">
        <div className="text-lg text-brand-200/80">{p.translation}</div>
        {p.phonetic && <div className="mt-1 text-xs text-brand-200/60">{p.phonetic}</div>}
      </div>
      <div className="mt-4 flex justify-center gap-2">
        <button
          onClick={play}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-500 text-white transition hover:-translate-y-1"
          title={t("lessonPlayer.readAloud")}
        >
          {playing ? <Pause className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
        </button>
        <button
          onClick={() => setI((n) => n + 1)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
        >
          {t("lessonPlayer.nextSentence")} →
        </button>
      </div>
      <div className="mt-2 text-center text-xs text-brand-200/50">
        {t("lessonPlayer.speakingHint")}
      </div>
      <input
        type="hidden"
        value={language ? BCP47[language] ?? "en-US" : "en-US"}
        readOnly
      />
    </GlassCard>
  );
}
