import type { AIAssistantResponse } from "@/domain";

type AIHistoryItem = {
  prompt: string;
  response: AIAssistantResponse;
};

export type AIState =
  | { status: "disabled" }
  | {
      status: "idle";
      datasetId: string;
      prompt: string;
      history: AIHistoryItem[];
    }
  | {
      status: "loading";
      datasetId: string;
      prompt: string;
      history: AIHistoryItem[];
    }
  | {
      status: "success";
      datasetId: string;
      prompt: string;
      history: AIHistoryItem[];
    }
  | {
      status: "error";
      datasetId: string;
      prompt: string;
      history: AIHistoryItem[];
      message: string;
    };
