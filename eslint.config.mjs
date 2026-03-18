import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Test and coverage directories:
    "coverage/**",
    "dist/**",
    ".vitest/**",
    // Build artifacts:
    "next-tmp/**",
  ]),
  {
    rules: {
      // Code Quality & Best Practices
      "no-console": "warn", // Warn on console.log statements
      "no-debugger": "error", // Disallow debugger statements in production
      "prefer-const": "error", // Prefer const over let when variable is never reassigned
      "no-var": "error", // Disallow var, enforce let/const
      "eqeqeq": ["error", "always"], // Require === and !== instead of == and !=

      // Formatting & Style
      "no-trailing-spaces": "error", // Disallow trailing whitespace at the end of lines
      "eol-last": ["error", "always"], // Require newline at end of file
      "comma-dangle": ["error", "always-multiline"], // Require trailing commas in multiline
      "max-len": [
        "error",
        {
          "code": 170, // Maximum line length of 170 characters
          "ignoreUrls": true, // Ignore lines containing URLs
          "ignoreStrings": true, // Ignore lines containing strings
          "ignoreTemplateLiterals": true, // Ignore template literals
          "ignoreRegExpLiterals": true, // Ignore RegExp literals
          "ignoreComments": false, // Enforce max-len on comments
        },
      ],
      "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0, "maxBOF": 0 }],
      "semi": ["error", "always"], // Require semicolons
      "quotes": ["error", "double", { "avoidEscape": true }], // Enforce double quotes

      // TypeScript Specific
      "@typescript-eslint/no-unused-vars": [
        "error", // Upgrade from warning to error
        {
          "argsIgnorePattern": "^_", // Allow unused args that start with _
          "varsIgnorePattern": "^_", // Allow unused vars that start with _
          "caughtErrorsIgnorePattern": "^_", // Allow unused caught errors that start with _
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn", // Warn when using 'any' type
      "@typescript-eslint/explicit-function-return-type": "off", // Allow TypeScript to infer return types
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          "prefer": "type-imports", // Prefer 'import type' for type-only imports
          "fixStyle": "inline-type-imports",
        },
      ],

      // React Best Practices
      "react/self-closing-comp": "error", // Require self-closing for components without children
      "react/jsx-boolean-value": ["error", "never"], // Omit boolean prop value when true
      "react-hooks/exhaustive-deps": "warn", // Warn about missing dependencies in hooks
    },
  },
]);

export default eslintConfig;
