"use client";

import { useMemo, useState } from "react";
import type { ApiLink, ApiNode } from "./model/types";
import { useUserGraph } from "./lib/use-user-graph";
import { UserGraphTooltip } from "./ui/user-graph-tooltip";
import { UserGraphPanel } from "./ui/user-graph-panel";
import { ViewToggle } from "@/shared/ui/view-toggle";

type NetworkView = "city" | "bittensor";
const NETWORK_VIEW_OPTIONS = [
  { value: "bittensor" as const, label: "Bittensor Network" },
];

interface Props {
  nodes: ApiNode[];
  links: ApiLink[];
}

export default function UserGraph({ nodes, links }: Props) {
  const data = useMemo(() => ({ nodes, links }), [nodes, links]);
  const { canvasRef, containerRef, hovered, selected, setSelected, setPanelHovered, loading } = useUserGraph(data);
  const [networkView, setNetworkView] = useState<NetworkView>("bittensor");

  return (
    <div className="relative w-full h-full bg-[#09090B] overflow-hidden">
      {/* header bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center px-4 py-2 z-10">
        <ViewToggle options={NETWORK_VIEW_OPTIONS} value={networkView} onChange={setNetworkView} />
      </div>

      {/* canvas area */}
      <div ref={containerRef} className="absolute inset-0">
        {/* ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-violet-600/[0.07] blur-[160px]" />
        </div>

        {!selected && hovered && <UserGraphTooltip node={hovered} />}

        <canvas ref={canvasRef} className="w-full h-full" />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#09090B]">
            <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          </div>
        )}
      </div>

      {selected && (
        <UserGraphPanel
          node={selected}
          allNodes={nodes}
          links={links}
          onClose={() => setSelected(null)}
          onSelect={setSelected}
          onConnectionHover={setPanelHovered}
        />
      )}
    </div>
  );
}
