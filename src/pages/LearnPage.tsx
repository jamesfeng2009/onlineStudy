import { useEffect, useMemo, useState } from "react";
import { BookOpen, Pen, Mic, Headphones, Check, X, RotateCcw, ArrowRight, Lightbulb, Play, Pause, MessageSquare } from "lucide-react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageShell from "../components/PageShell";
import { Seo } from "../components/Seo";
import { GlassCard } from "../components/GlassCard";
import LoginPromptModal from "../components/LoginPromptModal";
import PronunciationScore from "../components/PronunciationScore";
import { api } from "../lib/api";
import type { WordResp } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { useProgressStore } from "../store/progressStore";
import { useReviewStore, trackWordReview, trackQuizReview } from "../store/reviewStore";
import { useMistakeStore } from "../store/mistakeStore";
import { describeNextInterval, scheduleNext, INITIAL_SRS_STATE } from "../lib/sm2";
import { speak as ttsSpeak, stopSpeaking, SPEED_PRESETS } from "../lib/tts";
import { WORDS, getWords, getQuizzes, getSpeaking, getListening } from "../data/content";
import { COURSES } from "../data/courses";
import { LANGUAGES, getLanguage } from "../data/languages";
import { getWordFamily } from "../data/word-families";
import { getGrammarPoints, getGrammarPoint, matchGrammarPoint } from "../data/grammar-points";
import GrammarMap from "../components/GrammarMap";
import { getDialogueScenes } from "../data/dialogue-scenes";
import { runConversationTurn, startConversation } from "../lib/conversation";
import type { ConversationState } from "../lib/conversation";
import type { Language, WordFamily, ReviewQuality, DialogueScene } from "../types";

type Tab = "words" | "grammar" | "speaking" | "listening" | "review" | "conversation";

/** Small chip showing the other words in a word family. */
function WordFamilyChip({ family, currentWord }: { family: WordFamily; currentWord?: string }) {
  const others = family.members.filter((m) => m.word !== currentWord);
  if (others.length === 0) return null;
  return (
    <div className="mt-3 max-w-md rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-center text-xs">
      <div className="text-emerald-300">词族 · 共 {family.members.length} 词</div>
      <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1.5">
        {others.slice(0, 6).map((m) => (
          <span
            key={m.word}
            className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 text-brand-100/90"
            title={m.meaning}
          >
            <span className="text-white">{m.word}</span>
            <span className="text-[10px] text-brand-200/50">{m.pos}</span>
          </span>
        ))}
      </div>
      {family.rootMeaning && (
        <div className="mt-1.5 text-[10px] text-brand-200/50">
          共同词根: <span className="font-mono text-sky-300">{family.root}</span> = {family.rootMeaning}
        </div>
      )}
    </div>
  );
}

/** Map app Language → BCP-47 tag for Web Speech API (TTS + STT). */
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
};

