import type { Time } from "lightweight-charts";

function isBusinessDay(t: Time): t is { year: number; month: number; day: number } {
  return (
    typeof t === "object" &&
    t !== null &&
    "year" in t &&
    "month" in t &&
    "day" in t &&
    typeof (t as { year: unknown }).year === "number" &&
    typeof (t as { month: unknown }).month === "number" &&
    typeof (t as { day: unknown }).day === "number"
  );
}

export function timeKey(t: Time): string {
  if (typeof t === "number") return `n:${t}`;
  if (typeof t === "string") return `s:${t}`;
  if (isBusinessDay(t)) return `d:${t.year}-${t.month}-${t.day}`;
  return `u:${String(t)}`;
}

export function compareTime(a: Time, b: Time): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "string" && typeof b === "string") return a.localeCompare(b);
  if (isBusinessDay(a) && isBusinessDay(b)) {
    if (a.year !== b.year) return a.year - b.year;
    if (a.month !== b.month) return a.month - b.month;
    return a.day - b.day;
  }
  // fallback: keep original order as much as possible
  return 0;
}