import type { AnalysisScenario, InfraAnalysis } from "./types";
import { mockAnalysisByDatasetId } from "./mockAnalysis";

export type GetAnalysisResult =
  | { ok: true; data: InfraAnalysis }
  | { ok: false; error: { code: "NOT_FOUND" | "UNEXPECTED"; message: string } };

let scenario: AnalysisScenario = "success";

export function setAnalysisScenario(next: AnalysisScenario) {
  scenario = next;
}

export async function getAnalysis(
  datasetId: string,
): Promise<GetAnalysisResult> {
  await new Promise((r) => setTimeout(r, 250));

  if (scenario === "error") {
    return {
      ok: false,
      error: { code: "UNEXPECTED", message: "Simulated analysis failure" },
    };
  }

  if (scenario === "empty") {
    // Explicit empty state: dataset exists but has no metrics/filters
    return {
      ok: true,
      data: {
        datasetId,
        metrics: [],
        filters: [],
      },
    };
  }

  const data = mockAnalysisByDatasetId[datasetId];
  if (!data) {
    return {
      ok: false,
      error: {
        code: "NOT_FOUND",
        message: `No mock analysis for datasetId="${datasetId}"`,
      },
    };
  }

  return { ok: true, data };
}
