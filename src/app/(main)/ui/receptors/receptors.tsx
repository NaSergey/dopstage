import { serverFetchClient } from "@/shared/api/server";
import ReceptorsClient from "./receptors-client";
import { ChartDataResponse, DopsDistributionStatsResponse } from "./ui/chart/model/types";

async function fetchSubnetsChartData(): Promise<ChartDataResponse> {
  try {
    const { data, error } = await serverFetchClient.GET("/api/v1/main_page/pool_share_graph", {
      params: { query: { top: "all", timerange: "all" } },
      // Mock build: don't cache SSR fetches, otherwise Next's on-disk data cache
      // serves stale fixtures (survives dev restarts) and edits never show up.
      next: { revalidate: 0 },
    });

    if (error) throw new Error("Failed to fetch subnets chart data");

    return data || [];
  } catch {
    return [];
  }
}

async function fetchGeneralInfoData(): Promise<DopsDistributionStatsResponse | null> {
  try {
    const { data, error } = await serverFetchClient.GET("/api/v1/main_page/dops_distribution_stats", {
      // Mock build: don't cache SSR fetches (see note above).
      next: { revalidate: 0 },
    });

    if (error) throw new Error("Failed to fetch general info data");

    return data || null;
  } catch {
    return null;
  }
}

async function Receptors() {
  const [subnetsChartData, generalInfoData] = await Promise.all([
    fetchSubnetsChartData(),
    fetchGeneralInfoData(),
  ]);

  return (
    <ReceptorsClient
      initialSubnetsChartData={subnetsChartData}
      initialGeneralInfoData={generalInfoData}
    />
  );
}

export default Receptors;
