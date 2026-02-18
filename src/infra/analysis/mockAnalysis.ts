import type { InfraAnalysis } from "./types";

export const mockAnalysisByDatasetId: Record<string, InfraAnalysis> = {
  ds_1: {
    datasetId: "ds_1",
    metrics: [
      {
        id: "m_1",
        datasetId: "ds_1",
        name: "Total Revenue",
        kind: "currency",
        description: "Sum of revenue",
      },
      {
        id: "m_2",
        datasetId: "ds_1",
        name: "Active Users",
        kind: "number",
        description: "Unique active users",
      },
    ],
    filters: [
      {
        id: "f_1",
        datasetId: "ds_1",
        field: "country",
        operator: "eq",
        value: "ES",
      },
      {
        id: "f_2",
        datasetId: "ds_1",
        field: "channel",
        operator: "contains",
        value: "organic",
      },
    ],
  },

  ds_2: {
    datasetId: "ds_2",
    metrics: [
      {
        id: "m_3",
        datasetId: "ds_2",
        name: "Conversion Rate",
        kind: "percentage",
        description: "Conversions / visits",
      },
    ],
    filters: [
      {
        id: "f_3",
        datasetId: "ds_2",
        field: "device",
        operator: "eq",
        value: "mobile",
      },
    ],
  },
};
