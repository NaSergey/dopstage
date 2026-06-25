import type { ApiComponents } from "@/shared/api/schema";
import { AVATARS, tweetAvatar } from "./subnet-page-data";
import { globalYapperLeaderboard } from "./yapper-leaderboard-data";

/**
 * Fixture set for the dopaminer (yapper) detail page (`/dopaminer/[id]`).
 * Every endpoint is keyed off the route id so the page renders fully populated
 * and stays internally consistent across renders. The leaderboard reuses the
 * global dopaminers pool and injects the current yapper so its row highlights.
 */

type Header = ApiComponents["YapperPageHeaderResponse"];
type Achievements = ApiComponents["YapperPageAchievementsResponse"];
type Achievement = ApiComponents["YapperAchievement"];
type Contributions = ApiComponents["YapperPageContributionsResponse"];
type SpiderChart = ApiComponents["YapperPageSpiderChartResponse"];
type Charts = ApiComponents["YapperPageChartsResponse"];
type ActiveProgram = ApiComponents["YapperPageActiveProgramResponse"];
type XFeedItem = ApiComponents["YapperPageXFeedResponse"];
type LeaderboardResponse = ApiComponents["YapperPageLeaderboardResponse"];

const DAY = 86_400; // seconds
const nowSec = () => Math.floor(Date.now() / 1000);

const uid = (prefix: string, i: number) =>
  `${prefix}-0000-0000-0000-${String(i + 1).padStart(12, "0")}`;

/** Stable numeric seed derived from the route id, so a given dopaminer always
 *  renders the same fictional profile. */
const seedFrom = (id: string): number => {
  const s = [...id].reduce((a, c) => a + c.charCodeAt(0) * 31, 7);
  return Math.abs(s);
};

/** [display name, twitter handle] pool of fictional dopaminers. */
const NAMES: [string, string][] = [
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
];

