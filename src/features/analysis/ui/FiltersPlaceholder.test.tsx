import { describe, expect, it, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import { FiltersPlaceholder } from "@/features/analysis/ui/FiltersPlaceholder";

describe("FiltersPlaceholder", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Rendering", () => {
    it("renders placeholder message", () => {
      // Arrange & Act
      render(<FiltersPlaceholder />);

      // Assert
      expect(screen.getByText("Placeholder — filters will be configured here.")).toBeInTheDocument();
    });

    it("renders Date Range label", () => {
      // Arrange & Act
      render(<FiltersPlaceholder />);

      // Assert
      expect(screen.getByText("Date Range")).toBeInTheDocument();
    });

    it("renders Category label", () => {
      // Arrange & Act
      render(<FiltersPlaceholder />);

      // Assert
      expect(screen.getByText("Category")).toBeInTheDocument();
    });
  });

  describe("Filter States", () => {
    it("renders 'No filter applied' for Date Range", () => {
      // Arrange & Act
      render(<FiltersPlaceholder />);

      // Assert
      expect(screen.getByText("No filter applied")).toBeInTheDocument();
    });

    it("renders 'All categories' for Category", () => {
      // Arrange & Act
      render(<FiltersPlaceholder />);

      // Assert
      expect(screen.getByText("All categories")).toBeInTheDocument();
    });
  });

  describe("Structure", () => {
    it("renders labels as label elements", () => {
      // Arrange & Act
      const { container } = render(<FiltersPlaceholder />);

      // Assert
      const labels = container.querySelectorAll("label");
      expect(labels).toHaveLength(2);
    });

    it("renders both filter sections", () => {
      // Arrange & Act
      render(<FiltersPlaceholder />);

      // Assert
      expect(screen.getByText("Date Range")).toBeInTheDocument();
      expect(screen.getByText("Category")).toBeInTheDocument();
      expect(screen.getByText("No filter applied")).toBeInTheDocument();
      expect(screen.getByText("All categories")).toBeInTheDocument();
    });
  });

  describe("Content Order", () => {
    it("renders Date Range before Category", () => {
      // Arrange & Act
      const { container } = render(<FiltersPlaceholder />);

      // Assert
      const labels = Array.from(container.querySelectorAll("label"));
      expect(labels[0]).toHaveTextContent("Date Range");
      expect(labels[1]).toHaveTextContent("Category");
    });
  });

  describe("Accessibility", () => {
    it("uses semantic label elements", () => {
      // Arrange & Act
      render(<FiltersPlaceholder />);

      // Assert
      const dateRangeLabel = screen.getByText("Date Range");
      const categoryLabel = screen.getByText("Category");
      
      expect(dateRangeLabel.tagName).toBe("LABEL");
      expect(categoryLabel.tagName).toBe("LABEL");
    });
  });
});
