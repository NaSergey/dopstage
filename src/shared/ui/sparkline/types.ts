export type SparklineHoverInfo = {
  index: number;
  x: number;
  y: number;
} | null;

export type SparklineDataPoint = { date: string; value: number };
export type SparklineData = number[] | string[] | SparklineDataPoint[];
