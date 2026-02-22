export const FeatureFlags = {
  aiEnabled: process.env.NEXT_PUBLIC_FEATURE_AI === "true",
} as const;
