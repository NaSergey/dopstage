export function withAlpha(color: string, alpha: number): string {
  if (color.startsWith("rgba")) {
    const m = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)/);
    if (m) return `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${alpha})`;
  }
  if (color.startsWith("rgb")) {
    const m = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (m) return `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${alpha})`;
  }
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    const hex6 = hex.length === 8 ? hex.slice(0, 6) : hex;
    if (hex6.length === 6) {
      const r = parseInt(hex6.slice(0, 2), 16);
      const g = parseInt(hex6.slice(2, 4), 16);
      const b = parseInt(hex6.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  }
  return color;
}

export function reduceOpacity(color: string): string {
  return withAlpha(color, 0.3);
}

export function hslToHex(
  hue: number,
  saturation: number,
  lightness: number,
): string {
  const s = saturation / 100;
  const l = lightness / 100;

  const k = (n: number) => (n + hue / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  const toHex = (x: number) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

export function generateBrightColor(index: number): string {
  const GOLDEN_ANGLE = 137.508;
  const hue = (index * GOLDEN_ANGLE) % 360;
  const saturation = 85;
  const lightness = 55;

  return hslToHex(hue, saturation, lightness);
}

// --- Persistent receptor colors in localStorage ---

const RECEPTOR_COLORS_STORAGE_KEY = "receptors:colors";
type ReceptorColorsMap = Record<string, string>;

function readReceptorColors(): ReceptorColorsMap {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(RECEPTOR_COLORS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return parsed as ReceptorColorsMap;
    }
    return {};
  } catch {
    return {};
  }
}

function writeReceptorColors(map: ReceptorColorsMap): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      RECEPTOR_COLORS_STORAGE_KEY,
      JSON.stringify(map),
    );
  } catch {
    // ignore quota / access errors
  }
}

/**
 * Returns stable color for receptor id.
 * Creates and persists new bright color if there is no stored value.
 */
export function getOrCreateReceptorColor(
  receptorId: string,
  fallbackIndex: number,
): string {
  // On server we can't access localStorage – just return deterministic color.
  if (typeof window === "undefined") {
    return generateBrightColor(fallbackIndex);
  }

  const map = readReceptorColors();
  const existing = map[receptorId];
  if (existing) return existing;

  const color = generateBrightColor(fallbackIndex);
  map[receptorId] = color;
  writeReceptorColors(map);
  return color;
}