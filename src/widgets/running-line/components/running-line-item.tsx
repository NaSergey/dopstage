"use client";

import { memo } from "react";
import { AppImage } from "@/shared/ui/app-image";
import { cn } from "@/shared/lib/utils/css";
import { formatK } from "@/shared/lib/format/formatK";
import {
  NewRibbonIcon,
  FdvIcon,
  TddIcon,
  RunningArrowIcon,
  TokenPriceIcon,
} from "@/shared/ui/icons";
import Link from "next/link";
import DopValue from "@/shared/ui/dops-value";
import { ApiComponents } from "@/shared/api/schema";

type RunningLineItem = ApiComponents["RunningLineItemResponse"];

interface RunningLineItemProps {
  item: RunningLineItem;
}

export const RunningLineItem = memo(({ item }: RunningLineItemProps) => (
  <Link
    href={`/subnet/${item.program_id}`}
    className="flex items-center gap-2 hover:opacity-70 transition-opacity"
  >
    {item.is_new && <NewRibbonIcon className="w-[25px] h-[14px]" />}

    <AppImage
      src={item.icon_url}
      alt={item.program_name ?? ""}
      width={20}
      height={20}
      className="mask-octagon"
      fallbackVariant="octagon"
    />

    <span
      className="text-sm leading-none truncate max-w-[160px]"
      title={item.program_name}
    >
      {item.program_name}
    </span>

    <span
      className={cn(
        "flex items-center text-xs",
        item.dop_price_is_up ? "text-lime-500" : "text-red-500",
      )}
    >
      {item.dop_price_is_up ? (
        <span className="flex items-center">
          <TokenPriceIcon variants="up" />
          <RunningArrowIcon variants="up" />
        </span>
      ) : (
        <span className="flex items-center">
          <TokenPriceIcon variants="down" />
          <RunningArrowIcon variants="down" />
        </span>
      )}
      <DopValue>
        <span className="ml-1">{formatK(item.dop_price ?? 0)}</span>
      </DopValue>
    </span>

    <span className="flex items-center gap-1 text-xs leading-none">
      <FdvIcon className="w-[19px] h-[10px]" />
      {formatK(item.fdv ?? 0)}
    </span>

    <span className="flex items-center gap-1 text-xs leading-none pr-2">
      <TddIcon className="w-[22px] h-[12px]" />
      {formatK(item.daily_tdd ?? 0)}
    </span>
  </Link>
));

RunningLineItem.displayName = "RunningLineItem";