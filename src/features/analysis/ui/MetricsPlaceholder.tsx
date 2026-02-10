export function MetricsPlaceholder() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Placeholder — metrics will be displayed here.</p>
      <div className="space-y-2">
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-700">Total Records</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">—</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-700">Data Quality</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">—</p>
        </div>
      </div>
    </div>
  );
}
