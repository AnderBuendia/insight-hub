# PR — IHSQD-50: Export analysis state as JSON

## Summary

Adds the ability to download the current analysis state (filters, metrics, insights) as a formatted JSON file directly from the Analysis page. Also extracts a reusable `useTemporaryFlag` hook to share the transient-feedback pattern across features.

**JIRA Ticket**: https://contactoanderbuendia.atlassian.net/browse/IHSQD-50

## Context

Users needed a way to export and share analysis results outside the app. The export includes all the data that defines a given analysis snapshot: the dataset ID, active filters, computed metrics, and derived insights.

While implementing the export feedback state (`exported: boolean` that resets after 2 s), it became clear the identical pattern was already used in `useCopyToClipboard`. Both cases were extracted into a single shared primitive to avoid duplication.

## Changes

- **`src/shared/hooks/useTemporaryFlag.ts`** — new generic hook: a boolean flag that sets itself to `true` on `trigger()` and resets to `false` after `resetMs` ms (default 2000). Timer is cancelled on unmount via `useEffect` cleanup.
- **`src/shared/hooks/useTemporaryFlag.test.ts`** — 5 unit tests covering initial state, activation, reset timing (exact boundary), and custom `resetMs`.
- **`src/shared/index.ts`** — re-exports `useTemporaryFlag`.
- **`src/features/analysis/state/useCopyToClipboard.ts`** — refactored to delegate timer logic to `useTemporaryFlag`. Public API unchanged.
- **`src/features/analysis/state/exportAnalysis.ts`** — defines `AnalysisExportPayload` type and `serializeAnalysisExport` (formats payload as indented JSON).
- **`src/features/analysis/state/exportAnalysis.test.ts`** — 2 unit tests for serialization.
- **`src/features/analysis/state/useExportAnalysis.ts`** — hook that builds the payload from `AnalysisState`, triggers a Blob download, and surfaces `exported` feedback via `useTemporaryFlag`.
- **`src/features/analysis/ui/ExportAnalysisButton.tsx`** — presentational button with inline status text ("Download the current analysis as JSON" / "JSON exported"), matching the `ShareAnalysisButton` layout.
- **`src/features/analysis/ui/AnalysisSuccess.tsx`** — receives `exportActions: { onExport, exported }` and renders `ExportAnalysisButton`.
- **`src/features/analysis/page/AnalysisPage.tsx`** — wires `useExportAnalysis` and passes `exportActions` down.
- **`src/features/analysis/ui/AnalysisSuccess.test.tsx`** — test helper updated to accept and default `exportActions`.

## Decisions

- **`buildAnalysisExportPayload` removed** — the original implementation was a pure identity function `(x) => x` with no validation or transformation logic. The type `AnalysisExportPayload` is sufficient; constructing the object inline in the hook is clearer.
- **`useTemporaryFlag` placed in `src/shared/hooks/`** — mirrors the existing `src/shared/ui/` convention. Keeps the root of `shared/` clean as the number of shared hooks grows.
- **Export guarded by `status === "success"`** — prevents triggering a download when the analysis is in a loading or error state.
- **`setTimeout` with cleanup** — the only risk-free way to auto-reset a boolean flag in React without a third-party library. The `useEffect` cleanup cancels the timer on unmount, avoiding setState on an unmounted component.

## Impact

- **UI** — new Export JSON button visible on the Analysis page next to the Share button.
- **Shared layer** — `useTemporaryFlag` is now available to any future feature via `@/shared`.
- **No domain changes** — `AnalysisExportPayload` mirrors existing domain types; no new domain rules introduced.
- **No routing or data-fetching changes.**

## Risks / Considerations

- The download relies on `URL.createObjectURL` + a synthetic `<a>` click — standard approach, works in all modern browsers, no known issues.
- `useTemporaryFlag` uses `window.setTimeout`, which is unavailable in SSR. Both call sites (`useCopyToClipboard`, `useExportAnalysis`) are already inside `"use client"` components so this is safe.

## Checklist

- [x] Code is easy to understand
- [x] Domain rules are respected
- [x] No unnecessary coupling introduced
- [x] Docs updated (if needed)
