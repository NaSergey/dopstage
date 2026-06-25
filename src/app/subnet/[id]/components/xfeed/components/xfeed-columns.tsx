import { ColumnDef } from "@tanstack/react-table";
import UserProfile from "@/entities/user-profile";
import { TimeAgoLive } from "@/shared/ui/time-ago-live";
import { formatK } from "@/shared/lib/format/formatK";
import AppTooltip from "@/shared/ui/app-tooltip";
import {
  InfoIcon,
  SuccessIcon,
  UnsuccessIcon,
  DopIcon,
  AddYapperIcon,
  ShrimpIcon,
  PlanktonIcon,
  SharkIcon,
  DolphinIcon,
  WhaleIcon,
} from "@/shared/ui/icons";
import { cn } from "@/shared/lib/utils/css";
import type { ApiComponents } from "@/shared/api/schema";
import toPercent from "@/shared/lib/format/toPercent";
import HighlightMatches from "@/shared/ui/highlight-matches";
import SortHeader from "@/shared/ui/sort-header";
import TitleTooltip from "@/shared/ui/title-tooltip";

type TRow = ApiComponents["ProgramXFeedItemResponse"];

// null means the filter is disabled — treat as not applicable (don't display)
// only boolean true/false values are shown in the tooltip
const isFilterEnabled = (v: boolean | null | undefined): v is boolean =>
  v === true || v === false;

const iconByRating: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  plankton: PlanktonIcon,
  shrimp: ShrimpIcon,
  fish: SharkIcon,
  dolphin: DolphinIcon,
  whale: WhaleIcon,
};

export const getFeedColumns = ({
  activeYapper,
  handleYapperClick,
  search,
}: {
  activeYapper?: string;
  handleYapperClick: (handle: string) => void;
  search?: string;
}): ColumnDef<TRow>[] => [
    {
      id: "tweet_timestamp",
      accessorKey: "tweet_timestamp",
      enableSorting: true,
      size: 62,
      header: ({ column }) => (
        <SortHeader column={column} firstStep="desc">Date</SortHeader>
      ),
      cell: ({ row }) => (
        <TimeAgoLive
          timestamp={row.original.tweet_timestamp}
          className="text-zinc-500 group-hover:text-white transition-colors w-full truncate"
        />
      ),
    },
    {
      id: "username",
      accessorKey: "username",
      enableSorting: false,
      size: 180,
      header: () => <div>@</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-between gap-2 w-full min-w-0">
          <div className="min-w-0 flex-1 truncate" title={row.original.username}>
            <UserProfile
              avatarUrl={row.original.avatar_url}
              username={
                <HighlightMatches text={row.original.username} query={search} />
              }
              usernameClassName="w-full"
              userNameTitle={row.original.username}
            />
          </div>
          <button
            className="shrink-0 cursor-pointer size-4"
            title={`@${row.original.twitter_handle}`}
            onClick={(e) => {
              e.stopPropagation();
              handleYapperClick(row.original.twitter_handle);
            }}
          >
            <AddYapperIcon className="size-4" active={activeYapper === row.original.twitter_handle} />
          </button>
        </div>
      ),
    },
    {
      accessorKey: "is_ai",
      size: 40,
      enableSorting: false,
      header: () => (
        <div className="flex items-center gap-1">
          AI
          <AppTooltip content="AI filter failed">
            <InfoIcon className="text-zinc-600" />
          </AppTooltip>
        </div>
      ),
      cell: ({ row }) => {
        const filters = [
          { label: "Sentiment", value: row.original.passed_sentiment_filter },
          { label: "Shitpost",  value: row.original.passed_shitpost_filter },
          { label: "Solo mention", value: row.original.passed_solo_mention_filter },
          { label: "Verified",  value: row.original.passed_verified_filter },
          { label: "Media",     value: row.original.passed_media_filter },
        ] as const;

        // null = filter disabled, ignore; false = failed
        const ok = filters.every(({ value }) => value !== false);

        return (
          <AppTooltip
            dark
            content={
              <div className="flex flex-col gap-1">
                {filters.map(({ label, value }) =>
                  isFilterEnabled(value) ? (
                    <p key={label} className={cn(value ? "text-lime-500" : "text-red-500")}>
                      {label}
                    </p>
                  ) : null
                )}
              </div>
            }
          >
            {ok ? <SuccessIcon /> : <UnsuccessIcon />}
          </AppTooltip>
        );
      },
    },
    {
      id: "rating",
      accessorKey: "rating",
      size: 64,
      enableSorting: false,
      header: () => (
        <div className="flex items-center gap-1">
          <span>Rating</span>
          <AppTooltip content="Something">
            <InfoIcon className="text-zinc-600" />
          </AppTooltip>
        </div>
      ),
      cell: ({ row }) => {
        const Icon = iconByRating[row.original.rating];
        return (
          <div className="w-full flex items-center justify-center">
            {Icon && <Icon className="w-4 h-4" />}
          </div>
        );
      },
    },
    {
      id: "dop_score",
      accessorKey: "dop_score",
      size: 66,
      enableSorting: false,
      header: () => <div>DScore</div>,
      cell: ({ row }) => (
        <div className="w-full truncate">
          {formatK(row.original.dop_score ?? 0)}
        </div>
      ),
    },
    {
      id: "estimated_reward_in_dops",
      accessorKey: "estimated_reward_in_dops",
      size: 54,
      enableSorting: false,
      header: () => (
        <div className="flex items-center gap-1">
          <DopIcon />
        </div>
      ),
      cell: ({ row }) => (
        <div>{formatK(row.original.estimated_reward_in_dops, 1)}</div>
      ),
    },
    {
      id: "mindshare",
      accessorKey: "mindshare",
      enableSorting: true,
      size: 105,
      header: ({ column }) => (
        <SortHeader column={column} firstStep="desc">
          <div className="flex items-center gap-1">
            <span>Mindshare</span>
            <AppTooltip content="Something">
              <InfoIcon className="text-zinc-600" />
            </AppTooltip>
          </div>
        </SortHeader>
      ),
      cell: ({ row }) => <div>{toPercent(row.original.mindshare)}</div>,
    },
    {
      accessorKey: "yap_text",
      header: "Text",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="-my-2 min-w-0 overflow-hidden">
          <TitleTooltip text={row.original.yap_text}>
            <div className="text-zinc-400 group-hover:text-white transition-colors min-w-0 max-w-full truncate py-2">
              <HighlightMatches text={row.original.yap_text} query={search} />
            </div>
          </TitleTooltip>
        </div>
      ),
    },
  ];
