"use client";

import { rqClient } from "@/shared/api/instance";
import { refetchInterval, refetchOnReconnect, useErrorState } from "@/shared/lib/error";
import { DataTable } from "@/shared/ui/data-table";
import { ApiComponents } from "@/shared/api/schema";
import { ColumnDef } from "@tanstack/react-table";
import { AppImage } from "@/shared/ui/app-image";
import { ArrowIcon, DopIcon, NewIcon, SadIcon } from "@/shared/ui/icons";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/utils/css";
import { formatK } from "@/shared/lib/format/formatK";
import { LONG_REFETCH_INTERVAL, STALE_TIME_BUFFER } from "@/shared/lib/constants/refetchInterval";
import toPercent from "@/shared/lib/format/toPercent";
import mockIcon from "@/shared/assets/mock-icon.svg";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { EmptyState } from "@/shared/ui/empty-state";
import { useTableNavigation, TABLE_PATHS } from "@/shared/lib/hooks/useTableNavigation";
import MaximizeLink from "@/shared/ui/maximize-link";

type LeaderboardResponse =
  ApiComponents["ProgramYappersLeaderboardItemResponse"][];

const PAGE_SIZE = 20;

const useLeaderboard = () => {
  const { id: programId } = useParams<{ id: string }>();

  const INTERVAL = Number(process.env.NEXT_PUBLIC_SUBNET_FEED_INTERVAL) || LONG_REFETCH_INTERVAL;

  const { data, fetchNextPage, hasNextPage, isLoading, error, refetch } =
    rqClient.useInfiniteQuery(
      "get",
      "/api/v1/program_page/{program_id}/leaderboard",
      {
        params: {
          path: { program_id: programId },
        },
      },
      {
        enabled: Boolean(programId),
        keepPreviousData: true,
        refetchInterval: refetchInterval(INTERVAL),
        refetchOnReconnect: refetchOnReconnect,
        staleTime: INTERVAL - STALE_TIME_BUFFER,

        initialPageParam: 1,
        pageParamName: "page",
        getNextPageParam: (
          lastPage: LeaderboardResponse,
          allPages: LeaderboardResponse[],
        ) => {
          if (!lastPage || lastPage.length < PAGE_SIZE) return undefined;

          return allPages.length + 1;
        },
      },
    );

  const leaderboard = useMemo(() => data?.pages.flat() ?? [], [data?.pages]);

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
  const { id: programId } = useParams<{ id: string }>();
  const handleRowClick = useTableNavigation<ApiComponents["ProgramYappersLeaderboardItemResponse"]>(
    TABLE_PATHS.dopaminerYapper
  );

  const LEADERBOARD_COLUMNS = useMemo(() => columns, []);

  const { hasError, showReload } = useErrorState(error, isLoading);

  return (
    <div className="grid grid-rows-[auto_1fr] bg-zinc-950 h-full min-h-0 min-w-0 relative">
      <MaximizeLink href={`/leaderboard?subnet_id=${programId}`} />
      <h2 className="px-3 py-3 mb-1 text-base leading-none font-medium">
        Subnet Leaderboard
      </h2>
      <DataTable
        className="pb-14 px-2"
        headerClassName="bg-zinc-950 hover:bg-zinc-950"
        columns={LEADERBOARD_COLUMNS}
        data={leaderboard}
        isLoading={isLoading}
        onLoadMore={fetchNextPage}
        hasMore={hasNextPage}
        rowClassName="hover:bg-[#6314FF66] cursor-pointer group"
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
          </div>
        }
        onErrorContent={
          hasError ? (
            <div className="flex flex-col items-center justify-center">
              <EmptyState
                onReload={showReload ? () => refetch() : undefined}
                className="h-auto"
              />
            </div>
          ) : undefined
        }
        noDataContent={
          <div className="flex min-h-[300px] flex-col items-center justify-center text-zinc-600">
            <div className="flex items-center justify-center mb-2">
              <SadIcon className="size-16" />
            </div>
            <div className="text-sm leading-sm">
              <p>No Data</p>
            </div>
          </div>
        }
      />
      {/* Mock current user position row - positioned inside table area */}
      {/* <div className="absolute left-2 right-4 bottom-4 pointer-events-none">
        <FrameSurface
          height={40}
          inset={14}
          strokeColor="#27272A"
          className="w-full pointer-events-auto"
          contentElement={null}
          renderUnderlay={(context) => (
            <div
              className="absolute inset-0 bg-zinc-900"
              style={context.clipPathStyle}
              aria-hidden="true"
            />
          )}
        >
          <div className="relative z-20 flex items-center gap-4 px-4 w-full h-full">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-6 text-xs text-zinc-400">28</span>
              <div className="flex items-center gap-2 min-w-0">
                <div className="relative w-7 h-7">
                  <AppImage
                    src={mockIcon}
                    alt="You"
                    width={28}
                    height={28}
                    className="w-7 h-7 mask-octagon-rotated"
                    fallbackVariant="octagonRotated"
                  />
                </div>
                <span className="text-sm font-bold leading-4 text-[#6314FF]">You</span>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-8 text-sm">
              <span>$1.01</span>
              <span>1.01</span>
              <span>100%</span>
            </div>
          </div>
        </FrameSurface>
      </div> */}
    </div>
  );
}

const columns: ColumnDef<
  ApiComponents["ProgramYappersLeaderboardItemResponse"]
>[] = [
    {
      accessorKey: "rank",
      size: 20,
      header: "#",
      cell: ({ row }) => {
        return (
          <div className="text-zinc-400 relative">
            {row.original.rank}
            {row.original.rank_change !== 0 && (
              <div
                className={cn(
                  "absolute bottom-[-10px] left-[-2px] flex items-center text-[7px] font-bold leading-none",
                  row.original.rank_change > 0 ? "text-lime-500" : "text-red-500",
                )}
              >
                <ArrowIcon
                  variants={row.original.rank_change > 0 ? "up" : "down"}
                />
                {Math.abs(row.original.rank_change)}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "profile",
      size: 110,
      header: "@",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
            <div className="relative w-5 h-5">
              <AppImage
                src={row.original.avatar_url ?? mockIcon}
                alt={row.original.username ?? ""}
                width={20}
                height={20}
                className="mask-octagon-rotated"
                fallbackVariant="octagonRotated"
              />
              {row.original.is_new && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                  <NewIcon className="w-4 h-2 " />
                </div>
              )}
            </div>

            <span
              className="block max-w-[80px] truncate leading-normal"
              title={row.original.username}
            >
              {row.original.username}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "dops",
      size: 50,
      header: () => <DopIcon />,
      cell: ({ row }) => {
        return <div>{formatK(row.original.total_dops ?? 0)}</div>;
      },
    },
    {
      accessorKey: "total_dop_score",
      size: 80,
      header: "Total DScore",
      cell: ({ row }) => {
        return <div>{formatK(row.original.total_dop_score ?? 0)}</div>;
      },
    },
    {
      accessorKey: "pool_share",
      size: 70,
      header: "Pool Share",
      cell: ({ row }) => {
        return <div>{toPercent(row.original.pool_share ?? 0)}</div>;
      },
    },
  ];

export default Leaderboard;
