import type { InfraFilter } from "@/infra/analysis/types";

export function FiltersList({ filters }: { filters: InfraFilter[] }) {
  return (
    <ul className="space-y-2">
      {filters.map((f) => (
        <li key={f.id} className="rounded-lg border border-gray-200 p-3">
          <p className="text-sm font-medium">{f.field}</p>
          <p className="mt-1 text-xs text-gray-600">
            {f.operator} <span className="font-mono">{f.value}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}
