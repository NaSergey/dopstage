"use client";

import { DataTable } from "@/shared/ui/data-table";
import { rqClient } from "@/shared/api/instance";
import { useTableNavigation, TABLE_PATHS } from "@/shared/lib/hooks/useTableNavigation";
import { useState, useMemo } from "react";
import { Skeleton } from "@/shared/ui/skeleton";
import { PaginationControls } from "@/shared/ui/pagination";
import { LONG_REFETCH_INTERVAL, STALE_TIME_BUFFER } from "@/shared/lib/constants/refetchInterval";
import { refetchInterval, useErrorState } from "@/shared/lib/error";
import { EmptyState } from "@/shared/ui/empty-state";
import { getProgramsColumns } from "./programs-leaderboard-columns";
import { useTableChanges } from "@/shared/lib/hooks/use-table-changes";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils/css";
import { useIsMounted } from "@/shared/lib/hooks/use-is-mounted";
// import { SortingState } from "@tanstack/react-table";
import { SadIcon } from "@/shared/ui/icons";
import { refetchOnReconnect } from "@/shared/lib/error";
import type { ApiComponents } from "@/shared/api/schema";

// Use API schema type instead of any for type safety (no-explicit-any).
interface ProgramsYappriceTableProps {
  initialData?: ApiComponents["ProgramsMainLeaderboardResponse"][];
  pageSize?: number;
  className?: string;
  showSeeAllButton?: boolean;
}

export function ProgramsYappriceTable({
  initialData = [],
  pageSize = 20,
  className = "",
  showSeeAllButton = false,
}: ProgramsYappriceTableProps) {
  const isMounted = useIsMounted();
  const handleRowClick = useTableNavigation(TABLE_PATHS.subnet);
  const [page, setPage] = useState(1);
  // const [sorting, setSorting] = useState<SortingState>([]);

  // const active = sorting[0];
  // const sort_by = active?.id ?? undefined;
  // const direction = active ? (active.desc ? "desc" : "asc") : ("desc" as "asc" | "desc");
  const INTERVAL = Number(process.env.NEXT_PUBLIC_SUBNET_FEED_INTERVAL) || LONG_REFETCH_INTERVAL;

  const { data: apiData = [], isLoading, error, refetch } = rqClient.useQuery(
    "get",
    "/api/v1/main_page/programs_leaderboard",
    {
      params: {
        query: {
          page,
          limit: pageSize,
          // sort_by,
          // direction,
        },
      },
    },
    {
      refetchInterval: refetchInterval(INTERVAL),
      refetchOnReconnect: refetchOnReconnect,
      staleTime: INTERVAL - STALE_TIME_BUFFER,
      placeholderData: (prev) => prev,
      // Seed page 1 from SSR only when it actually has rows; otherwise leave
      // undefined so the client fetches (no empty-array "data exists" deadlock).
      initialData: page === 1 && initialData.length ? initialData : undefined,
    },
  );

  const tableChanges = useTableChanges(apiData as Record<string, unknown>[]);
  const isLastPage = apiData.length > 0 ? apiData[0].page_count : 1;
  // Reset page to 1 when sorting changes
  // useEffect(() => {
  //   setPage(1);
  // }, [sort_by, direction]);
  const { hasError, showReload } = useErrorState(error, isLoading);

  const columns = useMemo(() => getProgramsColumns(page, pageSize), [page, pageSize]);

  return (
    <div className={cn("px-4 pt-4 bg-zinc-900", className)}>
      <DataTable
        columns={columns}
        data={apiData}
        tableChanges={tableChanges}
        isLoading={!isMounted || isLoading}
        className="text-xs"
        rowClassName="hover:bg-[#6314FF66] cursor-pointer group border-b border-zinc-800 [&_td]:py-2.5"
        // state={{ sorting }}
        // onSortingChange={setSorting}
        loadingContent={
          <div className="flex flex-col gap-[1px] py-1">
            {Array.from({ length: pageSize }).map((_, i) => (
              <div key={i} className="flex items-center">
                <span className="text-zinc-500 text-xs w-6 text-center">
                  {(page - 1) * pageSize + i + 1}
                </span>
                <Skeleton className="h-[45.4px] w-full rounded-none" />
              </div>
            ))}
          </div>
        }
        onRowClick={handleRowClick}
        onErrorContent={
          hasError ? (
            <div className="h-[450px]">
              <EmptyState
                showIcon={true}
                title={"Something went wrong, please reload"}
                onReload={showReload ? () => refetch() : undefined}
              />
            </div>
          ) : undefined
        }
        noDataContent={
          <div className="flex min-h-[450px] flex-col items-center justify-center text-zinc-600">
            <div className="flex items-center justify-center mb-2">
              <SadIcon className="size-16" />
            </div>
            <div className="text-sm leading-sm">
              <p>No Data</p>
            </div>
          </div>
        }
      />
      {showSeeAllButton ? (
        <div className="flex bg-zinc-950 -mx-4 px-4 py-2 items-center justify-start">
          <div className="flex items-center gap-2">
            <Button variant="frame-gray" className="w-[182px]" asChild>
              <Link href="/leaderboard?view=subnets">See all subnets</Link>
            </Button>
          </div>
        </div>
      ) : (
        !hasError && (isLastPage > 1 || isLoading) && (
          <PaginationControls
            currentPage={page}
            isLastPage={isLastPage}
            onPageChange={setPage}
            disabled={isLoading}
          />
        )
      )}
    </div>
  );
}
