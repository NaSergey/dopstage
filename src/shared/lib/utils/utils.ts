export const isTrueOrNull = (v: boolean | null | undefined) =>
  v === true || v === null;

export function truncateAddress(
  address: string,
  opts: { head?: number; tail?: number; ellipsis?: string } = {},
): string {
  const { head = 5, tail = 5, ellipsis = "..." } = opts;

  if (!address) return "";
  const a = address.trim();

  // If it's already short enough, return as-is
  if (a.length <= head + tail + ellipsis.length) return a;

  return `${a.slice(0, head)}${ellipsis}${a.slice(-tail)}`;
}
