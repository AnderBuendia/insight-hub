import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAI } from "./useAI";

describe("useAI", () => {
  it("returns disabled state by default", () => {
    // Arrange & Act
    const { result } = renderHook(() => useAI());

    // Assert
    expect(result.current.state.status).toBe("disabled");
  });

  it("returns an actions object", () => {
    // Arrange & Act
    const { result } = renderHook(() => useAI());

    // Assert
    expect(result.current.actions).toBeDefined();
    expect(typeof result.current.actions).toBe("object");
  });

  it("maintains consistent state structure", () => {
    // Arrange & Act
    const { result } = renderHook(() => useAI());

    // Assert
    expect(result.current).toHaveProperty("state");
    expect(result.current).toHaveProperty("actions");
    expect(result.current.state).toHaveProperty("status");
  });
});
