import { useEffect, useMemo, useState } from "react";
import { BookOpen, Pen, Mic, Headphones, Check, X, RotateCcw, ArrowRight, Lightbulb, Play, Pause } from "lucide-react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageShell from "../components/PageShell";
import { GlassCard } from "../components/GlassCard";
import { api } from "../lib/api";
import type { WordResp } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { useProgressStore } from "../store/progressStore";
import { WORDS, getWords, getQuizzes, getSpeaking, getListening } from "../data/content";
import { COURSES } from "../data/courses";
import { LANGUAGES, getLanguage } from "../data/languages";
import type { Language } from "../types";

type Tab = "words" | "grammar" | "speaking" | "listening";

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
  ];

  const [tab, setTab] = useState<Tab>("words");
  const [lang, setLang] = useState<Language>(
    (course?.language as Language) ?? (user?.targetLanguage as Language) ?? "en"
  );
  const level = course?.level;
  const locked = !!course;

  useEffect(() => {
    if (course) {
      setLang(course.language as Language);
    }
  }, [course]);

  const title = course
    ? `${course.title}`
    : t("learn.wordMemory");
  const subtitle = course
    ? `${getLanguage(course.language).flag} ${getLanguage(course.language).name} · ${course.level} · ${course.description}`
    : t("learn.wordMemoryDesc");

  return (
    <PageShell
      title={title}
      subtitle={subtitle}
      action={
        locked ? (
          <div className="glass flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-brand-200/80">
            <span>{getLanguage(lang).flag}</span>
            <span>{getLanguage(lang).name}</span>
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
                {l.flag} {l.name}
              </button>
            ))}
          </div>
        )
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
            </button>
          );
        })}
      </div>

      {tab === "words" && <WordsModule language={lang} level={level} />}
      {tab === "grammar" && <GrammarModule language={lang} level={level} />}
      {tab === "speaking" && <SpeakingModule language={lang} level={level} />}
      {tab === "listening" && <ListeningModule language={lang} level={level} />}
    </PageShell>
  );
}

/* ===============================
   单词记忆 — Flashcards
================================== */
function WordsModule({ language, level }: { language: Language; level?: string }) {
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
    await recordWord(k, language);
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
function GrammarModule({ language, level }: { language: Language; level?: string }) {
  const recordQuiz = useProgressStore((s) => s.recordQuiz);
  const quizzes = useMemo(() => {
    const base = getQuizzes(language, level);
    return base && base.length >= 2 ? base : getQuizzes("en");
  }, [language, level]);

  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  const q = quizzes[i % Math.max(1, quizzes.length)];

  const submit = async () => {
    if (pick === null) return;
    const ok = pick === q.answer;
    await recordQuiz(ok, language);
    if (ok) setCorrect((n) => n + 1);
    else setWrong((n) => n + 1);
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
        <GlassCard className="p-5">
          <div className="mb-2 text-xs uppercase tracking-wider text-brand-200/60">提示</div>
          <ul className="space-y-2 text-sm text-brand-100/90">
            <li>· 先读整句，再判断语法结构。</li>
            <li>· 不确定时可先凭语感选一个。</li>
            <li>· 每一条解析都值得停下来读一遍。</li>
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}

/* ===============================
   口语跟读
================================== */
function SpeakingModule({ language, level }: { language: Language; level?: string }) {
  const recordSpeaking = useProgressStore((s) => s.recordSpeaking);
  const phrases = useMemo(() => getSpeaking(language, level), [language, level]);
  const [i, setI] = useState(0);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [count, setCount] = useState(0);
  const p = phrases[i % Math.max(1, phrases.length)];

  const start = () => {
    setRecording(true);
    setSeconds(0);
    const startAt = Date.now();
    const iv = window.setInterval(() => {
      const s = Math.floor((Date.now() - startAt) / 1000);
      setSeconds(s);
      if (s >= 15) {
        window.clearInterval(iv);
        setRecording(false);
        recordSpeaking(15, language);
        setCount((c) => c + 1);
      }
    }, 500);
  };
  const stop = () => {
    setRecording(false);
    if (seconds > 0) {
      recordSpeaking(seconds, language);
      setCount((c) => c + 1);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <GlassCard className="text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-fuchsia-300">跟读这句</div>
          <div className="mt-4 font-display text-3xl font-bold leading-snug text-white md:text-5xl">
            {p.phrase}
          </div>
          <div className="mt-3 text-lg text-brand-200/80">{p.translation}</div>
          {p.phonetic && <div className="mt-2 text-xs text-brand-200/60">{p.phonetic}</div>}

          <div className="mt-10 flex flex-col items-center">
            <button
              onClick={recording ? stop : start}
              className={"relative flex h-32 w-32 items-center justify-center rounded-full text-white transition " +
                (recording
                  ? "bg-gradient-to-br from-rose-500 to-fuchsia-600 shadow-[0_0_60px_-5px] shadow-fuchsia-500"
                  : "bg-gradient-to-br from-sky-400 to-fuchsia-500 shadow-[0_0_60px_-10px] shadow-fuchsia-500/40 hover:-translate-y-1")}
            >
              {recording ? <Pause className="h-12 w-12" /> : <Mic className="h-12 w-12" />}
              {recording && <span className="pointer-events-none absolute inset-0 animate-ping rounded-full border border-fuchsia-400/40" />}
            </button>
            <div className="mt-4 text-sm text-brand-100">{recording ? `正在录音 · ${seconds}s` : "点击开始录音，大声朗读一次"}</div>
            <div className="mt-1 text-[11px] text-brand-200/50">提示：浏览器不会实际上传音频，录音仅用于本地体验计时</div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setSeconds(0)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-brand-100 hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4" /> 重来
            </button>
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
function ListeningModule({ language, level }: { language: Language; level?: string }) {
  const recordListening = useProgressStore((s) => s.recordListening);
  const items = useMemo(() => getListening(language, level), [language, level]);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [inputs, setInputs] = useState<Record<number, string>>({});
  const [sessions, setSessions] = useState(0);

  const L = items[i % Math.max(1, items.length)];
  const tokens = L.script.split(" ");

  const play = () => {
    if (playing) return;
    setPlaying(true);
    const synth = window.speechSynthesis;
    if (synth) {
      try {
        const u = new SpeechSynthesisUtterance(L.script);
        u.lang = language === "en" ? "en-US" : language === "ja" ? "ja-JP" : "ko-KR";
        u.rate = 0.9;
        u.onend = () => {
          setPlaying(false);
          recordListening(Math.max(1, Math.ceil(L.script.length / 20)), language);
        };
        synth.cancel();
        synth.speak(u);
      } catch {
        window.setTimeout(() => setPlaying(false), 3000);
      }
    } else {
      window.setTimeout(() => setPlaying(false), 3000);
    }
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

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <GlassCard>
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-[0.3em] text-sky-300">{L.title}</div>
            <span className="text-xs text-brand-200/60">第 {(i % items.length) + 1} / {items.length}</span>
          </div>

          <button
            onClick={play}
            className="mt-6 inline-flex h-20 w-20 flex-none items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/30 transition hover:-translate-y-1"
          >
            {playing ? <Pause className="h-9 w-9" /> : <Play className="h-9 w-9" />}
          </button>
          <div className="mt-3 text-xs text-brand-200/70">{playing ? "正在朗读…" : "点击播放音频（浏览器会把这段文字念出来）"}</div>

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
            <li>· 先盲听一遍，看能听懂多少。</li>
            <li>· 再对照文本填空，识别弱读/连读。</li>
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
