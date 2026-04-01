import { AnalysisLayout } from "@/features/analysis/ui/AnalysisLayout";
import { AIPanel } from "@/features/ai/page/AIPanel";
import { PageShell } from "@/shared";
import { LoadingState } from "@/features/analysis/ui/LoadingState";
import { ErrorState } from "@/features/analysis/ui/ErrorState";
import { MetricsList } from "@/features/analysis/ui/MetricsList";
import { FiltersList } from "@/features/analysis/ui/FiltersList";
import { MockCategoryFilter } from "@/features/analysis/ui/MockCategoryFilter";
import { SnapshotsPanel } from "@/features/analysis/ui/snapshots/SnapshotsPanel";
import type { SnapshotsState } from "@/features/analysis/state/snapshots.types";
import type { AnalysisState } from "@/features/analysis/state/types";
import type { AnalysisSnapshot, AnalysisSnapshotId, AnalysisFilters } from "@/domain";

export function AnalysisSuccess({
  datasetId,
  analysisState,
  analysisActions,
  snapshotsState,
  snapshotsActions,
  selectedSnapshot,
}: {
  datasetId: string;
  analysisState: AnalysisState;
  analysisActions: {
    reload: () => void;
    setFilters: (filters: AnalysisFilters) => void;
  };
  snapshotsState: SnapshotsState;
  snapshotsActions: {
    save: () => void;
    select: (id: AnalysisSnapshotId) => void;
    deleteAll: () => void;
    clearSelection: () => void;
  };
  selectedSnapshot?: AnalysisSnapshot;
}) {
  const restoredFromSnapshot = Boolean(selectedSnapshot);

  if (analysisState.status === "loading" || analysisState.status === "idle") {
    return (
      <PageShell title="Analysis">
        <LoadingState title="Loading analysis…" />
      </PageShell>
    );
  }

  if (analysisState.status === "error") {
    return (
      <PageShell title="Analysis">
        <ErrorState
          message={`Failed to load analysis for dataset "${datasetId}"`}
          onRetry={analysisActions.reload}
        />
      </PageShell>
    );
  }

  return (
    <PageShell title="Analysis">
      <AnalysisLayout
        title="Dataset Analysis"
        subtitle={`Dataset: ${analysisState.datasetId}${restoredFromSnapshot ? " • restored from snapshot" : ""}`}
        left={<MetricsList metrics={analysisState.metrics} />}
        right={
          <div className="space-y-4">
            <MockCategoryFilter
              filters={analysisState.filters}
              onSetFilters={analysisActions.setFilters}
            />
            <FiltersList filters={analysisState.filters} />
          </div>
        }
        bottom={
          <>
            {selectedSnapshot ? (
              <div className="flex items-start justify-between gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-300">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 text-indigo-400">&#9432;</span>
                  <span>
                    Viewing analysis restored from snapshot created at{" "}
                    <span className="font-medium">
                      {new Date(selectedSnapshot.createdAt).toLocaleString()}
                    </span>
                    . Changes will not affect the original snapshot.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={snapshotsActions.clearSelection}
                  className="shrink-0 text-indigo-300 underline underline-offset-2 hover:text-indigo-100"
                >
                  Use current dataset
                </button>
              </div>
            ) : null}
            <AIPanel datasetId={datasetId} />
            <SnapshotsPanel
              status={snapshotsState.status}
              snapshots={snapshotsState.snapshots}
              selectedId={snapshotsState.selectedId}
              onSave={snapshotsActions.save}
              onSelect={snapshotsActions.select}
              onDeleteAll={snapshotsActions.deleteAll}
            />
          </>
        }
      />
    </PageShell>
  );
}
