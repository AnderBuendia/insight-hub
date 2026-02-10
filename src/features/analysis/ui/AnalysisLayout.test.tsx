import { describe, expect, it, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import { AnalysisLayout } from "@/features/analysis/ui/AnalysisLayout";

describe("AnalysisLayout", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Rendering", () => {
    it("renders main title", () => {
      // Arrange & Act
      render(
        <AnalysisLayout
          title="Test Title"
          left={<div>Left content</div>}
          right={<div>Right content</div>}
        />
      );

      // Assert
      expect(screen.getByRole("heading", { level: 1, name: "Test Title" })).toBeInTheDocument();
    });

    it("renders subtitle when provided", () => {
      // Arrange & Act
      render(
        <AnalysisLayout
          title="Test Title"
          subtitle="Test Subtitle"
          left={<div>Left</div>}
          right={<div>Right</div>}
        />
      );

      // Assert
      expect(screen.getByText("Test Subtitle")).toBeInTheDocument();
    });

    it("does not render subtitle when not provided", () => {
      // Arrange & Act
      render(
        <AnalysisLayout
          title="Test Title"
          left={<div>Left</div>}
          right={<div>Right</div>}
        />
      );

      // Assert
      const paragraphs = screen.queryAllByText(/./);
      const hasSubtitle = paragraphs.some((p) => p.tagName === "P" && p.textContent !== "Left" && p.textContent !== "Right");
      expect(hasSubtitle).toBe(false);
    });

    it("renders default section titles", () => {
      // Arrange & Act
      render(
        <AnalysisLayout
          title="Test"
          left={<div>Left content</div>}
          right={<div>Right content</div>}
        />
      );

      // Assert
      expect(screen.getByRole("heading", { level: 2, name: "Metrics" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Filters" })).toBeInTheDocument();
    });

    it("renders custom section titles when provided", () => {
      // Arrange & Act
      render(
        <AnalysisLayout
          title="Test"
          leftTitle="Custom Metrics"
          rightTitle="Custom Filters"
          left={<div>Left</div>}
          right={<div>Right</div>}
        />
      );

      // Assert
      expect(screen.getByRole("heading", { level: 2, name: "Custom Metrics" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Custom Filters" })).toBeInTheDocument();
    });
  });

  describe("Content Rendering", () => {
    it("renders left child content", () => {
      // Arrange & Act
      render(
        <AnalysisLayout
          title="Test"
          left={<div data-testid="left-content">Left Content Text</div>}
          right={<div>Right</div>}
        />
      );

      // Assert
      expect(screen.getByTestId("left-content")).toBeInTheDocument();
      expect(screen.getByText("Left Content Text")).toBeInTheDocument();
    });

    it("renders right child content", () => {
      // Arrange & Act
      render(
        <AnalysisLayout
          title="Test"
          left={<div>Left</div>}
          right={<div data-testid="right-content">Right Content Text</div>}
        />
      );

      // Assert
      expect(screen.getByTestId("right-content")).toBeInTheDocument();
      expect(screen.getByText("Right Content Text")).toBeInTheDocument();
    });

    it("renders both children simultaneously", () => {
      // Arrange & Act
      render(
        <AnalysisLayout
          title="Test"
          left={<span>Left side</span>}
          right={<span>Right side</span>}
        />
      );

      // Assert
      expect(screen.getByText("Left side")).toBeInTheDocument();
      expect(screen.getByText("Right side")).toBeInTheDocument();
    });
  });

  describe("Structure", () => {
    it("renders two sections", () => {
      // Arrange & Act
      const { container } = render(
        <AnalysisLayout
          title="Test"
          left={<div>Left</div>}
          right={<div>Right</div>}
        />
      );

      // Assert
      const sections = container.querySelectorAll("section");
      expect(sections).toHaveLength(2);
    });

    it("renders header element", () => {
      // Arrange & Act
      const { container } = render(
        <AnalysisLayout
          title="Test"
          left={<div>Left</div>}
          right={<div>Right</div>}
        />
      );

      // Assert
      const header = container.querySelector("header");
      expect(header).toBeInTheDocument();
    });
  });
});
