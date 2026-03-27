export function AIPanelShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-sm">
      <h2 className="text-xl font-bold text-gray-50">AI Insights</h2>
      {children}
    </section>
  );
}
