// TODO: Replace with real filter controls when real data is connected.
import type { AnalysisFilters } from "@/domain";

type Category = "all" | "even" | "odd";

const OPTIONS: { value: Category; label: string }[] = [
  { value: "all", label: "All" },
  { value: "even", label: "Even" },
  { value: "odd", label: "Odd" },
];

export function MockCategoryFilter({
  filters = {},
  onSetFilters,
}: {
  filters?: AnalysisFilters;
  onSetFilters: (filters: AnalysisFilters) => void;
}) {
  const current = (filters.category as Category) ?? "all";
  const hasAnyFilter = Object.keys(filters).length > 0;

  function handleSelect(value: Category) {
    const { category: _removed, ...rest } = filters;
    onSetFilters(value === "all" ? rest : { ...rest, category: value });
  }

  function handleClearAll() {
    onSetFilters({});
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Category
        </p>
        {hasAnyFilter ? (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs text-gray-400 underline underline-offset-2 transition-colors hover:text-gray-200"
          >
            Clear all
          </button>
        ) : null}
      </div>
      <div className="flex gap-2">
        {OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={current === value}
            onClick={() => handleSelect(value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium ring-1 transition-colors ${
              current === value
                ? "bg-indigo-600 text-white ring-indigo-500"
                : "bg-gray-700 text-gray-300 ring-transparent hover:bg-gray-600"
            }`}
          >
            {current === value ? <span className="mr-1">&#10003;</span> : null}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
