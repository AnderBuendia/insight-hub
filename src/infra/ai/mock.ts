import type { AIAssistantRequest, AIAssistantResponse } from "@/domain";

export function buildMockAIResponse(
  req: AIAssistantRequest,
): AIAssistantResponse {
  return {
    answer: `Mock AI answer for dataset "${req.context.datasetId}". You asked: "${req.prompt}"`,
    citations: [
      { title: "Mock citation: Dataset documentation" },
      { title: "Mock citation: Metrics glossary" },
    ],
  };
}
