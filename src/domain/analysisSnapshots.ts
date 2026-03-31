import type { AnalysisFilters } from "./analysis";

export type AnalysisSnapshotId = string;

export type AnalysisSnapshot = {
  id: AnalysisSnapshotId;
  datasetId: string;
  createdAt: string;
  filters: AnalysisFilters;
};
