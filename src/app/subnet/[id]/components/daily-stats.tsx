"use client";

import { rqClient } from "@/shared/api/instance";
import { refetchInterval, refetchOnReconnect, useErrorState } from "@/shared/lib/error";
import { LONG_REFETCH_INTERVAL, STALE_TIME_BUFFER } from "@/shared/lib/constants/refetchInterval";
import StatsCard from "./stats-card/stats-card";
import toPercent from "@/shared/lib/format/toPercent";
import { formatK } from "@/shared/lib/format/formatK";
import { cn } from "@/shared/lib/utils/css";
import { EmptyState } from "@/shared/ui/empty-state";
import { DopIcon } from "@/shared/ui/icons";
import { useMemo } from "react";

function DailyStats({
  programId,
  className,
}: {
  programId: string;
  className?: string;
}) {
  const INTERVAL = Number(process.env.NEXT_PUBLIC_SUBNET_FEED_INTERVAL) || LONG_REFETCH_INTERVAL;

  const { data, isLoading, error, refetch } = rqClient.useQuery(
    "get",
    "/api/v1/program_page/{program_id}/daily_stats",
    {
      params: { path: { program_id: programId } },
    },
    {
      enabled: Boolean(programId),
      keepPreviousData: true,
      refetchInterval: refetchInterval(INTERVAL),
      staleTime: INTERVAL - STALE_TIME_BUFFER,
      refetchOnReconnect: refetchOnReconnect,
    },
  );

  const { hasError, showReload, is422 } = useErrorState(error, isLoading);

  const statsConfig = useMemo(() => {
    const avgDailyTweetsChart = data?.avg_daily_tweets_chart ?? [];
    const dailyDopScoreChart = data?.daily_dop_score_chart ?? [];
    const avgDopsPerUserChart = data?.avg_dops_per_user_chart ?? [];
    const avgTweetDopScoreChart = data?.avg_tweet_dop_score_chart ?? [];
    const dailyTddChart = data?.daily_tdd_chart ?? [];
    const engagementChart = data?.engagement_chart ?? [];

    return [
      {
        title: "Tweet DScore",
        tooltipContent: "Something",
        value: formatK(
          avgTweetDopScoreChart[avgTweetDopScoreChart.length - 1] ?? 0,
        ),
        data: avgTweetDopScoreChart,
      },
      {
        title: "Daily Total DScore",
        tooltipContent: "Something",
        value: formatK(dailyDopScoreChart[dailyDopScoreChart.length - 1] ?? 0),
        data: dailyDopScoreChart,
      },
      {
        title: "Dops per User",
        tooltipContent: "Something",
        value: (
          <>
            {formatK(avgDopsPerUserChart[avgDopsPerUserChart.length - 1] ?? 0)}
            <DopIcon className="size-3.5 shrink-0" />
          </>
        ),
        data: avgDopsPerUserChart,
      },
      {
        title: "Daily Tweets",
        value: formatK(
          avgDailyTweetsChart[avgDailyTweetsChart.length - 1] ?? 0,
        ),
        data: avgDailyTweetsChart,
      },
      {
        title: "Daily Dops Supply",
        tooltipContent: "Something",
        value: (
          <>
            {formatK(dailyTddChart[dailyTddChart.length - 1] ?? 0)}
            <DopIcon className="size-3.5 shrink-0" />
          </>
        ),
        data: dailyTddChart,
      },
      {
        title: "Engagement Rate",
        tooltipContent: "Something",
        value: `${toPercent(engagementChart[engagementChart.length - 1] ?? 0)}`,
        data: engagementChart,
      },
    ];
  }, [data]);

  return (
    <div
      className={cn(
        `py-2 [@media(max-height:800px)]:py-2 px-2 bg-zinc-900 border-t border-r border-zinc-950 grid grid-cols-2 justify-center   
      relative gap-x-2 [@media(max-height:800px)]:gap-x-1 [@media(max-height:700px)]:gap-x-0.5 gap-y-1 [@media(max-height:800px)]:gap-y-0.5 [@media(max-height:700px)]:gap-y-0.5`,
        (!hasError || is422) && [
          "after:content-['']",
          "after:absolute",
          "after:inset-y-0",
          "after:left-1/2",
          "after:-translate-x-1/2",
          "after:w-px",
          "after:bg-zinc-950",
        ],
        className,
      )}
    >
      {hasError && !is422 ? (
        <div className="col-span-2 flex items-center justify-center min-h-[200px]">
          <EmptyState
            showIcon={false}
            onReload={showReload ? () => refetch() : undefined}
            className="h-auto"
          />
        </div>
      ) : (
        statsConfig.map((stat, index) => (
          <StatsCard
            key={index}
            isFetching={isLoading}
            title={stat.title}
            tooltipContent={stat.tooltipContent}
            value={stat.value}
            data={stat.data}
            showOnlyTitle={is422}
            className={index % 2 === 1 ? "pl-1" : undefined}
          />
        ))
      )}
    </div>
  );
}

export default DailyStats;
