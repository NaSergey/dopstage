"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  CrosshairMode,
  LineStyle,
  type IChartApi,
  type ISeriesApi,
  type LineData,
  LineSeries,
  LineWidth,
  Time,
} from "lightweight-charts";
import { cn } from "@/shared/lib/utils/css";
import { usePulseOverlay } from "../utils/usePulseOverlay";

export interface ChartViewProps {
  data: LineData[];
  className?: string;
}

const CHART_STYLES = {
  backgroundColor: "transparent",
  textColor: "#c8c8c8",
  borderColor: "rgba(255,255,255,.08)",
  gridLineColor: "rgba(255,255,255,.06)",
  crosshairColor: "rgba(255,255,255,.25)",
  lineColor: "#00B7FF",
  initialBarSpacing: 0.8,
  minBarSpacing: 0.001,
  maxBarSpacing: 50,
  lineWidth: 2 as LineWidth,
};

export default function ChartView({ data, className }: ChartViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const didInitRef = useRef(false);

  // init chart + series once
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (chartRef.current) return; // React 18 StrictMode guard

    const chart = createChart(container, {
      localization: {
        locale: "en-US",
        dateFormat: "yyyy-MM-dd",
        timeFormatter: (time: Time) => {
          const ts = typeof time === "number" ? time : 0;
          const d = new Date(ts * 1000);
          return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
        },
      },
      layout: {
        background: { type: ColorType.Solid, color: CHART_STYLES.backgroundColor },
        textColor: CHART_STYLES.textColor,
      },
      grid: {
        vertLines: { color: CHART_STYLES.gridLineColor },
        horzLines: { color: CHART_STYLES.gridLineColor },
      },
      rightPriceScale: {
        borderColor: CHART_STYLES.borderColor,
        scaleMargins: { top: 0.4, bottom: 0.2 },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: CHART_STYLES.borderColor,
        rightOffset: 10,
        fixLeftEdge: true,
        fixRightEdge: false,
        lockVisibleTimeRangeOnResize: false,
        shiftVisibleRangeOnNewBar: true,
        barSpacing: CHART_STYLES.initialBarSpacing,
        minBarSpacing: CHART_STYLES.minBarSpacing,
        maxBarSpacing: CHART_STYLES.maxBarSpacing,
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
        vertLine: {
          color: CHART_STYLES.crosshairColor,
          style: LineStyle.Solid,
          width: 1,
          labelBackgroundColor: CHART_STYLES.crosshairColor,
        },
        horzLine: {
          color: CHART_STYLES.crosshairColor,
          style: LineStyle.Solid,
          width: 1,
          labelBackgroundColor: CHART_STYLES.crosshairColor,
        },
      },
      handleScroll: { mouseWheel: true, pressedMouseMove: true },
      handleScale: { axisPressedMouseMove: true, pinch: true, mouseWheel: true },
      autoSize: true,
    });

    chartRef.current = chart;

    const series = chart.addSeries(LineSeries, {
      color: CHART_STYLES.lineColor,
      lineWidth: CHART_STYLES.lineWidth,
      lastValueVisible: true,
      priceLineVisible: false,
    });

    seriesRef.current = series;


    return () => {
      seriesRef.current = null;
      chartRef.current = null;
      didInitRef.current = false;
      chart.remove();
    };
  }, []);

  usePulseOverlay({
    containerRef,
    chartRef,
    color: CHART_STYLES.lineColor,
    getPoint: () => {
      const chart = chartRef.current;
      const series = seriesRef.current;
      if (!chart || !series || data.length === 0) return null;

      const last = data[data.length - 1];
      const x = chart.timeScale().timeToCoordinate(last.time as Time);
      const y = series.priceToCoordinate((last as LineData).value);

      if (typeof x !== "number" || typeof y !== "number") return null;
      return { x, y };
    },
  });

  // update data
  useEffect(() => {
    const chart = chartRef.current;
    const series = seriesRef.current;

    if (!series || !chart) return;

    if (!data.length) {
      series.setData([]);
      didInitRef.current = false;
      return;
    }

    series.setData(data);

    if (!didInitRef.current) {
      didInitRef.current = true;
      requestAnimationFrame(() => {
        chart.timeScale().fitContent();
      });
    }

  }, [data]);

  return <div ref={containerRef} className={cn("w-full h-full", className)} />;
}
