import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { SaveSnapshotButton } from "@/features/analysis/ui/snapshots/SaveSnapshotButton";

afterEach(() => {
  cleanup();
});

describe("SaveSnapshotButton", () => {
  it("renders the button", () => {
    render(<SaveSnapshotButton onSave={vi.fn()} />);

    expect(screen.getByRole("button", { name: /save snapshot/i })).toBeInTheDocument();
  });

  it("is enabled by default", () => {
    render(<SaveSnapshotButton onSave={vi.fn()} />);

    expect(screen.getByRole("button", { name: /save snapshot/i })).toBeEnabled();
  });

  it("is disabled when disabled prop is true", () => {
    render(<SaveSnapshotButton onSave={vi.fn()} disabled />);

    expect(screen.getByRole("button", { name: /save snapshot/i })).toBeDisabled();
  });
});
