export function ShareAnalysisButton({
  onCopy,
  copied,
}: {
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex items-center rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm font-medium text-gray-100 hover:bg-gray-800"
      >
        Copy link
      </button>

      <span className="text-xs text-gray-400">
        {copied ? "Link copied" : "Copy the current analysis URL"}
      </span>
    </div>
  );
}
