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
      setState({ status: "loading", snapshots: [] });

      try {
        const snapshots = await AnalysisSnapshotsInfra.listSnapshots(datasetId);

        if (cancelled) return;

        if (snapshots.length === 0) {
          setState({ status: "empty", snapshots: [] });
          return;
        }

        setState({ status: "success", snapshots });
      } catch {
        if (cancelled) return;
        setState((prev) => ({
          status: "error",
          snapshots: prev.snapshots,
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
    try {
      setState((prev) => ({ ...prev, status: "saving" }));

      const snapshot = await AnalysisSnapshotsInfra.saveSnapshot(datasetId);

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
    try {
      await AnalysisSnapshotsInfra.clearSnapshots();

      setState({
        status: "empty",
        snapshots: [],
      });
    } catch {
      setState((prev) => ({
        status: "error",
        snapshots: prev.snapshots,
        selectedId: prev.selectedId,
        message: "Failed to delete snapshots",
      }));
    }
  }, []);

  const select = useCallback((snapshotId: AnalysisSnapshotId) => {
    setState((prev) => ({
      ...prev,
      selectedId: snapshotId,
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedId: undefined,
    }));
  }, []);

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
