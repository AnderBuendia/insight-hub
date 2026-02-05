"use client";

import { PageShell } from "@/shared";
import { DatasetList } from "@/features/datasets/ui/DatasetList";
import { useDatasets } from "@/features/datasets/states/useDatasets";

export function DatasetsPage() {
  const { state, actions } = useDatasets();

  if (state.status === "loading" || state.status === "idle") {
    return (
      <PageShell title="Datasets">
        <p>Loading datasets…</p>
      </PageShell>
    );
  }

  if (state.status === "empty") {
    return (
      <PageShell title="Datasets">
        <p>No datasets available.</p>
        <button type="button" onClick={actions.reload}>
          Reload
        </button>
      </PageShell>
    );
  }

  if (state.status === "error") {
    return (
      <PageShell title="Datasets">
        <p>Failed to load datasets: {state.message}</p>
        <button type="button" onClick={actions.reload}>
          Retry
        </button>
      </PageShell>
    );
  }

  return (
    <PageShell title="Datasets">
      <DatasetList
        datasets={state.datasets}
        selectedId={state.selectedId}
        onSelect={actions.selectDataset}
      />
      {state.selectedId ? <p>Selected: {state.selectedId}</p> : <p>Select a dataset.</p>}
    </PageShell>
  );
}
