import { describe, expect, it, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import { MissingDatasetState } from "@/features/analysis/ui/MissingDatasetState";

describe("MissingDatasetState", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Rendering", () => {
    it("renders the main heading", () => {
      // Arrange & Act
      render(<MissingDatasetState />);

      // Assert
      expect(screen.getByRole("heading", { level: 2, name: "No dataset selected" })).toBeInTheDocument();
    });

    it("renders the description text", () => {
      // Arrange & Act
      render(<MissingDatasetState />);

      // Assert
      expect(screen.getByText("Select a dataset first to start analysis.")).toBeInTheDocument();
    });

    it("renders the link to datasets page", () => {
      // Arrange & Act
      render(<MissingDatasetState />);

      // Assert
      const link = screen.getByRole("link", { name: /go to datasets/i });
      expect(link).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("link points to /datasets route", () => {
      // Arrange & Act
      render(<MissingDatasetState />);

      // Assert
      const link = screen.getByRole("link", { name: /go to datasets/i });
      expect(link).toHaveAttribute("href", "/datasets");
    });
  });

  describe("Accessibility", () => {
    it("uses semantic heading element", () => {
      // Arrange & Act
      render(<MissingDatasetState />);

      // Assert
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("No dataset selected");
    });
  });
});
