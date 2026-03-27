export function SnapshotsEmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-gray-600 bg-gray-700/50 p-4">
      <p className="text-sm font-medium text-gray-100">No snapshots yet</p>
      <p className="mt-1 text-xs text-gray-300">
        Save the current analysis state to create your first snapshot.
      </p>
    </div>
  );
}
