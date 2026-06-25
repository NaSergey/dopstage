import { http, HttpResponse } from "msw";
import {
  PROGRAMS_LEADERBOARD,
  FEATURED_PROGRAMS,
  TOP_TWEETS,
  RUNNING_LINE,
  POOL_SHARE_GRAPH,
  DOPS_DISTRIBUTION_STATS,
  programDopsStats,
  programHeader,
} from "./mock-data";
import {
  subnetLeaderboard,
  subnetFeed,
  subnetDailyStats,
  subnetChart,
  subnetTradingHeader,
  subnetTopTweets,
  subnetYapperStats,
} from "./subnet-page-data";
import { globalYapperLeaderboard } from "./yapper-leaderboard-data";
import { graphData } from "./graph-data";
import {
  yapperHeader,
  yapperAchievements,
  yapperContributions,
  yapperSpiderChart,
  yapperCharts,
  yapperActivePrograms,
  yapperXFeed,
  yapperLeaderboard,
} from "./dopaminer-page-data";

/**
 * MSW request handlers. Patterns use a leading `*` so they match regardless of
 * the configured API origin (NEXT_PUBLIC_API_URL), on both client and server.
 *
 * Main-page endpoints return rich fixtures; every other `/api/*` call falls
 * through to a catch-all that returns an empty list, so the app stays fully
 * offline and other routes degrade to their empty states instead of erroring.
 */
export const handlers = [
  // --- Main page ---------------------------------------------------------
  http.get("*/api/v1/main_page/programs_leaderboard", () =>
    HttpResponse.json(PROGRAMS_LEADERBOARD),
  ),

  http.get("*/api/v1/main_page/featured_programs", () =>
    HttpResponse.json(FEATURED_PROGRAMS),
  ),

  http.get("*/api/v1/main_page/top_tweets", () =>
    HttpResponse.json(TOP_TWEETS),
  ),

  http.get("*/api/v1/common/running_line", () =>
    HttpResponse.json(RUNNING_LINE),
  ),

  http.get("*/api/v1/main_page/pool_share_graph", () =>
    HttpResponse.json(POOL_SHARE_GRAPH),
  ),

  http.get(
    "*/api/v1/main_page/dops_distribution_stats/program/:program_id",
    ({ params }) =>
      HttpResponse.json(programDopsStats(String(params.program_id))),
  ),

  http.get("*/api/v1/main_page/dops_distribution_stats", () =>
    HttpResponse.json(DOPS_DISTRIBUTION_STATS),
  ),

  // Header search dropdown — no results in the offline build.
  http.get("*/api/v1/common/search", () => HttpResponse.json([])),

  // Social graph page.
  http.get("*/api/v1/common/graph_data", () => HttpResponse.json(graphData())),

  // --- Subnet page -------------------------------------------------------
  // One shared fixture set, served for every subnet id, so each detail page
  // renders fully populated. The header stays id-specific (logo + name).
  http.get("*/api/v1/program_page/:program_id/header", ({ params }) =>
    HttpResponse.json(programHeader(String(params.program_id))),
  ),

  http.get("*/api/v1/program_page/:program_id/leaderboard", ({ request }) => {
    const page = Number(new URL(request.url).searchParams.get("page") ?? 1);
    return HttpResponse.json(page > 1 ? [] : subnetLeaderboard());
  }),

  http.get("*/api/v1/program_page/:program_id/feed", ({ params, request }) => {
    const page = Number(new URL(request.url).searchParams.get("page") ?? 1);
    return HttpResponse.json(
      page > 1 ? [] : subnetFeed(String(params.program_id)),
    );
  }),

  http.get("*/api/v1/program_page/:program_id/top_tweets", () =>
    HttpResponse.json(subnetTopTweets()),
  ),

  http.get("*/api/v1/program_page/:program_id/daily_stats", () =>
    HttpResponse.json(subnetDailyStats()),
  ),

  http.get("*/api/v1/program_page/:program_id/trading_view_chart", ({ params }) =>
    HttpResponse.json(subnetChart(String(params.program_id))),
  ),

  http.get(
    "*/api/v1/program_page/:program_id/trading_view_header",
    ({ params }) =>
      HttpResponse.json(subnetTradingHeader(String(params.program_id))),
  ),

  http.get(
    "*/api/v1/program_page/:program_id/yapper/:twitter_handle/stats",
    ({ params }) =>
      HttpResponse.json(subnetYapperStats(String(params.twitter_handle))),
  ),

  // --- Leaderboard page (dopaminers view) --------------------------------
  http.get("*/api/v1/yapper_page/yapper/global/leaderboard", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 1);
    const limit = Number(url.searchParams.get("limit") ?? 20);
    return HttpResponse.json(globalYapperLeaderboard(page, limit));
  }),

  // --- Creator (yapper) page ---------------------------------------------
  // One shared fixture set keyed off the route id so every dopaminer page
  // renders fully populated. The `yapper/leaderboard` route is matched before
  // the id-scoped routes below (different path shape, so no conflict).
  http.get("*/api/v1/yapper_page/yapper/leaderboard", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 1);
    const limit = Number(url.searchParams.get("limit") ?? 20);
    const yapperId = url.searchParams.get("yapper_id") ?? "";
    return HttpResponse.json(yapperLeaderboard(yapperId, page, limit));
  }),

  http.get("*/api/v1/yapper_page/yapper/:yapper_id/header", ({ params }) =>
    HttpResponse.json(yapperHeader(String(params.yapper_id))),
  ),

  http.get("*/api/v1/yapper_page/yapper/:yapper_id/achievements", ({ params }) =>
    HttpResponse.json(yapperAchievements(String(params.yapper_id))),
  ),

  http.get(
    "*/api/v1/yapper_page/yapper/:yapper_id/contributions",
    ({ params }) =>
      HttpResponse.json(yapperContributions(String(params.yapper_id))),
  ),

  http.get("*/api/v1/yapper_page/yapper/:yapper_id/spiderchart", ({ params }) =>
    HttpResponse.json(yapperSpiderChart(String(params.yapper_id))),
  ),

  http.get("*/api/v1/yapper_page/yapper/:yapper_id/charts", ({ params }) =>
    HttpResponse.json(yapperCharts(String(params.yapper_id))),
  ),

  http.get(
    "*/api/v1/yapper_page/yapper/:yapper_id/active_programs",
    ({ params, request }) => {
      const page = Number(new URL(request.url).searchParams.get("page") ?? 1);
      return HttpResponse.json(
        yapperActivePrograms(String(params.yapper_id), page),
      );
    },
  ),

  http.get(
    "*/api/v1/yapper_page/yapper/:yapper_id/xfeed",
    ({ params, request }) => {
      const page = Number(new URL(request.url).searchParams.get("page") ?? 1);
      return HttpResponse.json(yapperXFeed(String(params.yapper_id), page));
    },
  ),

  // --- Catch-all ---------------------------------------------------------
  // Any other API call (subnet / dopaminer / leaderboard sub-pages) returns
  // an empty list so the UI shows its "No data" state without hitting the net.
  http.get("*/api/*", () => HttpResponse.json([])),
];
