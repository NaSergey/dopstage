import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  OnChangeFn,
  RowData,
} from "@tanstack/react-table";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { cn } from "../lib/utils/css";
import Loader from "./loader";
import { MemoizedTableRow, MemoizedRowProps } from "./data-table/memoized-table-row";
import type { TableChanges } from "@/shared/lib/hooks/use-table-changes";


declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- TanStack Table requires these generics
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Opt out of cell highlight entirely (e.g. Sparkline columns) */
    skipHighlight?: boolean;
  }
}

export interface IDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
  rowClassName?: string | ((row: TData) => string);
  headerClassName?: string;
  noDataContent?: React.ReactNode;
  onErrorContent?: React.ReactNode;
  loadingContent?: React.ReactNode;
  isLoading?: boolean;
  manualSorting?: boolean;

  onRowClick?: (row: TData) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;

  state?: {
    sorting?: SortingState;
  };
  onSortingChange?: OnChangeFn<SortingState>;

  tableChanges?: TableChanges;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  rowClassName,
  noDataContent,
  onErrorContent,
  headerClassName,
  loadingContent,
  isLoading,
  state,
  manualSorting,

  onSortingChange,
  onRowClick,
  onLoadMore,
  hasMore,
  tableChanges,
}: IDataTableProps<TData, TValue>) {
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table API limitation
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange,
    state,
    manualSorting,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  // Compute random stagger delays for changed rows on each animation cycle
  const rowDelays = useMemo(() => {
    if (!tableChanges?.changedCells.size) return new Map<number, number>();
    const indices = [...tableChanges.changedCells.keys()];
    const randomized = [...indices].sort(() => Math.random() - 0.5);
    return new Map(randomized.map((rowIdx, pos) => [rowIdx, pos * 0.1]));
  }, [tableChanges]);

  const shouldStretch =
    isLoading || !!onErrorContent || !table.getRowModel().rows?.length;

  useEffect(() => {
    if (!onLoadMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      {
        root: containerRef.current,
        threshold: 1.0,
      },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [onLoadMore, hasMore]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full min-w-0 min-h-0 overflow-auto [scrollbar-gutter:stable]",
        shouldStretch &&
        "[&>[data-slot=table-container]]:h-full [&>[data-slot=table-container]>table]:h-full",
        className,
      )}
    >
      <Table className={'table-fixed'}>
        <TableHeader >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className={cn("hover:bg-transparent", headerClassName)}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{ width: header.column.columnDef.size }}
                    className={cn(
                      "text-xs leading-none line-height-xs text-zinc-500 spacing-none font-medium whitespace-nowrap",
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow className="h-full hover:bg-transparent">
              <TableCell
                colSpan={columns.length}
                className="p-0 align-top text-center"
              >
                {loadingContent ?? ""}
              </TableCell>
            </TableRow>
          ) : onErrorContent ? (
            <TableRow className="h-full hover:bg-transparent">
              <TableCell
                colSpan={columns.length}
                className="p-0 align-middle text-center"
              >
                {onErrorContent}
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            <>
              {table.getRowModel().rows.map((row) => (
                <MemoizedTableRow
                  key={row.id}
                  row={row}
                  rowChangedFields={tableChanges?.changedCells.get(row.index)}
                  isNewRow={tableChanges?.newRowIndices.has(row.index) ?? false}
                  rowDelay={rowDelays.get(row.index) ?? 0}
                  rowClassName={rowClassName as MemoizedRowProps["rowClassName"]}
                  onRowClick={onRowClick as MemoizedRowProps["onRowClick"]}
                />
              ))}
              {/*Loader sentinel */}
              {hasMore && (
                <TableRow className="cursor-default hover:bg-transparent">
                  <TableCell colSpan={columns.length}>
                    <div ref={loaderRef}></div>
                    <div className="h-8 w-full text-center text-zinc-500 flex items-center justify-center">
                      <Loader />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ) : (
            <TableRow className="h-full hover:bg-transparent">
              <TableCell
                colSpan={columns.length}
                className="p-0 align-top text-center"
              >
                {noDataContent ?? ""}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
