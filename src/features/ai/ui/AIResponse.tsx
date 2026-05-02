import type { AIAssistantResponse } from "@/domain";

export function AIResponse({ response }: { response: AIAssistantResponse }) {
  const hasCitations = (response.citations?.length ?? 0) > 0;
  const hasSuggestions = (response.suggestions?.length ?? 0) > 0;

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900 p-4 space-y-3">
      <p className="text-sm leading-relaxed text-gray-100">{response.answer}</p>

      {hasCitations ? (
        <div className="border-t border-gray-700 pt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Sources
          </p>
          <ul className="mt-2 space-y-1" aria-label="Citations">
            {response.citations!.map((c, idx) => (
              <li key={`${c.title}-${idx}`} className="flex items-start gap-1.5 text-xs text-gray-400">
                <span className="mt-0.5 shrink-0 text-gray-600">·</span>
                {c.url ? (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-400 underline underline-offset-2 transition-colors"
                  >
                    {c.title}
                  </a>
                ) : (
                  <span>{c.title}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {hasSuggestions ? (
        <div className="border-t border-gray-700 pt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Follow-up questions
          </p>
          <ul className="mt-2 space-y-1" aria-label="Suggested follow-up questions">
            {response.suggestions!.map((s, idx) => (
              <li key={`suggestion-${idx}`} className="text-xs text-gray-300 italic">
                {s}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
