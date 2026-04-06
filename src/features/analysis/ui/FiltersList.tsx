import type { AnalysisFilters } from "@/domain";

export function FiltersList({ filters = {} }: { filters?: AnalysisFilters }) {
  const hasDateRange = Boolean(filters.dateRange);
  const hasCategory = Boolean(filters.category);
  const hasFilters = hasDateRange || hasCategory;

  if (!hasFilters) {
    return (
      <p className="text-xs italic text-gray-500">No active filters.</p>
    );
  }

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        Active filters
      </p>
      <ul className="flex flex-wrap gap-2">
        {filters.category ? (
          <li className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-2.5 py-1 text-xs font-medium ring-1 ring-indigo-500/30">
            <span className="text-indigo-400/70">category</span>
            <span className="text-indigo-100">{filters.category}</span>
          </li>
        ) : null}

        {filters.dateRange ? (
          <li className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-2.5 py-1 text-xs font-medium ring-1 ring-indigo-500/30">
            <span className="text-indigo-400/70">date</span>
            <span className="font-mono text-indigo-100">{filters.dateRange.from}</span>
            <span className="text-indigo-400/60">&rarr;</span>
            <span className="font-mono text-indigo-100">{filters.dateRange.to}</span>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
