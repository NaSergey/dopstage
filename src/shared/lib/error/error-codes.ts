export enum HttpErrorCode {
  NotFound = 404,
  UnprocessableEntity = 422,
}

/** Single status for 404 checks (e.g. refetch / placeholder) */
export const NOT_FOUND_STATUSES: readonly number[] = [HttpErrorCode.NotFound];

/** Statuses meaning "no such user" (404 Not Found, 422 Validation) */
export const NO_SUCH_USER_STATUSES: readonly number[] = [
  HttpErrorCode.NotFound,
  HttpErrorCode.UnprocessableEntity,
];
  