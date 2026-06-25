import Sparkline from "@/shared/ui/sparkline/sparkline";
import { Skeleton } from "@/shared/ui/skeleton";
import { LineMockIcon, InfoIcon } from "@/shared/ui/icons";
import { memo, ReactNode } from "react";
import AppTooltip from "@/shared/ui/app-tooltip";
import { cn } from "@/shared/lib/utils/css";

function StatsCard({
  title,
  value,
  data,
  isFetching = false,
  tooltipContent,
  showOnlyTitle = false,
  className,
}: {
  title: string | null;
  value: string | number | ReactNode;
  data: number[] | string[];
  isFetching?: boolean;
  tooltipContent?: string;
  showOnlyTitle?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="w-full">
        {title && (
          <h4 className="text-xs leading-tight pb-0.5 text-zinc-500 flex items-center gap-1 [@media(max-height:800px)]:text-[10px] [@media(max-height:720px)]:text-[9px] [@media(max-height:640px)]:text-[8px] [@media(max-height:640px)]:leading-none">
            {title}
            {tooltipContent && (
              <AppTooltip content={tooltipContent}>
                <InfoIcon className="size-4 [@media(max-height:800px)]:size-3.5" />
              </AppTooltip>
            )}
          </h4>
        )}
        {!showOnlyTitle && (
          <>
            {isFetching ? (
              <>
                <Skeleton className="w-[88px] h-5 rounded-none mb-0.5 [@media(max-height:800px)]:mb-0 [@media(max-height:800px)]:h-4 [@media(max-height:800px)]:w-[70px] [@media(max-height:720px)]:h-3.5 [@media(max-height:720px)]:w-[60px] [@media(max-height:640px)]:h-3 [@media(max-height:640px)]:w-[50px]" />
                <LineMockIcon className="[&_svg]:w-full [&_svg]:h-auto [@media(max-height:720px)]:[&_svg]:max-h-[32px] [@media(max-height:640px)]:[&_svg]:max-h-[10px]" />
              </>
            ) : (
              <>
                <div className="flex items-center gap-1 text-sm leading-none text-white mb-0.5 [@media(max-height:800px)]:mb-0 [@media(max-height:800px)]:text-xs [@media(max-height:720px)]:text-[10px] [@media(max-height:640px)]:text-[9px]">
                  {value}
                </div>
                <Sparkline
                  interactive
                  data={data}
                  className="w-full h-auto [@media(max-height:720px)]:max-h-[32px] [@media(max-height:640px)]:max-h-[10px]"
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default memo(StatsCard);
