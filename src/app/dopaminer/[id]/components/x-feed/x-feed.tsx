"use client";

import { rqClient } from "@/shared/api/instance";
import { refetchInterval, refetchOnReconnect, useErrorState } from "@/shared/lib/error";
import { DataTable } from "@/shared/ui/data-table";
import { SadIcon, XIcon, ChevronUpIcon } from "@/shared/ui/icons";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/utils/css";
import { useMemo, useState } from "react";
import { DEFAULT_REFETCH_INTERVAL, STALE_TIME_BUFFER } from "@/shared/lib/constants/refetchInterval";
import { useParams } from "next/navigation";
import { useTableNavigation, TABLE_PATHS } from "@/shared/lib/hooks/useTableNavigation";
import { getYapperXFeedColumns } from "./components/columns";
import useDebounce from "@/shared/hooks/useDebounce";
import XFeedSearch from "@/entities/x-feed-search";
import { ApiComponents } from "@/shared/api/schema";
import { EmptyState } from "@/shared/ui/empty-state";

type TFeedResponse = ApiComponents["YapperPageXFeedResponse"][];

const PAGE_SIZE = 20;

const useXFeed = (search: string) => {
  const { id } = useParams<{ id: string }>();

  const INTERVAL = Number(process.env.NEXT_PUBLIC_SUBNET_FEED_INTERVAL) || DEFAULT_REFETCH_INTERVAL;

  const { data, fetchNextPage, hasNextPage, isLoading, error, refetch } =
    rqClient.useInfiniteQuery(
      "get",
      "/api/v1/yapper_page/yapper/{yapper_id}/xfeed",
      {
        params: {
          path: { yapper_id: id },
          query: {
            page: 1,
            limit: PAGE_SIZE,
            query: search || undefined,
          },
        },
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
          lastPage: TFeedResponse,
          allPages: TFeedResponse[],
        ) => {
          if (!lastPage || lastPage.length < PAGE_SIZE) return undefined;
          return allPages.length + 1;
        },
      },
    );

  const xfeed = useMemo(() => data?.pages.flat() ?? [], [data?.pages]);

  return {
    xfeed,
    fetchNextPage,
    hasNextPage,
    isLoading,
    error,
    refetch,
  };
};

interface XFeedProps {
  onToggleBlocks?: () => void;
  showBlocks?: boolean;
}

function XFeed({ onToggleBlocks, showBlocks }: XFeedProps) {
  const [search, setSearch] = useState("");
  const raw = useDebounce(search, 1000);
  const handleRowClick = useTableNavigation<ApiComponents["YapperPageXFeedResponse"]>(
    TABLE_PATHS.subnet
  );

  const { xfeed, fetchNextPage, hasNextPage, isLoading, error, refetch } =
    useXFeed(raw);
  const FEED_COLUMNS = useMemo(
    () => getYapperXFeedColumns({ search: raw }) ?? [],
    [raw],
  );


  const { hasError, showReload } = useErrorState(error, isLoading);

  return (
    <div
      className="[@media(max-height:800px)]:pt-2 pt-4 pb-2 bg-zinc-900 border-t border-zinc-950 min-w-0 grid grid-rows-[auto_1fr] h-full"
    >
      <div className="[@media(max-height:800px)]:mb-1 mb-2 flex items-center justify-between pl-4 pr-4 relative">
        <div className="flex items-center gap-2 text-white text-base leading-base font-medium">
          <XIcon className="size-4" />
          Feed
        </div>
        <button
          onClick={onToggleBlocks}
          className="shrink-0 size-6 hover:text-white text-zinc-600 bg-zinc-950 hover:opacity-80 cursor-pointer flex items-center justify-center absolute left-1/2 -translate-x-1/2 hover:shadow-[0_0_0_3px_#6314ffa6,0_0_0_6px_#6314FF44]"
        >
          <ChevronUpIcon
            className={cn(
              "size-3  ",
              showBlocks === false && "rotate-180"
            )}
          />
        </button>
        <div className="flex items-center">
          <XFeedSearch
            isLoading={isLoading}
            placeholder="Creators, subnets, keywords"
            search={search}
            setSearch={setSearch}
            isDisabled={hasError}
            className="min-w-[309px] [@media(max-height:1000px)]:min-w-[409px]"
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <DataTable
          columns={FEED_COLUMNS}
          data={xfeed}
          isLoading={isLoading}
          onLoadMore={fetchNextPage}
          hasMore={hasNextPage}
          className="px-4"
          onRowClick={handleRowClick}
          rowClassName="hover:bg-[#6314FF66] cursor-pointer group"
          headerClassName="bg-zinc-900 hover:bg-zinc-900"
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
              <Skeleton className="w-full h-10 rounded-none" />
            </div>
          }
          onErrorContent={
            hasError ? (
              <div className="flex flex-col items-center justify-center">
                <EmptyState
                  showIcon={false}
                  onReload={showReload ? () => refetch() : undefined}
                  className="h-auto"
                />
              </div>
            ) : undefined
          }
          noDataContent={
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center mb-2">
                <SadIcon className="size-16 mt-4" />
              </div>
              {search.length > 0 ? (
                <div className="text-sm leading-sm">
                  <p>No results found yet...</p>
                  <p>Please check if &quot;{search}&quot;</p>
                  spelled correctly or try different keywords
                </div>
              ) : (
                <div className="text-sm leading-sm">
                  <p>No Data</p>
                </div>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
}

export default XFeed;
