import { describe, expect, it, vi, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { DatasetsInfra } from "@/infra";

import { useDatasets } from "./useDatasets";

vi.mock("@/infra", () => ({
  DatasetsInfra: {
    listDatasets: vi.fn(),
  },
}));

describe("useDatasets", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Auto-load on mount", () => {
    it("triggers load immediately, entering loading state", () => {
      // Arrange: keep promise pending so we can observe the loading state
      vi.mocked(DatasetsInfra.listDatasets).mockImplementation(() => new Promise(() => {}));

      // Act
      const { result } = renderHook(() => useDatasets());

      // Assert
      expect(result.current.state).toEqual({ status: "loading" });
    });

    it("exposes reload and selectDataset actions", () => {
      vi.mocked(DatasetsInfra.listDatasets).mockImplementation(() => new Promise(() => {}));
      const { result } = renderHook(() => useDatasets());

      expect(typeof result.current.actions.reload).toBe("function");
      expect(typeof result.current.actions.selectDataset).toBe("function");
    });
  });

  describe("load", () => {
    it("transitions to success and maps infra data to domain model", async () => {
      // Arrange: one dataset with description, one without
      vi.mocked(DatasetsInfra.listDatasets).mockResolvedValue({
        ok: true,
        data: [
          { id: "ds_1", name: "Sales Data", description: "Q1 figures" },
          { id: "ds_2", name: "Marketing Data" },
        ],
      });

      // Act
      const { result } = renderHook(() => useDatasets());

      // Assert
      await waitFor(() => {
        expect(result.current.state).toEqual({
          status: "success",
          datasets: [
            { id: "ds_1", name: "Sales Data", description: "Q1 figures" },
            { id: "ds_2", name: "Marketing Data", description: undefined },
          ],
        });
      });
    });

    it("transitions to empty when no datasets are returned", async () => {
      vi.mocked(DatasetsInfra.listDatasets).mockResolvedValue({ ok: true, data: [] });
      const { result } = renderHook(() => useDatasets());

      await waitFor(() => {
        expect(result.current.state).toEqual({ status: "empty" });
      });
    });

    it("transitions to error on infra failure", async () => {
      vi.mocked(DatasetsInfra.listDatasets).mockResolvedValue({
        ok: false,
        error: { code: "UNEXPECTED", message: "Network error" },
      });
      const { result } = renderHook(() => useDatasets());

      await waitFor(() => {
        expect(result.current.state).toEqual({ status: "error", message: "Network error" });
      });
    });
  });

  describe("reload action", () => {
    it("re-fetches datasets and updates state", async () => {
      const listSpy = vi
        .mocked(DatasetsInfra.listDatasets)
        .mockResolvedValueOnce({ ok: true, data: [{ id: "ds_1", name: "First" }] })
        .mockResolvedValueOnce({ ok: true, data: [{ id: "ds_2", name: "Second" }] });

      const { result } = renderHook(() => useDatasets());
      await waitFor(() => expect(result.current.state.status).toBe("success"));

      // Act
      await act(async () => {
        await result.current.actions.reload();
      });

      // Assert
      expect(listSpy).toHaveBeenCalledTimes(2);
      expect(result.current.state).toMatchObject({
        status: "success",
        datasets: [{ id: "ds_2", name: "Second" }],
      });
    });
  });

  describe("selectDataset action", () => {
    it("sets selectedId when state is success", async () => {
      vi.mocked(DatasetsInfra.listDatasets).mockResolvedValue({
        ok: true,
        data: [{ id: "ds_1", name: "Dataset One" }],
      });
      const { result } = renderHook(() => useDatasets());
      await waitFor(() => expect(result.current.state.status).toBe("success"));

      // Act
      act(() => {
        result.current.actions.selectDataset("ds_1");
      });

      // Assert
      expect(result.current.state).toMatchObject({ status: "success", selectedId: "ds_1" });
    });

    it("does nothing when state is not success", () => {
      // Arrange: keep state at "loading"
      vi.mocked(DatasetsInfra.listDatasets).mockImplementation(() => new Promise(() => {}));
      const { result } = renderHook(() => useDatasets());
      const stateBefore = result.current.state;

      // Act
      act(() => {
        result.current.actions.selectDataset("ds_1");
      });

      // Assert: same object reference — state was not replaced
      expect(result.current.state).toBe(stateBefore);
    });
  });

  describe("Error handling", () => {
    it("catches unexpected exceptions during load without crashing", async () => {
      // Arrange
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      vi.mocked(DatasetsInfra.listDatasets).mockRejectedValue(new Error("Unexpected failure"));

      // Act
      const { result } = renderHook(() => useDatasets());
      await waitFor(() => expect(consoleSpy).toHaveBeenCalled());

      // Assert: error is logged and state remains at loading (catch does not set state)
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to load datasets:",
        expect.any(Error),
      );
      expect(result.current.state.status).toBe("loading");

      consoleSpy.mockRestore();
    });
  });
});
