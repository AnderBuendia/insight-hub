import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ExportMetricsCsvButton } from "./ExportMetricsCsvButton";

describe("ExportMetricsCsvButton", () => {
  it("calls onExport when clicked", async () => {
    const onExport = vi.fn();

    render(<ExportMetricsCsvButton onExport={onExport} exported={false} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /export csv/i }));

    expect(onExport).toHaveBeenCalled();
  });

  it("shows confirmation text when exported is true", () => {
    render(<ExportMetricsCsvButton onExport={vi.fn()} exported />);

    expect(screen.getByText("CSV exported")).toBeInTheDocument();
  });

  it("shows default hint text when exported is false", () => {
    render(<ExportMetricsCsvButton onExport={vi.fn()} exported={false} />);

    expect(screen.getByText("Download metrics as CSV")).toBeInTheDocument();
  });
});
