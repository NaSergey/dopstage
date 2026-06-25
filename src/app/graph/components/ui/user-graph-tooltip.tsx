import { AppImage } from "@/shared/ui/app-image";
import type { ApiNode } from "@/app/graph/components/model/types";

interface Props {
  node: ApiNode;
}

export function UserGraphTooltip({ node }: Props) {
  return (
    <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex items-center gap-3 rounded-xl border border-zinc-700/50 bg-zinc-900/90 px-3 py-2.5 backdrop-blur-sm">
      {/* avatar */}
      <AppImage
        src={node.avatarUrl}
        alt={node.displayName}
        width={36}
        height={36}
        className="rounded-full object-cover shrink-0"
      />
      <div>
        <p className="text-sm font-semibold text-white leading-none">{node.displayName}</p>
        <p className="mt-1 text-xs text-zinc-400">{node.username}</p>
        <p className="mt-0.5 text-xs text-zinc-500">
          PageRank: <span className="text-zinc-300">{node.pageRank.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}
