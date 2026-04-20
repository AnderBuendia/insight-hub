import type { Metric } from "@/domain/analysis";

export function serializeMetricsToCsv(metrics: Metric[]): string {
  const header = "type,value";

  const rows = metrics.map((metric) => {
    return `${metric.type},${metric.value}`;
  });

  return [header, ...rows].join("\n");
}
