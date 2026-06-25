import type {
  IChartApi,
  IPrimitivePaneRenderer,
  IPrimitivePaneView,
  ISeriesApi,
  ISeriesPrimitive,
  SeriesAttachedParameter,
  Time,
} from "lightweight-charts";

import type { ReceptorSeriesData } from "../model/types";
import { timeKey, compareTime } from "./time";
import { withAlpha, reduceOpacity } from "./color";

type BandPoint = { time: Time; lower: number; upper: number };
type Band = { id: string; color: string; points: BandPoint[] };

export function buildStackedBands(data: ReceptorSeriesData[]): Band[] {
  if (data.length === 0) return [];

  // Order series in the stack (lower => closer to 0%).
  const orderedData = data
    .map((s, idx) => ({ s, idx }))
    .sort(
      (a, b) =>
        (a.s.stackOrder ?? 0) - (b.s.stackOrder ?? 0) || a.idx - b.idx,
    )
    .map(({ s }) => s);

  // Collect all times (missing points treated as 0).
  const timeByKey = new Map<string, Time>();
  for (const s of orderedData) {
    for (const p of s.data) {
      const key = timeKey(p.time);
      timeByKey.set(key, p.time);
    }
  }
  let times: Time[] = Array.from(timeByKey.keys())
    .map((k) => timeByKey.get(k)!)
    .sort(compareTime);

  const valueByIdByTime = new Map<string, Map<string, number>>();
  for (const s of orderedData) {
    const m = new Map<string, number>();
    for (const p of s.data) {
      const key = timeKey(p.time);
      const v = (p as { value?: unknown }).value;
      m.set(key, typeof v === "number" && isFinite(v) ? v : 0);
    }
    valueByIdByTime.set(s.id, m);
  }

  // Need at least 2 time points to draw bands. Add a synthetic zero-value
  // point one day before if only one timestamp is available.
  if (times.length === 0) return [];
  if (times.length === 1 && typeof times[0] === "number") {
    const syntheticTime = (times[0] as number) - 86400;
    times = [syntheticTime as Time, times[0]];
    for (const s of orderedData) {
      const m = valueByIdByTime.get(s.id);
      if (m) m.set(timeKey(syntheticTime as Time), 0);
    }
  }

  const bands: Band[] = orderedData.map((s) => ({ id: s.id, color: s.color, points: [] }));

  const MIN_VISUAL_PCT = 17;

  for (const time of times) {
    const key = timeKey(time);
    const raw: number[] = [];
    let total = 0;
    for (let i = 0; i < orderedData.length; i++) {
      const id = orderedData[i].id;
      const v = valueByIdByTime.get(id)?.get(key) ?? 0;
      raw[i] = v;
      total += v;
    }

    const scale = total > 0 ? 100 / total : 0;

    // Apply visual minimum floor: series with any data get at least MIN_VISUAL_PCT%,
    // then renormalize so the stack always sums to 100%.
    const floored = raw.map((v) => (v > 0 ? Math.max(MIN_VISUAL_PCT, v * scale) : 0));
    const flooredTotal = floored.reduce((a, b) => a + b, 0);
    const pcts = flooredTotal > 0 ? floored.map((v) => (v / flooredTotal) * 100) : floored;

    let cum = 0;
    for (let i = 0; i < orderedData.length; i++) {
      const lower = cum;
      cum += pcts[i];
      bands[i].points.push({ time, lower, upper: cum });
    }
  }

  return bands;
}

class StackedAreaRenderer implements IPrimitivePaneRenderer {
  private _bands: Band[] = [];
  private _hoveredId: string | null = null;
  private _selectedId: string | null = null;
  private _chart: IChartApi | null = null;
  private _hostSeries: ISeriesApi<"Line"> | null = null;

  update(params: {
    bands: Band[];
    hoveredId: string | null;
    selectedId: string | null;
    chart: IChartApi | null;
    hostSeries: ISeriesApi<"Line"> | null;
  }) {
    this._bands = params.bands;
    this._hoveredId = params.hoveredId;
    this._selectedId = params.selectedId;
    this._chart = params.chart;
    this._hostSeries = params.hostSeries;
  }

