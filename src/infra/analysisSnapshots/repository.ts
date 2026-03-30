import type { AnalysisSnapshot, AnalysisFilters } from "@/domain";

function getStorageKey(datasetId: string) {
  return `insighthub:snapshots:${datasetId}`;
}

function getSelectedKey(datasetId: string) {
  return `insighthub:snapshots:selected:${datasetId}`;
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

export function readSelectedSnapshotId(datasetId: string): string | undefined {
  if (typeof window === "undefined") return undefined;

  return localStorage.getItem(getSelectedKey(datasetId)) ?? undefined;
}

export function persistSelectedSnapshotId(
  datasetId: string,
  snapshotId: string,
) {
  if (typeof window === "undefined") return;

  localStorage.setItem(getSelectedKey(datasetId), snapshotId);
}

export function clearSelectedSnapshotId(datasetId: string) {
  if (typeof window === "undefined") return;

  localStorage.removeItem(getSelectedKey(datasetId));
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

export async function saveSnapshot(datasetId: string, filters: AnalysisFilters): Promise<AnalysisSnapshot> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const snapshots = readSnapshots(datasetId);

  const snapshot: AnalysisSnapshot = {
    id: crypto.randomUUID(),
    datasetId,
    filters,
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
