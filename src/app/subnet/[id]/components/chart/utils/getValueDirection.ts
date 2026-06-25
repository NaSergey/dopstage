type ValueDirection = "neutral" | "up" | "down";

export function getValueDirection(value: number | null | undefined): ValueDirection {
  if (value === null || value === undefined) return "neutral";
  return value === 0 ? "neutral" : value > 0 ? "up" : "down";
}