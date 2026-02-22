"use client";

import { FeatureFlags } from "@/shared";
import { AIDisabledState } from "@/features/ai/ui/AIDisabledState";
import { AIPanelShell } from "@/features/ai/ui/AIPanelShell";

export function AIPanel() {
  if (!FeatureFlags.aiEnabled) {
    return (
      <AIPanelShell>
        <AIDisabledState />
      </AIPanelShell>
    );
  }

  // Placeholder for when AI features are enabled
  return (
    <AIPanelShell>
      <p className="text-xs text-gray-600">AI enabled (coming soon)</p>
    </AIPanelShell>
  );
}
