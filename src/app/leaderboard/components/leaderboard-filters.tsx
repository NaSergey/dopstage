"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import AppSelect from "@/shared/ui/app-select";
import { SearchIcon } from "@/shared/ui/icons";
import { Button } from "@/shared/ui/button";
import { rqClient } from "@/shared/api/instance";
import { refetchInterval, refetchOnReconnect } from "@/shared/lib/error";
import { LONG_REFETCH_INTERVAL, STALE_TIME_BUFFER } from "@/shared/lib/constants/refetchInterval";
import { Skeleton } from "@/shared/ui/skeleton";

const ALL_RECEPTORS_VALUE = "all";

export function LeaderboardFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const subnetId = searchParams.get("subnet_id");

  const INTERVAL = Number(process.env.NEXT_PUBLIC_SUBNET_FEED_INTERVAL) || LONG_REFETCH_INTERVAL;

  const { data: programs = [], isLoading } = rqClient.useQuery(
    "get",
    "/api/v1/main_page/featured_programs",
    { params: { query: { page: 1, limit: 100 } } },
    {
      refetchInterval: refetchInterval(INTERVAL),
      refetchOnReconnect: refetchOnReconnect,
      staleTime: INTERVAL - STALE_TIME_BUFFER,
    },
  );
  const receptorOptions = useMemo(
    () => [
      {
        value: ALL_RECEPTORS_VALUE,
        label: "All Subnets",
        icon: <SearchIcon />,
      },
      ...programs.map((p) => ({
        value: p.program_id,
        label: p.program_name,
        icon: p.program_image_url,
      })),
    ],
    [programs],
  );

  const selectValue = subnetId ?? ALL_RECEPTORS_VALUE;

  const handleReceptorChange = (value: string) => {
    const next = new URLSearchParams(searchParams.toString());

    if (value === ALL_RECEPTORS_VALUE) {
      next.delete("subnet_id");
    } else {
      next.set("subnet_id", value);
    }

    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <Skeleton className="w-[240px] h-9 rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 w-full">
      <AppSelect
        options={receptorOptions}
        value={selectValue}
        onChange={handleReceptorChange}
        placeholder="Subnet"
        className="min-w-[240px]"
        isSearchable={true}
        searchPlaceholder="Find subnet"
        emptySearchText="No subnet found"
      />
      {subnetId && subnetId !== ALL_RECEPTORS_VALUE && (
        <Button variant="frame" className="max-w-[150px] min-w-[150px]" inset={13} frameHeight={36} asChild>
          <Link href={`/subnet/${subnetId}`}>Go to subnet</Link>
        </Button>
      )}
    </div>
  );
}
