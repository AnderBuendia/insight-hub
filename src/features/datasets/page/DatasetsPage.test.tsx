import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DatasetsPage } from "@/features/datasets/page/DatasetsPage";
import { DatasetsInfra } from "@/infra";

// Mock Next.js navigation hooks
const mockReplace = vi.fn();
const mockUseSearchParams = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => mockUseSearchParams(),
}));

describe("DatasetsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSearchParams.mockReturnValue(new URLSearchParams(""));
  });

  afterEach(() => {
    cleanup();
  });

  describe("Loading State", () => {
    it("displays loading message while fetching datasets", () => {
      // Arrange: mock infra with a pending promise
      vi.spyOn(DatasetsInfra, "listDatasets").mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      // Act
      render(<DatasetsPage />);

      // Assert
      expect(screen.getByText("Loading datasets…")).toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("displays empty state when no datasets are available", async () => {
      // Arrange: mock infra returning empty array
      vi.spyOn(DatasetsInfra, "listDatasets").mockResolvedValue({
        ok: true,
        data: [],
      });

      // Act
      render(<DatasetsPage />);

      // Assert
      expect(await screen.findByText("No datasets available.")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /reload/i })).toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("displays error message when dataset loading fails", async () => {
      // Arrange: mock infra returning error
      vi.spyOn(DatasetsInfra, "listDatasets").mockResolvedValue({
        ok: false,
        error: { code: "UNEXPECTED", message: "Network error occurred" },
      });

      // Act
      render(<DatasetsPage />);

      // Assert
      expect(await screen.findByText(/Failed to load datasets/i)).toBeInTheDocument();
      expect(screen.getByText(/Network error occurred/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
    });

    it("allows retry after error", async () => {
      // Arrange: mock infra failing first, then succeeding
      const listSpy = vi
        .spyOn(DatasetsInfra, "listDatasets")
        .mockResolvedValueOnce({
          ok: false,
          error: { code: "UNEXPECTED", message: "Error" },
        })
        .mockResolvedValueOnce({
          ok: true,
          data: [{ id: "ds_1", name: "Dataset One", description: "Desc 1" }],
        });

      // Act
      render(<DatasetsPage />);
      const retryButton = await screen.findByRole("button", { name: /retry/i });
      await userEvent.click(retryButton);

      // Assert: second call should succeed
      await waitFor(() => {
        expect(screen.getByText("Dataset One")).toBeInTheDocument();
      });
      expect(listSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe("Success State", () => {
    it("renders list of datasets when loading succeeds", async () => {
      // Arrange: mock infra returning datasets
      vi.spyOn(DatasetsInfra, "listDatasets").mockResolvedValue({
        ok: true,
        data: [
          { id: "ds_1", name: "Dataset One", description: "Desc 1" },
          { id: "ds_2", name: "Dataset Two", description: "Desc 2" },
        ],
      });

      // Act
      render(<DatasetsPage />);

      // Assert: dataset names should be visible
      expect(await screen.findByText("Dataset One")).toBeInTheDocument();
      expect(screen.getByText("Dataset Two")).toBeInTheDocument();
    });

    it("displays selection prompt when no dataset selected", async () => {
      // Arrange
      vi.spyOn(DatasetsInfra, "listDatasets").mockResolvedValue({
        ok: true,
        data: [{ id: "ds_1", name: "Dataset One", description: "Desc 1" }],
      });

      // Act
      render(<DatasetsPage />);

      // Assert
      expect(await screen.findByText("Select a dataset.")).toBeInTheDocument();
    });

    it("shows selected dataset and analysis link when dataset is selected", async () => {
      // Arrange
      vi.spyOn(DatasetsInfra, "listDatasets").mockResolvedValue({
        ok: true,
        data: [
          { id: "ds_1", name: "Dataset One", description: "Desc 1" },
          { id: "ds_2", name: "Dataset Two", description: "Desc 2" },
        ],
      });

      // Act: render and select first dataset
      render(<DatasetsPage />);
      const datasetOne = await screen.findByText("Dataset One");
      await userEvent.click(datasetOne);

      // Assert: selected dataset and analysis link should be visible
      expect(screen.getByText("Selected: ds_1")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /go to analysis/i })).toHaveAttribute(
        "href",
        "/analysis?datasetId=ds_1"
      );
    });

    it("updates URL when dataset is selected", async () => {
      // Arrange
      vi.spyOn(DatasetsInfra, "listDatasets").mockResolvedValue({
        ok: true,
        data: [{ id: "ds_test", name: "Test Dataset", description: "Test" }],
      });

      // Act
      render(<DatasetsPage />);
      const dataset = await screen.findByText("Test Dataset");
      await userEvent.click(dataset);

      // Assert: router.replace should be called with selected dataset
      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith("/datasets?selected=ds_test");
      });
    });
  });

  describe("URL Parameter Handling", () => {
    it("selects dataset from URL parameter on load", async () => {
      // Arrange: mock URL with selected parameter
      mockUseSearchParams.mockReturnValue(new URLSearchParams("selected=ds_2"));
      vi.spyOn(DatasetsInfra, "listDatasets").mockResolvedValue({
        ok: true,
        data: [
          { id: "ds_1", name: "Dataset One", description: "Desc 1" },
          { id: "ds_2", name: "Dataset Two", description: "Desc 2" },
        ],
      });

      // Act
      render(<DatasetsPage />);

      // Assert: dataset from URL should be selected
      await waitFor(() => {
        expect(screen.getByText("Selected: ds_2")).toBeInTheDocument();
      });
    });

    it("ignores invalid dataset ID from URL parameter", async () => {
      // Arrange: mock URL with non-existent dataset ID
      mockUseSearchParams.mockReturnValue(new URLSearchParams("selected=invalid_id"));
      vi.spyOn(DatasetsInfra, "listDatasets").mockResolvedValue({
        ok: true,
        data: [{ id: "ds_1", name: "Dataset One", description: "Desc 1" }],
      });

      // Act
      render(<DatasetsPage />);

      // Assert: should not show as selected
      await screen.findByText("Dataset One");
      expect(screen.queryByText("Selected: invalid_id")).not.toBeInTheDocument();
      expect(screen.getByText("Select a dataset.")).toBeInTheDocument();
    });
  });
});
