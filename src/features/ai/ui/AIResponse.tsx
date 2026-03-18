import type { InfraAIResponse } from "@/infra";

export function AIResponse({ response }: { response: InfraAIResponse }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3">
      <p className="text-sm text-gray-900">{response.answer}</p>

      {response.citations?.length ? (
        <div className="mt-3">
          <p className="text-xs font-medium text-gray-700">Citations</p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            {response.citations.map((c, idx) => (
              <li key={`${c.title}-${idx}`} className="text-xs text-gray-600">
                {c.title}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
