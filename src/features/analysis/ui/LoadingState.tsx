export function LoadingState({ title = "Loading…" }: { title?: string }) {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className="h-5 w-5 animate-spin rounded-full border-2 border-gray-600 border-t-indigo-400"
          role="status"
          aria-label="Loading"
        />
        <p className="text-sm text-gray-300">{title}</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <div className="h-4 w-1/3 animate-pulse rounded bg-gray-700" />
          <div className="h-3 w-full animate-pulse rounded bg-gray-700" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-gray-700" />
          <div className="h-3 w-4/6 animate-pulse rounded bg-gray-700" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-1/3 animate-pulse rounded bg-gray-700" />
          <div className="h-3 w-full animate-pulse rounded bg-gray-700" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-gray-700" />
          <div className="h-3 w-4/6 animate-pulse rounded bg-gray-700" />
        </div>
      </div>
    </div>
  );
}
