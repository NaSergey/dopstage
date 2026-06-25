import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LineSeries,
  type IChartApi,
  type ISeriesApi,
  type MouseEventParams,
  type Time,
} from "lightweight-charts";

import type { ReceptorSeriesData } from "../model/types";
import { buildStackedBands, StackedAreaPrimitive } from "../lib/stacked-area";
import { pickHoveredId } from "../lib/pick-hovered-series-id";

const INVISIBLE_LINE_SERIES_OPTIONS = {
  color: "rgba(0,0,0,0)",
  lineWidth: 1,
  lastValueVisible: false,
  priceLineVisible: false,
  crosshairMarkerVisible: false,
  priceScaleId: "left",
  priceFormat: { type: "percent", precision: 1, minMove: 0.1 },
} as const;

/**
 * Manages stacked-area rendering for the receptor chart.
 *
 * Responsibilities:
 * - Build "invisible" line series (used for hit-testing and coordinate mapping).
 * - Attach a `StackedAreaPrimitive` which draws the stacked areas on the chart canvas.
 * - Keep hover and selection state synchronized with the primitive and label overlay.
 *
 * Non-responsibilities:
 * - Does not create/destroy the chart instance itself (that is done by `ChartView`).
 *
 * Selection fallback:
 * - If `selectedReceptorId` is not present in the current series set (e.g. filters
 *   pushed it into an aggregated bucket), we highlight the aggregated bucket instead.
 * - The aggregated bucket is identified by `showLabel === false && isSelectable === false`
 *   (no hardcoded id like "others").
 */
type Args = {
  /** Increment when the chart instance is created (triggers the initial build). */
  chartReadyTick: number;
  chartApiRef: React.RefObject<IChartApi | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;

  data: ReceptorSeriesData[];
  /** Selected receptor id (may refer to a receptor not present in current `data`). */
  selectedReceptorId: string | null;
  /** Called when the user clicks a selectable series. */
  onSelect?: (id: string) => void;

  seriesByIdRef: React.RefObject<Map<string, ISeriesApi<"Line">>>;
  idBySeriesRef: React.RefObject<Map<ISeriesApi<"Line">, string>>;
  hoveredSeriesIdRef: React.RefObject<string | null>;

  onOverlayUpdate?: () => void;
};

