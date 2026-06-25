import { getErrorStatus } from "./get-error-status";
import { NOT_FOUND_STATUSES, NO_SUCH_USER_STATUSES } from "./error-codes";

// Re-export core and UI/business helpers so components keep a single import path
export { getErrorStatus } from "./get-error-status";
export { shouldShowReload } from "./ui/reload-policy";
export { isNoSuchUserError } from "./business/no-such-user.error";
export { useErrorState } from "./hooks/use-error-state";

/** React Query state shape for error checking (query.state.error) */
export type QueryState = { state: { error: unknown } };

/**
 * Checks if the query error matches any of the specified HTTP status codes.
 * General predicate: pass statuses, get (query) => boolean.
 */
export function isErrorOfType(query: QueryState, statuses: number[]): boolean {
  const errorStatus = query.state.error ? getErrorStatus(query.state.error) : null;
  return errorStatus !== null && statuses.includes(errorStatus);
}

/**
 * Query wrapper: true if query error is 404 (Not Found).
 * Use in refetchInterval, refetch, placeholderData instead of isErrorOfType(query, [404]).
 */
export function isNotFoundError(query: QueryState): boolean {
  return isErrorOfType(query, [...NOT_FOUND_STATUSES]);
}

/**
 * Creates refetch interval predicate that stops refetching on 404/422 errors.
 * Usage: refetchInterval: createRefetchInterval(30000)
 */
export function refetchInterval(ms: number) {
  return (query: QueryState): false | number => {
    return isErrorOfType(query, [...NO_SUCH_USER_STATUSES]) ? false : ms;
  };
}

/**
 * Refetch on reconnect unless error is 404.
 */
export function refetchOnReconnect(query: QueryState): boolean {
  return !isErrorOfType(query, [...NOT_FOUND_STATUSES]);
}
