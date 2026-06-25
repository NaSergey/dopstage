import type { ISeriesApi, MouseEventParams, Time } from "lightweight-charts";

export function pickHoveredId(
  param: MouseEventParams<Time>,
  idBySeries: Map<ISeriesApi<"Line">, string>,
): string | null {
  if (!param.point || !param.time || param.point.x < 0 || param.point.y < 0) {
    return null;
  }

  const anySeries = idBySeries.keys().next().value as
    | ISeriesApi<"Line">
    | undefined;
  if (!anySeries) return null;

  const price = anySeries.coordinateToPrice(param.point.y);
  if (typeof price !== "number") return null;

  const items: Array<{ id: string; cum: number }> = [];
  param.seriesData.forEach((seriesData, apiSeries) => {
    const id = idBySeries.get(apiSeries as ISeriesApi<"Line">);
    const v = (seriesData as { value?: unknown } | undefined)?.value;
    if (id && typeof v === "number") items.push({ id, cum: v });
  });

  if (items.length === 0) return null;
  items.sort((a, b) => a.cum - b.cum);

  for (const it of items) {
    if (price <= it.cum) return it.id;
  }
  return null;
}
  