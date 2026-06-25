import { HttpErrorCode } from "../error-codes";
import { matchErrorStatus } from "../match-error";

const NO_RELOAD = [HttpErrorCode.UnprocessableEntity] as const;

export function shouldShowReload(error: unknown): boolean {
  return !matchErrorStatus(error, NO_RELOAD);
}
