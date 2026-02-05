"use client";

import { PageShell } from "@/shared";
import { DatasetList } from "../ui/DatasetList";
import { useDatasets } from "@/features/datasets/state/useDatasets";
import { ScenarioControls } from "@/features/datasets/ui/ScenarioControls";

ScenarioControls
export function DatasetsPage() {
  const { state, actions } = useDatasets();

  return (
    <PageShell title="Datasets">
      {/* DEV-ONLY: scenario simulation */}
      <ScenarioControls onReload={actions.reload} />

      {state.status === "idle" || state.status === "loading" ? (
        <p>Loading datasets…</p>
      ) : null}

      {state.status === "empty" ? (
        <>
          <p>No datasets available.</p>
          <button type="button" onClick={actions.reload}>
            Reload
          </button>
        </>
      ) : null}

      {state.status === "error" ? (
        <>
          <p>Failed to load datasets: {state.message}</p>
          <button type="button" onClick={actions.reload}>
            Retry
          </button>
        </>
      ) : null}

      {state.status === "success" ? (
        <>
          <DatasetList
            datasets={state.datasets}
            selectedId={state.selectedId}
            onSelect={actions.selectDataset}
          />
          {state.selectedId ? (
            <p>Selected: {state.selectedId}</p>
          ) : (
            <p>Select a dataset.</p>
          )}
        </>
      ) : null}
    </PageShell>
  );
}
