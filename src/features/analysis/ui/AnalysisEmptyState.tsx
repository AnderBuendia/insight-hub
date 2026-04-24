import Link from "next/link";

export function AnalysisEmptyState(
  props:
    | { reason: "no-dataset" }
    | { reason: "no-data"; onReload: () => void },
) {
  if (props.reason === "no-dataset") {
    return (
      <div className="rounded-xl border border-gray-700 bg-gray-800 p-8 shadow-sm">
        <div className="flex flex-col items-start gap-4">
          <div>
            <h2 className="text-base font-semibold text-gray-50">No dataset selected</h2>
            <p className="mt-2 text-sm text-gray-400">
              Analysis requires a dataset. Go to the catalogue, pick a dataset, and come back
              here to see its metrics and filters.
            </p>
          </div>

          <Link
            href="/datasets"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Go to Datasets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800 p-8 shadow-sm">
      <div className="flex flex-col items-start gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-50">No analysis data found</h2>
          <p className="mt-2 text-sm text-gray-400">
            The selected dataset has no metrics or filters yet. It may still be processing, or
            it may not contain any data. Try reloading or select a different dataset.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={props.onReload}
            className="inline-flex items-center rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm font-medium text-gray-100 hover:bg-gray-600"
          >
            Reload
          </button>

          <Link
            href="/datasets"
            className="text-sm text-indigo-400 underline underline-offset-2 hover:text-indigo-300"
          >
            Select a different dataset
          </Link>
        </div>
      </div>
    </div>
  );
}
