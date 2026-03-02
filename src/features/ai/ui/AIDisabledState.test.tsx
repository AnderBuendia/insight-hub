import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AIDisabledState } from "./AIDisabledState";

describe("AIDisabledState", () => {
  it("shows disabled message", () => {
    // Arrange & Act
    render(<AIDisabledState />);

    // Assert
    expect(
      screen.getByText(/AI-assisted insights are not enabled in this environment/i),
    ).toBeInTheDocument();
  });

  it("renders with proper structure", () => {
    // Arrange & Act
    const { container } = render(<AIDisabledState />);

    // Assert
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("rounded-xl", "border", "border-dashed", "border-gray-300", "bg-gray-50", "p-4");
  });
});
