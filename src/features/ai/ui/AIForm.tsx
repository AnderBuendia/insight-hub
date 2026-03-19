export function AIForm({
  prompt,
  onPromptChange,
  onSubmit,
  disabled,
  submitLabel = "Ask",
}: {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  submitLabel?: string;
}) {
  return (
    <div className="space-y-2">
      <textarea
        className="min-h-22 w-full resize-none rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
        placeholder="Ask a question about this dataset…"
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        disabled={disabled}
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || prompt.trim().length === 0}
          className="inline-flex items-center rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
