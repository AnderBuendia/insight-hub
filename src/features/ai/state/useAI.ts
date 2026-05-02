import { useCallback, useEffect, useRef, useState } from "react";
import { AIInfra } from "@/infra";
import { FeatureFlags } from "@/shared";
import type { AIAssistantContext } from "@/domain";
import type { AIState } from "./types";

function toAssistantContext(context: string | AIAssistantContext): AIAssistantContext {
  if (typeof context === "string") {
    return { datasetId: context };
  }

  return context;
}

function getAssistantContextKey(context: AIAssistantContext) {
  return JSON.stringify({
    datasetId: context.datasetId,
    filters: context.filters ?? null,
    metrics: context.metrics ?? null,
  });
}

export function useAI(context: string | AIAssistantContext) {
  const enabled = FeatureFlags.aiEnabled;
  const assistantContext = toAssistantContext(context);
  const assistantContextKey = getAssistantContextKey(assistantContext);
  const { datasetId } = assistantContext;
  const promptRef = useRef("");
  const contextKeyRef = useRef(assistantContextKey);
  // eslint-disable-next-line react-hooks/refs -- stale response guards must observe context changes before effects run.
  contextKeyRef.current = assistantContextKey;

  const [state, setState] = useState<AIState>(() => {
    if (!FeatureFlags.aiEnabled) return { status: "disabled" };
    return { status: "idle", datasetId, prompt: "", history: [] };
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
        return { status: "idle", datasetId, prompt: "", history: [] };
      }

      return { status: "idle", datasetId, prompt: prev.prompt, history: [] };
    });
  }, [enabled, datasetId, assistantContextKey]);

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
    const requestContext = assistantContext;
    const requestContextKey = assistantContextKey;

    setState((prev) => {
      if (prev.status === "disabled") return prev;
      return {
        status: "loading",
        datasetId: requestDatasetId,
        prompt,
        history: prev.history,
      };
    });

    const result = await AIInfra.submitAIQuery({
      prompt,
      context: requestContext,
    });

    if (contextKeyRef.current !== requestContextKey) {
      return;
    }

    if (!result.ok) {
      setState((prev) => {
        if (prev.status === "disabled") return prev;
        if (prev.datasetId !== requestDatasetId) return prev;
        if (prev.status !== "loading") return prev;
        return {
          status: "error",
          datasetId: requestDatasetId,
          prompt,
          history: prev.history,
          message: result.error.message,
        };
      });
      return;
    }

    promptRef.current = "";

    setState((prev) => {
      if (prev.status === "disabled") return prev;
      if (prev.datasetId !== requestDatasetId) {
        promptRef.current = prompt;
        return prev;
      }
      if (prev.status !== "loading") return prev;

      const newItem = { prompt, response: result.data };
      const nextHistory = [...prev.history, newItem].slice(-3);

      return {
        status: "success",
        datasetId: requestDatasetId,
        prompt: "",
        history: nextHistory,
      };
    });
  }, [enabled, datasetId, assistantContext, assistantContextKey]);

  const clear = useCallback(() => {
    if (!enabled) return;

    promptRef.current = "";

    setState({
      status: "idle",
      datasetId,
      prompt: "",
      history: [],
    });
  }, [enabled, datasetId]);

  return {
    state,
    actions: { setPrompt, submit, retry: submit, clear },
  };
}
