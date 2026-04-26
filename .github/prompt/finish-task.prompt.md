---
name: create-finish-task-prompt
description: 'Create a reusable prompt (.prompt.md) to finalize a task: generate atomic commits and a PR using the repository template.'
argument-hint: What type of task should this prompt finalize? (feature, fix, refactor, etc.)
disable-model-invocation: true
---
Related skills: `agent-customization`, `pull-request-automation`. Load and follow **prompts.md** for template and principles.

Guide the user to create a `.prompt.md` focused on finishing development tasks for review (commits + PR).

## Extract from Conversation
Review the conversation and detect if the user is repeatedly completing development tasks.

Extract:
- Type of task (feature, fix, refactor)
- Use of git diff
- Need for atomic commits
- Use of Conventional Commits
- Use of `.github/pull_request_template.md`
- Expected PR structure (Summary, Context, Changes, Decisions, Impact, Risks, Checklist)

Generalize this into a reusable “finish task for PR” prompt.

## Clarify if Needed
If unclear, ask:
- What validation steps exist? (tests, lint, build, typecheck)
- Is Conventional Commits required?
- Is JIRA ticket always required?
- Should the prompt enforce commit approval before execution?

## Iterate
1. Draft a `.prompt.md` that:
   - Analyzes git diff
   - Proposes atomic commits
   - Uses Conventional Commits
   - Validates changes
   - Generates PR using the provided template

2. Ensure the PR output includes:

   - Summary + JIRA Ticket
   - Context
   - Changes (bullet list)
   - Decisions
   - Impact (UI, Domain, Data flow, Performance)
   - Risks / Considerations
   - Checklist

3. Identify weak points:
   - unclear validation steps
   - ambiguous commit grouping
   - missing PR context

4. Refine with user input.

## Final Step
Once finalized:

- Summarize the prompt purpose: finishing tasks into production-ready PRs
- Provide example usage:

```text
Finish this task for PR: add payment integration