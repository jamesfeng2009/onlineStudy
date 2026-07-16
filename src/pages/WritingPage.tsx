/**
 * P2-3: 写作模块前端（WritingPage）
 *
 * 路由：
 *   /writing                              — 语言选择 + 题目列表
 *   /writing?lang=ja&level=N5&type=essay  — 筛选
 *   /writing/:id                          — 题目详情 + 写作 + 提交 + 评分反馈
 *
 * 流程：
 *   1. 用户在列表页选语言/类型/等级
 *   2. 进入详情 → 显示题目 + tips + 字数目标
 *   3. 在 textarea 中写作 → 实时显示字数
 *   4. 提交 → 后端评分 → 显示分数 + 4 项详细反馈 + 建议
 *   5. 可查看历史提交记录
 */

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Clock, Pen, Lightbulb,
  Loader2, RotateCcw, Send, Award, FileText, History,
} from "lucide-react";
import PageShell from "../components/PageShell";
import { Seo } from "../components/Seo";
import { GlassCard } from "../components/GlassCard";
import LoginPromptModal from "../components/LoginPromptModal";
import { api } from "../lib/api";
import type {
  WritingPromptSummary, WritingPromptDetail, WritingSubmissionEntry, WritingType,
} from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { LANGUAGES, getLanguage } from "../data/languages";
import type { Language } from "../types";

const TYPE_LABEL: Record<WritingType, string> = {
  essay: "议论文",
  email: "邮件",
  summary: "摘要",
  story: "故事",
  dialogue: "对话",
};

const TYPE_FILTERS: { key: WritingType | "all"; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "essay", label: "议论文" },
  { key: "email", label: "邮件" },
  { key: "summary", label: "摘要" },
  { key: "story", label: "故事" },
  { key: "dialogue", label: "对话" },
];

export default function WritingPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();

  if (id) {
    return <WritingDetail id={id} onBack={() => navigate("/writing")} />;
  }
  return <WritingList onOpen={(pid) => navigate(`/writing/${pid}`)} />;
}

// ============================================================
// WritingList: 语言选择 + 题目列表
// ============================================================

