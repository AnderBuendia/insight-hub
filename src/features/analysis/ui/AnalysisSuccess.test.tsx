import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { AnalysisSuccess } from "@/features/analysis/ui/AnalysisSuccess";
import type { SnapshotsState } from "@/features/analysis/state/snapshots.types";
import type { AnalysisSnapshot } from "@/domain";

// Mock AIPanel to isolate AnalysisSuccess behaviour
vi.mock("@/features/ai/page/AIPanel", () => ({
  AIPanel: () => <div data-testid="ai-panel" />,
}));

const mockUseAnalysis = vi.fn();
vi.mock("@/features/analysis/state/useAnalysis", () => ({
  useAnalysis: (datasetId: string) => mockUseAnalysis(datasetId),
}));

const defaultSnapshotsState: SnapshotsState = {
  status: "empty",
  snapshots: [],
  selectedId: undefined,
};

const defaultSnapshotsActions = {
  save: vi.fn(),
  select: vi.fn(),
  clear: vi.fn(),
};

function renderAnalysisSuccess(
  datasetId: string,
  snapshotsState: SnapshotsState = defaultSnapshotsState,
  selectedSnapshot?: AnalysisSnapshot,
) {
  return render(
    <AnalysisSuccess
      datasetId={datasetId}
      snapshotsState={snapshotsState}
      snapshotsActions={defaultSnapshotsActions}
      selectedSnapshot={selectedSnapshot}
    />,
  );
}

describe("AnalysisSuccess", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Loading state", () => {
    it.each(["loading", "idle"] as const)(
      'renders loading state when status is "%s"',
      (status) => {
        mockUseAnalysis.mockReturnValue({
          state: { status },
          actions: { reload: vi.fn() },
        });

        renderAnalysisSuccess("ds_1");

        expect(screen.getByText("Loading analysis…")).toBeInTheDocument();
      },
    );
  });

  describe("Error state", () => {
    it("renders error message", () => {
      mockUseAnalysis.mockReturnValue({
        state: { status: "error", message: "Network failure" },
        actions: { reload: vi.fn() },
      });

      renderAnalysisSuccess("ds_1");

      expect(screen.getByText("Network failure")).toBeInTheDocument();
    });
  });

  describe("Empty state", () => {
    it("renders empty state", () => {
      mockUseAnalysis.mockReturnValue({
        state: { status: "empty" },
        actions: { reload: vi.fn() },
      });

      renderAnalysisSuccess("ds_1");

      expect(screen.getByText("No analysis data available")).toBeInTheDocument();
    });
  });

  describe("Success state", () => {
    const successState = {
      status: "success" as const,
      datasetId: "ds_1",
      metrics: [{ id: "m1", datasetId: "ds_1", name: "Revenue", kind: "currency" }],
      filters: [{ id: "f1", datasetId: "ds_1", field: "status", operator: "eq", value: "active" }],
    };

    it("renders dataset analysis layout", () => {
      mockUseAnalysis.mockReturnValue({
        state: successState,
        actions: { reload: vi.fn() },
      });

      renderAnalysisSuccess("ds_1");

      expect(screen.getByText("Dataset Analysis")).toBeInTheDocument();
      expect(screen.getByText("Dataset: ds_1")).toBeInTheDocument();
    });

    it("renders snapshots panel", () => {
      mockUseAnalysis.mockReturnValue({
        state: successState,
        actions: { reload: vi.fn() },
      });

      renderAnalysisSuccess("ds_1");

      expect(screen.getByRole("heading", { name: "Snapshots" })).toBeInTheDocument();
    });

    it("passes datasetId to useAnalysis", () => {
      mockUseAnalysis.mockReturnValue({
        state: successState,
        actions: { reload: vi.fn() },
      });

      renderAnalysisSuccess("ds_42");

      expect(mockUseAnalysis).toHaveBeenCalledWith("ds_42");
    });

    it("shows restore banner when selectedSnapshot is provided", () => {
      mockUseAnalysis.mockReturnValue({
        state: successState,
        actions: { reload: vi.fn() },
      });
      const snapshot: AnalysisSnapshot = {
        id: "snap_1",
        datasetId: "ds_1",
        createdAt: "2026-03-27T10:00:00.000Z",
      };

      renderAnalysisSuccess("ds_1", defaultSnapshotsState, snapshot);

      expect(
        screen.getByText(/restored from snapshot created at/i),
      ).toBeInTheDocument();
    });

    it("does not show restore banner when no selectedSnapshot", () => {
      mockUseAnalysis.mockReturnValue({
        state: successState,
        actions: { reload: vi.fn() },
      });

      renderAnalysisSuccess("ds_1");

      expect(
        screen.queryByText(/restored from snapshot created at/i),
      ).not.toBeInTheDocument();
    });
  });
});
