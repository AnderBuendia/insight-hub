import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AIPanel } from "./AIPanel";
import * as SharedModule from "@/shared";
import { AIInfra } from "@/infra";

// Mock the AI infra module
vi.mock("@/infra", () => ({
  AIInfra: {
    submitAIQuery: vi.fn(),
  },
}));

// Mock feature flags module
vi.mock("@/shared", () => ({
  FeatureFlags: { aiEnabled: true },
}));

describe("AIPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: feature flag enabled for most tests
    vi.mocked(SharedModule.FeatureFlags).aiEnabled = true;
  });

  afterEach(() => {
    cleanup();
  });

  describe("Feature Flag Disabled", () => {
    it("renders disabled state with heading and message", () => {
      // Arrange
      vi.mocked(SharedModule.FeatureFlags).aiEnabled = false;

      // Act
      render(<AIPanel datasetId="ds_123" />);

      // Assert
      expect(
        screen.getByRole("heading", { name: /AI Insights/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/AI-assisted insights are not enabled/i),
      ).toBeInTheDocument();
    });

    it("does not render form when disabled", () => {
      // Arrange
      vi.mocked(SharedModule.FeatureFlags).aiEnabled = false;

      // Act
      render(<AIPanel datasetId="ds_123" />);

      // Assert
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /Ask/i })).not.toBeInTheDocument();
    });
  });

  describe("Feature Flag Enabled", () => {
    describe("Initial State (Idle)", () => {
      it("renders complete idle state", () => {
        // Act
        render(<AIPanel datasetId="ds_123" />);

        // Assert
        expect(
          screen.getByRole("heading", { name: /AI Insights/i }),
        ).toBeInTheDocument();
        expect(screen.getByRole("textbox")).toHaveValue("");
        expect(
          screen.getByPlaceholderText(/Ask a question about this dataset/i),
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Ask/i })).toBeDisabled();
      });

      it("renders without error or response states", () => {
        // Act
        render(<AIPanel datasetId="ds_123" />);

        // Assert
        expect(screen.queryByText(/AI request failed/i)).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /Retry/i })).not.toBeInTheDocument();
        expect(screen.queryByText(/Citations/i)).not.toBeInTheDocument();
      });

      it("handles missing datasetId prop", () => {
        // Act
        render(<AIPanel />);

        // Assert
        expect(screen.getByRole("textbox")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Ask/i })).toBeInTheDocument();
      });
    });

    describe("User Interactions", () => {
      it("updates textarea value when user types", async () => {
        // Arrange
        const user = userEvent.setup();
        render(<AIPanel datasetId="ds_123" />);

        // Act
        const textarea = screen.getByRole("textbox");
        await user.type(textarea, "What is the average?");

        // Assert
        expect(textarea).toHaveValue("What is the average?");
      });

      it("enables submit button when prompt has content", async () => {
        // Arrange
        const user = userEvent.setup();
        render(<AIPanel datasetId="ds_123" />);

        // Act
        const textarea = screen.getByRole("textbox");
        await user.type(textarea, "Test query");

        // Assert
        const button = screen.getByRole("button", { name: /Ask/i });
        expect(button).not.toBeDisabled();
      });

      it("disables submit button when prompt is cleared", async () => {
        // Arrange
        const user = userEvent.setup();
        render(<AIPanel datasetId="ds_123" />);
        const textarea = screen.getByRole("textbox");
        await user.type(textarea, "Test");

        // Act
        await user.clear(textarea);

        // Assert
        const button = screen.getByRole("button", { name: /Ask/i });
        expect(button).toBeDisabled();
      });

      it("keeps submit button disabled with only whitespace", async () => {
        // Arrange
        const user = userEvent.setup();
        render(<AIPanel datasetId="ds_123" />);

        // Act
        const textarea = screen.getByRole("textbox");
        await user.type(textarea, "   ");

        // Assert
        const button = screen.getByRole("button", { name: /Ask/i });
        expect(button).toBeDisabled();
      });
    });

    describe("Loading State", () => {
      it("shows 'Asking…' label during submission", async () => {
        // Arrange
        const user = userEvent.setup();
        vi.mocked(AIInfra.submitAIQuery).mockImplementation(
          () => new Promise(() => {}), // Never resolves
        );
        render(<AIPanel datasetId="ds_123" />);

        // Act
        await user.type(screen.getByRole("textbox"), "Test query");
        await user.click(screen.getByRole("button", { name: /Ask/i }));

        // Assert
        await waitFor(() => {
          expect(screen.getByRole("button", { name: /Asking/i })).toBeInTheDocument();
        });
      });

      it("disables submit button during loading", async () => {
        // Arrange
        const user = userEvent.setup();
        vi.mocked(AIInfra.submitAIQuery).mockImplementation(
          () => new Promise(() => {}),
        );
        render(<AIPanel datasetId="ds_123" />);

        // Act
        await user.type(screen.getByRole("textbox"), "Test query");
        await user.click(screen.getByRole("button", { name: /Ask/i }));

        // Assert
        await waitFor(() => {
          const button = screen.getByRole("button", { name: /Asking/i });
          expect(button).toBeDisabled();
        });
      });

      it("disables textarea during loading", async () => {
        // Arrange
        const user = userEvent.setup();
        vi.mocked(AIInfra.submitAIQuery).mockImplementation(
          () => new Promise(() => {}),
        );
        render(<AIPanel datasetId="ds_123" />);

        // Act
        await user.type(screen.getByRole("textbox"), "Test query");
        await user.click(screen.getByRole("button", { name: /Ask/i }));

        // Assert
        await waitFor(() => {
          expect(screen.getByRole("textbox")).toBeDisabled();
        });
      });

      it("calls AIInfra with correct parameters on submit", async () => {
        // Arrange
        const user = userEvent.setup();
        vi.mocked(AIInfra.submitAIQuery).mockResolvedValue({
          ok: true,
          data: { answer: "Response" },
        });
        render(<AIPanel datasetId="ds_456" />);

        // Act
        await user.type(screen.getByRole("textbox"), "Calculate sum");
        await user.click(screen.getByRole("button", { name: /Ask/i }));

        // Assert
        expect(AIInfra.submitAIQuery).toHaveBeenCalledWith({
          datasetId: "ds_456",
          prompt: "Calculate sum",
        });
      });
    });

    describe("Success State", () => {
      it("displays AI response after successful submission", async () => {
        // Arrange
        const user = userEvent.setup();
        vi.mocked(AIInfra.submitAIQuery).mockResolvedValue({
          ok: true,
          data: { answer: "The average is 42" },
        });
        render(<AIPanel datasetId="ds_123" />);

        // Act
        await user.type(screen.getByRole("textbox"), "What is the average?");
        await user.click(screen.getByRole("button", { name: /Ask/i }));

        // Assert
        await waitFor(() => {
          expect(screen.getByText("The average is 42")).toBeInTheDocument();
        });
      });

      it("displays citations when provided", async () => {
        // Arrange
        const user = userEvent.setup();
        vi.mocked(AIInfra.submitAIQuery).mockResolvedValue({
          ok: true,
          data: {
            answer: "Result based on data",
            citations: [
              { title: "Source 1" },
              { title: "Source 2", url: "https://example.com" },
            ],
          },
        });
        render(<AIPanel datasetId="ds_123" />);

        // Act
        await user.type(screen.getByRole("textbox"), "Query");
        await user.click(screen.getByRole("button", { name: /Ask/i }));

        // Assert
        await waitFor(() => {
          expect(screen.getByText("Citations")).toBeInTheDocument();
          expect(screen.getByText("Source 1")).toBeInTheDocument();
          expect(screen.getByText("Source 2")).toBeInTheDocument();
        });
      });

      it("does not display citations when not provided", async () => {
        // Arrange
        const user = userEvent.setup();
        vi.mocked(AIInfra.submitAIQuery).mockResolvedValue({
          ok: true,
          data: { answer: "Simple answer" },
        });
        render(<AIPanel datasetId="ds_123" />);

        // Act
        await user.type(screen.getByRole("textbox"), "Query");
        await user.click(screen.getByRole("button", { name: /Ask/i }));

        // Assert
        await waitFor(() => {
          expect(screen.getByText("Simple answer")).toBeInTheDocument();
        });
        expect(screen.queryByText("Citations")).not.toBeInTheDocument();
      });

      it("allows submitting multiple queries in sequence", async () => {
        // Arrange
        const user = userEvent.setup();
        vi.mocked(AIInfra.submitAIQuery)
          .mockResolvedValueOnce({
            ok: true,
            data: { answer: "First response" },
          })
          .mockResolvedValueOnce({
            ok: true,
            data: { answer: "Second response" },
          });
        render(<AIPanel datasetId="ds_123" />);

        // Act - First query
        await user.type(screen.getByRole("textbox"), "First query");
        await user.click(screen.getByRole("button", { name: /Ask/i }));

        await waitFor(() => {
          expect(screen.getByText("First response")).toBeInTheDocument();
        });

        // Verify form is re-enabled
        expect(screen.getByRole("textbox")).not.toBeDisabled();

        // Act - Second query
        await user.clear(screen.getByRole("textbox"));
        await user.type(screen.getByRole("textbox"), "Second query");
        await user.click(screen.getByRole("button", { name: /Ask/i }));

        // Assert
        await waitFor(() => {
          expect(screen.getByText("Second response")).toBeInTheDocument();
        });
        expect(AIInfra.submitAIQuery).toHaveBeenCalledTimes(2);
      });
    });

    describe("Error State", () => {
      it("displays error message with retry button and re-enables form", async () => {
        // Arrange
        const user = userEvent.setup();
        vi.mocked(AIInfra.submitAIQuery).mockResolvedValue({
          ok: false,
          error: {
            code: "BAD_REQUEST",
            message: "Invalid query format",
          },
        });
        render(<AIPanel datasetId="ds_123" />);

        // Act
        await user.type(screen.getByRole("textbox"), "Bad query");
        await user.click(screen.getByRole("button", { name: /Ask/i }));

        // Assert
        await waitFor(() => {
          expect(screen.getByText("AI request failed")).toBeInTheDocument();
          expect(screen.getByText("Invalid query format")).toBeInTheDocument();
          expect(screen.getByRole("button", { name: /Retry/i })).toBeInTheDocument();
        });

        // Verify form state after error
        expect(screen.getByRole("textbox")).toHaveValue("Bad query");
        expect(screen.getByRole("textbox")).not.toBeDisabled();
      });

      it("retries request when retry button is clicked", async () => {
        // Arrange
        const user = userEvent.setup();
        vi.mocked(AIInfra.submitAIQuery)
          .mockResolvedValueOnce({
            ok: false,
            error: { code: "UNEXPECTED", message: "Error" },
          })
          .mockResolvedValueOnce({
            ok: true,
            data: { answer: "Success on retry" },
          });
        render(<AIPanel datasetId="ds_123" />);

        // Act - First attempt fails
        await user.type(screen.getByRole("textbox"), "Query");
        await user.click(screen.getByRole("button", { name: /Ask/i }));

        await waitFor(() => {
          expect(screen.getByText("AI request failed")).toBeInTheDocument();
        });

        // Act - Retry
        await user.click(screen.getByRole("button", { name: /Retry/i }));

        // Assert
        await waitFor(() => {
          expect(screen.getByText("Success on retry")).toBeInTheDocument();
        });
        expect(screen.queryByText("AI request failed")).not.toBeInTheDocument();
      });
    });

    describe("DatasetId Changes", () => {
      it("preserves prompt when datasetId changes", async () => {
        // Arrange
        const user = userEvent.setup();
        const { rerender } = render(<AIPanel datasetId="ds_123" />);
        await user.type(screen.getByRole("textbox"), "My query");

        // Act
        rerender(<AIPanel datasetId="ds_456" />);

        // Assert
        expect(screen.getByRole("textbox")).toHaveValue("My query");
      });
    });
  });
});
