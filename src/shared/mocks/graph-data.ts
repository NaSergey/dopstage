import type { ApiNode, ApiLink } from "@/app/graph/components/model/types";
import { tweetAvatar } from "./subnet-page-data";

/**
 * Fixture for the social graph page (GET /api/v1/common/graph_data).
 * A deterministic network of fictional dopaminers with preferential-attachment
 * links, so the force layout renders a few dense hubs like a real social graph.
 */

const FIRST = [
  "Crypto", "Tao", "Alpha", "Degen", "Onchain", "Mindshare", "Subnet", "Yap",
  "Cypher", "Neuron", "Validator", "Tensor", "Emission", "Stake", "Root",
  "Weight", "Consensus", "Incentive", "Miner", "Block",
];
const LAST = [
  "Whale", "Maxi", "Seeker", "Dave", "Owl", "Max", "Savant", "Lord", "Dealer",
  "Bob", "Nomad", "Vera", "Tina", "Emma", "Sensei", "Ryan", "Watcher", "Carl",
  "Ivy", "Mike",
];

const NODE_COUNT = 140;

function makeNodes(): ApiNode[] {
  return Array.from({ length: NODE_COUNT }, (_, i): ApiNode => {
    const first = FIRST[i % FIRST.length];
    // Shift the surname index each full cycle so display names stay varied.
    const last = LAST[(i * 7 + Math.floor(i / LAST.length)) % LAST.length];
    return {
      id: `graph-${String(i + 1).padStart(3, "0")}`,
      username: `${first}${last}${i}`.toLowerCase(),
      displayName: `${first} ${last}`,
      avatarUrl: tweetAvatar(i),
      // Decreasing rank so the first nodes read as the network's hubs.
      pageRank: +(0.001 + (NODE_COUNT - i) / NODE_COUNT).toFixed(4),
    };
  });
}

function makeLinks(nodes: ApiNode[]): ApiLink[] {
  const links: ApiLink[] = [];
  const seen = new Set<string>();
  const add = (a: number, b: number) => {
    if (a === b) return;
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (seen.has(key)) return;
    seen.add(key);
    links.push({ source: nodes[a].id, target: nodes[b].id });
  };

  for (let i = 1; i < nodes.length; i++) {
    const degree = 1 + (i % 3); // 1..3 outgoing links per node
    for (let c = 0; c < degree; c++) {
      const hash = (i * 2654435761 + c * 40503) >>> 0;
      // Square the [0, i) pick to bias toward low indices (hubs) — preferential
      // attachment, which gives the graph a handful of dense centers.
      const target = Math.floor(((hash % i) ** 2) / i);
      add(i, target);
    }
  }

  return links;
}

export function graphData(): { nodes: ApiNode[]; links: ApiLink[] } {
  const nodes = makeNodes();
  return { nodes, links: makeLinks(nodes) };
}
