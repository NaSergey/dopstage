import { ArrowLinkIcon, DopIcon, InfoIcon } from "@/shared/ui/icons";
import { formatK } from "@/shared/lib/format/formatK";
import { Button } from "@/shared/ui/button";
import AppTooltip from "@/shared/ui/app-tooltip";
import ReceptorLine from "./receptor-line";
import MultiUsersImages from "@/entities/multi-users-images";
import { useRouter } from "next/navigation";
import { ReceptorInfoResponse } from "./chart/model/types";


interface ReceptorInfoProps {
  data: ReceptorInfoResponse;
}

function ReceptorInfo({ data }: ReceptorInfoProps) {
  const {
    dop_price,
    top_yappers_count,
    top_yappers_logos_url,
    tweets_per_day,
    daily_tdd,
    avg_daily_tweets,
    avg_dops_per_user,
    avg_tweet_dop_score_chart,
    daily_dop_score,
    program_id,
  } = data;

  const router = useRouter();

  const handleGoToReceptor = () => {
    router.push(`/subnet/${program_id}`);
  };

  return (
    <div className="grid grid-cols-6 gap-[1px] h-full">
      {/* Key Metrics */}
      <div className="col-span-4 flex justify-between items-center bg-zinc-900 py-1.5 px-2 [@media(min-width:1500px)]:px-5">
        <h4 className="text-sm leading-normal text-white/30">DPrice</h4>
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-medium text-white">
            {formatK(dop_price, 0)}
          </span>
          <DopIcon className="size-6" />
        </div>
      </div>
      <div className="col-span-2 bg-zinc-900 px-2 [@media(min-width:1500px)]:px-5 flex items-center justify-center">
        <Button className="w-full text-sm [@media(max-width:1500px)]:text-xs" frameHeight={34} onClick={handleGoToReceptor}>
          Go to subnet <ArrowLinkIcon className="ml-2" />
        </Button>
      </div>

      <div className="col-span-2 bg-white/20 py-1 px-2 [@media(min-width:1500px)]:px-5 text-right">
        <h4 className="text-sm leading-tight text-white/30">
          Top Creators
        </h4>
        <div className="flex items-center gap-1.5 justify-end text-lg font-medium text-white">
          <MultiUsersImages logos={top_yappers_logos_url.slice(0, 3)} />+
          {top_yappers_count}
        </div>
      </div>
      <div className="col-span-2 bg-white/20 py-1 px-2 [@media(min-width:1500px)]:px-5 text-right">
        <h4 className="text-sm leading-tight text-white/30">
          Tweets per day
        </h4>
        <div className="text-lg font-medium text-white">
          {formatK(tweets_per_day, 0)}
        </div>
      </div>
      <div className="col-span-2 bg-white/20 py-1.5 px-2 [@media(min-width:1500px)]:px-5 text-right">
        <h4 className="flex text-sm items-center justify-end gap-1.5 leading-tight text-white/30">
          Daily Dops Supply
          <AppTooltip content={"Tip"}>
            <InfoIcon className="size-4" />
          </AppTooltip>
        </h4>
        <div className="text-lg font-medium text-white">
          {formatK(daily_tdd, 0)}
        </div>
      </div>

      {/* Lines */}

      <div className="col-span-3 py-[7px] px-2 [@media(min-width:1500px)]:px-5 bg-zinc-900">
        <ReceptorLine
          title="Tweet DScore"
          value={avg_tweet_dop_score_chart[avg_tweet_dop_score_chart.length - 1] ?? 0}
          data={avg_tweet_dop_score_chart}
        />
      </div>
      <div className="col-span-3 py-[7px] px-2 [@media(min-width:1500px)]:px-5 bg-zinc-900">
        <ReceptorLine
          title="Daily DScore"
          value={daily_dop_score[daily_dop_score.length - 1] ?? 0}
          data={daily_dop_score}
        />
      </div>
      <div className="col-span-3 py-[7px] px-2 [@media(min-width:1500px)]:px-5 bg-zinc-900">
        <ReceptorLine
          title="Dops per User"
          value={avg_dops_per_user[avg_dops_per_user.length - 1] ?? 0}
          isDop
          data={avg_dops_per_user}
        />
      </div>
      <div className="col-span-3 py-[7px] px-2 [@media(min-width:1500px)]:px-5 bg-zinc-900">
        <ReceptorLine
          title="Daily Tweets"
          value={avg_daily_tweets[avg_daily_tweets.length - 1] ?? 0}
          data={avg_daily_tweets}
        />
      </div>
    </div>
  );
}

export default ReceptorInfo;
