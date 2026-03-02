import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

describe("AIPanel", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  describe("when AI flag is disabled", () => {
    beforeEach(() => {
      vi.doMock("@/shared", () => ({
        FeatureFlags: { aiEnabled: false },
      }));
    });

    it("renders disabled state when flag is off", async () => {
      // Arrange
      const { AIPanel } = await import("./AIPanel");

      // Act
      render(<AIPanel />);

      // Assert
      expect(
        screen.getByText(/AI-assisted insights are not enabled/i),
      ).toBeInTheDocument();
    });

    it("renders AI Insights heading", async () => {
      // Arrange
      const { AIPanel } = await import("./AIPanel");

      // Act
      render(<AIPanel />);

      // Assert
      expect(screen.getByRole("heading", { name: /AI Insights/i })).toBeInTheDocument();
    });

    it("wraps disabled state in AIPanelShell", async () => {
      // Arrange
      const { AIPanel } = await import("./AIPanel");

      // Act
      const { container } = render(<AIPanel />);

      // Assert
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass("space-y-2");
    });

    it("renders disabled message with proper styling", async () => {
      // Arrange
      const { AIPanel } = await import("./AIPanel");

      // Act
      const { container } = render(<AIPanel />);

      // Assert
      const disabledState = container.querySelector(".rounded-xl.border-dashed");
      expect(disabledState).toBeInTheDocument();
    });
  });

  describe("when AI flag is enabled", () => {
    beforeEach(() => {
      vi.doMock("@/shared", () => ({
        FeatureFlags: { aiEnabled: true },
      }));
    });

    it("renders enabled placeholder message", async () => {
      // Arrange
      const { AIPanel } = await import("./AIPanel");

      // Act
      render(<AIPanel />);

      // Assert
      expect(screen.getByText(/AI enabled \(coming soon\)/i)).toBeInTheDocument();
    });

    it("renders AI Insights heading", async () => {
      // Arrange
      const { AIPanel } = await import("./AIPanel");

      // Act
      render(<AIPanel />);

      // Assert
      expect(screen.getByRole("heading", { name: /AI Insights/i })).toBeInTheDocument();
    });

    it("wraps enabled content in AIPanelShell", async () => {
      // Arrange
      const { AIPanel } = await import("./AIPanel");

      // Act
      const { container } = render(<AIPanel />);

      // Assert
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass("space-y-2");
    });

    it("does not render disabled state", async () => {
      // Arrange
      const { AIPanel } = await import("./AIPanel");

      // Act
      render(<AIPanel />);

      // Assert
      expect(
        screen.queryByText(/AI-assisted insights are not enabled/i),
      ).not.toBeInTheDocument();
    });
  });
});
