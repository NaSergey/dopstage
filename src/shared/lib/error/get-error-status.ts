import { HttpErrorCode } from "./error-codes";

export interface ErrorWithStatus {
    status?: number;
    statusCode?: number;
    code?: number;
    response?: Response | {
      status?: number;
      statusCode?: number;
      data?: { status?: number };
    };
    data?: { status?: number; statusCode?: number };
    detail?: Array<{ type?: string; loc?: unknown[] }> | string;
  }
  
  export function getErrorStatus(error: unknown): number | null {
    if (!error || typeof error !== "object") return null;
  
    const err = error as ErrorWithStatus & { response?: Response | { status?: number; statusCode?: number } };
  
    if (err.response) {
      if (err.response instanceof Response) return err.response.status;
      const resp = err.response as { status?: number; statusCode?: number; data?: { status?: number } };
      if (typeof resp.status === "number") return resp.status;
      if (typeof resp.statusCode === "number") return resp.statusCode;
      if (resp.data?.status) return resp.data.status;
    }
  
    if (typeof err.status === "number") return err.status;
    if (typeof err.statusCode === "number") return err.statusCode;
    if (typeof err.code === "number" && err.code >= 400 && err.code < 600) return err.code;
  
    if (err.data?.status) return err.data.status;
    if (err.data?.statusCode) return err.data.statusCode;
  
    if (err.detail) {
      if (typeof err.detail === "string" && err.detail.toLowerCase().includes("not found")) return HttpErrorCode.NotFound;
      if (Array.isArray(err.detail) && err.detail.length > 0 && err.detail[0]?.type && Array.isArray(err.detail[0].loc)) {
        return HttpErrorCode.UnprocessableEntity;
      }
    }
  
    return null;
  }
  