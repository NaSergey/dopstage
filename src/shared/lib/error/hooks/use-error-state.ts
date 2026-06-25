import { useMemo } from "react";
import { HttpErrorCode } from "../error-codes";
import { getErrorStatus } from "../get-error-status";
import { isNoSuchUserError } from "../business/no-such-user.error";
import { shouldShowReload } from "../ui/reload-policy";

export function useErrorState(error: unknown, isLoading: boolean) {
  return useMemo(() => {
    const errorStatus = error ? getErrorStatus(error) : null;

    return {
      hasError: Boolean(!isLoading && error),
      errorStatus,
      showReload: error ? shouldShowReload(error) : false,
      isNoSuchUser: error ? isNoSuchUserError(error) : false,
      is404: errorStatus === HttpErrorCode.NotFound,
      is422: errorStatus === HttpErrorCode.UnprocessableEntity,
    };
  }, [error, isLoading]);
}
