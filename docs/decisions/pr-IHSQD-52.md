# PR — IHSQD-52: Export analysis metrics as CSV file

## Summary

Adds a CSV export action to the Analysis page that lets users download the
current metrics table as a `.csv` file. Also reorganizes the export layer
introduced in IHSQD-50 into dedicated `state/export/` and `ui/export/`
subdirectories, and extracts the repeated Blob-download logic into a shared
`downloadFile` utility.

**JIRA Ticket**: https://contactoanderbuendia.atlassian.net/browse/IHSQD-52

---

## Context

The JSON export (IHSQD-50) laid the groundwork but left several structural
issues:

- Export state and UI modules lived at the root level of `state/` and `ui/`
  alongside unrelated files, making the export concern harder to navigate.
- `exportAnalysis.ts` did not convey the output format in its name, while
  the adjacent `exportMetricsCsv.ts` (introduced in this ticket) does. Both
  names needed to be consistent.
- The Blob + `URL.createObjectURL` + synthetic `<a>.click()` sequence was
  copied verbatim in `useExportAnalysis`. A second copy in `useExportMetricsCsv`
  would have introduced identical duplication.

---

## Changes

### Commit 1 — `refactor(analysis): reorganize export modules into state/export/ and ui/export/ subdirectories`

Moves all export-related modules under a dedicated `export/` subdirectory
inside each feature layer. Renames `exportAnalysis.ts` → `exportAnalysisJson.ts`
and `serializeAnalysisExport` → `serializeAnalysisToJson` for consistency with
the new `exportMetricsCsv.ts` naming.

- `state/export/exportAnalysisJson.ts` (was `state/exportAnalysis.ts`)
- `state/export/exportAnalysisJson.test.ts`
- `state/export/useExportAnalysis.ts` (was `state/useExportAnalysis.ts`)
- `ui/export/ExportAnalysisButton.tsx` (was `ui/ExportAnalysisButton.tsx`)

No logic changes. Import paths updated in `AnalysisPage` and `AnalysisSuccess`.

### Commit 2 — `feat(shared): add downloadFile browser download utility`

Extracts the repeated Blob download pattern into a single pure helper:

```ts
downloadFile(content: string, filename: string, mimeType: string): void
```

Creates a `Blob`, generates an object URL, attaches it to a temporary `<a>`,
clicks it, then revokes the URL. Has no React dependency and requires no
cleanup. Exported from `src/shared/index.ts`.

- `src/shared/utils/downloadFile.ts` — new file
- `src/shared/index.ts` — re-exports `downloadFile`

### Commit 3 — `feat(analysis): export analysis metrics as CSV file`

Adds the full CSV export feature end to end, mirroring the existing JSON export.

**New state modules:**
- `state/export/exportMetricsCsv.ts` — pure serializer: header row + one data
  row per metric (`name`, `value`, `unit`)
- `state/export/exportMetricsCsv.test.ts` — 2 unit tests (with data, empty array)
- `state/export/useExportMetricsCsv.ts` — hook that reads `analysisState.metrics`,
  serializes, calls `downloadFile`, and surfaces an `exported` transient flag via
  `useTemporaryFlag`

**New UI modules:**
- `ui/export/ExportMetricsCsvButton.tsx` — presentational button with inline
  feedback ("Download metrics as CSV" / "CSV exported")
- `ui/export/ExportMetricsCsvButton.test.tsx` — 3 component tests
- `ui/export/ExportAnalysisButton.test.tsx` — 3 component tests (gap left from
  IHSQD-50)

**Wiring:**
- `AnalysisPage` — calls `useExportMetricsCsv`, passes `csvExportActions` down
- `AnalysisSuccess` — renders `ExportMetricsCsvButton` next to `ExportAnalysisButton`
- `AnalysisSuccess.test.tsx` — test helper updated to accept `csvExportActions`

---

## Decisions

- **`state/export/` and `ui/export/` subdirectories** — groups all export concerns
  inside one navigable folder per layer without creating a new top-level feature.
  Mirrors the existing `state/snapshots/` / `ui/snapshots/` precedent.
- **`exportAnalysisJson` rename** — both serializers now carry the format in their
  name, making the pair symmetrical and unambiguous at a glance.
- **`downloadFile` in `src/shared/utils/`** — kept as a plain function with no
  React dependency. Lives in `utils/` rather than `hooks/` because it has no
  state, effects, or lifecycle.
- **`useExportMetricsCsv` mirrors `useExportAnalysis`** — same shape
  `{ exportCsv, exported }` so the page can pass both through identically shaped
  `csvExportActions` prop objects.
- **CSV columns: `name`, `value`, `unit`** — reflects the full `Metric` domain type.

---

## Impact

- **UI** — new "Download metrics as CSV" button visible on the Analysis success
  view alongside the existing "Download the current analysis as JSON" button.
- **Shared layer** — `downloadFile` is available to any future export feature via
  `@/shared`.
- **No domain changes** — no new domain rules; the serializer reads existing
  `Metric` fields only.
- **No routing or data-fetching changes.**

---

## Risks / Considerations

- `downloadFile` uses `URL.createObjectURL` + synthetic click, same as the JSON
  export. Works in all modern browsers; no known issues.
- CSV `text/csv;charset=utf-8;` MIME type ensures correct encoding on Excel and
  Google Sheets import.
- The hook is guarded by `status === "success"` — no download fires from loading
  or error states.

---

## Checklist

- [x] Code is easy to understand
- [x] Domain rules are respected
- [x] No unnecessary coupling introduced
- [x] Tests added for all new modules
- [x] Docs updated
