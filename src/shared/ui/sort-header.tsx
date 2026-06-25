import * as React from "react";
import Sort from "@/shared/ui/sort";
import { Column } from "@tanstack/react-table";

type TSortDirection = "asc" | "desc" | null;

const toUi = (is: false | "asc" | "desc"): TSortDirection =>
  is === false ? null : is;

type TProps<TData, TValue> = {
  column: Column<TData, TValue>;
  firstStep?: Exclude<TSortDirection, null>; // "asc" | "desc"
  children: React.ReactNode;
};

export default function SortHeader<TData, TValue>({
  column,
  firstStep,
  children,
}: TProps<TData, TValue>) {
  const ui = toUi(column.getIsSorted());

  const handleChange = (
    next: TSortDirection,
    e?: React.MouseEvent | React.KeyboardEvent,
  ) => {
    const isMulti = !!(e && (e.metaKey || e.ctrlKey));

    if (next === null) {
      column.clearSorting();
    } else {
      column.toggleSorting(next === "desc", isMulti);
    }
  };

  return (
    <Sort value={ui} firstStep={firstStep} onChange={handleChange}>
      {children}
    </Sort>
  );
}
