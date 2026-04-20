export function ExportMetricsCsvButton({
  onExport,
  exported,
}: {
  onExport: () => void;
  exported: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onExport}
        className="inline-flex items-center rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm font-medium text-gray-100 hover:bg-gray-800"
      >
        Export CSV
      </button>

      <span className="text-xs text-gray-400">
        {exported ? "CSV exported" : "Download metrics as CSV"}
      </span>
    </div>
  );
}
