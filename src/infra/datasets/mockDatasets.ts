import type { InfraDataset } from "./types";

export const mockDatasets: InfraDataset[] = [
  {
    id: "ds_sales",
    name: "Sales Overview",
    description: "Revenue and orders over time",
  },
  {
    id: "ds_usage",
    name: "Product Usage",
    description: "Active users and key engagement metrics",
  },
  {
    id: "ds_support",
    name: "Support Tickets",
    description: "Ticket volume and resolution time",
  },
];
