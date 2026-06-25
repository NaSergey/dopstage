export const MIN_HANDLE_LENGTH = 4;
export const MAX_HANDLE_LENGTH = 15;

export function parseTwitterHandle(
  input: string,
  minLen = MIN_HANDLE_LENGTH,
  maxLen = MAX_HANDLE_LENGTH,
): string {
  if (!input) return "";
  const s = String(input).trim();

  if (s.startsWith("@")) return validate(s.slice(1), minLen, maxLen);

  if (/\b(x\.com|twitter\.com)\b/i.test(s)) {
    const urlLike = s.includes("://") ? s : `https://${s}`;
    try {
      const u = new URL(urlLike);
      const host = u.hostname.replace(/^www\./, "").toLowerCase();
      if (
        host === "x.com" ||
        host === "twitter.com" ||
        host === "mobile.twitter.com"
      ) {
        const seg =
          decodeURIComponent(u.pathname).split("/").filter(Boolean)[0] ?? "";
        return validate(seg.replace(/^@/, ""), minLen, maxLen);
      }
    } catch {}
  }

  return validate(s, minLen, maxLen);
}

export function validate(raw: string, minLen = 1, maxLen?: number): string {
  const normalized = raw.trim().toLowerCase();
  return /^[a-z0-9_]+$/.test(normalized) &&
    normalized.length >= minLen &&
    (maxLen ? normalized.length <= maxLen : true)
    ? normalized
    : "";
}
