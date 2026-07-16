/**
 * P0-2: 等级元数据展示卡片
 *
 * 在 CoursesPage / LearnPage 中展示某语言某等级的 LevelMeta：
 *   - CEFR 对齐标识
 *   - 学习目标（learningGoals，本项目原创描述）
 *   - 目标词汇量 / 建议学时
 *   - 应掌握语法点
 *   - 对齐的国际能力框架（CEFR / JLPT / HSK / TOPIK）
 *
 * ⚠️ 法律合规：learningGoals 是项目原创描述，不抄 CEFR Can-Do 原文。
 * 卡片底部展示商标归属与"非官方认证"声明。
 */

import { useTranslation } from "react-i18next";
import { BookOpen, Clock, Target, GraduationCap, Layers } from "lucide-react";
import type { Language } from "../types";
import { getLevelMeta } from "../data/level-meta";
import { cefrEquivalent } from "../lib/level-utils";

interface Props {
  language: Language;
  /** Raw level code, e.g. "A1" / "TOPIK3" / "N5" / "HSK4". */
  level: string;
  /** "compact": 单行 inline 摘要（用于课程卡片）
   *  "full":    GlassCard 完整版（用于 LearnPage 顶部）
   *  默认 "full" */
  variant?: "compact" | "full";
}

export default function LevelMetaCard({ language, level, variant = "full" }: Props) {
  const { t } = useTranslation();
  const meta = getLevelMeta(language, level);
  if (!meta) {
    // 没有 LevelMeta 时静默渲染空（向后兼容老数据）
    return null;
  }
  const cefr = cefrEquivalent(language, level) ?? meta.cefrAlignment;
  const framework = meta.frameworkAlignment?.framework ?? "CEFR";
  const frameworkLabel = t(`levelMeta.framework.${framework}`, { defaultValue: framework });

  if (variant === "compact") {
    return (
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-brand-200/70">
        <span className="inline-flex items-center gap-1">
          <span className="text-brand-200/50">{t("levelMeta.alignment")}</span>
          <span className="rounded bg-sky-400/10 px-1.5 py-0.5 text-sky-300">CEFR {cefr}</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <BookOpen className="h-3 w-3" />~{meta.vocabTarget.toLocaleString()} {t("levelMeta.words")}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" />~{meta.guidedHours}{t("levelMeta.hours")}
        </span>
      </div>
    );
  }

  return (
    <div className="glass relative overflow-hidden rounded-2xl p-5 md:p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      {/* 标题行 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-sky-400/15 px-3 py-1 text-xs font-semibold text-sky-300">
          {meta.code}
        </span>
        <span className="text-base font-semibold text-white">{t(meta.name)}</span>
        <span className="rounded-full bg-fuchsia-400/10 px-2.5 py-0.5 text-[11px] text-fuchsia-300">
          {t("levelMeta.alignment")} CEFR {cefr}
        </span>
        <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] text-brand-200/70">
          {frameworkLabel}
        </span>
      </div>

      {/* 数据摘要 */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <SummaryTile icon={<BookOpen className="h-4 w-4" />} label={t("levelMeta.vocabTarget")} value={`~${meta.vocabTarget.toLocaleString()}`} />
        <SummaryTile icon={<Clock className="h-4 w-4" />} label={t("levelMeta.guidedHours")} value={`~${meta.guidedHours} h`} />
        <SummaryTile icon={<Layers className="h-4 w-4" />} label={t("levelMeta.grammarPoints")} value={`${meta.grammarPoints.length}`} />
      </div>

      {/* 学习目标 */}
      <div className="mt-5">
        <div className="flex items-center gap-1.5 text-xs font-medium text-brand-200/80">
          <Target className="h-3.5 w-3.5" />
          {t("levelMeta.learningGoals")}
        </div>
        <ul className="mt-2 space-y-1.5">
          {meta.learningGoals.map((g, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-brand-100/90">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-sky-400" />
              <span>{t(g)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 应掌握语法点 */}
      <div className="mt-5">
        <div className="flex items-center gap-1.5 text-xs font-medium text-brand-200/80">
          <GraduationCap className="h-3.5 w-3.5" />
          {t("levelMeta.grammarToMaster")}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {meta.grammarPoints.map((g, i) => (
            <span
              key={i}
              className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-brand-100/80"
            >
              {t(g)}
            </span>
          ))}
        </div>
      </div>

      {/* 免责声明 */}
      <p className="mt-5 border-t border-white/5 pt-3 text-[10px] leading-relaxed text-brand-200/40">
        {t("levelMeta.disclaimer")}
      </p>
    </div>
  );
}

function SummaryTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white/5 px-3 py-2">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-brand-200/60">
        {icon}
        {label}
      </div>
      <div className="mt-1 font-display text-lg font-bold text-white">{value}</div>
    </div>
  );
}
