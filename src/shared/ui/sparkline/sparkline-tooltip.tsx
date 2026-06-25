"use client";

import React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/lib/utils/css";
import { dateWithoutYear } from "@/shared/lib/format/dateWithoutYear";
import type { SparklineHoverInfo, SparklineData, SparklineDataPoint } from "./types";
import { formatK } from "@/shared/lib/format/formatK";

interface ISparklineTooltipProps {
  info: SparklineHoverInfo;
  data: SparklineData;
  values: number[];
  hasDateLabel: boolean;
  visible: boolean;
  exiting?: boolean;
}

export function SparklineTooltip({
  info,
  data,
  values,
  hasDateLabel,
  visible,
  exiting = false,
}: ISparklineTooltipProps) {
  if (!visible || !info) return null;

  const point = hasDateLabel ? (data[info.index] as SparklineDataPoint) : null;
  const value = values[info.index];

  return createPortal(
    <div
      className={cn(
        "fixed pointer-events-none z-[9999] flex flex-col items-center transition-all duration-200 ease-out",
        exiting ? "opacity-0 scale-95 translate-y-1" : "opacity-100 scale-100 translate-y-0",
      )}
      style={{
        left: info.x,
        top: info.y - 8,
        transform: "translate(-50%, -100%)",
      }}
    >
      <div
        className={cn(
          "whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium shadow-md",
          "bg-white text-black border border-zinc-200",
          "flex flex-row items-center gap-0.5",
          "[clip-path:polygon(8px_0%,calc(100%_-_8px)_0%,100%_8px,100%_calc(100%_-_8px),calc(100%_-_8px)_100%,8px_100%,0%_calc(100%_-_8px),0%_8px)]",
        )}
      >
        {point ? (
          <>
            <span className="text-zinc-500">{dateWithoutYear(point.date)}</span>
            <span className="text-zinc-400">,</span>
            <span className="font-medium">{formatK(value)}</span>
          </>
        ) : (
          <span>{value.toFixed(2)}</span>
        )}
      </div>
      <div className="w-2.5 [clip-path:polygon(0_0,100%_100%,100%)] h-2.5 bg-white border-r border-b border-zinc-200 -mt-1.5 rotate-45" />
    </div>,
    document.body,
  );
}
