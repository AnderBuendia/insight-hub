"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PageShell } from "@/shared";
import { MissingDatasetState } from "@/features/analysis/ui/MissingDatasetState";
import { AnalysisSuccess } from "@/features/analysis/ui/AnalysisSuccess";
import { useAnalysis } from "@/features/analysis/state/useAnalysis";
import { useSnapshots } from "@/features/analysis/state/useSnapshots";

function AnalysisContent() {
  const searchParams = useSearchParams();
  const datasetId = searchParams.get("datasetId");

  const { state: snapshotsState, actions: snapshotsActions } = useSnapshots(
    datasetId ?? "",
  );
  const { state: analysisState, actions: analysisActions } = useAnalysis(
    datasetId,
  );

  const selectedSnapshot = snapshotsState.snapshots.find(
    (snapshot) => snapshot.id === snapshotsState.selectedId,
  );

  useEffect(() => {
    if (!selectedSnapshot) return;

    analysisActions.setFilters(selectedSnapshot.filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshotsState.selectedId]);

  if (!datasetId) {
    return (
      <PageShell title="Analysis">
        <MissingDatasetState />
      </PageShell>
    );
  }

  return (
    <AnalysisSuccess
      datasetId={datasetId}
      analysisState={analysisState}
      analysisActions={{
        reload: analysisActions.reload,
        setFilters: analysisActions.setFilters,
      }}
      snapshotsState={snapshotsState}
      snapshotsActions={{
        ...snapshotsActions,
        save: () => snapshotsActions.save(analysisState.filters),
      }}
      selectedSnapshot={selectedSnapshot}
    />
  );
}

export function AnalysisPage() {
  return (
    <Suspense
      fallback={
        <PageShell title="Analysis">
          <p>Loading…</p>
        </PageShell>
      }
    >
      <AnalysisContent />
    </Suspense>
  );
}
