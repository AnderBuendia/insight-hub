import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { AnalysisPage } from "@/features/analysis/page/AnalysisPage";

// Mock Next.js navigation hooks
const mockUseSearchParams = vi.fn();

vi.mock("next/navigation", () => ({
  useSearchParams: () => mockUseSearchParams(),
}));

// Mock useAnalysis hook
const mockUseAnalysis = vi.fn();

vi.mock("@/features/analysis/state/useAnalysis", () => ({
  useAnalysis: (datasetId: string | null) => mockUseAnalysis(datasetId),
}));

describe("AnalysisPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Empty State", () => {
    it("renders empty state when no datasetId is provided", () => {
      // Arrange
      mockUseSearchParams.mockReturnValue(new URLSearchParams(""));
      mockUseAnalysis.mockReturnValue({
        state: { status: "idle" },
        actions: { reload: vi.fn() },
      });

      // Act
      render(<AnalysisPage />);

      // Assert
      expect(screen.getByText("No dataset selected")).toBeInTheDocument();
      expect(screen.getByText("Select a dataset first to start analysis.")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /go to datasets/i })).toHaveAttribute("href", "/datasets");
    });

    it("displays empty state when datasetId parameter is empty string", () => {
      // Arrange
      mockUseSearchParams.mockReturnValue(new URLSearchParams("datasetId="));
      mockUseAnalysis.mockReturnValue({
        state: { status: "idle" },
        actions: { reload: vi.fn() },
      });

      // Act
      render(<AnalysisPage />);

      // Assert
      expect(screen.getByText("No dataset selected")).toBeInTheDocument();
    });
  });

  describe("Success State", () => {
    it("renders analysis layout when datasetId is provided", () => {
      // Arrange
      mockUseSearchParams.mockReturnValue(new URLSearchParams("datasetId=ds_123"));
      mockUseAnalysis.mockReturnValue({
        state: {
          status: "success",
          datasetId: "ds_123",
          metrics: [{ id: "m1", datasetId: "ds_123", name: "Metric 1", kind: "number" }],
          filters: [{ id: "f1", datasetId: "ds_123", field: "status", operator: "eq", value: "test" }],
        },
        actions: { reload: vi.fn() },
      });

      // Act
      render(<AnalysisPage />);

      // Assert
      expect(screen.getByText("Dataset Analysis")).toBeInTheDocument();
      expect(screen.getByText("Dataset: ds_123")).toBeInTheDocument();
    });

    it("displays metrics and filters sections", () => {
      // Arrange
      mockUseSearchParams.mockReturnValue(new URLSearchParams("datasetId=ds_456"));
      mockUseAnalysis.mockReturnValue({
        state: {
          status: "success",
          datasetId: "ds_456",
          metrics: [{ id: "m1", datasetId: "ds_456", name: "Test Metric", kind: "currency" }],
          filters: [{ id: "f1", datasetId: "ds_456", field: "category", operator: "contains", value: "active" }],
        },
        actions: { reload: vi.fn() },
      });

      // Act
      render(<AnalysisPage />);

      // Assert
      expect(screen.getByRole("heading", { name: "Metrics" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Filters" })).toBeInTheDocument();
    });

    it("renders PageShell with Analysis title", () => {
      // Arrange
      mockUseSearchParams.mockReturnValue(new URLSearchParams("datasetId=test"));
      mockUseAnalysis.mockReturnValue({
        state: {
          status: "success",
          datasetId: "test",
          metrics: [],
          filters: [],
        },
        actions: { reload: vi.fn() },
      });

      // Act
      render(<AnalysisPage />);

      // Assert
      expect(screen.getAllByRole("heading", { name: "Analysis" })[0]).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("renders loading state while fetching analysis data", () => {
      // Arrange
      mockUseSearchParams.mockReturnValue(new URLSearchParams("datasetId=ds_loading"));
      mockUseAnalysis.mockReturnValue({
        state: { status: "loading", datasetId: "ds_loading" },
        actions: { reload: vi.fn() },
      });

      // Act
      render(<AnalysisPage />);

      // Assert
      expect(screen.getByText("Loading analysis…")).toBeInTheDocument();
    });

    it("renders loading state when hook is in idle status", () => {
      // Arrange
      mockUseSearchParams.mockReturnValue(new URLSearchParams("datasetId=ds_idle"));
      mockUseAnalysis.mockReturnValue({
        state: { status: "idle" },
        actions: { reload: vi.fn() },
      });

      // Act
      render(<AnalysisPage />);

      // Assert
      expect(screen.getByText("Loading analysis…")).toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("renders error state when analysis fetch fails", () => {
      // Arrange
      const mockReload = vi.fn();
      mockUseSearchParams.mockReturnValue(new URLSearchParams("datasetId=ds_error"));
      mockUseAnalysis.mockReturnValue({
        state: {
          status: "error",
          datasetId: "ds_error",
          message: "Failed to load analysis data",
          code: "NETWORK_ERROR",
        },
        actions: { reload: mockReload },
      });

      // Act
      render(<AnalysisPage />);

      // Assert
      expect(screen.getByText("Failed to load analysis data")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
    });
  });

  describe("Empty Data State", () => {
    it("renders empty state when no metrics or filters available", () => {
      // Arrange
      const mockReload = vi.fn();
      mockUseSearchParams.mockReturnValue(new URLSearchParams("datasetId=ds_empty"));
      mockUseAnalysis.mockReturnValue({
        state: { status: "empty", datasetId: "ds_empty" },
        actions: { reload: mockReload },
      });

      // Act
      render(<AnalysisPage />);

      // Assert
      expect(screen.getByText(/no analysis data available/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /reload/i })).toBeInTheDocument();
    });
  });

  describe("URL Parameter Handling", () => {
    it("correctly extracts datasetId from search params", () => {
      // Arrange
      const testId = "my-custom-dataset-id";
      mockUseSearchParams.mockReturnValue(new URLSearchParams(`datasetId=${testId}`));
      mockUseAnalysis.mockReturnValue({
        state: {
          status: "success",
          datasetId: testId,
          metrics: [{ id: "m1", datasetId: testId, name: "Metric", kind: "percentage" }],
          filters: [],
        },
        actions: { reload: vi.fn() },
      });

      // Act
      render(<AnalysisPage />);

      // Assert
      expect(screen.getByText(`Dataset: ${testId}`)).toBeInTheDocument();
    });
  });
});
