export function MetricsPlaceholder() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">Placeholder — metrics will be displayed here.</p>
      <div className="space-y-2">
        <div className="rounded-lg bg-gray-700/50 p-4">
          <p className="text-sm font-medium text-gray-300">Total Records</p>
          <p className="mt-1 text-2xl font-bold text-gray-100">—</p>
        </div>
        <div className="rounded-lg bg-gray-700/50 p-4">
          <p className="text-sm font-medium text-gray-300">Data Quality</p>
          <p className="mt-1 text-2xl font-bold text-gray-100">—</p>
        </div>
      </div>
    </div>
  );
}
