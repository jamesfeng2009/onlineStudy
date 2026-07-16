/**
 * P2-2: CEFR 自评（Cefr Self-Assessment）前端
 *
 * 路由：
 *   /cefr-self-assessment                       — 选择语言
 *   /cefr-self-assessment?lang=ja               — 该语言的自评问卷
 *
 * 流程：
 *   1. 选语言 → 拉取项目原创 Can-Do 条目（6 个 CEFR 等级，每级 4 条）
 *   2. 用户勾选"我能做到"的条目 → 自动推荐 CEFR 等级（按勾选的最高等级）
 *   3. 用户可手动覆盖等级，可写备注
 *   4. PUT /user/cefr-self-assessment 保存
 *   5. 展示已保存的自评 vs 当前分级测试结果对比
 */

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Loader2, Check, X, Save, RotateCcw, ArrowLeft, ArrowRight,
  Award, ClipboardList, Info, Sparkles,
} from "lucide-react";
import PageShell from "../components/PageShell";
import { Seo } from "../components/Seo";
import { GlassCard } from "../components/GlassCard";
import LoginPromptModal from "../components/LoginPromptModal";
import { api } from "../lib/api";
import type {
  CefrLevel, CefrLevelMeta, CefrSelfAssessmentEntry,
} from "../lib/api";
import { LANGUAGES, getLanguage } from "../data/languages";
import { useAuthStore } from "../store/authStore";

const CEFR_LEVELS: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

const CEFR_LEVEL_COLOR: Record<CefrLevel, string> = {
  A1: "from-emerald-400 to-green-500",
  A2: "from-sky-400 to-cyan-500",
  B1: "from-amber-400 to-yellow-500",
  B2: "from-orange-400 to-rose-500",
  C1: "from-fuchsia-400 to-purple-600",
  C2: "from-rose-400 via-fuchsia-500 to-violet-700",
};

const SKILL_LABEL: Record<string, string> = {
  listening: "听",
  reading: "读",
  speaking: "说",
  writing: "写",
};

