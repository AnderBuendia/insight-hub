"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageShell } from "@/shared";
import { AnalysisLayout } from "@/features/analysis/ui/AnalysisLayout";
import { MissingDatasetState } from "@/features/analysis/ui/MissingDatasetState";
import { MetricsPlaceholder } from "@/features/analysis/ui/MetricsPlaceholder";
import { FiltersPlaceholder } from "@/features/analysis/ui/FiltersPlaceholder";

function AnalysisContent() {
  const searchParams = useSearchParams();
  const datasetId = searchParams.get("datasetId");

  // Empty state: dataset missing
  if (!datasetId) {
    return (
      <PageShell title="Analysis">
        <MissingDatasetState />
      </PageShell>
    );
  }

  // Success skeleton
  return (
    <PageShell title="Analysis">
      <AnalysisLayout
        title="Dataset Analysis"
        subtitle={`Dataset: ${datasetId}`}
        left={<MetricsPlaceholder />}
        right={<FiltersPlaceholder />}
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
