export function AIErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900 p-3">
      <p className="text-sm font-medium text-gray-100">AI request failed</p>
      <p className="mt-1 text-xs text-gray-300">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 inline-flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
      >
        Retry
      </button>
    </div>
  );
}
