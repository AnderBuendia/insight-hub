"use client";

import { FeatureFlags } from "@/shared";
import { AIDisabledState } from "@/features/ai/ui/AIDisabledState";
import { AIPanelShell } from "@/features/ai/ui/AIPanelShell";
import { useAI } from "@/features/ai/state/useAI";
import { AIForm } from "@/features/ai/ui/AIForm";
import { AIResponse } from "@/features/ai/ui/AIResponse";
import { AIErrorState } from "@/features/ai/ui/AIErrorState";

export function AIPanel({ datasetId = "" }: { datasetId?: string }) {
  const { state, actions } = useAI(datasetId);

  if (!FeatureFlags.aiEnabled) {
    return (
      <AIPanelShell>
        <AIDisabledState />
      </AIPanelShell>
    );
  }

  if (state.status === "disabled") {
    return (
      <AIPanelShell>
        <AIDisabledState />
      </AIPanelShell>
    );
  }

  return (
    <AIPanelShell>
      <AIForm
        prompt={state.prompt}
        onPromptChange={actions.setPrompt}
        onSubmit={actions.submit}
        disabled={state.status === "loading"}
        submitLabel={state.status === "loading" ? "Asking…" : "Ask"}
      />

      {state.status === "error" && (
        <AIErrorState message={state.message} onRetry={actions.submit} />
      )}

      {state.status === "success" && <AIResponse response={state.response} />}
    </AIPanelShell>
  );
}
