import type { ReactNode } from "react";

export default function PageShell({
  title,
  subtitle,
  children,
  action,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <main className="page-enter mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      {(title || action) && (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            {title && (
              <h1 className="font-display text-3xl font-bold text-white md:text-4xl">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-2 text-sm text-brand-200/70 md:text-base">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </main>
  );
}
