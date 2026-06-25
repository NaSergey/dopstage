import { HttpErrorCode } from "../error-codes";
import { matchErrorStatus } from "../match-error";

const NO_SUCH_USER = [HttpErrorCode.NotFound, HttpErrorCode.UnprocessableEntity] as const;

export function isNoSuchUserError(error: unknown): boolean {
  return matchErrorStatus(error, NO_SUCH_USER);
}
