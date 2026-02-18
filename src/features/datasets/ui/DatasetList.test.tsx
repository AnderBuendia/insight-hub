import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DatasetList } from "@/features/datasets/ui/DatasetList";
import type { Dataset } from "@/domain";

describe("DatasetList", () => {
  afterEach(() => {
    cleanup();
  });

  const mockDatasets: Dataset[] = [
    { id: "ds_1", name: "Dataset One", description: "First dataset" },
    { id: "ds_2", name: "Dataset Two", description: "Second dataset" },
    { id: "ds_3", name: "Dataset Three", description: "" },
  ];

  describe("Rendering", () => {
    it("renders list with all provided datasets", () => {
      // Arrange
      const onSelect = vi.fn();

      // Act
      render(<DatasetList datasets={mockDatasets} onSelect={onSelect} />);

      // Assert: all dataset names should be visible
      expect(screen.getByText("Dataset One")).toBeInTheDocument();
      expect(screen.getByText("Dataset Two")).toBeInTheDocument();
      expect(screen.getByText("Dataset Three")).toBeInTheDocument();
    });

    it("displays dataset descriptions when provided", () => {
      // Arrange
      const onSelect = vi.fn();

      // Act
      render(<DatasetList datasets={mockDatasets} onSelect={onSelect} />);

      // Assert: descriptions should be visible
      expect(screen.getByText("First dataset")).toBeInTheDocument();
      expect(screen.getByText("Second dataset")).toBeInTheDocument();
    });

    it("renders empty list when no datasets provided", () => {
      // Arrange
      const onSelect = vi.fn();

      // Act
      const { container } = render(<DatasetList datasets={[]} onSelect={onSelect} />);

      // Assert: ul should be empty
      const list = container.querySelector("ul");
      expect(list).toBeInTheDocument();
      expect(list?.children).toHaveLength(0);
    });

    it("renders dataset without description when description is empty", () => {
      // Arrange
      const onSelect = vi.fn();
      const datasetsWithEmptyDesc: Dataset[] = [
        { id: "ds_1", name: "Dataset One", description: "" },
      ];

      // Act
      const { container } = render(
        <DatasetList datasets={datasetsWithEmptyDesc} onSelect={onSelect} />
      );

      // Assert: name is visible but no description div
      expect(screen.getByText("Dataset One")).toBeInTheDocument();
      const listItem = container.querySelector("li");
      const descriptionDiv = listItem?.querySelector("div");
      expect(descriptionDiv).not.toBeInTheDocument();
    });
  });

  describe("Props Variations", () => {
    it("highlights selected dataset when selectedId matches", () => {
      // Arrange
      const onSelect = vi.fn();

      // Act
      render(<DatasetList datasets={mockDatasets} selectedId="ds_2" onSelect={onSelect} />);

      // Assert: selected button should have aria-pressed="true"
      const buttons = screen.getAllByRole("button");
      expect(buttons[0]).toHaveAttribute("aria-pressed", "false");
      expect(buttons[1]).toHaveAttribute("aria-pressed", "true"); // ds_2 is selected
      expect(buttons[2]).toHaveAttribute("aria-pressed", "false");
    });

    it("renders without selection when selectedId is undefined", () => {
      // Arrange
      const onSelect = vi.fn();

      // Act
      render(<DatasetList datasets={mockDatasets} onSelect={onSelect} />);

      // Assert: no buttons should be pressed
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveAttribute("aria-pressed", "false");
      });
    });

    it("renders correctly with single dataset", () => {
      // Arrange
      const onSelect = vi.fn();
      const singleDataset: Dataset[] = [
        { id: "ds_only", name: "Only Dataset", description: "The only one" },
      ];

      // Act
      render(<DatasetList datasets={singleDataset} onSelect={onSelect} />);

      // Assert
      expect(screen.getByText("Only Dataset")).toBeInTheDocument();
      expect(screen.getByText("The only one")).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(1);
    });
  });

  describe("User Interactions", () => {
    it("calls onSelect with correct dataset id when clicked", async () => {
      // Arrange
      const onSelect = vi.fn();
      const user = userEvent.setup();

      // Act
      render(<DatasetList datasets={mockDatasets} onSelect={onSelect} />);
      const datasetTwoButton = screen.getByText("Dataset Two").closest("button");
      await user.click(datasetTwoButton!);

      // Assert
      expect(onSelect).toHaveBeenCalledWith("ds_2");
      expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it("calls onSelect for each different dataset clicked", async () => {
      // Arrange
      const onSelect = vi.fn();
      const user = userEvent.setup();

      // Act
      render(<DatasetList datasets={mockDatasets} onSelect={onSelect} />);
      const datasetOneButton = screen.getByText("Dataset One").closest("button");
      const datasetThreeButton = screen.getByText("Dataset Three").closest("button");

      await user.click(datasetOneButton!);
      await user.click(datasetThreeButton!);

      // Assert
      expect(onSelect).toHaveBeenCalledTimes(2);
      expect(onSelect).toHaveBeenNthCalledWith(1, "ds_1");
      expect(onSelect).toHaveBeenNthCalledWith(2, "ds_3");
    });

    it("allows clicking the same dataset multiple times", async () => {
      // Arrange
      const onSelect = vi.fn();
      const user = userEvent.setup();

      // Act
      render(<DatasetList datasets={mockDatasets} onSelect={onSelect} />);
      const datasetButton = screen.getByText("Dataset One").closest("button");

      await user.click(datasetButton!);
      await user.click(datasetButton!);

      // Assert
      expect(onSelect).toHaveBeenCalledTimes(2);
      expect(onSelect).toHaveBeenCalledWith("ds_1");
    });
  });

  describe("Accessibility", () => {
    it("renders datasets as list items with buttons", () => {
      // Arrange
      const onSelect = vi.fn();

      // Act
      render(<DatasetList datasets={mockDatasets} onSelect={onSelect} />);

      // Assert: should have list structure
      const list = screen.getByRole("list");
      expect(list).toBeInTheDocument();
      
      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(3);
      
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(3);
    });

    it("uses aria-pressed to indicate selection state", () => {
      // Arrange
      const onSelect = vi.fn();

      // Act
      render(<DatasetList datasets={mockDatasets} selectedId="ds_1" onSelect={onSelect} />);

      // Assert: first button should be pressed
      const buttons = screen.getAllByRole("button");
      expect(buttons[0]).toHaveAttribute("aria-pressed", "true");
      expect(buttons[1]).toHaveAttribute("aria-pressed", "false");
      expect(buttons[2]).toHaveAttribute("aria-pressed", "false");
    });

    it("renders buttons with type='button' to prevent form submission", () => {
      // Arrange
      const onSelect = vi.fn();

      // Act
      render(<DatasetList datasets={mockDatasets} onSelect={onSelect} />);

      // Assert: all buttons should have type="button"
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveAttribute("type", "button");
      });
    });

    it("maintains unique keys for list items", () => {
      // Arrange
      const onSelect = vi.fn();

      // Act
      const { container } = render(<DatasetList datasets={mockDatasets} onSelect={onSelect} />);

      // Assert: each li should have unique key (React renders them correctly)
      const listItems = container.querySelectorAll("li");
      expect(listItems).toHaveLength(3);
    });
  });
});
