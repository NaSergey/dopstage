"use client";

import { cn } from "@/shared/lib/utils/css";
import { ReactNode } from "react";

interface EmptyTextProps {
  value?: number | null | undefined;
  children?: ReactNode;
  text?: string;
  prefix?: string;
  suffix?: string;
  formatter?: (value: number) => string;
  className?: string;
}

export function EmptyText({
  value,
  children,
  text = "",
  prefix = "",
  suffix = "",
  formatter,
  className,
}: EmptyTextProps) {
  const useValueAPI = formatter !== undefined || prefix !== "";
  const isEmpty = value === null || value === undefined || (typeof value === "number" && isNaN(value));
  
  const displayValue = useValueAPI
    ? isEmpty
      ? "--"
      : `${prefix}${formatter ? formatter(value as number) : String(value)}${suffix}`
    : children ?? text;

  return (
    <span className={cn("text-white", className)}>
      {displayValue}
    </span>
  );
}

