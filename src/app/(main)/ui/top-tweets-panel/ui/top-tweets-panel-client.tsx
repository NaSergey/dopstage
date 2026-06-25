"use client";

import { useIsMounted } from "@/shared/lib/hooks/use-is-mounted";
import { refetchInterval, refetchOnReconnect, useErrorState } from "@/shared/lib/error";
import { TweetCard } from "./tweet-card";
import { rqClient } from "@/shared/api/instance";
import getTimeAgo from "@/shared/lib/format/getTimeAgo";
import { LONG_REFETCH_INTERVAL, STALE_TIME_BUFFER } from "@/shared/lib/constants/refetchInterval";
import Carousel from "@/shared/ui/carousel";
import { EmptyState } from "@/shared/ui/empty-state";
import { TopTweetsPanelSkeleton } from "./top-tweets-panel-skeleton";
import type { ApiComponents } from "@/shared/api/schema";

// Use API schema type instead of any for type safety (no-explicit-any).
interface TopTweetsPanelClientProps {
  // Optional: when omitted the component fetches on the client (no SSR seed).
  initialData?: ApiComponents["TopTweetResponse"][];
}

export function TopTweetsPanelClient({ initialData }: TopTweetsPanelClientProps) {
  const isMounted = useIsMounted();

  const INTERVAL = Number(process.env.NEXT_PUBLIC_SUBNET_FEED_INTERVAL) || LONG_REFETCH_INTERVAL;
  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = rqClient.useQuery(
    "get",
    "/api/v1/main_page/top_tweets",
    {},
    {
      keepPreviousData: true,
      refetchInterval: refetchInterval(INTERVAL),
      refetchOnReconnect: refetchOnReconnect,
      staleTime: INTERVAL - STALE_TIME_BUFFER,
      placeholderData: (prev) => prev,
      initialData,
    },
  );

  const { showReload } = useErrorState(error, isLoading);

  if (!isMounted || isLoading) {
    return <TopTweetsPanelSkeleton />;
  }

  if (error || data.length === 0) {
    const title = error ? "Something went wrong, please reload" : "No tweets available";

    return (
      <div className="h-[238px]">
        <EmptyState
          showIcon={true}
          title={title}
          onReload={showReload && refetch ? () => void refetch() : undefined}
        />
      </div>
    );
  }

  const carouselItems = data.map((tweet, index) => ({
    id: `${tweet.tweet_id}-${index}`,
    node: (
      <TweetCard
        yapper_id={tweet.yapper_id}
        avatarUrl={tweet.yapper_image_url}
        program_image_url={tweet.program_image_url}
        author={tweet.yapper_display_name}
        timeAgo={getTimeAgo(tweet.tweet_timestamp)}
        yapScore={tweet.yapper_dop_score}
        estimateDops={tweet.estimated_reward_in_dops}
        title={tweet.yap_text}
        community={tweet.program_name}
        fdv={tweet.tdd}
        fdvChart={tweet.daily_tdd_chart}
      />
    ),
  }));

  return (
    <div className="">
      <Carousel
        items={carouselItems}
        autoplay={false}
        loop={true}
        showControls
        className="gap-0.5"
        autoScroll={true}
      />
    </div>
  );
}