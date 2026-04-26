import type { ReactNode } from "react";

export function AnalysisSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-50">{title}</h2>
        {description ? (
          <p className="text-xs text-gray-500">{description}</p>
        ) : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
