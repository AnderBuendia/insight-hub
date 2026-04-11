import { useCallback, useEffect, useRef, useState } from "react";
import {
  applyFilters,
  computeMetrics,
  deriveInsights,
  type AnalysisFilters,
} from "@/domain";
import type { AnalysisState } from "@/features/analysis/state/types";

// Temporary mock data source.
// Later we can move this to infra.
const MOCK_DATASETS: Record<string, number[]> = {
  ds_sales: [10, 20, 30, 40, 50],
  ds_support: [5, 15, 25, 35, 45],
};

export function useAnalysis(
  datasetId: string | null,
  initialFilters: AnalysisFilters = {},
) {
  const [state, setState] = useState<AnalysisState>(() => ({
    status: "idle",
    datasetId: datasetId ?? "",
    filters: initialFilters,
    metrics: [],
    insights: [],
  }));
  const stateRef = useRef(state);
  // Captured once at mount so load() can restore URL-driven filters when
  // the user navigates to a different dataset without touching the ref.
  const initialFiltersRef = useRef(initialFilters);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const recompute = useCallback(
    (targetDatasetId: string, filters: AnalysisFilters) => {
      const dataset = MOCK_DATASETS[targetDatasetId];

      if (!dataset) {
        setState({
          status: "error",
          datasetId: targetDatasetId,
          filters,
          metrics: [],
          insights: [],
        });
        return;
      }

      const filteredData = applyFilters(dataset, filters);
      const metrics = computeMetrics(filteredData);
      const insights = deriveInsights(metrics, filters);

      setState({
        status: "success",
        datasetId: targetDatasetId,
        filters,
        metrics,
        insights,
      });
    },
    [],
  );

  const load = useCallback(() => {
    if (!datasetId) {
      setState({
        status: "idle",
        datasetId: "",
        filters: {},
        metrics: [],
        insights: [],
      });
      return;
    }

    const previousState = stateRef.current;
    const nextFilters =
      previousState.datasetId === datasetId
        ? previousState.filters
        : initialFiltersRef.current;

    setState({
      status: "loading",
      datasetId,
      filters: nextFilters,
      metrics: [],
      insights: [],
    });

    recompute(datasetId, nextFilters);
  }, [datasetId, recompute]);

  useEffect(() => {
    queueMicrotask(load);
  }, [load]);

  const setFilters = useCallback(
    (filters: AnalysisFilters) => {
      if (!datasetId) return;
      recompute(datasetId, filters);
    },
    [datasetId, recompute],
  );

  const resetFilters = useCallback(() => {
    if (!datasetId) return;
    recompute(datasetId, {});
  }, [datasetId, recompute]);

  return {
    state,
    actions: {
      reload: load,
      setFilters,
      resetFilters,
    },
  };
}
