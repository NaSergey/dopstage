"use client";

import { useEffect, useRef, useMemo, useState, memo } from "react";
import {
  createChart,
  CrosshairMode,
  AreaSeries,
  type MouseEventParams,
  type Time,
  type ISeriesApi,
  type IChartApi,
} from "lightweight-charts";
import type { ReceptorSeriesData } from "../model/types";
import { CHART_CONFIG } from "../model/chart-config";
import TooltipOverlay, { type TooltipState } from "./tooltip-overlay";
import { withAlpha } from "../lib/color";

type SeriesMeta = {
  name: string;
  color: string;
  data: Array<{ time: Time; value: number }>;
  timeMap: Map<Time, number>;
};

interface TopSubnetChartProps {
  data: ReceptorSeriesData[];
}

function TopSubnetChart({ data }: TopSubnetChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesMetaRef = useRef<Map<ISeriesApi<"Area">, SeriesMeta>>(new Map());
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  // Tracks the last highlighted series. applyOptions() re-fires crosshairMove synchronously,
  // but the re-triggered call will compute the same nearestLine and skip applyOptions — breaking the loop.
  const lastNearestRef = useRef<ISeriesApi<"Area"> | null | undefined>(undefined);

  const top10 = useMemo(() => {
    return [...data]
      .filter((s) => s.name.toLowerCase() !== CHART_CONFIG.EXCLUDED_SUBNET)
      .sort((a, b) => (b.data.at(-1)?.value ?? 0) - (a.data.at(-1)?.value ?? 0))
      .slice(0, CHART_CONFIG.TOP_N)
      .map((s, i) => ({
        ...s,
        color: CHART_CONFIG.COLORS[i % CHART_CONFIG.COLORS.length],
        lastValue: s.data.at(-1)?.value ?? 0,
      }));
  }, [data]);

  const top10Ref = useRef(top10);
  useEffect(() => {
    top10Ref.current = top10;
  });

  // Key changes only when the set/order of series changes — not on data updates
  const seriesCompositionKey = useMemo(
    () => top10.map((s) => s.name).join(","),
    [top10],
  );

  // Initialize chart and crosshair once on mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const seriesMeta = seriesMetaRef.current;

    const chart = createChart(container, {
      layout: {
        background: CHART_CONFIG.LAYOUT.background,
        textColor: CHART_CONFIG.LAYOUT.textColor,
        fontSize: CHART_CONFIG.LAYOUT.fontSize,
      },
      grid: CHART_CONFIG.GRID,
      rightPriceScale: CHART_CONFIG.RIGHT_PRICE_SCALE,
      leftPriceScale: { visible: false },
      timeScale: CHART_CONFIG.TIME_SCALE,
      crosshair: {
        mode: CrosshairMode.Normal,
        horzLine: { visible: false },
      },
      handleScroll: { mouseWheel: true, pressedMouseMove: false },
      handleScale: { mouseWheel: false, pinch: false },
      autoSize: true,
    });

    chartRef.current = chart;

    const handleCrosshair = (param: MouseEventParams<Time>) => {
      if (!param.point || !param.time) {
        if (lastNearestRef.current !== null) {
          lastNearestRef.current = null;
          setTooltip(null);
          seriesMetaRef.current.forEach((meta, line) => {
            line.applyOptions({
              crosshairMarkerVisible: false,
              lineWidth: 2,
              lineColor: withAlpha(meta.color, 0.9),
              topColor: withAlpha(meta.color, 0.35),
              bottomColor: withAlpha(meta.color, 0.02),
            });
          });
        }
        return;
      }

      const time = param.time;
      const items: { name: string; value: number; color: string }[] = [];
      let nearestLine: ISeriesApi<"Area"> | null = null;
      let nearestName: string | null = null;
      let minDistance = Infinity;

      seriesMetaRef.current.forEach((meta, line) => {
        const value = meta.timeMap.get(time);
        if (value === undefined) return;

        items.push({ name: meta.name, value, color: meta.color });

        const coord = line.priceToCoordinate(value);
        if (coord !== null && param.point) {
          const dist = Math.abs(coord - param.point.y);
          if (dist < minDistance) {
            minDistance = dist;
            nearestLine = line;
            nearestName = meta.name;
          }
        }
      });

      // Only call applyOptions when the nearest line changes — avoids redundant work
      // and breaks the re-entry loop (applyOptions re-fires crosshairMove synchronously).
      if (nearestLine !== lastNearestRef.current) {
        lastNearestRef.current = nearestLine;
        seriesMetaRef.current.forEach((meta, line) => {
          const isNearest = line === nearestLine;
          line.applyOptions({
            crosshairMarkerVisible: isNearest,
            crosshairMarkerRadius: CHART_CONFIG.CROSSHAIR_MARKER.radius,
            lineWidth: isNearest
              ? CHART_CONFIG.CROSSHAIR_MARKER.nearestLineWidth
              : CHART_CONFIG.CROSSHAIR_MARKER.otherLineWidth,
            lineColor: withAlpha(meta.color, isNearest ? 1 : 0.3),
            topColor: withAlpha(meta.color, isNearest ? 0.55 : 0.08),
            bottomColor: withAlpha(meta.color, 0.02),
          });
        });
      }

      if (items.length > 0) {
        setTooltip({
          x: param.point.x,
          y: param.point.y,
          containerWidth: container.offsetWidth,
          items: items.sort((a, b) => b.value - a.value),
          hoveredName: nearestName,
        });
      }
    };

    chart.subscribeCrosshairMove(handleCrosshair);

    return () => {
      chart.unsubscribeCrosshairMove(handleCrosshair);
      chart.remove();
      setTooltip(null);
      chartRef.current = null;
      seriesMeta.clear();
    };
  }, []);

  // Recreate series only when composition changes (different subnets in top 10)
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || top10.length === 0) return;
    seriesMetaRef.current.forEach((_, line) => chart.removeSeries(line));
    seriesMetaRef.current.clear();
    lastNearestRef.current = undefined;
    setTooltip(null);
    for (const s of top10) {
      const line = chart.addSeries(AreaSeries, {
        lineColor: withAlpha(s.color, 0.9),
        topColor: withAlpha(s.color, 0.35),
        bottomColor: withAlpha(s.color, 0.02),
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
        priceScaleId: "right",
      });
      line.setData(s.data);
      const timeMap = new Map(s.data.map((d) => [d.time, d.value]));
      seriesMetaRef.current.set(line, { name: s.name, color: s.color, data: s.data, timeMap });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seriesCompositionKey]);

  // Update data in place on refetch — no chart recreation
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || top10.length === 0 || seriesMetaRef.current.size !== top10.length) return;
    const seriesEntries = [...seriesMetaRef.current.entries()];
    // If composition changed, the series effect above handles it
    if (seriesEntries.some(([, meta], i) => meta.name !== top10[i].name)) return;
    for (let i = 0; i < top10.length; i++) {
      const [line, meta] = seriesEntries[i];
      const s = top10[i];
      line.setData(s.data);
      const timeMap = new Map(s.data.map((d) => [d.time, d.value]));
      seriesMetaRef.current.set(line, { ...meta, data: s.data, timeMap });
    }
  }, [top10]);

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-0 left-0 w-full h-[calc(100%-24px)] z-[200]">
        <div ref={containerRef} className="w-full h-full" />
        {tooltip && <TooltipOverlay tooltip={tooltip} />}
      </div>
    </div>
  );
}

export default memo(TopSubnetChart);
