"use client";

import { useCallback } from "react";
import type { AnalysisState } from "../types";
import { serializeMetricsToCsv } from "./exportMetricsCsv";
import { useTemporaryFlag } from "@/shared/hooks/useTemporaryFlag";
import { downloadFile } from "@/shared/utils/downloadFile";

export function useExportMetricsCsv(analysisState: AnalysisState, resetMs = 2000) {
  const { active: exported, trigger: setExported } = useTemporaryFlag(resetMs);

  const exportCsv = useCallback(() => {
    if (analysisState.status !== "success") return;

    const timestamp = new Date().toISOString().slice(0, 10);
    downloadFile(
      serializeMetricsToCsv(analysisState.metrics),
      `metrics-${analysisState.datasetId}-${timestamp}.csv`,
      "text/csv;charset=utf-8;",
    );
    setExported();
  }, [analysisState, setExported]);

  return { exportCsv, exported };
}
