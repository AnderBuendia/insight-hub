import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ReadonlyURLSearchParams } from "next/navigation";
import type { AnalysisFilters } from "@/domain";
import {
  buildSearchParamsForAnalysis,
  parseFiltersFromSearchParams,
} from "@/features/analysis/state/urlState";

export type UseUrlFiltersResult = {
  datasetId: string | null;
  initialFilters: AnalysisFilters;
  searchParams: ReadonlyURLSearchParams;
  syncUrl: (filters: AnalysisFilters) => void;
};

export function useUrlFilters(): UseUrlFiltersResult {
  const router = useRouter();
  const searchParams = useSearchParams();
  const datasetId = searchParams.get("datasetId");

  const initialFilters = parseFiltersFromSearchParams(searchParams);

  const syncUrl = useCallback(
    (filters: AnalysisFilters) => {
      if (!datasetId) return;

      const nextParams = buildSearchParamsForAnalysis({ datasetId, filters });
      if (nextParams.toString() === searchParams.toString()) return;

      router.replace(`/analysis?${nextParams.toString()}`);
    },
    [datasetId, router, searchParams],
  );

  return { datasetId, initialFilters, searchParams, syncUrl };
}
