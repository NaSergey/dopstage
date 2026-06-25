import AppSelect from "@/shared/ui/app-select";
import { useChartFilters, receptorsCountOptions, daysCountOptions } from "../hooks/use-chart-filters";
import ChartView from "./chart-view";
import { ReceptorSeriesData } from "../model/types";

interface SubnetsChartProps {
  data: ReceptorSeriesData[];
}

function SubnetsChart({ data }: SubnetsChartProps) {
  const {
    chartData,
    othersSummary,
    selectedReceptorsCount,
    selectedDaysCount,
    onReceptorsCountChange,
    onDaysCountChange,
  } = useChartFilters(data);
  return (
    <div className="relative h-full w-full">
      <div className="absolute top-0 left-0 w-full h-[calc(100%-24px)] z-[200]">
        <ChartView data={chartData} othersSummary={othersSummary} className="w-full h-full" />
        <div className="flex gap-2 absolute bottom-12 left-16 z-30">
          <AppSelect
            options={receptorsCountOptions}
            value={selectedReceptorsCount}
            onChange={onReceptorsCountChange}
            className="w-32 opacity-70 hover:opacity-100 transition-opacity duration-300"
            contentClassName="z-[500]"
          />
          <AppSelect
            options={daysCountOptions}
            value={selectedDaysCount}
            onChange={onDaysCountChange}
            className="w-32 opacity-70 hover:opacity-100 transition-opacity duration-300"
            contentClassName="z-[500]"
          />
        </div>
      </div>
    </div>
  );
}

export default SubnetsChart;
