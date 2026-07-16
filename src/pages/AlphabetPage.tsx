/**
 * P1-1: 字母 / 发音基础页面（AlphabetPage）
 *
 * 路由：/alphabet/:language  （未带 language 时显示语言选择器）
 *
 * 功能：
 *   1. 按字母系统（hiragana / katakana / hangul-basic / pinyin / jyutping / thai）
 *      切换 tab
 *   2. 字符网格：点击任一字符立即 TTS 朗读（Web Speech API）
 *   3. 展开字符详情：示例词 + AudioButton + PronunciationScore 跟读评分
 *   4. 顶部展示该字母系统说明 + 静态免责声明（TTS 音质因浏览器/OS 而异）
 *
 * 数据来自 src/data/alphabets.ts（静态，不入库）。
 */

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Volume2, X, Type, Sparkles } from "lucide-react";
import PageShell from "../components/PageShell";
import { Seo } from "../components/Seo";
import { GlassCard } from "../components/GlassCard";
import AudioButton from "../components/AudioButton";
import PronunciationScore from "../components/PronunciationScore";
import { speak } from "../lib/tts";
import { getLanguage } from "../data/languages";
import {
  ALPHABETS,
  LANGUAGES_WITH_ALPHABETS,
  getAlphabetsByLanguage,
  type Alphabet,
  type AlphabetChar,
  type AlphabetSystem,
} from "../data/alphabets";
import type { Language } from "../types";

/** Map app Language → BCP-47 for TTS / SpeechRecognition. */
const BCP47: Record<string, string> = {
  en: "en-US",
  ja: "ja-JP",
  ko: "ko-KR",
  zh: "zh-CN",
  yue: "zh-HK",
  th: "th-TH",
};

function isLanguageWithAlphabet(id: string): id is Language {
  return (LANGUAGES_WITH_ALPHABETS as string[]).includes(id);
}

