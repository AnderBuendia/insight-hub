import Link from "next/link";

export function AnalysisEmptyState() {
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
