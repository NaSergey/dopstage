"use client";

import InfoPanel from "./ui/info-panel";
import { ReceptorSelectionProvider } from "./model/receptor-selection-context";
import { rqClient } from "@/shared/api/instance";
import { LONG_REFETCH_INTERVAL, STALE_TIME_BUFFER } from "@/shared/lib/constants/refetchInterval";
import { EmptyState } from "@/shared/ui/empty-state";
import { refetchInterval, refetchOnReconnect } from "@/shared/lib/error";
import Chart from "./ui/chart/chart";
import { ChartDataResponse, DopsDistributionStatsResponse } from "./ui/chart/model/types";
import { InfoPanelSkeleton } from "./receptors-skeleton";
import LoadingMask from "./ui/chart/ui/loading-mask";
import { useState } from "react";

interface ReceptorsClientProps {
  // Optional: when omitted the component fetches on the client (no SSR seed).
  initialSubnetsChartData?: ChartDataResponse;
  initialGeneralInfoData?: DopsDistributionStatsResponse | null;
}

function ReceptorsClient({
  initialSubnetsChartData = [],
  initialGeneralInfoData = null,
}: ReceptorsClientProps) {
  const [isChartReady, setIsChartReady] = useState(false);
  const INTERVAL = Number(process.env.NEXT_PUBLIC_SUBNET_FEED_INTERVAL) || LONG_REFETCH_INTERVAL;

  const {
    data: subnetsChartData = initialSubnetsChartData,
    error: subnetsChartError,
    isLoading: isChartLoading,
    refetch: refetchSubnetsChart,
  } = rqClient.useQuery(
    "get",
    "/api/v1/main_page/pool_share_graph",
    {
      params: { query: { top: "all", timerange: "all" } },
    },
    {
      // Only seed from SSR when it actually returned rows. If SSR yielded an
      // empty array, leave initialData undefined so the client fetches on mount
      // (otherwise React Query treats [] as "data exists" and never fetches —
      // leaving the chart permanently empty).
      initialData: initialSubnetsChartData.length
        ? initialSubnetsChartData
        : undefined,
      keepPreviousData: true,
      refetchInterval: refetchInterval(INTERVAL),
      refetchOnReconnect: refetchOnReconnect,
      staleTime: INTERVAL - STALE_TIME_BUFFER,
    },
  );

  const {
    data: generalInfoData,
    error: generalInfoError,
    isLoading: isGeneralLoading,
  } = rqClient.useQuery(
    "get",
    "/api/v1/main_page/dops_distribution_stats",
    {},
    {
      initialData: initialGeneralInfoData ?? undefined,
      keepPreviousData: true,
      refetchInterval: refetchInterval(INTERVAL),
      refetchOnReconnect: refetchOnReconnect,
      staleTime: INTERVAL - STALE_TIME_BUFFER,
    },
  );

  const hasPanelError = generalInfoError || !generalInfoData;

  // Keep one stable loading state until the chart canvas is mounted AND real
  // data has arrived for both queries. Decoupling this from `isChartReady`
  // alone is what removes the "skeleton vanishes → black gap → content" flash:
  // the mask/skeleton now stay put until there's actually something to show.
  const hasChartData = Array.isArray(subnetsChartData) && subnetsChartData.length > 0;
  const isInitialLoading =
    !isChartReady ||
    (isChartLoading && !hasChartData) ||
    (isGeneralLoading && !generalInfoData);

  return (
    <ReceptorSelectionProvider>
      <div className="w-full flex justify-between mt-1 bg-[#09090B] h-[252px]">
        <div className="relative flex-grow h-full w-full">
          {isInitialLoading && !subnetsChartError && <LoadingMask />}
          {subnetsChartError ? (
            <>
              <div className="absolute top-0 left-0 w-full h-full" />
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <EmptyState
                  showIcon={false}
                  onReload={refetchSubnetsChart}
                  title="Error loading chart data"
                  className="h-auto mb-4"
                />
              </div>
            </>
          ) : (
            <Chart data={subnetsChartData} onReady={() => setIsChartReady(true)} />
          )}
        </div>

        <div className="w-[583px] [@media(max-width:1500px)]:w-[472px] shrink-0 ml-6">
          {isInitialLoading ? (
            <InfoPanelSkeleton />
          ) : hasPanelError ? (
            <EmptyState
              showIcon={false}
              title="Error loading data"
              className="h-auto"
              description="Please reload the page"
            />
          ) : (
            <InfoPanel
              generalInfoData={generalInfoData}
              receptors={subnetsChartData}
            />
          )}
        </div>
      </div>
    </ReceptorSelectionProvider>
  );
}

export default ReceptorsClient;
