import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "**/*.config.*",
        "**/*.setup.*",
        "**/node_modules/**",
        "**/__tests__/**",
        "**/dist/**",
        "**/.next/**",
        "src/infra/**",
      ],
      // Note: Thresholds are enforced by scripts/test-coverage.js
      // Vitest 4.x reports but doesn't fail on threshold violations by default
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
