/**
 * Shared Text-to-Speech helpers.
 *
 * Previously the ListeningModule, ConversationModule and AudioButton
 * component each had their own `speechSynthesis` code with subtle
 * differences (voice selection, rate handling). This module unifies
 * them so the listening layer can offer graded playback speeds and
 * the conversation layer can reuse the same voice resolution.
 *
 * Web Speech API is browser-only and vendor-prefixed; we guard all
 * access with `typeof window` checks.
 */

/** BCP-47 language tag for a given app Language. */
const BCP47: Record<string, string> = {
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

/** Pick the best local TTS voice for the requested language.
 *  Tries exact BCP-47 match, then language root, then any local
 *  voice. Cached per-lang. */
const voiceCache = new Map<string, SpeechSynthesisVoice | null>();
export function resolveVoice(lang: string): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  if (voiceCache.has(lang)) return voiceCache.get(lang) ?? null;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;
  const langLower = lang.toLowerCase();
  const root = langLower.split("-")[0];
  const exact = voices.find(
    (v) => v.localService !== false && v.lang.toLowerCase() === langLower,
  );
  const partial = voices.find(
    (v) => v.localService !== false && v.lang.toLowerCase().startsWith(root),
  );
  const fallback = voices.find((v) => v.localService !== false) ?? voices[0];
  const chosen = exact ?? partial ?? fallback ?? null;
  voiceCache.set(lang, chosen);
  return chosen;
}

/** Speak a string. Cancels any in-flight speech first. Resolves when
 *  speaking ends (or fails). Safe to call server-side (no-op). */
export function speak(
  text: string,
  opts: { language?: string; rate?: number; pitch?: number } = {},
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve();
      return;
    }
    const synth = window.speechSynthesis;
    try {
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const bcp = opts.language ? (BCP47[opts.language] ?? opts.language) : "en-US";
      u.lang = bcp;
      u.rate = opts.rate ?? 1.0;
      if (opts.pitch !== undefined) u.pitch = opts.pitch;
      const voice = resolveVoice(bcp);
      if (voice) u.voice = voice;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      synth.speak(u);
    } catch {
      resolve();
    }
  });
}

/** Stop any in-flight speech. */
export function stopSpeaking(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
}

/** True if the browser exposes the SpeechSynthesis API. */
export function isTTSSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Default speed presets for the listening module. */
export const DEFAULT_SPEEDS = [0.8, 1.0] as const;

/** Speed options offered in the UI — slow / normal / fast. */
export const SPEED_PRESETS: { rate: number; label: string }[] = [
  { rate: 0.6, label: "慢" },
  { rate: 0.8, label: "较慢" },
  { rate: 1.0, label: "正常" },
  { rate: 1.2, label: "较快" },
];
