export function LoadingState({ title = "Loading…" }: { title?: string }) {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-sm">
      <p className="text-sm text-gray-300">{title}</p>
    </div>
  );
}
