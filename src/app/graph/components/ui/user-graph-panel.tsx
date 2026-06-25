import { useState } from "react";
import type { UserGraphPanelProps } from "@/app/graph/components/model/types";
import { rankIndex } from "@/app/graph/components/lib/helpers";
import { RANK_COLORS, RANK_LABELS } from "@/app/graph/components/model/constants";
import { AppImage } from "@/shared/ui/app-image";
import { YapperCheckHeader } from "@/shared/ui/yapper-check-header";
import { rqClient } from "@/shared/api/instance";
import { refetchInterval, refetchOnReconnect } from "@/shared/lib/error";
import { LONG_REFETCH_INTERVAL, STALE_TIME_BUFFER } from "@/shared/lib/constants/refetchInterval";
import { YapperCheckCompactStats } from "./yapper-check-compact-stats";
import { YapperCheckCompactStatsSkeleton } from "./yapper-check-compact-stats-skeleton";

export function UserGraphPanel({ node, allNodes, links, onClose, onSelect, onConnectionHover }: UserGraphPanelProps) {
  const [closing, setClosing] = useState(false);
  const INTERVAL = Number(process.env.NEXT_PUBLIC_SUBNET_FEED_INTERVAL) || LONG_REFETCH_INTERVAL;
  const { data: yapperData, isLoading: yapperLoading } = rqClient.useQuery(
    "get",
    "/api/v1/yapper_page/yapper/{yapper_id}/header",
    { params: { path: { yapper_id: node.id } } },
    {
      enabled: Boolean(node.id),
      keepPreviousData: true,
      refetchInterval: refetchInterval(INTERVAL),
      refetchOnReconnect: refetchOnReconnect,
      staleTime: INTERVAL - STALE_TIME_BUFFER,
      retry: false,
    },
  );
  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 200);
  }

  const connectedIds = new Set(
    links
      .filter(l => l.source === node.id || l.target === node.id)
      .map(l => (l.source === node.id ? l.target : l.source))
  );
  const connections = allNodes.filter(n => connectedIds.has(n.id)).sort((a, b) => b.pageRank - a.pageRank);
  const ri = rankIndex(node.pageRank, allNodes);

  return (
    <div
      className={`absolute right-0 inset-y-0 w-102 z-20 flex flex-col bg-zinc-900/95 border-l border-zinc-700/50 backdrop-blur-sm transition-transform duration-200 ${closing ? "translate-x-full" : "animate-in slide-in-from-right"}`}
    >
      {/* header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-zinc-800">
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Profile</span>
        <button
          onClick={handleClose}
          className="text-zinc-500 cursor-pointer hover:text-zinc-200 transition-colors text-lg leading-none"
        >
          ✕
        </button>
      </div>

      <div className="overflow-y-auto flex-1 px-4 py-4 space-y-3">
        {/* user card */}
            <YapperCheckHeader
              avatarUrl={node.avatarUrl}
              username={node.displayName}
              twitterHandle={node.username}
              yapperId={node.id}
              className="py-0 pl-0"
            />
        <div className="flex items-center gap-2">
            <span
              className="inline-block shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded"
              style={{ background: RANK_COLORS[ri] + "22", color: RANK_COLORS[ri] }}
            >
              {RANK_LABELS[ri]}
            </span>
            <span className="rounded px-1.5 py-0.5 bg-zinc-800/60 text-[10px] font-medium text-zinc-400">
              Page Rank <span className="text-white">{node.pageRank.toFixed(3)}</span>
            </span>
            <span className="rounded px-1.5 py-0.5 bg-zinc-800/60 text-[10px] font-medium text-zinc-400">
              Connections <span className="text-white">{connections.length}</span>
            </span>
          </div>

        {/* yapper stats — always render after loading so the panel never ends
            up blank; fall back to 0 if the request had no data. */}
        {yapperLoading ? (
          <YapperCheckCompactStatsSkeleton />
        ) : (
          <YapperCheckCompactStats
            totalDops={yapperData?.total_dops ?? 0}
            leaderboardPosition={yapperData?.leaderboard_position ?? 0}
            avgDopsPerTweetChart={null}
            totalTweets={yapperData?.total_tweets ?? 0}
            totalDopScore={yapperData?.dop_score ?? 0}
          />
        )}

        {/* connections */}
        {connections.length > 0 && (
          <div>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
              Connections ({connections.length})
            </p>
            <div className="space-y-1.5">
              {connections.map(c => {
                const cri = rankIndex(c.pageRank, allNodes);
                return (
                  <div key={c.id} onClick={() => onSelect(c)} onMouseEnter={() => onConnectionHover(c)} onMouseLeave={() => onConnectionHover(null)} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-zinc-800/60 transition-colors cursor-pointer">
                    <AppImage
                      src={c.avatarUrl}
                      alt={c.displayName}
                      width={32}
                      height={32}
                      className="rounded-full object-cover border shrink-0"
                      style={{ borderColor: RANK_COLORS[cri] }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white truncate">{c.displayName}</p>
                      <p className="text-[10px] text-zinc-500 truncate">{c.username}</p>
                    </div>
                    <span
                      className="ml-auto text-[9px] font-medium px-1 py-0.5 rounded shrink-0"
                      style={{ background: RANK_COLORS[cri] + "22", color: RANK_COLORS[cri] }}
                    >
                      {c.pageRank.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
