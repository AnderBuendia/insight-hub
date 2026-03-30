import { describe, expect, it, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { Metric } from "@/domain";
import { MetricsList } from "@/features/analysis/ui/MetricsList";

afterEach(() => {
  cleanup();
});

describe("MetricsList", () => {
  it("renders the empty state when there are no metrics", () => {
    render(<MetricsList metrics={[]} />);

    expect(screen.getByText("No metrics available")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("renders domain metrics with their labels and formatted values", () => {
    const metrics: Metric[] = [
      { type: "total", value: 120 },
      { type: "count", value: 3 },
      { type: "average", value: 40 },
    ];

    render(<MetricsList metrics={metrics} />);

    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Count")).toBeInTheDocument();
    expect(screen.getByText("Average")).toBeInTheDocument();
    expect(screen.getByText("120.00")).toBeInTheDocument();
    expect(screen.getByText("3.00")).toBeInTheDocument();
    expect(screen.getByText("40.00")).toBeInTheDocument();
  });

  it("renders one list item per metric", () => {
    const metrics: Metric[] = [
      { type: "total", value: 10 },
      { type: "count", value: 2 },
    ];

    render(<MetricsList metrics={metrics} />);

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});
