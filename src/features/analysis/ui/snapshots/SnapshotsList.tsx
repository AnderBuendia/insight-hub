import type { AnalysisSnapshot, AnalysisSnapshotId } from "@/domain";

export function SnapshotsList({
  snapshots,
  selectedId,
  onSelect,
}: {
  snapshots: AnalysisSnapshot[];
  selectedId?: AnalysisSnapshotId;
  onSelect: (id: AnalysisSnapshotId) => void;
}) {
  return (
    <ul className="space-y-2">
      {snapshots.map((snapshot) => {
        const isSelected = snapshot.id === selectedId;

        return (
          <li key={snapshot.id}>
            <button
              type="button"
              onClick={() => onSelect(snapshot.id)}
              className={`w-full rounded-lg border p-3 text-left ${
                isSelected
                  ? "border-gray-300 bg-gray-700"
                  : "border-gray-700 bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <p className="text-sm font-medium text-gray-100">
                Dataset: {snapshot.datasetId}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Created at: {new Date(snapshot.createdAt).toLocaleString()}
              </p>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
