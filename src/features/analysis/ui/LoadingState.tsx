export function LoadingState({ title = "Loading…" }: { title?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
}
