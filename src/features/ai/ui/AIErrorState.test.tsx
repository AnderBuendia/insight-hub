import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AIErrorState } from "./AIErrorState";

describe("AIErrorState", () => {
  it("renders error heading", () => {
    // Arrange & Act
    render(<AIErrorState message="Test error" onRetry={vi.fn()} />);

    // Assert
    expect(screen.getByText(/AI request failed/i)).toBeInTheDocument();
  });

  it("displays error message", () => {
    // Arrange
    const message = "Connection timeout occurred";

    // Act
    render(<AIErrorState message={message} onRetry={vi.fn()} />);

    // Assert
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it("renders retry button", () => {
    // Arrange & Act
    render(<AIErrorState message="Error" onRetry={vi.fn()} />);

    // Assert
    expect(screen.getByRole("button", { name: /Retry/i })).toBeInTheDocument();
  });

  it("calls onRetry when retry button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<AIErrorState message="Error" onRetry={onRetry} />);

    // Act
    const button = screen.getByRole("button", { name: /Retry/i });
    await user.click(button);

    // Assert
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders with proper container styling", () => {
    // Arrange & Act
    const { container } = render(
      <AIErrorState message="Error" onRetry={vi.fn()} />,
    );

    // Assert
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("rounded-xl", "border", "border-gray-700", "bg-gray-900", "p-3");
  });

  it("allows multiple clicks on retry button", async () => {
    // Arrange
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<AIErrorState message="Error" onRetry={onRetry} />);

    // Act
    const button = screen.getByRole("button", { name: /Retry/i });
    await user.click(button);
    await user.click(button);
    await user.click(button);

    // Assert
    expect(onRetry).toHaveBeenCalledTimes(3);
  });
});
