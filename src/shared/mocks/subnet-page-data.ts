import type { ApiComponents } from "@/shared/api/schema";

/**
 * One shared fixture set for the subnet detail page (`/subnet/[id]`).
 * The same dataset is served for every subnet id so each page renders fully
 * populated (leaderboard, X feed, chart, daily stats, top tweets, dopaminer
 * check). The header endpoint stays id-specific — see programHeader in
 * ./mock-data.ts.
 */

type Leaderboard = ApiComponents["ProgramYappersLeaderboardItemResponse"];
type FeedItem = ApiComponents["ProgramXFeedItemResponse"];
type DailyStats = ApiComponents["ProgramDailyStatsResponse"];
type TVChart = ApiComponents["TradingViewChartResponse"];
type TVHeader = ApiComponents["TradingViewHeaderResponse"];
type TopTweet = ApiComponents["ProgramTopTweetsResponse"];
type YapperStats = ApiComponents["YapperStatsInProgramResponse"];
type Rating = ApiComponents["Rating"];

const nowSec = () => Math.floor(Date.now() / 1000);

/** Deterministic uuid-like id so rows stay stable across renders. */
const uid = (prefix: string, i: number) =>
  `${prefix}-0000-0000-0000-${String(i + 1).padStart(12, "0")}`;

/** Reuse the local subnet logos as varied, offline avatar placeholders. */
export const AVATARS = [
  "/subnets/apex.png",
  "/subnets/targon.png",
  "/subnets/kaito.png",
  "/subnets/cortext.jpg",
  "/subnets/nineteen.png",
  "/subnets/omega.png",
  "/subnets/bitmind.png",
  "/subnets/taoshi.png",
  "/subnets/dojo.jpg",
  "/subnets/naschain.png",
  "/subnets/autoppia.png",
  "/subnets/condense.png",
  "/subnets/chunking.jpg",
  "/subnets/infinitegames.jpg",
];
const avatar = (i: number) => AVATARS[((i % AVATARS.length) + AVATARS.length) % AVATARS.length];

/** Author profile pictures for tweets — distinct from the subnet logos. */
export const TWEET_AVATARS = Array.from(
  { length: 16 },
  (_, i) => `/avatars/avatar-${String(i + 1).padStart(2, "0")}.png`,
);
export const tweetAvatar = (i: number) =>
  TWEET_AVATARS[((i % TWEET_AVATARS.length) + TWEET_AVATARS.length) % TWEET_AVATARS.length];

/** [display name, twitter handle] pool of fictional dopaminers. */
const YAPPERS: [string, string][] = [
  ["CryptoWhale", "cryptowhale"],
  ["TaoMaximalist", "taomaxi"],
  ["AlphaSeeker", "alphaseeker"],
  ["DegenDave", "degendave"],
  ["OnchainOwl", "onchainowl"],
  ["MindshareMax", "mindsharemax"],
  ["SubnetSavant", "subnetsavant"],
  ["YapLord", "yaplord"],
  ["DopamineDealer", "dopaminedealer"],
  ["BittensorBob", "bittensorbob"],
  ["NeuronNomad", "neuronnomad"],
  ["ValidatorVera", "validatorvera"],
  ["TensorTina", "tensortina"],
  ["EmissionEmma", "emissionemma"],
  ["StakeSensei", "stakesensei"],
  ["RootnetRyan", "rootnetryan"],
  ["WeightWatcher", "weightwatcher"],
  ["ConsensusCarl", "consensuscarl"],
  ["IncentiveIvy", "incentiveivy"],
  ["MinerMike", "minermike"],
];

const TWEETS = [
  "Just bridged into this subnet and the mindshare rewards are insane right now 🚀",
  "The emission curve on this one is criminally underrated. Accumulating.",
  "GM dopaminers — another day, another DScore grind. Who's yapping with me?",
  "This subnet's validator set is the most decentralized I've seen on Bittensor.",
  "Tweet price keeps climbing. Early movers are eating well here.",
  "Hot take: pool share matters more than raw dops once you're top 20.",
  "Loaded up more TAO to delegate. Conviction play, not financial advice.",
  "The team shipped again. Roadmap is actually being executed for once.",
  "If you're not tracking daily DScore you're leaving rewards on the table.",
  "Mindshare flipped green this week. Sentiment is shifting fast 📈",
  "Reminder: consistency beats intensity. Yap every day, stack every day.",
  "This is the kind of subnet that makes dTAO interesting again.",
];

const RATINGS: Rating[] = ["whale", "dolphin", "fish", "shrimp", "plankton"];

const PAGE_SIZE = 20;

/** Smoothly trending series with a gentle sine wiggle, for sparklines/charts. */
const wave = (base: number, amp: number, n = 14, phase = 0): number[] =>
  Array.from({ length: n }, (_, i) => {
    const v =
      base + amp * Math.sin((i / n) * Math.PI * 2 + phase) + (base * 0.18 * i) / n;
    return +v.toFixed(base < 1 ? 4 : 2);
  });

