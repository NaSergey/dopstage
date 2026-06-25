import {
  createChart,
  ColorType,
  CrosshairMode,
  LineStyle,
  type IChartApi,
} from "lightweight-charts";

const CHART_STYLES = {
  backgroundColor: "#09090b",
  textColor: "white",
  borderColor: "rgba(255,255,255,.08)",
  gridLineColor: "rgba(51,51,51,.6)",
  gridLineStyle: LineStyle.Dashed,
};

export function createReceptorChart(container: HTMLElement): IChartApi {
  const chart = createChart(container, {
    layout: {
      background: {
        type: ColorType.Solid,
        color: CHART_STYLES.backgroundColor,
      },
      textColor: CHART_STYLES.textColor,
    },
    localization: {
      locale: "en-US",
      dateFormat: "yyyy-MM-dd",
    },
    grid: {
      vertLines: {
        color: CHART_STYLES.gridLineColor,
        style: LineStyle.Dashed,
      },
      horzLines: {
        color: CHART_STYLES.gridLineColor,
        style: LineStyle.Dashed,
        visible: true,
      },
    },
    rightPriceScale: {
      visible: false,
      autoScale: false,
    },
    leftPriceScale: {
      visible: true,
      borderColor: CHART_STYLES.borderColor,
      scaleMargins: { top: 0.04, bottom: 0.04 },
      autoScale: false,
      entireTextOnly: true,
      ensureEdgeTickMarksVisible: true,
    },
    timeScale: {
      timeVisible: true,
      secondsVisible: false,
      borderColor: CHART_STYLES.borderColor,
      shiftVisibleRangeOnNewBar: true,
      rightOffset: 0,
      fixRightEdge: true,
      fixLeftEdge: true,
    },
    crosshair: { mode: CrosshairMode.Hidden },
    handleScroll: { mouseWheel: true, pressedMouseMove: false, vertTouchDrag: false },
    handleScale: {
      axisPressedMouseMove: { time: true, price: false },
      axisDoubleClickReset: { time: true, price: false },
      pinch: false,
      mouseWheel: false,
    },
    autoSize: true,
  });

  return chart;
}

  