"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { rqClient } from "@/shared/api/instance";
import { ApiComponents } from "@/shared/api/schema";
import { useErrorState, refetchInterval, refetchOnReconnect } from "@/shared/lib/error";
import { LONG_REFETCH_INTERVAL, STALE_TIME_BUFFER } from "@/shared/lib/constants/refetchInterval";

type ProgramTopTweetResponse = ApiComponents["ProgramTopTweetsResponse"];

const PAGE_SIZE = 20;

export const useTopTweets = () => {
  const { id: programId } = useParams<{ id: string }>();

  const INTERVAL = Number(process.env.NEXT_PUBLIC_SUBNET_FEED_INTERVAL) || LONG_REFETCH_INTERVAL;

  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = rqClient.useInfiniteQuery(
    "get",
    "/api/v1/program_page/{program_id}/top_tweets",
    {
      params: {
        path: {
          program_id: programId,
        },
      },
    },
    {
      enabled: Boolean(programId),
      keepPreviousData: true,
      refetchInterval: refetchInterval(INTERVAL),
      refetchOnReconnect: refetchOnReconnect,
      staleTime: INTERVAL - STALE_TIME_BUFFER,
      initialPageParam: PAGE_SIZE,
      pageParamName: "limit",
      getNextPageParam: (
        lastPage: ProgramTopTweetResponse[],
        allPages: ProgramTopTweetResponse[][],
      ) => {
        const currentLimit = allPages.length * PAGE_SIZE;
        if (!lastPage || lastPage.length < currentLimit) return undefined;
        return (allPages.length + 1) * PAGE_SIZE;
      },
    },
  );

  const tweets = useMemo(
    () => (data?.pages?.flat() ?? []) as ProgramTopTweetResponse[],
    [data?.pages],
  );

  const { hasError, showReload } = useErrorState(error, isLoading);

  return {
    data: tweets,
    isLoading,
    error,
    hasError,
    showReload,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
