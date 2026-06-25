import { DopIcon, InfoIcon } from "@/shared/ui/icons";
import { formatNumber } from "@/shared/lib/format/formatNumber";
import { formatK } from "@/shared/lib/format/formatK";
import Sparkline from "@/shared/ui/sparkline/sparkline";
import toPercent from "@/shared/lib/format/toPercent";
import AppTooltip from "@/shared/ui/app-tooltip";

interface YapperCheckStatsProps {
  totalDops: number;
  leaderboardPosition: number;
  avgDopsPerTweetChart: number[] | null | undefined;
  totalTweets: number;
  poolShare: number;
  totalDopScore: number | null | undefined;
}

export function YapperCheckStats({
  totalDops,
  leaderboardPosition,
  avgDopsPerTweetChart,
  totalTweets,
  poolShare,
  totalDopScore,
}: YapperCheckStatsProps) {
  const lastTweetPrice = avgDopsPerTweetChart?.[(avgDopsPerTweetChart?.length ?? 0) - 1] ?? 0;

  return (
    <>
      <div className="grid grid-cols-3 items-center py-2 bg-zinc-800 relative">
        <div className="[@media(max-height:800px)]:pl-2 pl-3">
          <h4 className="text-xs line-height-xs text-zinc-500 mb-0.5">Dops</h4>
          <div className="flex gap-1 items-center text-sm line-height-sm">
            {formatK(totalDops)} <DopIcon />
          </div>
        </div>

        <div className="col-start-2 justify-self-center">
          <h4 className="text-xs line-height-xs text-zinc-500 mb-0.5">Leaderboard</h4>
          <p className="text-sm line-height-sm">#{formatNumber(leaderboardPosition)}</p>
        </div>
      </div>

      <div className="mt-4.5 [@media(max-height:800px)]:pl-2 pl-3 pr-3 py-2 grid grid-cols-[1fr_100px_100px] gap-x-1.5 gap-y-3">
        <div className="flex flex-col max-w-[124px]">
          <div className="flex flex-col gap-2">
            <div>
              <h4 className="text-xs line-height-xs text-zinc-500 mb-0.5">Tweet Price</h4>
              <div className="flex gap-1 items-center text-sm line-height-sm">
                {formatK(lastTweetPrice)}
                <DopIcon className="size-3.5 shrink-0" />
              </div>
            </div>
            <div className="w-full h-[37px] overflow-hidden flex items-center justify-center">
              <Sparkline
                data={avgDopsPerTweetChart || []}
                className="w-full h-auto [@media(max-height:720px)]:max-h-[32px] [@media(max-height:640px)]:max-h-[10px]"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h4 className="text-xs line-height-xs text-zinc-500 mb-0.5">Total Tweets</h4>
            <div className="flex gap-1 items-center text-sm line-height-sm">
              {formatK(totalTweets)}
            </div>
          </div>
          <div>
            <h4 className="text-xs line-height-xs text-zinc-500 mb-0.5">Pool Share</h4>
            <div className="flex gap-1 items-center text-sm line-height-sm">
              {toPercent(poolShare)}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h4 className="text-xs line-height-xs text-zinc-500 mb-0.5 flex items-center gap-1">
              <span>DScore</span>
              <AppTooltip content={<p>DScore</p>}>
                <InfoIcon className="text-zinc-600 w-3.5 h-4" />
              </AppTooltip>
            </h4>
            <p className="text-sm line-height-sm">{formatK(totalDopScore ?? 0)}</p>
          </div>
          <div>
            <h4 className="text-xs line-height-xs text-zinc-500 mb-0.5">Tweets Frequency</h4>
            <p className="text-sm line-height-sm">{formatK(totalTweets)} p/week</p>
          </div>
        </div>
      </div>
    </>
  );
}
