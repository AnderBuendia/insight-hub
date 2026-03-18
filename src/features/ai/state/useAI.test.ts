import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { AIInfra } from "@/infra";
import type { SubmitAIResult } from "@/infra";

// Mock the infra module
vi.mock("@/infra", () => ({
  AIInfra: {
    submitAIQuery: vi.fn(),
  },
}));

// Mock feature flags - default disabled
vi.mock("@/shared", () => ({
  FeatureFlags: { aiEnabled: false },
}));

describe("useAI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe("Feature Flag Disabled", () => {
    describe("Initial State", () => {
      it("returns disabled state", async () => {
        // Arrange
        const { useAI } = await import("./useAI");

        // Act
        const { result } = renderHook(() => useAI("ds_123"));

        // Assert
        expect(result.current.state).toEqual({ status: "disabled" });
      });

      it("returns actions object", async () => {
        // Arrange
        const { useAI } = await import("./useAI");

        // Act
        const { result } = renderHook(() => useAI("ds_123"));

        // Assert
        expect(result.current.actions).toHaveProperty("setPrompt");
        expect(result.current.actions).toHaveProperty("submit");
        expect(result.current.actions).toHaveProperty("retry");
        expect(typeof result.current.actions.setPrompt).toBe("function");
        expect(typeof result.current.actions.submit).toBe("function");
        expect(typeof result.current.actions.retry).toBe("function");
      });

      it("ignores datasetId parameter when disabled", async () => {
        // Arrange
        const { useAI } = await import("./useAI");

        // Act
        const { result } = renderHook(() => useAI("ds_123"));

        // Assert
        expect(result.current.state).toEqual({ status: "disabled" });
      });
    });

    describe("Actions", () => {
      it("setPrompt does nothing when disabled", async () => {
        // Arrange
        const { useAI } = await import("./useAI");
        const { result } = renderHook(() => useAI("ds_123"));

        // Act
        act(() => {
          result.current.actions.setPrompt("test prompt");
        });

        // Assert
        expect(result.current.state).toEqual({ status: "disabled" });
      });

      it("submit does nothing when disabled", async () => {
        // Arrange
        const { useAI } = await import("./useAI");
        const { result } = renderHook(() => useAI("ds_123"));

        // Act
        await act(async () => {
          await result.current.actions.submit();
        });

        // Assert
        expect(result.current.state).toEqual({ status: "disabled" });
        expect(AIInfra.submitAIQuery).not.toHaveBeenCalled();
      });
    });

    describe("State Transitions", () => {
      it("transitions to disabled when feature flag is toggled off", async () => {
        // Arrange - Start with flag enabled
        const enabledFlags = { FeatureFlags: { aiEnabled: true } };
        vi.doMock("@/shared", () => enabledFlags);

        const { useAI: useAIEnabled } = await import("./useAI");
        const { result } = renderHook(
          ({ datasetId }) => useAIEnabled(datasetId),
          { initialProps: { datasetId: "ds_123" } },
        );

        // Verify enabled state
        expect(result.current.state.status).toBe("idle");

        // Act - Toggle flag off and reload
        vi.resetModules();
        vi.doMock("@/shared", () => ({ FeatureFlags: { aiEnabled: false } }));
        const { useAI: useAIDisabled } = await import("./useAI");

        const { result: disabledResult } = renderHook(() => useAIDisabled("ds_123"));

        // Assert
        expect(disabledResult.current.state).toEqual({ status: "disabled" });
      });
    });
  });

  describe("Feature Flag Enabled", () => {
    beforeEach(async () => {
      // Enable feature flag for these tests
      vi.doMock("@/shared", () => ({
        FeatureFlags: { aiEnabled: true },
      }));
    });

    afterEach(() => {
      vi.resetModules();
    });

    describe("Initial State", () => {
      it("returns idle state with empty string datasetId", async () => {
        // Arrange
        const { useAI } = await import("./useAI");

        // Act
        const { result } = renderHook(() => useAI(""));

        // Assert
        expect(result.current.state).toEqual({
          status: "idle",
          datasetId: "",
          prompt: "",
        });
      });

      it("returns idle state with provided datasetId", async () => {
        // Arrange
        const { useAI } = await import("./useAI");

        // Act
        const { result } = renderHook(() => useAI("ds_123"));

        // Assert
        expect(result.current.state).toEqual({
          status: "idle",
          datasetId: "ds_123",
          prompt: "",
        });
      });
    });

    describe("setPrompt Action", () => {
      it("updates prompt in state", async () => {
        // Arrange
        const { useAI } = await import("./useAI");
        const { result } = renderHook(() => useAI("ds_123"));

        // Act
        act(() => {
          result.current.actions.setPrompt("What is the average?");
        });

        // Assert
        expect(result.current.state).toEqual({
          status: "idle",
          datasetId: "ds_123",
          prompt: "What is the average?",
        });
      });

      it("updates prompt multiple times", async () => {
        // Arrange
        const { useAI } = await import("./useAI");
        const { result } = renderHook(() => useAI("ds_123"));

        // Act
        act(() => {
          result.current.actions.setPrompt("First prompt");
        });
        act(() => {
          result.current.actions.setPrompt("Second prompt");
        });
        act(() => {
          result.current.actions.setPrompt("Final prompt");
        });

        // Assert
        expect(result.current.state).toMatchObject({ prompt: "Final prompt" });
      });

      it("handles empty string prompt", async () => {
        // Arrange
        const { useAI } = await import("./useAI");
        const { result } = renderHook(() => useAI("ds_123"));

        act(() => {
          result.current.actions.setPrompt("Some text");
        });

        // Act - Clear prompt
        act(() => {
          result.current.actions.setPrompt("");
        });

        // Assert
        expect(result.current.state).toMatchObject({ prompt: "" });
      });
    });

    describe("submit Action - Success", () => {
      it("transitions to loading then success state", async () => {
        // Arrange
        const { useAI } = await import("./useAI");
        const mockResponse = { answer: "AI response data" };
        vi.mocked(AIInfra.submitAIQuery).mockResolvedValue({
          ok: true,
          data: mockResponse,
        });

        const { result } = renderHook(() => useAI("ds_123"));

        act(() => {
          result.current.actions.setPrompt("Test query");
        });

        // Act
        let submitPromise: Promise<void>;
        act(() => {
          submitPromise = result.current.actions.submit();
        });

        // Assert - Loading state
        expect(result.current.state).toEqual({
          status: "loading",
          datasetId: "ds_123",
          prompt: "Test query",
        });

        // Wait for completion
        await act(async () => {
          await submitPromise;
        });

        // Assert - Success state
        expect(result.current.state).toEqual({
          status: "success",
          datasetId: "ds_123",
          prompt: "Test query",
          response: mockResponse,
        });
      });

      it("calls AIInfra with correct parameters", async () => {
        // Arrange
        const { useAI } = await import("./useAI");
        vi.mocked(AIInfra.submitAIQuery).mockResolvedValue({
          ok: true,
          data: { answer: "response" },
        });

        const { result } = renderHook(() => useAI("ds_456"));

        act(() => {
          result.current.actions.setPrompt("Calculate sum");
        });

        // Act
        await act(async () => {
          await result.current.actions.submit();
        });

        // Assert
        expect(AIInfra.submitAIQuery).toHaveBeenCalledWith({
          datasetId: "ds_456",
          prompt: "Calculate sum",
        });
        expect(AIInfra.submitAIQuery).toHaveBeenCalledTimes(1);
      });

      it("handles rapid setPrompt followed by submit", async () => {
        // Arrange
        const { useAI } = await import("./useAI");
        vi.mocked(AIInfra.submitAIQuery).mockResolvedValue({
          ok: true,
          data: { answer: "response" },
        });

        const { result } = renderHook(() => useAI("ds_123"));

        // Act - Rapid updates then submit
        act(() => {
          result.current.actions.setPrompt("Query 1");
          result.current.actions.setPrompt("Query 2");
          result.current.actions.setPrompt("Final query");
        });

        await act(async () => {
          await result.current.actions.submit();
        });

        // Assert - Should use the latest prompt via ref
        expect(AIInfra.submitAIQuery).toHaveBeenCalledWith({
          datasetId: "ds_123",
          prompt: "Final query",
        });
      });
    });

    describe("submit Action - Error", () => {
      it("transitions to error state on failure", async () => {
        // Arrange
        const { useAI } = await import("./useAI");
        vi.mocked(AIInfra.submitAIQuery).mockResolvedValue({
          ok: false,
          error: {
            message: "API request failed",
            code: "BAD_REQUEST",
          },
        });

        const { result } = renderHook(() => useAI("ds_123"));

        act(() => {
          result.current.actions.setPrompt("Test query");
        });

        // Act
        await act(async () => {
          await result.current.actions.submit();
        });

        // Assert
        expect(result.current.state).toEqual({
          status: "error",
          datasetId: "ds_123",
          prompt: "Test query",
          message: "API request failed",
          code: "BAD_REQUEST",
        });
      });

      it("handles all error with code", async () => {
        // Arrange
        const { useAI } = await import("./useAI");
        vi.mocked(AIInfra.submitAIQuery).mockResolvedValue({
          ok: false,
          error: {
            message: "Network error",
            code: "UNAVAILABLE",
          },
        });

        const { result } = renderHook(() => useAI("ds_789"));

        act(() => {
          result.current.actions.setPrompt("Query");
        });

        // Act
        await act(async () => {
          await result.current.actions.submit();
        });

        // Assert
        expect(result.current.state).toMatchObject({
          status: "error",
          datasetId: "ds_789",
          prompt: "Query",
          message: "Network error",
          code: "UNAVAILABLE",
        });
      });
    });

    describe("DatasetId Changes", () => {
      it("updates datasetId while preserving prompt", async () => {
        // Arrange
        const { useAI } = await import("./useAI");
        const { result, rerender } = renderHook(
          ({ datasetId }) => useAI(datasetId),
          { initialProps: { datasetId: "ds_123" } },
        );

        act(() => {
          result.current.actions.setPrompt("My query");
        });

        // Act - Change datasetId
        rerender({ datasetId: "ds_456" });

        // Assert
        await waitFor(() => {
          expect(result.current.state).toEqual({
            status: "idle",
            datasetId: "ds_456",
            prompt: "My query",
          });
        });
      });

      it("does not update state if datasetId remains the same", async () => {
        // Arrange
        const { useAI } = await import("./useAI");
        const { result, rerender } = renderHook(
          ({ datasetId }) => useAI(datasetId),
          { initialProps: { datasetId: "ds_123" } },
        );

        const initialState = result.current.state;

        // Act - Rerender with same datasetId
        rerender({ datasetId: "ds_123" });

        // Assert - State object should remain the same (referential equality)
        expect(result.current.state).toBe(initialState);
      });

      it("discards stale response when datasetId changes mid-flight", async () => {
        // Arrange
        const { useAI } = await import("./useAI");
        let resolveQuery!: (value: SubmitAIResult) => void;
        vi.mocked(AIInfra.submitAIQuery).mockImplementation(
          () => new Promise<SubmitAIResult>((resolve) => { resolveQuery = resolve; }),
        );

        const { result, rerender } = renderHook(
          ({ datasetId }) => useAI(datasetId),
          { initialProps: { datasetId: "ds_123" } },
        );

        act(() => { result.current.actions.setPrompt("Query"); });
        act(() => { void result.current.actions.submit(); });
        rerender({ datasetId: "ds_456" });

        // Resolve the stale query for ds_123
        await act(async () => {
          resolveQuery({ ok: true, data: { answer: "Stale response" } });
        });

        // Assert - stale response discarded, state reflects new datasetId
        await waitFor(() => {
          expect(result.current.state).toEqual({
            status: "idle",
            datasetId: "ds_456",
            prompt: "Query",
          });
        });
      });

      it("resets to idle when datasetId changes during loading", async () => {
        // Arrange
        const { useAI } = await import("./useAI");
        vi.mocked(AIInfra.submitAIQuery).mockImplementation(
          () => new Promise(() => {}), // Never resolves
        );

        const { result, rerender } = renderHook(
          ({ datasetId }) => useAI(datasetId),
          { initialProps: { datasetId: "ds_123" } },
        );

        act(() => {
          result.current.actions.setPrompt("Query");
        });

        act(() => {
          void result.current.actions.submit();
        });

        // Verify loading state
        expect(result.current.state.status).toBe("loading");

        // Act - Change datasetId while loading
        rerender({ datasetId: "ds_456" });

        // Assert - Should reset to idle with new datasetId
        await waitFor(() => {
          expect(result.current.state).toEqual({
            status: "idle",
            datasetId: "ds_456",
            prompt: "Query",
          });
        });
      });
    });

    describe("Edge Cases", () => {
      it("does not submit when prompt is empty", async () => {
        // Arrange
        const { useAI } = await import("./useAI");

        const { result } = renderHook(() => useAI("ds_123"));

        // Act - Submit without setting prompt
        await act(async () => {
          await result.current.actions.submit();
        });

        // Assert - guard prevents empty submission
        expect(AIInfra.submitAIQuery).not.toHaveBeenCalled();
        expect(result.current.state).toEqual({
          status: "idle",
          datasetId: "ds_123",
          prompt: "",
        });
      });

      it("does not submit when prompt is whitespace only", async () => {
        // Arrange
        const { useAI } = await import("./useAI");
        const { result } = renderHook(() => useAI("ds_123"));

        act(() => {
          result.current.actions.setPrompt("   ");
        });

        // Act
        await act(async () => {
          await result.current.actions.submit();
        });

        // Assert
        expect(AIInfra.submitAIQuery).not.toHaveBeenCalled();
        expect(result.current.state.status).toBe("idle");
      });

      it("handles multiple submits in sequence", async () => {
        // Arrange
        const { useAI } = await import("./useAI");
        vi.mocked(AIInfra.submitAIQuery).mockResolvedValue({
          ok: true,
          data: { answer: "response" },
        });

        const { result } = renderHook(() => useAI("ds_123"));

        // Act - First submit
        act(() => {
          result.current.actions.setPrompt("First query");
        });
        await act(async () => {
          await result.current.actions.submit();
        });

        // Act - Second submit
        act(() => {
          result.current.actions.setPrompt("Second query");
        });
        await act(async () => {
          await result.current.actions.submit();
        });

        // Assert
        expect(AIInfra.submitAIQuery).toHaveBeenCalledTimes(2);
        expect(AIInfra.submitAIQuery).toHaveBeenNthCalledWith(1, {
          datasetId: "ds_123",
          prompt: "First query",
        });
        expect(AIInfra.submitAIQuery).toHaveBeenNthCalledWith(2, {
          datasetId: "ds_123",
          prompt: "Second query",
        });
      });

      it("maintains state consistency after error and recovery", async () => {
        // Arrange
        const { useAI } = await import("./useAI");
        vi.mocked(AIInfra.submitAIQuery)
          .mockResolvedValueOnce({
            ok: false,
            error: { message: "Error", code: "UNEXPECTED" },
          })
          .mockResolvedValueOnce({
            ok: true,
            data: { answer: "success" },
          });

        const { result } = renderHook(() => useAI("ds_123"));

        // Act - First submit fails
        act(() => {
          result.current.actions.setPrompt("Query");
        });
        await act(async () => {
          await result.current.actions.submit();
        });

        expect(result.current.state.status).toBe("error");

        // Act - Second submit succeeds
        await act(async () => {
          await result.current.actions.submit();
        });

        // Assert
        expect(result.current.state).toEqual({
          status: "success",
          datasetId: "ds_123",
          prompt: "Query",
          response: { answer: "success" },
        });
      });
    });
  });

  describe("retry Action", () => {
    beforeEach(async () => {
      vi.doMock("@/shared", () => ({
        FeatureFlags: { aiEnabled: true },
      }));
    });

    afterEach(() => {
      vi.resetModules();
    });

    it("retry is the same function reference as submit", async () => {
      // Arrange
      const { useAI } = await import("./useAI");
      const { result } = renderHook(() => useAI("ds_123"));

      // Assert
      expect(result.current.actions.retry).toBe(result.current.actions.submit);
    });

    it("retry re-submits the same prompt from error state", async () => {
      // Arrange
      const { useAI } = await import("./useAI");
      vi.mocked(AIInfra.submitAIQuery)
        .mockResolvedValueOnce({
          ok: false,
          error: { message: "Temporary error", code: "UNEXPECTED" },
        })
        .mockResolvedValueOnce({
          ok: true,
          data: { answer: "Recovered" },
        });

      const { result } = renderHook(() => useAI("ds_123"));

      act(() => { result.current.actions.setPrompt("Query"); });
      await act(async () => { await result.current.actions.submit(); });

      expect(result.current.state.status).toBe("error");

      // Act
      await act(async () => { await result.current.actions.retry(); });

      // Assert
      expect(result.current.state).toEqual({
        status: "success",
        datasetId: "ds_123",
        prompt: "Query",
        response: { answer: "Recovered" },
      });
      expect(AIInfra.submitAIQuery).toHaveBeenCalledTimes(2);
      expect(AIInfra.submitAIQuery).toHaveBeenNthCalledWith(2, {
        datasetId: "ds_123",
        prompt: "Query",
      });
    });
  });
});
