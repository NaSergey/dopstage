import { ColorType, LineStyle } from "lightweight-charts";

export const CHART_CONFIG = {
  EXCLUDED_SUBNET: "bittensor",
  TOP_N: 10,
  COLORS: [
    "#e05252", "#e07b2a", "#d4c21a", "#4caf7d", "#26a69a",
    "#4a90d9", "#9b6dd6", "#d95b8a", "#26c6da", "#8bc34a",
  ],
  TOOLTIP_WIDTH: 180,
  TOOLTIP_OFFSET: 12,
  LAYOUT: {
    background: { type: ColorType.Solid, color: "#09090b" },
    textColor: "rgba(255,255,255,0.5)",
    fontSize: 11,
  },
  GRID: {
    vertLines: { color: "rgba(60,60,60,0.6)", style: LineStyle.Dashed },
    horzLines: { color: "rgba(60,60,60,0.6)", style: LineStyle.Dashed },
  },
  RIGHT_PRICE_SCALE: {
    visible: true,
    borderColor: "rgba(255,255,255,0.08)",
    scaleMargins: { top: 0.04, bottom: 0.04 },
  },
  TIME_SCALE: {
    borderColor: "rgba(255,255,255,0.08)",
    fixRightEdge: true,
    fixLeftEdge: true,
    timeVisible: false,
    secondsVisible: false,
  },
  LINE_SERIES: {
    lineWidth: 2,
    priceLineVisible: false,
    lastValueVisible: false,
    crosshairMarkerVisible: false,
    priceScaleId: "right",
  },
  CROSSHAIR_MARKER: {
    radius: 4,
    nearestLineWidth: 3,
    otherLineWidth: 1,
  },
} as const;
