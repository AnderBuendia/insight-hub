"use client";

import { Suspense, useCallback, useEffect, useRef } from "react";
import type { AnalysisFilters } from "@/domain";
import { PageShell } from "@/shared";
import { MissingDatasetState } from "@/features/analysis/ui/MissingDatasetState";
import { AnalysisSuccess } from "@/features/analysis/ui/AnalysisSuccess";
import { useAnalysis } from "@/features/analysis/state/useAnalysis";
import { useSnapshots } from "@/features/analysis/state/useSnapshots";
import { parseFiltersFromSearchParams } from "@/features/analysis/state/urlState";
import { useUrlFilters } from "@/features/analysis/state/useUrlFilters";

function AnalysisContent() {
  const { datasetId, initialFilters, searchParams, syncUrl } = useUrlFilters();

  const {
    state: snapshotsState,
    actions: snapshotsActions,
  } = useSnapshots(datasetId ?? "");

  const {
    state: analysisState,
    actions: { reload, setFilters },
  } = useAnalysis(datasetId, initialFilters);

  const handleSetFilters = useCallback(
    (filters: AnalysisFilters) => {
      setFilters(filters);
      syncUrl(filters);
    },
    [setFilters, syncUrl],
  );

  // Keep analysis state in sync when the user navigates back/forward.
  // The mountedRef skips the first fire so we don't trigger a redundant
  // recompute on top of the one useAnalysis already does at mount.
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    setFilters(parseFiltersFromSearchParams(searchParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const selectedSnapshot = snapshotsState.snapshots.find(
    (snapshot) => snapshot.id === snapshotsState.selectedId,
  );

  useEffect(() => {
    if (!selectedSnapshot) return;

    handleSetFilters(selectedSnapshot.filters);
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
        reload,
        setFilters: handleSetFilters,
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
