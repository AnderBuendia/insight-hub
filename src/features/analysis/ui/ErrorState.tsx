export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-sm">
      <h2 className="text-base font-semibold">Something went wrong</h2>
      <p className="mt-2 text-sm text-gray-300">{message}</p>

      <div className="mt-4">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
