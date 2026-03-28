import Link from "next/link";
import { PageShell } from "@/shared";

export default function HomePage() {
  return (
    <PageShell title="InsightHub">
      <p>v0.3.0-rc.1 — scaffold</p>
      <Link href="/datasets">Go to Datasets</Link>
    </PageShell>
  );
}
