import type { AnalysisFilters } from "@/domain";

export function FiltersList({ filters }: { filters: AnalysisFilters }) {
  const hasDateRange = Boolean(filters.dateRange);
  const hasCategory = Boolean(filters.category);
  const hasFilters = hasDateRange || hasCategory;

  if (!hasFilters) {
    return (
      <div className="rounded-lg border border-dashed border-gray-700 p-3">
        <p className="text-sm text-gray-300">No filters applied</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {filters.category ? (
        <li className="rounded-lg border border-gray-700 p-3">
          <p className="text-sm font-medium">Category</p>
          <p className="mt-1 text-xs text-gray-300">
            <span className="font-mono">{filters.category}</span>
          </p>
        </li>
      ) : null}

      {filters.dateRange ? (
        <li className="rounded-lg border border-gray-700 p-3">
          <p className="text-sm font-medium">Date range</p>
          <p className="mt-1 text-xs text-gray-300">
            <span className="font-mono">{filters.dateRange.from}</span>
            {" → "}
            <span className="font-mono">{filters.dateRange.to}</span>
          </p>
        </li>
      ) : null}
    </ul>
  );
}
