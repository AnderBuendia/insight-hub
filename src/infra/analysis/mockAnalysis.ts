import type { InfraAnalysis } from "./types";

export const mockAnalysisByDatasetId: Record<string, InfraAnalysis> = {
  ds_sales: {
    datasetId: "ds_sales",
    metrics: [
      {
        id: "m_1",
        datasetId: "ds_sales",
        name: "Total Revenue",
        kind: "currency",
        description: "Sum of revenue from all sales",
      },
      {
        id: "m_2",
        datasetId: "ds_sales",
        name: "Total Orders",
        kind: "number",
        description: "Number of completed orders",
      },
      {
        id: "m_3",
        datasetId: "ds_sales",
        name: "Average Order Value",
        kind: "currency",
        description: "Average revenue per order",
      },
    ],
    filters: [
      {
        id: "f_1",
        datasetId: "ds_sales",
        field: "region",
        operator: "eq",
        value: "EU",
      },
      {
        id: "f_2",
        datasetId: "ds_sales",
        field: "status",
        operator: "eq",
        value: "completed",
      },
    ],
  },
  ds_usage: {
    datasetId: "ds_usage",
    metrics: [
      {
        id: "m_4",
        datasetId: "ds_usage",
        name: "Active Users",
        kind: "number",
        description: "Unique active users in the period",
      },
      {
        id: "m_5",
        datasetId: "ds_usage",
        name: "Session Duration",
        kind: "number",
        description: "Average session duration in minutes",
      },
      {
        id: "m_6",
        datasetId: "ds_usage",
        name: "Engagement Rate",
        kind: "percentage",
        description: "Percentage of engaged sessions",
      },
    ],
    filters: [
      {
        id: "f_3",
        datasetId: "ds_usage",
        field: "platform",
        operator: "eq",
        value: "web",
      },
      {
        id: "f_4",
        datasetId: "ds_usage",
        field: "user_type",
        operator: "eq",
        value: "premium",
      },
    ],
  },
  ds_support: {
    datasetId: "ds_support",
    metrics: [
      {
        id: "m_7",
        datasetId: "ds_support",
        name: "Total Tickets",
        kind: "number",
        description: "Number of support tickets opened",
      },
      {
        id: "m_8",
        datasetId: "ds_support",
        name: "Resolution Time",
        kind: "number",
        description: "Average time to resolve ticket in hours",
      },
      {
        id: "m_9",
        datasetId: "ds_support",
        name: "Customer Satisfaction",
        kind: "percentage",
        description: "Percentage of satisfied customers",
      },
    ],
    filters: [
      {
        id: "f_5",
        datasetId: "ds_support",
        field: "priority",
        operator: "eq",
        value: "high",
      },
      {
        id: "f_6",
        datasetId: "ds_support",
        field: "category",
        operator: "contains",
        value: "technical",
      },
    ],
  },
};
