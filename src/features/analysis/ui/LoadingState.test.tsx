import { describe, expect, it, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import { LoadingState } from "@/features/analysis/ui/LoadingState";

describe("LoadingState", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Rendering", () => {
    it("renders with default title", () => {
      // Arrange & Act
      render(<LoadingState />);

      // Assert
      expect(screen.getByText("Loading…")).toBeInTheDocument();
    });

    it("renders with custom title", () => {
      // Arrange
      const customTitle = "Loading analysis data…";

      // Act
      render(<LoadingState title={customTitle} />);

      // Assert
      expect(screen.getByText(customTitle)).toBeInTheDocument();
    });

    it("displays loading text in a styled container", () => {
      // Arrange & Act
      const { container } = render(<LoadingState />);

      // Assert
      expect(container.querySelector(".rounded-xl")).toBeInTheDocument();
      expect(container.querySelector(".border-gray-200")).toBeInTheDocument();
    });
  });

  describe("Props Variations", () => {
    it("displays custom loading message when provided", () => {
      // Arrange
      const loadingMessage = "Please wait while we fetch your data…";

      // Act
      render(<LoadingState title={loadingMessage} />);

      // Assert
      expect(screen.getByText(loadingMessage)).toBeInTheDocument();
    });

    it("renders different titles correctly", () => {
      // Arrange
      const titles = [
        "Fetching metrics…",
        "Processing filters…",
        "Loading analysis…",
      ];

      titles.forEach((title) => {
        // Act
        const { unmount } = render(<LoadingState title={title} />);

        // Assert
        expect(screen.getByText(title)).toBeInTheDocument();

        // Cleanup for next iteration
        unmount();
      });
    });
  });
});
