/**
 * Next.js instrumentation hook. Starts the Node-side MSW server so that
 * server components / SSR `fetch` calls are mocked when API mocking is enabled.
 */
export async function register() {
  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.NEXT_PUBLIC_API_MOCKING === "enabled"
  ) {
    const { server } = await import("@/shared/mocks/server");
    server.listen({ onUnhandledRequest: "bypass" });
  }
}
