import { describe, expect, it, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { SnapshotsEmptyState } from "@/features/analysis/ui/snapshots/SnapshotsEmptyState";

afterEach(() => {
  cleanup();
});

describe("SnapshotsEmptyState", () => {
  it("renders the empty state message", () => {
    render(<SnapshotsEmptyState />);

    expect(screen.getByText("No snapshots yet")).toBeInTheDocument();
  });
});
