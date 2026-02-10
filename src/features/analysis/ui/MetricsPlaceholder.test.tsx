import { describe, expect, it, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import { MetricsPlaceholder } from "@/features/analysis/ui/MetricsPlaceholder";

describe("MetricsPlaceholder", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Rendering", () => {
    it("renders placeholder message", () => {
      // Arrange & Act
      render(<MetricsPlaceholder />);

      // Assert
      expect(screen.getByText("Placeholder — metrics will be displayed here.")).toBeInTheDocument();
    });

    it("renders Total Records metric label", () => {
      // Arrange & Act
      render(<MetricsPlaceholder />);

      // Assert
      expect(screen.getByText("Total Records")).toBeInTheDocument();
    });

    it("renders Data Quality metric label", () => {
      // Arrange & Act
      render(<MetricsPlaceholder />);

      // Assert
      expect(screen.getByText("Data Quality")).toBeInTheDocument();
    });
  });

  describe("Placeholder Values", () => {
    it("renders placeholder dash for Total Records", () => {
      // Arrange & Act
      const { container } = render(<MetricsPlaceholder />);

      // Assert
      const firstMetricValue = container.querySelector(".text-2xl");
      expect(firstMetricValue).toHaveTextContent("—");
    });

    it("renders placeholder dashes for both metrics", () => {
      // Arrange & Act
      const { container } = render(<MetricsPlaceholder />);

      // Assert
      const metricValues = container.querySelectorAll(".text-2xl");
      expect(metricValues).toHaveLength(2);
      metricValues.forEach((value) => {
        expect(value).toHaveTextContent("—");
      });
    });
  });

  describe("Structure", () => {
    it("renders two metric cards", () => {
      // Arrange & Act
      const { container } = render(<MetricsPlaceholder />);

      // Assert
      const metricCards = container.querySelectorAll(".rounded-lg.bg-gray-50");
      expect(metricCards).toHaveLength(2);
    });

    it("renders all expected elements", () => {
      // Arrange & Act
      render(<MetricsPlaceholder />);

      // Assert
      expect(screen.getByText("Placeholder — metrics will be displayed here.")).toBeInTheDocument();
      expect(screen.getByText("Total Records")).toBeInTheDocument();
      expect(screen.getByText("Data Quality")).toBeInTheDocument();
    });
  });

  describe("Content Order", () => {
    it("renders Total Records before Data Quality", () => {
      // Arrange & Act
      const { container } = render(<MetricsPlaceholder />);

      // Assert
      const metricLabels = Array.from(container.querySelectorAll(".text-sm.font-medium"));
      expect(metricLabels[0]).toHaveTextContent("Total Records");
      expect(metricLabels[1]).toHaveTextContent("Data Quality");
    });
  });
});
