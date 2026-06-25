import { LineData, Time } from "lightweight-charts";

import type { ChartDataResponse, ReceptorSeriesData } from "../model/types";
import { generateBrightColor } from "./color";

export const adaptPoolShareItemsToSeries = (
  chartData: ChartDataResponse,
): ReceptorSeriesData[] => {
  return chartData.map<ReceptorSeriesData>((item, index) => {
    const color = generateBrightColor(index);

    const data: LineData[] = item.history.map((point: ChartDataResponse[number]["history"][number]) => ({
      time: point.timestamp as Time,
      value: point.daily_tdd,
    }));

    return {
      id: item.program_id,
      name: item.program_name,
      image_url: item.program_image_url ?? null,
      tdd: item.cumulative_tdd,
      color,
      data,
    };
  });
};

