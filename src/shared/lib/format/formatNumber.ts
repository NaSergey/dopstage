export function formatNumber(
  value: unknown,
  decimals = 2,
  locale = "en-US",
): string {
  if (value == null) return "";

  const n =
    typeof value === "number"
      ? value
      : Number(String(value).trim().replace(/,/g, ""));

  if (!Number.isFinite(n)) return "";

  const safe = Object.is(n, -0) ? 0 : n;

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: decimals,
  }).format(safe);
}
