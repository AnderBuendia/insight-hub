import type { ReactNode } from "react";

export function AnalysisLayout({
  title,
  subtitle,
  leftTitle = "Metrics",
  rightTitle = "Filters",
  left,
  right,
}: {
  title: string;
  subtitle?: string;
  leftTitle?: string;
  rightTitle?: string;
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
        {subtitle ? <p className="text-base text-gray-600">{subtitle}</p> : null}
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">{leftTitle}</h2>
          <div className="mt-4">{left}</div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">{rightTitle}</h2>
          <div className="mt-4">{right}</div>
        </section>
      </div>
    </div>
  );
}
