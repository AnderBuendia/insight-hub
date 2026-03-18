import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AIInfra } from "@/infra";
import { FeatureFlags } from "@/shared";
import type { AIState } from "./types";

export function useAI(datasetId = "") {
  const enabled = FeatureFlags.aiEnabled;

  // Initialize state based on enabled flag
  const initialState = useMemo<AIState>(() => {
    if (!enabled) return { status: "disabled" };
    return { status: "idle", datasetId, prompt: "" };
  }, [enabled, datasetId]);

  const [state, setState] = useState<AIState>(initialState);

  // Keep ref in sync for submit to avoid stale state in rapid user interactions
  const promptRef = useRef("");

  // Sync state when datasetId or enabled changes
  useEffect(() => {
    setState((prev) => {
      if (!enabled) {
        if (prev.status === "disabled") return prev;
        return { status: "disabled" };
      }

      if (prev.status === "disabled") {
        promptRef.current = "";
        return { status: "idle", datasetId, prompt: "" };
      }

      if (prev.datasetId === datasetId) return prev;

      // Preserve prompt across dataset switches
      return { status: "idle", datasetId, prompt: prev.prompt };
    });
  }, [enabled, datasetId]);

  const setPrompt = useCallback(
    (prompt: string) => {
      if (!enabled) return;

      // Update ref synchronously to prevent stale state on rapid submit
      promptRef.current = prompt;

      setState((prev) => {
        if (prev.status === "disabled") return prev;
        return { ...prev, prompt };
      });
    },
    [enabled],
  );

  const submit = useCallback(async () => {
    if (!enabled) return;

    // Read from ref to get the latest value even if setState is pending
    const prompt = promptRef.current;

    setState((prev) => {
      if (prev.status === "disabled") return prev;
      return { status: "loading", datasetId: prev.datasetId, prompt: prev.prompt };
    });

    const result = await AIInfra.submitAIQuery({ datasetId, prompt });

    if (!result.ok) {
      setState({
        status: "error",
        datasetId,
        prompt,
        message: result.error.message,
        code: result.error.code,
      });
      return;
    }

    setState({ status: "success", datasetId, prompt, response: result.data });
  }, [enabled, datasetId]);

  return {
    state,
    actions: { setPrompt, submit },
  };
}
