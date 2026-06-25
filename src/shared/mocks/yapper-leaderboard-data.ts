import type { ApiComponents } from "@/shared/api/schema";
import { AVATARS } from "./subnet-page-data";

/**
 * Fixture for the global dopaminers leaderboard
 * (GET /api/v1/yapper_page/yapper/global/leaderboard), shown on
 * /leaderboard?view=dopaminers. A fixed pool of fictional yappers, paginated
 * so the pagination controls work. Filters (program_id / yapper_id) are
 * ignored — the same pool is returned for the offline build.
 */

type Item = ApiComponents["YapperPageLeaderboardItemResponse"];
type Response = ApiComponents["YapperPageLeaderboardResponse"];

const uid = (i: number) =>
  `46000000-0000-0000-0000-${String(i + 1).padStart(12, "0")}`;
const avatar = (i: number) => AVATARS[i % AVATARS.length];

const ADJ = [
  "Crypto", "Tao", "Alpha", "Degen", "Onchain", "Mindshare", "Subnet", "Yap",
  "Cypher", "Neuron", "Validator", "Tensor", "Emission", "Stake", "Root",
  "Weight", "Consensus", "Incentive", "Miner", "Block", "Hash", "Token",
  "Chain", "Vault",
];
const NOUN = [
  "Whale", "Maxi", "Seeker", "Dave", "Owl", "Max", "Savant", "Lord", "Dealer",
  "Bob", "Nomad", "Vera", "Tina", "Emma", "Sensei", "Ryan", "Watcher", "Carl",
  "Ivy", "Mike", "Ace", "Guru", "Ninja", "Pilot",
];

const TOTAL = 48;

const POOL: Item[] = Array.from({ length: TOTAL }, (_, i): Item => {
  const dops = 980_000 - i * 18_500;
  return {
    rank: i + 1,
    rank_change: [0, 1, -1, 2, 0, -2, 3, -1, 1, 0][i % 10],
    yapper_id: uid(i),
    logo_url: avatar(i),
    display_name: ADJ[i % ADJ.length] + NOUN[(i * 7) % NOUN.length],
    dop_score: +(9.6 - i * 0.12).toFixed(2),
    dop_score_change: +(((i % 5) - 2) * 0.18).toFixed(2),
    total_dops: dops,
    tweets_count: 3_200 - i * 48,
    avg_dops_per_tweet: 420 - i * 6,
    active_programs: (i % 9) + 1,
    active_programs_logos_urls: [avatar(i), avatar(i + 3), avatar(i + 6)],
  };
});

/** GET /api/v1/yapper_page/yapper/global/leaderboard */
export function globalYapperLeaderboard(page = 1, limit = 20): Response {
  const start = (page - 1) * limit;
  return {
    leaderboard: POOL.slice(start, start + limit),
    current_yapper: null,
    page_count: Math.ceil(POOL.length / limit),
  };
}
