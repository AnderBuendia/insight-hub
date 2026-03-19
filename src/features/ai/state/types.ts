import type { InfraAIResponse } from "@/infra";

export type AIState =
  | { status: "disabled" }
  | { status: "idle"; datasetId: string; prompt: string }
  | { status: "loading"; datasetId: string; prompt: string }
  | {
      status: "success";
      datasetId: string;
      prompt: string;
      response: InfraAIResponse;
    }
  | {
      status: "error";
      datasetId: string;
      prompt: string;
      message: string;
      code?: string;
    };
