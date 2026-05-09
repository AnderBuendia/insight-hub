#!/usr/bin/env node

/* eslint-disable no-console */

import { readFileSync, writeFileSync } from "fs";

const DEFAULT_TTL_HOURS = 24;

function normalizeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map(line => line.trim())
    .filter((line, index, lines) => line !== "" || (index > 0 && lines[index - 1] !== ""))
    .join("\n")
    .trim();
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (value === null || value === undefined || value === "") {
    return [];
  }

  return [value];
}

function toList(value) {
  return toArray(value)
    .flatMap(item => {
      if (typeof item === "string") {
        const normalized = normalizeText(item);
        if (normalized === "") {
          return [];
        }

        return normalized
          .split("\n")
          .map(line => line.replace(/^[-*]\s*/, "").trim())
          .filter(Boolean);
      }

      if (item && typeof item === "object") {
        const candidate = item.text ?? item.value ?? item.name ?? "";
        const normalized = normalizeText(candidate);
        return normalized === "" ? [] : [normalized];
      }

      return [];
    });
}

function computeSnapshotState({
  lastSyncAt,
  jiraUpdatedAt,
  now = new Date(),
  ttlHours = DEFAULT_TTL_HOURS,
  forceConflict = false,
}) {
  let snapshotState = "fresh";
  let refreshReason;
  const syncTime = Date.parse(lastSyncAt);
  const jiraTime = Date.parse(jiraUpdatedAt);

  if (Number.isFinite(syncTime)) {
    const ageMs = now.getTime() - syncTime;
    if (ageMs > ttlHours * 60 * 60 * 1000) {
      snapshotState = "stale";
      refreshReason = "stale_on_age";
    }
  }

  if (forceConflict) {
    snapshotState = "stale";
    refreshReason = "stale_on_conflict";
  }

  if (Number.isFinite(syncTime) && Number.isFinite(jiraTime) && jiraTime > syncTime) {
    snapshotState = "stale";
    refreshReason = "stale_on_conflict";
  }

  return refreshReason
    ? { snapshot_state: snapshotState, refresh_reason: refreshReason }
    : { snapshot_state: snapshotState };
}

function materializeIssueSnapshot(issue, options = {}) {
  const fields = issue.fields ?? {};
  const taskId = normalizeText(issue.key ?? issue.task_id ?? fields.task_id ?? "UNKNOWN-TASK");
  const summary = normalizeText(issue.summary ?? fields.summary ?? "");
  const status = normalizeText(issue.status ?? fields.status?.name ?? "");
  const acceptanceCriteria = toList(
    issue.acceptance_criteria
    ?? issue.acceptanceCriteria
    ?? fields.acceptanceCriteria
    ?? fields.acceptance_criteria,
  );
  const lastJiraSyncAt = options.lastJiraSyncAt ?? new Date().toISOString();
  const jiraUpdatedAt = normalizeText(issue.updated_at ?? issue.updated ?? fields.updated ?? lastJiraSyncAt);
  const snapshotState = computeSnapshotState({
    lastSyncAt: lastJiraSyncAt,
    jiraUpdatedAt,
    now: options.now ?? new Date(lastJiraSyncAt),
    ttlHours: options.ttlHours ?? DEFAULT_TTL_HOURS,
    forceConflict: options.forceConflict ?? false,
  });

  return {
    task_id: taskId,
    summary,
    status,
    acceptance_criteria: acceptanceCriteria,
    last_jira_sync_at: lastJiraSyncAt,
    ...snapshotState,
  };
}

function materializeManifest({ issue, manifest = {}, options = {} }) {
  const snapshot = materializeIssueSnapshot(issue, options);

  return {
    task_id: manifest.task_id ?? snapshot.task_id,
    status: manifest.status ?? "context_ready",
    issue_snapshot: snapshot,
    active_pointers: manifest.active_pointers ?? {
      task_brief: "task_brief_v1",
    },
    pointers: manifest.pointers ?? [],
  };
}

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) {
      continue;
    }

    const key = arg.slice(2);
    const value = argv[index + 1];
    if (value && !value.startsWith("--")) {
      args[key] = value;
      index += 1;
    } else {
      args[key] = "true";
    }
  }

  return args;
}

function readJsonFile(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function runCli() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.input) {
    console.error("Usage: node scripts/jira-materialize-context.js --input <issue.json> [--manifest <manifest.json>] [--output <manifest.json>] [--ttl-hours <hours>]");
    process.exit(1);
  }

  const issue = readJsonFile(args.input);
  const manifest = args.manifest ? readJsonFile(args.manifest) : {};
  const ttlHours = args["ttl-hours"] ? Number(args["ttl-hours"]) : DEFAULT_TTL_HOURS;
  const materialized = materializeManifest({
    issue,
    manifest,
    options: {
      ttlHours: Number.isFinite(ttlHours) ? ttlHours : DEFAULT_TTL_HOURS,
    },
  });
  const output = JSON.stringify(materialized, null, 2);

  if (args.output) {
    writeFileSync(args.output, `${output}\n`, "utf8");
  } else {
    console.log(output);
  }
}

if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  runCli();
}

export {
  computeSnapshotState,
  materializeIssueSnapshot,
  materializeManifest,
  normalizeText,
  toList,
};
