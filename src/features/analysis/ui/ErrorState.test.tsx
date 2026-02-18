import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ErrorState } from "@/features/analysis/ui/ErrorState";

describe("ErrorState", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Rendering", () => {
    it("renders with required props", () => {
      // Arrange
      const mockOnRetry = vi.fn();
      const errorMessage = "Failed to load data";

      // Act
      render(<ErrorState message={errorMessage} onRetry={mockOnRetry} />);

      // Assert
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
    });

    it("displays provided error message", () => {
      // Arrange
      const mockOnRetry = vi.fn();
      const customError = "Network connection failed. Please try again later.";

      // Act
      render(<ErrorState message={customError} onRetry={mockOnRetry} />);

      // Assert
      expect(screen.getByText(customError)).toBeInTheDocument();
    });

    it("renders standard error heading", () => {
      // Arrange
      const mockOnRetry = vi.fn();

      // Act
      render(<ErrorState message="Error occurred" onRetry={mockOnRetry} />);

      // Assert
      expect(screen.getByRole("heading", { name: /something went wrong/i })).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("calls onRetry when retry button is clicked", async () => {
      // Arrange
      const user = userEvent.setup();
      const mockOnRetry = vi.fn();
      render(<ErrorState message="Test error" onRetry={mockOnRetry} />);

      // Act
      await user.click(screen.getByRole("button", { name: /retry/i }));

      // Assert
      expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });

    it("calls onRetry on multiple clicks", async () => {
      // Arrange
      const user = userEvent.setup();
      const mockOnRetry = vi.fn();
      render(<ErrorState message="Test error" onRetry={mockOnRetry} />);

      // Act
      await user.click(screen.getByRole("button", { name: /retry/i }));
      await user.click(screen.getByRole("button", { name: /retry/i }));
      await user.click(screen.getByRole("button", { name: /retry/i }));

      // Assert
      expect(mockOnRetry).toHaveBeenCalledTimes(3);
    });
  });

  describe("Accessibility", () => {
    it("has accessible button with correct type", () => {
      // Arrange
      const mockOnRetry = vi.fn();

      // Act
      render(<ErrorState message="Error" onRetry={mockOnRetry} />);

      // Assert
      const button = screen.getByRole("button", { name: /retry/i });
      expect(button).toHaveAttribute("type", "button");
    });

    it("has correct heading structure", () => {
      // Arrange
      const mockOnRetry = vi.fn();

      // Act
      render(<ErrorState message="Error" onRetry={mockOnRetry} />);

      // Assert
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Something went wrong");
    });
  });
});
