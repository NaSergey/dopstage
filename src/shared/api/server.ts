import createFetchClient from "openapi-fetch";
import { ApiPaths } from "./schema";

interface IServerRequestInit extends RequestInit {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Don't block SSR on an unreachable/slow API: fail fast so callers fall back
// to empty/error states instead of hanging until the OS TCP timeout (~100s).
const SERVER_FETCH_TIMEOUT_MS = 5000;

export const serverFetchClient = createFetchClient<ApiPaths>({
  baseUrl: API_URL,
  fetch: async (request, options: IServerRequestInit = {}) => {
    const { headers, signal, ...rest } = options;
    const newHeaders = new Headers(headers);

    const timeoutSignal = AbortSignal.timeout(SERVER_FETCH_TIMEOUT_MS);
    const finalSignal = signal
      ? AbortSignal.any([signal, timeoutSignal])
      : timeoutSignal;

    return fetch(request, { ...rest, headers: newHeaders, signal: finalSignal });
  },
});
