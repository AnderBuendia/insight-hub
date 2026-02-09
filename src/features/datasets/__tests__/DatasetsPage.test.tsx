import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

import { DatasetsPage } from "@/features/datasets/page/DatasetsPage";
import { DatasetsInfra } from "@/infra";

// ✅ Mock Next.js navigation hooks (because we use useRouter/useSearchParams in the page)
vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({ replace: vi.fn() }),
    useSearchParams: () => new URLSearchParams(""),
  };
});

describe("DatasetsPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders datasets when infra returns success", async () => {
    // 1) Arrange: make infra return datasets
    vi.spyOn(DatasetsInfra, "listDatasets").mockResolvedValue({
      ok: true,
      data: [
        { id: "ds_1", name: "Dataset One", description: "Desc 1" },
        { id: "ds_2", name: "Dataset Two", description: "Desc 2" },
      ],
    });

    // 2) Act: render the page
    render(<DatasetsPage />);

    // 3) Assert: we should eventually see dataset names
    expect(await screen.findByText("Dataset One")).toBeInTheDocument();
    expect(screen.getByText("Dataset Two")).toBeInTheDocument();
  });

  it("renders an error state when infra fails", async () => {
    // 1) Arrange: make infra return error
    vi.spyOn(DatasetsInfra, "listDatasets").mockResolvedValue({
      ok: false,
      error: { code: "UNEXPECTED", message: "Boom" },
    });

    // 2) Act
    render(<DatasetsPage />);

    // 3) Assert: error message and retry button show up
    expect(await screen.findByText(/Failed to load datasets/i)).toBeInTheDocument();
    expect(screen.getByText(/Boom/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Retry|Reload/i })).toBeInTheDocument();
  });
});
