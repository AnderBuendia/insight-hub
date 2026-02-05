export type DatasetId = string;

export type Dataset = {
  id: DatasetId;
  name: string;
  description?: string;
};