"use client";

import { useCallback } from "react";
import type { AnalysisState } from "../types";
import { serializeAnalysisToJson, type AnalysisExportPayload } from "./exportAnalysisJson";
import { useTemporaryFlag } from "@/shared/hooks/useTemporaryFlag";
import { downloadFile } from "@/shared/utils/downloadFile";

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

    const timestamp = new Date().toISOString().slice(0, 10);
    downloadFile(
      serializeAnalysisToJson(payload),
      `analysis-${analysisState.datasetId}-${timestamp}.json`,
      "application/json",
    );
    setExported();
  }, [analysisState, setExported]);

  return { exportJson, exported };
}
