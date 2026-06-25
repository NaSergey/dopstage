import { rqClient } from "@/shared/api/instance";
import { refetchOnReconnect, useErrorState } from "@/shared/lib/error";
import { EmptyState } from "@/shared/ui/empty-state";
import { EmptyText } from "@/shared/ui/empty-text";
import { Skeleton } from "@/shared/ui/skeleton";
import { AutoScaler } from "./components/auto-scaler";
import Heatmap from "./components/heatmap";
import HeatmapLoadingMask from "./components/heatmap-loading-mask";

interface IContributionProps {
  id: string;
  titleClassName?: string;
}

function Contribution({ id, titleClassName }: IContributionProps) {

  const { data, isLoading, error, refetch } = rqClient.useQuery(
    "get",
    "/api/v1/yapper_page/yapper/{yapper_id}/contributions",
    {
      params: { path: { yapper_id: id } },
    },
    {
      refetchOnReconnect: refetchOnReconnect,
    },
  );

  const totalContributions = data?.contributions?.reduce(
    (acc, curr) => acc + (curr.tweets_count ?? 0),
    0,
  );

  const hasContributions =
    !!data && Array.isArray(data.contributions) && data.contributions.length > 0;
  const isEmpty = !isLoading && !error && !hasContributions;
  const { showReload } = useErrorState(error, isLoading);

  return (
    <div className="h-full grid grid-rows-[min-content_1fr]">
      <h2
        className={`flex items-center justify-between gap-2 text-base leading-base font-medium mb-3 [@media(max-height:800px)]:mb-2 ${titleClassName ?? ""
          }`}
      >
        <div className="flex items-center gap-2">
          <span>Contributions</span>
          {isLoading ? (
            <Skeleton className="w-10 h-5" />
          ) : error && showReload ? null : (
            <div>
              (<EmptyText value={totalContributions} formatter={(v) => String(v)} />)
            </div>
          )}
        </div>
        {error && showReload && (
          <div className="flex items-center">
            <EmptyState
              className="w-auto h-auto p-0"
              onReload={() => {
                void refetch();
              }}
              buttonSize={24}
              buttonClassName="w-[98px]"
            />
          </div>
        )}
      </h2>
      <AutoScaler>
        {isLoading || error ? (
          <HeatmapLoadingMask />
        ) : isEmpty ? (
          <EmptyState
            title="No contributions yet"
            description="This yapper has no contributions in the selected period."
          />
        ) : (
          <Heatmap
            data={data?.contributions ?? []}
            maxCount={data?.max_contributions_in_period ?? 0}
          />
        )}
      </AutoScaler>
    </div>
  );
}

export default Contribution;