export function useStackedAreaSeries({
  chartReadyTick,
  chartApiRef,
  containerRef,
  data,
  selectedReceptorId,
  onSelect,
  seriesByIdRef,
  idBySeriesRef,
  hoveredSeriesIdRef,
  onOverlayUpdate,
}: Args) {
  // Holds the custom stacked-area renderer (draws on the chart canvas).
  const stackedPrimitiveRef = useRef<StackedAreaPrimitive | null>(null);
  const clearHoverRafRef = useRef<number>(0);

  // Mutable refs: allow event handlers/effects to read the latest values without re-subscribing.
  const selectedIdRef = useRef<string | null>(selectedReceptorId);
  const onSelectRef = useRef<((id: string) => void) | undefined>(onSelect);

  // Keep latest values in refs synchronously during render (React event-handler ref pattern).
  // eslint-disable-next-line react-hooks/refs
  onSelectRef.current = onSelect;
  // eslint-disable-next-line react-hooks/refs
  selectedIdRef.current = selectedReceptorId;

  const seriesMetaById = useMemo(
    () => new Map(data.map((d) => [d.id, d] as const)),
    [data],
  );

  /**
   * Force the y-axis to stay in a fixed [0..100] percent range.
   * (Prevents the library from shrinking/expanding the price scale based on series data.)
   */
  const enforceFixedPercentRange = useCallback((chart: IChartApi) => {
    try {
      chart.priceScale("left").setAutoScale(false);
      chart.priceScale("left").setVisibleRange({ from: 0, to: 100 });
    } catch {
      // ignore
    }
    try {
      chart.priceScale("right").setAutoScale(false);
      chart.priceScale("right").setVisibleRange({ from: 0, to: 100 });
    } catch {
      // ignore
    }
  }, []);

  const aggregateBucketId = useMemo(() => {
    const bucket = data.find((d) => d.isSelectable === false && d.showLabel === false);
    return bucket?.id ?? null;
  }, [data]);

  const isSelectable = useCallback(
    (id: string | null): boolean => {
      if (!id) return false;
      return seriesMetaById.get(id)?.isSelectable !== false;
    },
    [seriesMetaById],
  );

  /**
   * Computes what should be highlighted in the chart:
   * - If the selected id exists in current series -> highlight that series.
   * - Otherwise -> highlight the aggregated bucket (if any).
   */
  const resolveHighlightedId = useCallback(
    (selectedId: string | null): string | null => {
      if (!selectedId) return null;

      const lineSeriesById = seriesByIdRef.current;
      if (lineSeriesById?.has(selectedId)) return selectedId;

      if (aggregateBucketId && lineSeriesById?.has(aggregateBucketId)) {
        return aggregateBucketId;
      }

      return null;
    },
    [aggregateBucketId, seriesByIdRef],
  );

  // Used for cursor styling + to trigger primitive updates on hover changes.
  const [hoveredId, setHoveredIdState] = useState<string | null>(null);

  // Updates hovered id (keeps both ref + state in sync).
  const setHoveredId = useCallback(
    (nextHoveredId: string | null) => {
      if (hoveredSeriesIdRef.current === nextHoveredId) return;
      hoveredSeriesIdRef.current = nextHoveredId;
      setHoveredIdState(nextHoveredId);
    },
    [hoveredSeriesIdRef],
  );

  const clearHover = useCallback(() => setHoveredId(null), [setHoveredId]);

  const applyActiveState = useCallback(
    (nextHoveredId: string | null, selectedId: string | null) => {
      const highlightedId = resolveHighlightedId(selectedId);
      stackedPrimitiveRef.current?.setActive(nextHoveredId, highlightedId);
      onOverlayUpdate?.();
    },
    [onOverlayUpdate, resolveHighlightedId],
  );

  // Removes previously created invisible line series.
  const removeAllSeries = useCallback(
    (chart: IChartApi) => {
      const seriesToRemove = Array.from(seriesByIdRef.current.values());
      seriesByIdRef.current.clear();
      idBySeriesRef.current.clear();

      for (const s of seriesToRemove) {
        try {
          chart.removeSeries(s);
        } catch {
          // ignore
        }
      }
    },
    [idBySeriesRef, seriesByIdRef],
  );

  // Crosshair move -> find which band is under the cursor (by y-coordinate).
  const handleCrosshairMove = useCallback(
    (param: MouseEventParams<Time>) => {
      const hoveredId = pickHoveredId(param, idBySeriesRef.current);
      setHoveredId(hoveredId);
    },
    [idBySeriesRef, setHoveredId],
  );

  // Click -> select hovered series if it is selectable.
  const handleSeriesClick = useCallback(() => {
    const id = hoveredSeriesIdRef.current;
    if (!id) return;

    if (!isSelectable(id)) return;
    onSelectRef.current?.(id);
  }, [hoveredSeriesIdRef, isSelectable]);

  /**
   * Builds/updates invisible line series and attaches the primitive.
   * Runs when the chart is ready and whenever `data` changes (filters/time range/count).
   */
  useEffect(() => {
    const chart = chartApiRef.current;
    if (!chart) return;

    removeAllSeries(chart);

    const stackBands = buildStackedBands(data);

    let hostLineSeries: ISeriesApi<"Line"> | null = null;
    let firstLineSeries: ISeriesApi<"Line"> | null = null;

    for (const band of stackBands) {
      const series = chart.addSeries(LineSeries, INVISIBLE_LINE_SERIES_OPTIONS);

      const cumTop = band.points.map((p) => ({ time: p.time, value: p.upper }));
      series.setData(cumTop);

      seriesByIdRef.current.set(band.id, series);
      idBySeriesRef.current.set(series, band.id);

      if (!firstLineSeries) firstLineSeries = series;

      // Prefer attaching the primitive to a "real" series (not the aggregated bucket),
      // so the host has normal label/interaction semantics.
      const meta = seriesMetaById.get(band.id);
      if (!hostLineSeries && meta?.showLabel !== false) hostLineSeries = series;
    }

    if (!hostLineSeries) hostLineSeries = firstLineSeries;

    const primitive = stackedPrimitiveRef.current ?? new StackedAreaPrimitive();
    stackedPrimitiveRef.current = primitive;

    if (hostLineSeries) {
      try {
        hostLineSeries.attachPrimitive(primitive);
      } catch {
        // ignore
      }
    }

    primitive.setBands(stackBands);
    enforceFixedPercentRange(chart);
    applyActiveState(hoveredSeriesIdRef.current, selectedIdRef.current);

    requestAnimationFrame(() => {
      chart.timeScale().fitContent();
    });

    const active = hoveredSeriesIdRef.current;
    if (active && !seriesByIdRef.current.has(active)) {
      clearHoverRafRef.current = requestAnimationFrame(clearHover);
    }

    return () => {
      cancelAnimationFrame(clearHoverRafRef.current);
    };
  }, [
    chartReadyTick,
    chartApiRef,
    applyActiveState,
    data,
    idBySeriesRef,
    hoveredSeriesIdRef,
    clearHover,
    enforceFixedPercentRange,
    removeAllSeries,
    seriesMetaById,
    seriesByIdRef,
  ]);

  /**
   * Keep styles in sync when hover/selection changes:
   * - Cursor: pointer only for selectable series.
   * - Primitive: highlight hovered series and the effective selected series.
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = chartApiRef.current;
    if (chart) enforceFixedPercentRange(chart);

    container.style.cursor = isSelectable(hoveredId) ? "pointer" : "default";

    applyActiveState(hoveredId, selectedReceptorId);
  }, [
    chartApiRef,
    containerRef,
    applyActiveState,
    enforceFixedPercentRange,
    hoveredId,
    isSelectable,
    selectedReceptorId,
  ]);

  return {
    hoveredSeriesId: hoveredId,
    handleCrosshairMove,
    handleSeriesClick,
    removeAllSeries,
    resetHover: clearHover,
  };
}

