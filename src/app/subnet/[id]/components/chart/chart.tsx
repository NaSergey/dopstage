"use client";

import { rqClient } from "@/shared/api/instance";
import { formatK } from "@/shared/lib/format/formatK";
import { DirectionIcon } from "@/shared/ui/icons";
import { cn } from "@/shared/lib/utils/css";
import ChartView from "./components/chart-view";
import { prepareChartData } from "./utils/prepareChartData";
import { Skeleton } from "@/shared/ui/skeleton";
import ChartSkeleton from "./components/chart-skeleton";
import { DEFAULT_REFETCH_INTERVAL, STALE_TIME_BUFFER } from "@/shared/lib/constants/refetchInterval";
import { refetchInterval, refetchOnReconnect, useErrorState } from "@/shared/lib/error";
import { EmptyState } from "@/shared/ui/empty-state";
import { EmptyText } from "@/shared/ui/empty-text";
import { getValueDirection } from "./utils/getValueDirection";

function Chart({ programId }: { programId: string }) {
  const { ref, height } = useParentHeight<HTMLDivElement>();

  const INTERVAL = Number(process.env.NEXT_PUBLIC_SUBNET_FEED_INTERVAL) || DEFAULT_REFETCH_INTERVAL;

  const { data, isLoading, error, refetch } = rqClient.useQuery(
    "get",
    "/api/v1/program_page/{program_id}/trading_view_chart",
    {
      params: { path: { program_id: programId } },
    },
    {
      enabled: Boolean(programId),
      keepPreviousData: true,
      refetchInterval: refetchInterval(INTERVAL),
      refetchOnReconnect: refetchOnReconnect,
      staleTime: INTERVAL - STALE_TIME_BUFFER,
    },
  );

  const {
    data: headerData,
    isLoading: headerIsLoading,
    error: headerError,
    refetch: refetchHeader,
  } = rqClient.useQuery(
    "get",
    "/api/v1/program_page/{program_id}/trading_view_header",
    {
      params: { path: { program_id: programId } },
    },
    {
      enabled: Boolean(programId),
      keepPreviousData: true,
      refetchInterval: refetchInterval(INTERVAL),
      refetchOnReconnect: refetchOnReconnect,
      staleTime: INTERVAL - STALE_TIME_BUFFER,
    },
  );

  const chartData = useMemo(() => {
    return data?.timestamps?.length && data?.dop_prices?.length ? prepareChartData(data.timestamps, data.dop_prices) : [];
  }, [data]);


  const isAllLoading = isLoading || headerIsLoading;
  const chartError = !isLoading && error;
  const hasHeaderError = !headerIsLoading && headerError;
  const hasAnyError = chartError || hasHeaderError;

  const anyError = error || headerError;
  const { hasError, showReload, is422: is422Error } = useErrorState(anyError, isLoading || headerIsLoading);
  const showReloadButton = !is422Error && hasError && showReload;

  const handleReload = () => {
    refetch();
    refetchHeader();
  };

  const dop_price_delta = getValueDirection(headerData?.dop_price_delta);
  const athTokenPriceDeltaDirection = getValueDirection(headerData?.ath_token_price_delta);

  return (
    <div className="bg-black min-w-0 relative w-full h-full" ref={ref}>
      <div className="grid grid-cols-4 gap-5 max-w-[560px] px-4 absolute top-6 left-0 bg-black/50 z-10">
        <div className="flex flex-col gap-0.5">
          <h4 className="text-sm leading-sm text-zinc-500">DPrice</h4>
          {isAllLoading ? (
            <Skeleton className="w-[76px] h-8 rounded-none" />
          ) : (
            <DopValue>
              <EmptyText
                value={headerData?.dop_price}
                formatter={formatK}
                className={cn(
                  "text-2xl text-white leading-2xl font-medium w-auto px-0.5",
                  {
                    "text-white": hasAnyError,
                    "text-lime-500 bg-lime-500/30": dop_price_delta === "up",
                    "text-red-500 bg-destructive/30": dop_price_delta === "down",
                  },
                )}
              />
            </DopValue>
          )}
          {isAllLoading ? (
            <Skeleton className="w-[51px] h-5 rounded-none" />
          ) : (
            dop_price_delta !== "neutral" && !hasAnyError && (
              <p
                className={cn(
                  "text-sm leading-sm font-medium flex gap-0.5 items-center",
                  {
                    "text-lime-500": dop_price_delta === "up",
                    "text-red-500": dop_price_delta === "down",
                  },
                )}
              >
                <DirectionIcon direction={dop_price_delta} />
                <EmptyText
                  value={headerData?.dop_price_delta ?? 0}
                  formatter={toPercent}
                />
              </p>
            )
          )}
        </div>

        <div className="flex flex-col gap-0.5">
          <h4 className="text-sm leading-sm text-zinc-500"> Price (ATH)</h4>
          {isAllLoading ? (
            <Skeleton className="w-[90px] h-8 rounded-none" />
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-2xl">$</span>
              <EmptyText
                value={headerData?.ath_token_price}
                formatter={formatK}
                className="text-2xl leading-2xl font-medium text-white"
              />
            </div>
          )}
          {isAllLoading ? (
            <Skeleton className="w-[51px] h-5 rounded-none" />
          ) : (
            athTokenPriceDeltaDirection !== "neutral" && !hasAnyError && (
              <p
                className={cn(
                  "text-sm leading-sm font-medium flex gap-0.5 items-center",
                  {
                    "text-green-500": athTokenPriceDeltaDirection === "up",
                    "text-red-500": athTokenPriceDeltaDirection === "down",
                  },
                )}
              >
                <DirectionIcon direction={athTokenPriceDeltaDirection} />
                <EmptyText
                  value={headerData?.ath_token_price_delta}
                  formatter={toPercent}
                />
              </p>
            )
          )}
        </div>

        <div className="flex flex-col gap-0.5">
          <h4 className="text-sm leading-sm text-zinc-500">Total DScore</h4>
          {isAllLoading ? (
            <Skeleton className="w-[93px] h-8 rounded-none" />
          ) : (
            <EmptyText
              value={headerData?.total_dop_score_volume}
              formatter={formatK}
              className="text-2xl leading-2xl font-medium text-white"
            />
          )}
        </div>

        <div className="flex flex-col gap-0.5">
          <h4 className="text-sm leading-sm text-zinc-500">Tweet Price</h4>
          {isAllLoading ? (
            <Skeleton className="w-[127px] h-8 rounded-none" />
          ) : (
            <DopValue>
              <EmptyText
                value={headerData?.avg_dops_per_dop_score}
                formatter={formatK}
                className="text-2xl leading-2xl font-medium text-white"
              />
            </DopValue>
          )}
        </div>
      </div>

      <div className="w-full h-full min-w-0 overflow-hidden">
        {isAllLoading ? (
          <div className="absolute top-24 left-4 right-4 bottom-4 z-10">
            <ChartSkeleton />
          </div>
        ) : chartError || hasHeaderError ? (
          <EmptyState
            title={is422Error ? "Nothing found here :(" : "Something went wrong, please reload"}
            onReload={showReloadButton ? handleReload : undefined}
          />
        ) : (
          chartData &&
          chartData.length > 0 && (
            <div
              key={programId}
              className="w-full  min-w-0 relative h-full"
              style={{ height: height }}
            >
              <ChartView data={chartData} />
            </div>
          )
        )}
      </div>
    </div>
  );
}

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import toPercent from "@/shared/lib/format/toPercent";
import DopValue from "@/shared/ui/dops-value";


export function useParentHeight<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const self = ref.current;
    if (!self) return;
    const parent = self.parentElement;
    if (!parent) return;

    const update = () => setHeight(parent.clientHeight);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(parent);

    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return { ref, height };
}

export default Chart;
