"use client";

import Leaderboard from "./components/leaderboard/leaderboard";
import YapperCheck from "./components/yapper-check/yapper-check";
import Chart from "./components/chart/chart";
import XFeed from "./components/xfeed/xfeed";
import DailyStats from "./components/daily-stats";
import Header from "./components/header/header";
import { ShevronIcon as ChevronIcon } from "@/shared/ui/icons";
import { useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/shared/lib/utils/css";
import TopTweets from "@/app/subnet/[id]/components/top-tweets/top-tweets";

function ProgramPage() {
  const { id } = useParams<{ id: string }>();
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);

  return (
    <div className="w-full h-full grid grid-rows-[min-content_1fr] ">
      <Header programId={id} />

      <div className="flex grow w-full mx-auto min-h-0 overflow-hidden h-full">
        <div
          className={cn(
            "shrink-0 overflow-hidden transition-[flex-basis,opacity] duration-300  ease-in-out will-change-[flex-basis]",
            showLeft
              ? "opacity-100 basis-[320px] 2xl:basis-[390px]"
              : "opacity-0 basis-[1px]",
          )}
        >
          <div className="grid h-full min-h-0 [@media(max-height:720px)]:grid-rows-[1fr_200px] grid-rows-2">
            <div className="overflow-hidden min-h-0">
              <Leaderboard />
            </div>
            <div className="overflow-hidden min-h-0">
              <YapperCheck programId={id} />
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 min-w-0 grid [@media(max-height:720px)]:grid-rows-[1fr_200px] grid-rows-2 overflow-hidden h-full">
          <div className="relative min-w-0">
            <div className="absolute top-1/2 -translate-y-1/2 w-full h-full flex items-center justify-between z-10 pointer-events-none">
              <button
                onClick={() => setShowLeft((v) => !v)}
                className="pointer-events-auto cursor-pointer w-6 h-6 flex items-center justify-center bg-[#111114] group"
                aria-label="toggle left"
              >
                <ChevronIcon
                  variants={showLeft ? "left" : "right"}
                  className="text-zinc-600 h-2.5 w-4 group-hover:text-white transition-colors"
                />
              </button>

              <button
                onClick={() => setShowRight((v) => !v)}
                className="pointer-events-auto cursor-pointer w-6 h-6 flex items-center justify-center bg-[#111114] group"
                aria-label="toggle right"
              >
                <ChevronIcon
                  variants={showRight ? "right" : "left"}
                  className="text-zinc-600 h-2.5 w-4 group-hover:text-white transition-colors"
                />
              </button>
            </div>

            <div className="min-h-0 min-w-0 h-full">
              <Chart programId={id} />
            </div>
          </div>
          <div className="min-h-0 min-w-0 overflow-hidden h-full">
            <XFeed />
          </div>
        </div>

        <div
          className={cn(
            "shrink-0 overflow-hidden transition-[flex-basis,opacity] duration-300 ease-in-out will-change-[flex-basis]",
            showRight
              ? "opacity-100 basis-[320px] 2xl:basis-[390px]"
              : "opacity-0 basis-[1px]",
          )}
        >
          <div className="grid h-full grid-rows-2 [@media(max-height:720px)]:grid-rows-[1fr_200px]">
            {/* <Swap /> */}
            <TopTweets />
            <DailyStats programId={id} className="shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgramPage;
