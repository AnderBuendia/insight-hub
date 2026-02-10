import type { ReactNode } from "react";

export function AnalysisLayout({
  title,
  subtitle,
  left,
  right,
}: {
  title: string;
  subtitle?: string;
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <div>
      <header>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </header>

      <section style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
        <div>{left}</div>
        <div>{right}</div>
      </section>
    </div>
  );
}
