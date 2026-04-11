import type { Insight } from "@/domain";

function getSeverityClasses(severity: Insight["severity"]) {
  switch (severity) {
    case "positive":
      return "border-green-700 bg-green-950/30";
    case "warning":
      return "border-yellow-700 bg-yellow-950/30";
    case "info":
    default:
      return "border-gray-700 bg-gray-900/40";
  }
}

export function InsightsPanel({ insights }: { insights: Insight[] }) {
  if (insights.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-700 p-3">
        <p className="text-sm text-gray-300">No insights available</p>
      </div>
    );
  }

  return (
    <section className="space-y-2">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Insights
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Interpreted signals based on the current analysis state.
        </p>
      </div>

      <ul className="space-y-2">
        {insights.map((insight) => (
          <li
            key={insight.id}
            className={`rounded-lg border p-3 ${getSeverityClasses(insight.severity)}`}
          >
            <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-gray-400">
              {insight.severity}
            </p>
            <p className="text-sm text-gray-100">{insight.message}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
