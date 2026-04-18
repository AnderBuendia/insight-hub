export function ExportAnalysisButton({
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
        Export JSON
      </button>

      <span className="text-xs text-gray-400">
        {exported ? "JSON exported" : "Download the current analysis as JSON"}
      </span>
    </div>
  );
}