export default function LearnPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { courseId } = useParams<{ courseId?: string }>();
  const course = useMemo(() => {
    if (!courseId) return null;
    return COURSES.find((c) => c.id === courseId) ?? null;
  }, [courseId]);

  const TABS: { key: Tab; label: string; icon: React.ElementType; desc: string }[] = [
    { key: "words", label: t("learn.wordMemory"), icon: BookOpen, desc: t("learn.wordMemoryDesc") },
    { key: "grammar", label: t("learn.grammar"), icon: Pen, desc: t("learn.grammarDesc") },
    { key: "speaking", label: t("learn.speaking"), icon: Mic, desc: t("learn.speakingDesc") },
    { key: "listening", label: t("learn.listening"), icon: Headphones, desc: t("learn.listeningDesc") },
    { key: "review", label: "复习", icon: RotateCcw, desc: "SM-2 间隔重复，巩固记忆" },
    { key: "conversation", label: "对话", icon: MessageSquare, desc: "场景化多轮对话练习" },
  ];

  const [tab, setTab] = useState<Tab>("words");
  const reviewHydrate = useReviewStore((s) => s.hydrate);
  const mistakeHydrate = useMistakeStore((s) => s.hydrate);
  const dueCount = useReviewStore((s) => s.dueCount());
  useEffect(() => { reviewHydrate(); mistakeHydrate(); }, [reviewHydrate, mistakeHydrate]);
  const [lang, setLang] = useState<Language>(
    (course?.language as Language) ?? (user?.targetLanguage as Language) ?? "en"
  );
  const level = course?.level;
  const locked = !!course;
  const isLoggedIn = !!user;
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const onNeedLogin = () => setShowLoginPrompt(true);

  useEffect(() => {
    if (course) {
      setLang(course.language as Language);
    }
  }, [course]);

  const title = course
    ? `${course.title}`
    : t("learn.wordMemory");
  const subtitle = course
    ? `${getLanguage(course.language).flag} ${getLanguage(course.language).native} · ${course.level} · ${course.description}`
    : t("learn.wordMemoryDesc");

  return (
    <PageShell
      title={title}
      subtitle={subtitle}
      action={
        <>
          <Seo
            title={title}
            description={subtitle}
            noindex
            pathname={`/learn/${courseId ?? ""}`}
          />
          {locked ? (
            <div className="glass flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-brand-200/80">
              <span>{getLanguage(lang).flag}</span>
              <span>{getLanguage(lang).native}</span>
              <span className="text-white/30">|</span>
              <span>{course?.level}</span>
            </div>
          ) : (
            <div className="glass flex items-center gap-1 rounded-full p-1">
            {LANGUAGES.map((l) => (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                className={
                  "rounded-full px-3 py-1.5 text-xs transition " +
                  (lang === l.id ? "bg-white/15 text-white shadow-inner" : "text-brand-200/70 hover:text-white")
                }
              >
                {l.flag} {l.native}
              </button>
            ))}
          </div>
          )}
        </>
      }
    >
      {/* Tab switcher */}
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {TABS.map((tabItem) => {
          const Icon = tabItem.icon;
          const active = tab === tabItem.key;
          return (
            <button
              key={tabItem.key}
              onClick={() => setTab(tabItem.key)}
              className={
                "glass relative overflow-hidden rounded-2xl p-4 text-left transition " +
                (active
                  ? "-translate-y-0.5 ring-1 ring-sky-400/40 shadow-lg shadow-sky-500/10"
                  : "opacity-90 hover:-translate-y-0.5 hover:opacity-100")
              }
            >
              <div className="flex items-center justify-between">
                <div className={"flex h-10 w-10 items-center justify-center rounded-xl " + (active ? "bg-gradient-to-br from-sky-400 to-fuchsia-500 text-white" : "bg-white/5 text-brand-200")}>
                  <Icon className="h-5 w-5" />
                </div>
                {active && <span className="text-[10px] text-sky-300">{t("learn.inUse")}</span>}
              </div>
              <div className="mt-3 font-semibold text-white">{tabItem.label}</div>
              <div className="mt-1 text-xs text-brand-200/70">{tabItem.desc}</div>
              {tabItem.key === "review" && dueCount > 0 && (
                <span className="absolute right-3 top-3 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
                  {dueCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {tab === "words" && <WordsModule language={lang} level={level} isLoggedIn={isLoggedIn} onNeedLogin={onNeedLogin} />}
      {tab === "grammar" && <GrammarModule language={lang} level={level} isLoggedIn={isLoggedIn} onNeedLogin={onNeedLogin} />}
      {tab === "speaking" && <SpeakingModule language={lang} level={level} isLoggedIn={isLoggedIn} onNeedLogin={onNeedLogin} />}
      {tab === "listening" && <ListeningModule language={lang} level={level} isLoggedIn={isLoggedIn} onNeedLogin={onNeedLogin} />}
      {tab === "review" && <ReviewModule language={lang} isLoggedIn={isLoggedIn} onNeedLogin={onNeedLogin} dueCount={dueCount} />}
      {tab === "conversation" && <ConversationModule language={lang} level={level} isLoggedIn={isLoggedIn} onNeedLogin={onNeedLogin} />}

      {showLoginPrompt && <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />}
    </PageShell>
  );
}

/* ===============================
   单词记忆 — Flashcards
================================== */
function WordsModule({ language, level, isLoggedIn, onNeedLogin }: { language: Language; level?: string; isLoggedIn: boolean; onNeedLogin: () => void }) {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const recordWord = useProgressStore((s) => s.recordWord);
  const [apiWords, setApiWords] = useState<WordResp[]>([]);
  const [apiLoading, setApiLoading] = useState(true);
  const nativeLanguage = (user?.nativeLanguage as string) || "en";

  useEffect(() => {
    setApiLoading(true);
    const alive = true;
    api
      .words({ language, level, nativeLanguage })
      .then((data) => {
        if (alive) setApiWords(data);
      })
      .catch(() => {
        if (alive) setApiWords([]);
      })
      .finally(() => {
        if (alive) setApiLoading(false);
      });
  }, [language, level, nativeLanguage]);

  const words = useMemo(() => {
    if (apiWords.length > 0) {
      return apiWords.map((w) => ({
        word: w.word,
        translation: w.translation,
        phonetic: w.phonetic,
        example: w.exampleSentence,
      }));
    }
    const local = getWords(language, level);
    if (local && local.length > 0) return local;
    return WORDS;
  }, [apiWords, language, level]);

  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [unknown, setUnknown] = useState(0);
  const card = words[i % Math.max(1, words.length)];

  const next = async (k: boolean) => {
    if (!isLoggedIn) { onNeedLogin(); return; }
    const id = (card as { id?: string })?.id;
    // Derive SM-2 quality from the remembered/not-familiar button so
    // the backend can keep its SRS copy in sync (write-through).
    const quality: ReviewQuality = k ? "good" : "again";
    const existingSrs = id ? useReviewStore.getState().items[id]?.srs : undefined;
    const nextSrs = scheduleNext(existingSrs ?? INITIAL_SRS_STATE, quality);
    await recordWord(k, {
      itemId: id,
      language,
      level,
      quality,
      srsState: {
        easeFactor: nextSrs.easeFactor,
        interval: nextSrs.interval,
        repetitions: nextSrs.repetitions,
        nextReviewAt: nextSrs.nextReviewAt,
      },
    });
    if (!k) {
      // Mark unknown → add to SRS review queue so it resurfaces later.
      if (id) {
        trackWordReview({
          itemId: id,
          word: (card as { word?: string }).word ?? "",
          translation: (card as { translation?: string }).translation ?? "",
          phonetic: (card as { phonetic?: string }).phonetic,
          language,
          level,
        });
      }
    }
    if (k) setKnown((n) => n + 1);
    else setUnknown((n) => n + 1);
    setFlipped(false);
    setI((n) => n + 1);
  };
  const pct = Math.round(((i % words.length) / Math.max(1, words.length)) * 100);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <GlassCard className="flex min-h-[380px] flex-col">
          <div className="flex items-center justify-between text-xs">
            <span className="text-brand-200/70">
              {t("learn.card", { current: i + 1, total: words.length })}
            </span>
            <span className="text-brand-200/70">
              <span className="text-emerald-300">✓ {known}</span>{" "}
              <span className="text-rose-300">✗ {unknown}</span>
            </span>
          </div>
          <div className="h-20px my-3 h-[3px] overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-fuchsia-400 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>

          {apiLoading && apiWords.length === 0 ? (
            <div className="flex flex-1 items-center justify-center text-sm text-brand-200/70">
              {t("common.loading")}
            </div>
          ) : (
            <div className="card-flip flex-1">
              <div className={"card-flip-inner" + (flipped ? " is-flipped" : "")} onClick={() => setFlipped((f) => !f)} style={{ cursor: "pointer" }}>
                <div className="card-face glass flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/20 via-slate-900/20 to-fuchsia-500/20 p-10">
                  <div className="text-xs uppercase tracking-[0.3em] text-sky-300">{t("learn.word")}</div>
                  <div className="mt-4 font-display text-5xl font-bold text-white md:text-6xl">{card?.word}</div>
                  {card?.phonetic && <div className="mt-3 text-sm text-brand-200/70">{card.phonetic}</div>}
                  <div className="mt-8 text-xs text-brand-200/50">{t("learn.tapToSeeMeaning")} ↻</div>
                </div>
                <div className="card-face back glass flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/20 via-slate-900/20 to-rose-500/20 p-10">
                  <div className="text-xs uppercase tracking-[0.3em] text-amber-300">{t("learn.translation")} · {t("learn.example")}</div>
                  <div className="mt-4 font-display text-3xl font-bold text-white md:text-4xl">{card?.translation}</div>
                  <div className="mt-6 max-w-md text-center text-sm italic text-brand-100/90">"{card?.example}"</div>

                  {/* Word root meaning (English / Latin roots) */}
                  {(card as { root?: string; rootMeaning?: string })?.rootMeaning && (
                    <div className="mt-4 max-w-md rounded-lg border border-sky-400/20 bg-sky-400/5 px-3 py-2 text-center text-xs">
                      <span className="text-sky-300">词根 · </span>
                      <span className="font-mono text-white">{(card as { root?: string }).root}</span>
                      <span className="text-brand-200/70"> = {(card as { rootMeaning?: string }).rootMeaning}</span>
                    </div>
                  )}

                  {/* Word family network */}
                  {(() => {
                    const famId = (card as { familyId?: string })?.familyId;
                    if (!famId) return null;
                    const fam = getWordFamily(famId);
                    if (!fam || fam.members.length <= 1) return null;
                    return <WordFamilyChip family={fam} currentWord={card?.word} />;
                  })()}

                  <div className="mt-6 text-xs text-brand-200/50">{t("learn.tapToSeeMeaning")} ↻</div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => next(false)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-200 transition hover:bg-rose-500/20"
            >
              <X className="h-4 w-4" /> {t("learn.notFamiliar")}
            </button>
            <button
              onClick={() => next(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
            >
              <Check className="h-4 w-4" /> {t("learn.remembered")}
            </button>
          </div>
        </GlassCard>
      </div>

      <div className="space-y-4">
        <GlassCard className="p-5">
          <div className="text-xs uppercase tracking-wider text-brand-200/60">{t("learn.word")}</div>
          <div className="mt-2 font-display text-3xl font-bold text-white">{i}</div>
          <div className="text-xs text-brand-200/60">{t("learn.tapToSeeMeaning")} · {i === 0 ? "—" : `${Math.round((known / i) * 100)}%`}</div>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="mb-3 text-xs uppercase tracking-wider text-brand-200/60">{t("learn.tips")}</div>
          <ul className="space-y-2 text-sm text-brand-100/90">
            <li>· {t("learn.wordMemoryDesc")}</li>
            <li>· {t("learn.speakingDesc")}</li>
            <li>· {t("learn.listeningDesc")}</li>
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}

/* ===============================
   语法练习
================================== */
function GrammarModule({ language, level, isLoggedIn, onNeedLogin }: { language: Language; level?: string; isLoggedIn: boolean; onNeedLogin: () => void }) {
  const recordQuiz = useProgressStore((s) => s.recordQuiz);
  const recordMistake = useMistakeStore((s) => s.recordWrong);
  const mistakes = useMistakeStore((s) => s.byLanguage(language));
  const quizzes = useMemo(() => {
    const base = getQuizzes(language, level);
    return base && base.length >= 2 ? base : getQuizzes("en");
  }, [language, level]);
  const grammarPoints = useMemo(() => getGrammarPoints(language), [language]);

  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  const q = quizzes[i % Math.max(1, quizzes.length)];
  // Resolve the grammar point of the current quiz. If the quiz has
  // no explicit grammarPointId, try to match by question keywords.
  const grammarPointId = q.grammarPointId ?? matchGrammarPoint(language, q.question);
  const currentPoint = grammarPointId ? getGrammarPoint(grammarPointId) : undefined;

  const submit = async () => {
    if (pick === null) return;
    if (!isLoggedIn) { onNeedLogin(); return; }
    const ok = pick === q.answer;
    // Derive SM-2 quality so the backend can keep its SRS copy in sync
    // (write-through). Wrong answers map to "again" (lapse).
    const quality: ReviewQuality = ok ? "good" : "again";
    const existingSrs = useReviewStore.getState().items[q.id]?.srs;
    const nextSrs = scheduleNext(existingSrs ?? INITIAL_SRS_STATE, quality);
    await recordQuiz(ok, {
      itemId: q.id,
      language,
      level,
      selectedOption: pick,
      correctOption: q.answer,
      grammarPointId,
      quality,
      srsState: {
        easeFactor: nextSrs.easeFactor,
        interval: nextSrs.interval,
        repetitions: nextSrs.repetitions,
        nextReviewAt: nextSrs.nextReviewAt,
      },
    });
    if (ok) setCorrect((n) => n + 1);
    else {
      setWrong((n) => n + 1);
      // Wrong answer → add to SRS review queue.
      trackQuizReview({
        itemId: q.id,
        question: q.question,
        answer: q.options[q.answer] ?? "",
        explain: q.explain,
        language,
        level,
      });
      // Also record the mistake on the grammar point (if any) so the
      // GrammarMap can mark it red.
      if (grammarPointId) recordMistake(grammarPointId, language);
    }
  };
  const next = () => {
    setPick(null);
    setI((n) => n + 1);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <GlassCard>
          <div className="flex items-center justify-between text-xs">
            <span className="text-brand-200/70">
              第 {(i % quizzes.length) + 1} / {quizzes.length} 题
            </span>
            <span className="text-brand-200/70">
              正确 <span className="text-emerald-300">{correct}</span> · 错误{" "}
              <span className="text-rose-300">{wrong}</span>
            </span>
          </div>
          <div className="mt-4 font-display text-2xl font-semibold leading-snug text-white md:text-3xl">
            {q.question}
          </div>
          <div className="mt-6 grid gap-3">
            {q.options.map((opt: string, idx: number) => {
              const isAns = idx === q.answer;
              const isPick = pick !== null && idx === pick;
              let cls = "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white";
              if (pick !== null) {
                if (isAns) cls = "border-emerald-400/50 bg-emerald-400/15 text-emerald-100";
                else if (isPick) cls = "border-rose-400/50 bg-rose-500/15 text-rose-100";
                else cls = "border-white/10 bg-white/5 text-brand-100/60";
              } else if (pick === idx) {
                cls = "border-sky-400/50 bg-sky-400/15 text-white";
              }
              return (
                <button
                  key={idx}
                  disabled={pick !== null}
                  onClick={() => setPick(idx)}
                  className={"flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition " + cls}
                >
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-brand-200">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {pick !== null && isAns && <Check className="h-4 w-4 text-emerald-300" />}
                  {pick !== null && isPick && !isAns && <X className="h-4 w-4 text-rose-300" />}
                </button>
              );
            })}
          </div>

          {pick !== null && (
            <div className="mt-6 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-200">
                <Lightbulb className="h-4 w-4" /> 解析
              </div>
              <div className="mt-2 text-sm text-amber-50/90">{q.explain}</div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-end gap-3">
            {pick === null ? (
              <button
                onClick={submit}
                disabled={pick === null && pick !== 0 && pick === null}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-fuchsia-400 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 disabled:opacity-40"
              >
                提交答案 <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={next}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-fuchsia-400 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
              >
                下一题 <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </GlassCard>
      </div>

      <div className="space-y-4">
        <GlassCard className="p-5">
          <div className="text-xs uppercase tracking-wider text-brand-200/60">正确率</div>
          <div className="mt-2 font-display text-3xl font-bold text-white">{i === 0 ? "—" : `${Math.round((correct / i) * 100)}%`}</div>
          <div className="text-xs text-brand-200/60">已作答 {i} 题</div>
        </GlassCard>

        {currentPoint && currentPoint.pitfalls.length > 0 && (
          <GlassCard className="p-5">
            <div className="mb-2 text-xs uppercase tracking-wider text-rose-300/70">本题易混点 · {currentPoint.title}</div>
            <ul className="space-y-1.5 text-sm">
              {currentPoint.pitfalls.map((p, idx) => (
                <li key={idx} className="flex flex-wrap items-center gap-2">
                  <span className="text-rose-300 line-through">{p.wrong}</span>
                  <span className="text-brand-200/40">→</span>
                  <span className="text-emerald-300">{p.right}</span>
                  {p.note && <span className="text-[10px] text-brand-200/50">({p.note})</span>}
                </li>
              ))}
            </ul>
          </GlassCard>
        )}

        {grammarPoints.length > 0 && (
          <GlassCard className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-brand-200/60">语法依赖图</div>
              {mistakes.length > 0 && (
                <span className="text-[10px] text-rose-300/70">易错 {mistakes.length} 点</span>
              )}
            </div>
            <GrammarMap
              language={language}
              points={grammarPoints}
              mistakes={mistakes}
              highlightId={grammarPointId}
            />
          </GlassCard>
        )}
      </div>
    </div>
  );
}

/* ===============================
   口语跟读
================================== */
function SpeakingModule({ language, level, isLoggedIn, onNeedLogin }: { language: Language; level?: string; isLoggedIn: boolean; onNeedLogin: () => void }) {
  const recordSpeaking = useProgressStore((s) => s.recordSpeaking);
  const phrases = useMemo(() => getSpeaking(language, level), [language, level]);
  const [i, setI] = useState(0);
  const [count, setCount] = useState(0);
  const p = phrases[i % Math.max(1, phrases.length)];

  const handleScored = (score: number) => {
    recordSpeaking(Math.max(1, Math.round(score / 10)), language, { itemId: p.id, score });
    setCount((c) => c + 1);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <GlassCard>
          <div className="mb-5 text-center">
            <div className="text-lg text-brand-200/80">{p.translation}</div>
            {p.phonetic && <div className="mt-1 text-xs text-brand-200/60">{p.phonetic}</div>}
          </div>

          {isLoggedIn ? (
            <PronunciationScore
              key={i}
              text={p.phrase}
              lang={BCP47[language]}
              onScored={handleScored}
            />
          ) : (
            <div className="flex flex-col items-center py-8">
              <button
                onClick={onNeedLogin}
                className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-500 text-white shadow-[0_0_60px_-10px] shadow-fuchsia-500/40 transition hover:-translate-y-1"
              >
                <Mic className="h-10 w-10" />
              </button>
              <div className="mt-4 text-sm text-brand-100">登录后开始跟读评分</div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setI((n) => n + 1)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
            >
              下一句 <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </GlassCard>
      </div>

      <div className="space-y-4">
        <GlassCard className="p-5">
          <div className="text-xs uppercase tracking-wider text-brand-200/60">本次练习</div>
          <div className="mt-2 font-display text-3xl font-bold text-white">{count} 次</div>
          <div className="text-xs text-brand-200/60">已跟读次数</div>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="mb-2 text-xs uppercase tracking-wider text-brand-200/60">其他句子</div>
          <div className="space-y-2">
            {phrases.slice(0, 4).map((x, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-left text-xs text-brand-100 hover:bg-white/10"
              >
                {x.phrase}
                <div className="mt-1 text-[10px] text-brand-200/60">{x.translation}</div>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

/* ===============================
   听力训练
================================== */
function ListeningModule({ language, level, isLoggedIn, onNeedLogin }: { language: Language; level?: string; isLoggedIn: boolean; onNeedLogin: () => void }) {
  const recordListening = useProgressStore((s) => s.recordListening);
  const allItems = useMemo(() => getListening(language, level), [language, level]);
  const [sceneFilter, setSceneFilter] = useState<string>("all");
  const items = useMemo(() => {
    if (sceneFilter === "all") return allItems;
    return allItems.filter((it) => (it.scene ?? "daily") === sceneFilter);
  }, [allItems, sceneFilter]);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [inputs, setInputs] = useState<Record<number, string>>({});
  const [sessions, setSessions] = useState(0);
  const [speed, setSpeed] = useState<number>(0.8);

  // Reset index when items change (scene filter switched).
  useEffect(() => { setI(0); setReveal(false); setInputs({}); }, [sceneFilter]);

  const L = items[i % Math.max(1, items.length)];
  const tokens = L.tokens ?? L.script.split(" ");
  const availableSpeeds = L.speeds ?? [0.8, 1.0];

  const play = async () => {
    if (playing) {
      stopSpeaking();
      setPlaying(false);
      return;
    }
    if (!isLoggedIn) { onNeedLogin(); return; }
    setPlaying(true);
    await ttsSpeak(L.script, { language, rate: speed });
    setPlaying(false);
    // Snapshot the user's blank-fill progress for this listening item so
    // the backend can store per-item analytics. Blanks the user hasn't
    // filled yet count as incorrect.
    const totalBlanks = L.blanks.length;
    const blankResults = L.blanks.map((b) => {
      const val = (inputs[b.index] ?? "").trim().toLowerCase();
      return val.length > 0 && val === b.answer.toLowerCase();
    });
    const correctCount = blankResults.filter(Boolean).length;
    recordListening(
      Math.max(1, Math.ceil(L.script.length / 20)),
      language,
      { itemId: L.id, blankResults, correctCount, totalBlanks },
    );
  };

  // Re-play at a different speed without recording minutes again.
  const replayAt = async (rate: number) => {
    setSpeed(rate);
    if (playing) {
      stopSpeaking();
      setPlaying(false);
    }
    if (!isLoggedIn) { onNeedLogin(); return; }
    setPlaying(true);
    await ttsSpeak(L.script, { language, rate });
    setPlaying(false);
  };

  const check = () => {
    setReveal(true);
    setSessions((n) => n + 1);
  };
  const reset = () => {
    setInputs({});
    setReveal(false);
    setI((n) => n + 1);
  };

  const blankIndices = new Set(L.blanks.map((b) => b.index));
  const scenes = useMemo(() => {
    const set = new Set(allItems.map((it) => it.scene ?? "daily"));
    return ["all", ...Array.from(set)];
  }, [allItems]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <GlassCard>
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-[0.3em] text-sky-300">{L.title}{L.accent ? ` · ${L.accent}` : ""}</div>
            <span className="text-xs text-brand-200/60">第 {(i % items.length) + 1} / {items.length}</span>
          </div>

          {/* Scene filter */}
          {scenes.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {scenes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSceneFilter(s)}
                  className={
                    "rounded-full px-2.5 py-1 text-[11px] transition " +
                    (sceneFilter === s ? "bg-sky-500/30 text-sky-100" : "bg-white/5 text-brand-200/60 hover:text-white")
                  }
                >
                  {s === "all" ? "全部" : s}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={play}
            className="mt-5 inline-flex h-20 w-20 flex-none items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/30 transition hover:-translate-y-1"
          >
            {playing ? <Pause className="h-9 w-9" /> : <Play className="h-9 w-9" />}
          </button>
          <div className="mt-3 text-xs text-brand-200/70">{playing ? `正在朗读（${speed}×）…` : "点击播放音频"}</div>

          {/* Speed selector */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[11px] text-brand-200/60">语速:</span>
            {SPEED_PRESETS
              .filter((p) => availableSpeeds.includes(p.rate))
              .concat(SPEED_PRESETS.filter((p) => !availableSpeeds.includes(p.rate)))
              .map((p) => {
                const active = Math.abs(p.rate - speed) < 0.01;
                const available = availableSpeeds.includes(p.rate);
                return (
                  <button
                    key={p.rate}
                    onClick={() => replayAt(p.rate)}
                    className={
                      "rounded-md px-2 py-0.5 text-[11px] transition " +
                      (active
                        ? "bg-sky-500/30 text-sky-100 ring-1 ring-sky-400/40"
                        : available
                          ? "bg-white/5 text-brand-200/70 hover:text-white"
                          : "bg-white/5 text-brand-200/30")
                    }
                  >
                    {p.label} {p.rate}×
                  </button>
                );
              })}
          </div>

          <div className="mt-6 flex flex-wrap items-baseline gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            {tokens.map((w, idx) => {
              const isBlank = blankIndices.has(idx);
              const blank = L.blanks.find((b) => b.index === idx);
              if (!isBlank) {
                return (
                  <span key={idx} className="text-base text-white/90">
                    {w}
                  </span>
                );
              }
              const val = inputs[idx] ?? "";
              const correct = reveal && val.trim().toLowerCase() === blank!.answer.toLowerCase();
              return (
                <span key={idx} className="inline-flex items-center">
                  <input
                    disabled={reveal}
                    value={val}
                    onChange={(e) => setInputs({ ...inputs, [idx]: e.target.value })}
                    placeholder="____"
                    className={
                      "w-32 rounded-md border-b-2 bg-transparent text-center text-base outline-none transition " +
                      (reveal
                        ? correct
                          ? "border-emerald-400 text-emerald-200"
                          : "border-rose-400 text-rose-200"
                        : "border-white/20 text-white focus:border-sky-400")
                    }
                  />
                  {reveal && !correct && <span className="ml-1 text-xs text-emerald-300">({blank!.answer})</span>}
                </span>
              );
            })}
          </div>

          <div className="mt-6 flex items-center gap-3">
            {!reveal ? (
              <button
                onClick={check}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-fuchsia-400 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
              >
                检查答案 <Check className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
              >
                下一段 <ArrowRight className="h-4 w-4" />
              </button>
            )}
            <div className="text-xs text-brand-200/60">已完成 {sessions} 段听力练习</div>
          </div>
        </GlassCard>
      </div>

      <div className="space-y-4">
        <GlassCard className="p-5">
          <div className="text-xs uppercase tracking-wider text-brand-200/60">小贴士</div>
          <ul className="mt-3 space-y-2 text-sm text-brand-100/90">
            <li>· 先用「慢」速盲听一遍，看能听懂多少。</li>
            <li>· 不懂再切「较慢」，最后用「正常」巩固。</li>
            <li>· 连读/弱读听不出时，对照文本反复播放。</li>
            <li>· 反复播放时可以同步跟着念。</li>
          </ul>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="text-xs uppercase tracking-wider text-brand-200/60">参考原文</div>
          <div className="mt-2 text-sm text-brand-100/80">{reveal ? L.script : "完成后显示。"}</div>
        </GlassCard>
      </div>
    </div>
  );
}

/* ===============================
   复习 — SM-2 Spaced Repetition
================================== */
function ReviewModule({ language, isLoggedIn, onNeedLogin, dueCount }: { language: Language; isLoggedIn: boolean; onNeedLogin: () => void; dueCount: number }) {
  const items = useReviewStore((s) => s.items);
  const reviewItem = useReviewStore((s) => s.reviewItem);

  // Recompute due queue whenever items change. Filter by language so
  // switching tabs doesn't surface cards from other languages.
  const queue = useMemo(() => {
    const now = Date.now();
    return Object.values(items)
      .filter((it) => it.language === language)
      .filter((it) => new Date(it.srs.nextReviewAt).getTime() <= now)
      .sort((a, b) => new Date(a.srs.nextReviewAt).getTime() - new Date(b.srs.nextReviewAt).getTime());
  }, [items, language]);

  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Clamp position when queue shrinks (e.g. after rating an item it
  // leaves the queue, so we move to the next).
  const idx = Math.min(pos, Math.max(0, queue.length - 1));
  const current = queue[idx];

  const rate = (quality: ReviewQuality) => {
    if (!current) return;
    reviewItem(current.itemId, quality);
    setFlipped(false);
    // After rating, advance. If this was the last due item, pos will
    // be clamped next render.
    setPos((p) => p + 1);
  };

  const QUALITIES: { key: ReviewQuality; label: string; cls: string }[] = [
    { key: "again", label: "不记得", cls: "border-rose-400/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20" },
    { key: "hard", label: "困难", cls: "border-amber-400/40 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20" },
    { key: "good", label: "良好", cls: "border-sky-400/40 bg-sky-500/10 text-sky-200 hover:bg-sky-500/20" },
    { key: "easy", label: "轻松", cls: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20" },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <GlassCard className="flex min-h-[380px] flex-col">
          <div className="flex items-center justify-between text-xs">
            <span className="text-brand-200/70">
              {queue.length > 0 ? `第 ${idx + 1} / ${queue.length} 张` : "复习队列"}
            </span>
            <span className="text-brand-200/70">
              待复习 <span className="text-rose-300">{dueCount}</span>
            </span>
          </div>

          {!isLoggedIn ? (
            <div className="flex flex-1 flex-col items-center justify-center py-12">
              <RotateCcw className="h-12 w-12 text-brand-200/40" />
              <div className="mt-4 text-sm text-brand-200/70">登录后开启间隔复习</div>
              <button
                onClick={onNeedLogin}
                className="mt-4 rounded-xl bg-gradient-to-r from-sky-400 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                登录
              </button>
            </div>
          ) : queue.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-12">
              <Check className="h-12 w-12 text-emerald-300/60" />
              <div className="mt-4 text-sm text-brand-200/70">
                {dueCount === 0 ? "现在没有需要复习的内容了，做得好！" : "此语言暂无待复习卡片"}
              </div>
              <div className="mt-1 text-xs text-brand-200/50">在「单词」/「语法」里答错后会自动加入复习队列</div>
            </div>
          ) : (
            <>
              <div className="my-3 h-[3px] overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-500"
                  style={{ width: `${Math.round(((idx) / Math.max(1, queue.length)) * 100)}%` }}
                />
              </div>

              <div className="card-flip flex-1">
                <div
                  className={"card-flip-inner" + (flipped ? " is-flipped" : "")}
                  onClick={() => setFlipped((f) => !f)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-face glass flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/20 via-slate-900/20 to-teal-500/20 p-10">
                    <div className="text-xs uppercase tracking-[0.3em] text-violet-300">
                      {current?.kind === "quiz" ? "题目" : "单词"}
                    </div>
                    <div className="mt-4 max-w-md text-center font-display text-3xl font-bold text-white md:text-4xl">
                      {current?.front}
                    </div>
                    <div className="mt-8 text-xs text-brand-200/50">点击查看答案 ↻</div>
                  </div>
                  <div className="card-face back glass flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/20 via-slate-900/20 to-sky-500/20 p-10">
                    <div className="text-xs uppercase tracking-[0.3em] text-emerald-300">答案</div>
                    <div className="mt-4 max-w-md text-center font-display text-3xl font-bold text-white md:text-4xl">
                      {current?.back}
                    </div>
                    {current?.hint && (
                      <div className="mt-4 max-w-md text-center text-sm text-brand-100/80">{current.hint}</div>
                    )}
                    <div className="mt-6 text-xs text-brand-200/50">点击翻回 ↻</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-4 gap-2">
                {QUALITIES.map((q) => (
                  <button
                    key={q.key}
                    onClick={() => rate(q.key)}
                    className={"flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-xs font-medium transition " + q.cls}
                  >
                    <span className="font-semibold">{q.label}</span>
                    <span className="text-[10px] opacity-70">
                      {current ? describeNextInterval(q.key, current.srs) : ""}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </GlassCard>
      </div>

      <div className="space-y-4">
        <GlassCard className="p-5">
          <div className="text-xs uppercase tracking-wider text-brand-200/60">复习原理</div>
          <ul className="mt-3 space-y-2 text-sm text-brand-100/90">
            <li>· SM-2 算法：根据你的回忆质量动态安排下次复习时间。</li>
            <li>· 答错的卡片会自动进入队列，1 天后再次出现。</li>
            <li>· 连续答对后间隔会指数增长（1 天 → 6 天 → 2 周…）。</li>
            <li>· 数据保存在本地浏览器，换设备会重置。</li>
          </ul>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="text-xs uppercase tracking-wider text-brand-200/60">本次复习</div>
          <div className="mt-2 font-display text-3xl font-bold text-white">{queue.length}</div>
          <div className="text-xs text-brand-200/60">剩余卡片</div>
        </GlassCard>
      </div>
    </div>
  );
}

/* ===============================
   自然对话 — Multi-turn dialogue
================================== */
/* Minimal type shim for the vendor-prefixed SpeechRecognition API
 * (not in lib.dom.d.ts). Same shape as PronunciationScore.tsx. */
interface SRResultAlt { readonly transcript: string }
interface SRResultList { readonly length: number; readonly [i: number]: { readonly [j: number]: SRResultAlt } }
interface SREvent extends Event { readonly results: SRResultList }
interface SRInstance extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  onresult: ((e: SREvent) => void) | null;
  onerror: ((e: Event) => void) | null;
  onend: (() => void) | null;
}
type SRCtor = { new (): SRInstance };

interface ChatBubble {
  /** who said it */
  role: "npc" | "user";
  text: string;
  translation?: string;
}

function ConversationModule({ language, level, isLoggedIn, onNeedLogin }: { language: Language; level?: string; isLoggedIn: boolean; onNeedLogin: () => void }) {
  const scenes = useMemo(() => getDialogueScenes(language), [language]);
  const [sceneId, setSceneId] = useState<string>(scenes[0]?.id ?? "");
  const [bubbles, setBubbles] = useState<ChatBubble[]>([]);
  const [input, setInput] = useState("");
  const [convState, setConvState] = useState<ConversationState | null>(null);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset selection when language changes.
  useEffect(() => {
    if (scenes.length > 0 && !scenes.find((s) => s.id === sceneId)) {
      setSceneId(scenes[0].id);
    }
  }, [scenes, sceneId]);

  const scene = scenes.find((s) => s.id === sceneId) ?? scenes[0] ?? null;

  const startScene = (s: DialogueScene | null) => {
    if (!s) return;
    const { state, npcLine } = startConversation(s);
    setConvState(state);
    setBubbles([{ role: "npc", text: npcLine, translation: s.turns[s.startTurnId]?.promptTranslation }]);
    setInput("");
    setError(null);
    speak(npcLine, language);
  };

  // Auto-start when scene changes or first mount.
  useEffect(() => {
    if (scene) startScene(scene);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneId, language]);

  /** Speak text via the shared TTS helper. Fire-and-forget — the
   *  ConversationModule doesn't need to await playback before
   *  advancing the dialogue state. */
  function speak(text: string, lang: Language) {
    void ttsSpeak(text, { language: lang, rate: 0.9 });
  }

  /** Listen via Web Speech API STT. */
  function startListening() {
    const SR =
      (window as unknown as { SpeechRecognition?: SRCtor; webkitSpeechRecognition?: SRCtor }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: SRCtor }).webkitSpeechRecognition;
    if (!SR) {
      setError("当前浏览器不支持语音识别，请用 Chrome/Edge，或直接打字。");
      return;
    }
    if (!isLoggedIn) { onNeedLogin(); return; }
    if (!convState || convState.isDone) return;

    const rec = new SR();
    rec.lang = BCP47[language] ?? "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    setListening(true);
    setError(null);
    rec.onresult = (e: SREvent) => {
      const text = e.results[0]?.[0]?.transcript ?? "";
      setListening(false);
      if (text) submitReply(text);
    };
    rec.onerror = () => {
      setListening(false);
      setError("没听清，可以再说一遍或直接打字。");
    };
    rec.onend = () => setListening(false);
    rec.start();
  }

  function submitReply(text: string) {
    if (!convState || convState.isDone) return;
    const trimmed = text.trim();
    if (!trimmed) return;
    const { npcLine, nextState, matched } = runConversationTurn(convState, trimmed);
    setBubbles((prev) => [
      ...prev,
      { role: "user", text: trimmed },
      { role: "npc", text: npcLine, translation: nextState.scene.turns[nextState.currentTurnId]?.promptTranslation },
    ]);
    setConvState(nextState);
    setInput("");
    if (npcLine) speak(npcLine, language);
    if (!matched && !nextState.isDone) {
      setError("没完全匹配，已切换到默认分支。可以尝试换种说法。");
    }
  }

  const isDone = convState?.isDone ?? false;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <GlassCard>
          {/* Scene picker */}
          <div className="mb-4 flex flex-wrap gap-2">
            {scenes.map((s) => (
              <button
                key={s.id}
                onClick={() => setSceneId(s.id)}
                className={
                  "rounded-full px-3 py-1.5 text-xs transition " +
                  (s.id === sceneId ? "bg-gradient-to-r from-sky-400 to-fuchsia-500 text-white" : "bg-white/5 text-brand-200/70 hover:text-white")
                }
              >
                {s.title}
              </button>
            ))}
          </div>

          {/* Chat area */}
          <div className="max-h-[420px] min-h-[320px] space-y-3 overflow-y-auto rounded-xl border border-white/5 bg-black/20 p-4">
            {bubbles.map((b, i) => (
              <div key={i} className={"flex " + (b.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm " +
                    (b.role === "user"
                      ? "rounded-br-sm bg-gradient-to-br from-sky-500 to-fuchsia-500 text-white"
                      : "rounded-bl-sm bg-white/10 text-brand-50")
                  }
                >
                  <div>{b.text}</div>
                  {b.translation && (
                    <div className="mt-1 text-[11px] opacity-60">{b.translation}</div>
                  )}
                </div>
              </div>
            ))}
            {listening && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-white/10 px-4 py-2.5 text-sm text-brand-200">
                  <span className="inline-flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-brand-200" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-brand-200" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-brand-200" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-2 text-xs text-amber-300">{error}</div>
          )}

          {/* Input area */}
          {isDone ? (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-emerald-300">对话完成！</span>
              <button
                onClick={() => scene && startScene(scene)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
              >
                <RotateCcw className="h-4 w-4" /> 重新开始
              </button>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submitReply(input); }}
                placeholder="输入回答，或点麦克风说话…"
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-sky-400/50"
              />
              <button
                onClick={startListening}
                disabled={listening}
                title="语音输入"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-fuchsia-500 text-white transition hover:-translate-y-0.5 disabled:opacity-50"
              >
                <Mic className="h-4 w-4" />
              </button>
              <button
                onClick={() => submitReply(input)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
              >
                发送 <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </GlassCard>
      </div>

      <div className="space-y-4">
        <GlassCard className="p-5">
          <div className="text-xs uppercase tracking-wider text-brand-200/60">当前场景</div>
          <div className="mt-2 font-display text-xl font-bold text-white">{scene?.title}</div>
          <div className="mt-1 text-xs text-brand-200/60">{scene?.scenario}</div>
          <div className="mt-3 text-xs text-brand-200/70">
            这是一个场景化对话练习。NPC 会根据你的回答走向不同分支——
            没匹配到关键词时会切到默认回复。试着用学过的词来应对。
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="text-xs uppercase tracking-wider text-brand-200/60">对话提示</div>
          <ul className="mt-3 space-y-2 text-sm text-brand-100/90">
            <li>· 用学过的关键词来触发分支。</li>
            <li>· 语音输入需要 Chrome / Edge。</li>
            <li>· 不确定时可以直接打字。</li>
            <li>· 听不懂 NPC 可重看下方翻译。</li>
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
