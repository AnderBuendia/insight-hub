import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AIForm } from "./AIForm";

describe("AIForm", () => {
  const defaultProps = {
    prompt: "",
    onPromptChange: vi.fn(),
    onSubmit: vi.fn(),
    disabled: false,
  };

  it("renders textarea with placeholder", () => {
    // Arrange & Act
    render(<AIForm {...defaultProps} />);

    // Assert
    expect(
      screen.getByPlaceholderText(/Ask a question about this dataset/i),
    ).toBeInTheDocument();
  });

  it("displays current prompt value", () => {
    // Arrange
    const prompt = "What is the average revenue?";

    // Act
    render(<AIForm {...defaultProps} prompt={prompt} />);

    // Assert
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue(prompt);
  });

  it("calls onPromptChange when typing", async () => {
    // Arrange
    const user = userEvent.setup();
    const onPromptChange = vi.fn();
    render(<AIForm {...defaultProps} onPromptChange={onPromptChange} />);

    // Act
    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "test");

    // Assert
    expect(onPromptChange).toHaveBeenCalled();
  });

  it("renders submit button with default label", () => {
    // Arrange & Act
    render(<AIForm {...defaultProps} />);

    // Assert
    expect(screen.getByRole("button", { name: /Ask/i })).toBeInTheDocument();
  });

  it("renders submit button with custom label", () => {
    // Arrange & Act
    render(<AIForm {...defaultProps} submitLabel="Submit Query" />);

    // Assert
    expect(
      screen.getByRole("button", { name: /Submit Query/i }),
    ).toBeInTheDocument();
  });

  it("calls onSubmit when button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AIForm {...defaultProps} prompt="test query" onSubmit={onSubmit} />);

    // Act
    const button = screen.getByRole("button", { name: /Ask/i });
    await user.click(button);

    // Assert
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("disables submit button when prompt is empty", () => {
    // Arrange & Act
    render(<AIForm {...defaultProps} prompt="" />);

    // Assert
    const button = screen.getByRole("button", { name: /Ask/i });
    expect(button).toBeDisabled();
  });

  it("disables submit button when prompt is only whitespace", () => {
    // Arrange & Act
    render(<AIForm {...defaultProps} prompt="   " />);

    // Assert
    const button = screen.getByRole("button", { name: /Ask/i });
    expect(button).toBeDisabled();
  });

  it("enables submit button when prompt has content", () => {
    // Arrange & Act
    render(<AIForm {...defaultProps} prompt="query" />);

    // Assert
    const button = screen.getByRole("button", { name: /Ask/i });
    expect(button).not.toBeDisabled();
  });

  it("disables all controls when disabled prop is true", () => {
    // Arrange & Act
    render(<AIForm {...defaultProps} prompt="test" disabled />);

    // Assert
    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows loading label when disabled", () => {
    // Arrange & Act
    render(
      <AIForm
        {...defaultProps}
        prompt="test"
        disabled
        submitLabel="Asking…"
      />,
    );

    // Assert
    expect(screen.getByRole("button", { name: /Asking/i })).toBeInTheDocument();
  });
});
