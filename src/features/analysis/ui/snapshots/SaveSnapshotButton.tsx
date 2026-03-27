export function SaveSnapshotButton({
  onSave,
  disabled,
}: {
  onSave: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSave}
      disabled={disabled}
      className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Save snapshot
    </button>
  );
}
