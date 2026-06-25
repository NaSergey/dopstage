"use client";

import { ApiComponents } from "@/shared/api/schema";
import { useParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { useTableNavigation, TABLE_PATHS } from "@/shared/lib/hooks/useTableNavigation";
import { rqClient } from "@/shared/api/instance";
import { refetchInterval, refetchOnReconnect, useErrorState } from "@/shared/lib/error";
import { DataTable } from "@/shared/ui/data-table";
import { LONG_REFETCH_INTERVAL, STALE_TIME_BUFFER } from "@/shared/lib/constants/refetchInterval";
import { DopIcon, SadIcon } from "@/shared/ui/icons";
import { formatK } from "@/shared/lib/format/formatK";
import mockIcon from "@/shared/assets/mock-icon.svg";
import { Skeleton } from "@/shared/ui/skeleton";
import ProgressBar from "@/shared/ui/progress-bar";
import { useMemo } from "react";
import { AppImage } from "@/shared/ui/app-image";
import MaximizeLink from "@/shared/ui/maximize-link";
import { EmptyState } from "@/shared/ui/empty-state";

type TActiveProgramsResponse =
  ApiComponents["YapperPageActiveProgramResponse"][];

const PAGE_SIZE = 20;

const useActivePrograms = () => {
  const { id } = useParams<{ id: string }>();

  const INTERVAL = Number(process.env.NEXT_PUBLIC_SUBNET_FEED_INTERVAL) || LONG_REFETCH_INTERVAL;

  const { data, fetchNextPage, hasNextPage, isLoading, error, refetch } =
    rqClient.useInfiniteQuery(
      "get",
      "/api/v1/yapper_page/yapper/{yapper_id}/active_programs",
      {
        params: { path: { yapper_id: id } },
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
          lastPage: TActiveProgramsResponse,
          allPages: TActiveProgramsResponse[],
        ) => {
          if (!lastPage || lastPage.length < PAGE_SIZE) return undefined;
          return allPages.length + 1;
        },
      },
    );
  const activePrograms = useMemo(() => data?.pages.flat() ?? [], [data?.pages]);
  return {
    activePrograms,
    fetchNextPage,
    hasNextPage,
    isLoading,
    error,
    refetch,
  };
};

function Programs() {
  const {
    activePrograms,
    fetchNextPage,
    hasNextPage,
    isLoading,
    error,
    refetch,
  } = useActivePrograms();

  const handleRowClick = useTableNavigation<ApiComponents["YapperPageActiveProgramResponse"]>(
    TABLE_PATHS.subnet
  );

  const { hasError, showReload, is422: is422Error } = useErrorState(error, isLoading);

  return (
    <div className="grid grid-rows-[auto_1fr] bg-zinc-950 h-full min-h-0 min-w-0 relative">
      <MaximizeLink href="/leaderboard" />
      <h2 className="px-3 py-3 mb-1 text-base leading-none font-medium">
        Active subnets
      </h2>
      <DataTable
        className="pb-3 px-0.5"
        headerClassName="bg-zinc-950 hover:bg-zinc-950"
        columns={columns}
        data={activePrograms}
        onLoadMore={fetchNextPage}
        hasMore={hasNextPage}
        isLoading={isLoading}
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

const columns: ColumnDef<ApiComponents["YapperPageActiveProgramResponse"]>[] = [
  {
    accessorKey: "rank",
    size: 26,
    header: "#",
    cell: ({ row }) => {
      return (
        <div className="text-zinc-400 group-hover:text-white transition-colors">
          <span>{row.original.rank}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "program",
    size: 104,
    header: "@",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
          <AppImage
            src={row.original.program_logo_url ?? mockIcon}
            alt={row.original.program_name ?? ""}
            width={20}
            height={20}
            className="shrink-0 mask-octagon"
          />

          <span
            className="block max-w-[80px] truncate leading-normal"
            title={row.original.program_name}
          >
            {row.original.program_name}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "TDD",
    size: 50,
    header: "TDD",
    cell: ({ row }) => {
      return <div>{formatK(row.original.tdd ?? 0)}</div>;
    },
  },
  {
    accessorKey: "fdv",
    size: 65,
    header: "FDV",
    cell: ({ row }) => {
      return <div>${formatK(row.original.fdv ?? 0)}</div>;
    },
  },
  {
    accessorKey: "tweet_price",
    size: 100,
    header: () => (
      // <SortHeader column={column}>
      <div className="flex items-center gap-1">
        <span>DPrice</span>
        <DopIcon />
      </div>
      // </SortHeader>
    ),
    cell: ({ row }) => {
      return <div>{formatK(row.original.dop_price ?? 0)}</div>;
    },
  },
  // {
  //   accessorKey: "streak_multiplier_in_program",
  //   header: ({ column }) => {
  //     // return <SortHeader column={column}>Streak</SortHeader>;
  //     return <div className="flex items-center gap-1">Streak</div>;
  //   },
  //   cell: ({ row }) => {
  //     return (
  //       <Multiplier
  //         value={Number(
  //           formatNumber(row.original.streak_multiplier_in_program ?? 0),
  //         )}
  //         variant="withDivider"
  //         colorScheme="gray"
  //       />
  //     );
  //   },
  // },
  {
    accessorKey: "tweets_in_program",
    size: 50,
    header: "Tweets",
    cell: ({ row }) => {
      return <div>{formatK(row.original.tweets_in_program ?? 0)}</div>;
    },
  },
  {
    accessorKey: "Dopsdistr",
    size: 90,
    header: "Reward Rate",
    cell: ({ row }) => {
      return (
        <div>
          <ProgressBar
            value={row.original.reward_rate ?? 0}
            height={8}
            width={"100%"}
            variant="dense"
          />
        </div>
      );
    },
  },
];

export default Programs;
