import type { AnalysisFilters } from "@/domain/analysis";

export function parseFiltersFromSearchParams(
  searchParams: URLSearchParams,
): AnalysisFilters {
  const category = searchParams.get("category");

  if (category === "even" || category === "odd") {
    return { category };
  }

  return {};
}

export function buildSearchParamsForAnalysis({
  datasetId,
  filters = {},
}: {
  datasetId: string;
  filters: AnalysisFilters;
}): URLSearchParams {
  const params = new URLSearchParams();

  params.set("datasetId", datasetId);

  if (filters.category) {
    params.set("category", filters.category);
  }

  return params;
}
