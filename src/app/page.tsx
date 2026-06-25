"use client";

import { SubnetIcon } from "@/shared/ui/icons";
import Header from "@/widgets/header/header";
import FooterPanel from "@/widgets/footer/footer-panel";
import { RunningLineClient } from "@/widgets/running-line/components/running-line-client";
import { ProgramsPanelClient } from "./(main)/ui/programs-panel/ui/programs-panel-client";
import { TopTweetsPanelClient } from "./(main)/ui/top-tweets-panel/ui/top-tweets-panel-client";
import ReceptorsClient from "./(main)/ui/receptors/receptors-client";
import { ProgramsYappriceTable } from "@/features/programs-leaderboard-table/components/programs-leaderboard-table";
// import GraphСonnections from "@/app/graph/ui/graph-connections/graph-connections";

export default function MainPage() {
  return (
    <div className="flex flex-col w-full min-w-[1280px] max-w-[2048px] mx-auto">
      <Header />

      <div className="[@media(max-height:800px)]:h-7 h-8">
        <RunningLineClient />
      </div>

      <div className="w-full h-[200px] min-h-[200px]">
        <ProgramsPanelClient />
      </div>

      <ReceptorsClient />

      <div className="bg-zinc-950 w-full pt-3">
        <p className="pl-4 text-base font-medium mb-3">Top Tweets</p>
        <TopTweetsPanelClient />
      </div>

      <div className="bg-zinc-900 pt-4">
        <h2 className="px-6 text-base pb-1 leading-none font-medium text-white flex items-center gap-2">
          <SubnetIcon />
          Subnets
        </h2>
        <ProgramsYappriceTable showSeeAllButton={true} />
      </div>

      <FooterPanel />
    </div>
  );
}
