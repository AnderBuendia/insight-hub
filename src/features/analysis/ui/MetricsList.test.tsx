import { describe, expect, it, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import { MetricsList } from "@/features/analysis/ui/MetricsList";
import type { InfraMetric } from "@/infra/analysis/types";

describe("MetricsList", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Rendering", () => {
    it("renders empty list when no metrics provided", () => {
      // Arrange
      const metrics: InfraMetric[] = [];

      // Act
      const { container } = render(<MetricsList metrics={metrics} />);

      // Assert
      expect(container.querySelector("ul")).toBeInTheDocument();
      expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    });

    it("renders single metric correctly", () => {
      // Arrange
      const metrics: InfraMetric[] = [
        {
          id: "m1",
          datasetId: "ds1",
          name: "Total Sales",
          kind: "currency",
          description: "Sum of all sales",
        },
      ];

      // Act
      render(<MetricsList metrics={metrics} />);

      // Assert
      expect(screen.getByText("Total Sales")).toBeInTheDocument();
      expect(screen.getByText("currency")).toBeInTheDocument();
      expect(screen.getByText("Sum of all sales")).toBeInTheDocument();
    });

    it("renders multiple metrics", () => {
      // Arrange
      const metrics: InfraMetric[] = [
        { id: "m1", datasetId: "ds1", name: "Revenue", kind: "currency" },
        { id: "m2", datasetId: "ds2", name: "Count", kind: "number" },
        { id: "m3", datasetId: "ds3", name: "Average", kind: "percentage" },
      ];

      // Act
      render(<MetricsList metrics={metrics} />);

      // Assert
      expect(screen.getAllByRole("listitem")).toHaveLength(3);
      expect(screen.getByText("Revenue")).toBeInTheDocument();
      expect(screen.getByText("Count")).toBeInTheDocument();
      expect(screen.getByText("Average")).toBeInTheDocument();
    });

    it("renders metric without description", () => {
      // Arrange
      const metrics: InfraMetric[] = [
        { id: "m1", datasetId: "ds1", name: "Simple Metric", kind: "number" },
      ];

      // Act
      render(<MetricsList metrics={metrics} />);

      // Assert
      expect(screen.getByText("Simple Metric")).toBeInTheDocument();
      expect(screen.getByText("number")).toBeInTheDocument();
      expect(screen.queryByText(/description/i)).not.toBeInTheDocument();
    });

    it("displays metric name as medium weight text", () => {
      // Arrange
      const metrics: InfraMetric[] = [
        { id: "m1", datasetId: "ds1", name: "Total Orders", kind: "number" },
      ];

      // Act
      render(<MetricsList metrics={metrics} />);

      // Assert
      const nameElement = screen.getByText("Total Orders");
      expect(nameElement).toHaveClass("font-medium");
    });

    it("displays metric kind as small gray text", () => {
      // Arrange
      const metrics: InfraMetric[] = [
        { id: "m1", datasetId: "ds1", name: "Metric Name", kind: "percentage" },
      ];

      // Act
      render(<MetricsList metrics={metrics} />);

      // Assert
      const kindElement = screen.getByText("percentage");
      expect(kindElement).toHaveClass("text-xs", "text-gray-500");
    });
  });

  describe("Props Variations", () => {
    it("handles different metric kinds", () => {
      // Arrange
      const kinds: Array<"number" | "currency" | "percentage"> = [
        "number",
        "currency",
        "percentage",
      ];
      const metrics: InfraMetric[] = kinds.map((kind, idx) => ({
        id: `m${idx}`,
        datasetId: `ds${idx}`,
        name: `Metric ${idx}`,
        kind,
      }));

      // Act
      render(<MetricsList metrics={metrics} />);

      // Assert
      kinds.forEach((kind) => {
        expect(screen.getByText(kind)).toBeInTheDocument();
      });
    });

    it("renders metrics with and without descriptions", () => {
      // Arrange
      const metrics: InfraMetric[] = [
        {
          id: "m1",
          datasetId: "ds1",
          name: "With Description",
          kind: "currency",
          description: "Has description",
        },
        {
          id: "m2",
          datasetId: "ds2",
          name: "Without Description",
          kind: "number",
        },
        {
          id: "m3",
          datasetId: "ds3",
          name: "Also With",
          kind: "percentage",
          description: "Another description",
        },
      ];

      // Act
      render(<MetricsList metrics={metrics} />);

      // Assert
      expect(screen.getByText("Has description")).toBeInTheDocument();
      expect(screen.getByText("Another description")).toBeInTheDocument();
      expect(screen.getAllByRole("listitem")).toHaveLength(3);
    });

    it("handles empty string description", () => {
      // Arrange
      const metrics: InfraMetric[] = [
        {
          id: "m1",
          datasetId: "ds1",
          name: "Empty Desc",
          kind: "number",
          description: "",
        },
      ];

      // Act
      render(<MetricsList metrics={metrics} />);

      // Assert
      expect(screen.getByText("Empty Desc")).toBeInTheDocument();
      expect(
        screen.queryByText("Empty Desc")?.nextElementSibling,
      ).not.toHaveTextContent("");
    });

    it("renders each metric with unique key", () => {
      // Arrange
      const metrics: InfraMetric[] = [
        { id: "unique1", datasetId: "ds1", name: "A", kind: "number" },
        { id: "unique2", datasetId: "ds2", name: "B", kind: "currency" },
        { id: "unique3", datasetId: "ds3", name: "C", kind: "percentage" },
      ];

      // Act
      const { container } = render(<MetricsList metrics={metrics} />);

      // Assert
      const listItems = container.querySelectorAll("li");
      expect(listItems).toHaveLength(3);
    });

    it("handles long metric names and descriptions", () => {
      // Arrange
      const longName =
        "This is a very long metric name that might wrap to multiple lines";
      const longDescription =
        "This is a very long description that provides detailed information about what this metric represents and how it is calculated";
      const metrics: InfraMetric[] = [
        {
          id: "m1",
          datasetId: "ds1",
          name: longName,
          kind: "currency",
          description: longDescription,
        },
      ];

      // Act
      render(<MetricsList metrics={metrics} />);

      // Assert
      expect(screen.getByText(longName)).toBeInTheDocument();
      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("renders as a list with list items", () => {
      // Arrange
      const metrics: InfraMetric[] = [
        {
          id: "m1",
          datasetId: "datasetTest1",
          name: "Metric 1",
          kind: "number",
        },
        {
          id: "m2",
          datasetId: "datasetTest2",
          name: "Metric 2",
          kind: "number",
        },
      ];

      // Act
      render(<MetricsList metrics={metrics} />);

      // Assert
      expect(screen.getByRole("list")).toBeInTheDocument();
      expect(screen.getAllByRole("listitem")).toHaveLength(2);
    });
  });
});
