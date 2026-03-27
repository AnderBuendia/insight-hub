import { useAnalysis } from "@/features/analysis/state/useAnalysis";
import { useSnapshots } from "@/features/analysis/state/useSnapshots";
import { AnalysisLayout } from "@/features/analysis/ui/AnalysisLayout";
import { AIPanel } from "@/features/ai/page/AIPanel";
import { PageShell } from "@/shared";
import { LoadingState } from "@/features/analysis/ui/LoadingState";
import { ErrorState } from "@/features/analysis/ui/ErrorState";
import { EmptyState } from "@/features/analysis/ui/EmptyState";
import { MetricsList } from "@/features/analysis/ui/MetricsList";
import { FiltersList } from "@/features/analysis/ui/FiltersList";
import { SnapshotsPanel } from "@/features/analysis/ui/snapshots/SnapshotsPanel";

export function AnalysisSuccess({ datasetId }: { datasetId: string }) {
  const { state, actions } = useAnalysis(datasetId);
  const { state: snapshotsState, actions: snapshotsActions } = useSnapshots(datasetId);

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
        subtitle={`Dataset: ${state.datasetId}`}
        left={<MetricsList metrics={state.metrics} />}
        right={<FiltersList filters={state.filters} />}
        bottom={
          <>
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
