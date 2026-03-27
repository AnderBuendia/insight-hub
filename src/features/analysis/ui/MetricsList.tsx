import type { InfraMetric } from "@/infra/analysis/types";

export function MetricsList({ metrics }: { metrics: InfraMetric[] }) {
  return (
    <ul className="space-y-2">
      {metrics.map((m) => (
        <li key={m.id} className="rounded-lg border border-gray-700 p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{m.name}</p>
            <span className="text-xs text-gray-400">{m.kind}</span>
          </div>
          {m.description ? (
            <p className="mt-1 text-xs text-gray-300">{m.description}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
