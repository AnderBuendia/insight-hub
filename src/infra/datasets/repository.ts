import type { DatasetsScenario, InfraDataset } from "./types";
import { mockDatasets } from "./mockDatasets";

export type ListDatasetsResult =
  | { ok: true; data: InfraDataset[] }
  | { ok: false; error: { code: "UNEXPECTED"; message: string } };

let scenario: DatasetsScenario = "success";

export function setDatasetsScenario(next: DatasetsScenario) {
  scenario = next;
}

export async function listDatasets(): Promise<ListDatasetsResult> {
  await new Promise((r) => setTimeout(r, 250));

  if (scenario === "error") {
    return { ok: false, error: { code: "UNEXPECTED", message: "Simulated failure" } };
  }

  if (scenario === "empty") {
    return { ok: true, data: [] };
  }

  return { ok: true, data: mockDatasets };
}
