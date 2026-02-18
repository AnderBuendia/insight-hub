import Link from "next/link";
import { PageShell } from "@/shared";

export default function HomePage() {
  return (
    <PageShell title="InsightHub">
      <p>v0.1.0-rc — scaffold</p>
      <Link href="/datasets">Go to Datasets</Link>
    </PageShell>
  );
}
