/**
 * Starts the browser-side MSW worker exactly once and exposes the in-flight
 * start promise so callers can await readiness.
 *
 * Why this exists: the worker is registered through a Service Worker, and
 * `worker.start()` only resolves once that SW is active and able to intercept
 * requests. Any client fetch issued before that point escapes to the real
 * network (CORS failures / unexpected responses), which surfaced as random
 * "error" states when navigating between pages in the mock build.
 */
const MOCKING_ENABLED = process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

let startPromise: Promise<void> | null = null;

export function enableMocking(): Promise<void> {
  // No mocking, or running on the server (SSR uses the Node MSW server started
  // from instrumentation.ts): there is nothing to wait for.
  if (!MOCKING_ENABLED || typeof window === "undefined") {
    return Promise.resolve();
  }

  if (!startPromise) {
    startPromise = import("./browser")
      .then(({ worker }) => worker.start({ onUnhandledRequest: "bypass" }))
      .then(() => undefined)
      .catch((error) => {
        // Don't permanently wedge requests if startup fails: log, reset so a
        // later call can retry, and let the request fall through.
        console.error("Failed to start MSW worker:", error);
        startPromise = null;
      });
  }

  return startPromise;
}
