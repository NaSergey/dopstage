import { rqClient } from "@/shared/api/instance";
import { shouldShowReload, refetchOnReconnect } from "@/shared/lib/error";
import RainbowRadarChart from "./components/rainbow-chart";
import { EmptyState } from "@/shared/ui/empty-state";
import { cn } from "@/shared/lib/utils/css";

interface ISpiderChartProps {
  id: string;
}

function SpiderChart({ id }: ISpiderChartProps) {

  const { data, isLoading, error, refetch } = rqClient.useQuery(
    "get",
    "/api/v1/yapper_page/yapper/{yapper_id}/spiderchart",
    {
      params: { path: { yapper_id: id } },
    },
    {
      refetchOnReconnect: refetchOnReconnect,
    },
  );

  const hasError = !isLoading && error;
  const showReload = error ? shouldShowReload(error) : false;

  return (
    <div className="h-full flex justify-center items-start relative">
      <div
        className={cn(
          "[@media(max-height:1100px)]:h-full w-full transition-opacity",
          hasError && "opacity-30",
        )}
      >
        <RainbowRadarChart
          isLoading={isLoading}
          data={{
            engagement: data?.engagement ?? 0,
            smart: data?.smart ?? 0,
            alpha_hunter: data?.alpha_hunter ?? 0,
            bullish: data?.bullish ?? 0,
            creative: data?.creative ?? 0,
          }}
        />
      </div>
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <EmptyState
              showIcon={false}
              title=""
              description=""
              className="w-[180px] h-auto p-0"
              onReload={showReload ? () => refetch() : undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default SpiderChart;
