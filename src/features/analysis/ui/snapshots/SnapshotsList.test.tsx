import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SnapshotsList } from "@/features/analysis/ui/snapshots/SnapshotsList";
import type { AnalysisSnapshot } from "@/domain";

afterEach(() => {
  cleanup();
});

const snapshots: AnalysisSnapshot[] = [
  {
    id: "snap_1",
    datasetId: "ds_alpha",
    createdAt: "2026-01-10T08:30:00.000Z",
    filters: { category: "even" },
  },
  {
    id: "snap_2",
    datasetId: "ds_beta",
    createdAt: "2026-03-25T14:00:00.000Z",
    filters: { category: "odd" },
  },
];

describe("SnapshotsList", () => {
  describe("Snapshot fields rendering", () => {
    it("renders datasetId for each snapshot", () => {
      render(<SnapshotsList snapshots={snapshots} onSelect={vi.fn()} />);

      expect(screen.getByText("Dataset: ds_alpha")).toBeInTheDocument();
      expect(screen.getByText("Dataset: ds_beta")).toBeInTheDocument();
    });

    it("renders createdAt as localised string", () => {
      render(<SnapshotsList snapshots={snapshots} onSelect={vi.fn()} />);

      const expected = new Date("2026-01-10T08:30:00.000Z").toLocaleString();
      expect(screen.getByText(`Created at: ${expected}`)).toBeInTheDocument();
    });

    it("renders one list item per snapshot", () => {
      render(<SnapshotsList snapshots={snapshots} onSelect={vi.fn()} />);

      expect(screen.getAllByRole("listitem")).toHaveLength(2);
    });
  });

  describe("Selection", () => {
    it("calls onSelect with the snapshot id when clicked", async () => {
      const onSelect = vi.fn();
      render(<SnapshotsList snapshots={snapshots} onSelect={onSelect} />);

      await userEvent.click(screen.getByText("Dataset: ds_alpha"));

      expect(onSelect).toHaveBeenCalledWith("snap_1");
    });

    it("applies selected styles to the active snapshot button", () => {
      render(
        <SnapshotsList
          snapshots={snapshots}
          selectedId="snap_2"
          onSelect={vi.fn()}
        />,
      );

      const selectedBtn = screen.getByText("Dataset: ds_beta").closest("button");
      const unselectedBtn = screen.getByText("Dataset: ds_alpha").closest("button");

      expect(selectedBtn?.className).toContain("border-gray-300");
      expect(unselectedBtn?.className).not.toContain("border-gray-300");
    });
  });

  describe("Empty list", () => {
    it("renders nothing when snapshots array is empty", () => {
      render(<SnapshotsList snapshots={[]} onSelect={vi.fn()} />);

      expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    });
  });
});
