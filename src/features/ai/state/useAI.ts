import { useCallback, useEffect, useRef, useState } from "react";
import { AIInfra } from "@/infra";
import { FeatureFlags } from "@/shared";
import type { AIState } from "./types";

export function useAI(datasetId: string) {
  const enabled = FeatureFlags.aiEnabled;
  const promptRef = useRef("");

  const [state, setState] = useState<AIState>(() => {
    if (!FeatureFlags.aiEnabled) return { status: "disabled" };
    return { status: "idle", datasetId, prompt: "" };
  });

  useEffect(() => {
    setState((prev) => {
      if (!enabled) {
        if (prev.status === "disabled") return prev;
        promptRef.current = "";
        return { status: "disabled" };
      }

      if (prev.status === "disabled") {
        promptRef.current = "";
        return { status: "idle", datasetId, prompt: "" };
      }

      if (prev.datasetId === datasetId) return prev;

      return { status: "idle", datasetId, prompt: prev.prompt };
    });
  }, [enabled, datasetId]);

  const setPrompt = useCallback(
    (prompt: string) => {
      if (!enabled) return;

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

    const prompt = promptRef.current.trim();
    if (!prompt) return;

    const requestDatasetId = datasetId;

    setState((prev) => {
      if (prev.status === "disabled") return prev;
      return {
        status: "loading",
        datasetId: requestDatasetId,
        prompt,
      };
    });

    const result = await AIInfra.submitAIQuery({
      datasetId: requestDatasetId,
      prompt,
    });

    setState((prev) => {
      if (prev.status === "disabled") return prev;
      if (prev.datasetId !== requestDatasetId) return prev;

      if (!result.ok) {
        return {
          status: "error",
          datasetId: requestDatasetId,
          prompt,
          message: result.error.message,
          code: result.error.code,
        };
      }

      return {
        status: "success",
        datasetId: requestDatasetId,
        prompt,
        response: result.data,
      };
    });
  }, [enabled, datasetId]);

  return {
    state,
    actions: { setPrompt, submit, retry: submit },
  };
}
