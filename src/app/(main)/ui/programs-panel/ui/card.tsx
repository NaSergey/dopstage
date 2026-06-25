"use client";

import { AppImage } from "@/shared/ui/app-image";
import { ApiComponents } from "@/shared/api/schema";
import ProgressBar from "@/shared/ui/progress-bar";
import { DopIcon, FdvIcon, FireIcon, DPriceIcon } from "@/shared/ui/icons";
import { FdvWithFrame } from "./fdv-with-frame";
import { formatK } from "@/shared/lib/format/formatK";
import { getShareColor } from "@/shared/lib/utils/color";
import Link from "next/link";
import { EmptyText } from "@/shared/ui/empty-text";

type Props = {
  data: ApiComponents["TopProgramResponse"];
};

const formatPercentage = (n: number) => (n <= 5 ? n.toFixed(2) : n.toFixed(1));

export function ProgramCard({ data }: Props) {
  return (
    <Link href={`/subnet/${data.program_id}`} className="group block flex-shrink-0 min-w-[156px]">
      <div className="relative z-50 bg-zinc-900 w-[156px] h-[200px] flex-shrink-0 shadow-2xl transition-all duration-300 ease-out group-hover:scale-105 grid grid-rows-[156px_4px_auto]">
        <div className="relative w-full h-full overflow-hidden">
          <AppImage
            src={data.program_image_url}
            alt={data.program_name}
            width={156}
            height={156}
            className="w-full h-full object-cover"
            fallbackVariant="octagon"
          />
          <span className="text-white bg-black py-0.5 px-1 absolute top-0 left-0 text-sm font-medium truncate max-w-full">
            {data.program_name}
          </span>
          <div className="absolute bottom-0 left-0 right-0 bg-black py-0.5 px-1 flex justify-between items-center">
            <div className={`flex items-center gap-1 text-[11px] font-medium ${getShareColor((data.reward_rate ?? 0) * 100)}`}>
              <span>
                {formatPercentage((data.reward_rate ?? 0) * 100)}%
              </span>
              <FireIcon className="w-[8px] h-[12px] flex-shrink-0" />
            </div>
            <div className="flex items-center gap-1">
              <DPriceIcon className="w-8 h-5" />
              <span className="text-white mt-0.5 text-[11px] leading-none">
                <EmptyText>
                  {data.dop_price ? `${formatK(data.dop_price, 1)}` : "N/A"}
                </EmptyText>
              </span>
              <DopIcon />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full">
          <ProgressBar
            value={data.reward_rate ?? 0}
            height={4}
            width="100%"
            variant="dense"
          />
        </div>

        {/* TVD and FDV row */}
        <div className="grid grid-cols-2 gap-0.5 items-center">
          <div className="rounded flex items-center justify-start">
            <div className="flex items-center gap-1.5 mt-0.5 pl-1 pr-0.5 pt-2 pb-1.5 leading-none">
              <FdvIcon className="w-6 h-3.5 shrink-0" />
              <span className="text-white text-xs leading-none">
                {`$${formatK(data.fdv, 0)}`}
              </span>
            </div>
          </div>
          <div className="rounded relative overflow-hidden">
            <div className="absolute inset-0" />
            <div className="relative flex items-center justify-center pr-[1px] pt-2 pb-1.5">
              <FdvWithFrame
                value={`${formatK(data.tdd, 1)}`}
                animated={data.fdv > 900000}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
