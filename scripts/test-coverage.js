#!/usr/bin/env node

/**
 * This script runs vitest with coverage and enforces thresholds.
 * Vitest 4.x reports thresholds but doesn't fail by default.
 * This script parses the output and exits with code 1 if thresholds are not met.
 */

import { exec } from 'child_process';

const THRESHOLDS = {
  lines: 50,
  functions: 50,
  branches: 50,
  statements: 50,
};

console.log('Running tests with coverage...\n');

exec('npx vitest run --coverage', (error, stdout, stderr) => {
  // Always print the output
  console.log(stdout);
  if (stderr) console.error(stderr);

  // If tests themselves failed, exit with error
  if (error && !stdout.includes('Coverage report')) {
    console.error('\n❌ Tests failed');
    process.exit(1);
  }

  // Parse coverage percentages from output
  const coverageMatch = stdout.match(/All files\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)/);
  
  if (!coverageMatch) {
    console.error('\n⚠️  Could not parse coverage output');
    process.exit(1);
  }

  const [, statements, branches, functions, lines] = coverageMatch.map(Number);
  
  const coverage = {
    statements,
    branches,
    functions,
    lines,
  };

  console.log('\n📊 Coverage Summary:');
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
    console.log('\n❌ Coverage thresholds not met:');
    failures.forEach(f => console.log(`   - ${f}`));
    process.exit(1);
  }

  console.log('\n✅ All coverage thresholds met!');
  
  // Output coverage data in JSON format for CI
  if (process.env.CI) {
    console.log('\n--- COVERAGE_JSON_START ---');
    console.log(JSON.stringify(coverage, null, 2));
    console.log('--- COVERAGE_JSON_END ---');
  }
  
  process.exit(0);
});
