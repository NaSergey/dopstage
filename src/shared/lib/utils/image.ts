/**
 * Normalizes an image source string.
 * If it looks like an absolute URL (doesn't start with /) but lacks a protocol,
 * it prepends https://.
 */
export function normalizeImageUrl(src: string | null | undefined): string | null | undefined {
    if (typeof src !== "string" || src.trim() === "") return src;

    const s = src.trim();

    // If it starts with / or already has a protocol/data/blob, return as is
    if (
        s.startsWith("/") ||
        s.startsWith("http://") ||
        s.startsWith("https://") ||
        s.startsWith("data:") ||
        s.startsWith("blob:")
    ) {
        return s;
    }

    // Otherwise, assume it's an absolute URL missing protocol and prepend https://
    return `https://${s}`;
}
