import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSnapshots } from "@/features/analysis/state/useSnapshots";

const mockSnapshot = {
  id: "snap_1",
  datasetId: "ds_1",
  createdAt: "2026-03-27T10:00:00.000Z",
};

vi.mock("@/infra", () => ({
  AnalysisSnapshotsInfra: {
    listSnapshots: vi.fn(),
    saveSnapshot: vi.fn(),
    clearSnapshots: vi.fn(),
  },
}));

import { AnalysisSnapshotsInfra } from "@/infra";

const mockListSnapshots = vi.mocked(AnalysisSnapshotsInfra.listSnapshots);
const mockClearSnapshots = vi.mocked(AnalysisSnapshotsInfra.clearSnapshots);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useSnapshots", () => {
  describe("initial load", () => {
    it("calls listSnapshots with the given datasetId", async () => {
      mockListSnapshots.mockResolvedValue([mockSnapshot]);

      renderHook(() => useSnapshots("ds_1"));

      await act(async () => {});

      expect(mockListSnapshots).toHaveBeenCalledWith("ds_1");
    });

    it("only shows snapshots for the given dataset", async () => {
      const snapshotDs2 = { id: "snap_2", datasetId: "ds_2", createdAt: "2026-03-27T11:00:00.000Z" };
      mockListSnapshots.mockResolvedValue([mockSnapshot]); // repository already filters

      const { result } = renderHook(() => useSnapshots("ds_1"));

      await act(async () => {});

      expect(result.current.state.snapshots).toEqual([mockSnapshot]);
      expect(result.current.state.snapshots).not.toContainEqual(snapshotDs2);
    });
  });

  describe("select", () => {
    it("sets selectedId to the given snapshot id", async () => {
      mockListSnapshots.mockResolvedValue([mockSnapshot]);

      const { result } = renderHook(() => useSnapshots("ds_1"));

      // Wait for initial load
      await act(async () => {});

      act(() => {
        result.current.actions.select("snap_1");
      });

      expect(result.current.state.selectedId).toBe("snap_1");
    });
  });

  describe("clearSelection", () => {
    it("sets selectedId to undefined", async () => {
      mockListSnapshots.mockResolvedValue([mockSnapshot]);

      const { result } = renderHook(() => useSnapshots("ds_1"));

      await act(async () => {});

      // First select a snapshot
      act(() => {
        result.current.actions.select("snap_1");
      });

      expect(result.current.state.selectedId).toBe("snap_1");

      // Then clear the selection
      act(() => {
        result.current.actions.clearSelection();
      });

      expect(result.current.state.selectedId).toBeUndefined();
    });

    it("does not affect the snapshots list", async () => {
      mockListSnapshots.mockResolvedValue([mockSnapshot]);

      const { result } = renderHook(() => useSnapshots("ds_1"));

      await act(async () => {});

      act(() => {
        result.current.actions.select("snap_1");
      });

      act(() => {
        result.current.actions.clearSelection();
      });

      expect(result.current.state.snapshots).toEqual([mockSnapshot]);
    });
  });

  describe("deleteAll", () => {
    it("clears all snapshots and sets status to empty", async () => {
      mockListSnapshots.mockResolvedValue([mockSnapshot]);
      mockClearSnapshots.mockResolvedValue(undefined);

      const { result } = renderHook(() => useSnapshots("ds_1"));

      await act(async () => {});

      await act(async () => {
        await result.current.actions.deleteAll();
      });

      expect(result.current.state.snapshots).toEqual([]);
      expect(result.current.state.status).toBe("empty");
    });

    it("sets error status when deleteAll fails", async () => {
      mockListSnapshots.mockResolvedValue([mockSnapshot]);
      mockClearSnapshots.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useSnapshots("ds_1"));

      await act(async () => {});

      await act(async () => {
        await result.current.actions.deleteAll();
      });

      expect(result.current.state.status).toBe("error");
      expect((result.current.state as { message?: string }).message).toBe(
        "Failed to delete snapshots",
      );
    });
  });

  describe("dataset change", () => {
    it("reloads snapshots for the new dataset", async () => {
      const snapshotDs2 = { id: "snap_2", datasetId: "ds_2", createdAt: "2026-03-27T11:00:00.000Z" };
      mockListSnapshots
        .mockResolvedValueOnce([mockSnapshot])
        .mockResolvedValueOnce([snapshotDs2]);

      const { result, rerender } = renderHook(
        ({ datasetId }) => useSnapshots(datasetId),
        { initialProps: { datasetId: "ds_1" } },
      );

      await act(async () => {});
      expect(result.current.state.snapshots).toEqual([mockSnapshot]);

      rerender({ datasetId: "ds_2" });
      await act(async () => {});

      expect(mockListSnapshots).toHaveBeenCalledWith("ds_2");
      expect(result.current.state.snapshots).toEqual([snapshotDs2]);
    });

    it("clears selectedId when datasetId changes", async () => {
      mockListSnapshots.mockResolvedValue([mockSnapshot]);

      const { result, rerender } = renderHook(
        ({ datasetId }) => useSnapshots(datasetId),
        { initialProps: { datasetId: "ds_1" } },
      );

      await act(async () => {});

      act(() => {
        result.current.actions.select("snap_1");
      });

      expect(result.current.state.selectedId).toBe("snap_1");

      rerender({ datasetId: "ds_2" });

      expect(result.current.state.selectedId).toBeUndefined();
    });
  });
});
