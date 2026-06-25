"use client";

import { useEffect, type ReactNode } from "react";
import { enableMocking } from "./enable-mocking";

/**
 * Kicks off the browser-side MSW worker on mount so it is ready as early as
 * possible. Children always render — no SSR/hydration gate. Client requests
 * themselves await worker readiness in `src/shared/api/instance.ts`, so early
 * queries can't race the worker startup and leak to the real network.
 */
export function MswProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    void enableMocking();
  }, []);

  return <>{children}</>;
}
