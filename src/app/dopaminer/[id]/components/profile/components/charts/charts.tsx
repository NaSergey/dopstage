import { rqClient } from "@/shared/api/instance";
import { refetchOnReconnect, useErrorState } from "@/shared/lib/error";
import { EmptyState } from "@/shared/ui/empty-state";
import { EmptyText } from "@/shared/ui/empty-text";
import { Skeleton } from "@/shared/ui/skeleton";
import { DopIcon } from "@/shared/ui/icons";
import Chart from "./components/chart";
import { formatK } from "@/shared/lib/format/formatK";

interface IChartsProps {
  id: string;
}

function Charts({ id }: IChartsProps) {
  const { data, isLoading, error, refetch } = rqClient.useQuery(
    "get",
    "/api/v1/yapper_page/yapper/{yapper_id}/charts",
    {
      params: { path: { yapper_id: id } },
    },
    {
      enabled: Boolean(id),
      keepPreviousData: true,
      refetchOnReconnect: refetchOnReconnect,
      placeholderData: (prev) => prev,
    },
  );

  const { data: headerData, isLoading: isHeaderLoading } = rqClient.useQuery(
    "get",
    "/api/v1/yapper_page/yapper/{yapper_id}/header",
    {
      params: { path: { yapper_id: id } },
    },
    {
      enabled: Boolean(id),
      keepPreviousData: true,
      refetchOnReconnect: refetchOnReconnect,
      placeholderData: (prev) => prev,
    },
  );

  const { showReload } = useErrorState(error, isLoading);

  return (
    <div className="grid grid-cols-2 h-full min-h-0">
      <div className="p-2 border-r border-black h-full min-h-0 flex flex-col relative">
        {/* Total Dops Earned - on first chart block */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
          <span className="text-xs text-zinc-500">TDD History</span>
          <div className="flex items-center gap-1 text-sm text-white">
            {isHeaderLoading ? (
              <Skeleton className="w-7 h-5" />
            ) : (
              <EmptyText
                value={headerData?.total_dops}
                formatter={formatK}
              />
            )}
            <DopIcon className="size-3.5 shrink-0" />
          </div>
        </div>
        <Chart
          title="DScore History"
          subtitle="DScore per day"
          delta={data?.avg_dops_per_day_change ?? 0}
          data={data?.avg_dops_per_day ?? []}
          isLoading={isLoading}
          error={error}
          valueIcon={<DopIcon className="size-4 shrink-0" />}
        />
        {!!error && showReload && (
          <div className="absolute right-4 bottom-5">
            <EmptyState
              showIcon={false}
              title=""
              description=""
              className="w-[139px] h-auto p-0"
              onReload={refetch}
            />
          </div>
        )}
      </div>
      <div className="p-2 h-full min-h-0 min-w-0 flex flex-col relative">
        <Chart
          title="Dops History"
          subtitle="Dops per tweet"
          delta={data?.moving_tweet_price_change ?? 0}
          data={data?.moving_tweet_price ?? []}
          isLoading={isLoading}
          error={error}
          valueIcon={<DopIcon className="size-4 shrink-0" />}
        />
        {!!error && showReload && (
          <div className="absolute right-4 bottom-5">
            <EmptyState
              showIcon={false}
              title=""
              description=""
              className="w-[139px] h-auto p-0"
              onReload={refetch}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Charts;
