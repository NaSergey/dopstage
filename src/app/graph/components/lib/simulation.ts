import * as d3 from "d3";
import type { ApiSimLink, ApiSimNode } from "../model/types";
import { nodeR } from "./helpers";

interface SimulationOptions {
  alphaDecay?: number;
  collideIterations?: number;
  skipLink?: boolean;
}

export function buildSimulation(
  simNodes: ApiSimNode[],
  simLinks: ApiSimLink[],
  W: number,
  H: number,
  options: SimulationOptions = {},
) {
  const { alphaDecay = 0.02, collideIterations = 3, skipLink = false } = options;
  const maxRadius = Math.min(W, H) * 0.38;

  return d3.forceSimulation<ApiSimNode>(simNodes)
    .alphaDecay(alphaDecay)
    .force("link", skipLink ? null :
      d3.forceLink<ApiSimNode, ApiSimLink>(simLinks)
        .id(d => d.id)
        .distance(d => {
          const s = d.source as ApiSimNode;
          const t = d.target as ApiSimNode;
          return (nodeR(s.rankNorm) + nodeR(t.rankNorm)) * 1.5;
        })
        .strength(0.04)
    )
    .force("charge",
      d3.forceManyBody<ApiSimNode>()
        .strength(d => -nodeR(d.rankNorm) * 20)
        .distanceMax(300)
    )
    .force("collide",
      d3.forceCollide<ApiSimNode>()
        .radius(d => nodeR(d.rankNorm) + 15)
        .strength(0.85)
        .iterations(collideIterations)
    )
    .force("radial",
      d3.forceRadial<ApiSimNode>(
        d => d.rankNorm * maxRadius,
        W / 2,
        H / 2,
      ).strength(2.2)
    );
}
