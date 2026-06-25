import { AppImage } from "@/shared/ui/app-image";
import { ColumnDef } from "@tanstack/react-table";
import { formatNumber } from "@/shared/lib/format/formatNumber";
import { formatK } from "@/shared/lib/format/formatK";
import Sparkline from "@/shared/ui/sparkline/sparkline";
import {
  DopIcon,
  InfoIcon,
  RankArrowIcon,
  FallbackOctagon,
} from "@/shared/ui/icons";
import { ApiComponents as TApiComponents } from "@/shared/api/schema";
import ProgressBar from "@/shared/ui/progress-bar";
// import SortHeader from "@/shared/ui/sort-header";
import AppTooltip from "@/shared/ui/app-tooltip";
import DopValue from "@/shared/ui/dops-value";

type ProgramRow = TApiComponents["ProgramsMainLeaderboardResponse"];

export const getProgramsColumns = (page = 1, pageSize = 20): ColumnDef<ProgramRow>[] => [
  {
    accessorKey: "#",
    enableSorting: false,
    size: 56,
    header: () => (
      <div className="flex items-center justify-center gap-1 text-zinc-500">
        <span className="text-center text-sm">#</span>
      </div>
    ),
    cell: ({ row }) => {
      const rank = (page - 1) * pageSize + row.index + 1;
      const rankChange = row.original.rank_change ?? 0;
      return (
        <div className="flex flex-col items-center justify-center leading-none ">
          {rankChange !== 0 ? (
            <div className="flex flex-col items-center justify-center">
              <span className="text-white font-medium">{rank}</span>
              <span className="h-2 flex items-center justify-center mt-1.5">
                <RankArrowIcon className="w-3 h-1" direction={rankChange > 0 ? "up" : "down"} />
                <span
                  className="text-[7px] font-bold ml-0.5"
                  style={{ color: rankChange > 0 ? "#55FF00" : "#FF4444" }}
                >
                  {Math.abs(rankChange)}
                </span>
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center min-h-[26px] justify-center">
              <span className="text-white font-medium">{rank}</span>
            </div>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: "@",
    enableSorting: false,
    size: 180,
    header: () => (
      <div className="flex items-center gap-1 text-zinc-500">
        <span>@</span>
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 min-w-0 max-w-[170px]">
          <AppImage
            src={row.original.program_image_url}
            alt={row.original.program_name}
            width={24}
            height={24}
            className="w-6 h-6 mask-octagon flex-shrink-0"
            fallbackVariant="octagon"
          />
          <span className="text-white py-1 font-medium truncate">
            {row.original.program_name}
          </span>
        </div>
      );
    },
  },
  {
    id: "tweet_price",
    accessorKey: "tweet_price",
    enableSorting: true,
    size: 140,
    meta: { skipHighlight: true }, // Has sparkline chart, don't highlight
    header: () => (
      // <SortHeader column={column}>
      <div className="flex items-center gap-1">
        <span>DPrice</span>
        <DopIcon />
      </div>
      // </SortHeader>
    ),
    cell: ({ row }) => {
      const priceData = row.original.daily_dop_price_chart ?? [];
      const hasPriceData = priceData.length > 0;
      const firstPrice = hasPriceData ? Number(priceData[0]) : 0;
      const lastPrice = hasPriceData
        ? Number(priceData[priceData.length - 1])
        : 0;
      const priceChange =
        firstPrice !== 0 ? ((lastPrice - firstPrice) / firstPrice) * 100 : 0;
      const avgPrice = hasPriceData
        ? priceData.reduce((sum, price) => sum + Number(price), 0) /
        priceData.length
        : (row.original.dop_price ?? 0);

      return (
        <div className="flex items-center justify-between">
          <div className="text-white">{formatK(row.original.dop_price)}</div>
          <div className="w-16 h-6">
            <AppTooltip
              content={
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-zinc-400">
                    Avg DPrice, 7 days
                  </p>
                  <p className="text-xs ">
                    {formatK(avgPrice)}{" "}
                    <span
                      className={
                        priceChange >= 0 ? "text-[#55FF00]" : "text-[#FF002B]"
                      }
                    >
                      {priceChange >= 0 ? "+" : ""}
                      {priceChange.toFixed(2)}%
                    </span>
                  </p>
                </div>
              }
              side="left"
              sideOffset={8}
            >
              <Sparkline data={priceData} width={64} height={24} />
            </AppTooltip>
          </div>
        </div>
      );
    },
  },
  {
    id: "dops_supply_share",
    accessorKey: "dops_supply_share",
    enableSorting: true,
    size: 120,
    meta: { skipHighlight: true }, // Has progress bar, don't highlight
    header: () => (
      // <SortHeader column={column}>
      <div className="flex items-center gap-1">
        <span>Reward Rate</span>
        <AppTooltip content={<p>Percentage of total supply distributed</p>}>
          <InfoIcon className="text-zinc-600" />
        </AppTooltip>
      </div>
      // </SortHeader>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <div className="w-24">
            <ProgressBar
              value={row.original.reward_rate ?? 0}
              height={8}
              width="100%"
              variant="dense"
            />
          </div>
        </div>
      );
    },
  },
  {
    id: "tdd",
    accessorKey: "tdd",
    enableSorting: true,
    size: 80,
    header: () => (
      // <SortHeader column={column}>
      <div className="flex items-center gap-1">
        <span>TDD</span>
        <AppTooltip content="Total Dops Distributed">
          <InfoIcon className="size-3.5 text-white/30" />
        </AppTooltip>
      </div>
      // </SortHeader>
    ),
    cell: ({ row }) => {
      return <div className="text-white">{formatK(row.original.tdd)}</div>;
    },
  },
  {
    id: "fdv",
    accessorKey: "fdv",
    enableSorting: true,
    size: 90,
    header: () => (
      // <SortHeader column={column}>
      <div className="flex items-center gap-1">
        <span>FDV</span>
        <AppTooltip content={<p>Fully Diluted Valuation</p>}>
          <InfoIcon className="text-zinc-600" />
        </AppTooltip>
      </div>
      // </SortHeader>
    ),
    cell: ({ row }) => {
      return <div className="text-white">${formatK(row.original.fdv)}</div>;
    },
  },
  {
    id: "avg_dops_per_tweet",
    accessorKey: "avg_dops_per_tweet",
    enableSorting: true,
    size: 130,
    header: () => (
      // <SortHeader column={column}>
      <DopValue className="flex items-center gap-1">
        <span>Tweet Price</span>
      </DopValue>
      // </SortHeader>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-white">
          {formatK(row.original.avg_dops_per_tweet ?? 0)}
        </div>
      );
    },
  },
  {
    id: "daily_dops_supply",
    accessorKey: "daily_dops_supply",
    enableSorting: true,
    size: 140,
    header: () => (
      // <SortHeader column={column}>
      <DopValue className="flex items-center gap-1">
        <span>Daily Dops Supply</span>
      </DopValue>
      // </SortHeader>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-white">
          {formatK(row.original.daily_dops_supply)}
        </div>
      );
    },
  },
  {
    id: "total_tweets",
    accessorKey: "total_tweets",
    enableSorting: true,
    size: 70,
    header: () => (
      // <SortHeader column={column}>
      <span>Tweets</span>
      // </SortHeader>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-white">{formatK(row.original.total_tweets)}</div>
      );
    },
  },
  {
    id: "engagement",
    accessorKey: "engagement",
    enableSorting: true,
    size: 120,
    header: () => (
      // <SortHeader column={column}>
      <div className="flex items-center gap-1">
        <span>Engagement Rate</span>
        <AppTooltip content={<p>Percentage of total supply engaged</p>}>
          <InfoIcon className="text-zinc-600" />
        </AppTooltip>
      </div>
      // </SortHeader>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-white">{`${((row.original.engagement ?? 0) * 100).toFixed(1)}%`}</div>
      );
    },
  },
  {
    id: "top_dappers",
    accessorKey: "top_dappers",
    enableSorting: true,
    size: 140,
    meta: { skipHighlight: true }, // Has avatar images, don't highlight
    header: () => (
      // <SortHeader column={column}>
      <div className="flex items-center gap-1">
        <span>Top Creators</span>
        <AppTooltip content={<p>Most active contributors</p>}>
          <InfoIcon className="text-zinc-600" />
        </AppTooltip>
      </div>
      // </SortHeader>
    ),
    cell: ({ row }) => {
      const topYappers = row.original.top_yappers ?? 0;
      const logos = row.original.top_yappers_logos ?? [];

      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {topYappers === 0 || logos.length === 0 ? (
              <FallbackOctagon
                width={24}
                height={24}
                className="w-6 h-6 mask-octagon-rotated"
              />
            ) : (
              logos.map((logo, index) => (
                <AppImage
                  key={index}
                  src={logo}
                  alt={`Yapper ${index + 1}`}
                  width={24}
                  height={24}
                  className="w-6 h-6 mask-octagon-rotated"
                  fallbackVariant="octagonRotated"
                  style={{
                    marginLeft: index > 0 ? "-12px" : "0",
                    zIndex: 10 - index,
                  }}
                />
              ))
            )}
          </div>
          {topYappers > 0 && (
            <span className="text-white text-xs">+{formatK(topYappers)}</span>
          )}
        </div>
      );
    },
  },
  {
    id: "avg_tweet_dop_score",
    accessorKey: "avg_tweet_dop_score",
    enableSorting: true,
    size: 130,
    header: () => (
      // <SortHeader column={column}>
      <div className="flex items-center gap-1">
        <span>Avg Tweet DScore</span>
        <AppTooltip content={"Average DScore per tweet"}>
          <InfoIcon className="text-zinc-600" />
        </AppTooltip>
      </div>
      // </SortHeader>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-white">
          {formatNumber(row.original.avg_tweet_dop_score ?? 0)}
        </div>
      );
    },
  },
  // {
  //   accessorKey: "filters",
  //   enableSorting: false,
  //   header: () => (
  //     <div className="flex items-center gap-1 text-zinc-500">
  //       <span>Filters</span>
  //       <AppTooltip
  //         content={
  //           <div className="flex flex-col gap-1">
  //             <p>Active filters for this program:</p>
  //             <p>• Solo mention</p>
  //             <p>• Verified users</p>
  //             <p>• Sentiment analysis</p>
  //             <p>• Media content</p>
  //             <p>• Consistency streak</p>
  //           </div>
  //         }
  //       >
  //         <InfoIcon className="text-zinc-600" />
  //       </AppTooltip>
  //     </div>
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <AppTooltip
  //         content={<p className="text-xs"><span className="text-zinc-400 ">Filters on this program:</span> <br /> New author, Consistency,<br /> Frequency, Sentiment, <br />Solo mention, Verified</p>}
  //         side="left"
  //         sideOffset={8}
  //       >
  //         <span className="inline-flex items-center gap-1">
  //           {row.original.has_solo_mention_filter && <FilterVerifiedPlusIcon className="text-[#55FF00]" />}
  //           {row.original.has_verified_filter && <FilterDashedBadgeIcon className="text-[#55FF00]" />}
  //           {row.original.has_sentiment_filter && <FilterBarsBadgeIcon className="text-[#55FF00]" />}
  //           {row.original.has_media_filter && <FilterDiamondBadgeIcon className="text-[#55FF00]" />}
  //           {row.original.has_consistency_streak_multiplier && <FilterGearsBadgeIcon className="text-[#55FF00]" />}
  //           {row.original.has_new_author_multiplier && <FilterVerifiedPlusIcon className="text-[#55FF00]" />}
  //           {row.original.has_decay_factor_multiplier && <FilterDashedBadgeIcon className="text-[#55FF00]" />}
  //         </span>
  //       </AppTooltip>
  //     );
  //   },
  // },
];
