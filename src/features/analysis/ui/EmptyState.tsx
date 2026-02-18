export function EmptyState({
  title = "No analysis data available",
  description = "This dataset has no metrics or filters yet.",
  onReload,
}: {
  title?: string;
  description?: string;
  onReload: () => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-gray-600">{description}</p>

      <div className="mt-4">
        <button
          type="button"
          onClick={onReload}
          className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
        >
          Reload
        </button>
      </div>
    </div>
  );
}
