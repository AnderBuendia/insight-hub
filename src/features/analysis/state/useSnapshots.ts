import { useCallback, useEffect, useState } from "react";
import { AnalysisSnapshotsInfra } from "@/infra";
import type { AnalysisSnapshotId } from "@/domain";
import type { SnapshotsState } from "./snapshots.types";

export function useSnapshots(datasetId: string) {
  const [state, setState] = useState<SnapshotsState>({
    status: "loading",
    snapshots: [],
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const snapshots = await AnalysisSnapshotsInfra.listSnapshots(datasetId);
        const persistedSelectedId =
          AnalysisSnapshotsInfra.readSelectedSnapshotId(datasetId);

        if (cancelled) return;

        if (snapshots.length === 0) {
          AnalysisSnapshotsInfra.clearSelectedSnapshotId(datasetId);
          setState({ status: "empty", snapshots: [] });
          return;
        }

        const selectedStillExists = persistedSelectedId
          ? snapshots.some((snapshot) => snapshot.id === persistedSelectedId)
          : false;

        if (persistedSelectedId && !selectedStillExists) {
          AnalysisSnapshotsInfra.clearSelectedSnapshotId(datasetId);
        }

        setState({
          status: "success",
          snapshots,
          selectedId: selectedStillExists ? persistedSelectedId : undefined,
        });
      } catch {
        if (cancelled) return;
        setState((prev) => ({
          status: "error",
          snapshots: prev.snapshots,
          selectedId: prev.selectedId,
          message: "Failed to load snapshots",
        }));
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [datasetId]);

  const save = useCallback(async () => {
    if (!datasetId) return;

    try {
      setState((prev) => ({ ...prev, status: "saving" }));

      const snapshot = await AnalysisSnapshotsInfra.saveSnapshot(datasetId);
      AnalysisSnapshotsInfra.persistSelectedSnapshotId(datasetId, snapshot.id);

      setState((prev) => ({
        status: "success",
        snapshots: [snapshot, ...prev.snapshots],
        selectedId: snapshot.id,
      }));
    } catch {
      setState((prev) => ({
        status: "error",
        snapshots: prev.snapshots,
        selectedId: prev.selectedId,
        message: "Failed to save snapshot",
      }));
    }
  }, [datasetId]);

  const deleteAll = useCallback(async () => {
    if (!datasetId) return;

    try {
      await AnalysisSnapshotsInfra.clearSnapshots(datasetId);
      AnalysisSnapshotsInfra.clearSelectedSnapshotId(datasetId);

      setState({
        status: "empty",
        snapshots: [],
        selectedId: undefined,
      });
    } catch {
      setState((prev) => ({
        status: "error",
        snapshots: prev.snapshots,
        selectedId: prev.selectedId,
        message: "Failed to delete snapshots",
      }));
    }
  }, [datasetId]);

  const select = useCallback(
    (snapshotId: AnalysisSnapshotId) => {
      if (!datasetId) return;

      AnalysisSnapshotsInfra.persistSelectedSnapshotId(datasetId, snapshotId);

      setState((prev) => ({
        ...prev,
        selectedId: snapshotId,
      }));
    },
    [datasetId],
  );

  const clearSelection = useCallback(() => {
    if (datasetId) {
      AnalysisSnapshotsInfra.clearSelectedSnapshotId(datasetId);
    }

    setState((prev) => ({
      ...prev,
      selectedId: undefined,
    }));
  }, [datasetId]);

  return {
    state,
    actions: {
      save,
      deleteAll,
      select,
      clearSelection,
    },
  };
}
