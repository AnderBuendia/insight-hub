import { describe, expect, it, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import { AnalysisSection } from "@/features/analysis/ui/AnalysisSection";

describe("AnalysisSection", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders title and children", () => {
    // Arrange & Act
    render(
      <AnalysisSection title="Metrics">
        <p>content</p>
      </AnalysisSection>,
    );

    // Assert
    expect(screen.getByRole("heading", { level: 2, name: "Metrics" })).toBeInTheDocument();
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    // Arrange & Act
    render(
      <AnalysisSection title="Metrics" description="Key numbers for this dataset.">
        <p>content</p>
      </AnalysisSection>,
    );

    // Assert
    expect(screen.getByText("Key numbers for this dataset.")).toBeInTheDocument();
  });

  it("does not render description when omitted", () => {
    // Arrange & Act
    render(
      <AnalysisSection title="Metrics">
        <p>content</p>
      </AnalysisSection>,
    );

    // Assert
    expect(screen.queryByText(/./i, { selector: "p.text-xs" })).not.toBeInTheDocument();
  });
});
