import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ScenarioControls } from "@/features/datasets/ui/ScenarioControls";
import { DatasetsInfra } from "@/infra";

describe("ScenarioControls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Rendering", () => {
    it("renders all scenario control buttons", () => {
      // Arrange
      const onReload = vi.fn();

      // Act
      render(<ScenarioControls onReload={onReload} />);

      // Assert: all three scenario buttons should be present
      expect(screen.getByRole("button", { name: "success" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "empty" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "error" })).toBeInTheDocument();
    });

    it("displays scenario label", () => {
      // Arrange
      const onReload = vi.fn();

      // Act
      render(<ScenarioControls onReload={onReload} />);

      // Assert
      expect(screen.getByText("Scenario:")).toBeInTheDocument();
    });

    it("initially marks success scenario as selected", () => {
      // Arrange
      const onReload = vi.fn();

      // Act
      render(<ScenarioControls onReload={onReload} />);

      // Assert: success button should be pressed by default
      expect(screen.getByRole("button", { name: "success" })).toHaveAttribute(
        "aria-pressed",
        "true"
      );
      expect(screen.getByRole("button", { name: "empty" })).toHaveAttribute(
        "aria-pressed",
        "false"
      );
      expect(screen.getByRole("button", { name: "error" })).toHaveAttribute(
        "aria-pressed",
        "false"
      );
    });
  });

  describe("User Interactions", () => {
    it("calls setDatasetsScenario and onReload when success button clicked", async () => {
      // Arrange
      const onReload = vi.fn();
      const setScenarioSpy = vi.spyOn(DatasetsInfra, "setDatasetsScenario");
      const user = userEvent.setup();

      // Act
      render(<ScenarioControls onReload={onReload} />);
      const successButton = screen.getByRole("button", { name: "success" });
      await user.click(successButton);

      // Assert
      expect(setScenarioSpy).toHaveBeenCalledWith("success");
      expect(onReload).toHaveBeenCalledTimes(1);
    });

    it("calls setDatasetsScenario and onReload when empty button clicked", async () => {
      // Arrange
      const onReload = vi.fn();
      const setScenarioSpy = vi.spyOn(DatasetsInfra, "setDatasetsScenario");
      const user = userEvent.setup();

      // Act
      render(<ScenarioControls onReload={onReload} />);
      const emptyButton = screen.getByRole("button", { name: "empty" });
      await user.click(emptyButton);

      // Assert
      expect(setScenarioSpy).toHaveBeenCalledWith("empty");
      expect(onReload).toHaveBeenCalledTimes(1);
    });

    it("calls setDatasetsScenario and onReload when error button clicked", async () => {
      // Arrange
      const onReload = vi.fn();
      const setScenarioSpy = vi.spyOn(DatasetsInfra, "setDatasetsScenario");
      const user = userEvent.setup();

      // Act
      render(<ScenarioControls onReload={onReload} />);
      const errorButton = screen.getByRole("button", { name: "error" });
      await user.click(errorButton);

      // Assert
      expect(setScenarioSpy).toHaveBeenCalledWith("error");
      expect(onReload).toHaveBeenCalledTimes(1);
    });

    it("updates aria-pressed state when different scenario is selected", async () => {
      // Arrange
      const onReload = vi.fn();
      vi.spyOn(DatasetsInfra, "setDatasetsScenario");
      const user = userEvent.setup();

      // Act
      render(<ScenarioControls onReload={onReload} />);
      const emptyButton = screen.getByRole("button", { name: "empty" });
      await user.click(emptyButton);

      // Assert: empty button should now be pressed
      expect(screen.getByRole("button", { name: "success" })).toHaveAttribute(
        "aria-pressed",
        "false"
      );
      expect(screen.getByRole("button", { name: "empty" })).toHaveAttribute(
        "aria-pressed",
        "true"
      );
      expect(screen.getByRole("button", { name: "error" })).toHaveAttribute(
        "aria-pressed",
        "false"
      );
    });

    it("maintains state across multiple scenario changes", async () => {
      // Arrange
      const onReload = vi.fn();
      const setScenarioSpy = vi.spyOn(DatasetsInfra, "setDatasetsScenario");
      const user = userEvent.setup();

      // Act: click through all scenarios
      render(<ScenarioControls onReload={onReload} />);
      
      await user.click(screen.getByRole("button", { name: "empty" }));
      await user.click(screen.getByRole("button", { name: "error" }));
      await user.click(screen.getByRole("button", { name: "success" }));

      // Assert: all scenarios should have been set and reload called each time
      expect(setScenarioSpy).toHaveBeenCalledTimes(3);
      expect(setScenarioSpy).toHaveBeenNthCalledWith(1, "empty");
      expect(setScenarioSpy).toHaveBeenNthCalledWith(2, "error");
      expect(setScenarioSpy).toHaveBeenNthCalledWith(3, "success");
      expect(onReload).toHaveBeenCalledTimes(3);
    });

    it("allows selecting the same scenario multiple times", async () => {
      // Arrange
      const onReload = vi.fn();
      const setScenarioSpy = vi.spyOn(DatasetsInfra, "setDatasetsScenario");
      const user = userEvent.setup();

      // Act
      render(<ScenarioControls onReload={onReload} />);
      const successButton = screen.getByRole("button", { name: "success" });
      
      await user.click(successButton);
      await user.click(successButton);

      // Assert: should call both functions each time
      expect(setScenarioSpy).toHaveBeenCalledTimes(2);
      expect(onReload).toHaveBeenCalledTimes(2);
    });
  });

  describe("Accessibility", () => {
    it("uses button type to prevent form submission", () => {
      // Arrange
      const onReload = vi.fn();

      // Act
      render(<ScenarioControls onReload={onReload} />);

      // Assert: all buttons should have type="button"
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveAttribute("type", "button");
      });
    });

    it("uses aria-pressed to indicate active scenario", () => {
      // Arrange
      const onReload = vi.fn();

      // Act
      render(<ScenarioControls onReload={onReload} />);

      // Assert: only one button should be pressed at a time
      const successButton = screen.getByRole("button", { name: "success" });
      const emptyButton = screen.getByRole("button", { name: "empty" });
      const errorButton = screen.getByRole("button", { name: "error" });

      expect(successButton).toHaveAttribute("aria-pressed", "true");
      expect(emptyButton).toHaveAttribute("aria-pressed", "false");
      expect(errorButton).toHaveAttribute("aria-pressed", "false");
    });

    it("provides clear button labels for screen readers", () => {
      // Arrange
      const onReload = vi.fn();

      // Act
      render(<ScenarioControls onReload={onReload} />);

      // Assert: button text content should be clear and descriptive
      expect(screen.getByRole("button", { name: "success" })).toHaveTextContent("success");
      expect(screen.getByRole("button", { name: "empty" })).toHaveTextContent("empty");
      expect(screen.getByRole("button", { name: "error" })).toHaveTextContent("error");
    });
  });
});
