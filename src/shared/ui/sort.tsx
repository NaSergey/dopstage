import { ShevronIcon as ChevronIcon } from "./icons";
import { cn } from "../lib/utils/css";
import React from "react";

type TSortDirection = "asc" | "desc" | null;
enum ESortDirection {
  ASC = "asc",
  DESC = "desc",
}

interface ISortProps {
  value: TSortDirection;
  onChange?: (
    next: TSortDirection,
    e?: React.MouseEvent | React.KeyboardEvent,
  ) => void;
  className?: string;
  isDisabled?: boolean;
  children?: React.ReactNode;
  firstStep?: Exclude<TSortDirection, null>;
}

function nextState(
  curr: TSortDirection,
  firstStep: Exclude<TSortDirection, null>,
): TSortDirection {
  if (curr === null) return firstStep;
  if (curr === firstStep)
    return firstStep === ESortDirection.ASC
      ? ESortDirection.DESC
      : ESortDirection.ASC;
  return null;
}

function Sort({
  value,
  onChange,
  className,
  isDisabled,
  children,
  firstStep = "asc",
}: ISortProps) {
  const handleToggle = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (isDisabled) return;
    e.preventDefault();
    onChange?.(nextState(value, firstStep), e);
  };

  const handleClear = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (isDisabled) return;
    e.preventDefault();
    onChange?.(null, e);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      handleToggle(e);
    }
    if (e.key.toLowerCase() === "r" && e.shiftKey) {
      handleClear(e);
    }
  };

  return (
    <div
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled || undefined}
      className={cn(
        "group flex items-center gap-1 cursor-pointer hover:text-zinc-400/80 transition-colors",
        isDisabled && "cursor-not-allowed opacity-60",
      )}
      onClick={handleToggle}
      onKeyDown={handleKey}
    >
      <div
        className={cn(
          "flex flex-col gap-0.5 p-0.5 transition-all",
          value !== null && "bg-[rgba(99,20,255,0.4)] px-1 py-0.75",
          className
        )}
      >
        <ChevronIcon
          variants="down"
          className={cn(
            "transition-colors",
            value === ESortDirection.ASC ? "text-white" : "text-zinc-600",
          )}
        />

        <ChevronIcon
          variants="up"
          className={cn(
            "transition-colors",
            value === ESortDirection.DESC ? "text-white" : "text-zinc-600",
          )}
        />
      </div>
      {children}
    </div>
  );
}

export default React.memo(Sort);