/** GET /api/v1/program_page/{program_id}/leaderboard */
export function subnetLeaderboard(): Leaderboard[] {
  return YAPPERS.slice(0, 18).map((y, i): Leaderboard => {
    const base = 52_000 - i * 2_400;
    return {
      yapper_id: uid("44444444", i),
      username: y[0],
      avatar_url: avatar(i),
      rank: i + 1,
      rank_change: [0, 1, -1, 2, 0, -2, 1, 0, 3, -1][i % 10],
      is_new: i % 7 === 3,
      total_dops: base,
      total_dop_score: Math.round(base * 0.42),
      pool_share: +(0.16 - i * 0.0075).toFixed(4),
      page_count: 1,
    };
  });
}

/** GET /api/v1/program_page/{program_id}/feed */
export function subnetFeed(programId: string): FeedItem[] {
  const now = nowSec();
  return YAPPERS.slice(0, 18).map((y, i): FeedItem => ({
    tweet_id: uid("45000000", i),
    program_id: programId,
    program_name: "Subnet",
    avatar_url: avatar(i + 2),
    username: y[0],
    twitter_handle: y[1],
    user_id: uid("44444444", i),
    user_twitter_link: "#",
    tweet_link: "#",
    passed_solo_mention_filter: i % 5 === 0 ? false : true,
    passed_verified_filter: true,
    passed_sentiment_filter: i % 6 === 2 ? false : true,
    passed_media_filter: i % 4 === 1 ? null : true,
    passed_shitpost_filter: true,
    dop_score: +(9.2 - i * 0.3).toFixed(2),
    estimated_reward_in_dops: Math.round(1_800 - i * 70),
    mindshare: +(0.085 - i * 0.004).toFixed(4),
    yap_text: TWEETS[i % TWEETS.length],
    tweet_timestamp: now - i * 1_800,
    rating: RATINGS[i % RATINGS.length],
    page_count: 1,
  }));
}

/** GET /api/v1/program_page/{program_id}/daily_stats */
export function subnetDailyStats(): DailyStats {
  return {
    avg_tweet_dop_score_chart: wave(4.1, 0.6),
    avg_dops_per_user_chart: wave(58, 9, 14, 0.6),
    daily_tdd_chart: wave(132_000, 14_000, 14, 1.1),
    daily_dop_score_chart: wave(1_320_000, 120_000, 14, 0.3),
    avg_daily_tweets_chart: wave(2_900, 320, 14, 2.0),
    engagement_chart: wave(0.067, 0.012, 14, 1.5),
  };
}

/** GET /api/v1/program_page/{program_id}/trading_view_chart */
export function subnetChart(programId: string): TVChart {
  const n = 72;
  const now = nowSec();
  return {
    program_id: programId,
    timestamps: Array.from({ length: n }, (_, i) => now - (n - 1 - i) * 3_600),
    dop_prices: Array.from({ length: n }, (_, i) => {
      const trend = 0.062 + (0.024 * i) / n;
      const wiggle = 0.006 * Math.sin((i / n) * Math.PI * 6);
      return +(trend + wiggle).toFixed(5);
    }),
  };
}

/** GET /api/v1/program_page/{program_id}/trading_view_header */
export function subnetTradingHeader(programId: string): TVHeader {
  return {
    program_id: programId,
    dop_price: 0.0842,
    dop_price_delta: 0.037,
    ath_token_price: 0.142,
    ath_token_price_delta: -0.118,
    total_dop_score_volume: 3_240_000,
    avg_dops_per_dop_score: 320,
  };
}

/** GET /api/v1/program_page/{program_id}/top_tweets */
export function subnetTopTweets(): TopTweet[] {
  const now = nowSec();
  return YAPPERS.slice(0, 12).map((y, i): TopTweet => ({
    yapper_id: uid("44444444", i),
    yapper_display_name: y[0],
    yapper_logo_url: tweetAvatar(i),
    dop_score: +(9.5 - i * 0.4).toFixed(1),
    estimate_dops: Math.round(2_200 - i * 130),
    tweet_timestamp: now - i * 3_600,
    tweet_text: TWEETS[i % TWEETS.length],
    tweet_url: "#",
    is_authenticated: i % 3 !== 2,
  }));
}

/** GET /api/v1/program_page/{program_id}/yapper/{twitter_handle}/stats */
export function subnetYapperStats(twitterHandle: string): YapperStats {
  const h = twitterHandle.replace(/^@/, "") || "dopaminer";
  const seed = [...h].reduce((a, c) => a + c.charCodeAt(0), 0);
  const known = YAPPERS.find((y) => y[1] === h.toLowerCase());
  return {
    yapper_id: uid("44444444", seed % 18),
    avatar_url: avatar(seed),
    username: known ? known[0] : h,
    twitter_handle: h,
    twitter_url: "#",
    is_verified: seed % 2 === 0,
    total_dops: 12_000 + ((seed * 37) % 40_000),
    leaderboard_position: (seed % 200) + 1,
    avg_dops_per_tweet_chart: wave(180, 36, 14, (seed % 6) / 2),
    total_dop_score: 8_400 + ((seed * 53) % 26_000),
    pool_share: +(((seed % 90) + 5) / 1_000).toFixed(4),
    tweet_frequency: (seed % 18) + 3,
    total_tweets: 240 + ((seed * 7) % 2_600),
  };
}

export { PAGE_SIZE };
