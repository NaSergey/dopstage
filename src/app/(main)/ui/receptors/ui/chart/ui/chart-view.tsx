"use client";

import { cn } from "@/shared/lib/utils/css";
import { useEffect, useRef, useState } from "react";
import {
  type IChartApi,
  type ISeriesApi,
} from "lightweight-charts";

import { useReceptorSelection } from "../../../model/receptor-selection-context";
import type { OthersSummary, ReceptorSeriesData } from "../model/types";
import { createReceptorChart } from "../lib/create-receptor-chart";
import { useLabelsOverlay } from "../hooks/use-labels-overlay";
import { useStackedAreaSeries } from "../hooks/use-stacked-area-series";
import { LabelsOverlay } from "./labels-overlay";


interface ChartViewProps {
  data: ReceptorSeriesData[];
  othersSummary: OthersSummary;
  className?: string;
}

function ChartView({ data, othersSummary, className }: ChartViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartApiRef = useRef<IChartApi | null>(null);
  const [chartReadyTick, setChartReadyTick] = useState(0);

  const seriesByIdRef = useRef<Map<string, ISeriesApi<"Line">>>(new Map());
  const idBySeriesRef = useRef<Map<ISeriesApi<"Line">, string>>(new Map());

  const hoveredSeriesIdRef = useRef<string | null>(null);

  const { selectedReceptorId, setSelectedReceptorId } = useReceptorSelection();

  const { scheduleUpdate: scheduleLabelsUpdate, items: labelItems, hoveredId } = useLabelsOverlay({
    seriesByIdRef,
    hoveredSeriesIdRef,
    selectedReceptorId,
    data,
    othersSummary,
  });

  const {
    handleCrosshairMove,
    handleSeriesClick,
    removeAllSeries,
    resetHover,
  } =
    useStackedAreaSeries({
      chartReadyTick,
      chartApiRef,
      containerRef,
      data,
      selectedReceptorId,
      onSelect: setSelectedReceptorId,
      seriesByIdRef,
      idBySeriesRef,
      hoveredSeriesIdRef,
      onOverlayUpdate: scheduleLabelsUpdate,
    });

  // Chart initialization
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (chartApiRef.current) return;

    const chart = createReceptorChart(container);
    chartApiRef.current = chart;
    // Defer setState to avoid react-hooks/set-state-in-effect (cascading renders).
    const rafId = requestAnimationFrame(() => setChartReadyTick((x) => x + 1));

    chart.subscribeCrosshairMove(handleCrosshairMove);
    chart.subscribeClick(handleSeriesClick);

    const ts = chart.timeScale();

    const onRangeOrSize = () => scheduleLabelsUpdate();
    ts.subscribeVisibleTimeRangeChange(onRangeOrSize);
    ts.subscribeSizeChange(onRangeOrSize);

    const onWheel = () => scheduleLabelsUpdate();
    container.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      chart.unsubscribeCrosshairMove(handleCrosshairMove);
      chart.unsubscribeClick(handleSeriesClick);

      ts.unsubscribeVisibleTimeRangeChange(onRangeOrSize);
      ts.unsubscribeSizeChange(onRangeOrSize);
      container.removeEventListener("wheel", onWheel);

      removeAllSeries(chart);
      resetHover();

      chartApiRef.current = null;
      chart.remove();
    };
  }, [
    handleCrosshairMove,
    handleSeriesClick,
    removeAllSeries,
    resetHover,
    scheduleLabelsUpdate,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full", className)}
    >
      <LabelsOverlay
        items={labelItems}
        hoveredId={hoveredId}
        selectedId={selectedReceptorId}
      />
    </div>
  );
}

export default ChartView;
