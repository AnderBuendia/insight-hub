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
    <ul className="space-y-2">
      {metrics.map((m) => (
        <li
          key={m.type}
          className="rounded-lg border border-gray-700 p-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {getMetricLabel(m.type)}
            </p>

            <span className="text-sm font-mono text-gray-200">
              {m.value.toFixed(2)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
