import type { LineData, UTCTimestamp } from "lightweight-charts";

export function prepareChartData(
  timestamps: number[],
  values: number[],
): LineData[] {
  const toSec = (t: number) =>
    t > 1e12 ? Math.floor(t / 1000) : Math.floor(t);

  const pairs = timestamps
    .map((t, i) => ({ t: toSec(t), v: values[i] }))
    .filter((p) => Number.isFinite(p.t) && Number.isFinite(p.v));

  pairs.sort((a, b) => a.t - b.t);

  const result: LineData[] = [];
  for (let i = 0; i < pairs.length; i++) {
    const { t, v } = pairs[i];
    if (
      result.length &&
      result[result.length - 1].time === (t as UTCTimestamp)
    ) {
      result[result.length - 1].value = v;
    } else {
      result.push({ time: t as UTCTimestamp, value: v });
    }
  }
  return result;
}
