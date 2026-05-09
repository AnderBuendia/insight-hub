#!/usr/bin/env bash
# init.sh - Harness startup and final verification for InsightHub.
#
# Agents run this before changing code and before marking any task as done.

set -u

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

ok() { printf "${GREEN}[OK]${NC}    %s\n" "$1"; }
warn() { printf "${YELLOW}[WARN]${NC}  %s\n" "$1"; }
fail() { printf "${RED}[FAIL]${NC}  %s\n" "$1"; }

EXIT_CODE=0

echo "-- 1. Checking environment --------------------------------"

if ! command -v node >/dev/null 2>&1; then
  fail "node is not installed"
  exit 1
fi
ok "node -> $(node --version)"

if ! command -v npm >/dev/null 2>&1; then
  fail "npm is not installed"
  exit 1
fi
ok "npm -> $(npm --version)"

NODE_VERSION_OK=$(node -e 'const major = Number(process.versions.node.split(".")[0]); console.log(Number(major >= 20));')
if [ "$NODE_VERSION_OK" != "1" ]; then
  fail "Node.js >= 20 is required"
  exit 1
fi
ok "Node.js version is compatible"

echo ""
echo "-- 2. Checking harness files -------------------------------"

for f in \
  AGENTS.md \
  progress/current.md \
  progress/history.md \
  progress/context/README.md \
  progress/context/task-template.json \
  docs/harness/context-pointers.md \
  docs/harness/jira-mcp.md \
  docs/harness/model-routing.md \
  docs/ARCHITECTURE.md \
  docs/CONVENTIONS.md \
  docs/TESTING.md \
  docs/DEFINITION_OF_DONE.md \
  CHECKPOINTS.md \
  CLAUDE.md \
  .codex/README.md \
  .github/copilot-instructions.md \
  .github/instructions/harness.instructions.md \
  .github/prompt/route-task.prompt.md \
  .agents/roles/leader.md \
  .agents/roles/explorer.md \
  .agents/roles/implementer.md \
  .agents/roles/reviewer.md \
  .agents/roles/validation-reviewer.md; do
  if [ ! -f "$f" ]; then
    fail "Missing required file: $f"
    EXIT_CODE=1
  else
    ok "Found $f"
  fi
done

echo ""
echo "-- 3. Running project validations --------------------------"

if npm run validations; then
  ok "Project validations passed"
else
  fail "Project validations failed"
  EXIT_CODE=1
fi

echo ""
echo "-- 4. Summary ----------------------------------------------"

if [ $EXIT_CODE -eq 0 ]; then
  ok "Harness ready. You can work on exactly one task."
else
  fail "Harness is not ready. Resolve the failures before continuing."
fi

exit $EXIT_CODE
