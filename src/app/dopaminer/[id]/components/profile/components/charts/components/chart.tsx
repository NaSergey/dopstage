import toPercent from "@/shared/lib/format/toPercent";
import { cn } from "@/shared/lib/utils/css";
import { getSparklineAverageValue } from "@/shared/ui/sparkline/sparkline-data";
import { RunningArrowIcon } from "@/shared/ui/icons";
import Sparkline from "@/shared/ui/sparkline/sparkline";
import type { SparklineData } from "@/shared/ui/sparkline/types";
import { Skeleton } from "@/shared/ui/skeleton";
import LineMock from "./line-mock";
import { formatK } from "@/shared/lib/format/formatK";
import { ReactNode } from "react";

interface IChartProps {
  title: string;
  subtitle: string;
  delta: number;
  data: SparklineData;
  isLoading: boolean;
  error?: unknown;
  valueIcon?: ReactNode;
}

function Chart({
  title,
  subtitle,
  delta,
  data,
  isLoading,
  error,
  valueIcon,
}: IChartProps) {
  const isUp = delta && delta > 0;
  const value = getSparklineAverageValue(data ?? []);

  return (
    <div className="relative h-full min-h-0">
      <div className="absolute top-1 left-1 z-10 bg-zinc-900/80 backdrop-blur-sm shadow-lg">
        <h4 className="text-base leading-base font-medium">{title}</h4>
        <p className="text-sm leading-sm text-zinc-500">{subtitle}</p>
        {!error && (
          <>
            {isLoading ? (
              <Skeleton className="w-[92px] h-8" />
            ) : (
              <div className="flex items-center gap-1 text-2xl leading-2xl font-medium">
                {formatK(value)}
                {valueIcon}
              </div>
            )}
            {delta !== 0 && (
              <>
                {isLoading ? (
                  <Skeleton className="w-[64px] h-5" />
                ) : (
                  <p
                    className={cn(
                      "flex items-center text-sm leading-sm text-zinc-500",
                      isUp ? "text-lime-500" : "text-red-500",
                    )}
                  >
                    {isUp ? (
                      <RunningArrowIcon variants="up" />
                    ) : (
                      <RunningArrowIcon variants="down" />
                    )}
                    {toPercent(delta ?? 0)}
                  </p>
                )}
              </>
            )}
          </>
        )}
      </div>
      {!error && (
        <div className="w-full h-full min-h-0 flex items-end overflow-hidden">
          {isLoading ? (
            <LineMock className="w-full h-full max-h-[140px] [@media(max-height:800px)]:max-h-[80px]" />
          ) : (
            <Sparkline
              interactive={true}
              data={data ?? []}
              className="w-full h-full max-h-[180px] [@media(max-height:800px)]:max-h-[160px] pt-3 [@media(max-width:1670px)]:pt-2"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Chart;
