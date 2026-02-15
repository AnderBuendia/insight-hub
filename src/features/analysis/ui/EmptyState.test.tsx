import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { EmptyState } from "@/features/analysis/ui/EmptyState";

describe("EmptyState", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Rendering", () => {
    it("renders with default props", () => {
      // Arrange
      const mockOnReload = vi.fn();

      // Act
      render(<EmptyState onReload={mockOnReload} />);

      // Assert
      expect(screen.getByText("No analysis data available")).toBeInTheDocument();
      expect(screen.getByText("This dataset has no metrics or filters yet.")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /reload/i })).toBeInTheDocument();
    });

    it("renders with custom title and description", () => {
      // Arrange
      const mockOnReload = vi.fn();
      const customTitle = "Custom Empty Title";
      const customDescription = "Custom empty description text";

      // Act
      render(
        <EmptyState
          title={customTitle}
          description={customDescription}
          onReload={mockOnReload}
        />
      );

      // Assert
      expect(screen.getByText(customTitle)).toBeInTheDocument();
      expect(screen.getByText(customDescription)).toBeInTheDocument();
    });
  });

  describe("Props Variations", () => {
    it("displays custom title when provided", () => {
      // Arrange
      const mockOnReload = vi.fn();
      const title = "No Data Found";

      // Act
      render(<EmptyState title={title} onReload={mockOnReload} />);

      // Assert
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    it("displays custom description when provided", () => {
      // Arrange
      const mockOnReload = vi.fn();
      const description = "Please check your configuration.";

      // Act
      render(<EmptyState description={description} onReload={mockOnReload} />);

      // Assert
      expect(screen.getByText(description)).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("calls onReload when reload button is clicked", async () => {
      // Arrange
      const user = userEvent.setup();
      const mockOnReload = vi.fn();
      render(<EmptyState onReload={mockOnReload} />);

      // Act
      await user.click(screen.getByRole("button", { name: /reload/i }));

      // Assert
      expect(mockOnReload).toHaveBeenCalledTimes(1);
    });

    it("calls onReload multiple times on repeated clicks", async () => {
      // Arrange
      const user = userEvent.setup();
      const mockOnReload = vi.fn();
      render(<EmptyState onReload={mockOnReload} />);

      // Act
      await user.click(screen.getByRole("button", { name: /reload/i }));
      await user.click(screen.getByRole("button", { name: /reload/i }));

      // Assert
      expect(mockOnReload).toHaveBeenCalledTimes(2);
    });
  });

  describe("Accessibility", () => {
    it("has correct heading structure", () => {
      // Arrange
      const mockOnReload = vi.fn();

      // Act
      render(<EmptyState onReload={mockOnReload} />);

      // Assert
      expect(screen.getByRole("heading", { name: /no analysis data available/i })).toBeInTheDocument();
    });

    it("has accessible button", () => {
      // Arrange
      const mockOnReload = vi.fn();

      // Act
      render(<EmptyState onReload={mockOnReload} />);

      // Assert
      const button = screen.getByRole("button", { name: /reload/i });
      expect(button).toHaveAttribute("type", "button");
    });
  });
});
