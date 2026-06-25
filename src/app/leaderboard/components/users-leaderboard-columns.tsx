import { AppImage } from "@/shared/ui/app-image";
import { ColumnDef } from "@tanstack/react-table";
import { formatK } from "@/shared/lib/format/formatK";
import {
  DopIcon,
  InfoIcon,
  NewIcon,
  TopBadgeIcon,
} from "@/shared/ui/icons";
import type { ApiComponents } from "@/shared/api/schema";

export type LeaderboardRow = ApiComponents["YapperPageLeaderboardItemResponse"] & {
  is_new?: boolean;
};

export const getUsersLeaderboardColumns = (page: number, pageSize: number): ColumnDef<LeaderboardRow>[] => [
  {
    accessorKey: "rank",
    size: 56,
    header: () => (
      <div className="flex items-center gap-1 text-zinc-500">
        <span>#</span>
      </div>
    ),
    cell: ({ row }) => {
      const displayRank =
        row.original.rank ??
        (page - 1) * pageSize + row.index + 1;
      return (
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center leading-none">
            <span className="text-white font-medium">{displayRank}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "display_name",
    size: 200,
    header: () => (
      <div className="flex items-center gap-1 text-zinc-500">
        <span>@</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center leading-none">
          <AppImage
            src={row.original.logo_url ?? ""}
            alt={row.original.display_name ?? ""}
            width={24}
            height={24}
            className="w-6 h-6 mask-octagon-rotated"
            fallbackVariant="octagonRotated"
          />
          {(page - 1) * pageSize + row.index + 1 === 1 ? (
            <TopBadgeIcon className="-mt-0.5 z-10" />
          ) : row.original.is_new ? (
            <NewIcon className="-mt-0.5 z-10" />
          ) : null}
        </div>
        <span className="text-white font-medium">{row.original.display_name ?? ""}</span>
      </div>
    ),
  },
  {
    accessorKey: "total_dops",
    size: 140,
    header: () => (
      <div className="flex items-center gap-1">
        <span>Total Dops</span>
        <DopIcon className="-mt-0.5" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-white">
        {formatK(row.original.total_dops ?? 0)}
      </div>
    ),
  },
  {
    accessorKey: "dop_score",
    size: 100,
    header: () => <span>DScore</span>,
    cell: ({ row }) => (
      <div className="text-white">{(row.original.dop_score ?? 0).toFixed(2)}</div>
    ),
  },
  {
    accessorKey: "tweets_count",
    size: 120,
    header: () => (
      <div className="flex items-center gap-1">
        <span>Total Tweets</span>
        <InfoIcon />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-white">{formatK(row.original.tweets_count ?? 0)}</div>
    ),
  },
  {
    accessorKey: "avg_dops_per_tweet",
    size: 140,
    header: () => (
      <div className="flex items-center gap-1">
        <span>Avg Tweet Price</span>
        <DopIcon className="-mt-0.5" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-white">
        {formatK(row.original.avg_dops_per_tweet ?? 0)}
      </div>
    ),
  },
  {
    accessorKey: "active_programs",
    size: 160,
    header: () => <span>Participating subnets</span>,
    cell: ({ row }) => {
      const urls = row.original.active_programs_logos_urls ?? [];
      return (
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {urls.slice(0, 3).map((src, index) => (
              <AppImage
                src={src}
                alt=""
                width={24}
                height={24}
                className="w-6 h-6 mask-octagon"
                key={index}
                fallbackVariant="octagon"
                style={{
                  marginLeft: index > 0 ? "-8px" : "0",
                  zIndex: 10 - index,
                }}
              />
            ))}
          </div>
          <span className="text-white text-xs pl-2">
            +{row.original.active_programs ?? 0}
          </span>
        </div>
      );
    },
  },
];