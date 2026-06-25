import * as d3 from "d3";
import type { ApiNode } from "../model/types";
import { MIN_NODE_R, MAX_NODE_R } from "../model/constants";

interface WorkerInput {
  nodes: ApiNode[];
  links: unknown[];
  W: number;
  H: number;
}

interface WorkerOutput {
  positions: Array<{ id: string; x: number; y: number }>;
}
function nodeR(rankNorm = 0.8): number {
  return MIN_NODE_R + (MAX_NODE_R - MIN_NODE_R) * Math.pow(1 - rankNorm, 2);
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // ≈ 137.5°
const PADDING = 10;

type SimNode = ApiNode & d3.SimulationNodeDatum & { targetR: number; rankNorm: number };

self.onmessage = (e: MessageEvent<WorkerInput>) => {
  const { nodes, W, H } = e.data;

  const maxRadius = Math.min(W, H) * 3.5;

  // Sort top → weakest, assign rankNorm
  const sorted = [...nodes].sort((a, b) => (b.pageRank ?? 0) - (a.pageRank ?? 0));
  const total = sorted.length;
  const rankNorms = sorted.map((_, i) => i / Math.max(total - 1, 1));

  // Cumulative area → target radius per node (accounts for size via rankNorm)
  let cumulativeArea = 0;
  const rawRadii = sorted.map((_n, i) => {
    const r = nodeR(rankNorms[i]) + PADDING;
    cumulativeArea += Math.PI * r * r;
    return Math.sqrt(cumulativeArea / Math.PI);
  });

  const scale = maxRadius / (rawRadii[rawRadii.length - 1] || 1);

  // Build sim nodes with initial golden-angle positions
  const simNodes: SimNode[] = sorted.map((n, i) => {
    const targetR = rawRadii[i] * scale;
    const angle = i * GOLDEN_ANGLE;
    return {
      ...n,
      rankNorm: rankNorms[i],
      targetR,
      x: W / 2 + targetR * Math.cos(angle),
      y: H / 2 + targetR * Math.sin(angle),
    };
  });

  // Resolve overlaps: forceRadial keeps rank order, forceCollide pushes nodes apart
  const sim = d3.forceSimulation<SimNode>(simNodes)
    .alphaDecay(0.05)
    .force("radial",
      d3.forceRadial<SimNode>(d => d.targetR, W / 2, H / 2).strength(2.5)
    )
    .force("collide",
      d3.forceCollide<SimNode>()
        .radius(d => nodeR(d.rankNorm) + PADDING)
        .strength(0.9)
        .iterations(4)
    );

  while (sim.alpha() > sim.alphaMin()) sim.tick();
  sim.stop();

  const positions: WorkerOutput["positions"] = simNodes.map(n => ({
    id: n.id,
    x: n.x ?? 0,
    y: n.y ?? 0,
  }));

  self.postMessage({ positions } satisfies WorkerOutput);
};
