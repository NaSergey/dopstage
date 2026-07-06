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

// Registering/activating the Service Worker occasionally hiccups on its first
// attempt (slow activation, browser throttling, timing right after a fresh
// deploy). There is no real backend behind NEXT_PUBLIC_API_URL in the mock
// build, so letting a request fall through on the very first failure turns a
// transient hiccup into a guaranteed, page-wide error (every panel fetches on
// mount and shares this same gate). Retry a few times before giving up.
const MAX_START_ATTEMPTS = 3;
const RETRY_DELAY_MS = 300;

let startPromise: Promise<void> | null = null;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startWorkerWithRetry(): Promise<void> {
  const { worker } = await import("./browser");

  for (let attempt = 1; attempt <= MAX_START_ATTEMPTS; attempt++) {
    try {
      await worker.start({ onUnhandledRequest: "bypass" });
      return;
    } catch (error) {
      const isLastAttempt = attempt === MAX_START_ATTEMPTS;
      console.error(
        `Failed to start MSW worker (attempt ${attempt}/${MAX_START_ATTEMPTS}):`,
        error,
      );
      if (isLastAttempt) throw error;
      await sleep(RETRY_DELAY_MS);
    }
  }
}

export function enableMocking(): Promise<void> {
  // No mocking, or running on the server (SSR uses the Node MSW server started
  // from instrumentation.ts): there is nothing to wait for.
  if (!MOCKING_ENABLED || typeof window === "undefined") {
    return Promise.resolve();
  }

  if (!startPromise) {
    startPromise = startWorkerWithRetry().catch((error) => {
      // Don't permanently wedge requests if startup fails: log, reset so a
      // later call can retry, and let the request fall through.
      console.error("MSW worker failed to start after retries:", error);
      startPromise = null;
    });
  }

  return startPromise;
}
