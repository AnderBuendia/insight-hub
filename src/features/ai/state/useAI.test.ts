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
        expect(result.current.actions).toHaveProperty("clear");
        expect(typeof result.current.actions.setPrompt).toBe("function");
        expect(typeof result.current.actions.submit).toBe("function");
        expect(typeof result.current.actions.retry).toBe("function");
        expect(typeof result.current.actions.clear).toBe("function");
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
          history: [],
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
          history: [],
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
          history: [],
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
          history: [],
        });

        // Wait for completion
        await act(async () => {
          await submitPromise;
        });

        // Assert - Success state: prompt cleared, response moved into history
        expect(result.current.state).toEqual({
          status: "success",
          datasetId: "ds_123",
          prompt: "",
          history: [{ prompt: "Test query", response: mockResponse }],
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
          history: [],
          message: "API request failed",
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
            history: [],
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
            history: [],
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
            history: [],
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
          history: [],
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
          prompt: "",
          history: [{ prompt: "Query", response: { answer: "success" } }],
        });
      });
    });
  });

  describe("Feature Flag Runtime Toggle", () => {
    afterEach(() => {
      vi.resetModules();
    });

    it("transitions from idle to disabled when flag is toggled off mid-session", async () => {
      // Arrange - start enabled with a mutable flag object
      const flags = { aiEnabled: true };
      vi.doMock("@/shared", () => ({ FeatureFlags: flags }));
      const { useAI } = await import("./useAI");

      const { result, rerender } = renderHook(
        ({ datasetId }) => useAI(datasetId),
        { initialProps: { datasetId: "ds_123" } },
      );

      expect(result.current.state.status).toBe("idle");

      // Act - toggle flag off and force re-render so the hook re-reads FeatureFlags
      flags.aiEnabled = false;
      rerender({ datasetId: "ds_123" });

      // Assert - useEffect fires with enabled=false and prev.status="idle" (not "disabled"),
      // taking the else path (L18) and transitioning state to disabled (L19-20)
      await waitFor(() => {
        expect(result.current.state).toEqual({ status: "disabled" });
      });
    });

    it("transitions from disabled to idle when flag is re-enabled", async () => {
      // Arrange - start disabled with a mutable flag object
      const flags = { aiEnabled: false };
      vi.doMock("@/shared", () => ({ FeatureFlags: flags }));
      const { useAI } = await import("./useAI");

      const { result, rerender } = renderHook(
        ({ datasetId }) => useAI(datasetId),
        { initialProps: { datasetId: "ds_123" } },
      );

      expect(result.current.state).toEqual({ status: "disabled" });

      // Act - toggle flag on and force re-render
      flags.aiEnabled = true;
      rerender({ datasetId: "ds_123" });

      // Assert - useEffect fires with enabled=true and prev.status="disabled",
      // taking the if path (L23-25) and transitioning state to idle
      await waitFor(() => {
        expect(result.current.state).toEqual({
          status: "idle",
          datasetId: "ds_123",
          prompt: "",
          history: [],
        });
      });
    });

    it("discards in-flight API response when flag is disabled mid-request", async () => {
      // Arrange - start enabled with a mutable flag object
      const flags = { aiEnabled: true };
      vi.doMock("@/shared", () => ({ FeatureFlags: flags }));
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

      expect(result.current.state.status).toBe("loading");

      // Act - disable flag while the API request is still in-flight
      flags.aiEnabled = false;
      rerender({ datasetId: "ds_123" });

      // useEffect transitions state to "disabled" (else path L18, statements L19-20)
      await waitFor(() => {
        expect(result.current.state.status).toBe("disabled");
      });

      // Resolve the stale API call after state is already disabled
      await act(async () => {
        resolveQuery({ ok: true, data: { answer: "Stale response" } });
      });

      // Assert - the final setState in submit (L71) finds prev.status="disabled"
      // and discards the response, keeping state as disabled
      expect(result.current.state).toEqual({ status: "disabled" });
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

  });

  describe("History Behavior", () => {
    beforeEach(async () => {
      vi.doMock("@/shared", () => ({
        FeatureFlags: { aiEnabled: true },
      }));
    });

    afterEach(() => {
      vi.resetModules();
    });

    it("clears prompt after successful submit", async () => {
      // Arrange
      const { useAI } = await import("./useAI");
      vi.mocked(AIInfra.submitAIQuery).mockResolvedValue({
        ok: true,
        data: { answer: "response" },
      });
      const { result } = renderHook(() => useAI("ds_123"));

      act(() => { result.current.actions.setPrompt("My question"); });

      // Act
      await act(async () => { await result.current.actions.submit(); });

      // Assert
      expect(result.current.state).toMatchObject({ status: "success", prompt: "" });
    });

    it("accumulates responses in history", async () => {
      // Arrange
      const { useAI } = await import("./useAI");
      vi.mocked(AIInfra.submitAIQuery)
        .mockResolvedValueOnce({ ok: true, data: { answer: "Answer 1" } })
        .mockResolvedValueOnce({ ok: true, data: { answer: "Answer 2" } });
      const { result } = renderHook(() => useAI("ds_123"));

      // Act
      act(() => { result.current.actions.setPrompt("Question 1"); });
      await act(async () => { await result.current.actions.submit(); });
      act(() => { result.current.actions.setPrompt("Question 2"); });
      await act(async () => { await result.current.actions.submit(); });

      // Assert
      expect(result.current.state).toMatchObject({
        status: "success",
        history: [
          { prompt: "Question 1", response: { answer: "Answer 1" } },
          { prompt: "Question 2", response: { answer: "Answer 2" } },
        ],
      });
    });

    it("caps history at 3 items", async () => {
      // Arrange
      const { useAI } = await import("./useAI");
      vi.mocked(AIInfra.submitAIQuery).mockResolvedValue({
        ok: true,
        data: { answer: "response" },
      });
      const { result } = renderHook(() => useAI("ds_123"));

      // Act - submit 4 times
      for (let i = 1; i <= 4; i++) {
        act(() => { result.current.actions.setPrompt(`Question ${i}`); });
        await act(async () => { await result.current.actions.submit(); });
      }

      // Assert - only last 3 items kept
      expect(result.current.state).toMatchObject({ status: "success" });
      if (result.current.state.status === "success") {
        expect(result.current.state.history).toHaveLength(3);
        expect(result.current.state.history[0].prompt).toBe("Question 2");
        expect(result.current.state.history[2].prompt).toBe("Question 4");
      }
    });

    it("preserves history on error", async () => {
      // Arrange
      const { useAI } = await import("./useAI");
      vi.mocked(AIInfra.submitAIQuery)
        .mockResolvedValueOnce({ ok: true, data: { answer: "OK" } })
        .mockResolvedValueOnce({ ok: false, error: { code: "UNEXPECTED", message: "Oops" } });
      const { result } = renderHook(() => useAI("ds_123"));

      act(() => { result.current.actions.setPrompt("Good question"); });
      await act(async () => { await result.current.actions.submit(); });
      act(() => { result.current.actions.setPrompt("Bad question"); });
      await act(async () => { await result.current.actions.submit(); });

      // Assert - history from previous success is preserved on error
      expect(result.current.state).toMatchObject({
        status: "error",
        history: [{ prompt: "Good question", response: { answer: "OK" } }],
      });
    });
  });

  describe("clear Action", () => {
    beforeEach(async () => {
      vi.doMock("@/shared", () => ({
        FeatureFlags: { aiEnabled: true },
      }));
    });

    afterEach(() => {
      vi.resetModules();
    });

    it("resets to idle with empty prompt and history", async () => {
      // Arrange
      const { useAI } = await import("./useAI");
      vi.mocked(AIInfra.submitAIQuery).mockResolvedValue({
        ok: true,
        data: { answer: "response" },
      });
      const { result } = renderHook(() => useAI("ds_123"));

      act(() => { result.current.actions.setPrompt("My question"); });
      await act(async () => { await result.current.actions.submit(); });
      expect(result.current.state).toMatchObject({ status: "success" });

      // Act
      act(() => { result.current.actions.clear(); });

      // Assert
      expect(result.current.state).toEqual({
        status: "idle",
        datasetId: "ds_123",
        prompt: "",
        history: [],
      });
    });

    it("does nothing when disabled", async () => {
      // Arrange - reset modules so the new doMock takes effect
      vi.resetModules();
      vi.doMock("@/shared", () => ({ FeatureFlags: { aiEnabled: false } }));
      const { useAI: useAIDisabled } = await import("./useAI");
      const { result } = renderHook(() => useAIDisabled("ds_123"));

      expect(result.current.state).toEqual({ status: "disabled" });

      // Act
      act(() => { result.current.actions.clear(); });

      // Assert
      expect(result.current.state).toEqual({ status: "disabled" });
    });
  });
});
