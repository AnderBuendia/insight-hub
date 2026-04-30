import { describe, expect, it } from "vitest";
import { submitAIQuery } from "./repository";
import type { AIAssistantRequest } from "@/domain";

describe("AI repository", () => {
  it("returns BAD_REQUEST for legacy-shaped requests without context", async () => {
    const result = await submitAIQuery({
      datasetId: "ds_123",
      prompt: "Explain metrics",
    } as unknown as AIAssistantRequest);

    expect(result).toEqual({
      ok: false,
      error: {
        code: "BAD_REQUEST",
        message: "datasetId and prompt are required",
      },
    });
  });

  it("returns BAD_REQUEST for requests without a prompt", async () => {
    const result = await submitAIQuery({
      context: { datasetId: "ds_123" },
    } as unknown as AIAssistantRequest);

    expect(result).toEqual({
      ok: false,
      error: {
        code: "BAD_REQUEST",
        message: "datasetId and prompt are required",
      },
    });
  });
});
