import { DopIcon } from "@/shared/ui/icons";
import { Button } from "@/shared/ui/button";
import { formatK } from "@/shared/lib/format/formatK";
import { rqClient } from "@/shared/api/instance";
import { Skeleton } from "@/shared/ui/skeleton";
import { EmptyText } from "@/shared/ui/empty-text";
import { EmptyState } from "@/shared/ui/empty-state";
import { shouldShowReload } from "@/shared/lib/error";

interface IClaimingProps {
  id: string;
}
function Claiming({ id }: IClaimingProps) {
  const { data, isLoading, error, refetch } = rqClient.useQuery(
    "get",
    "/api/v1/yapper_page/yapper/{yapper_id}/header",
    {
      params: { path: { yapper_id: id } },
    },
    {
      enabled: Boolean(id),
    },
  );

  const hasError = !isLoading && error;
  const showReload = error ? shouldShowReload(error) : false;

  const handleClaimAll = () => {
  };

  return (
    <div className="h-full">
      <div className="h-full flex flex-col [@media(max-height:850px)]:h-full">
        <div className="flex flex-col gap-2">
          <h4 className="text-xs leading-xs text-white/30">Dops</h4>
          {isLoading ? (
            <Skeleton className="w-full h-9" />
          ) : (
            <>
              {/* Dop points row */}
              <div className="flex items-center gap-1 justify-between">
                <div className="flex items-center gap-1">
                  <p className="text-base leading-none font-medium">
                    <EmptyText
                      value={data?.total_dops ?? 0}
                      formatter={formatK}
                      className="text-base leading-none font-medium"
                    />
                  </p>
                  <DopIcon className="size-4" />
                </div>
              </div>

              {/* Multiplier row below Dop points */}
              {/* <div className="mt-2 flex flex-col gap-1">
                <h4 className="text-xs leading-xs text-white/30">
                  Dops multiplicator
                </h4>
                <div className="flex items-center justify-between gap-1">
                  <Multiplier
                    value={null}
                    variant="simple"
                    colorScheme="gray"
                  />
                </div>
              </div> */}
            </>
          )}
        </div>

        {/* <div className="flex items-center justify-between gap-1 py-3 [@media(max-height:750px)]:py-1">
          <TveDistribution
            data={data}
            isLoading={isLoading}
            hasError={!!error}
          />
        </div> */}

        {/* Bottom-right claim button */}
        <div className="mt-auto flex justify-end">
          {hasError ? (
            <EmptyState
              showIcon={false}
              onReload={showReload ? () => refetch() : undefined}
              className="h-auto w-auto !items-end !justify-end"
            />
          ) : (
            <Button
              disabled={true}
              // disabled={
              //   isLoading ||
              //   !data?.claimable_amount ||
              //   data?.claimable_amount === 0
              // }
              variant="frame-gray"
              className="w-[137px]"
              onClick={handleClaimAll}
            >
              Coming soon
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Claiming;
