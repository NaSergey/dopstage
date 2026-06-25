import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/** Node-side MSW server (started from instrumentation for SSR fetches). */
export const server = setupServer(...handlers);
