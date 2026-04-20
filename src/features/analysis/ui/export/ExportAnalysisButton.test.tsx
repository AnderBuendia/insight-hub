import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ExportAnalysisButton } from "./ExportAnalysisButton";

describe("ExportAnalysisButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("calls onExport when clicked", async () => {
    const onExport = vi.fn();

    render(<ExportAnalysisButton onExport={onExport} exported={false} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /export json/i }));

    expect(onExport).toHaveBeenCalled();
  });

  it("shows confirmation text when exported is true", () => {
    render(<ExportAnalysisButton onExport={vi.fn()} exported />);

    expect(screen.getByText("JSON exported")).toBeInTheDocument();
  });

  it("shows default hint text when exported is false", () => {
    render(<ExportAnalysisButton onExport={vi.fn()} exported={false} />);

    expect(
      screen.getByText("Download the current analysis as JSON"),
    ).toBeInTheDocument();
  });
});
