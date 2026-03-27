import type { AnalysisSnapshot } from "@/domain";

let snapshots: AnalysisSnapshot[] = [];

export async function listSnapshots(datasetId: string): Promise<AnalysisSnapshot[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return snapshots.filter((s) => s.datasetId === datasetId);
}

export async function saveSnapshot(datasetId: string): Promise<AnalysisSnapshot> {
  await new Promise((resolve) => setTimeout(resolve, 150));

  const snapshot: AnalysisSnapshot = {
    id: crypto.randomUUID(),
    datasetId,
    createdAt: new Date().toISOString(),
  };

  snapshots = [snapshot, ...snapshots];
  return snapshot;
}

export async function clearSnapshots(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  snapshots = [];
}
