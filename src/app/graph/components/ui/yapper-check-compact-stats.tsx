import { DopIcon, InfoIcon } from "@/shared/ui/icons";
import { formatNumber } from "@/shared/lib/format/formatNumber";
import { formatK } from "@/shared/lib/format/formatK";
import AppTooltip from "@/shared/ui/app-tooltip";

interface YapperCheckCompactStatsProps {
  totalDops: number;
  leaderboardPosition: number;
  avgDopsPerTweetChart: number[] | null | undefined;
  totalTweets: number;
  totalDopScore: number | null | undefined;
}

export function YapperCheckCompactStats({
  totalDops,
  leaderboardPosition,
  avgDopsPerTweetChart,
  totalTweets,
  totalDopScore,
}: YapperCheckCompactStatsProps) {
  const lastTweetPrice = avgDopsPerTweetChart?.[(avgDopsPerTweetChart?.length ?? 0) - 1] ?? 0;

  return (
    <div className="grid grid-cols-3 [@media(max-height:800px)]:pl-2">
      {/* Row 1 */}
      <div className="bg-zinc-800 py-2 pl-2">
        <h4 className="text-xs line-height-xs text-zinc-500 mb-0.5">Dops</h4>
        <div className="flex gap-1 items-center text-sm line-height-sm">
          {formatK(totalDops)} <DopIcon />
        </div>
      </div>
      <div className="bg-zinc-800 py-2">
        <h4 className="text-xs line-height-xs text-zinc-500 mb-0.5">Tweet Price</h4>
        <div className="flex gap-1 items-center text-sm line-height-sm">
          {formatK(lastTweetPrice)}
          <DopIcon className="size-3.5 shrink-0" />
        </div>
      </div>
      <div className="bg-zinc-800 py-2">
        <h4 className="text-xs line-height-xs text-zinc-500 mb-0.5">Leaderboard</h4>
        <p className="text-sm line-height-sm">#{formatNumber(leaderboardPosition)}</p>
      </div>

      {/* Row 2 */}
      <div className="mt-4.5 py-2 pl-2">
        <h4 className="text-xs line-height-xs text-zinc-500 mb-0.5">Total Tweets</h4>
        <div className="flex gap-1 items-center text-sm line-height-sm">
          {formatK(totalTweets)}
        </div>
      </div>
      <div className="mt-4.5 py-2">
        <h4 className="text-xs line-height-xs text-zinc-500 mb-0.5 flex items-center gap-1">
          <span>DScore</span>
          <AppTooltip content={<p>DScore</p>}>
            <InfoIcon className="text-zinc-600 w-3.5 h-4" />
          </AppTooltip>
        </h4>
        <p className="text-sm line-height-sm">{formatK(totalDopScore ?? 0)}</p>
      </div>
      <div className="mt-4.5 py-2">
        <h4 className="text-xs line-height-xs text-zinc-500 mb-0.5">Tweets Frequency</h4>
        <p className="text-sm line-height-sm">{formatK(totalTweets)} p/week</p>
      </div>
    </div>
  );
}