  draw(target: Parameters<IPrimitivePaneRenderer["draw"]>[0]): void {
    const chart = this._chart;
    const hostSeries = this._hostSeries;
    if (!chart || !hostSeries) return;
    if (this._bands.length === 0) return;

    const ts = chart.timeScale();
    const hoveredId = this._hoveredId;
    const selectedId = this._selectedId;
    const hasAnyActive = Boolean(hoveredId || selectedId);

    target.useMediaCoordinateSpace((scope) => {
      const ctx = scope.context;
      const bands = this._bands;

      for (const band of bands) {
        const isActive = hoveredId === band.id || selectedId === band.id;

        const fillColor = hasAnyActive
          ? isActive
            ? withAlpha(band.color, 0.55)
            : withAlpha(reduceOpacity(band.color), 0.18)
          : withAlpha(band.color, 0.35);

        const strokeColor = hasAnyActive
          ? isActive
            ? withAlpha(band.color, 0.95)
            : withAlpha(reduceOpacity(band.color), 0.35)
          : withAlpha(band.color, 0.75);

        const xs: number[] = [];
        const upperYs: number[] = [];
        const lowerYs: number[] = [];

        for (const p of band.points) {
          const x = ts.timeToCoordinate(p.time);
          const yUpper = hostSeries.priceToCoordinate(p.upper);
          const yLower = hostSeries.priceToCoordinate(p.lower);
          if (x == null || yUpper == null || yLower == null) continue;
          xs.push(x);
          upperYs.push(yUpper);
          lowerYs.push(yLower);
        }

        if (xs.length < 2) continue;

        ctx.beginPath();
        ctx.moveTo(xs[0], upperYs[0]);
        for (let i = 1; i < xs.length; i++) ctx.lineTo(xs[i], upperYs[i]);
        for (let i = xs.length - 1; i >= 0; i--) ctx.lineTo(xs[i], lowerYs[i]);
        ctx.closePath();

        ctx.fillStyle = fillColor;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(xs[0], upperYs[0]);
        for (let i = 1; i < xs.length; i++) ctx.lineTo(xs[i], upperYs[i]);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = isActive ? 2 : 1;
        ctx.stroke();
      }
    });
  }
}

class StackedAreaPaneView implements IPrimitivePaneView {
  private _renderer = new StackedAreaRenderer();
  renderer(): IPrimitivePaneRenderer {
    return this._renderer;
  }
  zOrder(): "normal" {
    return "normal";
  }
  update(params: Parameters<StackedAreaRenderer["update"]>[0]) {
    this._renderer.update(params);
  }
}

export class StackedAreaPrimitive implements ISeriesPrimitive<Time> {
  private _chart: IChartApi | null = null;
  private _hostSeries: ISeriesApi<"Line"> | null = null;
  private _requestUpdate: (() => void) | null = null;
  private _paneView = new StackedAreaPaneView();

  private _bands: Band[] = [];
  private _hoveredId: string | null = null;
  private _selectedId: string | null = null;

  paneViews(): readonly IPrimitivePaneView[] {
    return [this._paneView];
  }

  attached(param: SeriesAttachedParameter<Time, "Line">): void {
    this._chart = param.chart as unknown as IChartApi;
    this._hostSeries = param.series as unknown as ISeriesApi<"Line">;
    this._requestUpdate = param.requestUpdate;
    this._requestUpdate?.();
  }

  detached(): void {
    this._chart = null;
    this._hostSeries = null;
    this._requestUpdate = null;
  }

  updateAllViews(): void {
    this._paneView.update({
      bands: this._bands,
      hoveredId: this._hoveredId,
      selectedId: this._selectedId,
      chart: this._chart,
      hostSeries: this._hostSeries,
    });
  }

  setBands(bands: Band[]) {
    this._bands = bands;
    this._requestUpdate?.();
  }

  setActive(hoveredId: string | null, selectedId: string | null) {
    this._hoveredId = hoveredId;
    this._selectedId = selectedId;
    this._requestUpdate?.();
  }
}