import type { AnalysisSnapshot, AnalysisSnapshotId } from "@/domain";
import type { SnapshotsState } from "@/features/analysis/state/snapshots.types";
import { SaveSnapshotButton } from "./SaveSnapshotButton";
import { SnapshotsEmptyState } from "./SnapshotsEmptyState";
import { SnapshotsList } from "./SnapshotsList";

export function SnapshotsPanel({
  status,
  snapshots,
  selectedId,
  onSave,
  onSelect,
  onDeleteAll,
}: {
  status: SnapshotsState["status"];
  snapshots: AnalysisSnapshot[];
  selectedId?: AnalysisSnapshotId;
  onSave: () => void;
  onSelect: (id: AnalysisSnapshotId) => void;
  onDeleteAll: () => void;
}) {
  const hasSnapshots = snapshots.length > 0;
  const isBusy = status === "loading" || status === "saving";
  const isError = status === "error";

  return (
    <section className="space-y-4 rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-gray-50">Snapshots</h2>
          <p className="text-xs text-gray-300">
            Save and restore analysis contexts.
          </p>
        </div>

        <SaveSnapshotButton onSave={onSave} disabled={isBusy} />
      </div>

      {isError ? (
        <p className="text-xs text-red-400">Something went wrong. Try again.</p>
      ) : null}

      {isBusy ? (
        <p className="text-xs text-gray-500 italic">Loading…</p>
      ) : hasSnapshots ? (
        <>
          <SnapshotsList
            snapshots={snapshots}
            selectedId={selectedId}
            onSelect={onSelect}
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onDeleteAll}
              disabled={isBusy}
              className="text-xs text-gray-400 underline underline-offset-2 hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Delete all
            </button>
          </div>
        </>
      ) : (
        <SnapshotsEmptyState />
      )}
    </section>
  );
}
