import type { AnalysisSnapshot, AnalysisSnapshotId } from "@/domain";

export type SnapshotsState =
  | { status: "loading"; snapshots: AnalysisSnapshot[]; selectedId?: AnalysisSnapshotId }
  | { status: "saving"; snapshots: AnalysisSnapshot[]; selectedId?: AnalysisSnapshotId }
  | { status: "empty"; snapshots: AnalysisSnapshot[]; selectedId?: AnalysisSnapshotId }
  | {
      status: "success";
      snapshots: AnalysisSnapshot[];
      selectedId?: AnalysisSnapshotId;
    }
  | {
      status: "error";
      snapshots: AnalysisSnapshot[];
      selectedId?: AnalysisSnapshotId;
      message: string;
    };
