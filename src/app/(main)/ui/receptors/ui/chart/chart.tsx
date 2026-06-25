"use client";

import { useState, useMemo, useEffect } from "react";
import { ViewToggle, type ViewToggleOption } from "@/shared/ui/view-toggle";
import SubnetsChart from "./ui/subnets-chart";
import TopSubnetChart from "./ui/top-subnet-chart";
import { ChartDataResponse } from "./model/types";
import { adaptPoolShareItemsToSeries } from "./lib/adapter-data";
import { CHART_CONFIG } from "./model/chart-config";

type ChartViewType = "subnets" | "top10";

const CHART_VIEW_OPTIONS: ViewToggleOption<ChartViewType>[] = [
  { value: "top10", label: "Top 10 Subnets" },
  { value: "subnets", label: "Subnets" },
];

interface ChartProps {
  data: ChartDataResponse;
  onReady?: () => void;
}

function Chart({ data, onReady }: ChartProps) {
  const [chartView, setChartView] = useState<ChartViewType>("top10");

  useEffect(() => {
    const rafId = requestAnimationFrame(() => onReady?.());
    return () => cancelAnimationFrame(rafId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const top10AdaptedData = useMemo(() => {
    const excluded = CHART_CONFIG.EXCLUDED_SUBNET.toLowerCase();
    const top10Raw = [...data]
      .filter((item) => item.program_name.toLowerCase() !== excluded)
      .sort((a, b) => (b.history.at(-1)?.daily_tdd ?? 0) - (a.history.at(-1)?.daily_tdd ?? 0))
      .slice(0, CHART_CONFIG.TOP_N);
    return adaptPoolShareItemsToSeries(top10Raw);
  }, [data]);

  const allAdaptedData = useMemo(
    () => (chartView === "subnets" ? adaptPoolShareItemsToSeries(data) : null),
    [chartView, data],
  );

  return (
    <div className="flex flex-col h-full w-full">
      <ViewToggle
        options={CHART_VIEW_OPTIONS}
        value={chartView}
        onChange={setChartView}
        className="px-2 pt-0 pb-1 shrink-0"
      />
      <div className="flex-1 min-h-0 relative">
        {chartView === "subnets" ? (
          <SubnetsChart data={allAdaptedData ?? []} />
        ) : (
          <TopSubnetChart data={top10AdaptedData} />
        )}
      </div>
    </div>
  );
}

export default Chart;
