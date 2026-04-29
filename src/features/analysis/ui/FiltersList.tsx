import type { ReactNode } from "react";
import type { AnalysisFilters } from "@/domain";

function FilterBadge({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <li className="inline-flex max-w-full flex-wrap items-center gap-x-1.5 gap-y-0.5 rounded-md border border-indigo-400/25 bg-indigo-400/10 px-2.5 py-1.5 text-xs font-medium text-indigo-100">
      <span className="shrink-0 text-indigo-300/80">{label}</span>
      <span className="min-w-0">{children}</span>
    </li>
  );
}

export function FiltersList({ filters = {} }: { filters?: AnalysisFilters }) {
  const hasDateRange = Boolean(filters.dateRange);
  const hasCategory = Boolean(filters.category);
  const hasFilters = hasDateRange || hasCategory;

  if (!hasFilters) {
    return (
      <div className="rounded-md border border-dashed border-gray-600 bg-gray-900/40 px-3 py-2">
        <p className="text-sm font-medium text-gray-300">No active filters.</p>
        <p className="mt-1 text-xs text-gray-500">
          The analysis is showing the full dataset.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="space-y-0.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-300">
          Active filters
        </p>
        <p className="text-xs text-gray-500">
          Metrics and insights below are calculated from this filtered subset.
        </p>
      </div>
      <ul className="flex flex-wrap gap-2">
        {filters.category ? (
          <FilterBadge label="category">
            <span>{filters.category}</span>
          </FilterBadge>
        ) : null}

        {filters.dateRange ? (
          <FilterBadge label="date">
            <span className="inline-flex max-w-full flex-wrap items-center gap-x-1.5 gap-y-0.5">
              <span className="font-mono">{filters.dateRange.from}</span>
              <span className="text-indigo-300/60" aria-hidden="true">
                &rarr;
              </span>
              <span className="font-mono">{filters.dateRange.to}</span>
            </span>
          </FilterBadge>
        ) : null}
      </ul>
    </div>
  );
}