export default function CefrSelfAssessmentPage() {
  const user = useAuthStore((s) => s.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const lang = searchParams.get("lang");

  const [levels, setLevels] = useState<CefrLevelMeta[]>([]);
  const [levelsLoading, setLevelsLoading] = useState(true);
  const [savedEntry, setSavedEntry] = useState<CefrSelfAssessmentEntry | null>(null);
  const [savedLoading, setSavedLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  // 选中的 can-do keys
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  // 手动覆盖的 CEFR 等级（默认根据勾选自动推断）
  const [manualLevel, setManualLevel] = useState<CefrLevel | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // 1. 拉 can-do 条目（无登录可拉）
  useEffect(() => {
    let cancelled = false;
    setLevelsLoading(true);
    api
      .cefrCanDo()
      .then((resp) => {
        if (cancelled) return;
        setLevels(resp.levels);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        console.warn("Failed to load CEFR can-do:", err.message);
      })
      .finally(() => {
        if (!cancelled) setLevelsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // 2. 拉用户已有自评（仅登录用户；需 lang 选定后）
  useEffect(() => {
    if (!user || !lang) {
      setSavedEntry(null);
      setSavedLoading(false);
      return;
    }
    let cancelled = false;
    setSavedLoading(true);
    api
      .cefrSelfAssessment(lang)
      .then((rows) => {
        if (cancelled) return;
        const entry = rows.find((r) => r.language === lang) ?? null;
        setSavedEntry(entry);
        // 用已保存的数据初始化表单
        if (entry) {
          setSelectedKeys(new Set(entry.canDoKeys ?? []));
          setManualLevel(entry.cefrLevel);
          setNote(entry.note ?? "");
        } else {
          setSelectedKeys(new Set());
          setManualLevel(null);
          setNote("");
        }
      })
      .catch((err: Error) => {
        if (cancelled) return;
        console.warn("Failed to load CEFR self-assessment:", err.message);
      })
      .finally(() => {
        if (!cancelled) setSavedLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, lang]);

  // 根据勾选项自动推断 CEFR 等级：取被勾选的最高等级
  const inferredLevel = useMemo<CefrLevel | null>(() => {
    let maxRank = 0;
    for (const lvl of levels) {
      const allChecked = lvl.statements.every((s) => selectedKeys.has(s.key));
      const anyChecked = lvl.statements.some((s) => selectedKeys.has(s.key));
      // 至少勾选该等级的 3/4 条且更高等级未达成视为达到该等级
      if (allChecked && anyChecked) {
        if (lvl.rank > maxRank) maxRank = lvl.rank;
      }
    }
    return maxRank > 0 ? CEFR_LEVELS[maxRank - 1] : null;
  }, [levels, selectedKeys]);

  const effectiveLevel: CefrLevel | null = manualLevel ?? inferredLevel;

  const toggleKey = (key: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleReset = () => {
    setSelectedKeys(new Set());
    setManualLevel(null);
    setNote("");
    setSubmitMsg(null);
  };

  const handleSubmit = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    if (!lang) return;
    if (!effectiveLevel) {
      setSubmitMsg({ type: "err", text: "请至少勾选一条 Can-Do 条目，或手动选择一个等级" });
      return;
    }
    setSubmitting(true);
    setSubmitMsg(null);
    try {
      const saved = await api.saveCefrSelfAssessment({
        language: lang,
        cefrLevel: effectiveLevel,
        canDoKeys: Array.from(selectedKeys),
        note: note.trim() || undefined,
      });
      setSavedEntry(saved);
      setManualLevel(saved.cefrLevel);
      setSubmitMsg({ type: "ok", text: "已保存自评结果" });
    } catch (err) {
      setSubmitMsg({ type: "err", text: (err as Error).message ?? "保存失败" });
    } finally {
      setSubmitting(false);
    }
  };

  // ====== 语言选择视图 ======
  if (!lang) {
    return (
      <PageShell
        title="CEFR 自评"
        subtitle="按 Can-Do 条目自评语言能力等级（A1-C2）· 与分级测试互为补充"
        action={
          <Seo
            title="CEFR 自评 · Can-Do 自测"
            description="按 Can-Do 条目自评你的语言能力等级"
            pathname="/cefr-self-assessment"
          />
        }
      >
        <GlassCard className="mb-4 p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-fuchsia-500 text-white">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div className="flex-1 text-sm text-brand-200/70">
              <div className="font-semibold text-white">什么是 CEFR 自评？</div>
              <div className="mt-1 leading-relaxed">
                欧洲共同语言参考标准（CEFR）将语言能力划分为 A1 至 C2 六个等级。
                自评是主观判断"我能做什么"，与基于客观题目的分级测试互为补充 —
                两者对比可发现你的真实水平与自我认知的差距。
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              onClick={() => {
                const qs = new URLSearchParams(searchParams);
                qs.set("lang", l.id);
                setSearchParams(qs);
              }}
              className="glass rounded-2xl p-4 text-left transition hover:-translate-y-0.5"
            >
              <div className="text-4xl">{l.flag}</div>
              <div className="mt-2 font-display text-lg font-bold text-white">{l.native}</div>
              <div className="text-xs text-brand-200/70">{l.name}</div>
            </button>
          ))}
        </div>
      </PageShell>
    );
  }

  const langMeta = getLanguage(lang);
  if (!langMeta) {
    return (
      <PageShell title="CEFR 自评" subtitle="语言不存在">
        <GlassCard className="p-6 text-center">
          <div className="text-sm text-rose-300">未找到该语言：{lang}</div>
          <button
            onClick={() => setSearchParams(new URLSearchParams())}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm text-brand-100 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" /> 返回选择
          </button>
        </GlassCard>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={`CEFR 自评 · ${langMeta.flag} ${langMeta.native}`}
      subtitle="勾选你能做到的 Can-Do 条目，系统自动推断等级 · 可手动覆盖"
      action={
        <Seo
          title={`CEFR 自评 · ${langMeta.native}`}
          description={`按 Can-Do 条目自评你的 ${langMeta.native} 能力等级`}
          pathname={`/cefr-self-assessment?lang=${lang}`}
          noindex
        />
      }
    >
      {/* 顶部：返回按钮 + 当前推断等级 */}
      <GlassCard className="mb-4 p-5">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setSearchParams(new URLSearchParams())}
            className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-white/5 text-brand-200 transition hover:bg-white/10"
            title="返回语言选择"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-brand-200/60">当前推断等级</div>
            <div className="mt-1 flex items-center gap-3">
              {effectiveLevel ? (
                <span
                  className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${CEFR_LEVEL_COLOR[effectiveLevel]} px-4 py-1.5 text-sm font-bold text-white shadow-lg`}
                >
                  <Award className="h-4 w-4" />
                  {effectiveLevel}
                </span>
              ) : (
                <span className="text-sm text-brand-200/60">
                  尚未勾选任何条目
                </span>
              )}
              {manualLevel && manualLevel !== inferredLevel && (
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-brand-200/60">
                  手动覆盖（自动推断：{inferredLevel ?? "—"}）
                </span>
              )}
            </div>
          </div>
          {savedEntry && (
            <div className="text-right text-xs text-brand-200/60">
              <div>已保存自评</div>
              <div className="mt-0.5 font-semibold text-amber-300">
                {savedEntry.cefrLevel}
              </div>
              <div className="text-[10px]">
                {new Date(savedEntry.updatedAt).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      {/* 未登录提示 */}
      {!user && (
        <GlassCard className="mb-4 p-5">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 flex-none text-sky-300" />
            <div className="flex-1 text-sm text-brand-200/70">
              未登录也可以浏览 Can-Do 条目和试评，但保存需要登录。
            </div>
            <button
              onClick={() => setShowLogin(true)}
              className="rounded-xl bg-gradient-to-r from-sky-400 to-fuchsia-400 px-4 py-2 text-xs font-semibold text-slate-900 transition hover:-translate-y-0.5"
            >
              立即登录
            </button>
          </div>
        </GlassCard>
      )}

      {/* Can-Do 条目分等级展示 */}
      {levelsLoading ? (
        <GlassCard className="p-8 text-center text-sm text-brand-200/70">
          <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
          正在加载 Can-Do 条目…
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {levels.map((lvl) => {
            const checkedCount = lvl.statements.filter((s) => selectedKeys.has(s.key)).length;
            const isCurrentLevel = effectiveLevel === lvl.level;
            return (
              <GlassCard
                key={lvl.level}
                className={
                  "overflow-hidden p-0 " +
                  (isCurrentLevel ? "ring-1 ring-amber-300/40" : "")
                }
              >
                <div
                  className={
                    "flex items-center justify-between px-5 py-3 " +
                    (isCurrentLevel
                      ? `bg-gradient-to-r ${CEFR_LEVEL_COLOR[lvl.level]} text-white`
                      : "bg-white/5")
                  }
                >
                  <div className="flex items-center gap-3">
                    <div className="font-display text-xl font-bold">{lvl.level}</div>
                    <div>
                      <div className={"text-sm font-semibold " + (isCurrentLevel ? "text-white" : "text-white")}>
                        {lvl.label}
                      </div>
                      <div className={"text-[11px] " + (isCurrentLevel ? "text-white/80" : "text-brand-200/60")}>
                        {lvl.description}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "rounded-full px-3 py-1 text-xs " +
                      (isCurrentLevel ? "bg-white/20 text-white" : "bg-white/5 text-brand-200/70")
                    }
                  >
                    {checkedCount} / {lvl.statements.length}
                  </div>
                </div>
                <div className="divide-y divide-white/5">
                  {lvl.statements.map((s) => {
                    const checked = selectedKeys.has(s.key);
                    return (
                      <button
                        key={s.key}
                        onClick={() => toggleKey(s.key)}
                        className={
                          "flex w-full items-start gap-3 px-5 py-3 text-left transition " +
                          (checked ? "bg-emerald-400/5" : "hover:bg-white/5")
                        }
                      >
                        <div
                          className={
                            "mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-md border transition " +
                            (checked
                              ? "border-emerald-400 bg-emerald-400 text-slate-900"
                              : "border-white/20 text-transparent")
                          }
                        >
                          {checked ? <Check className="h-3.5 w-3.5" /> : <X className="h-3 w-3 opacity-0" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[10px] text-brand-200/70">
                              {SKILL_LABEL[s.skill] ?? s.skill}
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-brand-100">{s.text}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* 手动覆盖 + 备注 + 提交 */}
      {!levelsLoading && (
        <GlassCard className="mt-4 p-5">
          <div className="mb-4">
            <div className="text-sm font-semibold text-white">手动覆盖等级（可选）</div>
            <div className="mt-1 text-xs text-brand-200/60">
              若你认为自动推断不准，可在此手动指定一个等级
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setManualLevel(null)}
                className={
                  "rounded-full px-3 py-1.5 text-xs transition " +
                  (manualLevel === null
                    ? "bg-white/15 text-white shadow-inner"
                    : "glass text-brand-200/70 hover:text-white")
                }
              >
                自动
              </button>
              {CEFR_LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setManualLevel(lvl)}
                  className={
                    "rounded-full px-3 py-1.5 text-xs font-semibold transition " +
                    (manualLevel === lvl
                      ? `bg-gradient-to-r ${CEFR_LEVEL_COLOR[lvl]} text-white shadow-lg`
                      : "glass text-brand-200/70 hover:text-white")
                  }
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-white">备注（可选）</div>
            <div className="mt-1 text-xs text-brand-200/60">
              最多 500 字 · 记录你自评的理由或特殊情况
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 500))}
              rows={3}
              placeholder="例如：我能在商务会议中流利交流，但写作还停留在 B1 水平"
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-brand-200/40 focus:border-sky-400/40 focus:outline-none"
            />
            <div className="mt-1 text-right text-[10px] text-brand-200/40">
              {note.length} / 500
            </div>
          </div>

          {submitMsg && (
            <div
              className={
                "mt-3 rounded-lg px-3 py-2 text-xs " +
                (submitMsg.type === "ok"
                  ? "bg-emerald-500/10 text-emerald-200"
                  : "bg-rose-500/10 text-rose-200")
              }
            >
              {submitMsg.text}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={handleSubmit}
              disabled={submitting || !effectiveLevel}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-fuchsia-400 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              保存自评
            </button>
            <button
              onClick={handleReset}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm text-brand-200 transition hover:bg-white/10 disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
              重置
            </button>
          </div>
        </GlassCard>
      )}

      {showLogin && <LoginPromptModal onClose={() => setShowLogin(false)} />}
    </PageShell>
  );
}
