import type { AnalysisFilters, Metric } from "@/domain/analysis";

export type Insight = {
  id: string;
  message: string;
  severity: "info" | "warning" | "positive";
};

function getFilterContext(filters: AnalysisFilters): string {
  if (filters.category) {
    return `for the "${filters.category}" category`;
  }

  return "for the current dataset";
}

export function deriveInsights(
  metrics: Metric[],
  filters: AnalysisFilters,
): Insight[] {
  const insights: Insight[] = [];

  const total = metrics.find((m) => m.type === "total")?.value ?? 0;
  const average = metrics.find((m) => m.type === "average")?.value ?? 0;
  const count = metrics.find((m) => m.type === "count")?.value ?? 0;

  const context = getFilterContext(filters);

 if (total >= 100) {
   insights.push({
     id: "high-total",
     message: `This analysis shows a high total value ${context}.`,
     severity: "positive",
   });
 }

 if (average < 20 && count > 0) {
   insights.push({
     id: "low-average",
     message: `The average value is relatively low ${context}.`,
     severity: "warning",
   });
 }

 if (count === 0) {
   insights.push({
     id: "empty-selection",
     message: `No records match the current filter state ${context}.`,
     severity: "info",
   });
 }

 if (insights.length === 0) {
   insights.push({
     id: "neutral",
     message: `No unusual patterns were detected ${context}.`,
     severity: "info",
   });
 }

  return insights;
}
