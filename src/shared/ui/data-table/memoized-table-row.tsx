import React from "react";
import { flexRender, Row } from "@tanstack/react-table";
import { TableRow } from "@/shared/ui/table";
import { cn } from "@/shared/lib/utils/css";
import { AnimatedTableCell } from "./animated-table-cell";

export interface MemoizedRowProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: Row<any>;
  rowChangedFields?: Map<string, number>;
  isNewRow: boolean;
  rowDelay: number;
  rowClassName?: string | ((row: unknown) => string);
  onRowClick?: (row: unknown) => void;
}

export const MemoizedTableRow = React.memo(
  function MemoizedTableRow({ row, rowChangedFields, isNewRow, rowDelay, rowClassName, onRowClick }: MemoizedRowProps) {
    return (
      <TableRow
        data-state={row.getIsSelected() && "selected"}
        className={cn(
          typeof rowClassName === "function" ? rowClassName(row.original) : rowClassName,
          isNewRow && "table-row-flash",
        )}
        onClick={() => onRowClick?.(row.original)}
      >
        {row.getVisibleCells().map((cell) => {
          const skip = cell.column.columnDef.meta?.skipHighlight ?? false;
          let animKey: number | undefined;
          if (!skip && rowChangedFields) {
            const accessorKey = (cell.column.columnDef as { accessorKey?: string }).accessorKey;
            if (accessorKey) animKey = rowChangedFields.get(accessorKey);
          }
          return (
            <AnimatedTableCell
              key={cell.id}
              animKey={animKey}
              rowDelay={rowDelay}
              renderContent={flexRender(cell.column.columnDef.cell, cell.getContext())}
            />
          );
        })}
      </TableRow>
    );
  },
  (prev, next) =>
    prev.row.original === next.row.original &&
    prev.rowChangedFields === next.rowChangedFields &&
    prev.isNewRow === next.isNewRow &&
    prev.rowDelay === next.rowDelay,
);
