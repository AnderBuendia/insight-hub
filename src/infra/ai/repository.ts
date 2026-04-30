import type {
  AIAssistantRequest,
  AIAssistantResult,
} from "@/domain";
import type { AIGatewayScenario } from "./types";
import { buildMockAIResponse } from "./mock";

let scenario: AIGatewayScenario = "success";

export function setAIGatewayScenario(next: AIGatewayScenario) {
  scenario = next;
}

export async function submitAIQuery(
  req: AIAssistantRequest,
): Promise<AIAssistantResult> {
  await new Promise((r) => setTimeout(r, 250));

  if (!req.context.datasetId || !req.prompt.trim()) {
    return {
      ok: false,
      error: {
        code: "BAD_REQUEST",
        message: "datasetId and prompt are required",
      },
    };
  }

  if (scenario === "error") {
    return {
      ok: false,
      error: {
        code: "UNAVAILABLE",
        message: "AI service unavailable (simulated)",
      },
    };
  }

  return { ok: true, data: buildMockAIResponse(req) };
}
