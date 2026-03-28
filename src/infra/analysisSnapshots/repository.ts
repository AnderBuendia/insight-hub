import type { AnalysisSnapshot } from "@/domain";

function getStorageKey(datasetId: string) {
  return `insighthub:snapshots:${datasetId}`;
}

function readSnapshots(datasetId: string): AnalysisSnapshot[] {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem(getStorageKey(datasetId));
  if (!raw) return [];

  try {
    return JSON.parse(raw) as AnalysisSnapshot[];
  } catch {
    return [];
  }
}

function writeSnapshots(datasetId: string, snapshots: AnalysisSnapshot[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    getStorageKey(datasetId),
    JSON.stringify(snapshots),
  );
}

export async function listSnapshots(datasetId: string): Promise<AnalysisSnapshot[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return readSnapshots(datasetId);
}

export async function saveSnapshot(datasetId: string): Promise<AnalysisSnapshot> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const snapshots = readSnapshots(datasetId);

  const snapshot: AnalysisSnapshot = {
    id: crypto.randomUUID(),
    datasetId,
    createdAt: new Date().toISOString(),
  };

  const next = [snapshot, ...snapshots];
  writeSnapshots(datasetId, next);

  return snapshot;
}

export async function clearSnapshots(datasetId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 50));

  if (typeof window === "undefined") return;
  localStorage.removeItem(getStorageKey(datasetId));
}
