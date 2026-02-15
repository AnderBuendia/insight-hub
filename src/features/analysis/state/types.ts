import type { InfraAnalysis, InfraFilter, InfraMetric } from "@/infra/analysis/types";

export type AnalysisState =
  | { status: "idle" }
  | { status: "loading"; datasetId: string }
  | { status: "empty"; datasetId: string }
  | { status: "error"; datasetId: string; message: string; code?: string }
  | {
      status: "success";
      datasetId: string;
      metrics: InfraMetric[];
      filters: InfraFilter[];
    };

// Optional: exported shape for UI props if you want to keep UI independent from Infra later
export type AnalysisViewModel = {
  datasetId: string;
  metrics: InfraMetric[];
  filters: InfraFilter[];
};
