export type InfraMetric = {
  id: string;
  datasetId: string;
  name: string;
  description?: string;
  kind: "number" | "currency" | "percentage";
};

export type InfraFilter = {
  id: string;
  datasetId: string;
  field: string;
  operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "contains";
  value: string;
};

export type InfraAnalysis = {
  datasetId: string;
  metrics: InfraMetric[];
  filters: InfraFilter[];
};

export type AnalysisScenario = "success" | "empty" | "error";
