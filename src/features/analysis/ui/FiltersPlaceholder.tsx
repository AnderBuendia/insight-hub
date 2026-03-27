export function FiltersPlaceholder() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">Placeholder — filters will be configured here.</p>
      <div className="space-y-3">
        <div>
       <label className="block text-sm font-medium text-gray-300">Date Range</label>
       <p className="mt-1 text-sm text-gray-500">No filter applied</p>
        </div>
        <div>
        <label className="block text-sm font-medium text-gray-300">Category</label>
        <p className="mt-1 text-sm text-gray-500">All categories</p>
        </div>
      </div>
    </div>
  );
}
