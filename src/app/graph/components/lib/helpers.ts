import type * as d3 from "d3";
import { RANK_COLORS, MIN_NODE_R, MAX_NODE_R } from "@/app/graph/components/model/constants";
import type { ApiSimNode, ApiSimLink, ApiNode } from "@/app/graph/components/model/types";

export function nodeR(rankNorm: number): number {
  return MIN_NODE_R + (MAX_NODE_R - MIN_NODE_R) * Math.pow(1 - rankNorm, 2);
}

export function buildColorMap(simNodes: ApiSimNode[]): Map<string, string> {
  const colorMap = new Map<string, string>();
  const sortedRanks = [...simNodes.map(n => n.pageRank ?? 0)].sort((a, b) => b - a);
  const maxLen = Math.max(sortedRanks.length - 1, 1);

  const rankIndexMap = new Map<number, number>();
  sortedRanks.forEach((rank, i) => { if (!rankIndexMap.has(rank)) rankIndexMap.set(rank, i); });

  simNodes.forEach(node => {
    const pageRank = node.pageRank ?? 0;
    const percentile = (rankIndexMap.get(pageRank) ?? 0) / maxLen;

    let color: string;
    if (percentile < 0.1) color = RANK_COLORS[0];
    else if (percentile < 0.25) color = RANK_COLORS[1];
    else if (percentile < 0.4) color = RANK_COLORS[2];
    else if (percentile < 0.6) color = RANK_COLORS[3];
    else color = RANK_COLORS[4];

    colorMap.set(node.id, color);
  });

  return colorMap;
}

export function buildAdjacency(simLinks: ApiSimLink[]): Map<string, Set<string>> {
  const adj = new Map<string, Set<string>>();
  simLinks.forEach(l => {
    const s = (l.source as ApiSimNode).id;
    const t = (l.target as ApiSimNode).id;
    if (!adj.has(s)) adj.set(s, new Set());
    if (!adj.has(t)) adj.set(t, new Set());
    adj.get(s)!.add(t);
    adj.get(t)!.add(s);
  });
  return adj;
}

export function rankIndex(pageRank: number, allNodes: ApiNode[]): number {
  const sorted = [...allNodes.map(n => n.pageRank)].sort((a, b) => b - a);
  const max = Math.max(sorted.length - 1, 1);
  const pos = sorted.indexOf(pageRank) / max;
  if (pos < 0.1) return 0;
  if (pos < 0.25) return 1;
  if (pos < 0.4) return 2;
  if (pos < 0.6) return 3;
  return 4;
}

export function nodeAt(
  nodes: ApiSimNode[],
  mx: number,
  my: number,
  t: d3.ZoomTransform,
): ApiSimNode | null {
  const [wx, wy] = t.invert([mx, my]);
  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i];
    const r = nodeR(n.rankNorm) + 3;
    const dx = (n.x ?? 0) - wx;
    const dy = (n.y ?? 0) - wy;
    if (dx * dx + dy * dy <= r * r) return n;
  }
  return null;
}
