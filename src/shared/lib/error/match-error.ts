import { getErrorStatus } from "./get-error-status";

export function matchErrorStatus(error: unknown, statuses: readonly number[]): boolean {
  const status = getErrorStatus(error);
  return status !== null && statuses.includes(status);
}
