import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Volume2, Square } from "lucide-react";

/**
 * TTS audio button backed by the browser's native SpeechSynthesis
 * (Web Speech API). Zero-cost, zero-backend, works offline once
 * the OS voice pack is installed. Voice quality varies by browser
 * and OS — Chrome / Edge ship high-quality neural voices, Safari
 * uses Samantha / Daniel, Firefox falls back to eSpeak.
 *
 * Design notes:
 *   - We always call `cancel()` before speak() so clicking a new
 *     phrase mid-playback cleanly cuts off the previous one
 *     (otherwise the browser queues utterances and the UI lies
 *     about what's playing).
 *   - We do NOT preload voices on mount — Chrome ships the voice
 *     list asynchronously and reading it on first click is fine
 *     since utterance.start is also async. We do lazy-resolve the
 *     first matching voice on the first speak() and cache it.
 *   - If the user has no voice for the requested language we fall
 *     back to the user's default voice — better something than
 *     nothing — and the button still works for the English line.
 *
 * The component is purely presentational; the parent supplies the
 * text and the BCP-47 language tag (e.g. "ja-JP", "ko-KR").
 */
export interface AudioButtonProps {
  text: string;
  /** BCP-47 language tag, e.g. "en-US", "ja-JP", "zh-CN". */
  lang: string;
  /** Optional label override; defaults to "Play audio". */
  label?: string;
  /** Size variant. */
  size?: "sm" | "md";
}

const ICON_CLS = "h-4 w-4";
const ICON_CLS_SM = "h-3.5 w-3.5";

export default function AudioButton({
  text,
  lang,
  label,
  size = "sm",
}: AudioButtonProps) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const cancelledRef = useRef(false);

  // Detect SSR / unsupported once. Web Speech API is browser-only.
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setUnsupported(true);
    }
  }, []);

  // Pick the best voice for the requested language. We try the exact
  // BCP-47 first ("ja-JP"), then the language root ("ja"), and skip
  // remote voices (marked `localService === false`) to avoid the
  // "download voice" dialog in Chrome.
  const resolveVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return null;
    }
    if (voiceRef.current) return voiceRef.current;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;
    const langLower = lang.toLowerCase();
    const root = langLower.split("-")[0];
    const exact = voices.find(
      (v) => v.localService !== false && v.lang.toLowerCase() === langLower
    );
    if (exact) {
      voiceRef.current = exact;
      return exact;
    }
    const partial = voices.find(
      (v) => v.localService !== false && v.lang.toLowerCase().startsWith(root)
    );
    if (partial) {
      voiceRef.current = partial;
      return partial;
    }
    // Last resort: any voice. Better something than silence.
    const fallback = voices.find((v) => v.localService !== false) ?? voices[0];
    voiceRef.current = fallback;
    return fallback;
  }, [lang]);

  // Chrome populates voices asynchronously after `voiceschanged`.
  // We wire that once so the first click in a fresh tab has a voice
  // ready even if the list was empty on mount.
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const handler = () => {
      // Force re-resolve on next speak
      voiceRef.current = null;
      resolveVoice();
    };
    window.speechSynthesis.addEventListener("voiceschanged", handler);
    // Prime the cache
    resolveVoice();
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
    };
  }, [resolveVoice]);

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    cancelledRef.current = true;
    window.speechSynthesis.cancel();
    setPlaying(false);
    setLoading(false);
  }, []);

  const play = useCallback(async () => {
    if (unsupported || !text) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    // Toggle: if already playing, stop.
    if (playing) {
      stop();
      return;
    }

    cancelledRef.current = false;

    // Make sure the voice list is populated (Chrome race).
    let voice = resolveVoice();
    if (!voice) {
      setLoading(true);
      // Wait up to 1.5s for voiceschanged.
      await new Promise<void>((resolve) => {
        const start = Date.now();
        const tick = () => {
          voice = resolveVoice();
          if (voice || Date.now() - start > 1500) {
            resolve();
            return;
          }
          setTimeout(tick, 100);
        };
        tick();
        window.speechSynthesis.addEventListener(
          "voiceschanged",
          function once() {
            window.speechSynthesis.removeEventListener("voiceschanged", once);
            voice = resolveVoice();
            resolve();
          }
        );
      });
      setLoading(false);
      if (cancelledRef.current) return;
    }

    // Cancel anything currently playing so the new utterance starts
    // immediately instead of being queued.
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    if (voice) utter.voice = voice;
    utter.lang = lang;
    utter.rate = 0.92; // Slightly slower than 1.0 helps comprehension for learners.
    utter.pitch = 1.0;
    utter.volume = 1.0;

    utter.onstart = () => {
      if (cancelledRef.current) return;
      setPlaying(true);
    };
    utter.onend = () => {
      setPlaying(false);
    };
    utter.onerror = () => {
      setPlaying(false);
    };

    window.speechSynthesis.speak(utter);
  }, [text, lang, playing, stop, resolveVoice, unsupported]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (unsupported) return null;

  const iconCls = size === "sm" ? ICON_CLS_SM : ICON_CLS;
  const padding = size === "sm" ? "p-2" : "p-2.5";
  const stateLabel = playing
    ? label ?? "Stop audio"
    : loading
      ? "Loading voice"
      : label ?? "Play audio";

  return (
    <button
      type="button"
      onClick={play}
      disabled={loading}
      aria-label={stateLabel}
      title={stateLabel}
      className={
        "rounded-full border p-2 transition " +
        (playing
          ? "border-fuchsia-400/50 bg-fuchsia-400/15 text-fuchsia-100"
          : "border-white/10 bg-white/5 text-sky-300 hover:bg-white/10") +
        " " +
        padding +
        (loading ? " cursor-wait opacity-60" : "")
      }
    >
      {loading ? (
        <Loader2 className={iconCls + " animate-spin"} />
      ) : playing ? (
        <Square className={iconCls} />
      ) : (
        <Volume2 className={iconCls} />
      )}
    </button>
  );
}
