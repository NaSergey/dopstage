import type { SparklineData, SparklineDataPoint } from "@/shared/ui/sparkline/types";

/** Extract numeric values from SparklineData (handles number[] and { date, value }[]). */
export function getSparklineValues(data: SparklineData): number[] {
  return data.map((d) =>
    typeof d === "object" && d !== null && "value" in d
      ? (d as SparklineDataPoint).value
      : Number(d),
  );
}

/** Type guard: true if element is { date, value } (so tooltip can show date). */
export function isDataPoint(
  d: number | string | SparklineDataPoint,
): d is SparklineDataPoint {
  return typeof d === "object" && d !== null && "value" in d && "date" in d;
}

/** Average of all values; 0 if empty. */
export function getSparklineAverageValue(data: SparklineData): number {
  const values = getSparklineValues(data);
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}
