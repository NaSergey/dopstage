"use client";

import { useErrorState } from "@/shared/lib/error";
import { useEffect, useMemo, useState } from "react";
import { AddYapperIcon } from "@/shared/ui/icons";
import SearchInput from "@/shared/ui/search-input";
import useDebounce from "@/shared/hooks/useDebounce";
import { parseTwitterHandle, MIN_HANDLE_LENGTH } from "../../utils/twitter";
import { useYapperStore } from "../../store/yapper-store";
import { EmptyState } from "@/shared/ui/empty-state";
import { YapperCheckHeader } from "@/shared/ui/yapper-check-header";
import { YapperCheckHeaderSkeleton } from "./yapper-check-header-skeleton";
import { rqClient } from "@/shared/api/instance";
import { refetchInterval, refetchOnReconnect } from "@/shared/lib/error";
import { LONG_REFETCH_INTERVAL, STALE_TIME_BUFFER } from "@/shared/lib/constants/refetchInterval";
import { YapperCheckStats } from "./yapper-check-stats";
import { YapperCheckStatsSkeleton } from "./yapper-check-stats-skeleton";

const defaultSearch = "";

function YapperCheck({ programId }: { programId: string }) {
  const { handle, setHandle } = useYapperStore();
  const [search, setSearch] = useState(defaultSearch);

  const debouncedSearch = useDebounce(search, 1000);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setSearch(defaultSearch);
      setHandle("");
    });
    return () => cancelAnimationFrame(id);
  }, [programId, setHandle]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setSearch(defaultSearch);
      setHandle("");
    });
    return () => {
      cancelAnimationFrame(id);
      setHandle("");
    };
  }, [setHandle]);

  useEffect(() => {
    if (handle && handle !== search) {
      const id = requestAnimationFrame(() => setSearch(handle));
      return () => cancelAnimationFrame(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- search intentionally excluded: we react only to handle changes
  }, [handle]);

  useEffect(() => {
    if (handle && debouncedSearch !== handle) {
      const id = requestAnimationFrame(() => setHandle(""));
      return () => cancelAnimationFrame(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handle intentionally excluded: react only to debounce settling
  }, [debouncedSearch, setHandle]);

  const parsedHandle = useMemo(
    () => parseTwitterHandle(handle || debouncedSearch),
    [handle, debouncedSearch],
  );

  const enabled = Boolean(programId) && parsedHandle.length >= MIN_HANDLE_LENGTH;
  const INTERVAL = Number(process.env.NEXT_PUBLIC_SUBNET_FEED_INTERVAL) || LONG_REFETCH_INTERVAL;
  const { data, isLoading, error, refetch } = rqClient.useQuery(
    "get",
    "/api/v1/program_page/{program_id}/yapper/{twitter_handle}/stats",
    { params: { path: { program_id: programId, twitter_handle: parsedHandle } } },
    {
      enabled,
      keepPreviousData: true,
      refetchInterval: refetchInterval(INTERVAL),
      refetchOnReconnect: refetchOnReconnect,
      staleTime: INTERVAL - STALE_TIME_BUFFER,
      retry: false,
    },
  );
  const { hasError, showReload, isNoSuchUser } = useErrorState(error, isLoading);

  return (
    <div className="[@media(max-height:800px)]:pt-3.5 pt-5.5 bg-zinc-900 border-t border-l border-zinc-950 flex flex-col h-full">
      <h2 className="flex items-center gap-2 px-1 [@media(max-height:800px)]:pl-2 pl-3 [@media(max-height:800px)]:mb-2 mb-4 text-base leading-base font-medium shrink-0">
        <AddYapperIcon className="size-4" active />
        Creator check
      </h2>
      <div className="[@media(max-height:800px)]:py-1.5 [@media(max-height:800px)]:pl-2 pl-3 [@media(max-height:800px)]:pr-2 py-2 shrink-0 pr-3 relative z-0">
        <SearchInput
          variant="default"
          className="w-full"
          placeholder="X handle"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-y-auto overflow-x-hidden flex-1 min-h-0">
        {isLoading && enabled ? (
          <div>
            <YapperCheckHeaderSkeleton />
            <YapperCheckStatsSkeleton />
          </div>
        ) : data ? (
          <div>
            <YapperCheckHeader
              avatarUrl={data.avatar_url}
              username={data.username}
              isVerified={data.is_verified}
              twitterHandle={data.twitter_handle}
              yapperId={data.yapper_id}
            />
            <YapperCheckStats
              totalDops={data.total_dops ?? 0}
              leaderboardPosition={data.leaderboard_position}
              avgDopsPerTweetChart={data.avg_dops_per_tweet_chart}
              totalTweets={data.total_tweets}
              poolShare={data.pool_share}
              totalDopScore={data.total_dop_score}
            />
          </div>
        ) : (
          <div className="mt-2">
            {hasError && enabled ? (
              isNoSuchUser ? (
                <p className="text-sm line-height-sm [@media(max-height:800px)]:pl-2 pl-3 text-zinc-600 font-normal">
                  There is no such user
                </p>
              ) : (
                <div className="flex items-center justify-center min-h-[160px]">
                  <EmptyState
                    showIcon={false}
                    onReload={showReload ? () => refetch() : undefined}
                    className="h-auto"
                  />
                </div>
              )
            ) : (
              <p className="text-sm line-height-sm [@media(max-height:800px)]:pl-2 pl-3 text-zinc-600 font-normal">
                Search among subnet &apos;s holders
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default YapperCheck;
