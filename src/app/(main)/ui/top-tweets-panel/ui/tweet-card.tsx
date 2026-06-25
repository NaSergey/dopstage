"use client";

import { AppImage } from "@/shared/ui/app-image";
import { TddIcon } from "@/shared/ui/icons";
import Sparkline from "@/shared/ui/sparkline/sparkline";
import { formatK } from "@/shared/lib/format/formatK";
import { AppLink } from "@/shared/ui/app-link";
import AppTooltip from "@/shared/ui/app-tooltip";
import TitleTooltip from "@/shared/ui/title-tooltip";
import { EmptyText } from "@/shared/ui/empty-text";
import DopValue from "@/shared/ui/dops-value";

type TweetCardProps = {
  yapper_id: string;
  avatarUrl: string;
  program_image_url?: string | null;
  author: string;
  timeAgo: string;
  yapScore: number;
  estimateDops: number;
  title: string;
  community: string;
  fdv: number;
  fdvChart?: number[];
};

export function TweetCard({
  yapper_id,
  avatarUrl,
  program_image_url,
  author,
  timeAgo,
  yapScore,
  estimateDops,
  title,
  community,
  fdv,
  fdvChart = [],
}: TweetCardProps) {
  const hasFdvData = fdvChart.length > 0;
  const firstFdv = hasFdvData ? Number(fdvChart[0]) : 0;
  const lastFdv = hasFdvData ? Number(fdvChart[fdvChart.length - 1]) : 0;
  const fdvChange =
    firstFdv !== 0 ? ((lastFdv - firstFdv) / firstFdv) * 100 : 0;
  const isPositive = fdvChange > 0;
  const sparklineColor = isPositive ? "#00ff00" : "#ef4444";

  return (
    <AppLink
      href={'/dopaminer/' + yapper_id}
      className="block group !opacity-100 hover:!opacity-100"
    >
      <div className="bg-black p-4 w-[260px] min-h-[216px] select-none transition-all duration-300 ease-out group-hover:scale-105">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <AppImage
              src={avatarUrl}
              alt={author}
              width={32}
              height={32}
              className="w-8 h-8 mask-octagon-rotated object-cover shrink-0"
              fallbackVariant="octagonRotated"
            />
            <div className="min-w-0 flex-1">
              <div
                className="text-white text-base font-medium truncate pr-1"
                title={author}
              >
                {author}
              </div>
              <div className="text-zinc-600 text-xs">{timeAgo}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-zinc-600 text-xs">DScore</div>
            <div className="text-white text-base">
              <EmptyText value={yapScore} formatter={(v) => v.toFixed(1)} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-3">
          <div className="text-zinc-600 text-sm">Estimated Dops</div>
          <DopValue className="text-white text-base font-medium tracking-wide flex justify-end items-center gap-1">
            {formatK(estimateDops)}
          </DopValue>
        </div>

        <TitleTooltip text={title} className="mt-1">
          <div className="text-white text-xs leading-5 h-10 line-clamp-2">
            {title}
          </div>
        </TitleTooltip>

        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <AppImage
                src={program_image_url}
                alt={community}
                width={20}
                height={20}
                className="w-5 h-5 mask-octagon object-cover"
                fallbackVariant="octagon"
              />
              <div className="text-zinc-600 text-xs">{community}</div>
            </div>
            <div className="inline-flex items-center gap-2 text-zinc-300 text-sm">
              <TddIcon className="w-[23px] h-[14px]" />
              <span className="text-zinc-600 text-sm">{formatK(fdv)}</span>
            </div>
          </div>
          {/* Right: sparkline */}
          <div className="w-24 h-8">
            <AppTooltip
              content={
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-zinc-400">Total Dops Distributed, 7 days</p>
                  <p className="text-xs">
                    {formatK(fdv)}{" "}
                    <span
                      className={
                        isPositive ? "text-[#55FF00]" : "text-[#FF002B]"
                      }
                    >
                      {fdvChange >= 0 ? "+" : ""}
                      {fdvChange.toFixed(2)}%
                    </span>
                  </p>
                </div>
              }
              side="left"
              sideOffset={8}
            >
              <Sparkline
                width={96}
                height={32}
                data={fdvChart}
                stroke={sparklineColor}
                strokeWidth={2}
              />
            </AppTooltip>
          </div>
        </div>
      </div>
    </AppLink>
  );
}
