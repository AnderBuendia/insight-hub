import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { AnalysisSuccess } from "@/features/analysis/ui/AnalysisSuccess";

// Mock AIPanel to isolate AnalysisSuccess behaviour
vi.mock("@/features/ai/page/AIPanel", () => ({
  AIPanel: () => <div data-testid="ai-panel" />,
}));

const mockUseAnalysis = vi.fn();
vi.mock("@/features/analysis/state/useAnalysis", () => ({
  useAnalysis: (datasetId: string) => mockUseAnalysis(datasetId),
}));

const mockUseSnapshots = vi.fn();
vi.mock("@/features/analysis/state/useSnapshots", () => ({
  useSnapshots: (datasetId: string) => mockUseSnapshots(datasetId),
}));

const defaultSnapshotsState = {
  state: { status: "empty" as const, snapshots: [], selectedId: undefined },
  actions: { save: vi.fn(), select: vi.fn(), clear: vi.fn() },
};

describe("AnalysisSuccess", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSnapshots.mockReturnValue(defaultSnapshotsState);
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

        render(<AnalysisSuccess datasetId="ds_1" />);

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

      render(<AnalysisSuccess datasetId="ds_1" />);

      expect(screen.getByText("Network failure")).toBeInTheDocument();
    });
  });

  describe("Empty state", () => {
    it("renders empty state", () => {
      mockUseAnalysis.mockReturnValue({
        state: { status: "empty" },
        actions: { reload: vi.fn() },
      });

      render(<AnalysisSuccess datasetId="ds_1" />);

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

      render(<AnalysisSuccess datasetId="ds_1" />);

      expect(screen.getByText("Dataset Analysis")).toBeInTheDocument();
      expect(screen.getByText("Dataset: ds_1")).toBeInTheDocument();
    });

    it("renders snapshots panel", () => {
      mockUseAnalysis.mockReturnValue({
        state: successState,
        actions: { reload: vi.fn() },
      });

      render(<AnalysisSuccess datasetId="ds_1" />);

      expect(screen.getByRole("heading", { name: "Snapshots" })).toBeInTheDocument();
    });

    it("passes datasetId to useAnalysis and useSnapshots", () => {
      mockUseAnalysis.mockReturnValue({
        state: successState,
        actions: { reload: vi.fn() },
      });

      render(<AnalysisSuccess datasetId="ds_42" />);

      expect(mockUseAnalysis).toHaveBeenCalledWith("ds_42");
      expect(mockUseSnapshots).toHaveBeenCalledWith("ds_42");
    });
  });
});
