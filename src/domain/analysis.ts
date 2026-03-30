export type DateRange = {
  from: string; // ISO
  to: string;   // ISO
};

export type AnalysisFilters = {
  dateRange?: DateRange;
  category?: string;
};

export type Metric =
  | { type: "total"; value: number }
  | { type: "count"; value: number }
  | { type: "average"; value: number };

export type AnalysisState = {
  datasetId: string;
  filters: AnalysisFilters;
};

export function applyFilters(
  dataset: number[],
  filters: AnalysisFilters,
): number[] {
  // mock simple
  if (!filters.category) return dataset;

  // simulación: filtrar pares/impares según categoría
  if (filters.category === "even") {
    return dataset.filter((n) => n % 2 === 0);
  }

  if (filters.category === "odd") {
    return dataset.filter((n) => n % 2 !== 0);
  }

  return dataset;
}

export function computeMetrics(data: number[]): Metric[] {
  if (data.length === 0) return [];

  const total = data.reduce((acc, n) => acc + n, 0);

  return [
    { type: "total", value: total },
    { type: "count", value: data.length },
    { type: "average", value: total / data.length },
  ];
}
