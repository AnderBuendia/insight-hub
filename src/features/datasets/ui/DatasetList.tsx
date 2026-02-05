import type { Dataset, DatasetId } from "@/domain";

export function DatasetList({
  datasets,
  selectedId,
  onSelect,
}: {
  datasets: Dataset[];
  selectedId?: DatasetId;
  onSelect: (id: DatasetId) => void;
}) {
  return (
    <ul>
      {datasets.map((d) => {
        const isSelected = d.id === selectedId;
        return (
          <li key={d.id}>
            <button type="button" onClick={() => onSelect(d.id)} aria-pressed={isSelected}>
              <strong>{d.name}</strong>
              {d.description ? <div>{d.description}</div> : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
