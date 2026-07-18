/**
 * Lazy loader for the "learn" i18n namespace.
 *
 * The learn namespace (src/locales/<lng>/learn.json, ~212 KB per locale)
 * holds the editorial copy for /languages/* pages. It is intentionally
 * NOT bundled into the main i18n resources — pages load it on demand
 * via ensureLearnNamespace(), and Vite splits each locale JSON into its
 * own chunk.
 *
 * Usage:
 *   - Components: const { t, i18n, ready } = useLearnTranslation();
 *   - SSR (entry-server): await ensureLearnNamespace(locale) before render.
 *   - Bootstrap (main.tsx): awaited before hydrateRoot on /languages routes
 *     so the prerendered HTML and the first client render agree.
 */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n, { SUPPORTED_LANGUAGES } from "./i18n";

type LearnBundle = Record<string, unknown>;

const LEARN_LOADERS: Record<string, () => Promise<LearnBundle>> = {
  en: () => import("../locales/en/learn.json").then((m) => m.default as LearnBundle),
  zh: () => import("../locales/zh/learn.json").then((m) => m.default as LearnBundle),
  ja: () => import("../locales/ja/learn.json").then((m) => m.default as LearnBundle),
  ko: () => import("../locales/ko/learn.json").then((m) => m.default as LearnBundle),
  es: () => import("../locales/es/learn.json").then((m) => m.default as LearnBundle),
  fr: () => import("../locales/fr/learn.json").then((m) => m.default as LearnBundle),
  de: () => import("../locales/de/learn.json").then((m) => m.default as LearnBundle),
  it: () => import("../locales/it/learn.json").then((m) => m.default as LearnBundle),
  th: () => import("../locales/th/learn.json").then((m) => m.default as LearnBundle),
  yue: () => import("../locales/yue/learn.json").then((m) => m.default as LearnBundle),
  ms: () => import("../locales/ms/learn.json").then((m) => m.default as LearnBundle),
  id: () => import("../locales/id/learn.json").then((m) => m.default as LearnBundle),
  vi: () => import("../locales/vi/learn.json").then((m) => m.default as LearnBundle),
};

const loaded = new Set<string>();
const inflight = new Map<string, Promise<void>>();

function loadOne(lng: string): Promise<void> {
  if (loaded.has(lng)) return Promise.resolve();
  const existing = inflight.get(lng);
  if (existing) return existing;
  const loader = LEARN_LOADERS[lng];
  if (!loader) return Promise.resolve();
  const p = loader()
    .then((bundle) => {
      i18n.addResourceBundle(lng, "learn", bundle, true, true);
      loaded.add(lng);
    })
    .catch(() => {
      // Locale JSON missing (e.g. translation not shipped yet) — fall back
      // to English, which is always loaded alongside.
      inflight.delete(lng);
    });
  inflight.set(lng, p);
  return p;
}

/**
 * Load the learn namespace for `lng` (plus English as the fallback
 * bundle so i18next fallbackLng works for missing keys).
 */
export async function ensureLearnNamespace(lng: string): Promise<void> {
  const lang = (SUPPORTED_LANGUAGES as readonly string[]).includes(lng) ? lng : "en";
  if (lang === "en") {
    await loadOne("en");
  } else {
    await Promise.all([loadOne("en"), loadOne(lang)]);
  }
}

/**
 * react-i18next hook for /languages/* pages. Triggers the lazy load on
 * the client and reports readiness so pages can hold their loading
 * state until copy is available (avoids flashing raw keys during SPA
 * navigations). addResourceBundle fires i18next's "added" event, which
 * useTranslation subscribes to, so components re-render automatically.
 */
export function useLearnTranslation() {
  const { t, i18n: inst } = useTranslation("learn");
  const [ready, setReady] = useState(() =>
    inst.hasResourceBundle(inst.language, "learn")
  );

  useEffect(() => {
    let alive = true;
    if (!inst.hasResourceBundle(inst.language, "learn")) setReady(false);
    void ensureLearnNamespace(inst.language).then(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, [inst.language]);

  return { t, i18n: inst, ready };
}
