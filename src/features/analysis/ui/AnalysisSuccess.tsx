import { AnalysisLayout } from "@/features/analysis/ui/AnalysisLayout";
import { AIPanel } from "@/features/ai/page/AIPanel";
import { PageShell } from "@/shared";
import { LoadingState } from "@/features/analysis/ui/LoadingState";
import { ErrorState } from "@/features/analysis/ui/ErrorState";
import { AnalysisEmptyState } from "@/features/analysis/ui/AnalysisEmptyState";
import { MetricsList } from "@/features/analysis/ui/MetricsList";
import { FiltersList } from "@/features/analysis/ui/FiltersList";
import { MockCategoryFilter } from "@/features/analysis/ui/MockCategoryFilter";
import { SnapshotsPanel } from "@/features/analysis/ui/snapshots/SnapshotsPanel";
import { InsightsPanel } from "@/features/analysis/ui/InsightsPanel";
import { ShareAnalysisButton } from "@/features/analysis/ui/ShareAnalysisButton";
import { ExportAnalysisButton } from "@/features/analysis/ui/export/ExportAnalysisButton";
import { ExportMetricsCsvButton } from "@/features/analysis/ui/export/ExportMetricsCsvButton";
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
  shareActions,
  exportActions,
  csvExportActions,
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
  shareActions: {
    onCopy: () => void;
    copied: boolean;
  };
  exportActions: {
    onExport: () => void;
    exported: boolean;
  };
  csvExportActions: {
    onExport: () => void;
    exported: boolean;
  };
}) {
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

  if (analysisState.status === "success" && analysisState.metrics.length === 0) {
    return (
      <PageShell title="Analysis">
        <AnalysisEmptyState reason="no-data" onReload={analysisActions.reload} />
      </PageShell>
    );
  }

  return (
    <PageShell title="Analysis">
      <AnalysisLayout
        title="Dataset Analysis"
        subtitle={`Dataset: ${analysisState.datasetId}`}
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
                    Filters restored from snapshot saved on{" "}
                    <span className="font-medium">
                      {new Date(selectedSnapshot.createdAt).toLocaleString()}
                    </span>
                    . Editing filters or saving a new snapshot will not modify the original.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={snapshotsActions.clearSelection}
                  className="shrink-0 whitespace-nowrap text-indigo-300 underline underline-offset-2 transition-colors hover:text-indigo-100"
                >
                  Exit snapshot view
                </button>
              </div>
            ) : null}
            <AIPanel datasetId={datasetId} />
            <ShareAnalysisButton onCopy={shareActions.onCopy} copied={shareActions.copied} />
            <ExportAnalysisButton onExport={exportActions.onExport} exported={exportActions.exported} />
            <ExportMetricsCsvButton onExport={csvExportActions.onExport} exported={csvExportActions.exported} />
            <InsightsPanel insights={analysisState.insights} />
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
