"use client";

import { useState } from "react";
import { ProgramsYappriceTable } from "@/features/programs-leaderboard-table/components/programs-leaderboard-table";
import { DopIcon, GemIcon, SparkleIcon, SubnetIcon } from "@/shared/ui/icons";
import { cn } from "@/shared/lib/utils/css";

type FilterType = "all" | "trending" | "dops" | "new";

export default function LeaderboardPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  return (
    <div className="flex flex-col ">
      <div className="flex items-center bg-zinc-900 justify-between z-10 pt-4">
        <h2 className="px-6 text-base leading-none font-medium text-zinc-500 flex items-center gap-4">
          <button
            onClick={() => setActiveFilter("all")}
            className={cn(
              "flex items-center gap-1 transition-colors cursor-pointer",
              activeFilter === "all" && "text-white"
            )}
          >
            <SubnetIcon />
            Subnet (TweetPrice)
          </button>
          <button
            onClick={() => setActiveFilter("trending")}
            className={cn(
              "flex items-center gap-1 transition-colors cursor-pointer",
              activeFilter === "trending" && "text-white"
            )}
          >
            <GemIcon />
            Trending
          </button>
          <button
            onClick={() => setActiveFilter("dops")}
            className={cn(
              "flex items-center gap-1 transition-colors cursor-pointer",
              activeFilter === "dops" && "text-white"
            )}
          >
            <DopIcon className={"text-white"} />
            DOPS
          </button>
          <button
            onClick={() => setActiveFilter("new")}
            className={cn(
              "flex items-center gap-1 transition-colors cursor-pointer",
              activeFilter === "new" && "text-white"
            )}
          >
            <SparkleIcon />
            New
          </button>
        </h2>
      </div>
      <ProgramsYappriceTable pageSize={20} />
    </div>
  );
}