import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AnalysisSuccess } from "@/features/analysis/ui/AnalysisSuccess";
import type { SnapshotsState } from "@/features/analysis/state/snapshots.types";
import type { AnalysisState } from "@/features/analysis/state/types";
import type { AnalysisSnapshot } from "@/domain";

vi.mock("@/features/ai/page/AIPanel", () => ({
  AIPanel: () => <div data-testid="ai-panel" />,
}));

const defaultAnalysisActions = {
  reload: vi.fn(),
  setFilters: vi.fn(),
};

const defaultSnapshotsState: SnapshotsState = {
  status: "empty",
  snapshots: [],
  selectedId: undefined,
};

const defaultSnapshotsActions = {
  save: vi.fn(),
  select: vi.fn(),
  deleteAll: vi.fn(),
  clearSelection: vi.fn(),
};

const successState: AnalysisState = {
  status: "success",
  datasetId: "ds_1",
  metrics: [
    { type: "total", value: 60 },
    { type: "count", value: 3 },
  ],
  filters: { category: "even" },
};

function renderAnalysisSuccess({
  datasetId = "ds_1",
  analysisState = successState,
  snapshotsState = defaultSnapshotsState,
  selectedSnapshot,
}: {
  datasetId?: string;
  analysisState?: AnalysisState;
  snapshotsState?: SnapshotsState;
  selectedSnapshot?: AnalysisSnapshot;
} = {}) {
  return render(
    <AnalysisSuccess
      datasetId={datasetId}
      analysisState={analysisState}
      analysisActions={defaultAnalysisActions}
      snapshotsState={snapshotsState}
      snapshotsActions={defaultSnapshotsActions}
      selectedSnapshot={selectedSnapshot}
    />,
  );
}

describe("AnalysisSuccess", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it.each(["loading", "idle"] as const)(
    'renders loading state when analysis status is "%s"',
    (status) => {
      renderAnalysisSuccess({
        analysisState: {
          status,
          datasetId: "ds_1",
          metrics: [],
          filters: {},
        },
      });

      expect(screen.getByText("Loading analysis…")).toBeInTheDocument();
    },
  );

  it("renders an error state with retry action", () => {
    renderAnalysisSuccess({
      analysisState: {
        status: "error",
        datasetId: "ds_404",
        metrics: [],
        filters: {},
      },
    });

    expect(
      screen.getByText('Failed to load analysis for dataset "ds_1"'),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("renders metrics, filters and snapshots when analysis is successful", () => {
    renderAnalysisSuccess();

    expect(screen.getByText("Dataset Analysis")).toBeInTheDocument();
    expect(screen.getByText("Dataset: ds_1")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getAllByText("Category").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Snapshots" })).toBeInTheDocument();
  });

  it("shows the restore banner when a snapshot is selected", () => {
    const selectedSnapshot: AnalysisSnapshot = {
      id: "snap_1",
      datasetId: "ds_1",
      createdAt: "2026-03-27T10:00:00.000Z",
      filters: { category: "odd" },
    };

    renderAnalysisSuccess({ selectedSnapshot });

    expect(
      screen.getByText(/restored from snapshot created at/i),
    ).toBeInTheDocument();
  });

  it("clears the selection when the restore banner action is clicked", async () => {
    const selectedSnapshot: AnalysisSnapshot = {
      id: "snap_1",
      datasetId: "ds_1",
      createdAt: "2026-03-27T10:00:00.000Z",
      filters: { category: "odd" },
    };

    renderAnalysisSuccess({ selectedSnapshot });

    await userEvent.click(
      screen.getByRole("button", { name: /use current dataset/i }),
    );

    expect(defaultSnapshotsActions.clearSelection).toHaveBeenCalledOnce();
  });
});
