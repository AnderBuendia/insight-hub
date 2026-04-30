import type { AnalysisFilters, Metric } from "@/domain/analysis";

export type AIAssistantContext = {
  datasetId: string;
  filters?: AnalysisFilters;
  metrics?: Metric[];
};

export type AIAssistantCitation = {
  title: string;
  url?: string;
};

export type AIAssistantRequest = {
  prompt: string;
  context: AIAssistantContext;
};

export type AIAssistantResponse = {
  answer: string;
  citations?: AIAssistantCitation[];
  suggestions?: string[];
};

export type AIAssistantError = {
  code?: "UNAVAILABLE" | "BAD_REQUEST" | "UNEXPECTED";
  message: string;
};

export type AIAssistantResult =
  | { ok: true; data: AIAssistantResponse }
  | { ok: false; error: AIAssistantError };
