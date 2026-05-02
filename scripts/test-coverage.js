#!/usr/bin/env node

/* eslint-disable no-console */

/**
 * This script runs vitest with coverage and enforces thresholds.
 * Vitest 4.x reports thresholds but doesn't fail by default.
 * This script reads the JSON coverage report and exits with code 1 if thresholds are not met.
 */

import { exec } from "child_process";
import { readFileSync, rmSync } from "fs";

const THRESHOLDS = {
  lines: 80,
  functions: 80,
  branches: 80,
  statements: 80,
};

const COVERAGE_FILE = "coverage/coverage-final.json";
const OUTPUT_BUFFER_BYTES = 20 * 1024 * 1024;

function percentage(covered, total) {
  if (total === 0) {
    return 100;
  }

  return Number(((covered / total) * 100).toFixed(2));
}

function calculateCoverage() {
  const report = JSON.parse(readFileSync(COVERAGE_FILE, "utf8"));
  const totals = {
    statements: { covered: 0, total: 0 },
    branches: { covered: 0, total: 0 },
    functions: { covered: 0, total: 0 },
    lines: { covered: 0, total: 0 },
  };

  for (const file of Object.values(report)) {
    for (const count of Object.values(file.s)) {
      totals.statements.total += 1;
      if (count > 0) {
        totals.statements.covered += 1;
      }
    }

    for (const branchCounts of Object.values(file.b)) {
      for (const count of branchCounts) {
        totals.branches.total += 1;
        if (count > 0) {
          totals.branches.covered += 1;
        }
      }
    }

    for (const count of Object.values(file.f)) {
      totals.functions.total += 1;
      if (count > 0) {
        totals.functions.covered += 1;
      }
    }

    const lines = new Set(Object.values(file.statementMap).map(statement => statement.start.line));
    const coveredLines = new Set();

    for (const [id, count] of Object.entries(file.s)) {
      if (count > 0) {
        coveredLines.add(file.statementMap[id].start.line);
      }
    }

    totals.lines.total += lines.size;
    totals.lines.covered += coveredLines.size;
  }

  return {
    statements: percentage(totals.statements.covered, totals.statements.total),
    branches: percentage(totals.branches.covered, totals.branches.total),
    functions: percentage(totals.functions.covered, totals.functions.total),
    lines: percentage(totals.lines.covered, totals.lines.total),
  };
}

console.log("Running tests with coverage...\n");

rmSync(COVERAGE_FILE, { force: true });

exec("npx vitest run --coverage", { maxBuffer: OUTPUT_BUFFER_BYTES }, (error, stdout, stderr) => {
  // Always print the output
  console.log(stdout);
  if (stderr) {console.error(stderr);}

  // If tests themselves failed, exit with error
  if (error) {
    console.error("\n❌ Tests failed");
    process.exit(1);
  }

  let coverage;
  try {
    coverage = calculateCoverage();
  } catch (_error) {
    console.error("\n⚠️  Could not parse coverage output");
    process.exit(1);
  }

  console.log("\n📊 Coverage Summary:");
  console.log(`  Statements: ${coverage.statements}% (threshold: ${THRESHOLDS.statements}%)`);
  console.log(`  Branches:   ${coverage.branches}% (threshold: ${THRESHOLDS.branches}%)`);
  console.log(`  Functions:  ${coverage.functions}% (threshold: ${THRESHOLDS.functions}%)`);
  console.log(`  Lines:      ${coverage.lines}% (threshold: ${THRESHOLDS.lines}%)`);

  const failures = [];
  if (coverage.statements < THRESHOLDS.statements) {
    failures.push(`statements (${coverage.statements}% < ${THRESHOLDS.statements}%)`);
  }
  if (coverage.branches < THRESHOLDS.branches) {
    failures.push(`branches (${coverage.branches}% < ${THRESHOLDS.branches}%)`);
  }
  if (coverage.functions < THRESHOLDS.functions) {
    failures.push(`functions (${coverage.functions}% < ${THRESHOLDS.functions}%)`);
  }
  if (coverage.lines < THRESHOLDS.lines) {
    failures.push(`lines (${coverage.lines}% < ${THRESHOLDS.lines}%)`);
  }

  if (failures.length > 0) {
    console.log("\n❌ Coverage thresholds not met:");
    failures.forEach(f => console.log(`   - ${f}`));
    process.exit(1);
  }

  console.log("\n✅ All coverage thresholds met!");

  // Output coverage data in JSON format for CI
  if (process.env.CI) {
    console.log("\n--- COVERAGE_JSON_START ---");
    console.log(JSON.stringify(coverage, null, 2));
    console.log("--- COVERAGE_JSON_END ---");
  }

  process.exit(0);
});
