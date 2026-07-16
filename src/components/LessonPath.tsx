/**
 * P0-1: LessonPath — renders the Unit → Lesson tree for a course.
 *
 * Shows each unit as a section with its lessons listed inside. Each
 * lesson chip reflects its derived status:
 *   - locked: greyed out, not clickable
 *   - unlocked: highlighted, "开始" CTA
 *   - in_progress: amber ring, "继续"
 *   - completed: green check, "重做"
 *
 * Clicking an unlocked/in_progress/completed lesson fires onSelect
 * so the parent (LearnPage) can switch to the LessonPlayer view.
 */
import { useEffect, useState } from "react";
import { Lock,
  Check,
  Play,
  RotateCcw,
  Clock,
  Trophy,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { GlassCard } from "./GlassCard";
import { api } from "../lib/api";
import type { CourseUnitsResp, LessonSummary, LessonStatus } from "../lib/api";
import { useAuthStore } from "../store/authStore";

interface LessonPathProps {
  courseId: string;
  /** Called when the user clicks a lesson they can start/continue. */
  onSelectLesson: (lessonId: string) => void;
  /** Optional: lift the loaded data up so the parent can show
   *  progress summary / refresh after a lesson completes. */
  onData?: (data: CourseUnitsResp | null) => void;
}

function useStatusLabel(t: (key: string) => string): Record<LessonStatus, string> {
  return {
    locked: t("lesson.status.locked"),
    unlocked: t("lesson.status.unlocked"),
    in_progress: t("lesson.status.inProgress"),
    completed: t("lesson.status.completed"),
  };
}

function statusChipClass(status: LessonStatus): string {
  switch (status) {
    case "locked":
      return "border-white/10 bg-white/[0.03] text-brand-200/40";
    case "unlocked":
      return "border-sky-400/40 bg-sky-500/10 text-sky-100 hover:bg-sky-500/20";
    case "in_progress":
      return "border-amber-400/50 bg-amber-500/15 text-amber-100 hover:bg-amber-500/25";
    case "completed":
      return "border-emerald-400/40 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20";
  }
}

function skillLabel(skillType: string, t: (key: string) => string): string {
  switch (skillType) {
    case "vocab": return t("lesson.skill.vocab");
    case "grammar": return t("lesson.skill.grammar");
    case "listening": return t("lesson.skill.listening");
    case "speaking": return t("lesson.skill.speaking");
    case "mixed": return t("lesson.skill.mixed");
    default: return skillType;
  }
}

export default function LessonPath({ courseId, onSelectLesson, onData }: LessonPathProps) {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [data, setData] = useState<CourseUnitsResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .courseUnits(courseId)
      .then((d) => {
        if (cancelled) return;
        setData(d);
        onData?.(d);
      })
      .catch((err) => {
        if (cancelled) return;
        setError((err as Error).message ?? t("lesson.loadFailed"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [courseId, onData]);

  if (loading) {
    return (
      <GlassCard className="p-8 text-center text-sm text-brand-200/70">
        {t("lesson.loadingPath")}
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard className="p-8 text-center">
        <div className="text-sm text-rose-300">{error}</div>
        {!user && (
          <div className="mt-2 text-xs text-brand-200/60">
            {t("lesson.loginToTrackProgress")}
          </div>
        )}
      </GlassCard>
    );
  }

  if (!data || data.units.length === 0) {
    return (
      <GlassCard className="p-8 text-center text-sm text-brand-200/70">
        {t("lesson.noLessons")}
      </GlassCard>
    );
  }

  const totalLessons = data.course.totalLessons;
  const completedCount = data.units.reduce(
    (sum, u) => sum + u.lessons.filter((l) => l.status === "completed").length,
    0
  );
  const overallPct =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Progress summary */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-brand-200/60">
              {t("lesson.courseProgress")}
            </div>
            <div className="mt-1 font-display text-3xl font-bold text-white">
              {overallPct}%
            </div>
            <div className="text-xs text-brand-200/60">
              {t("lesson.completedCount", { completed: completedCount, total: totalLessons })}
            </div>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-500 text-white">
            <Trophy className="h-7 w-7" />
          </div>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-fuchsia-400 transition-all duration-500"
            style={{ width: `${overallPct}%` }}
          />
        </div>
      </GlassCard>

      {/* Units + lessons */}
      {data.units.map((unit) => {
        const unitCompleted = unit.lessons.filter(
          (l) => l.status === "completed"
        ).length;
        return (
          <div key={unit.id}>
            <div className="mb-3 flex items-center gap-2 px-1">
              <h3 className="font-display text-lg font-bold text-white">
                {unit.title}
              </h3>
              <span className="text-xs text-brand-200/60">
                {unitCompleted}/{unit.lessons.length}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {unit.lessons.map((lesson) => (
                <LessonChip
                  key={lesson.id}
                  lesson={lesson}
                  onSelect={onSelectLesson}
                  t={t}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LessonChip({
  lesson,
  onSelect,
  t,
}: {
  lesson: LessonSummary;
  onSelect: (lessonId: string) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}) {
  const isLocked = lesson.status === "locked";
  const isCompleted = lesson.status === "completed";
  const statusLabel = useStatusLabel(t);

  const Icon = isLocked
    ? Lock
    : isCompleted
      ? Check
      : Play;

  const cta =
    lesson.status === "locked"
      ? statusLabel.locked
      : lesson.status === "completed"
        ? t("lesson.status.redo")
        : lesson.status === "in_progress"
          ? t("lesson.status.continue")
          : statusLabel.unlocked;

  return (
    <button
      disabled={isLocked}
      onClick={() => !isLocked && onSelect(lesson.id)}
      className={
        "glass flex w-full items-center gap-3 rounded-xl border p-4 text-left transition " +
        statusChipClass(lesson.status) +
        (isLocked ? " cursor-not-allowed" : " hover:-translate-y-0.5")
      }
    >
      <div
        className={
          "flex h-10 w-10 flex-none items-center justify-center rounded-lg " +
          (lesson.isCheckpoint
            ? "bg-gradient-to-br from-amber-400 to-orange-500 text-slate-900"
            : "bg-white/10")
        }
      >
        {lesson.isCheckpoint ? (
          <Trophy className="h-5 w-5" />
        ) : (
          <Icon className="h-5 w-5" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-white">
          {lesson.title}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-brand-200/60">
          <span>{skillLabel(lesson.skillType, t)}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-0.5">
            <Clock className="h-3 w-3" />
            {lesson.durationMin}min
          </span>
          {lesson.bestScore !== null && (
            <>
              <span>·</span>
              <span className="text-amber-300">{t("lesson.bestScore", { score: lesson.bestScore })}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-none items-center gap-1 text-xs font-medium">
        <span>{cta}</span>
        {!isLocked && <ChevronRight className="h-3.5 w-3.5" />}
      </div>
    </button>
  );
}

/** Re-fetch the course units tree. Exported so the LessonPlayer can
 *  call it after completing a lesson to refresh the path. */
export async function refreshCourseUnits(courseId: string): Promise<CourseUnitsResp | null> {
  try {
    return await api.courseUnits(courseId);
  } catch {
    return null;
  }
}

/** Convenience: RotateCcw re-export so callers can import icons from
 *  this module if they want a consistent look for "retry". */
export { RotateCcw };
