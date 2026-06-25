import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

/** Browser-side MSW worker (started from MswProvider). */
export const worker = setupWorker(...handlers);
