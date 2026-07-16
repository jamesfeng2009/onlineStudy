import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Clock, BookOpen, Sparkles, Info, Type, BookMarked, Trophy, ClipboardList, Pen } from "lucide-react";
import PageShell from "../components/PageShell";
import { GlassCard } from "../components/GlassCard";
import { Seo } from "../components/Seo";
import { JsonLd, buildBreadcrumbLd, buildItemListLd } from "../components/JsonLd";
import LevelMetaCard from "../components/LevelMetaCard";
import { COURSES } from "../data/courses";
import { LANGUAGES } from "../data/languages";
import { getLanguage } from "../data/languages";
import { api } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import type { Language } from "../types";

export default function CoursesPage() {
  const { t } = useTranslation();
  const [lang, setLang] = useState<Language | "all">("all");
  const [lv, setLv] = useState<string>("all");
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  // Per-course progress fetched from the backend (only when logged in).
  // Keyed by courseId; value = { currentLesson, completedLesson }.
  const [progressMap, setProgressMap] = useState<Record<string, { currentLesson?: number; completedLesson?: number }>>({});

  useEffect(() => {
    if (!user) {
      setProgressMap({});
      return;
    }
    let cancelled = false;
    api
      .courseProgress()
      .then((rows) => {
        if (cancelled) return;
        const map: Record<string, { currentLesson?: number; completedLesson?: number }> = {};
        for (const row of rows) {
          const courseId = row.courseId as string | undefined;
          if (!courseId) continue;
          map[courseId] = {
            currentLesson: row.currentLesson as number | undefined,
            completedLesson: row.completedLesson as number | undefined,
          };
        }
        setProgressMap(map);
      })
      .catch((err) => {
        console.warn("CoursesPage: failed to load course progress:", err);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const LEVELS = useMemo(
    () => [
      { key: "all", label: t("courses.filter.all") },
      { key: "beginner", label: t("courses.levelGroups.beginner"), group: "beginner" as const },
      { key: "intermediate", label: t("courses.levelGroups.intermediate"), group: "intermediate" as const },
      { key: "advanced", label: t("courses.levelGroups.advanced"), group: "advanced" as const },
    ],
    [t]
  );

  const filtered = useMemo(() => {
    return COURSES.filter((c) => {
      if (lang !== "all" && c.language !== lang) return false;
      if (lv !== "all") {
        const found = LEVELS.find((x) => x.key === lv);
        if (found?.group && c.levelGroup !== found.group) return false;
      }
      return true;
    });
  }, [lang, lv, LEVELS]);

  return (
    <PageShell title={t("courses.title")} subtitle={t("courses.subtitle")}>
      <Seo
        title={t("courses.seoTitle", { defaultValue: "Courses — LangOria" })}
        description={t("courses.seoDescription", {
          defaultValue:
            "Browse structured language courses from A1 to C1 across English, Japanese, Korean, Chinese, Spanish, French and German.",
        })}
        pathname="/courses"
      />
      <JsonLd
        data={[
          buildBreadcrumbLd([
            { name: "Home", url: "https://lang-oria.com/" },
            { name: "Courses", url: "https://lang-oria.com/courses" },
          ]),
          buildItemListLd({
            name: "LangOria language courses",
            url: "https://lang-oria.com/courses",
            items: COURSES.map((c) => ({
              name: c.title,
              url: `https://lang-oria.com/learn/${c.id}`,
              description: c.description,
            })),
          }),
        ]}
      />
      {/* 语言切换 */}
      <div className="glass mb-6 flex flex-wrap items-center gap-2 rounded-2xl p-3">
        <span className="px-2 text-xs text-brand-200/70">{t("courses.filter.language")}</span>
        <Pill active={lang === "all"} onClick={() => setLang("all")}>
          {t("courses.filter.all")}
        </Pill>
        {LANGUAGES.map((l) => (
          <Pill key={l.id} active={lang === l.id} onClick={() => setLang(l.id)}>
            <span className="mr-1">{l.flag}</span>
            {l.native}
          </Pill>
        ))}
        <div className="mx-3 h-5 w-px bg-white/10" />
        <span className="px-2 text-xs text-brand-200/70">{t("courses.filter.level")}</span>
        {LEVELS.map((l) => (
          <Pill key={l.key} active={lv === l.key} onClick={() => setLv(l.key)}>
            {l.label}
          </Pill>
        ))}
      </div>

      {/* P0-3: 分级测试入口 */}
      <button
        onClick={() => navigate("/placement")}
        className="glass mb-3 flex w-full items-center justify-between rounded-2xl p-4 text-left transition hover:border-white/20"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-fuchsia-500 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold text-white">不知道从哪开始？试试分级测试</div>
            <div className="text-xs text-brand-200/70">6 道题自适应定位你的起始等级 · 免登录可测</div>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-brand-200/60" />
      </button>

      {/* P1-1: 字母 / 发音基础入口 */}
      <button
        onClick={() => navigate("/alphabet")}
        className="glass mb-3 flex w-full items-center justify-between rounded-2xl p-4 text-left transition hover:border-white/20"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-emerald-500 text-white">
            <Type className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold text-white">从字母开始：亚洲语入门</div>
            <div className="text-xs text-brand-200/70">Hiragana / Katakana / Hangul / Pinyin / Jyutping / Thai · 点击字符即朗读</div>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-brand-200/60" />
      </button>

      {/* P1-2: 阅读理解入口 */}
      <button
        onClick={() => navigate("/reading")}
        className="glass mb-3 flex w-full items-center justify-between rounded-2xl p-4 text-left transition hover:border-white/20"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-500 text-white">
            <BookMarked className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold text-white">阅读理解 · 补齐 CEFR 技能</div>
            <div className="text-xs text-brand-200/70">分级阅读 + 词汇注释 + 理解题 · 自动记录最佳成绩</div>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-brand-200/60" />
      </button>

      {/* P2-1: 周度排行榜入口 */}
      <button
        onClick={() => navigate("/league")}
        className="glass mb-3 flex w-full items-center justify-between rounded-2xl p-4 text-left transition hover:border-white/20"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold text-white">周度排行榜 · 争夺大师段位</div>
            <div className="text-xs text-brand-200/70">按周累计 XP · 青铜 → 白银 → 黄金 → 铂金 → 钻石 → 大师 · 每周一结算升降级</div>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-brand-200/60" />
      </button>

      {/* P2-2: CEFR 自评入口 */}
      <button
        onClick={() => navigate("/cefr-self-assessment")}
        className="glass mb-3 flex w-full items-center justify-between rounded-2xl p-4 text-left transition hover:border-white/20"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-emerald-500 text-white">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold text-white">CEFR 自评 · 我能做什么？</div>
            <div className="text-xs text-brand-200/70">按 Can-Do 条目自评 A1-C2 · 与分级测试互为补充 · 自动推断等级</div>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-brand-200/60" />
      </button>

      {/* P2-3: 写作训练入口 */}
      <button
        onClick={() => navigate("/writing")}
        className="glass mb-6 flex w-full items-center justify-between rounded-2xl p-4 text-left transition hover:border-white/20"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-pink-600 text-white">
            <Pen className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold text-white">写作训练 · 即时评分反馈</div>
            <div className="text-xs text-brand-200/70">议论文 / 邮件 / 摘要 / 故事 / 对话 · 字数 + 词汇多样性 + 关键词三维评分</div>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-brand-200/60" />
      </button>

      {/* 课程列表 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => {
          const prog = progressMap[c.id];
          const completedLesson = prog?.completedLesson ?? 0;
          // Render progress as 0-100 based on completed lessons vs total.
          const pct = prog && c.lessons > 0
            ? Math.min(100, Math.round((completedLesson / c.lessons) * 100))
            : c.progress ?? 0;
          const showProgress = !!user && !!prog;
          return (
          <GlassCard
            key={c.id}
            onClick={() => navigate(`/learn/${c.id}`)}
            className="flex flex-col"
          >
            <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
              <span className="text-6xl drop-shadow">{c.cover}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-sky-400/10 px-2.5 py-1 text-[11px] font-medium text-sky-300">
                {c.level}
              </span>
              <span className="rounded-full bg-fuchsia-400/10 px-2.5 py-1 text-[11px] font-medium text-fuchsia-300">
                {getLanguage(c.language).flag} {getLanguage(c.language).native}
              </span>
              {c.tags.slice(0, 1).map((tag, i) => (
                <span key={i} className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-brand-200/70">
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="mt-3 font-display text-lg font-bold text-white">{c.title}</h3>
            <p className="mt-1 text-sm text-brand-200/70">{c.description}</p>
            <LevelMetaCard language={c.language} level={c.level} variant="compact" />
            {showProgress && (
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-[11px] text-brand-200/70">
                  <span>进度</span>
                  <span>{completedLesson} / {c.lessons} · {pct}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 to-fuchsia-400"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )}
            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-brand-200/70">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" /> {t("courses.lessons", { count: c.lessons })}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {t("courses.minutes", { count: c.minutes })}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-sky-300 group-hover:text-sky-200">
                <Sparkles className="h-3.5 w-3.5" /> {t("courses.start")} <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </GlassCard>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-white/10 bg-white/5 p-10 text-center text-brand-200/70">
            {t("courses.noResults")}
          </div>
        )}
      </div>

      {/* P0-2: 等级标识免责声明 */}
      <div className="mt-8 flex items-start gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-[11px] leading-relaxed text-brand-200/50">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-200/40" />
        <p>
          等级标识（CEFR / JLPT / HSK / TOPIK）仅作参考性对齐，便于跨体系比较。
          CEFR 为 Council of Europe 商标、JLPT 为日本国际交流基金会商标、HSK 为汉办商标、TOPIK 为韩国国立国际教育院商标。
          本项目未获任何上述官方机构认证或授权，等级达成数据为项目内估算。
        </p>
      </div>
    </PageShell>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-full px-3 py-1.5 text-xs transition " +
        (active
          ? "bg-gradient-to-r from-sky-400/30 to-fuchsia-400/30 text-white ring-1 ring-white/20"
          : "bg-white/5 text-brand-200/80 hover:bg-white/10 hover:text-white")
      }
    >
      {children}
    </button>
  );
}
