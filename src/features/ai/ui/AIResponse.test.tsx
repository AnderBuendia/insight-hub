import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AIResponse } from "./AIResponse";
import type { InfraAIResponse } from "@/infra";

describe("AIResponse", () => {
  it("renders answer text", () => {
    // Arrange
    const response: InfraAIResponse = {
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
    const response: InfraAIResponse = {
      answer: "Answer without citations",
      citations: [],
    };

    // Act
    const { container } = render(<AIResponse response={response} />);

    // Assert
    const citationsHeading = container.querySelector(".text-xs.font-medium.text-gray-700");
    expect(citationsHeading).not.toBeInTheDocument();
  });

  it("does not render citations section when citations are undefined", () => {
    // Arrange
    const response: InfraAIResponse = {
      answer: "Answer without citations",
    };

    // Act
    const { container } = render(<AIResponse response={response} />);

    // Assert
    const citationsHeading = container.querySelector(".text-xs.font-medium.text-gray-700");
    expect(citationsHeading).not.toBeInTheDocument();
  });

  it("renders citations when provided", () => {
    // Arrange
    const response: InfraAIResponse = {
      answer: "Answer with citations",
      citations: [
        { title: "Source 1", url: "https://example.com/1" },
        { title: "Source 2" },
      ],
    };

    // Act
    const { container } = render(<AIResponse response={response} />);

    // Assert
    const citationsHeading = container.querySelector(".text-xs.font-medium.text-gray-700");
    expect(citationsHeading).toBeInTheDocument();
    expect(citationsHeading).toHaveTextContent("Citations");
    expect(screen.getByText("Source 1")).toBeInTheDocument();
    expect(screen.getByText("Source 2")).toBeInTheDocument();
  });

  it("renders multiple citations in a list", () => {
    // Arrange
    const response: InfraAIResponse = {
      answer: "Answer",
      citations: [
        { title: "Citation A" },
        { title: "Citation B" },
        { title: "Citation C" },
      ],
    };

    // Act
    const { container } = render(<AIResponse response={response} />);

    // Assert
    const listItems = container.querySelectorAll("li");
    expect(listItems).toHaveLength(3);
  });

  it("renders with proper container styling", () => {
    // Arrange
    const response: InfraAIResponse = {
      answer: "Test answer",
    };

    // Act
    const { container } = render(<AIResponse response={response} />);

    // Assert
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("rounded-xl", "border", "border-gray-200", "bg-white", "p-3");
  });
});
