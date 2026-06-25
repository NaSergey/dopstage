/**
 * Leaderboard URL/API param mapping.
 * Frontend URL uses: subnet_id, dopaminer_id
 * API expects: program_id, yapper_id
 */

export const FRONTEND_PARAMS = {
  subnet: "subnet_id",
  dopaminer: "dopaminer_id",
} as const;

export const API_PARAMS = {
  program: "program_id",
  yapper: "yapper_id",
} as const;

export function toApiParams(searchParams: URLSearchParams) {
  return {
    [API_PARAMS.program]: searchParams.get(FRONTEND_PARAMS.subnet) ?? undefined,
    [API_PARAMS.yapper]: searchParams.get(FRONTEND_PARAMS.dopaminer) ?? undefined,
  };
}
