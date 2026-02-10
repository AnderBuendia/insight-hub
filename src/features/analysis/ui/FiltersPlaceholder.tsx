export function FiltersPlaceholder() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Placeholder — filters will be configured here.</p>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date Range</label>
          <p className="mt-1 text-sm text-gray-400">No filter applied</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <p className="mt-1 text-sm text-gray-400">All categories</p>
        </div>
      </div>
    </div>
  );
}
