/**
 * Convert hex color to rgba string
 */
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Generate dark shade from base color
 * @param hex - Hex color string (e.g., "#6314FF")
 * @param factor - Darkening factor (0-1), default 0.3
 * @returns Dark shade hex color (e.g., "#2C194D" from "#6314FF" with factor 0.3)
 */
export function generateDarkShade(hex: string, factor: number = 0.3): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const darkR = Math.round(r * factor);
  const darkG = Math.round(g * factor);
  const darkB = Math.round(b * factor);
  return `#${darkR.toString(16).padStart(2, "0")}${darkG.toString(16).padStart(2, "0")}${darkB.toString(16).padStart(2, "0")}`;
}

/**
 * Get share color class from percent value (0..100+)
 * Uses three states: red (0-33%), yellow (33-66%), green (66-100%)
 */
export function getShareColor(percentValue: number): string {
  const normalizedValue = percentValue / 100;
  const clampedValue = Math.max(0, Math.min(1, normalizedValue));

  if (clampedValue < 0.33) return "text-red-400";
  if (clampedValue < 0.66) return "text-yellow-400";
  return "text-green-400";
}
