import { useAnalysis } from "@/features/analysis/state/useAnalysis";
import { AnalysisLayout } from "@/features/analysis/ui/AnalysisLayout";
import { AIPanel } from "@/features/ai/page/AIPanel";
import { PageShell } from "@/shared";
import { LoadingState } from "@/features/analysis/ui/LoadingState";
import { ErrorState } from "@/features/analysis/ui/ErrorState";
import { EmptyState } from "@/features/analysis/ui/EmptyState";
import { MetricsList } from "@/features/analysis/ui/MetricsList";
import { FiltersList } from "@/features/analysis/ui/FiltersList";
import { SnapshotsPanel } from "@/features/analysis/ui/snapshots/SnapshotsPanel";
import type { SnapshotsState } from "@/features/analysis/state/snapshots.types";
import type { AnalysisSnapshot, AnalysisSnapshotId } from "@/domain";

export function AnalysisSuccess({
  datasetId,
  snapshotsState,
  snapshotsActions,
  selectedSnapshot,
}: {
  datasetId: string;
  snapshotsState: SnapshotsState;
  snapshotsActions: {
    save: () => void;
    select: (id: AnalysisSnapshotId) => void;
    clear: () => void;
  };
  selectedSnapshot?: AnalysisSnapshot;
}) {
  const { state, actions } = useAnalysis(datasetId);
  const restoredFromSnapshot = Boolean(selectedSnapshot);

  if (state.status === "loading" || state.status === "idle") {
    return (
      <PageShell title="Analysis">
        <LoadingState title="Loading analysis…" />
      </PageShell>
    );
  }

  if (state.status === "error") {
    return (
      <PageShell title="Analysis">
        <ErrorState message={state.message} onRetry={actions.reload} />
      </PageShell>
    );
  }

  if (state.status === "empty") {
    return (
      <PageShell title="Analysis">
        <EmptyState onReload={actions.reload} />
      </PageShell>
    );
  }

  return (
    <PageShell title="Analysis">
      <AnalysisLayout
        title="Dataset Analysis"
        subtitle={`Dataset: ${state.datasetId} ${restoredFromSnapshot ? " • restored from snapshot" : ""}` }
        left={<MetricsList metrics={state.metrics} />}
        right={<FiltersList filters={state.filters} />}
        bottom={
          <>
            {selectedSnapshot ? (
              <div className="flex items-start gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-300">
                <span className="mt-0.5 text-indigo-400">&#9432;</span>
                <span>
                  Viewing analysis restored from snapshot created at{" "}
                  <span className="font-medium">
                    {new Date(selectedSnapshot.createdAt).toLocaleString()}
                  </span>
                  . Changes will not affect the original snapshot.
                </span>
              </div>
            ) : null}
            <AIPanel datasetId={datasetId} />
            <SnapshotsPanel
              status={snapshotsState.status}
              snapshots={snapshotsState.snapshots}
              selectedId={snapshotsState.selectedId}
              onSave={snapshotsActions.save}
              onSelect={snapshotsActions.select}
              onClear={snapshotsActions.clear}
            />
          </>
        }
      />
    </PageShell>
  );
}
