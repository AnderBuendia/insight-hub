import type { AnalysisFilters, Metric, Insight } from "@/domain";

export type AnalysisState = {
  status: "idle" | "loading" | "success" | "error";
  datasetId: string;
  filters: AnalysisFilters;
  metrics: Metric[];
  insights: Insight[];
};

// Optional: exported shape for UI props if you want to keep UI independent from Infra later
export type AnalysisViewModel = {
  datasetId: string;
  filters: AnalysisFilters;
  metrics: Metric[];
};
