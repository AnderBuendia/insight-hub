# Session History

> Append-only log of completed Harness Engineering sessions. Do not edit older
> entries; add new entries at the end.

---

## 2026-04-30 - Feature 1: harness_engineering_port

- **Agent/tool:** Codex
- **Plan:** Add a portable agent harness adapted to InsightHub and expose it through Claude, Codex, and GitHub Copilot entrypoints.
- **Changes:** Added `AGENTS.md`, `feature_list.json`, `progress/`, `CHECKPOINTS.md`, `init.sh`, portable role definitions under `.agents/roles/`, Claude adapters, Codex notes, and Copilot instructions.
- **Verification:** `./init.sh` passed; `npm run validations` passed; 35 test files and 245 tests passed; coverage remained above 80%.
- **Close:** Feature 1 marked `done`. Next autonomous task: feature 2 (`analysis_state_coverage`).

## 2026-04-30 - Harness update: JIRA source, explorer, validation reviewer, finish prompt

- **Agent/tool:** Codex
- **Task:** Adapt the harness to use JIRA as the future source of truth instead of `feature_list.json`; add explorer and validation reviewer roles; adapt `.github/prompt/finish-task.prompt.md`.
- **Changes:** Removed local backlog dependence, added `docs/harness/jira-mcp.md`, added portable and Claude-specific `explorer` and `validation-reviewer` roles, updated Claude/Codex/Copilot adapters, and rewrote the finish-task prompt as an operational closeout prompt.
- **Verification:** `./init.sh` passed; `npm run validations` passed; 35 test files and 245 tests passed; coverage remained above 80%.

## 2026-04-30 - IHSQD-61: Pass analysis context into AI assistant

- **Agent/tool:** Codex
- **Task:** Use Atlassian MCP to select a Jira issue in `Selected For Sprint`, then complete `IHSQD-61`.
- **Changes:** Fixed the coverage gate to read Vitest's structured coverage JSON; passed active analysis filters and metrics from `AnalysisSuccess` into `AIPanel`; submitted the full assistant context through `useAI`; added focused tests for both contracts.
- **Verification:** `npm test -- --run src/features/ai/state/useAI.test.ts src/features/ai/page/AIPanel.test.tsx src/features/analysis/ui/AnalysisSuccess.test.tsx` passed with 66 tests; `npm run typecheck` passed; final `./init.sh` passed with lint, typecheck, and coverage above 80%.
- **JIRA:** `IHSQD-61` transitioned to `Done` through Atlassian MCP after green verification.

## 2026-04-30 - Finish prompt: IHSQD-61

- **Agent/tool:** Codex
- **Task:** Execute `.github/prompt/finish-task.prompt.md` for `IHSQD-61`.
- **Checks:** Re-read `AGENTS.md`, `CHECKPOINTS.md`, and `progress/current.md`; fetched `IHSQD-61` through Atlassian MCP; inspected `git diff --stat` and `git diff`; created `progress/validation_ihsqd-61.md`.
- **Verification:** `./init.sh` passed; `npm run build` passed after rerunning with network access for Next font downloads.
- **Close state:** `progress/current.md` remained reset to idle; JIRA remained `Done`.

## 2026-04-30 - Coverage gate false-positive fix

- **Agent/tool:** Codex
- **Task:** Fix `scripts/test-coverage.js` so failed Vitest runs cannot pass through stale or partial coverage output.
- **Changes:** Removed stale `coverage/coverage-final.json` before running Vitest, failed immediately on any non-zero Vitest exit, and updated the script comment to describe JSON coverage parsing.
- **Verification:** `npm run test:coverage` passed; `./init.sh` passed.

## 2026-04-30 - AI assistant context state isolation fix

- **Agent/tool:** Codex
- **Task:** Fix AI assistant panel state so history and stale responses are scoped to the full analysis context, not only `datasetId`.
- **Changes:** Added full assistant-context keying for `useAI`; reset AI state when filters or metrics change; discard stale mid-flight responses after context changes; added focused hook and panel tests for full-context behavior.
- **Verification:** Focused AI/analysis tests passed with 69 tests; `npm run typecheck` passed; `npm run test:coverage` passed; `./init.sh` passed.

## 2026-04-30 - Finish prompt PR template alignment

- **Agent/tool:** Codex
- **Task:** Make `.github/prompt/finish-task.prompt.md` require change documentation using the repository PR template structure.
- **Changes:** Updated the finish-task required flow and PR output instructions to use the exact headings from `.github/pull_request_template.md`, with implementation details documented under `## Changes`.
- **Verification:** `./init.sh` passed.

## 2026-04-30 - Finish prompt rerun for pushed IHSQD-61 branch

- **Agent/tool:** Codex
- **Task:** Re-run `.github/prompt/finish-task.prompt.md` for the commits pushed to `IHSQD-61-ai-analysis-context`.
- **Checks:** Read `AGENTS.md`, `CHECKPOINTS.md`, `progress/current.md`, `.github/prompt/finish-task.prompt.md`, and `.github/pull_request_template.md`; inspected `git diff --stat origin/main...HEAD` and `git diff origin/main...HEAD`; fetched `IHSQD-61` through Atlassian MCP.
- **Verification:** `./init.sh` passed; `npm run build` passed after rerunning with network access for Next font downloads.
- **Close state:** `IHSQD-61` remained `Done`; `progress/current.md` remained reset to idle.

## 2026-05-01 - Harness efficiency and JIRA review transition

- **Agent/tool:** Codex
- **Task:** Reduce harness token overhead and correct the default JIRA completion transition.
- **Changes:** Added an explicit context-budget policy to `AGENTS.md`, changed completion guidance to move verified implementation work to `QA Testing` instead of `Done`, documented the JIRA status mapping, and aligned Codex, Copilot, leader, checkpoint, and finish-task instructions.
- **Verification:** `./init.sh` passed with lint, typecheck, and coverage above 80%.
- **Close state:** Local harness task complete; no JIRA transition performed because this was a user-directed local task.

## 2026-05-02 - Harness mini model routing

- **Agent/tool:** Codex
- **Task:** Route low-complexity harness closeout work, especially `.github/prompt/finish-task.prompt.md`, to mini-class models by default.
- **Changes:** Added model-routing guidance to `AGENTS.md`, `.github/prompt/finish-task.prompt.md`, `.codex/README.md`, `.github/instructions/harness.instructions.md`, and `CHECKPOINTS.md`. Deterministic closeout chores now default to mini-class models, with escalation when evidence is missing, validation is red, or judgment is required.
- **Verification:** `./init.sh` passed with lint, typecheck, and coverage above 80%.
- **Close state:** Local harness task complete; no JIRA transition performed because this was a user-directed local task.

## 2026-05-02 - Automated model routing policy

- **Agent/tool:** Codex
- **Task:** Generalize mini-model routing beyond `finish-task.prompt.md` so low-complexity harness work can be classified automatically.
- **Changes:** Added `docs/harness/model-routing.md` with routing lanes, mini preconditions, escalation triggers, and an automation contract. Added `.github/prompt/route-task.prompt.md` as a pre-flight classifier, updated AGENTS/Codex/Copilot/finish-task/checkpoint guidance to reference the shared policy, and made `init.sh` require the new routing files.
- **Verification:** `./init.sh` passed with lint, typecheck, and coverage above 80%.
- **Close state:** Local harness task complete; no JIRA transition performed because this was a user-directed local task.
