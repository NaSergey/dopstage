"use client";

import { XIcon } from "@/shared/ui/icons";
import { cn } from "@/shared/lib/utils/css";
import { EmptyState } from "@/shared/ui/empty-state";
import { Skeleton } from "@/shared/ui/skeleton";
import { useScrollSentinels } from "@/shared/hooks/useScrollGradients";
import { TweetCard } from "./tweet-card";
import Loader from "@/shared/ui/loader";
import { useTopTweets } from "./hooks/use-top-tweets";

function TopTweets() {
  const {
    data,
    isLoading,
    hasError,
    showReload,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTopTweets();
  const {
    scrollContainerRef,
    topSentinelRef,
    bottomSentinelRef,
    isTopVisible,
    isBottomVisible,
  } = useScrollSentinels({
    onBottomIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const showTopGradient = !isTopVisible;
  const showBottomGradient = !isBottomVisible;

  return (
    <div className="grid grid-rows-[auto_1fr] bg-zinc-900 border-r border-zinc-950 h-full min-h-0 min-w-0 relative">
      <div className="py-3 px-4 flex items-center bg-zinc-950 justify-between">
        <div className="flex items-center gap-2 text-white text-base leading-base font-medium">
          <XIcon className="size-4" />
          Top tweets
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className={cn("min-h-0 relative", isLoading ? "overflow-hidden" : "overflow-auto")}
      >
        <div ref={topSentinelRef} className="h-px pointer-events-none opacity-0" />
        {hasError ? (
          <div className="py-4 flex flex-col items-center justify-center h-full">
            <EmptyState
              showIcon
              title="Something went wrong, please reload"
              onReload={showReload ? () => refetch() : undefined}
              className="h-[99%]"
            />
          </div>
        ) : isLoading ? (
          <div className="grid ">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-3",
                  idx !== 0 && "border-t border-zinc-950",
                )}
              >
                <div className="grid grid-cols-[1fr_auto] gap-2 items-start">
                  <div className="min-w-0">
                    <div className="flex items-start gap-2 min-w-0">
                      <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                      <div className="min-w-0 flex-1">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end justify-end gap-6 text-white">
                    <div className="text-right flex flex-col justify-end gap-1">
                      <Skeleton className="h-3 w-10" />
                      <Skeleton className="h-4 w-8 ml-auto" />
                    </div>
                    <div className="text-right flex flex-col justify-end gap-1">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-4 w-12 ml-auto" />
                    </div>
                  </div>

                  <div className="col-span-2 mt-2">
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <EmptyState showIcon title="No tweets yet" className="h-[99%]" />
        ) : (
          <div className="grid">
            {data.map((tweet, idx) => (
              <div
                key={`${tweet.yapper_id}-${idx}`}
                className={cn(
                  "px-3 pt-3 hover:bg-zinc-800 transition-colors cursor-pointer",
                  idx !== 0 && "border-t border-zinc-950",
                )}
              >
                <TweetCard tweet={tweet} />
              </div>
            ))}
            {hasNextPage && (
              <div className="flex items-center justify-center py-3 border-t border-zinc-950 min-h-[48px]">
                <Loader />
              </div>
            )}
          </div>
        )}
        <div ref={bottomSentinelRef} className="h-px pointer-events-none opacity-0" />
      </div>

      {/* Top shadow gradient */}
      <div
        className={cn(
          "absolute top-[47px] left-0 right-0 h-16 bg-gradient-to-b from-black/50 to-transparent pointer-events-none z-10 transition-opacity duration-200",
          showTopGradient ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Bottom shadow gradient */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-10 transition-opacity duration-200",
          showBottomGradient ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}

export default TopTweets;
