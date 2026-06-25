"use client";

import { useIsMounted } from "@/shared/lib/hooks/use-is-mounted";
import Wrapper from "@/shared/ui/wrapper";
import { Marquee } from "@/shared/ui/marquee/marquee";
import { ApiComponents } from "@/shared/api/schema";
import { Skeleton } from "@/shared/ui/skeleton";
import { RunningLineItem } from "./running-line-item";
import { rqClient } from "@/shared/api/instance";
import { refetchInterval, refetchOnReconnect } from "@/shared/lib/error";
import { LONG_REFETCH_INTERVAL, STALE_TIME_BUFFER } from "@/shared/lib/constants/refetchInterval";

type RunningLineItemType = ApiComponents["RunningLineItemResponse"];

interface RunningLineClientProps {
  // Optional: when omitted the component fetches on the client (no SSR seed).
  initialData?: RunningLineItemType[];
}


export function RunningLineClient({ initialData }: RunningLineClientProps) {
  const isMounted = useIsMounted();

  const INTERVAL = Number(process.env.NEXT_PUBLIC_SUBNET_FEED_INTERVAL) || LONG_REFETCH_INTERVAL;

  const { data = [] } = rqClient.useQuery(
    "get",
    "/api/v1/common/running_line",
    {},
    {
      initialData: initialData?.length ? initialData : undefined,
      keepPreviousData: true,
      refetchInterval: refetchInterval(INTERVAL),
      refetchOnReconnect: refetchOnReconnect,
      staleTime: INTERVAL - STALE_TIME_BUFFER,
      placeholderData: (prev) => prev,
    },
  );

  if (!isMounted || data.length === 0) {
    return (
      <div className="w-full h-full bg-zinc-950 max-w-full">
        <Skeleton className="w-full h-full rounded-none" />
      </div>
    );
  }

  const duplicatedData = Array.from({ length: 2 }, () => data).flat();

  return (
    <div className="w-full py-1 h-full bg-zinc-950 max-w-full">
      <Wrapper>
        <Marquee speedPxPerSec={30} gap="0.5rem">
          {duplicatedData.map((item, index) => (
            <RunningLineItem key={`${item.program_id}-${index}`} item={item} />
          ))}
        </Marquee>
      </Wrapper>
    </div>
  );
}
