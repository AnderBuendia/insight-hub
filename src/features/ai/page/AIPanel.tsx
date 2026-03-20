"use client";

import { AIDisabledState } from "@/features/ai/ui/AIDisabledState";
import { AIPanelShell } from "@/features/ai/ui/AIPanelShell";
import { useAI } from "@/features/ai/state/useAI";
import { AIForm } from "@/features/ai/ui/AIForm";
import { AIResponse } from "@/features/ai/ui/AIResponse";
import { AIErrorState } from "@/features/ai/ui/AIErrorState";

export function AIPanel({ datasetId = "" }: { datasetId?: string }) {
  const { state, actions } = useAI(datasetId);

  if (state.status === "disabled") {
    return (
      <AIPanelShell>
        <AIDisabledState />
      </AIPanelShell>
    );
  }

  const hasHistory = state.history.length > 0;
  const isLoading = state.status === "loading";
  const isError = state.status === "error";

  return (
    <AIPanelShell>
      {hasHistory ? (
        <div className="space-y-3">
          {state.history.map((item, index) => (
            <div key={`${item.prompt}-${index}`} className="space-y-2">
              <div className="rounded-xl border border-gray-200 bg-white p-3">
                <p className="text-xs font-medium text-gray-500">You</p>
                <p className="mt-1 text-sm text-gray-900">{item.prompt}</p>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-gray-500">AI</p>
                <AIResponse response={item.response} />
              </div>
            </div>
          ))}

          {isLoading ? (
            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <p className="text-xs font-medium text-gray-500">AI</p>
              <p className="mt-1 text-sm text-gray-400 italic">Thinking…</p>
            </div>
          ) : null}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={actions.clear}
              className="text-xs text-gray-500 underline underline-offset-2 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-900">
            Ask a question about this dataset
          </p>
          <p className="mt-1 text-xs text-gray-600">Try something like:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-gray-600">
            <li>What metric changed the most?</li>
            <li>Which segment has the highest revenue?</li>
            <li>What filters should I apply first?</li>
          </ul>
        </div>
      )}

      {isError ? (
        <AIErrorState message={state.message} onRetry={actions.retry} />
      ) : null}

      <AIForm
        prompt={state.prompt}
        onPromptChange={actions.setPrompt}
        onSubmit={actions.submit}
        disabled={isLoading}
        submitLabel={isLoading ? "Asking…" : "Ask"}
      />
    </AIPanelShell>
  );
}
