import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { AnalysisPage } from "@/features/analysis/page/AnalysisPage";

const mockUseSearchParams = vi.fn();
const mockUseAnalysis = vi.fn();
const mockUseSnapshots = vi.fn();

vi.mock("next/navigation", () => ({
  useSearchParams: () => mockUseSearchParams(),
}));

vi.mock("@/features/analysis/state/useAnalysis", () => ({
  useAnalysis: (datasetId: string | null) => mockUseAnalysis(datasetId),
}));

vi.mock("@/features/analysis/state/useSnapshots", () => ({
  useSnapshots: (datasetId: string) => mockUseSnapshots(datasetId),
}));

vi.mock("@/features/ai/page/AIPanel", () => ({
  AIPanel: () => <div data-testid="ai-panel" />,
}));

describe("AnalysisPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAnalysis.mockReturnValue({
      state: {
        status: "success",
        datasetId: "ds_123",
        metrics: [{ type: "total", value: 60 }],
        filters: { category: "even" },
        insights: [],
      },
      actions: {
        reload: vi.fn(),
        setFilters: vi.fn(),
        resetFilters: vi.fn(),
      },
    });
    mockUseSnapshots.mockReturnValue({
      state: {
        status: "empty",
        snapshots: [],
        selectedId: undefined,
      },
      actions: {
        save: vi.fn(),
        select: vi.fn(),
        deleteAll: vi.fn(),
        clearSelection: vi.fn(),
      },
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the missing dataset state when datasetId is not provided", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams(""));

    render(<AnalysisPage />);

    expect(screen.getByText("No dataset selected")).toBeInTheDocument();
  });

  it("passes the dataset id to both state hooks", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("datasetId=ds_123"));

    render(<AnalysisPage />);

    expect(mockUseAnalysis).toHaveBeenCalledWith("ds_123");
    expect(mockUseSnapshots).toHaveBeenCalledWith("ds_123");
  });

  it("renders the analysis UI when a dataset is selected", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("datasetId=ds_123"));

    render(<AnalysisPage />);

    expect(screen.getByText("Dataset Analysis")).toBeInTheDocument();
    expect(screen.getByText("Dataset: ds_123")).toBeInTheDocument();
  });

  it("wires snapshot saving to the active analysis filters", async () => {
    const save = vi.fn();
    mockUseSearchParams.mockReturnValue(new URLSearchParams("datasetId=ds_123"));
    mockUseSnapshots.mockReturnValue({
      state: {
        status: "empty",
        snapshots: [],
        selectedId: undefined,
      },
      actions: {
        save,
        select: vi.fn(),
        deleteAll: vi.fn(),
        clearSelection: vi.fn(),
      },
    });

    render(<AnalysisPage />);

    await screen.getByRole("button", { name: /save snapshot/i }).click();

    expect(save).toHaveBeenCalledWith({ category: "even" });
  });
});
