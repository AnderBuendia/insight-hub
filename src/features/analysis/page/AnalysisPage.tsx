"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageShell } from "@/shared";
import { AnalysisLayout } from "@/features/analysis/ui/AnalysisLayout";

function AnalysisContent() {
  const searchParams = useSearchParams();
  const datasetId = searchParams.get("datasetId");

  // Empty state: dataset missing
  if (!datasetId) {
    return (
      <PageShell title="Analysis">
        <p>No dataset selected.</p>
        <p>Select a dataset first to start analysis.</p>
        <Link href="/datasets">Go to Datasets</Link>
      </PageShell>
    );
  }

  // Success skeleton
  return (
    <PageShell title="Analysis">
      <AnalysisLayout
        title="Dataset Analysis"
        subtitle={`Dataset: ${datasetId}`}
        left={
          <section>
            <h2>Metrics</h2>
            <p>Placeholder — metrics will be displayed here.</p>
          </section>
        }
        right={
          <section>
            <h2>Filters</h2>
            <p>Placeholder — filters will be configured here.</p>
          </section>
        }
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
