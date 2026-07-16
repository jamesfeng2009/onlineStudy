import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Square, RotateCcw, Check, AlertCircle, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import AudioButton from "./AudioButton";

/* ----------------------------------------------------------------
   Type shim for the vendor-prefixed SpeechRecognition API.
   Not in lib.dom.d.ts, so we declare the minimal shape we need.
------------------------------------------------------------------ */
interface SRResultAlt { readonly transcript: string; readonly confidence: number }
interface SRResult { readonly isFinal: boolean; readonly length: number; item(i: number): SRResultAlt; [i: number]: SRResultAlt }
interface SRResultList { readonly length: number; item(i: number): SRResult; [i: number]: SRResult }
interface SREvent extends Event { readonly resultIndex: number; readonly results: SRResultList }
interface SRErrorEvent extends Event { readonly error: string; readonly message: string }
interface SRInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: SREvent) => void) | null;
  onerror: ((e: SRErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}
type SRCtor = { new (): SRInstance };
function getSpeechRecognition(): SRCtor | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { SpeechRecognition?: SRCtor; webkitSpeechRecognition?: SRCtor })
    .SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition?: SRCtor }).webkitSpeechRecognition ?? null;
}

/* ----------------------------------------------------------------
   Levenshtein distance → 0-1 similarity.
   Works on characters, which is fine for both Latin and CJK
   (a CJK char ≈ a Latin word in terms of information density).
------------------------------------------------------------------ */
function normalize(s: string): string {
  return s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  let curr = new Array(n + 1);
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}
function similarity(a: string, b: string): number {
  const na = normalize(a), nb = normalize(b);
  const maxLen = Math.max(na.length, nb.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(na, nb) / maxLen;
}

/* Languages where pitch/tone changes meaning.
   Web Speech API can't detect tone errors, so we warn the user. */
const TONAL_LANGS = new Set(["th", "vi", "zh", "yue"]);
function isTonal(bcp47: string): boolean {
  const root = bcp47.toLowerCase().split("-")[0];
  return TONAL_LANGS.has(root) || root === "zh-hk";
}

/* ----------------------------------------------------------------
   Score → color + label
------------------------------------------------------------------ */
function scoreStyle(s: number) {
  if (s >= 90) return { ring: "text-emerald-400", bg: "from-emerald-500 to-teal-500", labelKey: "pronunciation.excellent", text: "text-emerald-300" };
  if (s >= 75) return { ring: "text-sky-400", bg: "from-sky-500 to-cyan-500", labelKey: "pronunciation.great", text: "text-sky-300" };
  if (s >= 60) return { ring: "text-amber-400", bg: "from-amber-500 to-orange-500", labelKey: "pronunciation.okay", text: "text-amber-300" };
  return { ring: "text-rose-400", bg: "from-rose-500 to-fuchsia-600", labelKey: "pronunciation.practiceMore", text: "text-rose-300" };
}

/* ----------------------------------------------------------------
   Component
------------------------------------------------------------------ */
export interface PronunciationScoreProps {
  /** The sentence the user should repeat. */
  text: string;
  /** BCP-47 language tag, e.g. "en-US", "ja-JP", "th-TH". */
  lang: string;
  /** Called with score 0-100 and the recognized transcript. */
  onScored?: (score: number, transcript: string) => void;
}

type Phase = "idle" | "listening" | "scored";

export default function PronunciationScore({ text, lang, onScored }: PronunciationScoreProps) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<Phase>("idle");
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unsupported, setUnsupported] = useState(false);
  const recRef = useRef<SRInstance | null>(null);
  const settledRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect support once.
  useEffect(() => {
    if (!getSpeechRecognition()) setUnsupported(true);
  }, []);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      try { recRef.current?.abort(); } catch { /* noop */ }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const start = useCallback(() => {
    const SRCtor = getSpeechRecognition();
    if (!SRCtor) { setUnsupported(true); return; }

    // Reset state.
    setError(null);
    setTranscript("");
    setScore(null);
    setPhase("listening");
    settledRef.current = false;

    const rec = new SRCtor();
    recRef.current = rec;
    rec.lang = lang;
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    const finish = (heard: string) => {
      if (settledRef.current) return;
      settledRef.current = true;
      const s = Math.round(similarity(heard, text) * 100);
      setTranscript(heard);
      setScore(s);
      setPhase("scored");
      onScored?.(s, heard);
      if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
    };

    rec.onresult = (e: SREvent) => {
      const heard = e.results[0]?.[0]?.transcript ?? "";
      finish(heard);
    };
    rec.onerror = (e: SRErrorEvent) => {
      if (settledRef.current) return;
      settledRef.current = true;
      const msg =
        e.error === "no-speech" ? t("pronunciation.errors.noSpeech") :
        e.error === "not-allowed" || e.error === "service-not-allowed" ? t("pronunciation.errors.microphoneNotAllowed") :
        e.error === "network" ? t("pronunciation.errors.network") :
        t("pronunciation.errors.recognitionFailed", { error: e.error });
      setError(msg);
      setPhase("idle");
    };
    rec.onend = () => {
      // If no result and no error fired, treat as no-speech.
      if (!settledRef.current) {
        settledRef.current = true;
        setError(t("pronunciation.errors.noSpeech"));
        setPhase("idle");
      }
    };

    try {
      rec.start();
    } catch {
      setError(t("pronunciation.errors.cannotStart"));
      setPhase("idle");
      return;
    }

    // Chrome caps single-shot recognition near 15 s.
    timeoutRef.current = setTimeout(() => {
      if (!settledRef.current) {
        try { rec.stop(); } catch { /* noop */ }
      }
    }, 15000);
  }, [lang, text, onScored]);

  const reset = useCallback(() => {
    setPhase("idle");
    setTranscript("");
    setScore(null);
    setError(null);
    try { recRef.current?.abort(); } catch { /* noop */ }
  }, []);

  if (unsupported) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
        <AlertCircle className="h-5 w-5 flex-none text-amber-400" />
        <span>{t("pronunciation.unsupportedBrowser")}</span>
      </div>
    );
  }

  const sty = score !== null ? scoreStyle(score) : null;
  const tonal = isTonal(lang);

  return (
    <div className="space-y-5">
      {/* Target sentence + TTS */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-xs uppercase tracking-[0.3em] text-fuchsia-300">{t("pronunciation.repeatThis")}</div>
            <div className="mt-2 break-words font-display text-2xl font-bold leading-snug text-white md:text-3xl">
              {text}
            </div>
          </div>
          <AudioButton text={text} lang={lang} size="md" />
        </div>
      </div>

      {/* Mic button */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={phase === "listening" ? reset : start}
          className={
            "relative flex h-28 w-28 items-center justify-center rounded-full text-white transition " +
            (phase === "listening"
              ? "bg-gradient-to-br from-rose-500 to-fuchsia-600 shadow-[0_0_60px_-5px] shadow-fuchsia-500"
              : "bg-gradient-to-br from-sky-400 to-fuchsia-500 shadow-[0_0_60px_-10px] shadow-fuchsia-500/40 hover:-translate-y-1")
          }
        >
          {phase === "listening" ? <Square className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
          {phase === "listening" && (
            <span className="pointer-events-none absolute inset-0 animate-ping rounded-full border border-fuchsia-400/40" />
          )}
        </button>
        <div className="mt-4 text-sm text-brand-100">
          {phase === "listening" ? t("pronunciation.listening") : t("pronunciation.tapToStart")}
        </div>
        {tonal && phase === "idle" && (
          <div className="mt-1 max-w-sm text-center text-[11px] text-brand-200/50">
            {t("pronunciation.toneHint")}
          </div>
        )}
      </div>

      {/* Error */}
      {error && phase === "idle" && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          <AlertCircle className="h-4 w-4 flex-none" /> {error}
        </div>
      )}

      {/* Result */}
      {phase === "scored" && score !== null && sty && (
        <div className="space-y-4">
          {/* Score ring */}
          <div className="flex items-center gap-5 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="relative flex h-20 w-20 flex-none items-center justify-center">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/10" />
                <circle
                  cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="6"
                  strokeLinecap="round" className={sty.ring}
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={2 * Math.PI * 34 * (1 - score / 100)}
                />
              </svg>
              <div className="absolute font-display text-2xl font-bold text-white">{score}</div>
            </div>
            <div>
              <div className={"font-display text-xl font-bold " + sty.text}>{t(sty.labelKey)}</div>
              <div className="mt-0.5 text-xs text-brand-200/60">{t("pronunciation.fullScore")}</div>
            </div>
          </div>

          {/* Transcript comparison */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                <Check className="h-3.5 w-3.5" /> {t("pronunciation.youSaid")}
              </div>
              <div className="break-words text-sm text-white">{transcript || t("pronunciation.noSpeechDetected")}</div>
            </div>
            <div className="rounded-xl border border-sky-400/20 bg-sky-400/5 p-4">
              <div className="mb-1 text-xs font-semibold text-sky-300">{t("pronunciation.target")}</div>
              <div className="break-words text-sm text-white">{text}</div>
            </div>
          </div>

          {/* Retry */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-brand-100 hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4" /> {t("pronunciation.tryAgain")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
