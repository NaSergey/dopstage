"use client";

import { rqClient } from "@/shared/api/instance";
import ProgramDuration from "./components/program-duration";
import Wrapper from "@/shared/ui/wrapper";
import { AppImage } from "@/shared/ui/app-image";
import { formatK } from "@/shared/lib/format/formatK";
import { WebsiteIcon, XIcon, InfoIcon, TaostatIcon } from "@/shared/ui/icons";
import { cn } from "@/shared/lib/utils/css";
import { Skeleton } from "@/shared/ui/skeleton";
import AppTooltip from "@/shared/ui/app-tooltip";
import { LONG_REFETCH_INTERVAL, STALE_TIME_BUFFER } from "@/shared/lib/constants/refetchInterval";
import { EmptyText } from "@/shared/ui/empty-text";
import { refetchInterval, refetchOnReconnect, getErrorStatus } from "@/shared/lib/error";
import DopValue from "@/shared/ui/dops-value";

function Header({ programId }: { programId: string }) {
  const INTERVAL = Number(process.env.NEXT_PUBLIC_SUBNET_FEED_INTERVAL) || LONG_REFETCH_INTERVAL;

  const { data, isLoading, error } = rqClient.useQuery(
    "get",
    "/api/v1/program_page/{program_id}/header",
    {
      params: {
        path: {
          program_id: programId,
        },
      },
    },
    {
      enabled: Boolean(programId),
      placeholderData: (prev) => prev,
      keepPreviousData: true,
      refetchInterval: refetchInterval(INTERVAL),
      refetchOnReconnect: refetchOnReconnect,
      staleTime: INTERVAL - STALE_TIME_BUFFER,
    },
  );

  const isNotFoundError = error && getErrorStatus(error) === 422;
  const displayName = isNotFoundError
    ? "Subnet not found"
    : (data?.program_name ?? "LollyPrg ");

  return (
    <div className="relative  bg-zinc-900 [@media(max-height:800px)]:h-[52px] h-[64px] border-b border-zinc-950">
      <Wrapper className="flex max-2xl:gap-5 gap-7.5 items-center w-full h-full">
        <div className="flex items-center gap-4 [@media(max-height:800px)]:py-1 py-2 flex-shrink-0 w-[280px] 2xl:w-[340px]">
          {isLoading ? (
            <Skeleton className="[@media(max-height:800px)]:w-[40px] [@media(max-height:800px)]:h-[40px] w-[48px] h-[48px] rounded-full flex-shrink-0" />
          ) : (
            <div className="flex-shrink-0">
              <AppImage
                src={data?.program_logo_url ?? ""}
                alt={data?.program_name ?? ""}
                width={48}
                height={48}
                className="[@media(max-height:800px)]:w-10 [@media(max-height:800px)]:h-10 mask-octagon"
                fallbackVariant="octagon"
              />
            </div>
          )}

          <div className="gap-1.5 flex flex-col min-w-0 flex-1 overflow-hidden">
            <div className="flex items-center gap-2 min-w-0 ">
              {isLoading ? (
                <Skeleton className="w-[64px] h-[25px] rounded-none" />
              ) : (
                <h3
                  className="text-xl leading-tight font-medium truncate whitespace-nowrap [@media(max-height:800px)]:text-base"
                  title={displayName}
                >
                  {displayName}
                </h3>
              )}
            </div>
            <div
              className={cn(
                "flex items-center gap-2 text-zinc-600 -mt-0.5",
                isLoading && "text-zinc-600/50",
              )}
            >
              {data?.taostats_url && (
                <a
                  href="#"
                  className="inline-flex items-center hover:text-white"
                  aria-label="Open Taostat"
                >
                  <TaostatIcon className="w-3 h-3" />
                </a>
              )}

              {data?.website_url && (
                <a
                  href="#"
                  className="inline-flex items-center gap-2 hover:text-white"
                  aria-label="Open profile in Website"
                >
                  <WebsiteIcon />
                </a>
              )}

              {data?.twitter_url && (
                <a
                  href="#"
                  className="inline-flex items-center gap-2 hover:text-white"
                  aria-label="Open profile in X (Twitter)"
                >
                  <XIcon />
                </a>
              )}

              {data?.description?.trim() && (
                <AppTooltip content={data.description}>
                  <div className="inline-flex items-center gap-2 hover:text-white">
                    <InfoIcon className="size-3" />
                  </div>
                </AppTooltip>
              )}
            </div>
          </div>
        </div>

        <div className="flex h-full flex-shrink-0 pl-1">
          {isLoading ? (
            <Skeleton className="w-[168px] h-full rounded-none p-4 flex justify-center items-end">
              <div className="h-4 bg-zinc-900 w-full"></div>
            </Skeleton>
          ) : (
            <ProgramDuration
              lifetime_remain={data?.reward_rate ?? 0}
              max={1}
            />
          )}

          <div className="w-[178px] flex-shrink-0">
            {isLoading ? (
              <div className="w-[178px] bg-[#6314FF66] h-full flex justify-end items-end px-4  py-3">
                <Skeleton className="w-[74px] h-7 rounded-none bg-white/10" />
              </div>
            ) : (
              <div className="flex flex-col justify-center bg-[#6314FF66] px-4 h-full whitespace-nowrap">
                <h6 className="text-xs text-end line-height-xs text-white/40">
                  Tweet Price
                </h6>
                <div className="flex items-center gap-1 leading-none font-medium justify-end">
                  <DopValue>
                    <EmptyText value={data?.avg_dops_per_tweet} className="text-[20px] font-medium" formatter={formatK} />
                  </DopValue>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-7.5 max-2xl:gap-4 h-full flex-1 min-w-0">
          <div className="flex flex-col justify-center text-right whitespace-nowrap flex-1 min-w-0 gap-0.5">
            <h6 className="text-xs leading-xs text-zinc-600 h-3 flex items-center justify-end">Leaderboard</h6>
            <div className="text-[20px] leading-none font-medium flex justify-end h-7 items-center">
              {isLoading ? (
                <Skeleton className="w-[64px] h-7 rounded-none" />
              ) : (
                <div className="text-[20px] leading-none font-medium">#{data?.leaderboard_position}</div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center text-right whitespace-nowrap flex-1 min-w-0 gap-0.5">
            <h6 className="text-xs leading-xs text-zinc-600 h-3 flex items-center justify-end">FDV</h6>
            <div className="text-[20px] leading-none font-medium flex justify-end h-7 items-center">
              {isLoading ? (
                <Skeleton className="w-[64px] h-7 rounded-none" />
              ) : (
                <EmptyText value={data?.fdv} prefix="$" formatter={formatK} />
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center text-right whitespace-nowrap flex-1 min-w-0 gap-0.5">
            <h6 className="text-xs leading-xs text-zinc-600 h-3 flex items-center justify-end">Daily Dops Supply</h6>
            <div className="text-[20px] leading-none font-medium flex justify-end h-7 items-center">
              {isLoading ? (
                <Skeleton className="w-[64px] h-7 rounded-none" />
              ) : (
                <DopValue>
                  <EmptyText value={data?.daily_tdd} formatter={formatK} />
                </DopValue>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center text-right flex-1 min-w-0 gap-0.5">
            <h6 className="text-xs leading-xs text-zinc-600 h-3 flex items-center justify-end">Volume</h6>
            <div className="text-[20px] leading-none font-medium flex justify-end h-7 items-center">
              {isLoading ? (
                <Skeleton className="w-[64px] h-7 rounded-none" />
              ) : (
                <EmptyText
                  value={data?.volume}
                  prefix="$"
                  formatter={formatK}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center text-right whitespace-nowrap flex-1 min-w-0 gap-0.5">
            <h6 className="text-xs leading-xs text-zinc-600 h-3 flex items-center justify-end">
              Total Tweets
            </h6>
            <div className="text-[20px] leading-none font-medium flex justify-end h-7 items-center">
              {isLoading ? (
                <Skeleton className="w-[64px] h-7 rounded-none" />
              ) : (
                <EmptyText value={data?.total_tweets} formatter={formatK} />
              )}
            </div>
          </div>

          <div className="flex flex-col pr-4 justify-center text-right whitespace-nowrap flex-1 min-w-0">
            <h6 className="text-xs leading-xs text-zinc-600 h-3 flex items-center justify-end gap-1">
              TDD
              <AppTooltip content="Total Dops Distributed">
                <InfoIcon className="size-3" />
              </AppTooltip>
            </h6>
            <div className="text-[20px] leading-none font-medium flex justify-end h-7 items-center">
              {isLoading ? (
                <Skeleton className="w-[64px] h-7 rounded-none" />
              ) : (
                <DopValue>
                  <EmptyText value={data?.tdd} formatter={formatK} />
                </DopValue>
              )}
            </div>
          </div>
        </div>

        {/* <div
          className={cn(
            "grid py-2 grid-cols-4 ml-auto gap-2 max-2xl:gap-1 items-center text-zinc-600 flex-shrink-0 w-[120px]",
            isLoading && "text-zinc-600/50",
          )}
        >
          <AppTooltip content={<p>Note</p>}>
            <NewAuthorIcon
              className={cn(
                "size-5 max-2xl:size-4",
                data?.has_new_author_multiplier && "text-white",
              )}
            />
          </AppTooltip>

          <AppTooltip content={<p>Note</p>}>
            <ConsistencyIcon
              className={cn(
                "size-5 max-2xl:size-4",
                data?.has_consistency_streak_multiplier && "text-white",
              )}
            />
          </AppTooltip>

          <AppTooltip content={<p>Note</p>}>
            <FrequencyIcon
              className={cn(
                "size-5 max-2xl:size-4",
                data?.has_decay_factor_multiplier && "text-white",
              )}
            />
          </AppTooltip>

          <AppTooltip content={<p>Note</p>}>
            <SentimentIcon
              className={cn(
                "size-5 max-2xl:size-4",
                data?.has_sentiment_filter && "text-white",
              )}
            />
          </AppTooltip>

          <AppTooltip content={<p>Note</p>}>
            <SoloMentionIcon
              className={cn(
                "size-5 max-2xl:size-4",
                data?.has_solo_mention_filter && "text-white",
              )}
            />
          </AppTooltip>

          <AppTooltip content={<p>Note</p>}>
            <ImageCheckIcon
              className={cn(
                "size-5 max-2xl:size-4",
                data?.has_media_filter && "text-white",
              )}
            />
          </AppTooltip>

          <AppTooltip content={<p>Note</p>}>
            <XCheckIcon
              className={cn(
                "size-5 max-2xl:size-4",
                data?.has_verified_filter && "text-white",
              )}
            />
          </AppTooltip>
        </div> */}
      </Wrapper>
    </div>
  );
}

export default Header;
