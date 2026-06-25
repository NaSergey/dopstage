"use client";

import { rqClient } from "@/shared/api/instance";
import { refetchInterval, refetchOnReconnect, useErrorState } from "@/shared/lib/error";
import { DataTable } from "@/shared/ui/data-table";
import { SadIcon, XIcon } from "@/shared/ui/icons";
import { Skeleton } from "@/shared/ui/skeleton";
import { useMemo, useState } from "react";
import useDebounce from "@/shared/hooks/useDebounce";
import { ApiComponents } from "@/shared/api/schema";
import { SortingState } from "@tanstack/react-table";
import { DEFAULT_REFETCH_INTERVAL, STALE_TIME_BUFFER } from "@/shared/lib/constants/refetchInterval";
import { useYapperStore } from "../../store/yapper-store";
import { getFeedColumns } from "./components/xfeed-columns";
import XFeedSearch from "@/entities/x-feed-search";
import { useParams } from "next/navigation";
import { EmptyState } from "@/shared/ui/empty-state";
import { useTableNavigation, TABLE_PATHS } from "@/shared/lib/hooks/useTableNavigation";

type TFeedResponse = ApiComponents["ProgramXFeedItemResponse"][];
const PAGE_SIZE = 20;

type FeedSortBy = "username" | "mindshare" | "tweet_timestamp";

const useXFeed = (
  raw: string,
  sortBy: FeedSortBy,
  direction: "asc" | "desc",
) => {
  const { id: programId } = useParams<{ id: string }>();

  const INTERVAL = Number(process.env.NEXT_PUBLIC_SUBNET_FEED_INTERVAL) || DEFAULT_REFETCH_INTERVAL;

  const { data, fetchNextPage, hasNextPage, isLoading, error, refetch } =
    rqClient.useInfiniteQuery(
      "get",
      "/api/v1/program_page/{program_id}/feed",
      {
        params: {
          path: { program_id: programId },
          query: {
            query: raw || undefined,
            sort_by: sortBy,
            direction,
          },
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

function XFeed() {
  const [search, setSearch] = useState("");
  const raw = useDebounce(search, 1000);
  const [sorting, setSorting] = useState<SortingState>([{ id: "tweet_timestamp", desc: true }]);
  const handleRowClick = useTableNavigation<ApiComponents["ProgramXFeedItemResponse"]>(
    TABLE_PATHS.dopaminerUser
  );

  const active = sorting[0];
  const sortBy = (active?.id ?? "tweet_timestamp") as FeedSortBy;
  const direction = active ? (active.desc ? "desc" : "asc") : "desc";

  const { xfeed, fetchNextPage, hasNextPage, isLoading, error, refetch } =
    useXFeed(raw, sortBy, direction as "asc" | "desc");

  const handleYapperClick = useYapperStore((state) => state.setHandle);
  const activeYapper = useYapperStore((state) => state.handle);

  const FEED_COLUMNS = useMemo(
    () => getFeedColumns({ activeYapper, handleYapperClick, search: raw }),
    [activeYapper, handleYapperClick, raw],
  );

  const { hasError, showReload } = useErrorState(error, isLoading);

  return (
    <div className="[@media(max-height:800px)]:pt-2 pt-4 grid grid-rows-[auto_1fr] bg-zinc-900 border-l border-r border-t border-zinc-950 h-full min-w-0">
      <div className="[@media(max-height:800px)]:mb-1 pb-2 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-white text-base leading-base font-medium">
          <XIcon className="size-4" />
          Feed
        </div>
        <XFeedSearch
          isLoading={isLoading}
          placeholder="Creators, subnets, keywords, tweet links"
          search={search}
          setSearch={setSearch}
          isDisabled={hasError}
        />
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <DataTable
          data={xfeed}
          isLoading={isLoading}
          className="px-4"
          rowClassName="hover:bg-[#6314FF66] cursor-pointer group"
          columns={FEED_COLUMNS}
          onLoadMore={fetchNextPage}
          onRowClick={handleRowClick}
          hasMore={hasNextPage}
          manualSorting
          state={{ sorting }}
          onSortingChange={setSorting}
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
            <div className="flex min-h-[300px] flex-col items-center justify-center text-zinc-600">
              <div className="flex items-center justify-center mb-2">
                <SadIcon className="size-16" />
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
