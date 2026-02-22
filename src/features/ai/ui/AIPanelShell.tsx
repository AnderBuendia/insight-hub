export function AIPanelShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold">AI Insights</h2>
      {children}
    </section>
  );
}
