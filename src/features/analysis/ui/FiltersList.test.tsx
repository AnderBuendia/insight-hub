import { describe, expect, it, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { AnalysisFilters } from "@/domain";
import { FiltersList } from "@/features/analysis/ui/FiltersList";

afterEach(() => {
  cleanup();
});

describe("FiltersList", () => {
  it("renders the empty state when there are no active filters", () => {
    render(<FiltersList filters={{}} />);

    expect(screen.getByText("No active filters.")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("renders the category filter", () => {
    const filters: AnalysisFilters = { category: "even" };

    render(<FiltersList filters={filters} />);

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText("category")).toBeInTheDocument();
    expect(screen.getByText("even")).toBeInTheDocument();
  });

  it("renders the date range filter", () => {
    const filters: AnalysisFilters = {
      dateRange: {
        from: "2026-03-01",
        to: "2026-03-29",
      },
    };

    render(<FiltersList filters={filters} />);

    expect(screen.getByText("date")).toBeInTheDocument();
    expect(screen.getByText("2026-03-01")).toBeInTheDocument();
    expect(screen.getByText("2026-03-29")).toBeInTheDocument();
  });

  it("renders both filters when category and date range are present", () => {
    const filters: AnalysisFilters = {
      category: "odd",
      dateRange: {
        from: "2026-03-10",
        to: "2026-03-20",
      },
    };

    render(<FiltersList filters={filters} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("odd")).toBeInTheDocument();
    expect(screen.getByText("2026-03-10")).toBeInTheDocument();
    expect(screen.getByText("2026-03-20")).toBeInTheDocument();
  });
});