/** Subnet [name, logo] pairs reusing the local subnet logos. */
const SUBNETS: [string, string][] = [
  ["Apex", "/subnets/apex.png"],
  ["Targon", "/subnets/targon.png"],
  ["Kaito", "/subnets/kaito.png"],
  ["Cortex.t", "/subnets/cortext.jpg"],
  ["Nineteen", "/subnets/nineteen.png"],
  ["Omega", "/subnets/omega.png"],
  ["BitMind", "/subnets/bitmind.png"],
  ["Taoshi", "/subnets/taoshi.png"],
  ["Dojo", "/subnets/dojo.jpg"],
  ["NASChain", "/subnets/naschain.png"],
  ["Autoppia", "/subnets/autoppia.png"],
  ["Condense", "/subnets/condense.png"],
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

/** Smoothly trending series with a gentle sine wiggle, for sparklines/charts. */
const wave = (base: number, amp: number, n = 14, phase = 0): number[] =>
  Array.from({ length: n }, (_, i) => {
    const v =
      base + amp * Math.sin((i / n) * Math.PI * 2 + phase) + (base * 0.18 * i) / n;
    return +v.toFixed(base < 1 ? 4 : 2);
  });

/** GET /api/v1/yapper_page/yapper/{yapper_id}/header */
export function yapperHeader(yapperId: string): Header {
  const seed = seedFrom(yapperId);
  const [name, handle] = NAMES[seed % NAMES.length];
  return {
    yapper_id: yapperId,
    display_name: name,
    twitter_handle: handle,
    logo_url: tweetAvatar(seed),
    is_authenticated: seed % 4 !== 0,
    twitter_link: "#",
    dop_score: 6_200 + (seed % 3_800),
    total_tweets: 1_240 + (seed % 2_600),
    avg_dop_price: 180 + (seed % 220),
    leaderboard_position: (seed % 180) + 1,
    total_dops: 1_200_000 + (seed % 40) * 21_500,
    engagement: +(0.045 + (seed % 40) / 1_000).toFixed(4),
    avg_tweet_price: 210 + (seed % 320),
  };
}

/** GET /api/v1/yapper_page/yapper/{yapper_id}/achievements */
export function yapperAchievements(yapperId: string): Achievements {
  const seed = seedFrom(yapperId);
  const now = nowSec();

  // name → [obtained, currentRank, maxRank] tuned so most icons light up.
  const config: [string, number, string][] = [
    ["og", 1, "OG"],
    ["dop enthusiast", 3, "L3"],
    ["first tweet", 1, "Done"],
    ["connect twitter", 1, "Linked"],
    ["resilient", 1, "Done"],
    ["consistency streak", 2, "30 days"],
    ["dop collector", 2, "5M"],
    ["top earner", 3, "1k"],
    ["claim champion", 2, "100"],
    ["program participant", 3, "30"],
    ["tweet volume", 4, "100"],
    ["program leaderboard", 3, "Top 10"],
    ["mystery", 1, "?"],
  ];

  const achievements: Achievement[] = config.map(
    ([name, rank, label], i): Achievement => {
      // Leave a couple locked for variety, deterministically per dopaminer.
      const is_obtained = (seed + i) % 7 !== 0;
      return {
        achievement_config_id: uid("48000000", i),
        name,
        description: `${label} tier reached for the ${name} achievement.`,
        current_rank: rank,
        max_rank: 4,
        rank_label: label,
        icon_url: "",
        is_obtained,
        timestamp: now - (i + 1) * 9 * DAY,
      };
    },
  );

  return { yapper_id: yapperId, achievements };
}

/** GET /api/v1/yapper_page/yapper/{yapper_id}/contributions */
export function yapperContributions(yapperId: string): Contributions {
  const seed = seedFrom(yapperId);
  const DAYS = 119; // ~17 weeks of heatmap cells
  const now = nowSec();
  let max = 0;

  const contributions = Array.from({ length: DAYS }, (_, i) => {
    const ts = now - (DAYS - 1 - i) * DAY;
    // Pseudo-random but stable count; some days empty for realistic gaps.
    const n = (seed + i * 13) % 11;
    const tweets = n <= 3 ? 0 : n - 3; // 0..7
    if (tweets > max) max = tweets;
    return {
      timestamp: ts,
      day_of_week: new Date(ts * 1000).getUTCDay(),
      tweets_count: tweets,
    };
  });

  return {
    yapper_id: yapperId,
    contributions,
    max_contributions_in_period: max || 1,
  };
}

/** GET /api/v1/yapper_page/yapper/{yapper_id}/spiderchart */
export function yapperSpiderChart(yapperId: string): SpiderChart {
  const seed = seedFrom(yapperId);
  const v = (offset: number, min = 35, span = 60) =>
    min + ((seed + offset) % span);
  return {
    yapper_id: yapperId,
    smart: v(11),
    alpha_hunter: v(23),
    shitpost: v(31),
    creative: v(47),
    engagement: v(59),
    bullish: v(67),
    bearish: v(73),
  };
}

/** GET /api/v1/yapper_page/yapper/{yapper_id}/charts */
export function yapperCharts(yapperId: string): Charts {
  const seed = seedFrom(yapperId);
  const now = nowSec();
  const n = 14;
  const daily = wave(3_400 + (seed % 1_800), 480, n, (seed % 6) / 2);

  return {
    yapper_id: yapperId,
    avg_dops_per_day: daily.map((value, i) => ({
      date: new Date((now - (n - 1 - i) * DAY) * 1000)
        .toISOString()
        .slice(0, 10),
      value,
    })),
    avg_dops_per_day_change: +(((seed % 30) - 8) / 100).toFixed(3),
    moving_tweet_price: wave(220 + (seed % 160), 42, n, (seed % 5) / 2),
    moving_tweet_price_change: +(((seed % 26) - 6) / 100).toFixed(3),
  };
}

/** GET /api/v1/yapper_page/yapper/{yapper_id}/active_programs */
export function yapperActivePrograms(
  yapperId: string,
  page = 1,
  limit = 20,
): ActiveProgram[] {
  if (page > 1) return []; // single page of results
  const seed = seedFrom(yapperId);
  const count = 8 + (seed % 4); // 8..11 (< limit, so no extra page)

  return Array.from({ length: Math.min(count, limit) }, (_, i): ActiveProgram => {
    const [name, logo] = SUBNETS[(seed + i) % SUBNETS.length];
    const base = 140_000 - i * 11_000;
    return {
      rank: i + 1,
      program_id: uid("47000000", i),
      program_name: name,
      program_logo_url: logo,
      tdd: base,
      fdv: 2_400_000 - i * 120_000,
      dops: Math.round(base * 0.32),
      dop_price: +(0.092 - i * 0.004).toFixed(4),
      streak_in_program: (seed + i) % 14,
      streak_multiplier_in_program: +(1 + ((seed + i) % 5) * 0.1).toFixed(1),
      tweets_in_program: 320 - i * 22,
      dops_supply_share: +(0.12 - i * 0.008).toFixed(4),
      median_dops_supply_share: +(0.06 - i * 0.003).toFixed(4),
      daily_dops_supply: 9_600 - i * 540,
      page_count: 1,
      reward_rate: +(0.92 - i * 0.06).toFixed(2),
    };
  });
}

/** GET /api/v1/yapper_page/yapper/{yapper_id}/xfeed */
export function yapperXFeed(
  yapperId: string,
  page = 1,
  limit = 20,
): XFeedItem[] {
  if (page > 1) return []; // single page of results
  const seed = seedFrom(yapperId);
  const now = nowSec();
  const count = 16; // < limit, so getNextPageParam stops

  return Array.from({ length: Math.min(count, limit) }, (_, i): XFeedItem => {
    const [name, logo] = SUBNETS[(seed + i) % SUBNETS.length];
    const collecting = i % 6 === 5; // a few rows still "Collecting"
    return {
      tweet_id: uid("47500000", i),
      timestamp: now - i * 5_400,
      estimated_reward_in_dops: Math.round(1_900 - i * 78),
      program_id: uid("47000000", i % SUBNETS.length),
      program_name: name,
      program_logo_url: logo,
      engagement: collecting ? null : +(0.085 - i * 0.003).toFixed(4),
      reach: collecting ? null : 42_000 - i * 1_900,
      text: TWEETS[(seed + i) % TWEETS.length],
      page_count: 1,
    };
  });
}

/** GET /api/v1/yapper_page/yapper/leaderboard */
export function yapperLeaderboard(
  yapperId: string,
  page = 1,
  limit = 20,
): LeaderboardResponse {
  // Reuse the global dopaminers pool, then surface the current yapper on the
  // first page so its row is highlighted on the dopaminer page.
  const res = globalYapperLeaderboard(page, limit);
  const leaderboard = res.leaderboard.map((item) => ({ ...item }));

  if (page === 1 && leaderboard.length > 0) {
    const seed = seedFrom(yapperId);
    const [name] = NAMES[seed % NAMES.length];
    const idx = Math.min(6, leaderboard.length - 1);
    leaderboard[idx] = {
      ...leaderboard[idx],
      yapper_id: yapperId,
      display_name: name,
      logo_url: tweetAvatar(seed),
      active_programs_logos_urls: [
        AVATARS[seed % AVATARS.length],
        AVATARS[(seed + 3) % AVATARS.length],
        AVATARS[(seed + 6) % AVATARS.length],
      ],
    };
  }

  return { ...res, leaderboard };
}
