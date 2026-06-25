import React from "react";
import { TableCell } from "@/shared/ui/table";

interface AnimatedTableCellProps {
  animKey?: number;
  rowDelay: number;
  renderContent: React.ReactNode;
}

export function AnimatedTableCell({
  animKey,
  rowDelay,
  renderContent,
}: AnimatedTableCellProps) {
  return (
    <TableCell className="text-xs leading-none line-height-xs spacing-none font-normal">

      {animKey !== undefined ? (
        <span
          key={animKey}
          className="table-cell-flash"
          style={{ '--row-delay': `${rowDelay}s` } as React.CSSProperties}
        >
          {renderContent}
        </span>
      ) : (
        renderContent
      )}
    </TableCell>
  );
}
