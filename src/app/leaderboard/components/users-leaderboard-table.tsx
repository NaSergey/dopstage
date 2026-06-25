"use client";

import { DataTable } from "@/shared/ui/data-table";
import { EmptyState } from "@/shared/ui/empty-state";
import { useEffect, useState, useMemo } from "react";
import { PaginationControls } from "@/shared/ui/pagination";
import { getUsersLeaderboardColumns } from "./users-leaderboard-columns";
import { useSearchParams } from "next/navigation";
import { useTableNavigation, TABLE_PATHS } from "@/shared/lib/hooks/useTableNavigation";
import { rqClient } from "@/shared/api/instance";
import { refetchInterval, refetchOnReconnect, useErrorState } from "@/shared/lib/error";
import { LONG_REFETCH_INTERVAL, STALE_TIME_BUFFER } from "@/shared/lib/constants/refetchInterval";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/utils/css";
import { toApiParams } from "../lib/leaderboard-params";

interface UsersLeaderboardTableProps {
  pageSize?: number;
  className?: string;
}

export function UsersLeaderboardTable({
  pageSize = 20,
  className = "",
}: UsersLeaderboardTableProps) {
  const searchParams = useSearchParams();
  const handleRowClick = useTableNavigation(TABLE_PATHS.dopaminerYapper);
  const { program_id, yapper_id } = toApiParams(searchParams);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [program_id, yapper_id]);

  const INTERVAL = Number(process.env.NEXT_PUBLIC_SUBNET_FEED_INTERVAL) || LONG_REFETCH_INTERVAL;

  const { data, isLoading, error, refetch } = rqClient.useQuery(
    "get",
    "/api/v1/yapper_page/yapper/global/leaderboard",
    {
      params: {
        query: {
          program_id: program_id ?? null,
          yapper_id: yapper_id ?? null,
          page,
          limit: pageSize,
        },
      },
    },
    {
      refetchInterval: refetchInterval(INTERVAL),
      refetchOnReconnect: refetchOnReconnect,
      staleTime: INTERVAL - STALE_TIME_BUFFER,
      placeholderData: (prev) => prev,
    },
  );
  const rows = data?.leaderboard ?? [];
  const totalPages = data?.page_count ?? 1;

  const { hasError, showReload } = useErrorState(error, isLoading);

  const columns = useMemo(
    () => getUsersLeaderboardColumns(page, pageSize),
    [page, pageSize]
  );

  return (
    <div className={cn("px-4 pt-4 bg-zinc-900", className)}>
      <DataTable
        columns={columns}
        data={rows}
        className="text-xs"
        rowClassName="hover:bg-[#6314FF66] cursor-pointer group border-b border-zinc-800"
        isLoading={isLoading}
        onRowClick={handleRowClick}
        loadingContent={
          <div className="grid gap-[1px]">
            {Array.from({ length: pageSize }).map((_, i) => (
              <Skeleton key={i} className="w-full h-10 rounded-none" />
            ))}
          </div>
        }
        onErrorContent={
          hasError ? (
            <EmptyState
              onReload={showReload ? () => refetch() : undefined}
              showIcon={true}
              title="Something went wrong, please reload"
            />
          ) : undefined
        }
        noDataContent={
          !isLoading && !hasError && rows.length === 0 ? (
            <EmptyState showIcon={true} title="No data" />
          ) : undefined
        }
      />
      {!hasError && (totalPages > 1 || isLoading) && (
        <PaginationControls
          currentPage={page}
          isLastPage={totalPages}
          onPageChange={setPage}
          disabled={isLoading}
        />
      )}
    </div>
  );
}
