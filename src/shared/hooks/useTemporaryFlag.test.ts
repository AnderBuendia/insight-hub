import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, renderHook } from "@testing-library/react";

import { useTemporaryFlag } from "@/shared/hooks/useTemporaryFlag";

describe("useTemporaryFlag", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it("starts with active = false", () => {
    const { result } = renderHook(() => useTemporaryFlag());

    expect(result.current.active).toBe(false);
  });

  it("sets active = true when trigger is called", () => {
    const { result } = renderHook(() => useTemporaryFlag());

    act(() => result.current.trigger());

    expect(result.current.active).toBe(true);
  });

  it("resets active to false after the default 2000 ms", () => {
    const { result } = renderHook(() => useTemporaryFlag());

    act(() => result.current.trigger());
    act(() => vi.advanceTimersByTime(2000));

    expect(result.current.active).toBe(false);
  });

  it("resets active to false after a custom resetMs", () => {
    const { result } = renderHook(() => useTemporaryFlag(500));

    act(() => result.current.trigger());
    act(() => vi.advanceTimersByTime(500));

    expect(result.current.active).toBe(false);
  });

  it("does not reset before the timeout elapses", () => {
    const { result } = renderHook(() => useTemporaryFlag(1000));

    act(() => result.current.trigger());
    act(() => vi.advanceTimersByTime(999));

    expect(result.current.active).toBe(true);
  });
});
