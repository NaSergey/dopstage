import { serverFetchClient } from "@/shared/api/server";
import { ProgramsYappriceTable } from "./components/programs-leaderboard-table";

interface ProgramsLeaderboardTableServerProps {
  pageSize?: number;
  className?: string;
  showSeeAllButton?: boolean;
}

async function getProgramsLeaderboard(pageSize: number = 20) {
  try {
    const { data, error } = await serverFetchClient.GET(
      "/api/v1/main_page/programs_leaderboard",
      {
        params: {
          query: {
            page: 1,
            limit: pageSize,
          },
        },
        next: { revalidate: 300 }, // 5 minutes
      }
    );
    if (error) {
      console.error("Failed to fetch programs leaderboard:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching programs leaderboard:", error);
    return [];
  }
}

export async function ProgramsLeaderboardTableServer({
  pageSize = 20,
  className = "",
  showSeeAllButton = false,
}: ProgramsLeaderboardTableServerProps) {
  const initialData = await getProgramsLeaderboard(pageSize);

  return (
    <ProgramsYappriceTable
      initialData={initialData}
      pageSize={pageSize}
      className={className}
      showSeeAllButton={showSeeAllButton}
    />
  );
}