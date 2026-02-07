"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDatasets } from "@/features/datasets/state/useDatasets";
import { PageShell } from "@/shared";
import { DatasetList } from "../ui/DatasetList";
import { ScenarioControls } from "@/features/datasets/ui/ScenarioControls";

function DatasetsContent() {
  const { state, actions } = useDatasets();

  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedFromUrl = searchParams.get("selected") ?? undefined;

  useEffect(() => {
    if (state.status !== "success") return;
    if (!selectedFromUrl) return;
    if (state.selectedId === selectedFromUrl) return;

    // Only select if the dataset exists
    const exists = state.datasets.some((d) => d.id === selectedFromUrl);
    if (exists) actions.selectDataset(selectedFromUrl);
  }, [state, selectedFromUrl, actions]);

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
            onSelect={(id) => {
              actions.selectDataset(id);
              router.replace(`/datasets?selected=${encodeURIComponent(id)}`);
            }}
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

export function DatasetsPage() {
  return (
    <Suspense fallback={<PageShell title="Datasets"><p>Loading…</p></PageShell>}>
      <DatasetsContent />
    </Suspense>
  );
}
