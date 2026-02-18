"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAnalysis } from "@/features/analysis/state/useAnalysis";
import { AnalysisLayout } from "@/features/analysis/ui/AnalysisLayout";
import { PageShell } from "@/shared";
import { MissingDatasetState } from "@/features/analysis/ui/MissingDatasetState";
import { LoadingState } from "@/features/analysis/ui/LoadingState";
import { ErrorState } from "@/features/analysis/ui/ErrorState";
import { EmptyState } from "@/features/analysis/ui/EmptyState";
import { MetricsList } from "@/features/analysis/ui/MetricsList";
import { FiltersList } from "@/features/analysis/ui/FiltersList";

function AnalysisContent() {
  const searchParams = useSearchParams();
  const datasetId = searchParams.get("datasetId");
  const { state, actions } = useAnalysis(datasetId);

  if (!datasetId) {
    return (
      <PageShell title="Analysis">
        <MissingDatasetState />
      </PageShell>
    );
  }

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

  // success
  return (
    <PageShell title="Analysis">
      <AnalysisLayout
        title="Dataset Analysis"
        subtitle={`Dataset: ${state.datasetId}`}
        left={<MetricsList metrics={state.metrics} />}
        right={<FiltersList filters={state.filters} />}
      />
    </PageShell>
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
