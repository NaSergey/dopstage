"use client";

import { formatNumber } from "@/shared/lib/format/formatNumber";
import { cn } from "@/shared/lib/utils/css";
import Wrapper from "@/shared/ui/wrapper";
import { JellyfishDot } from "@/widgets/footer/components/jellyfish-dot";
import { useState } from "react";




function Footer({ className }: { className?: string }) {
  const [connectionInfo] = useState({
    isLive: true,
    lastBlock: "123456",
  });

  return (
    <footer className={cn("border-t border-zinc-950 py-1 overflow-hidden", className)}>
      <Wrapper>
        <div className="flex items-center gap-3">
          {connectionInfo.isLive ? (
            <div className="flex items-center text-lime-500 text-sm leading-none">
              <JellyfishDot isLive />
              live data
            </div>
          ) : (
            <div className="flex items-center text-red-500 text-sm leading-none">
              <JellyfishDot isLive={false} /> offline data
            </div>
          )}
          <span className="text-xs text-zinc-400">
            {formatNumber(connectionInfo.lastBlock)}
          </span>
        </div>
      </Wrapper>
    </footer>
  );
}


export default Footer;