function WritingList({ onOpen }: { onOpen: (id: string) => void }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const selectedLang = searchParams.get("lang") as Language | null;
  const selectedLevel = searchParams.get("level");
  const selectedType = searchParams.get("type") as WritingType | null;

  const [prompts, setPrompts] = useState<WritingPromptSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 用户提交历史（仅登录），用于显示完成标记
  const [submissions, setSubmissions] = useState<WritingSubmissionEntry[]>([]);
  const [bestScoreMap, setBestScoreMap] = useState<Record<string, number>>({});

  const nativeLanguage = (user?.nativeLanguage as string) ?? "en";

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const params: Parameters<typeof api.writingPrompts>[0] = {
      nativeLanguage,
      ...(selectedLang ? { language: selectedLang } : {}),
      ...(selectedLevel ? { level: selectedLevel } : {}),
      ...(selectedType ? { type: selectedType } : {}),
    };
    Promise.all([
      api.writingPrompts(params),
      user ? api.writingSubmissions(selectedLang ?? undefined) : Promise.resolve([]),
    ])
      .then(([ps, subs]) => {
        if (cancelled) return;
        setPrompts(ps);
        setSubmissions(subs);
        const bestMap: Record<string, number> = {};
        for (const s of subs) {
          const wid = s.writingId;
          if (!bestMap[wid] || s.score > bestMap[wid]) bestMap[wid] = s.score;
        }
        setBestScoreMap(bestMap);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message ?? "加载题目失败");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedLang, selectedLevel, selectedType, nativeLanguage, user]);

  const updateParam = (key: string, value: string | null) => {
    const qs = new URLSearchParams(searchParams);
    if (value) qs.set(key, value);
    else qs.delete(key);
    setSearchParams(qs);
  };

  // 当前选定语言的所有可选 levels
  const availableLevels = useMemo(() => {
    if (!selectedLang) return [];
    const lang = getLanguage(selectedLang);
    return lang?.levels ?? [];
  }, [selectedLang]);

  return (
    <PageShell
      title="写作训练"
      subtitle="按分级题目写作 · 即时评分反馈 · 补齐 CEFR 输出技能"
      action={
        <Seo
          title="写作训练 · Writing"
          description="分级写作题目 + 即时评分反馈"
          pathname="/writing"
        />
      }
    >
      {/* 语言选择 */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => updateParam("lang", null)}
          className={
            "rounded-full px-3.5 py-1.5 text-xs transition " +
            (!selectedLang ? "bg-white/15 text-white" : "glass text-brand-200/70 hover:text-white")
          }
        >
          全部语言
        </button>
        {LANGUAGES.map((l) => (
          <button
            key={l.id}
            onClick={() => updateParam("lang", l.id)}
            className={
              "rounded-full px-3.5 py-1.5 text-xs transition " +
              (selectedLang === l.id
                ? "bg-white/15 text-white"
                : "glass text-brand-200/70 hover:text-white")
            }
          >
            {l.flag} {l.native}
          </button>
        ))}
      </div>

      {/* 类型筛选 */}
      <div className="mb-4 flex flex-wrap gap-2">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => updateParam("type", f.key === "all" ? null : f.key)}
            className={
              "rounded-full px-3 py-1.5 text-xs transition " +
              ((f.key === "all" ? !selectedType : selectedType === f.key)
                ? "bg-gradient-to-r from-sky-400 to-fuchsia-400 text-slate-900"
                : "glass text-brand-200/70 hover:text-white")
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 等级筛选（仅选定语言后显示） */}
      {selectedLang && availableLevels.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => updateParam("level", null)}
            className={
              "rounded-full px-3 py-1.5 text-xs transition " +
              (!selectedLevel ? "bg-white/15 text-white" : "glass text-brand-200/70 hover:text-white")
            }
          >
            全部等级
          </button>
          {availableLevels.map((lv) => (
            <button
              key={lv}
              onClick={() => updateParam("level", lv)}
              className={
                "rounded-full px-3 py-1.5 text-xs transition " +
                (selectedLevel === lv
                  ? "bg-white/15 text-white"
                  : "glass text-brand-200/70 hover:text-white")
              }
            >
              {lv}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <GlassCard className="p-8 text-center text-sm text-brand-200/70">
          <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
          正在加载题目…
        </GlassCard>
      )}

      {error && (
        <GlassCard className="p-4 text-sm text-rose-300">{error}</GlassCard>
      )}

      {!loading && prompts.length === 0 && !error && (
        <GlassCard className="p-8 text-center text-sm text-brand-200/60">
          暂无符合条件的写作题目，请稍后再来。
        </GlassCard>
      )}

      {/* 题目卡片列表 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {prompts.map((p) => {
          const best = bestScoreMap[p.id];
          return (
            <GlassCard key={p.id} className="flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-sky-400/10 px-2 py-0.5 text-sky-300">
                      {getLanguage(p.language).flag} {p.level}
                    </span>
                    <span className="rounded-full bg-fuchsia-400/10 px-2 py-0.5 text-fuchsia-300">
                      {TYPE_LABEL[p.type] ?? p.type}
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-brand-200/60">
                      <Clock className="h-3 w-3" /> {p.estMinutes}min
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-brand-200/60">
                      <Pen className="h-3 w-3" /> {p.minWords}-{p.maxWords} 字
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold text-white">{p.title}</h3>
                </div>
                {best !== undefined && (
                  <span className="flex-none rounded-full bg-amber-400/10 px-2 py-0.5 text-[11px] text-amber-300">
                    最佳 {best}
                  </span>
                )}
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-brand-200/70">{p.prompt}</p>
              {p.tips.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.tips.slice(0, 3).map((tip, idx) => (
                    <span
                      key={idx}
                      className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-brand-200/60"
                    >
                      💡 {tip}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-auto pt-3">
                <button
                  onClick={() => onOpen(p.id)}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-sky-300 transition hover:text-sky-200"
                >
                  开始写作 <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </PageShell>
  );
}

// ============================================================
// WritingDetail: 题目详情 + 写作 + 评分反馈
// ============================================================

function WritingDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const user = useAuthStore((s) => s.user);
  const [prompt, setPrompt] = useState<WritingPromptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<WritingSubmissionEntry | null>(null);
  const [history, setHistory] = useState<WritingSubmissionEntry[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showSample, setShowSample] = useState(false);

  const nativeLanguage = (user?.nativeLanguage as string) ?? "en";

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setResult(null);
    setContent("");
    Promise.all([
      api.writingPrompt(id, nativeLanguage),
      user ? api.writingSubmissions() : Promise.resolve([]),
    ])
      .then(([p, subs]) => {
        if (cancelled) return;
        setPrompt(p);
        setHistory(subs.filter((s) => s.writingId === id));
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message ?? "加载题目失败");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, nativeLanguage, user]);

  // 简易字数计算（与后端 tokenize 一致：CJK 按字符，拉丁按空格）
  const wordCount = useMemo(() => {
    const text = content.trim();
    if (!text) return 0;
    const cjkChars = (text.match(/[\u3400-\u9fff\u3040-\u30ff\uac00-\ud7af]/g) ?? []).length;
    const isCjk = cjkChars > text.length * 0.3;
    if (isCjk) {
      return text.replace(/[\s\p{P}]/gu, "").length;
    }
    return text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
  }, [content]);

  const handleSubmit = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    if (!content.trim()) {
      setError("请先写一些内容再提交");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const r = await api.submitWriting(id, content);
      setResult(r);
      setHistory((prev) => [r, ...prev]);
    } catch (err) {
      setError((err as Error).message ?? "提交失败");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setContent("");
    setResult(null);
    setError(null);
  };

  if (loading) {
    return (
      <PageShell title="写作题目" subtitle="加载中…">
        <GlassCard className="p-8 text-center text-sm text-brand-200/70">
          <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
          正在加载题目…
        </GlassCard>
      </PageShell>
    );
  }

  if (error && !prompt) {
    return (
      <PageShell title="写作题目" subtitle="加载失败">
        <GlassCard className="p-8 text-center">
          <div className="text-sm text-rose-300">{error}</div>
          <button
            onClick={onBack}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm text-brand-100 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" /> 返回列表
          </button>
        </GlassCard>
      </PageShell>
    );
  }

  if (!prompt) return null;

  const minWords = prompt.minWords;
  const maxWords = prompt.maxWords;
  const lengthPct = Math.min(100, Math.round((wordCount / maxWords) * 100));
  const lengthColor =
    wordCount < minWords ? "text-rose-300"
    : wordCount > maxWords * 1.5 ? "text-amber-300"
    : "text-emerald-300";

  return (
    <PageShell
      title={prompt.title}
      subtitle={`${getLanguage(prompt.language).flag} ${getLanguage(prompt.language).native} · ${prompt.level} · ${TYPE_LABEL[prompt.type] ?? prompt.type}`}
      action={
        <Seo
          title={prompt.title}
          description={prompt.prompt.slice(0, 100)}
          pathname={`/writing/${id}`}
          noindex
        />
      }
    >
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm text-brand-100 transition hover:bg-white/10"
      >
        <ArrowLeft className="h-4 w-4" /> 返回列表
      </button>

      {/* 题目卡片 */}
      <GlassCard className="mb-4 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-brand-200/70">
          <span className="rounded-full bg-sky-400/10 px-2 py-0.5 text-sky-300">
            {getLanguage(prompt.language).flag} {prompt.level}
          </span>
          <span className="rounded-full bg-fuchsia-400/10 px-2 py-0.5 text-fuchsia-300">
            {TYPE_LABEL[prompt.type] ?? prompt.type}
          </span>
          <span className="inline-flex items-center gap-0.5">
            <Clock className="h-3 w-3" /> {prompt.estMinutes}min
          </span>
          <span className="inline-flex items-center gap-0.5">
            <Pen className="h-3 w-3" /> 目标 {minWords}-{maxWords} 字
          </span>
        </div>
        <h2 className="mt-3 font-display text-xl font-bold text-white">{prompt.title}</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm text-brand-100">{prompt.prompt}</p>

        {prompt.tips.length > 0 && (
          <div className="mt-4 rounded-lg border border-amber-400/20 bg-amber-400/5 px-3 py-2">
            <div className="mb-1 flex items-center gap-1 text-xs font-semibold text-amber-300">
              <Lightbulb className="h-3.5 w-3.5" /> 写作提示
            </div>
            <ul className="list-disc space-y-1 pl-5 text-xs text-brand-200/80">
              {prompt.tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {prompt.sampleAnswer && (
          <div className="mt-3">
            <button
              onClick={() => setShowSample((v) => !v)}
              className="inline-flex items-center gap-1 text-xs text-sky-300 transition hover:text-sky-200"
            >
              <FileText className="h-3.5 w-3.5" />
              {showSample ? "隐藏范文" : "查看范文"}
            </button>
            {showSample && (
              <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-white/5 px-3 py-2 text-xs text-brand-200/80">
                {prompt.sampleAnswer}
              </pre>
            )}
          </div>
        )}
      </GlassCard>

      {/* 写作区域 */}
      <GlassCard className="mb-4 p-5">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-semibold text-white">你的写作</div>
          <div className="flex items-center gap-3 text-xs">
            <span className={lengthColor}>
              {wordCount} / {minWords}-{maxWords} 字
            </span>
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/5">
              <div
                className={
                  "h-full rounded-full " +
                  (wordCount < minWords
                    ? "bg-rose-400"
                    : wordCount > maxWords * 1.5
                    ? "bg-amber-400"
                    : "bg-emerald-400")
                }
                style={{ width: `${lengthPct}%` }}
              />
            </div>
          </div>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, 10000))}
          rows={12}
          placeholder={`用 ${getLanguage(prompt.language).native} 写作，按题目要求展开。字数目标：${minWords}-${maxWords}`}
          className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-brand-200/40 focus:border-sky-400/40 focus:outline-none"
          disabled={submitting}
        />
        <div className="mt-1 text-right text-[10px] text-brand-200/40">
          {content.length} / 10000 字符
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={handleSubmit}
            disabled={submitting || !content.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-fuchsia-400 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            提交评分
          </button>
          <button
            onClick={handleReset}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm text-brand-200 transition hover:bg-white/10 disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
            清空
          </button>
        </div>

        {error && (
          <div className="mt-3 rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
            {error}
          </div>
        )}
      </GlassCard>

      {/* 评分结果 */}
      {result && (
        <GlassCard className="mb-4 border-emerald-400/30 p-5">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-300" />
            <div className="font-display text-lg font-bold text-white">评分结果</div>
          </div>

          <div className="mt-4 flex items-center gap-6">
            <div className="text-center">
              <div className="text-xs text-brand-200/60">综合</div>
              <div
                className={
                  "font-display text-4xl font-bold " +
                  (result.score >= 80
                    ? "text-emerald-300"
                    : result.score >= 60
                    ? "text-amber-300"
                    : "text-rose-300")
                }
              >
                {result.score}
              </div>
            </div>
            <div className="grid flex-1 grid-cols-3 gap-3">
              <ScoreBar label="字数" value={result.lengthScore} />
              <ScoreBar label="词汇多样性" value={result.varietyScore} />
              <ScoreBar label="关键词" value={result.keywordScore} />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <FeedbackRow label="字数反馈" text={result.feedback.lengthHint} />
            <FeedbackRow label="词汇反馈" text={result.feedback.varietyHint} />
            <FeedbackRow label="关键词反馈" text={result.feedback.keywordHint} />
            {result.feedback.matchedKeywords.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-emerald-300">✓ 已命中：</span>
                {result.feedback.matchedKeywords.map((k) => (
                  <span key={k} className="rounded-md bg-emerald-400/10 px-1.5 py-0.5 text-emerald-200">
                    {k}
                  </span>
                ))}
              </div>
            )}
            {result.feedback.missedKeywords.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-rose-300">✗ 缺失：</span>
                {result.feedback.missedKeywords.map((k) => (
                  <span key={k} className="rounded-md bg-rose-400/10 px-1.5 py-0.5 text-rose-200">
                    {k}
                  </span>
                ))}
              </div>
            )}
          </div>

          {result.feedback.suggestions.length > 0 && (
            <div className="mt-4 rounded-lg border border-sky-400/20 bg-sky-400/5 px-3 py-2">
              <div className="mb-1 flex items-center gap-1 text-xs font-semibold text-sky-300">
                <Lightbulb className="h-3.5 w-3.5" /> 改进建议
              </div>
              <ul className="list-disc space-y-1 pl-5 text-xs text-brand-200/80">
                {result.feedback.suggestions.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </GlassCard>
      )}

      {/* 历史提交 */}
      {history.length > 0 && (
        <GlassCard className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <History className="h-4 w-4 text-brand-200/70" />
            <div className="text-sm font-semibold text-white">历史提交（{history.length} 次）</div>
          </div>
          <div className="space-y-2">
            {history.map((s) => (
              <div
                key={s.id}
                className="rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        "rounded-full px-2 py-0.5 font-bold " +
                        (s.score >= 80
                          ? "bg-emerald-400/10 text-emerald-300"
                          : s.score >= 60
                          ? "bg-amber-400/10 text-amber-300"
                          : "bg-rose-400/10 text-rose-300")
                      }
                    >
                      {s.score}
                    </span>
                    <span className="text-brand-200/70">
                      {s.wordCount} 字 · {new Date(s.submittedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-200/50">
                    <span>字数 {s.lengthScore}</span>
                    <span>·</span>
                    <span>多样 {s.varietyScore}</span>
                    <span>·</span>
                    <span>关键词 {s.keywordScore}</span>
                  </div>
                </div>
                <div className="mt-1 line-clamp-2 text-brand-200/60">{s.content}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {showLogin && <LoginPromptModal onClose={() => setShowLogin(false)} />}
    </PageShell>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color =
    value >= 80 ? "from-emerald-400 to-green-500"
    : value >= 60 ? "from-amber-400 to-yellow-500"
    : "from-rose-400 to-red-500";
  return (
    <div>
      <div className="text-[11px] text-brand-200/60">{label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="font-display text-lg font-bold text-white">{value}</span>
        <span className="text-[10px] text-brand-200/50">/100</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className={"h-full rounded-full bg-gradient-to-r " + color}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function FeedbackRow({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <span className="mt-0.5 flex-none rounded-md bg-white/5 px-1.5 py-0.5 text-brand-200/70">
        {label}
      </span>
      <span className="flex-1 text-brand-100">{text}</span>
    </div>
  );
}
