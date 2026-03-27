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
                  ? "border-gray-900 bg-gray-100"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <p className="text-sm font-medium text-gray-900">
                Dataset: {snapshot.datasetId}
              </p>
              <p className="mt-1 text-xs text-gray-600">
                Created at: {new Date(snapshot.createdAt).toLocaleString()}
              </p>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
