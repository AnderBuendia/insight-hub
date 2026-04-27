import type { Metric } from "@/domain";

function getMetricLabel(type: Metric["type"]) {
  switch (type) {
    case "total":
      return "Total";
    case "count":
      return "Count";
    case "average":
      return "Average";
    default:
      return type;
  }
}

export function MetricsList({ metrics }: { metrics: Metric[] }) {
  if (metrics.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-700 p-3">
        <p className="text-sm text-gray-300">No metrics available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {metrics.map((m) => (
        <div
          key={m.type}
          data-testid="metric-card"
          className="rounded-lg border border-gray-700 bg-gray-800 p-4"
        >
          <p className="font-mono text-2xl font-bold text-gray-100">
            {m.value.toFixed(2)}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">
            {getMetricLabel(m.type)}
          </p>
        </div>
      ))}
    </div>
  );
}
