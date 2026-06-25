import type { ApiComponents } from "@/shared/api/schema";
import {
  MOCK_PROGRAMS,
  MOCK_PROGRAMS_POOL,
} from "@/features/programs-leaderboard-table/mock/mock-data";
import { tweetAvatar } from "./subnet-page-data";

/**
 * Central mock dataset for the standalone (no-backend) build.
 * Reuses the existing leaderboard fixtures and derives the other
 * main-page responses from them so everything stays visually consistent.
 */

type ProgramRow = ApiComponents["ProgramsMainLeaderboardResponse"];
type TopProgram = ApiComponents["TopProgramResponse"];
type TopTweet = ApiComponents["TopTweetResponse"];
type RunningLineItem = ApiComponents["RunningLineItemResponse"];
type PoolShareGraph = ApiComponents["PoolShareGraphResponse"];
type DopsStats = ApiComponents["DopsDistributionStatsResponse"];
type ProgramDopsStats = ApiComponents["ProgramDopsDistributionStatsResponse"];
type ProgramGeneralInfo = ApiComponents["ProgramPageGeneralInfoResponse"];

const ALL_PROGRAMS: ProgramRow[] = [...MOCK_PROGRAMS, ...MOCK_PROGRAMS_POOL];

const DAY = 86_400; // seconds
const nowSec = () => Math.floor(Date.now() / 1000);

/** Re-export so handlers can serve the leaderboard rows directly. */
export const PROGRAMS_LEADERBOARD: ProgramRow[] = MOCK_PROGRAMS;

/** GET /api/v1/main_page/featured_programs -> TopProgramResponse[] */
export const FEATURED_PROGRAMS: TopProgram[] = ALL_PROGRAMS.slice(0, 13).map(
  (p): TopProgram => ({
    program_id: p.program_id,
    program_image_url: p.program_image_url,
    program_name: p.program_name,
    dops_supply_share: p.dops_supply_share,
    median_dops_supply_share: p.median_dops_supply_share,
    daily_dops_supply: p.daily_dops_supply,
    tdd: p.tdd,
    fdv: p.fdv,
    dop_price: p.dop_price,
    reward_rate: p.reward_rate,
  }),
);

/** GET /api/v1/common/running_line -> RunningLineItemResponse[] */
export const RUNNING_LINE: RunningLineItem[] = ALL_PROGRAMS.map(
  (p): RunningLineItem => ({
    program_id: p.program_id,
    is_new: p.is_new,
    icon_url: p.program_image_url,
    program_name: p.program_name,
    dop_price: p.dop_price,
    dop_price_is_up: (p.rank_change ?? 0) >= 0,
    daily_tdd: p.daily_dops_supply,
    fdv: p.fdv,
  }),
);

const SAMPLE_TWEETS = [
  "gm. the dopamine machine never sleeps — another day of pure signal ☀️",
  "just aped into the leaderboard, this reward rate is unreal 📈",
  "the alpha here is criminal. mindshare going parabolic 🚀",
  "consistency streak day 42. the grind compounds.",
  "this is the most engaged community in the space, no cap.",
  "watching TDD climb in real time is genuinely addictive.",
  "verified, solo-mention, sentiment filters — clean farming setup.",
  "fdv looking healthy. early is an understatement.",
];

/** GET /api/v1/main_page/top_tweets -> TopTweetResponse[] */
export const TOP_TWEETS: TopTweet[] = SAMPLE_TWEETS.map((text, i) => {
  const p = ALL_PROGRAMS[i % ALL_PROGRAMS.length];
  return {
    yapper_id: `33333333-0000-0000-0000-0000000000${String(i + 10)}`,
    yapper_image_url: tweetAvatar(i),
    yapper_name: `dopaminer_${i + 1}`,
    yapper_display_name: `Creator ${i + 1}`,
    yapper_dop_score: Math.round((90 - i * 7) * 10) / 10,
    tweet_id: `44444444-0000-0000-0000-0000000000${String(i + 10)}`,
    tweet_timestamp: nowSec() - i * 1800,
    estimated_reward_in_dops: Math.round((520 - i * 41) * 10) / 10,
    yap_text: text,
    program_id: p.program_id,
    program_name: p.program_name,
    program_image_url: p.program_image_url,
    tdd: p.tdd,
    daily_tdd_chart: p.daily_dop_price_chart.map((v) => v * 1_000_000),
  };
});

/** Deterministic PRNG (mulberry32) — stable series per seed, but looks random. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Build a realistic daily TDD series per subnet: a seeded random walk with
 * drift, day-to-day volatility and the occasional spike/dip. Produces a jagged,
 * real-looking chart (not a smooth sine wave). Deterministic per seed so the
 * data stays stable across renders.
 */
