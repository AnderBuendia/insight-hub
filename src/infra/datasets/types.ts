export type InfraDataset = {
  id: string;
  name: string;
  description?: string;
};

export type DatasetsScenario = "success" | "empty" | "error";