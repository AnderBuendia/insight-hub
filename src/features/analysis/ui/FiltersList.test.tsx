import { describe, expect, it, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import { FiltersList } from "@/features/analysis/ui/FiltersList";
import type { InfraFilter } from "@/infra/analysis/types";

describe("FiltersList", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Rendering", () => {
    it("renders empty list when no filters provided", () => {
      // Arrange
      const filters: InfraFilter[] = [];

      // Act
      const { container } = render(<FiltersList filters={filters} />);

      // Assert
      expect(container.querySelector("ul")).toBeInTheDocument();
      expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    });

    it("renders single filter correctly", () => {
      // Arrange
      const filters: InfraFilter[] = [
        {
          id: "f1",
          datasetId: "datasetTest",
          field: "status",
          operator: "eq",
          value: "active",
        },
      ];

      // Act
      render(<FiltersList filters={filters} />);

      // Assert
      expect(screen.getByText("status")).toBeInTheDocument();
      expect(screen.getByText("eq")).toBeInTheDocument();
      expect(screen.getByText("active")).toBeInTheDocument();
    });

    it("renders multiple filters", () => {
      // Arrange
      const filters: InfraFilter[] = [
        {
          id: "f1",
          datasetId: "datasetTest1",
          field: "status",
          operator: "eq",
          value: "active",
        },
        {
          id: "f2",
          datasetId: "datasetTest2",
          field: "price",
          operator: "gt",
          value: "100",
        },
        {
          id: "f3",
          datasetId: "datasetTest3",
          field: "category",
          operator: "contains",
          value: "tech",
        },
      ];

      // Act
      render(<FiltersList filters={filters} />);

      // Assert
      expect(screen.getAllByRole("listitem")).toHaveLength(3);
      expect(screen.getByText("status")).toBeInTheDocument();
      expect(screen.getByText("price")).toBeInTheDocument();
      expect(screen.getByText("category")).toBeInTheDocument();
    });

    it("displays filter field as medium weight text", () => {
      // Arrange
      const filters: InfraFilter[] = [
        {
          id: "f1",
          datasetId: "datasetTest1",
          field: "username",
          operator: "eq",
          value: "john",
        },
      ];

      // Act
      const { container } = render(<FiltersList filters={filters} />);

      // Assert
      const fieldElement = screen.getByText("username");
      expect(fieldElement).toHaveClass("font-medium");
    });

    it("displays filter value in monospace font", () => {
      // Arrange
      const filters: InfraFilter[] = [
        {
          id: "f1",
          datasetId: "datasetTest1",
          field: "code",
          operator: "eq",
          value: "ABC123",
        },
      ];

      // Act
      render(<FiltersList filters={filters} />);

      // Assert
      const valueElement = screen.getByText("ABC123");
      expect(valueElement).toHaveClass("font-mono");
    });
  });

  describe("Props Variations", () => {
    it("handles different operators correctly", () => {
      // Arrange
      const operators: Array<"eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "contains"> = ["eq", "contains", "gte", "lt", "neq"];
      const filters: InfraFilter[] = operators.map((op, idx) => ({
        id: `f${idx}`,
        datasetId: `datasetTest${idx}`,
        field: `field${idx}`,
        operator: op,
        value: `value${idx}`,
      }));

      // Act
      render(<FiltersList filters={filters} />);

      // Assert
      operators.forEach((operator) => {
        expect(screen.getByText(operator)).toBeInTheDocument();
      });
    });

    it("handles special characters in filter values", () => {
      // Arrange
      const filters: InfraFilter[] = [
        {
          id: "f1",
          datasetId: "datasetTest1",
          field: "email",
          operator: "contains",
          value: "test@example.com",
        },
        {
          id: "f2",
          datasetId: "datasetTest2",
          field: "path",
          operator: "eq",
          value: "/api/v1/users",
        },
      ];

      // Act
      render(<FiltersList filters={filters} />);

      // Assert
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
      expect(screen.getByText("/api/v1/users")).toBeInTheDocument();
    });

    it("renders each filter with unique key", () => {
      // Arrange
      const filters: InfraFilter[] = [
        {
          id: "unique1",
          datasetId: "datasetTest1",
          field: "a",
          operator: "eq",
          value: "1",
        },
        {
          id: "unique2",
          datasetId: "datasetTest2",
          field: "b",
          operator: "eq",
          value: "2",
        },
        {
          id: "unique3",
          datasetId: "datasetTest3",
          field: "c",
          operator: "eq",
          value: "3",
        },
      ];

      // Act
      const { container } = render(<FiltersList filters={filters} />);

      // Assert
      const listItems = container.querySelectorAll("li");
      expect(listItems).toHaveLength(3);
    });
  });

  describe("Accessibility", () => {
    it("renders as a list with list items", () => {
      // Arrange
      const filters: InfraFilter[] = [
        {
          id: "f1",
          datasetId: "datasetTest1",
          field: "status",
          operator: "eq",
          value: "active",
        },
      ];

      // Act
      render(<FiltersList filters={filters} />);

      // Assert
      expect(screen.getByRole("list")).toBeInTheDocument();
      expect(screen.getAllByRole("listitem")).toHaveLength(1);
    });
  });
});
