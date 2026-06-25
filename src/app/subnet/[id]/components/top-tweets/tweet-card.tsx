"use client";

import { AppImage } from "@/shared/ui/app-image";
import { DopIcon, VerifiedIcon } from "@/shared/ui/icons";
import { ApiComponents } from "@/shared/api/schema";
import getTimeAgo from "@/shared/lib/format/getTimeAgo";
import Link from "next/link";
import { formatK } from "@/shared/lib/format/formatK";
import TitleTooltip from "@/shared/ui/title-tooltip";

export type TweetCardProps = {
  tweet: ApiComponents["ProgramTopTweetsResponse"];
};

export function TweetCard({ tweet }: TweetCardProps) {
  return (
    <Link href={`/dopaminer/${tweet.yapper_id}`} className="grid grid-cols-[1fr_auto] gap-2 items-start">
      <div className="min-w-0">
        <div className="flex items-start gap-2 min-w-0">
          <div className="relative w-8 h-8 shrink-0">
            <AppImage
              src={tweet.yapper_logo_url}
              alt={tweet.yapper_display_name}
              width={32}
              height={32}
              className="w-8 h-8 mask-octagon-rotated"
              fallbackVariant="octagonRotated"
            />
            {tweet.is_authenticated ? (
              <VerifiedIcon className="absolute -right-0.5 -top-0.5 size-3 text-white drop-shadow-md" />
            ) : null}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-1 min-w-0">
                <span
                  className="text-white text-sm leading-5 font-medium truncate"
                  title={tweet.yapper_display_name}
                >
                  {tweet.yapper_display_name}
                </span>
              </div>
            </div>

            <div className="mt-0.5 text-zinc-500 text-xs leading-none">
              {getTimeAgo(tweet.tweet_timestamp)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-end gap-6 text-white">
        <div className="text-right flex flex-col justify-end">
          <div className="text-xs leading-4 text-zinc-500 mb-1">DScore</div>
          <div className="text-sm leading-none font-medium">{tweet.dop_score.toFixed(1)}</div>
        </div>
        <div className="text-right flex flex-col justify-end">
          <div className="text-xs leading-4 text-zinc-500 mb-1 whitespace-nowrap">
            Estimated Dops
          </div>
          <div className="text-sm leading-none font-medium flex items-center justify-end gap-1 overflow-visible">
            {formatK(tweet.estimate_dops)}
            <DopIcon className="size-3 text-[#6314FF] shrink-0" />
          </div>
        </div>
      </div>

      <TitleTooltip text={tweet.tweet_text} className="col-span-2" maxHeight={200}>
        <div className="pb-3 text-zinc-200/90 text-sm leading-snug truncate">
          {tweet.tweet_text}
        </div>
      </TitleTooltip>
    </Link>
  );
}

