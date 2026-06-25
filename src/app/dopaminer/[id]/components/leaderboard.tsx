"use client";

import { ApiComponents } from "@/shared/api/schema";
import { useParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { useTableNavigation, TABLE_PATHS } from "@/shared/lib/hooks/useTableNavigation";
import { cn } from "@/shared/lib/utils/css";
import { rqClient } from "@/shared/api/instance";
import { refetchInterval, refetchOnReconnect, useErrorState } from "@/shared/lib/error";
import { DataTable } from "@/shared/ui/data-table";
import { LONG_REFETCH_INTERVAL, STALE_TIME_BUFFER } from "@/shared/lib/constants/refetchInterval";
import {
  ArrowIcon,
  DopIcon,
  InfoIcon,
  RunningArrowIcon,
  SadIcon,
} from "@/shared/ui/icons";
import { formatK } from "@/shared/lib/format/formatK";
import mockIcon from "@/shared/assets/mock-icon.svg";
import AppTooltip from "@/shared/ui/app-tooltip";
import { Skeleton } from "@/shared/ui/skeleton";
import toPercent from "@/shared/lib/format/toPercent";
import { useMemo } from "react";
import { AppImage } from "@/shared/ui/app-image";
import MaximizeLink from "@/shared/ui/maximize-link";
import { EmptyState } from "@/shared/ui/empty-state";

type TLeaderboardResponse = ApiComponents["YapperPageLeaderboardResponse"];

const PAGE_SIZE = 20;

const useLeaderboard = () => {
  const { id } = useParams<{ id: string }>();

  const INTERVAL = Number(process.env.NEXT_PUBLIC_SUBNET_FEED_INTERVAL) || LONG_REFETCH_INTERVAL;

  const { data, fetchNextPage, hasNextPage, isLoading, error, refetch } =
    rqClient.useInfiniteQuery(
      "get",
      "/api/v1/yapper_page/yapper/leaderboard",
      {
        params: { query: { yapper_id: id, limit: PAGE_SIZE, sort_by: "rank", direction: "asc" } },
      },
      {
        enabled: Boolean(id),
        keepPreviousData: true,
        refetchInterval: refetchInterval(INTERVAL),
        refetchOnReconnect: refetchOnReconnect,
        staleTime: INTERVAL - STALE_TIME_BUFFER,
        initialPageParam: 1,
        pageParamName: "page",
        getNextPageParam: (
          lastPage: TLeaderboardResponse,
          allPages: TLeaderboardResponse[]
        ) => {
          if (!lastPage.leaderboard || lastPage.leaderboard.length < PAGE_SIZE)
            return undefined;
          return allPages.length + 1;
        },
      },
    );

  const leaderboard = useMemo(
    () => data?.pages.flatMap((page) => page.leaderboard ?? []) ?? [],
    [data],
  );
  return {
    leaderboard,
    fetchNextPage,
    hasNextPage,
    isLoading,
    error,
    refetch,
  };
};

function Leaderboard() {
  const { leaderboard, fetchNextPage, hasNextPage, isLoading, error, refetch } =
    useLeaderboard();
  const { id: yapperId } = useParams<{ id: string }>();
  const handleRowClick = useTableNavigation(TABLE_PATHS.dopaminerYapper);
  const { hasError, showReload, is422: is422Error } = useErrorState(error, isLoading);

  const columnsWithYapperId = useMemo(() => getColumns(), []);

  return (
    <div className="grid grid-rows-[auto_1fr] bg-zinc-950 h-full min-h-0 min-w-0 relative">
      <MaximizeLink href={`/leaderboard?dopaminer_id=${yapperId}`} />
      <h2 className="px-3 py-3 mb-1 text-base leading-none font-medium">
        Leaderboard
      </h2>
      <DataTable
        className="pb-3 px-0.5 leaderboard-table"
        headerClassName="bg-zinc-950 hover:bg-zinc-950"
        columns={columnsWithYapperId}
        data={leaderboard}
        onLoadMore={fetchNextPage}
        hasMore={hasNextPage}
        isLoading={isLoading}
        rowClassName={(row) => cn(
          "hover:bg-[#6314FF66] cursor-pointer group transition-colors",
          row.yapper_id === yapperId && "leaderboard-row-active"
        )}
        onRowClick={handleRowClick}
        loadingContent={
          <div className="grid gap-[1px] absolute left-0 right-0 top-9.5">
            <Skeleton className="w-full h-10 rounded-none" />
            <Skeleton className="w-full h-10 rounded-none" />
            <Skeleton className="w-full h-10 rounded-none" />
            <Skeleton className="w-full h-10 rounded-none" />
            <Skeleton className="w-full h-10 rounded-none" />
            <Skeleton className="w-full h-10 rounded-none" />
            <Skeleton className="w-full h-10 rounded-none" />
            <Skeleton className="w-full h-10 rounded-none" />
            <Skeleton className="w-full h-10 rounded-none" />
          </div>
        }
        onErrorContent={
          hasError && (is422Error || showReload)
            ? is422Error
              ? (
                <div className="flex min-h-[200px] flex-col items-center justify-center text-zinc-600">
                  <div className="text-sm leading-sm">
                    <p>No active programs here :(</p>
                  </div>
                </div>
              )
              : (
                <div className="flex min-h-[200px] flex-col items-center justify-center">
                  <EmptyState
                    showIcon={true}
                    title="Something went wrong, please reload"
                    onReload={() => refetch()}
                    className="h-auto"
                  />
                </div>
              )
            : undefined
        }
        noDataContent={
          <div className="flex min-h-[200px] flex-col items-center justify-center text-zinc-600">
            <div className="flex items-center justify-center mb-2">
              <SadIcon className="size-16" />
            </div>
            <div className="text-sm leading-sm">
              <p>No Data</p>
            </div>
          </div>
        }
      />
    </div>
  );
}

const getColumns = (): ColumnDef<ApiComponents["YapperPageLeaderboardItemResponse"]>[] =>
  [
    {
      accessorKey: "rank",
      size: 30,
      header: () => {
        // return <SortHeader column={column}>#</SortHeader>;
        return <div className="flex items-center gap-1">#</div>;
      },
      cell: ({ row }) => {
        return (
          <div className="text-zinc-400 relative">
            <span className="group-hover:text-white transition-colors">
              {row.original.rank}
            </span>
            {row.original.rank_change !== 0 && (
              <div
                className={cn(
                  "absolute bottom-[-10px] left-[-2px] flex items-center text-[7px] font-bold leading-none",
                  row.original.rank_change && row.original.rank_change > 0
                    ? "text-lime-500"
                    : "text-red-500",
                )}
              >
                <ArrowIcon
                  variants={
                    row.original.rank_change && row.original.rank_change > 0
                      ? "up"
                      : "down"
                  }
                />
                {Math.abs(row.original.rank_change ?? 0)}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "program",
      size: 120,
      header: "@",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
            <AppImage
              src={row.original.logo_url ?? mockIcon}
              alt={row.original.display_name ?? ""}
              width={20}
              height={20}
              className="shrink-0 mask-octagon-rotated"
            />

            <span
              className="block max-w-[80px] truncate leading-normal"
              title={row.original.display_name}
            >
              {row.original.display_name}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "dop_score_30d",
      size: 94,
      header: () => (
        <div className="flex items-center gap-1">DScore</div>
      ),
      cell: ({ row }) => {
        const isUp =
          row.original.dop_score_change && row.original.dop_score_change > 0;
        return (
          <div className="flex items-center gap-2">
            <div>{formatK(row.original.dop_score ?? 0, 1)}</div>
            <div
              className={cn(
                "flex items-center gap-0.5",
                isUp ? "text-lime-500" : "text-red-500",
              )}
            >
              {row.original.dop_score_change !== 0 && (
                <>
                  {isUp ? (
                    <RunningArrowIcon variants="up" />
                  ) : (
                    <RunningArrowIcon variants="down" />
                  )}
                  {toPercent(row.original.dop_score_change ?? 0)}
                </>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "tweets_count",
      size: 72,
      header: () => (
        // <SortHeader column={column}>
        <div className="flex items-center gap-1">
          Tweets
          <AppTooltip content={<p>Note</p>}>
            <InfoIcon className="text-zinc-600 size-4" />
          </AppTooltip>
        </div>
        // </SortHeader>
      ),
      cell: ({ row }) => {
        return <div>{formatK(row.original.tweets_count ?? 0)}</div>;
      },
    },
    {
      id: "avg_dops_per_tweet_stub",
      size: 90,
      header: () => (
        <div className="flex items-center gap-1">
          <span>Tweet Price</span>
          <DopIcon className="size-4 shrink-0" />
        </div>
      ),
      cell: ({ row }) => {
        return <div>{formatK(row.original.avg_dops_per_tweet ?? 0)}</div>;
      },
    },
    {
      accessorKey: "active_programs",
      size: 110,
      header: () => (
        // <SortHeader column={column}>Active Programs</SortHeader>
        <div className="flex items-center gap-1">Active subnets</div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {row.original.active_programs_logos_urls?.map((logo, index) => (
                <AppImage
                  src={logo}
                  alt={`Active program ${index + 1}`}
                  width={24}
                  height={24}
                  className="w-6 h-6 mask-octagon"
                  key={index}
                  style={{
                    marginLeft: index > 0 ? "-8px" : "0",
                    zIndex: 10 - index,
                  }}
                />
              ))}
            </div>
            <span className="text-white text-xs pl-2">
              +{formatK(row.original.active_programs ?? 0)}
            </span>
          </div>
        );
      },
    },
  ];

export default Leaderboard;
