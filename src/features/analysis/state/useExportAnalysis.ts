import { useCallback } from "react";
import type { AnalysisState } from "./types";
import { serializeAnalysisExport, type AnalysisExportPayload } from "./exportAnalysis";
import { useTemporaryFlag } from "@/shared/hooks/useTemporaryFlag";

export function useExportAnalysis(analysisState: AnalysisState, resetMs = 2000) {
  const { active: exported, trigger: setExported } = useTemporaryFlag(resetMs);

  const exportJson = useCallback(() => {
    if (analysisState.status !== "success") return;

    const payload: AnalysisExportPayload = {
      datasetId: analysisState.datasetId,
      filters: analysisState.filters,
      metrics: analysisState.metrics,
      insights: analysisState.insights,
    };

    const json = serializeAnalysisExport(payload);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().slice(0, 10);

    const link = document.createElement("a");
    link.href = url;
    link.download = `analysis-${analysisState.datasetId}-${timestamp}.json`;
    link.click();

    URL.revokeObjectURL(url);
    setExported();
  }, [analysisState, setExported]);

  return { exportJson, exported };
}
