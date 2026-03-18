import type { InfraAIRequest, InfraAIResponse } from "./types";

export function buildMockAIResponse(req: InfraAIRequest): InfraAIResponse {
  // Minimal deterministic mock: echo prompt + dataset context
  return {
    answer: `Mock AI answer for dataset "${req.datasetId}". You asked: "${req.prompt}"`,
    citations: [
      { title: "Mock citation: Dataset documentation" },
      { title: "Mock citation: Metrics glossary" },
    ],
  };
}
