import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock modules BEFORE importing component
vi.mock("@/shared", () => ({
  FeatureFlags: { aiEnabled: true },
}));

vi.mock("@/features/ai/state/useAI", () => ({
  useAI: vi.fn(() => ({
    state: { status: "disabled" },
    actions: { setPrompt: vi.fn(), submit: vi.fn() },
  })),
}));

describe("AIPanel - Hook Returns Disabled State", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders disabled state when hook returns disabled status", async () => {
    // Import component AFTER mocks are set up
    const { AIPanel } = await import("./AIPanel");

    // Act
    render(<AIPanel datasetId="ds_123" />);

    // Assert
    expect(
      screen.getByRole("heading", { name: /AI Insights/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/AI-assisted insights are not enabled/i),
    ).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});
