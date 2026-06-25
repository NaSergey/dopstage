import type { LineData, UTCTimestamp } from "lightweight-charts";

/**
 * Generates mock graph data for the last 30 days starting from today
 * @returns Array of LineData for the chart
 */
export function generateGraphData(): LineData[] {
  const days = 90;
  const startValue = 1000;
  const volatility = 0.05;

  const timestamps: number[] = [];
  const values: number[] = [];

  const now = Date.now(); // Current time in milliseconds
  const millisecondsPerDay = 86400000;

  let currentValue = startValue;

  // Generate 30 data points - one per day for the last 30 days
  for (let day = days - 1; day >= 0; day--) {
    const timestamp = now - day * millisecondsPerDay;

    // Generate a random price change using a random walk
    const changePercent = (Math.random() - 0.5) * 2 * volatility;
    currentValue = currentValue * (1 + changePercent);

    // Ensure value stays positive
    if (currentValue < 0.01) {
      currentValue = 0.01;
    }

    timestamps.push(timestamp);
    values.push(Number(currentValue.toFixed(2)));
  }

  // Process data the same way as prepareChartData
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