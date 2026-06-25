import { rqClient } from "@/shared/api/instance";
import { LONG_REFETCH_INTERVAL, STALE_TIME_BUFFER } from "@/shared/lib/constants/refetchInterval";
import {
  refetchInterval, refetchOnReconnect,
  getErrorStatus,
  useErrorState,
} from "@/shared/lib/error";
import { formatK } from "@/shared/lib/format/formatK";
import { cn } from "@/shared/lib/utils/css";
import AppTooltip from "@/shared/ui/app-tooltip";
import { InfoIcon, VerifiedIcon, XIcon } from "@/shared/ui/icons";
import { Skeleton } from "@/shared/ui/skeleton";
import ShareButton from "./share-button";
import { AppLink } from "@/shared/ui/app-link";
import { AppImage } from "@/shared/ui/app-image";
import { EmptyText } from "@/shared/ui/empty-text";
import { EmptyState } from "@/shared/ui/empty-state";
import toPercent from "@/shared/lib/format/toPercent";
import DopValue from "@/shared/ui/dops-value";

interface IHeaderProps {
  id: string;
}

function Header({ id }: IHeaderProps) {
  const INTERVAL = Number(process.env.NEXT_PUBLIC_SUBNET_FEED_INTERVAL) || LONG_REFETCH_INTERVAL;

  const { data, isLoading, error, refetch } = rqClient.useQuery(
    "get",
    "/api/v1/yapper_page/yapper/{yapper_id}/header",
    {
      params: { path: { yapper_id: id } },
    },
    {
      enabled: Boolean(id),
      keepPreviousData: true,
      placeholderData: (prev) => prev,
      refetchInterval: refetchInterval(INTERVAL),
      refetchOnReconnect: refetchOnReconnect,
      staleTime: INTERVAL - STALE_TIME_BUFFER,
    },
  );
  const { showReload } = useErrorState(error, isLoading);

  return (
    <div className="grid grid-cols-2 h-full min-w-0">
      <div
        className={cn(
          "py-2 px-4 flex gap-3 min-w-0 [@media(max-height:800px)]:py-1.5 [@media(max-width:1670px)]:px-2",
          error ? "items-start" : "items-center",
        )}
      >
        <div className="size-21 [@media(max-height:800px)]:size-13 shrink-0 relative">
          {isLoading ? (
            <Skeleton className="w-full h-full shrink-0 mask-octagon-rotated aspect-square" />
          ) : (
            <>
              <AppImage
                src={data?.logo_url ?? ""}
                alt={data?.display_name ?? ""}
                width={84}
                height={84}
                className="w-full h-full shrink-0 mask-octagon-rotated object-cover"
              />
              {data?.is_authenticated && (
                <VerifiedIcon className="absolute right-0.5 top-0.5 size-4 text-white drop-shadow-md" />
              )}
            </>
          )}
        </div>
        {isLoading ? (
          <div className="w-full">
            <Skeleton className="w-[120px] h-7 mb-2 [@media(max-height:800px)]:h-4" />
            <div className="flex flex-col gap-[1px] w-full">
              <Skeleton className="w-full h-3.5 [@media(max-height:800px)]:h-2.5" />
              <Skeleton className="w-full h-3.5 [@media(max-height:800px)]:h-2.5" />
              <Skeleton className="w-full h-3.5 [@media(max-height:800px)]:h-2.5" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="flex items-center gap-3.5 min-w-0">
              {error && getErrorStatus(error) === 422 ? (
                <h2 className="text-xl leading-xl font-medium text-start truncate [@media(max-width:1670px)]:text-lg">
                  Creator not found
                </h2>
              ) : (
                <h2 className="flex items-center gap-1 text-xl leading-xl font-medium min-w-0 [@media(max-width:1670px)]:text-lg">
                  <span className="truncate">
                    {data?.display_name ?? (error ? "Lollypop" : "")}
                  </span>
                </h2>
              )}
              {!error && (
                <ShareButton headerData={data} isHeaderLoading={isLoading} />
              )}
            </div>

            {!error && data?.twitter_handle && (
              <AppLink
                href="#"
                className="w-fit self-start"
              >
                <p className="flex items-center gap-1 bg-zinc-800 px-2 py-1 text-zinc-400">
                  <XIcon className="size-3 shrink-0" />
                  <span className="text-xs leading-xs font-semibold whitespace-nowrap">
                    @{data?.twitter_handle}
                  </span>
                </p>
              </AppLink>
            )}

            {error && (
              <div className="">
                <EmptyState
                  showIcon={false}
                  buttonSize={24}
                  title=""
                  description=""
                  className="items-start justify-start h-auto p-0"
                  onReload={
                    showReload ? () => refetch() : undefined
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>
      <div className="grid grid-cols-5 text-right min-w-0 [@media(max-width:1670px)]:grid-cols-5">
        <div className="flex items-start justify-end pt-4 pr-2 pl-1 bg-purple-500/40 min-w-0 [@media(max-height:800px)]:pt-2 [@media(max-width:1670px)]:px-1">
          <div className="min-w-0 w-full">
            <h4 className="flex items-center justify-end h-4 text-xs leading-tight opacity-30">
              Leaderboard
            </h4>
            {isLoading ? (
              <Skeleton className="w-[56px] h-6 ml-auto mt-4 [@media(max-height:800px)]:h-5 [@media(max-width:1670px)]:w-[48px] [@media(max-width:1670px)]:h-5" />
            ) : (
              <p className="text-3xl pt-2 leading-3xl font-medium [@media(max-height:800px)]:leading-none [@media(max-width:1670px)]:text-2xl [@media(max-width:1670px)]:leading-tight [text-shadow:0_0_32px_#6314FF]">
                <EmptyText
                  value={data?.leaderboard_position}
                  prefix="#"
                  className="text-3xl pt-2 leading-3xl font-medium [@media(max-height:800px)]:leading-none [@media(max-width:1670px)]:text-2xl [@media(max-width:1670px)]:leading-tight"
                />
              </p>
            )}
          </div>
        </div>
        <div className="flex items-start justify-end pt-4 pr-2 pl-1 bg-purple-500/20 min-w-0 [@media(max-height:800px)]:pt-2 [@media(max-width:1670px)]:px-1">
          <div className="min-w-0 w-full">
            <h4 className="flex items-center justify-end h-4 text-xs leading-tight opacity-30">
              DScore
            </h4>
            {isLoading ? (
              <Skeleton className="w-[56px] h-6 ml-auto mt-4 [@media(max-height:800px)]:h-5 [@media(max-width:1670px)]:w-[48px] [@media(max-width:1670px)]:h-5" />
            ) : (
              <p className="text-3xl pt-2 leading-3xl font-medium [@media(max-height:800px)]:leading-none [@media(max-width:1670px)]:text-2xl [@media(max-width:1670px)]:leading-tight [text-shadow:0_0_16px_#6314FF]">
                <EmptyText
                  value={data?.dop_score}
                  formatter={(v) => formatK(v, 0)}
                  className="text-3xl pt-2 leading-3xl font-medium [@media(max-height:800px)]:leading-none [@media(max-width:1670px)]:text-2xl [@media(max-width:1670px)]:leading-tight"
                />
              </p>
            )}
          </div>
        </div>
        <div className="flex items-start justify-end pt-4 pr-2 pl-1 bg-white/3 min-w-0 [@media(max-height:800px)]:pt-2 [@media(max-width:1670px)]:px-1">
          <div className="min-w-0 w-full">
            <h4 className="flex items-center justify-end gap-1 h-4 text-xs leading-tight text-white/30">
              <AppTooltip content={<p>Note</p>}>
                <InfoIcon className="text-zinc-600 size-4 shrink-0" />
              </AppTooltip>
              <span>Total Tweets</span>
            </h4>
            {isLoading ? (
              <Skeleton className="w-[56px] h-6 ml-auto mt-4 [@media(max-height:800px)]:h-5 [@media(max-width:1670px)]:w-[48px] [@media(max-width:1670px)]:h-5" />
            ) : (
              <p className="text-3xl pt-2 leading-3xl font-medium [@media(max-height:800px)]:leading-none [@media(max-width:1670px)]:text-2xl [@media(max-width:1670px)]:leading-tight">
                <EmptyText
                  value={data?.total_tweets}
                  formatter={formatK}
                  className="text-3xl pt-2 leading-3xl font-medium [@media(max-height:800px)]:leading-none [@media(max-width:1670px)]:text-2xl [@media(max-width:1670px)]:leading-tight"
                />
              </p>
            )}
          </div>
        </div>
        <div className="flex items-start justify-end pt-4 pr-2 pl-1 min-w-0 [@media(max-height:800px)]:pt-2 [@media(max-width:1670px)]:px-1">
          <div className="min-w-0 w-full">
            <h4 className="flex items-center justify-end gap-1 h-4 text-xs leading-tight">
              <span className="text-white/30">Tweet Price</span>
            </h4>
            {isLoading ? (
              <Skeleton className="w-[56px] h-6 ml-auto mt-4 [@media(max-height:800px)]:h-5 [@media(max-width:1670px)]:w-[48px] [@media(max-width:1670px)]:h-5" />
            ) : (
              <DopValue
                className="text-3xl pt-2 leading-3xl font-medium [@media(max-height:800px)]:leading-none [@media(max-width:1670px)]:text-2xl [@media(max-width:1670px)]:leading-tight justify-end w-full"
                iconClassName="size-4 shrink-0"
              >
                <EmptyText
                  value={data?.avg_tweet_price}
                  formatter={(v) => formatK(v, 0)}
                />
              </DopValue>
            )}
          </div>
        </div>
        <div className="flex items-start justify-end pt-4 pr-2 pl-1 bg-[#000000] min-w-0 [@media(max-height:800px)]:pt-2 [@media(max-width:1670px)]:px-1">
          <div className="min-w-0 w-full">
            <h4 className="flex items-center justify-end h-4 text-xs leading-tight text-white/30">
              Engagement Rate
            </h4>
            {isLoading ? (
              <Skeleton className="w-[56px] h-6 ml-auto mt-4 [@media(max-height:800px)]:h-5 [@media(max-width:1670px)]:w-[48px] [@media(max-width:1670px)]:h-5" />
            ) : (
              <p className="text-3xl pt-2 leading-3xl font-medium [@media(max-height:800px)]:leading-none [@media(max-width:1670px)]:text-2xl [@media(max-width:1670px)]:leading-tight">
                <EmptyText
                  value={data?.engagement}
                  formatter={toPercent}
                  className="text-3xl pt-2 leading-3xl font-medium [@media(max-height:800px)]:leading-none [@media(max-width:1670px)]:text-2xl [@media(max-width:1670px)]:leading-tight"
                />
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
