import type { InfraDataset } from "./types";
import { mockDatasets } from "./mockDatasets";

export type ListDatasetsResult =
  | { ok: true; data: InfraDataset[] }
  | { ok: false; error: { code: "UNEXPECTED"; message: string } };

export async function listDatasets(): Promise<ListDatasetsResult> {
  // Simulate I/O latency
  await new Promise((r) => setTimeout(r, 250));

  // v1: always succeed (we will add failure toggle later)
  return { ok: true, data: mockDatasets };
}