function buildHistory(seed: number, days = 60) {
  const start = nowSec() - days * DAY;
  const rand = mulberry32(Math.imul(seed + 1, 2654435761));
  const drift = ((seed % 5) - 2) * 0.005; // slight up/down bias per subnet
  let v = 16_000 + seed * 5_500;

  return Array.from({ length: days }, (_, d) => {
    // Approx-normal noise (sum of uniforms), so most days move a little and
    // some move a lot — the jaggedness that makes it look like a real chart.
    const noise = rand() + rand() + rand() - 1.5;
    let ret = drift + 0.07 * noise;
    if (rand() > 0.9) ret += (rand() - 0.5) * 0.35; // occasional spike/dip
    v = Math.max(1_000, v * (1 + ret));
    return { timestamp: start + d * DAY, daily_tdd: Math.round(v) };
  });
}

/** GET /api/v1/main_page/pool_share_graph -> PoolShareGraphResponse[] */
export const POOL_SHARE_GRAPH: PoolShareGraph[] = ALL_PROGRAMS.slice(0, 10).map(
  (p, i): PoolShareGraph => {
    const history = buildHistory(i + 1);
    return {
      program_id: p.program_id,
      program_name: p.program_name,
      program_image_url: p.program_image_url,
      cumulative_tdd: history.reduce((s, h) => s + h.daily_tdd, 0),
      history,
    };
  },
);

/** GET /api/v1/main_page/dops_distribution_stats -> DopsDistributionStatsResponse */
export const DOPS_DISTRIBUTION_STATS: DopsStats = {
  total_dops_distributed: 184_200_000,
  today_allocation: 1_240_000,
  winner_data: {
    yapper_id: "55555555-0000-0000-0000-000000000001",
    yapper_display_name: "TopCreator",
    yapper_logo_url: "",
    tde: 48_200,
  },
  loser_data: {
    yapper_id: "55555555-0000-0000-0000-000000000002",
    yapper_display_name: "ColdWallet",
    yapper_logo_url: "",
    tde: -12_400,
  },
};

/** GET /api/v1/main_page/dops_distribution_stats/program/{program_id} */
export function programDopsStats(programId: string): ProgramDopsStats {
  const p =
    ALL_PROGRAMS.find((x) => x.program_id === programId) ?? ALL_PROGRAMS[0];
  return {
    program_id: p.program_id,
    program_name: p.program_name,
    program_logo_url: p.program_image_url,
    dop_price: p.dop_price,
    top_yappers_count: p.top_yappers,
    top_yappers_logos_url: [],
    tweets_per_day: Math.round(p.total_tweets / 30),
    daily_tdd: p.daily_dops_supply,
    avg_tweet_dop_score_chart: p.daily_dop_price_chart.map((v) => v * 50),
    daily_dop_score: p.daily_dop_price_chart.map((v) => v * 1000),
    avg_dops_per_user: p.daily_dop_price_chart.map((v) => v * 700),
    avg_daily_tweets: p.daily_dop_price_chart.map((v) => v * 100000),
  };
}

/** GET /api/v1/program_page/{program_id}/header -> ProgramPageGeneralInfoResponse */
export function programHeader(programId: string): ProgramGeneralInfo {
  const p =
    ALL_PROGRAMS.find((x) => x.program_id === programId) ?? ALL_PROGRAMS[0];
  return {
    program_id: p.program_id,
    program_name: p.program_name,
    program_logo_url: p.program_image_url,
    twitter_url: "#",
    website_url: "#",
    description: `${p.program_name} subnet on the App network.`,
    taostats_url: "#",
    fdv: p.fdv,
    tdd: p.tdd,
    has_solo_mention_filter: p.has_solo_mention_filter,
    has_verified_filter: p.has_verified_filter,
    has_sentiment_filter: p.has_sentiment_filter,
    has_media_filter: p.has_media_filter,
    has_shitpost_filter: false,
    has_consistency_streak_multiplier: p.has_consistency_streak_multiplier,
    has_new_author_multiplier: p.has_new_author_multiplier,
    has_decay_factor_multiplier: p.has_decay_factor_multiplier,
    dops_supply_share: p.dops_supply_share,
    median_dops_supply_share: p.median_dops_supply_share,
    daily_dops_supply: p.daily_dops_supply,
    total_tweets: p.total_tweets,
    daily_tdd: p.daily_dops_supply,
    total_dops: p.tdd,
    volume: p.volume,
    avg_dops_per_tweet: p.avg_dops_per_tweet,
    leaderboard_position: p.rank,
    reward_rate: p.reward_rate,
  };
}
