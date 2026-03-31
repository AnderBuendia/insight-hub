import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AnalysisSnapshotsInfra } from "@/infra";
import type { AnalysisFilters } from "@/domain";
import { useSnapshots } from "@/features/analysis/state/useSnapshots";

const mockSnapshot = {
  id: "snap_1",
  datasetId: "ds_1",
  createdAt: "2026-03-27T10:00:00.000Z",
  filters: { category: "even" } satisfies AnalysisFilters,
};

vi.mock("@/infra", () => ({
  AnalysisSnapshotsInfra: {
    listSnapshots: vi.fn(),
    saveSnapshot: vi.fn(),
    clearSnapshots: vi.fn(),
    readSelectedSnapshotId: vi.fn(),
    persistSelectedSnapshotId: vi.fn(),
    clearSelectedSnapshotId: vi.fn(),
  },
}));

const mockListSnapshots = vi.mocked(AnalysisSnapshotsInfra.listSnapshots);
const mockSaveSnapshot = vi.mocked(AnalysisSnapshotsInfra.saveSnapshot);
const mockClearSnapshots = vi.mocked(AnalysisSnapshotsInfra.clearSnapshots);
const mockReadSelectedSnapshotId = vi.mocked(
  AnalysisSnapshotsInfra.readSelectedSnapshotId,
);
const mockPersistSelectedSnapshotId = vi.mocked(
  AnalysisSnapshotsInfra.persistSelectedSnapshotId,
);
const mockClearSelectedSnapshotId = vi.mocked(
  AnalysisSnapshotsInfra.clearSelectedSnapshotId,
);

beforeEach(() => {
  vi.clearAllMocks();
  mockReadSelectedSnapshotId.mockReturnValue(undefined);
});

describe("useSnapshots", () => {
  it("loads snapshots for the active dataset", async () => {
    mockListSnapshots.mockResolvedValue([mockSnapshot]);

    const { result } = renderHook(() => useSnapshots("ds_1"));

    await act(async () => {});

    expect(mockListSnapshots).toHaveBeenCalledWith("ds_1");
    expect(result.current.state.status).toBe("success");
    expect(result.current.state.snapshots).toEqual([mockSnapshot]);
  });

  it("restores the persisted selected snapshot when available", async () => {
    mockListSnapshots.mockResolvedValue([mockSnapshot]);
    mockReadSelectedSnapshotId.mockReturnValue("snap_1");

    const { result } = renderHook(() => useSnapshots("ds_1"));

    await act(async () => {});

    expect(result.current.state.selectedId).toBe("snap_1");
  });

  it("clears a stale persisted selection", async () => {
    mockListSnapshots.mockResolvedValue([mockSnapshot]);
    mockReadSelectedSnapshotId.mockReturnValue("snap_missing");

    const { result } = renderHook(() => useSnapshots("ds_1"));

    await act(async () => {});

    expect(mockClearSelectedSnapshotId).toHaveBeenCalledWith("ds_1");
    expect(result.current.state.selectedId).toBeUndefined();
  });

  it("persists and exposes the selected snapshot id", async () => {
    mockListSnapshots.mockResolvedValue([mockSnapshot]);

    const { result } = renderHook(() => useSnapshots("ds_1"));

    await act(async () => {});

    act(() => {
      result.current.actions.select("snap_1");
    });

    expect(mockPersistSelectedSnapshotId).toHaveBeenCalledWith("ds_1", "snap_1");
    expect(result.current.state.selectedId).toBe("snap_1");
  });

  it("clears the selected snapshot id", async () => {
    mockListSnapshots.mockResolvedValue([mockSnapshot]);

    const { result } = renderHook(() => useSnapshots("ds_1"));

    await act(async () => {});

    act(() => {
      result.current.actions.clearSelection();
    });

    expect(mockClearSelectedSnapshotId).toHaveBeenCalledWith("ds_1");
    expect(result.current.state.selectedId).toBeUndefined();
  });

  it("sets status to saving while persisting a snapshot and then prepends it", async () => {
    mockListSnapshots.mockResolvedValue([mockSnapshot]);

    const nextSnapshot = {
      id: "snap_2",
      datasetId: "ds_1",
      createdAt: "2026-03-28T10:00:00.000Z",
      filters: { category: "odd" } satisfies AnalysisFilters,
    };

    let resolveSave:
      | ((value: typeof nextSnapshot) => void)
      | undefined;

    mockSaveSnapshot.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSave = resolve;
        }),
    );

    const { result } = renderHook(() => useSnapshots("ds_1"));
    await act(async () => {});

    let savePromise: Promise<void> | undefined;
    act(() => {
      savePromise = result.current.actions.save(nextSnapshot.filters);
    });

    expect(result.current.state.status).toBe("saving");
    expect(mockSaveSnapshot).toHaveBeenCalledWith("ds_1", nextSnapshot.filters);

    await act(async () => {
      resolveSave?.(nextSnapshot);
      await savePromise;
    });

    expect(result.current.state.status).toBe("success");
    expect(result.current.state.selectedId).toBe("snap_2");
    expect(result.current.state.snapshots[0]).toEqual(nextSnapshot);
    expect(mockPersistSelectedSnapshotId).toHaveBeenCalledWith("ds_1", "snap_2");
  });

  it("sets an error state when saving fails", async () => {
    mockListSnapshots.mockResolvedValue([mockSnapshot]);
    mockSaveSnapshot.mockRejectedValue(new Error("save failed"));

    const { result } = renderHook(() => useSnapshots("ds_1"));
    await act(async () => {});

    await act(async () => {
      await result.current.actions.save({ category: "even" });
    });

    expect(result.current.state.status).toBe("error");
    expect("message" in result.current.state && result.current.state.message).toBe(
      "Failed to save snapshot",
    );
  });

  it("deletes all snapshots for the active dataset", async () => {
    mockListSnapshots.mockResolvedValue([mockSnapshot]);
    mockClearSnapshots.mockResolvedValue(undefined);

    const { result } = renderHook(() => useSnapshots("ds_1"));
    await act(async () => {});

    await act(async () => {
      await result.current.actions.deleteAll();
    });

    expect(mockClearSnapshots).toHaveBeenCalledWith("ds_1");
    expect(mockClearSelectedSnapshotId).toHaveBeenCalledWith("ds_1");
    expect(result.current.state.status).toBe("empty");
    expect(result.current.state.snapshots).toEqual([]);
  });

  it("reloads when the dataset changes", async () => {
    const ds2Snapshot = {
      id: "snap_2",
      datasetId: "ds_2",
      createdAt: "2026-03-27T11:00:00.000Z",
      filters: { category: "odd" } satisfies AnalysisFilters,
    };

    mockListSnapshots
      .mockResolvedValueOnce([mockSnapshot])
      .mockResolvedValueOnce([ds2Snapshot]);

    const { result, rerender } = renderHook(
      ({ datasetId }) => useSnapshots(datasetId),
      { initialProps: { datasetId: "ds_1" } },
    );

    await act(async () => {});
    rerender({ datasetId: "ds_2" });
    await act(async () => {});

    expect(mockListSnapshots).toHaveBeenCalledWith("ds_2");
    expect(result.current.state.snapshots).toEqual([ds2Snapshot]);
  });
});
