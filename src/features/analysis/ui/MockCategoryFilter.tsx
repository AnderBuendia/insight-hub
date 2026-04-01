// TODO: Replace with real filter controls when real data is connected.
import type { AnalysisFilters } from "@/domain";

type Category = "all" | "even" | "odd";

const OPTIONS: { value: Category; label: string }[] = [
  { value: "all", label: "All" },
  { value: "even", label: "Even" },
  { value: "odd", label: "Odd" },
];

export function MockCategoryFilter({
  filters,
  onSetFilters,
}: {
  filters: AnalysisFilters;
  onSetFilters: (filters: AnalysisFilters) => void;
}) {
  const current = (filters.category as Category) ?? "all";

  function handleSelect(value: Category) {
    onSetFilters(value === "all" ? {} : { category: value });
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400">
        Category{" "}
        <span className="text-yellow-500/70">(mock)</span>
      </p>
      <div className="flex gap-2">
        {OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => handleSelect(value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              current === value
                ? "bg-indigo-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
