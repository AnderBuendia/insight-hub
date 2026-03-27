import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SnapshotsPanel } from "@/features/analysis/ui/snapshots/SnapshotsPanel";
import type { AnalysisSnapshot } from "@/domain";

const snapshot: AnalysisSnapshot = {
  id: "snap_1",
  datasetId: "ds_1",
  createdAt: "2026-03-25T10:00:00.000Z",
};

const defaultProps = {
  status: "empty" as const,
  snapshots: [],
  onSave: vi.fn(),
  onSelect: vi.fn(),
  onDeleteAll: vi.fn(),
};

afterEach(() => {
  cleanup();
});

describe("SnapshotsPanel", () => {
  describe("Header", () => {
    it("always renders title and save button", () => {
      render(<SnapshotsPanel {...defaultProps} />);

      expect(screen.getByRole("heading", { name: "Snapshots" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /save snapshot/i })).toBeInTheDocument();
    });
  });

  describe("Empty state", () => {
    it("shows empty state message when no snapshots", () => {
      render(<SnapshotsPanel {...defaultProps} status="empty" snapshots={[]} />);

      expect(screen.getByText("No snapshots yet")).toBeInTheDocument();
    });
  });

  describe("Loading / saving state", () => {
    it.each(["loading", "saving"] as const)(
      'shows loading indicator and disables button when status is "%s"',
      (status) => {
        render(<SnapshotsPanel {...defaultProps} status={status} snapshots={[]} />);

        expect(screen.getByText("Loading…")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /save snapshot/i })).toBeDisabled();
      },
    );
  });

  describe("Error state", () => {
    it("shows error message", () => {
      render(
        <SnapshotsPanel
          {...defaultProps}
          status="error"
          snapshots={[snapshot]}
        />,
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  describe("Success state with snapshots", () => {
    it("renders the snapshot list and clear button", () => {
      render(
        <SnapshotsPanel
          {...defaultProps}
          status="success"
          snapshots={[snapshot]}
        />,
      );

      expect(screen.getByText("Dataset: ds_1")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /delete all/i })).toBeInTheDocument();
    });

    it("calls onSave when save button is clicked", async () => {
      const onSave = vi.fn();
      render(
        <SnapshotsPanel
          {...defaultProps}
          status="success"
          snapshots={[snapshot]}
          onSave={onSave}
        />,
      );

      await userEvent.click(screen.getByRole("button", { name: /save snapshot/i }));

      expect(onSave).toHaveBeenCalledOnce();
    });

    it("calls onDeleteAll when clear all is clicked", async () => {
      const onDeleteAll = vi.fn();
      render(
        <SnapshotsPanel
          {...defaultProps}
          status="success"
          snapshots={[snapshot]}
          onDeleteAll={onDeleteAll}
        />,
      );

      await userEvent.click(screen.getByRole("button", { name: /delete all/i }));

      expect(onDeleteAll).toHaveBeenCalledOnce();
    });
    it("calls onSelect with the snapshot id when clicked", async () => {
      const onSelect = vi.fn();
      render(
        <SnapshotsPanel
          {...defaultProps}
          status="success"
          snapshots={[snapshot]}
          onSelect={onSelect}
        />,
      );

      await userEvent.click(screen.getByRole("button", { name: /dataset: ds_1/i }));

      expect(onSelect).toHaveBeenCalledOnce();
      expect(onSelect).toHaveBeenCalledWith("snap_1");
    });

    it("highlights the selected snapshot", () => {
      render(
        <SnapshotsPanel
          {...defaultProps}
          status="success"
          snapshots={[snapshot]}
          selectedId="snap_1"
        />,
      );

      const button = screen.getByRole("button", { name: /dataset: ds_1/i });
      expect(button.className).toContain("border-gray-300");
    });
  });
});
