import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AnalysisEmptyState } from "@/features/analysis/ui/AnalysisEmptyState";

vi.mock("next/link", () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

describe("AnalysisEmptyState", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the no-dataset variant with heading, description and datasets link", () => {
    // Arrange & Act
    render(<AnalysisEmptyState reason="no-dataset" />);

    // Assert
    expect(screen.getByRole("heading", { level: 2, name: "No dataset selected" })).toBeInTheDocument();
    expect(screen.getByText(/analysis requires a dataset/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /go to datasets/i })).toHaveAttribute("href", "/datasets");
    expect(screen.queryByRole("button", { name: /reload/i })).not.toBeInTheDocument();
  });

  it("renders the no-data variant with heading, description, reload button and datasets link", () => {
    // Arrange & Act
    render(<AnalysisEmptyState reason="no-data" onReload={vi.fn()} />);

    // Assert
    expect(screen.getByRole("heading", { level: 2, name: "No analysis data found" })).toBeInTheDocument();
    expect(screen.getByText(/no metrics or filters yet/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reload/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /select a different dataset/i })).toHaveAttribute("href", "/datasets");
  });

  it("calls onReload when the reload button is clicked", async () => {
    // Arrange
    const mockOnReload = vi.fn();
    render(<AnalysisEmptyState reason="no-data" onReload={mockOnReload} />);

    // Act
    await userEvent.click(screen.getByRole("button", { name: /reload/i }));

    // Assert
    expect(mockOnReload).toHaveBeenCalledOnce();
  });
});
