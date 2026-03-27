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
  onClear,
}: {
  status: SnapshotsState["status"];
  snapshots: AnalysisSnapshot[];
  selectedId?: AnalysisSnapshotId;
  onSave: () => void;
  onSelect: (id: AnalysisSnapshotId) => void;
  onClear: () => void;
}) {
  const hasSnapshots = snapshots.length > 0;
  const isBusy = status === "loading" || status === "saving";
  const isError = status === "error";

  return (
    <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Snapshots</h2>
          <p className="text-xs text-gray-600">
            Save and restore analysis contexts.
          </p>
        </div>

        <SaveSnapshotButton onSave={onSave} disabled={isBusy} />
      </div>

      {isError ? (
        <p className="text-xs text-red-600">Something went wrong. Try again.</p>
      ) : null}

      {isBusy ? (
        <p className="text-xs text-gray-400 italic">Loading…</p>
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
              onClick={onClear}
              disabled={isBusy}
              className="text-xs text-gray-500 underline underline-offset-2 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear all
            </button>
          </div>
        </>
      ) : (
        <SnapshotsEmptyState />
      )}
    </section>
  );
}
