import { useCallback, useEffect, useRef, useState } from "react";
import { AnalysisSnapshotsInfra } from "@/infra";
import type { AnalysisSnapshotId } from "@/domain";
import type { SnapshotsState } from "./snapshots.types";

export function useSnapshots(datasetId: string) {
  const [state, setState] = useState<SnapshotsState>({
    status: "loading",
    snapshots: [],
  });

  const isLoadingRef = useRef(false);

  const load = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    try {
      const snapshots = await AnalysisSnapshotsInfra.listSnapshots();

      if (snapshots.length === 0) {
        setState({
          status: "empty",
          snapshots: [],
        });
        return;
      }

      setState((prev) => ({
        status: "success",
        snapshots,
        selectedId: prev.selectedId,
      }));
    } catch {
      setState((prev) => ({
        status: "error",
        snapshots: prev.snapshots,
        selectedId: prev.selectedId,
        message: "Failed to load snapshots",
      }));
    } finally {
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = useCallback(async () => {
    // datasetId is passed to the repository but not yet used as a filter in listSnapshots;
    // it is reserved for when the backend supports per-dataset snapshot scoping.
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

  const clear = useCallback(async () => {
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
        message: "Failed to clear snapshots",
      }));
    }
  }, []);

  const select = useCallback((snapshotId: AnalysisSnapshotId) => {
    setState((prev) => ({
      ...prev,
      selectedId: snapshotId,
    }));
  }, []);

  return {
    state,
    actions: {
      save,
      clear,
      select,
    },
  };
}
