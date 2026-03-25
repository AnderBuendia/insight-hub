"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageShell } from "@/shared";
import { MissingDatasetState } from "@/features/analysis/ui/MissingDatasetState";
import { AnalysisSuccess } from "@/features/analysis/ui/AnalysisSuccess";

function AnalysisContent() {
  const searchParams = useSearchParams();
  const datasetId = searchParams.get("datasetId");

  if (!datasetId) {
    return (
      <PageShell title="Analysis">
        <MissingDatasetState />
      </PageShell>
    );
  }

  return <AnalysisSuccess datasetId={datasetId} />;
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
