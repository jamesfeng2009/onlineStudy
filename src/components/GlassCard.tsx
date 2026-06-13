import type { ReactNode } from "react";
import { cn } from "../lib/utils";

export function GlassCard({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "glass relative overflow-hidden rounded-2xl p-5 md:p-6",
        onClick && "cursor-pointer transition hover:border-white/20 hover:-translate-y-0.5",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      {children}
    </div>
  );
}

export function StatTile({
  label,
  value,
  icon,
  tint,
  hint,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  tint?: string;
  hint?: string;
}) {
  return (
    <div className="glass group relative overflow-hidden rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-brand-200/60">{label}</div>
          <div className="mt-2 font-display text-3xl font-bold text-white md:text-4xl">
            {value}
          </div>
          {hint && <div className="mt-1 text-xs text-brand-200/60">{hint}</div>}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-white shadow-inner",
            tint
          )}
        >
          {icon}
        </div>
      </div>
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-2xl transition group-hover:bg-white/10" />
    </div>
  );
}
