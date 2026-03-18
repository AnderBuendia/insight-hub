export type InfraAIRequest = {
  datasetId: string;
  prompt: string;
};

export type InfraAIResponse = {
  answer: string;
  citations?: Array<{ title: string; url?: string }>;
};

export type AIGatewayScenario = "success" | "error";

export type SubmitAIResult =
  | { ok: true; data: InfraAIResponse }
  | {
      ok: false;
      error: {
        code: "UNAVAILABLE" | "BAD_REQUEST" | "UNEXPECTED";
        message: string;
      };
    };