export default function AlphabetPage() {
  const navigate = useNavigate();
  const { language } = useParams<{ language?: string }>();
  const [selectedLang, setSelectedLang] = useState<Language | null>(
    language && isLanguageWithAlphabet(language) ? language : null,
  );
  const [selectedSystem, setSelectedSystem] = useState<AlphabetSystem | null>(null);
  const [selectedChar, setSelectedChar] = useState<AlphabetChar | null>(null);

  // Update state when URL param changes (e.g. user clicks a tab link).
  useEffect(() => {
    if (language && isLanguageWithAlphabet(language)) {
      setSelectedLang(language);
      setSelectedSystem(null);
      setSelectedChar(null);
    } else if (!language) {
      setSelectedLang(null);
      setSelectedSystem(null);
      setSelectedChar(null);
    }
  }, [language]);

  // The alphabets for the currently selected language.
  const alphabets = useMemo<Alphabet[]>(() => {
    if (!selectedLang) return [];
    return getAlphabetsByLanguage(selectedLang);
  }, [selectedLang]);

  // The currently active alphabet (defaults to the first system).
  const activeAlphabet = useMemo<Alphabet | null>(() => {
    if (!alphabets.length) return null;
    if (selectedSystem) {
      return alphabets.find((a) => a.system === selectedSystem) ?? alphabets[0];
    }
    return alphabets[0];
  }, [alphabets, selectedSystem]);

  const bcp47 = selectedLang ? (BCP47[selectedLang] ?? selectedLang) : "en-US";

  // ====== Render: language picker (no language in URL) ======
  if (!selectedLang) {
    return (
      <PageShell title="字母 / 发音基础" subtitle="从字母开始入门亚洲语言">
        <Seo
          title="字母 / 发音基础 — LangOria"
          description="Hiragana / Katakana / Hangul / Pinyin / Jyutping / Thai 字母表与发音练习，点击字符即可朗读。"
          pathname="/alphabet"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LANGUAGES_WITH_ALPHABETS.map((lang) => {
            const meta = getLanguage(lang);
            const systems = ALPHABETS.filter((a) => a.language === lang);
            return (
              <GlassCard
                key={lang}
                onClick={() => navigate(`/alphabet/${lang}`)}
                className="flex flex-col"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-fuchsia-500/20 text-3xl">
                    {meta.flag}
                  </div>
                  <div>
                    <div className="font-display text-lg font-bold text-white">{meta.native}</div>
                    <div className="text-xs text-brand-200/70">{meta.name}</div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {systems.map((s) => (
                    <span
                      key={s.system}
                      className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] text-brand-200/80"
                    >
                      {s.title}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-end border-t border-white/5 pt-3 text-xs text-sky-300">
                  <Sparkles className="mr-1 h-3.5 w-3.5" /> 进入字母表 <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </GlassCard>
            );
          })}
        </div>
        <p className="mt-6 text-center text-[11px] text-brand-200/40">
          字母发音由浏览器 Web Speech API 合成，音质因操作系统而异；声调语言的声调准确性需后续版本支持。
        </p>
      </PageShell>
    );
  }

  // ====== Render: chart for a specific language ======
  const langMeta = getLanguage(selectedLang);
  return (
    <PageShell
      title={`${langMeta.flag} ${langMeta.native} · 字母 / 发音基础`}
      subtitle={activeAlphabet?.description ?? "点击任一字符即可朗读"}
      action={
        <button
          onClick={() => navigate("/alphabet")}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-brand-100 transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" /> 切换语言
        </button>
      }
    >
      <Seo
        title={`${langMeta.native} 字母 / 发音基础 — LangOria`}
        description={`${langMeta.native} 字母表与发音练习，点击字符即可朗读。`}
        pathname={`/alphabet/${selectedLang}`}
      />

      {/* System tabs */}
      {alphabets.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {alphabets.map((a) => {
            const active = activeAlphabet?.system === a.system;
            return (
              <button
                key={a.system}
                onClick={() => {
                  setSelectedSystem(a.system);
                  setSelectedChar(null);
                }}
                className={
                  "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition " +
                  (active
                    ? "border-fuchsia-400/60 bg-fuchsia-400/15 text-fuchsia-100"
                    : "border-white/10 bg-white/5 text-brand-100 hover:bg-white/10")
                }
              >
                <Type className="h-3.5 w-3.5" />
                {a.title}
              </button>
            );
          })}
        </div>
      )}

      {/* Character grid */}
      {activeAlphabet && (
        <GlassCard className="flex flex-col">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <div className="font-display text-xl font-bold text-white">{activeAlphabet.title}</div>
              <div className="mt-0.5 text-xs text-brand-200/70">{activeAlphabet.description}</div>
            </div>
            <div className="hidden text-right text-[11px] text-brand-200/50 sm:block">
              点击字符 → 朗读<br />点击详情 → 跟读评分
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
            {activeAlphabet.chars.map((c, i) => {
              const isExpanded = selectedChar === c;
              return (
                <button
                  key={`${c.char}-${i}`}
                  onClick={() => {
                    // Always speak on click; expand on second state.
                    void speak(c.char, { language: selectedLang, rate: 0.85 });
                    setSelectedChar((prev) => (prev === c ? null : c));
                  }}
                  className={
                    "group flex flex-col items-center justify-center rounded-xl border p-3 transition " +
                    (isExpanded
                      ? "border-sky-400/60 bg-sky-400/15"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10")
                  }
                >
                  <div className="font-display text-3xl font-bold text-white md:text-4xl">
                    {c.char}
                  </div>
                  <div className="mt-1 text-[11px] font-medium text-sky-300">{c.romaji}</div>
                  {c.sound && (
                    <div className="mt-0.5 text-[10px] text-brand-200/50">{c.sound}</div>
                  )}
                  <Volume2 className="mt-1.5 h-3.5 w-3.5 text-brand-200/40 transition group-hover:text-sky-300" />
                </button>
              );
            })}
          </div>

          {/* Expanded character detail */}
          {selectedChar && (
            <div className="mt-6 rounded-2xl border border-sky-400/30 bg-sky-400/5 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="font-display text-5xl font-bold text-white">
                    {selectedChar.char}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-sky-300">{selectedChar.romaji}</div>
                    {selectedChar.sound && (
                      <div className="mt-0.5 text-xs text-brand-200/70">
                        发音提示：{selectedChar.sound}
                      </div>
                    )}
                    {selectedChar.example && (
                      <div className="mt-2 text-xs text-brand-200/70">
                        例：{selectedChar.example}
                        {selectedChar.exampleTranslation && (
                          <span className="text-brand-200/50"> · {selectedChar.exampleTranslation}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AudioButton text={selectedChar.char} lang={bcp47} size="md" label="朗读字符" />
                  <button
                    onClick={() => setSelectedChar(null)}
                    className="rounded-full border border-white/10 bg-white/5 p-2 text-brand-200/70 transition hover:bg-white/10"
                    aria-label="关闭详情"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Pronunciation practice */}
              <div className="mt-5 border-t border-white/5 pt-5">
                <div className="mb-3 text-xs uppercase tracking-[0.3em] text-fuchsia-300">
                  跟读练习
                </div>
                <PronunciationScore text={selectedChar.char} lang={bcp47} />
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <p className="mt-6 border-t border-white/5 pt-4 text-[11px] leading-relaxed text-brand-200/40">
            发音由浏览器 Web Speech API 合成，音质与覆盖范围因操作系统而异。声调语言（汉语普通话、粤语、泰语）的声调准确性需后续版本支持。如无法朗读，请在 Chrome / Edge 中安装对应语言的语音包。
          </p>
        </GlassCard>
      )}

      {/* Cross-link back to courses */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-sm">
        <div className="text-brand-200/70">准备好进入课程了？</div>
        <button
          onClick={() => navigate(`/courses?lang=${selectedLang}`)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-fuchsia-500 px-4 py-2 text-white transition hover:opacity-90"
        >
          查看课程 <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </PageShell>
  );
}
