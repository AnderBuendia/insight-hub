import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AIResponse } from "./AIResponse";
import type { AIAssistantResponse } from "@/domain";

describe("AIResponse", () => {
  it("renders answer text", () => {
    // Arrange
    const response: AIAssistantResponse = {
      answer: "This is the AI answer to your question.",
    };

    // Act
    render(<AIResponse response={response} />);

    // Assert
    expect(
      screen.getByText(/This is the AI answer to your question/i),
    ).toBeInTheDocument();
  });

  it("does not render citations section when citations are empty", () => {
    // Arrange
    const response: AIAssistantResponse = {
      answer: "Answer without citations",
      citations: [],
    };

    // Act
    render(<AIResponse response={response} />);

    // Assert
    expect(screen.queryByRole("list", { name: /citations/i })).not.toBeInTheDocument();
  });

  it("does not render citations section when citations are undefined", () => {
    // Arrange
    const response: AIAssistantResponse = {
      answer: "Answer without citations",
    };

    // Act
    render(<AIResponse response={response} />);

    // Assert
    expect(screen.queryByRole("list", { name: /citations/i })).not.toBeInTheDocument();
  });

  it("renders citations when provided", () => {
    // Arrange
    const response: AIAssistantResponse = {
      answer: "Answer with citations",
      citations: [
        { title: "Source 1", url: "https://example.com/1" },
        { title: "Source 2" },
      ],
    };

    // Act
    render(<AIResponse response={response} />);

    // Assert
    expect(screen.getByRole("list", { name: /citations/i })).toBeInTheDocument();
    expect(screen.getByText("Source 1")).toBeInTheDocument();
    expect(screen.getByText("Source 2")).toBeInTheDocument();
  });

  it("renders citation with URL as a link", () => {
    // Arrange
    const response: AIAssistantResponse = {
      answer: "Answer with link citation",
      citations: [{ title: "Linked Source", url: "https://example.com" }],
    };

    // Act
    render(<AIResponse response={response} />);

    // Assert
    const link = screen.getByRole("link", { name: "Linked Source" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders citation without URL as plain text (no link)", () => {
    // Arrange
    const response: AIAssistantResponse = {
      answer: "Answer with plain citation",
      citations: [{ title: "Plain Source" }],
    };

    // Act
    render(<AIResponse response={response} />);

    // Assert
    expect(screen.queryByRole("link", { name: "Plain Source" })).not.toBeInTheDocument();
    expect(screen.getByText("Plain Source")).toBeInTheDocument();
  });

  it("renders multiple citations in a list", () => {
    // Arrange
    const response: AIAssistantResponse = {
      answer: "Answer",
      citations: [
        { title: "Citation A" },
        { title: "Citation B" },
        { title: "Citation C" },
      ],
    };

    // Act
    render(<AIResponse response={response} />);

    // Assert
    const listItems = screen.getByRole("list", { name: /citations/i }).querySelectorAll("li");
    expect(listItems).toHaveLength(3);
  });

  it("renders suggestions when provided", () => {
    // Arrange
    const response: AIAssistantResponse = {
      answer: "Answer with suggestions",
      suggestions: ["What metric changed the most?", "Which segment leads?"],
    };

    // Act
    render(<AIResponse response={response} />);

    // Assert
    expect(screen.getByRole("list", { name: /follow-up/i })).toBeInTheDocument();
    expect(screen.getByText("What metric changed the most?")).toBeInTheDocument();
    expect(screen.getByText("Which segment leads?")).toBeInTheDocument();
  });

  it("does not render suggestions section when suggestions are empty", () => {
    // Arrange
    const response: AIAssistantResponse = {
      answer: "Answer without suggestions",
      suggestions: [],
    };

    // Act
    render(<AIResponse response={response} />);

    // Assert
    expect(screen.queryByRole("list", { name: /follow-up/i })).not.toBeInTheDocument();
  });

  it("renders with proper container styling", () => {
    // Arrange
    const response: AIAssistantResponse = {
      answer: "Test answer",
    };

    // Act
    const { container } = render(<AIResponse response={response} />);

    // Assert
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("rounded-xl", "border", "border-gray-700", "bg-gray-900");
  });
});
