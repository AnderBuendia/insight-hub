import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AIPanelShell } from "./AIPanelShell";

describe("AIPanelShell", () => {
  it("renders AI Insights heading", () => {
    // Arrange & Act
    render(<AIPanelShell>Content</AIPanelShell>);

    // Assert
    expect(screen.getByRole("heading", { name: /AI Insights/i })).toBeInTheDocument();
  });

  it("renders children content", () => {
    // Arrange
    const testContent = "Test AI Content";

    // Act
    render(<AIPanelShell>{testContent}</AIPanelShell>);

    // Assert
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it("renders multiple children", () => {
    // Arrange & Act
    render(
      <AIPanelShell>
        <div>Child 1</div>
        <div>Child 2</div>
      </AIPanelShell>,
    );

    // Assert
    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.getByText("Child 2")).toBeInTheDocument();
  });

  it("renders with proper section structure", () => {
    // Arrange & Act
    const { container } = render(<AIPanelShell>Content</AIPanelShell>);

    // Assert
    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass("space-y-4");
  });
});
