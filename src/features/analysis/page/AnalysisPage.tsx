"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageShell } from "@/shared";
import { MissingDatasetState } from "@/features/analysis/ui/MissingDatasetState";
import { AnalysisSuccess } from "@/features/analysis/ui/AnalysisSuccess";
import { useSnapshots } from "@/features/analysis/state/useSnapshots";

function AnalysisContent() {
  const searchParams = useSearchParams();
  const urlDatasetId = searchParams.get("datasetId");

  const { state: snapshotsState, actions: snapshotsActions } = useSnapshots(
    urlDatasetId ?? "",
  );

  const selectedSnapshot = snapshotsState.snapshots.find(
    (snapshot) => snapshot.id === snapshotsState.selectedId,
  );

  const effectiveDatasetId = selectedSnapshot?.datasetId ?? urlDatasetId;

  if (!effectiveDatasetId) {
    return (
      <PageShell title="Analysis">
        <MissingDatasetState />
      </PageShell>
    );
  }

  return (
    <AnalysisSuccess
      datasetId={effectiveDatasetId}
      snapshotsState={snapshotsState}
      snapshotsActions={snapshotsActions}
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
