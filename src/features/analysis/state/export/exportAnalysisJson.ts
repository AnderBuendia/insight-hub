import type { AnalysisFilters, Metric } from "@/domain/analysis";
import type { Insight } from "@/domain";

export type AnalysisExportPayload = {
  datasetId: string;
  filters: AnalysisFilters;
  metrics: Metric[];
  insights: Insight[];
};

export function serializeAnalysisToJson(
  payload: AnalysisExportPayload,
): string {
  return JSON.stringify(payload, null, 2);
}
