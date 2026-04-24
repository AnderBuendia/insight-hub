import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

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

  it("renders heading, description and link to datasets", () => {
    // Arrange & Act
    render(<AnalysisEmptyState />);

    // Assert
    expect(screen.getByRole("heading", { level: 2, name: "No dataset selected" })).toBeInTheDocument();
    expect(screen.getByText(/analysis requires a dataset/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /go to datasets/i })).toHaveAttribute("href", "/datasets");
  });
});
