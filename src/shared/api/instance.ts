import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import { ApiPaths } from "./schema/index";
import { enableMocking } from "@/shared/mocks/enable-mocking";

const REAL_API_URL = process.env.NEXT_PUBLIC_API_URL;
// const REAL_API_URL = "http://testing-errors.com";
// const LOCAL_API_URL = "";

const fetchClient = createFetchClient<ApiPaths>({
  baseUrl: REAL_API_URL,
  // Wait for the MSW worker to be ready before issuing any client request.
  // Without this, queries firing on first mount race the worker startup and
  // leak to the real API, showing up as intermittent error states across pages.
  // No-op (resolves immediately) when mocking is disabled.
  fetch: async (request) => {
    await enableMocking();
    return fetch(request);
  },
});

export const rqClient = createClient(fetchClient);
