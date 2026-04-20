"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Returns a boolean flag that resets itself to `false` after `resetMs`
 * milliseconds. Useful for transient UI feedback (e.g. "Copied!", "Exported!").
 *
 * @param resetMs - How long the flag stays `true`. Defaults to 2000 ms.
 */
export function useTemporaryFlag(resetMs = 2000) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;

    const id = window.setTimeout(() => setActive(false), resetMs);
    return () => window.clearTimeout(id);
  }, [active, resetMs]);

  const trigger = useCallback(() => setActive(true), []);
  const reset = useCallback(() => setActive(false), []);

  return { active, trigger, reset };
}
