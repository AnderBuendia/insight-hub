import { describe, expect, it } from "vitest";

import {
  computeSnapshotState,
  materializeIssueSnapshot,
  materializeManifest,
  normalizeText,
  toList,
} from "./jira-materialize-context.js";

describe("jira-materialize-context", () => {
  describe("normalizeText", () => {
    it("trims lines and removes repeated blank lines", () => {
      expect(normalizeText("  one \n\n\n two  ")).toBe("one\n\ntwo");
    });
  });

  describe("toList", () => {
    it("normalizes bullet strings into a list", () => {
      expect(toList("- first\n- second")).toEqual(["first", "second"]);
    });
  });

  describe("computeSnapshotState", () => {
    it("marks the snapshot as stale when the ttl expires", () => {
      const snapshotState = computeSnapshotState({
        lastSyncAt: "2026-05-01T00:00:00.000Z",
        jiraUpdatedAt: "2026-05-01T00:00:00.000Z",
        now: new Date("2026-05-03T00:00:00.000Z"),
        ttlHours: 24,
      });

      expect(snapshotState.snapshot_state).toBe("stale");
      expect(snapshotState.refresh_reason).toBe("stale_on_age");
    });

    it("marks the snapshot as stale when jira is newer than the last sync", () => {
      const snapshotState = computeSnapshotState({
        lastSyncAt: "2026-05-01T00:00:00.000Z",
        jiraUpdatedAt: "2026-05-01T12:00:00.000Z",
        now: new Date("2026-05-01T00:00:00.000Z"),
        ttlHours: 24,
      });

      expect(snapshotState.snapshot_state).toBe("stale");
      expect(snapshotState.refresh_reason).toBe("stale_on_conflict");
    });
  });

  describe("materializeIssueSnapshot", () => {
    it("normalizes a reduced issue snapshot", () => {
      const snapshot = materializeIssueSnapshot(
        {
          key: "IHSQD-88",
          fields: {
            summary: "  Add hybrid jira brief  ",
            status: { name: "In Progress" },
            priority: { name: "High" },
            acceptanceCriteria: "- use local brief\n- refresh only when stale",
            links: [{ title: "ADR", url: "https://example.com/adr", type: "adr" }],
            blockers: ["Waiting on PM copy"],
            updated: "2026-05-06T08:00:00.000Z",
          },
        },
        {
          lastJiraSyncAt: "2026-05-06T08:00:00.000Z",
        },
      );

      expect(snapshot).toMatchObject({
        task_id: "IHSQD-88",
        summary: "Add hybrid jira brief",
        status: "In Progress",
        acceptance_criteria: ["use local brief", "refresh only when stale"],
        last_jira_sync_at: "2026-05-06T08:00:00.000Z",
        snapshot_state: "fresh",
      });
    });
  });

  describe("materializeManifest", () => {
    it("preserves manifest pointers while injecting the issue snapshot", () => {
      const manifest = materializeManifest({
        issue: {
          key: "IHSQD-90",
          fields: {
            summary: "Keep local context small",
            status: { name: "Selected for Sprint" },
          },
        },
        manifest: {
          task_id: "IHSQD-90",
          status: "context_ready",
          active_pointers: {
            task_brief: "task_brief_v1",
          },
          pointers: [
            {
              id: "task_brief_v1",
              type: "task_brief",
              path: "progress/current.md",
              state: "current",
              updated_at: "2026-05-06T08:00:00.000Z",
              depends_on: [],
            },
          ],
        },
        options: {
          lastJiraSyncAt: "2026-05-06T08:00:00.000Z",
        },
      });

      expect(manifest.task_id).toBe("IHSQD-90");
      expect(manifest.issue_snapshot.summary).toBe("Keep local context small");
      expect(manifest.active_pointers.task_brief).toBe("task_brief_v1");
      expect(manifest.pointers).toHaveLength(1);
    });
  });
});
