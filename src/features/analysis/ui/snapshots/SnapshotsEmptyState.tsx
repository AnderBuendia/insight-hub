export function SnapshotsEmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
      <p className="text-sm font-medium text-gray-900">No snapshots yet</p>
      <p className="mt-1 text-xs text-gray-600">
        Save the current analysis state to create your first snapshot.
      </p>
    </div>
  );
}
