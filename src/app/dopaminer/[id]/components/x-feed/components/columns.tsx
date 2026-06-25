import { ColumnDef } from "@tanstack/react-table";
import getTimeAgo from "@/shared/lib/format/getTimeAgo";
import { formatK } from "@/shared/lib/format/formatK";
import type { ApiComponents } from "@/shared/api/schema";
import toPercent from "@/shared/lib/format/toPercent";
import mockIcon from "@/shared/assets/mock-icon.svg";
import HighlightMatches from "@/shared/ui/highlight-matches";
import { AppImage } from "@/shared/ui/app-image";
import { DopIcon } from "@/shared/ui/icons";
import TitleTooltip from "@/shared/ui/title-tooltip";

type TRow = ApiComponents["YapperPageXFeedResponse"];

export const getYapperXFeedColumns = ({
  search,
}: {
  search?: string;
}): ColumnDef<TRow>[] => [
    {
      id: "timestamp",
      accessorKey: "timestamp",
      enableSorting: true,
      size: 36,
      header: () => <div className="flex items-center gap-1">Date</div>,
      cell: ({ row }) => (
        <div className="text-zinc-500 group-hover:text-white transition-colors w-full truncate">
          {getTimeAgo(row.original.timestamp ?? 0)}
        </div>
      ),
    },
    {
      accessorKey: "reward",
      enableSorting: true,
      size: 52,
      header: () => (
        <div className="flex items-center gap-1">
          <span>Dops</span>
          <DopIcon className="size-4" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-white">
          {formatK(row.original.estimated_reward_in_dops || 0)}
        </div>
      ),
    },
    {
      id: "receptor",
      accessorKey: "program_name",
      enableSorting: false,
      size: 72,
      header: () => <div className="flex items-center gap-1">Subnet</div>,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 min-w-0">
          <AppImage
            src={row.original.program_logo_url || mockIcon}
            alt={row.original.program_name || ""}
            width={24}
            height={24}
            className="w-6 h-6 min-w-6 min-h-6 shrink-0 mask-octagon"
            fallbackVariant="octagon"
          />
          <span className="text-white text-xs truncate">
            {row.original.program_name}
          </span>
        </div>
      ),
    },
    {
      id: "engagement",
      accessorKey: "engagement",
      size: 64,
      enableSorting: true,
      header: () => <div className="flex items-center gap-1">Engagement Rate</div>,
      cell: ({ row }) => (
        <div>
          {row.original.engagement === null ? (
            <span className="text-s text-zinc-800 group-hover:text-zinc-500 transition-colors">
              Collecting
            </span>
          ) : (
            toPercent(row.original.engagement ?? 0)
          )}
        </div>
      ),
    },
    {
      id: "reach",
      accessorKey: "reach",
      enableSorting: true,
      size: 52,
      header: () => <div className="flex items-center gap-1">Max Rating</div>,
      cell: ({ row }) => (
        <div>
          {row.original.reach === null ? (
            <span className="text-s text-zinc-800 group-hover:text-zinc-500 transition-colors">
              Collecting
            </span>
          ) : (
            formatK(row.original.reach ?? 0)
          )}
        </div>
      ),
    },
    {
      accessorKey: "text",
      header: "Text",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="-my-2 min-w-0 overflow-hidden">
          <TitleTooltip text={row.original.text}>
            <div className="text-zinc-400 py-2 group-hover:text-white transition-colors min-w-0 max-w-full truncate">
              <HighlightMatches text={row.original.text} query={search} />
            </div>
          </TitleTooltip>
        </div>
      ),
    },
  ];
