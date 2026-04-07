import type { Metric } from "@/domain/analysis";

export type Insight = {
  id: string;
  message: string;
  severity: "info" | "warning" | "positive";
};

export function deriveInsights(metrics: Metric[]): Insight[] {
  const insights: Insight[] = [];

  const total = metrics.find((m) => m.type === "total")?.value ?? 0;
  const average = metrics.find((m) => m.type === "average")?.value ?? 0;
  const count = metrics.find((m) => m.type === "count")?.value ?? 0;

  if (total >= 100) {
    insights.push({
      id: "high-total",
      message: "High total value detected for the current analysis.",
      severity: "positive",
    });
  }

  if (average < 20 && count > 0) {
    insights.push({
      id: "low-average",
      message: "Average value is relatively low for the current selection.",
      severity: "warning",
    });
  }

  if (count === 0) {
    insights.push({
      id: "empty-selection",
      message: "No records match the current filter state.",
      severity: "info",
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "neutral",
      message: "No significant insights detected.",
      severity: "info",
    });
  }

  return insights;
}
