import { useCallback, useEffect, useState } from "react";
import { AnalysisInfra } from "@/infra";
import type { AnalysisState } from "./types";

export function useAnalysis(datasetId: string | null) {
  const [state, setState] = useState<AnalysisState>({ status: "idle" });

  const load = useCallback(async () => {
    if (!datasetId) {
      setState({ status: "idle" });
      return;
    }

    setState({ status: "loading", datasetId });

    const result = await AnalysisInfra.getAnalysis(datasetId);

    if (!result.ok) {
      setState({
        status: "error",
        datasetId,
        message: result.error.message,
        code: result.error.code,
      });
      return;
    }

    const { metrics, filters } = result.data;

    if (metrics.length === 0 && filters.length === 0) {
      setState({ status: "empty", datasetId });
      return;
    }

    setState({
      status: "success",
      datasetId,
      metrics,
      filters,
    });
  }, [datasetId]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        await load();
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load analysis:", err);
          // We keep state as-is; infra errors should be returned via result.ok === false.
          // This catch is just a safety net.
        }
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [load]);

  return { state, actions: { reload: load } };
}
