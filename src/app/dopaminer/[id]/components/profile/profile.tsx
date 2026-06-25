"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/shared/lib/utils/css";
import Contribution from "./components/contribution/contribution";
import Header from "./components/header";
import Achievements from "./components/achievements/achievements";
import Charts from "./components/charts/charts";
import SpiderChart from "./components/spider-chart/spider-chart";
import XFeed from "../x-feed/x-feed";

function Profile() {
  const { id } = useParams<{ id: string }>();
  const [showBlocks, setShowBlocks] = useState(true);

  return (
    <div className="h-full flex flex-col text-white bg-zinc-900">
      <div className="shrink-0 border-b border-black">
        <Header id={id} />
      </div>

      <div
        className={cn(
          "shrink-0 overflow-hidden transition-[flex-basis,opacity] duration-500 ease-in-out will-change-[flex-basis,opacity]",
          showBlocks
            ? "opacity-100 basis-[calc(100%-35%)]"
            : "opacity-0 basis-0"
        )}
      >
        <div className="h-full grid [@media(max-width:1670px)]:grid-cols-3 grid-cols-3 grid-rows-[0.8fr_0.8fr_0.8fr_0.8fr]">
          <div className="col-span-1 row-span-2 row-start-1 pt-3 px-4 pb-4 border-b border-black border-r [@media(max-height:800px)]:p-2.5">
            <Achievements id={id} />
          </div>

          <div className="col-span-1 row-span-2 row-start-1 pt-3 px-4 pb-4 border-b border-black border-r [@media(max-height:800px)]:p-2.5 [@media(max-height:800px)]:pb-3">
            <Contribution id={id} />
          </div>

          <div className="col-span-1 row-span-2 row-start-1 px-4 border-b border-black [@media(max-width:1670px)]:border-r-0">
            <SpiderChart id={id} />
          </div>

          <div className="col-span-3 row-span-2 row-start-3 overflow-hidden min-h-0">
            <Charts id={id} />
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <XFeed onToggleBlocks={() => setShowBlocks((v: boolean) => !v)} showBlocks={showBlocks} />
      </div>
    </div>
  );
}

export default Profile;
