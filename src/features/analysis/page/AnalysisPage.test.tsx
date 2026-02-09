import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import { AnalysisPage } from "@/features/analysis/page/AnalysisPage";

// Mock Next.js navigation hooks
const mockUseSearchParams = vi.fn();

vi.mock("next/navigation", () => ({
  useSearchParams: () => mockUseSearchParams(),
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
      // Arrange: mock searchParams with no datasetId
      mockUseSearchParams.mockReturnValue(new URLSearchParams(""));

      // Act
      render(<AnalysisPage />);

      // Assert: empty state messages and link
      expect(screen.getByText("No dataset selected.")).toBeInTheDocument();
      expect(screen.getByText("Select a dataset first to start analysis.")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /go to datasets/i })).toHaveAttribute("href", "/datasets");
    });

    it("handles empty datasetId parameter", () => {
      // Arrange: mock with empty datasetId value
      mockUseSearchParams.mockReturnValue(new URLSearchParams("datasetId="));

      // Act
      render(<AnalysisPage />);

      // Assert: empty state is shown (empty string is falsy)
      expect(screen.getByText("No dataset selected.")).toBeInTheDocument();
    });
  });

  describe("Success State", () => {
    it("renders analysis layout when datasetId is provided", () => {
      // Arrange: mock searchParams with valid datasetId
      mockUseSearchParams.mockReturnValue(new URLSearchParams("datasetId=ds_123"));

      // Act
      render(<AnalysisPage />);

      // Assert: main content is rendered
      expect(screen.getByText("Dataset Analysis")).toBeInTheDocument();
      expect(screen.getByText("Dataset: ds_123")).toBeInTheDocument();
    });

    it("displays metrics and filters placeholder sections", () => {
      // Arrange
      mockUseSearchParams.mockReturnValue(new URLSearchParams("datasetId=ds_456"));

      // Act
      render(<AnalysisPage />);

      // Assert: both sections are present
      expect(screen.getByRole("heading", { name: "Metrics" })).toBeInTheDocument();
      expect(screen.getByText("Placeholder — metrics will be displayed here.")).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Filters" })).toBeInTheDocument();
      expect(screen.getByText("Placeholder — filters will be configured here.")).toBeInTheDocument();
    });

    it("renders PageShell with Analysis title", () => {
      // Arrange
      mockUseSearchParams.mockReturnValue(new URLSearchParams("datasetId=test"));

      // Act
      render(<AnalysisPage />);

      // Assert: PageShell title is rendered (get first h1 with role)
      expect(screen.getAllByRole("heading", { name: "Analysis" })[0]).toBeInTheDocument();
    });
  });

  describe("URL Parameter Handling", () => {
    it("correctly extracts datasetId from search params", () => {
      // Arrange: mock with specific datasetId
      const testId = "my-custom-dataset-id";
      mockUseSearchParams.mockReturnValue(new URLSearchParams(`datasetId=${testId}`));

      // Act
      render(<AnalysisPage />);

      // Assert: datasetId is displayed correctly
      expect(screen.getByText(`Dataset: ${testId}`)).toBeInTheDocument();
    });
  });
});
