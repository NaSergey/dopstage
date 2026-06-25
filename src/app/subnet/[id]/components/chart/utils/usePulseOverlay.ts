import { useCallback, useEffect, useRef } from "react";
import type { IChartApi } from "lightweight-charts";

type Point = { x: number; y: number };

function hexToRgb(hex: string) {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  if (Number.isNaN(n) || full.length !== 6) return { r: 0, g: 183, b: 255 };
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function usePulseOverlay({
  containerRef,
  chartRef,
  getPoint,
  color = "#00B7FF",
  enabled = true,
  zIndex = 50,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  chartRef: React.RefObject<IChartApi | null>;
  getPoint: () => Point | null;
  color?: string;
  enabled?: boolean;
  zIndex?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pointRef = useRef<Point | null>(null);
  const getPointRef = useRef(getPoint);
  getPointRef.current = getPoint;

  const { r, g, b } = hexToRgb(color);

  const sync = useCallback(() => {
    pointRef.current = getPointRef.current();
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    const chart = chartRef.current;
    if (!container || !chart) return;

    container.style.position = "relative";

    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = String(zIndex);
    container.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext("2d");
    const start = performance.now();

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    const draw = (t: number) => {
      rafRef.current = requestAnimationFrame(draw);
      if (!ctx) return;

      sync();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const p = pointRef.current;
      if (!p) return;

      const dpr = window.devicePixelRatio || 1;
      const x = p.x * dpr;
      const y = p.y * dpr;

      const s = (t - start) / 1000;
      const k = (Math.sin(s * Math.PI * 2) + 1) / 2; // 0..1

      const core = 3.5 * dpr;
      const outer = (6 + k * 8) * dpr;
      const alpha = 0.12 + (1 - k) * 0.18;

      ctx.beginPath();
      ctx.arc(x, y, outer, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, core, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},0.95)`;
      ctx.fill();
    };

    resize();
    sync();

    const ro = new ResizeObserver(() => {
      resize();
      sync();
    });
    ro.observe(container);

    const ts = chart.timeScale();
    const onChange = () => sync();
    ts.subscribeVisibleTimeRangeChange(onChange);
    ts.subscribeSizeChange(onChange);

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      try {
        ts.unsubscribeVisibleTimeRangeChange(onChange);
        ts.unsubscribeSizeChange(onChange);
      } catch {}

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;

      canvas.remove();
      canvasRef.current = null;
      pointRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chartRef and containerRef are stable ref objects; adding them is misleading
  }, [enabled, zIndex, r, g, b, sync]);
}
