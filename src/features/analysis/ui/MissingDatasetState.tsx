import Link from "next/link";

export function MissingDatasetState() {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-sm">
      <h2 className="text-base font-semibold">No dataset selected</h2>
      <p className="mt-2 text-sm text-gray-300">
        Select a dataset first to start analysis.
      </p>

      <div className="mt-4">
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
