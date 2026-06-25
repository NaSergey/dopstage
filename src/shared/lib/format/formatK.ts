import { formatNumber } from "./formatNumber";

export function formatK(value: number | string, decimals?: number): string {
  const n = typeof value === "string" ? Number(value.replace(/,/g, "")) : value;
  if (!Number.isFinite(n)) return String(value);

  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);

  if (abs < 1000) {
    const d = decimals ?? (Number.isInteger(abs) ? 0 : 2);
    return sign + formatNumber(abs, d);
  }

  const isBillion = abs >= 1_000_000_000;
  const isMillion = !isBillion && abs >= 1_000_000;
  let num = isBillion ? abs / 1_000_000_000 : isMillion ? abs / 1_000_000 : abs / 1000;
  let suf = isBillion ? "B" : isMillion ? "M" : "K";

  const d = num >= 100 ? 0 : (decimals ?? 1);

  const factor = 10 ** d;
  let rounded = Math.round(num * factor) / factor;

  if (!isMillion && !isBillion && rounded >= 1000) {
    num = rounded / 1000;
    suf = "kk";
    rounded = Math.round(num * factor) / factor;
  }

  const s = formatNumber(rounded, d);
  return sign + s + suf;
}
